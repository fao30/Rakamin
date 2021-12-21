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
      next(error);
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
      // res.status(401).json(response);
    }
  }
}

module.exports = Controller;
