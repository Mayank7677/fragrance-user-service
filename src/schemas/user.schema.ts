import { Document, Model, Types } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  tokenVersion: number;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}
