import mongoose from "mongoose";
import { nanoid } from 'nanoid';

const ShortSchema = new mongoose.Schema({
    full: { 
        type: String,
        require: true
    },
    short: { 
        type: String,
        require: true
    },
    favorite: {
        type: Boolean,
        default: false
    },
    clicks: {
        type: Number,
        default: 0
    }
});

ShortSchema.pre('save',function(){
    const ID = nanoid(10);
    this.short = ID;
});

const Short = mongoose.model('Short', ShortSchema);
export default Short;