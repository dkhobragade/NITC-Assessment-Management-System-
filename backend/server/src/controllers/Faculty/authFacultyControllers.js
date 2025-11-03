import { generateToken } from "../../utils/utils.js";
import FacultyUser from "../../models/FacultyUser.js";
import bcryptjs from 'bcryptjs'

export const facultySignup = async (req, res) => {
  const { fullName, email, id, password } = req.body;

  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await FacultyUser.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newFaculty = new FacultyUser({
      fullName,
      email,
      id,
      password: hashedPassword,
    });

    await newFaculty.save();

    // Don’t generate token yet — faculty must be approved first by the admin
    res.status(201).json({
      _id: newFaculty._id,
      fullName: newFaculty.fullName,
      email: newFaculty.email,
      id: newFaculty.id,
      message:
        "Faculty registered successfully. Awaiting admin approval before login.",
      approved: newFaculty.approved,
      role: newFaculty.role,
    });
  } catch (error) {
    console.error("Error in faculty signup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const facultyLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const faculty = await FacultyUser.findOne({ email });

    if (!faculty) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcryptjs.compare(password, faculty.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!faculty.approved) {
      return res.status(403).json({
        message: "Your account is not approved by admin yet. Please wait.",
      });
    }

    generateToken({ userId: faculty._id, res });

    res.status(200).json({
      _id: faculty._id,
      fullName: faculty.fullName,
      email: faculty.email,
      id: faculty.id,
      role: faculty.role,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error in faculty login:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const facultyLogout = async ( req, res ) => {

  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 0,
      path: "/",
    });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }

 }