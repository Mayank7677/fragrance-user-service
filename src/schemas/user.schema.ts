import { Document, Model, Types } from "mongoose";

export interface IAddress {
  label?: "home" | "work" | "other";
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface IUser {
  username: string;
  email: string;
  password: string;
  tokenVersion: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  profilePictureUrl?: string;
  isActive?: boolean;
  isVerified?: boolean;
  addresses?: IAddress[];
  role?: "customer" | "admin" | "staff";
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}
