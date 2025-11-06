import bcryptjs from 'bcryptjs'
import StudentUser from "../../models/StudentUser.js";
import { generateToken } from '../../utils/utils.js'
import { Enrollment } from '../../models/Enrollment.js';
import { Course } from '../../models/Courses.js';


export const studentSignup = async ( req, res ) =>
{
  const { fullName, email, id, password } = req.body;

  try
  {
    if ( password.length < 6 )
    {
      return res
        .status( 400 )
        .json( { message: "Password must be at least 6 characters" } );
    }

    const existingUser = await StudentUser.findOne( { email } );

    if ( existingUser )
      return res.status( 400 ).json( { message: "Email already exists" } );

    const salt = await bcryptjs.genSalt( 10 );
    const hashedPassword = await bcryptjs.hash( password, salt );

    const newStudent = new StudentUser( {
      fullName,
      email,
      id,
      password: hashedPassword,
    } );

    await newStudent.save();

    // Don’t generate token yet — student must be approved first by the evalutor
    res.status( 201 ).json( {
      _id: newStudent._id,
      fullName: newStudent.fullName,
      email: newStudent.email,
      id: newStudent.id,
      message:
        "Student registered successfully. Awaiting Evalutor approval before login.",
      approved: newStudent.approved,
      role: newStudent.role,
    } );
  } catch ( error )
  {
    console.error( "Error in student signup:", error.message );
    res.status( 500 ).json( { message: "Internal Server Error" } );
  }
}
export const studentLogin = async ( req, res ) =>
{
  const { email, password } = req.body;

  try
  {
    const evalutor = await StudentUser.findOne( { email } );

    if ( !evalutor )
    {
      return res.status( 400 ).json( { message: "Invalid email or password" } );
    }

    const isMatch = await bcryptjs.compare( password, evalutor.password );

    if ( !isMatch )
    {
      return res.status( 400 ).json( { message: "Invalid email or password" } );
    }

    if ( !evalutor.approved )
    {
      return res.status( 403 ).json( {
        message: "Your account is not approved by evalutor yet. Please wait.",
      } );
    }

    generateToken( { userId: evalutor._id, res } );

    res.status( 200 ).json( {
      _id: evalutor._id,
      fullName: evalutor.fullName,
      email: evalutor.email,
      id: evalutor.id,
      role: evalutor.role,
      message: "Login successful",
    } );
  } catch ( error )
  {
    console.error( "Error in Student login:", error.message );
    res.status( 500 ).json( { message: "Internal Server Error" } );
  }
}


export const studentLogout = async ( req, res ) =>
{
  try
  {
    res.cookie( "jwt", "", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 0,
      path: "/",
    } );
    res.status( 200 ).json( { message: "Logout Successfully" } );
  } catch ( error )
  {
    console.log( "Error in logout controller", error.message );
    res.status( 500 ).json( { message: "Internal Server Error" } );
  }
}

export const enrollCourse = async (req, res) => {
  const { email, courseCode } = req.body;

  try {
    // 1️⃣ Find the student
    const student = await StudentUser.findOne({ email });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // 2️⃣ Find the course by code
    const course = await Course.findOne({ courseCode });
    if (!course) return res.status(404).json({ message: "Invalid course code" });

    // 3️⃣ Check if already enrolled
    const existing = await Enrollment.findOne({
      student: student._id,
      course: course._id,
    });
    if (existing)
      return res.status(400).json({ message: "Already enrolled in this course" });

    // 4️⃣ Enroll (save course name also)
    const newEnrollment = await Enrollment.create({
      student: student._id,
      course: course._id,
      courseName: course.courseName,
    });

    res
      .status(201)
      .json({ message: "Enrolled successfully", data: newEnrollment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const getMyCourses = async (req, res) => {
  const { email } = req.body;

  try {
    // 1️⃣ Find student
    const student = await StudentUser.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2️⃣ Fetch all enrollments for this student
    const enrollments = await Enrollment.find({ student: student._id })
      .populate("course", "courseName courseCode createdBy")
      .sort({ createdAt: -1 });

    // 3️⃣ Format response
    const courses = enrollments.map((en) => ({
      courseName: en.courseName || en.course?.courseName,
      courseCode: en.course?.courseCode,
      enrolledAt: en.enrolledAt,
    }));

    res.status(200).json({
      message: "Enrolled courses fetched successfully",
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};