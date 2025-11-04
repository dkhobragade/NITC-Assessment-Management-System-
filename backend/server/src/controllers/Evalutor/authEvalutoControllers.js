import bcryptjs from 'bcryptjs'
import EvalutorUser from '../../models/EvalutorUser.js';

export const evalutorSignup=async(req,res)=>{
    const { fullName, email, id, password } = req.body;

  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await EvalutorUser.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newEvalutor = new EvalutorUser({
      fullName,
      email,
      id,
      password: hashedPassword,
    });

    await newEvalutor.save();

    // Don’t generate token yet — evalutor must be approved first by the admin
    res.status(201).json({
      _id: newEvalutor._id,
      fullName: newEvalutor.fullName,
      email: newEvalutor.email,
      id: newEvalutor.id,
      message:
        "Evalutor registered successfully. Awaiting faculty approval before login.",
      approved: newEvalutor.approved,
      role: newEvalutor.role,
    });
  } catch (error) {
    console.error("Error in evalutor signup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export const evalutorLogin=async(req,res)=>{

     const { email, password } = req.body;

  try {
    const evalutor = await EvalutorUser.findOne({ email });

    if (!evalutor) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcryptjs.compare(password, evalutor.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!evalutor.approved) {
      return res.status(403).json({
        message: "Your account is not approved by faculty yet. Please wait.",
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
export const evalutorLogout=async(req,res)=>{

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