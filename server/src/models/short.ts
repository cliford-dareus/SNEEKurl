import mongoose from "mongoose";
import { nanoid } from "nanoid";

const ShortSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true,
  },
  short: {
    type: String,
  },
  favorite: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

ShortSchema.pre("save", function () {
  if (this.isModified("short")) return;
  const ID = nanoid(7);
  this.short = ID;
});

const Short = mongoose.model("Short", ShortSchema);
export default Short;
