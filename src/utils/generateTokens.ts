import jwt from "jsonwebtoken";
export const generateAccessToken = (
  userId: string,
  tokenVersion: number,
  role: string = "customer"
): string => {
  return jwt.sign(
    { userId, tokenVersion, role },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "5m",
    }
  );
};

export const generateRefreshToken = (
  userId: string,
  role: string = "customer"
): string => {
  return jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "3d",
    }
  );
};
