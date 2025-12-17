const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const connectDB = require("./config/db.js");
const usersRouter = require("./routes/userRoutes.js");
const adsRouter = require("./routes/adRoutes.js");
const errorHandler = require("./middleware/errorHandler.js");

const app = express();
const port = process.env.PORT;
console.log(port);

connectDB();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRouter); // http://localhost:8000/users/register
app.use("/ads", adsRouter); // http://localhost:8000/ads
app.use(errorHandler);
///////
app.listen(port, () => console.log(`Server running on port ${port}`));
