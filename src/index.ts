import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./configs/connectDB";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import tokenRouter from "./routes/token.route";
import configureCors from "./configs/cors.config";


const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(configureCors());

// Routes
app.use("/api/users", userRouter);
app.use("/api/tokens", tokenRouter);

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
