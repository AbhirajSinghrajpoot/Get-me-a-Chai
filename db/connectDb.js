import mongoose from "mongoose";

const connectDb = async () => {
  try {
    // If already connected, do nothing
    if (mongoose.connections && mongoose.connections[0] && mongoose.connections[0].readyState) {
      return
    }

    const mongoUri = process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/chai`;
    const conn = await mongoose.connect(mongoUri);
    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error(error.message);
    // don't exit the process here; throw so callers can handle
    throw error
  }
}

export default connectDb;