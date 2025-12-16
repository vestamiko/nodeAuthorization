const jwt = require("jsonwebtoken");
const User = require("../..model/User.js");
/// cia bus user modelis

const NOT_AUTHORIZED = "User not authorized";
const NOT_AUTHORIZED_NO_TOKEN = "User not authorized, token not found";

async function getUser(req) {
  if (
    req.header.authorization &&
    req.header.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.header.authorization.split(" ")[1]; ///grazina pilna authorization

      if (!token) {
        return { status: 403, response: NOT_AUTHORIZED_NO_TOKEN };
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      return { status: 200, response: user };
    } catch (err) {
      console.log(err);
      return { status: 401, response: NOT_AUTHORIZED };
    }
  }
  return { status: 401, response: NOT_AUTHORIZED };
}

module.exports = { getUser, notAthorizedMessage: NOT_AUTHORIZED };
