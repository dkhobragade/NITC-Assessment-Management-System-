import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";
import { generateToken } from "../utils/utils.js";

export const signup = async (req, res) => {
  try {
    const { name, collegeId, email, password, role } = req.body;

    // Basic validation
    if (!name || !collegeId || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      collegeId,
    });

    // Generate JWT and set cookie
    generateToken({ userId: newUser._id, res });

    res.status(201).json({
      message: "Signup successful",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        collegeId:newUser.collegeId,
        role: newUser.role,
        isApproved: newUser.isApproved,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Check approval status
     if (!user.isApproved) {
      let pendingMessage = "Your account is awaiting approval.";

      if (user.role === "Faculty") {
        pendingMessage = "Your account is pending approval from the Admin.";
      } else if (user.role === "Evaluator" || user.role === "Student") {
        pendingMessage = "Your account is pending approval from the Faculty.";
      }

      return res.status(403).json({ message: pendingMessage });
    }

    // Generate token
    generateToken({ userId: user._id, res });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeId:user.collegeId
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};
