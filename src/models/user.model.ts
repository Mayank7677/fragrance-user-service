import { model, mongo, Schema } from "mongoose";
import { IUserModel, IUserDocument } from "../schemas/user.schema";
import bcrypt from "bcrypt";
import * as argon2 from "argon2";

const UserSchema = new Schema<IUserDocument>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, min: 3 },
    tokenVersion: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["customer", "admin", "staff"],
      default: "customer",
    },

    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    profilePictureUrl: { type: String },

    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },

    addresses: [
      {
        label: {
          type: String,
          enum: ["home", "work", "other"],
          default: "home",
        },
        fullName: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await argon2.hash(this.password);
  }
});

UserSchema.method(
  "comparePassword",
  async function (candidatePassword: string) {
    return await argon2.verify(this.password , candidatePassword);
  }
);

export default model<IUserDocument, IUserModel>("User", UserSchema);
