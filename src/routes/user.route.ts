import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const userRouter = express.Router();

import {
  createUser,
  getAllUsers,
  getUserProfile,
  login,
  logout,
} from "../controllers/user.controller";

userRouter.post("/register", createUser);
userRouter.post("/login", login);
userRouter.post("/logout", authMiddleware, logout);
userRouter.get("/profile", authMiddleware, getUserProfile); 
userRouter.get("/", authMiddleware, getAllUsers);
 
export default userRouter;
