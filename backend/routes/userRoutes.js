const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getOneUser,
  getAllUsers,
} = require("../controller/userControllers.js");

const protect = require("../middleware/authMiddleware.js");
const protectAdmin = require("../middleware/adminAuthMiddleware.js");

// http://localhost:8000/users/register
router.post("/register", registerUser);
// http://localhost:8000/users/login
router.post("/login", loginUser);
// http://localhost:8000/users/user
router.get("/user", protect, getOneUser);
router.get("/all", protectAdmin, getAllUsers);


module.exports = router;
