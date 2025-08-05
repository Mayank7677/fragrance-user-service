import { model, mongo, Schema } from "mongoose";
import { IUserModel, IUserDocument } from "../schemas/user.schema";
import bcrypt from "bcrypt";
import * as argon2 from "argon2";

const UserSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 3,
    },
    tokenVersion: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
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
