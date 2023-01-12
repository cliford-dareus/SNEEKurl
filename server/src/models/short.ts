import mongoose from "mongoose";
import { nanoid } from 'nanoid';

const ShortSchema = new mongoose.Schema({
    full: { 
        type: String,
        required: true
    },
    short: { 
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false
    },
    clicks: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        autopopulate: true,
        ref: 'User'
    }
});

ShortSchema.pre('save',function(){
    if (this.isModified('short')) return;
    const ID = nanoid(10);
    this.short = ID;
});

const Short = mongoose.model('Short', ShortSchema);
export default Short;