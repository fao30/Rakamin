const jwt = require("jsonwebtoken");
const { Room, User } = require("../models");

let userAut = async (req, res, next) => {
  try {
    let { access_token } = req.headers;
    if (!access_token) {
      throw { name: "unauthorized", message: "You are unauthorized" };
    }
    const payload = jwt.verify(access_token, "fao");
    const response = await User.findByPk(payload.id);

    if (!response) {
      throw { name: "unauthorized", message: "You are unauthorized" };
    }
    req.user = {
      id: response.id,
      name: response.name,
      email: response.email,
    };

    next();
  } catch (err) {
    if (err.name === "unauthorized") {
      next(err);
    }
  }
};

let roomUser = async (req, res, next) => {
  try {
    const resp = await Room.findAll({
      where: { id_room: req.params.roomid },
    });

    if (resp[0].id_user != req.user.id && resp[1].id_user != req.user.id) {
      throw {
        name: "forbidden",
        message: `You are forrbiden to send message to room ${req.params.roomid}`,
      };
    }
    next();
  } catch (err) {
    console.log(err.name);
    if (err.name === "forbidden") {
      next(err);
    }
  }
};

let errorHandler = (err, req, res, next) => {
  let status;
  let message;
  console.log("MASUK SINI");

  switch (err.name) {
    case "SequelizeValidationError":
      status = 400;
      message = err.errors[0].message;
      break;
    case "SequelizeValidationError":
      status = 400;
      message = err.errors[0].message;
      break;
    case "notFound":
      status = 404;
      message = err.message;
      break;
    case "unauthorized":
      status = 401;
      message = err.message;
      break;
    case "forbidden":
      status = 403;
      message = err.message;
      break;
    case "badRequest":
      status = 400;
      message = err.message;
      break;
    case "InternalServerError":
      status = 500;
      message = err.message;
      break;
  }
  res.status(status).json({ message });
};

module.exports = {
  userAut,
  errorHandler,
  roomUser,
};
