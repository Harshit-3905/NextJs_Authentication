import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });
    connection.on("error", (error) => {
      console.error("Error connecting to MongoDB: ", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
  }
}
