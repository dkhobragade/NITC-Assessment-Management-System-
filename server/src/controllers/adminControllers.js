import PDFDocument from "pdfkit";
import UserModel from "../models/UserModel.js";
import CourseModel from "../models/CourseModel.js";
import Submission from "../models/Submission.js";
import Enrollment from "../models/Enrollment.js";
import Evaluation from "../models/Evaluation.js";

export const approveFaculty = async ( req, res ) =>
{
  try
  {
    const { facultyId } = req.params;
    const adminId = req.user?._id;

    const faculty = await UserModel.findById( facultyId );
    if ( !faculty || faculty.role !== "Faculty" )
    {
      return res.status( 400 ).json( { success: false, message: "Invalid faculty" } );
    }

    faculty.isApproved = true;
    faculty.approvedByAdmin = adminId;
    await faculty.save();

    res.status( 200 ).json( { success: true, message: "Faculty approved successfully" } );
  } catch ( error )
  {
    console.error( "Error approving faculty:", error );
    res.status( 500 ).json( { success: false, message: "Server error approving faculty" } );
  }
};



export const getFacultyCount = async ( req, res ) =>
{
  try
  {
    const faculty = await UserModel.find( { role: "Faculty" } ).select( "name email" ); // only name & email
    res.status( 200 ).json( {
      success: true,
      count: faculty.length,
      faculty,
    } );
  } catch ( error )
  {
    console.error( "Error fetching faculty list:", error );
    res.status( 500 ).json( {
      success: false,
      message: "Error fetching faculty list",
    } );
  }
};


export const getCoursesCount = async ( req, res ) =>
{
  try
  {
    const courses = await CourseModel.find().select( 'name code' );
    res.status( 200 ).json( {
      success: true,
      count: courses.length,
      courses,
    } );
  } catch ( error )
  {
    console.error( "Error fetching Courses count:", error );
    res.status( 500 ).json( {
      success: false,
      message: "Error fetching Courses count",
    } );
  }
};

export const getAllFaculty = async ( req, res ) =>
{
  try
  {
    const facultyList = await UserModel.find( { role: "Faculty" } )
      .select( "-password" )
      .populate( "assignedCourses", "name code" )
      .sort( { createdAt: -1 } );

    res.status( 200 ).json( {
      success: true,
      total: facultyList.length,
      faculty: facultyList,
    } );
  } catch ( error )
  {
    console.error( "Error fetching faculty details:", error );
    res.status( 500 ).json( {
      success: false,
      message: "Error fetching faculty details",
    } );
  }
};


export const addCourse = async ( req, res ) =>
{
  try
  {
    const { name, code, description, credits } = req.body;

    if ( !name || !code || !credits )
    {
      return res.status( 400 ).json( { message: "Name, code, and credits are required." } );
    }

    const existing = await CourseModel.findOne( { code } );
    if ( existing )
    {
      return res.status( 400 ).json( { message: "Course with this code already exists." } );
    }

    const newCourse = new CourseModel( {
      name,
      code,
      description: description || "",
      credits,
    } );

    await newCourse.save();

    res.status( 201 ).json( {
      success: true,
      message: "Course created successfully",
      course: newCourse,
    } );
  } catch ( error )
  {
    console.error( "Error creating course:", error );
    res.status( 500 ).json( { message: "Internal Server Error" } );
  }
};


export const assignCourse = async ( req, res ) =>
{
  try
  {
    const { facultyId, courseId } = req.body;

    if ( !facultyId || !courseId )
    {
      return res.status( 400 ).json( { message: "Faculty ID and Course ID are required." } );
    }

    const faculty = await UserModel.findById( facultyId );
    if ( !faculty || faculty.role !== "Faculty" )
    {
      return res.status( 400 ).json( { message: "Invalid faculty." } );
    }

    const course = await CourseModel.findById( courseId );
    if ( !course )
    {
      return res.status( 400 ).json( { message: "Invalid course." } );
    }

    if ( course.faculty )
    {
      return res.status( 400 ).json( { message: "Course already assigned to another faculty." } );
    }

    course.faculty = faculty._id;
    await course.save();

    faculty.assignedCourses.push( course._id );
    await faculty.save();

    res.status( 200 ).json( {
      success: true,
      message: "Course assigned successfully!",
      course,
      faculty,
    } );
  } catch ( error )
  {
    console.error( "Error assigning course:", error );
    res.status( 500 ).json( { message: "Internal Server Error" } );
  }
};


export const getAvailableFaculties = async ( req, res ) =>
{
  try
  {
    const faculties = await UserModel.find( {
      role: "Faculty",
      isApproved: true,
    } )
      .populate( "assignedCourses", "name code" )
      .lean();

    const availableFaculties = faculties.filter(
      ( faculty ) => !faculty.assignedCourses || faculty.assignedCourses.length === 0
    );

    res.status( 200 ).json( { success: true, faculties: availableFaculties } );
  } catch ( error )
  {
    console.error( "Error fetching faculties:", error );
    res.status( 500 ).json( { message: "Error fetching faculties" } );
  }
};


export const getUnassignedCourses = async ( req, res ) =>
{
  try
  {
    const courses = await CourseModel.find( { faculty: { $exists: false } } );
    res.status( 200 ).json( { success: true, courses } );
  } catch ( error )
  {
    res.status( 500 ).json( { message: "Error fetching courses" } );
  }
};

export const getAssignedCourses = async ( req, res ) =>
{
  try
  {
    const assigned = await CourseModel.find( { faculty: { $exists: true } } )
      .populate( "faculty", "name email collegeId" )
      .select( "name code faculty" );

    res.status( 200 ).json( { success: true, assigned } );
  } catch ( error )
  {
    res.status( 500 ).json( { message: "Error fetching assigned courses" } );
  }
};



export const generateAdminReport = async ( req, res ) =>
{
  try
  {
    const { facultyId } = req.params;

    const faculty = await UserModel.findById( facultyId )
      .populate( "assignedCourses", "name code" )
      .lean();

    if ( !faculty )
    {
      return res.status( 404 ).json( { message: "Faculty not found" } );
    }

    const doc = new PDFDocument( { margin: 40 } );
    const filename = `Faculty_Report_${ faculty.name }.pdf`;

    res.setHeader( "Content-Disposition", `attachment; filename="${ filename }"` );
    res.setHeader( "Content-Type", "application/pdf" );

    doc.pipe( res );

    doc.fontSize( 20 ).text( "Admin Report", { align: "center" } );
    doc.moveDown();
    doc
      .fontSize( 12 )
      .text( `Name: ${ faculty.name }` )
      .text( `Email: ${ faculty.email }` )
      .text( `College ID: ${ faculty.collegeId }` )
      .moveDown();

    for ( const course of faculty.assignedCourses )
    {
      doc
        .fontSize( 16 )
        .text( `Course: ${ course.name } (${ course.code })`, { underline: true } );
      doc.moveDown( 0.5 );

      const enrollments = await Enrollment.find( { course: course._id } )
        .populate( "student", "name email" )
        .lean();

      if ( enrollments.length === 0 )
      {
        doc.fontSize( 12 ).text( "No students enrolled.\n" );
        continue;
      }

      for ( const enroll of enrollments )
      {
        const student = enroll.student;

        const submissions = await Submission.find( { student: student._id } )
          .populate( {
            path: "task",
            select: "title course",
            match: { course: course._id },
          } )
          .lean();

        if ( submissions.length === 0 ) continue;

        for ( const sub of submissions )
        {
          if ( !sub.task ) continue;

          const evaluation = await Evaluation.findOne( {
            submission: sub._id,
          } )
            .populate( "evaluator", "name" )
            .lean();

          doc
            .fontSize( 12 )
            .text( `• Student: ${ student.name } (${ student.email })` );
          doc.text( `  Task: ${ sub.task.title }` );
          doc.text(
            `  Marks: ${ evaluation?.marks ?? "Not Evaluated" } / ${ evaluation?.totalMarks ?? 100
            }`
          );
          doc.text( `  Evaluator: ${ evaluation?.evaluator?.name ?? "N/A" }` );
          doc.moveDown( 0.3 );
        }
      }

      doc.moveDown( 1 );
    }

    doc.end();
  } catch ( error )
  {
    console.error( "Error generating faculty report:", error );
    res.status( 500 ).json( { message: "Error generating faculty report" } );
  }
};