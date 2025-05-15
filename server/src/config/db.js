import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Hey now you are connected to MongoDB: ${conn.connection.host}`
    );
  } catch (error) {
    console.log("Error in connecting to MongoDB", error);
    process.exit(1);
  }
};
