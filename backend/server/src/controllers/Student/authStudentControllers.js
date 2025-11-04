import bcryptjs from 'bcryptjs'
import StudentUser from "../../models/StudentUser.js";

export const studentSignup=async(req,res)=>{
    const { fullName, email, id, password } = req.body;

    try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await StudentUser.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newStudent = new StudentUser({
      fullName,
      email,
      id,
      password: hashedPassword,
    });

    await newStudent.save();

    // Don’t generate token yet — student must be approved first by the evalutor
    res.status(201).json({
      _id: newStudent._id,
      fullName: newStudent.fullName,
      email: newStudent.email,
      id: newStudent.id,
      message:
        "Student registered successfully. Awaiting Evalutor approval before login.",
      approved: newStudent.approved,
      role: newStudent.role,
    });
  } catch (error) {
    console.error("Error in student signup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export const studentLogin=async(req,res)=>{
    const { email, password } = req.body;

  try {
    const evalutor = await StudentUser.findOne({ email });

    if (!evalutor) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcryptjs.compare(password, evalutor.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!evalutor.approved) {
      return res.status(403).json({
        message: "Your account is not approved by evalutor yet. Please wait.",
      });
    }

    generateToken({ userId: evalutor._id, res });

    res.status(200).json({
      _id: evalutor._id,
      fullName: evalutor.fullName,
      email: evalutor.email,
      id: evalutor.id,
      role: evalutor.role,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error in evalutor login:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export const studentLogout=async(req,res)=>{
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