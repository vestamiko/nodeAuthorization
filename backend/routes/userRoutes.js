const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getOneUser } = require("../controller/userControllers.js");


// http://localhost:8000/users/register
router.post("/register", registerUser);
// http://localhost:8000/users/login
router.post("/login", loginUser);
// http://localhost:8000/users/user
router.post("/user", getOneUser);



module.exports = router;