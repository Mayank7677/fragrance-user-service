import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";
import User from "../models/user.model";
import Token from "../models/token.model";
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
// import { registerSchema } from "../validations/user.validation";
import logger from "../utils/logger";
import { IUserDocument } from "../schemas/user.schema";
import { IUser } from "../schemas/user.schema";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userData: IUser = req.body;

  try {
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      return next(new AppError("User already exists", 400));
    }

    const user = new User(userData);
    await user.save();

    const accessToken = generateAccessToken(
      user._id.toString(),
      user.tokenVersion
    );
    const refreshToken = generateRefreshToken(user._id.toString());

    await Token.create({
      userId: user._id,
      token: refreshToken,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ message: "User created successfully", accessToken });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = (await User.findOne({ email })) as IUserDocument;

    if (!user) {
      return next(new AppError("Invalid Credentials", 404));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new AppError("Invalid Credentials", 401));
    }

    // Increment token version
    user.tokenVersion += 1;
    await user.save();

    const accessToken = generateAccessToken(
      user._id.toString(),
      user.tokenVersion
    );
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await Token.create({
      userId: user._id,
      token: refreshToken,
    });

    res.status(200).json({ message: "Login successful", accessToken });
  }
);

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token) {
    try {
      const payload: any = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
      await Token.deleteOne({ userId: payload.userId });
    } catch {}
  }

  // Increment token version
  const user = await User.findOne({ _id: req.user?.userId });
  if (user) {
    user.tokenVersion += 1;
    await user.save();
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });
  res.json({ message: "Logged out" });
};

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  }
);

export const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({ user });
  }
);
