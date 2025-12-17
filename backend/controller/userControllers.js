const asyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");

const User = require("../model/User.js");
const generateToken = require("../functions/generateToken.js");
// register
// POST
// @route /users/register
// public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.send(409);
    throw new Error("User already exists");
  }

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  const user = await User.create({
    userName: name,
    userEmail: email,
    password: hashedPassword,
    role: "simple",
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      userName: user.userName,
      userEmail: user.userEmail,
      role: user.role,
      token: generateToken(user.id), // tokenas
    });
  } else {
    res.status(400);
    throw new Error("User could not be created, invalid input");
  }
});

/// login
/// POST
/// route /users/login
// public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ userEmail: email });

  if (user && (await bcryptjs.compare(password, user.password))) {
    res.json({
      _id: user.id,
      userName: user.userName,
      userEmail: user.userEmail,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user credentials");
  }
});

//// get one user
/// GET
/// @route /users/user
// private owner, admin

const getOneUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// get all users
// GET
// @route /users/all
/// private admin

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "ads",
        localField: "_id",
        foreignField: "userID",
        as: "ads",
      },
    },
    {
      $match: { role: { $in: ["simple", "admin"] } },
    },
    {
      $unset: ["password", "createdAt", "updatedAt", "__v"],
    },
  ]);
  res.status(200).json(users);
});

module.exports = { registerUser, loginUser, getOneUser, getAllUsers };
