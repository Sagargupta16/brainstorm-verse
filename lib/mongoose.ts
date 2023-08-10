import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");
  if (isConnected) return console.log("Already connected to DB");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Connected to DB");
  } catch (err) {
    console.log("Error connecting to DB");
    console.log(err);
  }
};
