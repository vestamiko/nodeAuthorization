const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const connectDB = require("./config/db.js");
const usersRouter = require("./routes/userRoutes.js");

const app = express();
const port = process.env.PORT;
console.log(port);

connectDB();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// http://localhost:8000/users/register
app.use("/users", usersRouter);

///////
app.listen(port, () => console.log(`Server running on port ${port}`));
