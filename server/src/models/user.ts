import {Document, model, Schema} from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    clientId?: string;
    stripe_account_id?: string;
    profile?: string;
    provider?: string;
    isVerified: boolean;
    freemium?: number;
    subscription_end?: Date;
    max_link: number;
    passwordTokenLife?: Date | null;
    passwordToken?: string;
    refreshToken?: string;
    refreshTokenExpiry?: Date;

    comparePassword(candidatePassword: string): Promise<Error | boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 20,
            trim: true,
        },
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        clientId: {type: String},
        stripe_account_id: {type: String},
        profile: {type: String},
        provider: {type: String},
        isVerified: {type: Boolean, default: false},
        subscription_end: {type: Date},
        freemium: {type: Number, default: 5},
        max_link: {type: Number, default: 5},
        passwordToken: {type: String},
        passwordTokenLife: {type: Date},
        refreshToken: {type: String},
        refreshTokenExpiry: {type: Date},
    },
    {
        timestamps: true,
    }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = model<IUser>("User", UserSchema);
export default User;
