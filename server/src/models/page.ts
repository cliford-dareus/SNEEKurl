import {link} from "fs";
import mongoose, {ObjectId} from "mongoose";

interface PageInterface extends mongoose.Document {
    title: string;
    description: string;
    slug: string;
    isPublic: boolean;
    user: { type: ObjectId; ref: string };
    themeColor?: string;
    backgroundColor?: string;
    backgroundType?: "solid" | "image" | "gradient";
    backgroundImage?: string;
    backgroundGradient?: string;
    accentColor?: string;
    textColor?: string;
    content: any[];
    links: { category: string; name: string; link: ObjectId }[];
}

const PageSchema = new mongoose.Schema<PageInterface>(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        slug: {type: String, required: true, unique: true},
        isPublic: {type: Boolean, default: false},
        themeColor: {type: String, default: "#00FF00"},
        backgroundColor: {type: String, default: "#000000"},
        backgroundType: {type: String, default: "solid", enum: ["solid", "image", "gradient"]},
        backgroundImage: {type: String},
        backgroundGradient: {type: String, default: "linear-gradient(to right, #00FF00, #0000FF)"},
        accentColor: {type: String, default: "#FFFFFF"},
        textColor: {type: String, default: "#FFFFFF"},
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: [],
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
