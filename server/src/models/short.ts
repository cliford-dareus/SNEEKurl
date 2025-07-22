import mongoose, { Document, ObjectId } from "mongoose";
import { nanoid } from "nanoid";

interface IShort extends Document {
  longUrl: string;
  short: string;
  isShareable: boolean;
  favorites: { type: ObjectId; ref: string }[];
  user: { type: ObjectId; ref: string };
  guest?: string;
  password?: string;
  totalClicks: number;
  lastClick: Date;
  expired_in: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    time: Date;
    ipAddress: string | undefined;
    userAgent: string | undefined;
    referer: string | undefined;
    country: string;
    isMobile: boolean;
  }[];
}

const ShortSchema = new mongoose.Schema<IShort>(
  {
    longUrl: { type: String, required: true },
    short: { type: String },
    favorites: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    isShareable: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    guest: { type: String },
    password: { type: String },
    expired_in: { type: Date },
    totalClicks: { type: Number, default: 0 },
    lastClick: { type: Date },
    metadata: [
      {
        time: { type: Date },
        ipAddress: { type: String },
        userAgent: { type: String },
        referer: { type: String },
        country: { type: String },
        isMobile: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ShortSchema.pre("save", function () {
  if (this.isModified("short")) return;
  const ID = nanoid(8);
  this.short = ID;
});

const Short = mongoose.model("Short", ShortSchema);
export default Short;
