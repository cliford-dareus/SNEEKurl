import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guest: { type: String }, // For guest users
    link: { type: mongoose.Schema.Types.ObjectId, ref: "Short", required: true },
    date: { type: Date, required: true, default: Date.now },
    metadata: {
        country: { type: String, required: true },
        isMobile: { type: Boolean, required: true },
        referrerDomain: { type: String, required: true },
        browser: { type: String, required: true },
        os: { type: String, required: true }
    }
}, {
    timestamps: true
});

// Add indexes for better analytics queries
clickSchema.index({ user: 1, date: -1 });
clickSchema.index({ guest: 1, date: -1 });
clickSchema.index({ link: 1, date: -1 });
clickSchema.index({ date: -1 });

const Click = mongoose.model("Click", clickSchema);
export default Click;
