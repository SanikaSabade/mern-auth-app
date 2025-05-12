const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongo_url = process.env.MONGO_URI;
    await mongoose.connect(mongo_url);
    console.log("MongoDB Connected..");
  } catch (err) {
    console.error("Mongo Connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
