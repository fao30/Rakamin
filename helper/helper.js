const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class jwtHelper {
  static verifyAt(access_token) {
    return jwt.verify(access_token, "fao");
  }
  static signPl(payload) {
    return jwt.sign(payload, "fao");
  }
}

class passHelper {
  static checkPass(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
  static hashPassword(pass) {
    let salt = bcrypt.genSaltSync(8);
    let hash = bcrypt.hashSync(pass, salt);
    return hash;
  }
}

module.exports = {
  passHelper,
  jwtHelper,
};
