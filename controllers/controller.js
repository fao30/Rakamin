const { User, Chat, Room } = require("../models");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { passHelper, jwtHelper } = require("../helper/helper");

class Controller {
  static async register(req, res, next) {
    try {
      //   console.log(req);
      const { name, email, password } = req.body;
      let obj = {
        name,
        email,
        password: passHelper.hashPassword(password),
      };
      console.log(obj);
      let response = await User.create(obj);
      if (response) {
        res.status(201).json({
          id: response.id,
          name: response.name,
          email: response.email,
        });
      }
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        res.status(400).json({
          statusCode: 400,
          error: `Email dan username sudah terdaftar`,
        });
      } else if (err.name === "SequelizeValidationError") {
        const error = err.errors.map((el) => el.message);
        res.status(400).json({ statusCode: 400, error: error[0] });
      } else {
        res.status(500).json({ message: err });
      }
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      let user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (user && passHelper.checkPass(password, user.password)) {
        let tokenPayload = { id: user.id, email: user.email, role: user.role };
        let access_token = jwtHelper.signPl(tokenPayload);

        res.status(200).json({
          email: user.email,
          access_token: access_token,
        });
      } else {
        throw { name: "unauthorized", message: "You dont have an access" };
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getRooms(req, res, next) {
    try {
      // console.log(req);
      const response = await Room.findAll({
        where: {
          id_user: req.user.id,
        },
      });

      if (!response) {
        throw { name: "notFound", message: "Room Not Found" };
      } else {
        res.status(200).json(response);
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async getChat(req, res, next) {
    try {
      const response = await Chat.findAll({
        include: [
          {
            model: User,
            attributes: {
              exclude: ["id", "createdAt", "updatedAt", "password", "email"],
            },
          },
        ],
        where: {
          id_room: req.params.roomid,
        },
        attributes: {
          exclude: ["id_user", "createdAt", "updatedAt"],
        },
        order: [["id", "DESC"]],
      });
      if (!response) {
        throw { name: "notFound", message: "Room Not Found" };
      } else {
        res.status(200).json(response);
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async sendChat(req, res, next) {
    try {
      let obj = {
        message: req.body.message,
        id_room: req.params.roomid,
        id_user: req.user.id,
      };
      const response = await Chat.create(obj);
      if (!response) {
        throw { name: "notFound", message: "Room Not Found" };
      } else {
        const response1 = await Chat.findAll({
          include: [
            {
              model: User,
              attributes: {
                exclude: ["id", "createdAt", "updatedAt", "password", "email"],
              },
            },
          ],
          where: {
            id_room: req.params.roomid,
          },
          attributes: {
            exclude: ["id_user", "createdAt", "updatedAt"],
          },
          order: [["id", "DESC"]],
        });
        res.status(200).json(response1);
      }
    } catch (err) {
      console.log(err);
    }
  }
  static async createroom(req, res, next) {
    try {
      const response = await Room.findAll({
        where: {
          id_user: req.user.id,
        },
      });
      let roomList = [];
      response.map((e) => {
        roomList.push(e.id_room);
      });
      const response1 = await Room.findAll({
        where: {
          id_room: roomList,
        },
      });
      // console.log(roomList);
      let hasRoom = response1.filter(
        (e) => e.id_user == req.params.room_mate_id
      );
      if (hasRoom.length > 0) {
        throw {
          name: "badRequest",
          message: `Room has been created with person with id ${req.params.room_mate_id}`,
        };
      }
      const lastRoom = await Room.findAll({ order: [["id_room", "DESC"]] });
      // console.log(lastRoom[0].id_room + 1);
      let obj = {
        id_room: lastRoom[0].id_room + 1,
        id_user: +req.params.room_mate_id,
      };
      let obj1 = {
        id_room: lastRoom[0].id_room + 1,
        id_user: req.user.id,
      };
      const makeRoom = await Room.bulkCreate([obj, obj1]);
      let textOutput = `Room id number ${obj.id_room} has been created beetwen user ${req.params.room_mate_id} & ${req.user.id}`;

      res.status(200).json(textOutput);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
