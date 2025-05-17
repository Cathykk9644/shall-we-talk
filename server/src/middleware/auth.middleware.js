import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access unauthorized due to absence of token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Access unauthorized due to invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Access unauthorized due to invalid user" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protectedRoute middleware:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error, please try again later" });
  }
};
