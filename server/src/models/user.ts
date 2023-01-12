import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    isVerified: boolean,
    comparePassword(candidatePassword: string): Promise<Error | boolean>,
}

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
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

UserSchema.pre('save', async function () {
    // if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(this.password!, salt);
    this.password = hashpassword;
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    const isMatch = await bcrypt.compare( candidatePassword, this.password );
    return isMatch;
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;