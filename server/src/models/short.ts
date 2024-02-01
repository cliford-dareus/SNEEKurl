import mongoose, { Document, ObjectId } from "mongoose";
import { nanoid } from "nanoid";

interface IShort extends Document {
  longUrl: string;
  short: string;
  isShareable: boolean;
  favorites: { type: ObjectId; ref: string }[];
  user: { type: ObjectId; ref: string };
}

const ShortSchema = new mongoose.Schema<IShort>({
  longUrl: { type: String, required: true },
  short: { type: String },
  favorites: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  isShareable: { type: Boolean, default: false },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

ShortSchema.pre("save", function () {
  if (this.isModified("short")) return;
  const ID = nanoid(8);
  this.short = ID;
});

const Short = mongoose.model("Short", ShortSchema);
export default Short;
