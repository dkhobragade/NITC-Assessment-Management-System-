import UserModel from "../models/UserModel.js";

// Faculty approving Evaluator/Student
export const approveUserByFaculty = async ( req, res ) =>
{
  const { userId } = req.body;
  const facultyId = req.user._id;

  const user = await UserModel.findById( userId );
  if ( !user || ![ "Evaluator", "Student" ].includes( user.role ) )
    return res.status( 400 ).json( { message: "Invalid user" } );

  user.isApproved = true;
  user.approvedByFaculty = facultyId;
  await user.save();

  res.status( 200 ).json( { message: `${ user.role } approved successfully` } );
};

export const createTask = async ( req, res ) => { }

export const getAssignedCoursesForFaculty = async ( req, res ) =>
{
  try
  {
    const facultyId = req.user.id; // from JWT middleware

    // Verify user is faculty
    const faculty = await UserModel.findById( facultyId )
      .populate( "assignedCourses", "name code description credits" )
      .lean();

    if ( !faculty )
    {
      return res.status( 404 ).json( { success: false, message: "Faculty not found" } );
    }

    if ( faculty.role !== "Faculty" )
    {
      return res.status( 403 ).json( { success: false, message: "Access denied. Only faculty can access this." } );
    }

    res.status( 200 ).json( {
      success: true,
      assignedCourses: faculty.assignedCourses || [],
    } );
  } catch ( error )
  {
    console.error( "Error fetching assigned courses:", error );
    res.status( 500 ).json( { success: false, message: "Server error while fetching assigned courses" } );
  }
};

export const approveEvalutor = async ( req, res ) =>
{
  try
  {
    const { evaluatorId } = req.params;
    const adminId = req.user?._id;

    const evaluator = await UserModel.findById( evaluatorId );
    if ( !evaluator || evaluator.role !== "Evaluator" )
    {
      return res.status( 400 ).json( { success: false, message: "Invalid evaluator" } );
    }

    evaluator.isApproved = true;
    evaluator.approvedByAdmin = adminId;
    await evaluator.save();

    res.status( 200 ).json( { success: true, message: "evaluator approved successfully" } );
  } catch ( error )
  {
    console.error( "Error approving evaluator:", error );
    res.status( 500 ).json( { success: false, message: "Server error approving faculty" } );
  }
}

export const approveStudent = async ( req, res ) =>
{
  try
  {
    const { studentId } = req.params;
    const adminId = req.user?._id;

    const student = await UserModel.findById( studentId );
    if ( !student || student.role !== "Student" )
    {
      return res.status( 400 ).json( { success: false, message: "Invalid student" } );
    }

    student.isApproved = true;
    student.approvedByAdmin = adminId;
    await student.save();

    res.status( 200 ).json( { success: true, message: "student approved successfully" } );
  } catch ( error )
  {
    console.error( "Error approving student:", error );
    res.status( 500 ).json( { success: false, message: "Server error approving faculty" } );
  }
}


export const getAllEvalutor = async ( req, res ) =>
{
  try
  {
    const evalutorList = await UserModel.find( { role: "Evaluator" } )
      .select( "-password" )
      .sort( { createdAt: -1 } ); // newest first

    res.status( 200 ).json( {
      success: true,
      total: evalutorList.length,
      evalutor: evalutorList,
    } );
  } catch ( error )
  {
    console.error( "Error fetching evalutor details:", error );
    res.status( 500 ).json( {
      success: false,
      message: "Error fetching evalutor details",
    } );
  }
};

export const getAllStudent = async ( req, res ) =>
{
  try
  {
    const studentList = await UserModel.find( { role: "Student" } )
      .select( "-password" )
      .sort( { createdAt: -1 } ); // newest first

    res.status( 200 ).json( {
      success: true,
      total: studentList.length,
      student: studentList,
    } );
  } catch ( error )
  {
    console.error( "Error fetching student details:", error );
    res.status( 500 ).json( {
      success: false,
      message: "Error fetching student details",
    } );
  }
};
