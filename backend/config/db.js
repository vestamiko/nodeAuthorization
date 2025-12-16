const mongoose = require("mongoose");

const connectingDB = async () => {
  try {
    const connecting = await mongoose.connect(`${process.env.MONGO_DB}`);
    console.log(`Connection to DB successful: ${connecting.connection.host}`);
  } catch (err) {
    console.log(`Cant connect to DB: ${err}`);
  }
};

module.exports = connectingDB;
