/*
 * Title: db.js
 * Description : database connection
 * Author: Tanvir Hassan Joy
 * Date: 2024-04-18 11:49:42
 */

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);
    console.log("DB connected successfully");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default connectDB;
