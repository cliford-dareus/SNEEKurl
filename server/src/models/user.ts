import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        min: 4,
        max: 20,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);
export default User;