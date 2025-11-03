import AdminUser from "../../models/AdminUser.js";
import FacultyUser from "../../models/FacultyUser.js";
import bcrypt from 'bcryptjs'
import { generateToken } from "../../utils/utils.js";
import { Course } from "../../models/Courses.js";
import { AssignedCourse } from "../../models/assignedCourse.js";


export const adminSignup = async ( req, res ) =>
{
  const { fullName, email, id, password } = req.body;

  try
  {
    if ( password.length < 6 )
    {
      return res
        .status( 400 )
        .json( { message: "Password must be atleast 6 character" } );
    }

    const user = await AdminUser.findOne( { email } );

    if ( user ) return res.status( 400 ).json( { message: "Email already exits" } );

    const salt = await bcrypt.genSalt( 10 );

    const hashedPassword = await bcrypt.hash( password, salt );

    const newUser = new AdminUser( {
      fullName,
      email,
      id,
      password: hashedPassword,
      role: "Admin",
    } );

    if ( newUser )
    {
      generateToken( { userId: newUser._id, res } );
      await newUser.save();

      res.status( 201 ).json( {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        id:newUser.id,
        message: "Admin added Succesfully",
        role: newUser.role,
      } );

      return;
    } else
    {
      res.status( 400 ).json( { message: "Invalid User Data" } );
    }
  } catch ( error )
  {
    console.log( "Error in SignUp controller", error.message );
    res.status( 500 ).json( { message: "Internal Server Error" } );
  }


}

export const approveFaculty = async (req, res) => {
  const { facultyId } = req.body;

  try {
    const faculty = await FacultyUser.findOne({ id: facultyId });
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    faculty.approved = true;
    await faculty.save();

    res.status(200).json({ message: "Faculty approved successfully" });
  } catch (error) {
    console.error("Error approving faculty:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const adminLogin = async ( req, res ) => {

  const { email, password } = req.body;

  try {
    const user = await AdminUser.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    generateToken({ userId: user._id, res });

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      message: "LogIn successfully",
    });
  } catch (error) {
    console.log("Error in Signin controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export const adminLogout = async ( req, res ) => {

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

export const getAllFacultyData=async(req,res)=>{

  try{

    const getFacultyData = await  FacultyUser.find()

    if (!getFacultyData || getFacultyData.length == 0) {
      return res.status(404).json({ message: "No user available" });
    }

    return res.status(200).json(getFacultyData);

  }
  catch(error){
    console.log("Error while getting all user", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export const getAllCourseData=async(req,res)=>{

  try {
    const assignedCourses = await AssignedCourse.find();

    if (!assignedCourses || assignedCourses.length === 0) {
      return res.status(404).json({ message: "No assigned courses found" });
    }

    // For each assignment, fetch faculty name from FacultyUser collection
    const result = await Promise.all(
      assignedCourses.map(async (record) => {
        const faculty = await FacultyUser.findOne({ _id: record.faculty });

        return {
          facultyName: faculty ? faculty.fullName : "Unknown Faculty",
          courseName: record.course,
          assignedAt: record.createdAt,
        };
      })
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error while getting assigned course data:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export const assignCourse=async(req,res)=>{
  const { faculty, course } = req.body;

  try{

    if (!faculty || !course) {
      return res.status(400).json({ message: "Faculty and Course are required" });
    }

    const existingAssignment = await AssignedCourse.findOne({ faculty, course });
    if (existingAssignment) {
      return res.status(400).json({ message: "This course is already assigned to the faculty" });
    }

    const newAssignment = new AssignedCourse({ faculty, course });
    await newAssignment.save();

      res.status(201).json({
      message: "Course assigned successfully",
      data: newAssignment,
    });

  }
  catch(error){
    console.log("Error while getting all user", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }

}


export const addCourses=async(req,res)=>{

  const { courseName, courseCode } = req.body;

  try{

    if (!courseName || !courseCode ) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const existingCourse = await Course.findOne({ courseCode });

    if (existingCourse) {
      return res.status(400).json({ message: "Course with this code already exists." });
    }

    const newCourse = new Course({
      courseName,
      courseCode
    });

    await newCourse.save();

    res.status(201).json({ message: "Course added successfully!", course: newCourse });

  }
  catch(error){
    console.log("Error while getting all user", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }

}