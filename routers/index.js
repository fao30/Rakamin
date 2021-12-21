const Controller = require("../controllers/controller");
let express = require("express");
const { userAut } = require("../middleware/middleware");

let router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res.status(200).json("Welcome to Rakamin Academy");
  } catch (err) {
    res.status(400);
  }
});
router.post("/register", Controller.register);
router.post("/login", Controller.login);

router.get("/getroom", userAut, Controller.getRooms); //making

module.exports = router;
