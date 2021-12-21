const Controller = require("../controllers/controller");
let express = require("express");
const { userAut, roomUser, errorHandler } = require("../middleware/middleware");

let router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res
      .status(200)
      .json(
        "Welcome to Rakamin Academy for list API please go to: https://github.com/fao30/Rakamin "
      );
  } catch (err) {
    res.status(400);
  }
});
router.post("/register", Controller.register);
router.post("/login", Controller.login);

router.get("/getroom", userAut, Controller.getRooms);
router.get("/getchat/:roomid", userAut, Controller.getChat);
router.post("/sendchat/:roomid", userAut, roomUser, Controller.sendChat);
router.post("/createroom/:room_mate_id", userAut, Controller.createroom);
router.use(errorHandler);

module.exports = router;
