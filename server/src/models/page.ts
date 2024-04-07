import { link } from "fs";
import mongoose, { ObjectId } from "mongoose";

interface PageInterface extends mongoose.Document {
  title: string;
  description: string;
  slug: string;
  isPublic: boolean;
  user: { type: ObjectId; ref: string };
  links: {  category: string; link: ObjectId }[];
}

const PageSchema = new mongoose.Schema<PageInterface>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isPublic: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    links: {
      type: [
        {
          link: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Short",
          },
          category: { type: String, default: "website" },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Page = mongoose.model("Page", PageSchema);
export default Page;
