import { generateToken } from "../../utils/utils.js";
import FacultyUser from "../../models/FacultyUser.js";
import bcryptjs from 'bcryptjs'
import { Task } from "../../models/Task.js";
import EvalutorUser from "../../models/EvalutorUser.js";
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import StudentUser from "../../models/StudentUser.js";
import mongoose from "mongoose";
import { AssignedCourse } from "../../models/assignedCourse.js";

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


const uploadPath = "uploads/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ];

    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF or Excel files are allowed"), false);
  },
});

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, facultyEmail } = req.body;
    const pdfUrl = req.file ? req.file.path : null;

    // Validate required fields
    if (!title || !description || !dueDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find faculty using email
    const faculty = await FacultyUser.findOne({ email: facultyEmail });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Create task linked with facultyID
    const newTask = new Task({
      title,
      description,
      dueDate,
      pdfUrl,
      createdBy: faculty._id, // fixed here
    });

    await newTask.save();

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


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

export const approveStudent = async (req, res) => {
  const { studentId } = req.body;

  try {
    const student = await StudentUser.findOne({ id: studentId });
    if (!student) return res.status(404).json({ message: "student not found" });

    student.approved = true;
    await student.save();

    res.status(200).json({ message: "student approved successfully" });
  } catch (error) {
    console.error("Error approving student:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllEvalutorData=async(req,res)=>{

  try{

    const getEvalutorData = await  EvalutorUser.find()

    if (!getEvalutorData || getEvalutorData.length == 0) {
      return res.status(404).json({ message: "No faculty available" });
    }

    return res.status(200).json(getEvalutorData);

  }
  catch(error){
    console.log("Error while getting all user", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getAllStudentData=async(req,res)=>{

  try{

    const getStudentData = await  StudentUser.find()

    if (!getStudentData || getStudentData.length == 0) {
      return res.status(404).json({ message: "No faculty available" });
    }

    return res.status(200).json(getStudentData);

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

export const getTotalTask = async (req, res) => {
  try {
    const { facultyId } = req.body;
console.log("facultyId",facultyId)
    // Validate facultyId
    if (!facultyId || !mongoose.Types.ObjectId.isValid(facultyId)) {
      return res.status(400).json({ message: "Invalid or missing facultyId" });
    }

    // Count tasks for this faculty
    const totalTask = await Task.countDocuments({ createdBy: facultyId });

    res.status(200).json({
      message: "Total number of tasks fetched successfully!",
      totalTask,
    });
  } catch (error) {
    console.error("Error while fetching total tasks:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAllTask = async (req, res) => {
  const { facultyId } = req.body;
  try {

    if (!facultyId) {
      return res.status(400).json({ message: "Faculty ID is required" });
    }

    const tasks = await Task.find({ createdBy: facultyId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    console.error("Error while fetching tasks:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAssignedCourses = async (req, res) => {
  const { facultyId } = req.body; // faculty ID sent from frontend

  try {
    // Validate facultyId
    if (!facultyId || !mongoose.Types.ObjectId.isValid(facultyId)) {
      return res.status(400).json({ message: "Invalid or missing facultyId" });
    }

    // Fetch only courses assigned to this faculty
    const assignedCourses = await AssignedCourse.find({ facultyID: facultyId })
      .populate("facultyID", "fullName email id") // populate faculty details
      .sort({ createdAt: -1 }); // latest first

    if (!assignedCourses || assignedCourses.length === 0) {
      return res.status(404).json({ message: "No assigned courses found" });
    }

    res.status(200).json({
      message: "Assigned courses fetched successfully",
      data: assignedCourses,
    });
  } catch (error) {
    console.error("Error while fetching assigned courses:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
