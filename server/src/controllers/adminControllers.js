import UserModel from "../models/UserModel.js";
import CourseModel from "../models/CourseModel.js";

export const approveFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const adminId = req.user?._id; // populated from auth middleware

    const faculty = await UserModel.findById(facultyId);
    if (!faculty || faculty.role !== "Faculty") {
      return res.status(400).json({ success: false, message: "Invalid faculty" });
    }

    faculty.isApproved = true;
    faculty.approvedByAdmin = adminId;
    await faculty.save();

    res.status(200).json({ success: true, message: "Faculty approved successfully" });
  } catch (error) {
    console.error("Error approving faculty:", error);
    res.status(500).json({ success: false, message: "Server error approving faculty" });
  }
};



export const getFacultyCount = async (req, res) => {
  try {
    const count = await UserModel.countDocuments({ role: "Faculty" });
    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error fetching faculty count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching faculty count",
    });
  }
};

export const getCoursesCount = async (req, res) => {
  try {
    const count = await CourseModel.countDocuments();
    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error fetching Courses count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Courses count",
    });
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    // Fetch all users where role = Faculty
    const facultyList = await UserModel.find({ role: "Faculty" })
      .select("-password")
      .populate("assignedCourses", "name code")
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      total: facultyList.length,
      faculty: facultyList,
    });
  } catch (error) {
    console.error("Error fetching faculty details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching faculty details",
    });
  }
};


export const addCourse = async (req, res) => {
  try {
    const { name, code, description, credits } = req.body;

    if (!name || !code || !credits) {
      return res.status(400).json({ message: "Name, code, and credits are required." });
    }

    // Check if course already exists
    const existing = await CourseModel.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "Course with this code already exists." });
    }

    const newCourse = new CourseModel({
      name,
      code,
      description: description || "",
      credits,
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const assignCourse = async (req, res) => {
  try {
    const { facultyId, courseId } = req.body;

    if (!facultyId || !courseId) {
      return res.status(400).json({ message: "Faculty ID and Course ID are required." });
    }

    const faculty = await UserModel.findById(facultyId);
    if (!faculty || faculty.role !== "Faculty") {
      return res.status(400).json({ message: "Invalid faculty." });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(400).json({ message: "Invalid course." });
    }

    // Check if already assigned
    if (course.faculty) {
      return res.status(400).json({ message: "Course already assigned to another faculty." });
    }

    // Update both course and faculty
    course.faculty = faculty._id;
    await course.save();

    faculty.assignedCourses.push(course._id);
    await faculty.save();

    res.status(200).json({
      success: true,
      message: "Course assigned successfully!",
      course,
      faculty,
    });
  } catch (error) {
    console.error("Error assigning course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAvailableFaculties = async (req, res) => {
  try {
    // Fetch only approved faculty
    const faculties = await UserModel.find({
      role: "Faculty",
      isApproved: true,
    })
      .populate("assignedCourses", "name code")
      .lean();

    // ✅ Filter out faculties who already have assigned courses
    const availableFaculties = faculties.filter(
      (faculty) => !faculty.assignedCourses || faculty.assignedCourses.length === 0
    );

    res.status(200).json({ success: true, faculties: availableFaculties });
  } catch (error) {
    console.error("Error fetching faculties:", error);
    res.status(500).json({ message: "Error fetching faculties" });
  }
};


// Get unassigned courses
export const getUnassignedCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find({ faculty: { $exists: false } });
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
};

// Get all assignments
export const getAssignedCourses = async (req, res) => {
  try {
    const assigned = await CourseModel.find({ faculty: { $exists: true } })
      .populate("faculty", "name email collegeId")
      .select("name code faculty");

    res.status(200).json({ success: true, assigned });
  } catch (error) {
    res.status(500).json({ message: "Error fetching assigned courses" });
  }
};
