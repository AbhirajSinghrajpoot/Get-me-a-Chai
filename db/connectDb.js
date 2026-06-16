import mongoose from "mongoose";

const connectDb = async () => {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connections[0]?.readyState === 1) {
    return
  }
  try {
    const mongoUri = process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/chai`;
    const conn = await mongoose.connect(mongoUri);
    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error
  }
}

export default connectDb;