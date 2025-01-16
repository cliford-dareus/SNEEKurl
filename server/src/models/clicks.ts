import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    link: { type:  mongoose.Schema.Types.ObjectId, ref: "short" },
    date: { type: Date },
});

const Click = mongoose.model("Click", clickSchema);
export default Click;