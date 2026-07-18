const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

  } catch (error) {

    console.error("MongoDB Connection Failed");
    console.error(error.message);

    // Don't terminate Jest during tests
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }

    throw error;
  }
};

module.exports = connectDB;