import {link} from "fs";
import mongoose, {ObjectId} from "mongoose";

interface PageInterface extends mongoose.Document {
    title: string;
    description: string;
    slug: string;
    isPublic: boolean;
    user: { type: ObjectId; ref: string };
    theme: string;
    content: string;
    links: { category: string; name: string; link: ObjectId }[];
}

const PageSchema = new mongoose.Schema<PageInterface>(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        slug: {type: String, required: true, unique: true},
        isPublic: {type: Boolean, default: false},
        theme: {type: String},
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: { type: String},
        links: [{
            name: {
                type: String,
                required: true
            },
            category: {
                type: String,
                default: 'website'
            },
            short: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Short'
            }
        }],
    },
    {
        timestamps: true,
    }
);

const Page = mongoose.model("Page", PageSchema);
export default Page;
