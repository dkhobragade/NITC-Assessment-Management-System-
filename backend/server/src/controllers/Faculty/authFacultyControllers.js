import { generateToken } from "../../utils/utils.js";
import FacultyUser from "../../models/FacultyUser.js";
import bcryptjs from 'bcryptjs'
import { Task } from "../../models/Task.js";
import EvalutorUser from "../../models/EvalutorUser.js";

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


export const createdTask=async(req,res)=>{
  const { title, description, dueDate } = req.body;

  try{

    if (!title || !description || !dueDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

      const newTask = await Task.create({
      title,
      description,
      dueDate,
      createdBy: req.user ? req.user._id : null,
    });


    return res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });

  }
  catch(error){
    console.log("Error in Creating Task", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export const approveEvalutor = async (req, res) => {
  const { evalutorId } = req.body;

  try {
    const evalutor = await EvalutorUser.findOne({ id: evalutorId });
    if (!evalutor) return res.status(404).json({ message: "evalutor not found" });

    evalutor.approved = true;
    await evalutor.save();

    res.status(200).json({ message: "evalutor approved successfully" });
  } catch (error) {
    console.error("Error approving evalutor:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllEvalutorData=async(req,res)=>{

  try{

    const getEvalutorData = await  EvalutorUser.find()

    if (!getEvalutorData || getEvalutorData.length == 0) {
      return res.status(404).json({ message: "No user available" });
    }

    return res.status(200).json(getEvalutorData);

  }
  catch(error){
    console.log("Error while getting all user", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export const getTotalEvalutor=async(req,res)=>{
  try {
    const totalEvalutor = await EvalutorUser.countDocuments();

    res.status(200).json({
      message: "Total number of evalutor fetched successfully!",
      totalEvalutor,
    });
  } catch (error) {
    console.error("Error while fetching total evalutor:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}