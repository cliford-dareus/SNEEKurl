import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const connectDB = (URI: string) => {
  mongoose.connect(URI);
};

export default connectDB;
