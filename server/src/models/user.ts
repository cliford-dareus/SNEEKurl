import mongoose, { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  clientId?: string;
  email: string;
  profile?: string; // Make profile optional
  provider?: string; // Make provider optional
  password: string;
  isVerified: boolean;
  freemium?: number; // Make freemium optional;
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
    clientId: { type: String},
    profile: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    provider: { type: String },
    isVerified: { type: Boolean, default: false },
    freemium: {type: Number, default: 5}
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(this.password, salt);
  this.password = hashpassword;
  next();
});

const User = model<IUser>("User", UserSchema);
export default User;
