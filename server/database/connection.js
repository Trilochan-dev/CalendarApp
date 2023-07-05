const MongoDB = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    const con = await MongoDB.connect(process.env.MONGO_URL);

    console.log(
      `MongoDB connected successfully at host: ${con.connection.host}`
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
