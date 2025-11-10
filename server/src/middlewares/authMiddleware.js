import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Unauthorized - No token Provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(400).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await UserModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute MiddleWare", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
