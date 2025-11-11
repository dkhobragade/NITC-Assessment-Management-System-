import { uploadToCloudinary } from "../middlewares/upload.js";
import TaskModel from "../models/TaskModel.js";
import UserModel from "../models/UserModel.js";
import XLSX from "xlsx";
import PDFDocument from "pdfkit";
import Submission from "../models/Submission.js";
import Enrollment from "../models/Enrollment.js";

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

export const createTask = async ( req, res ) =>
{
  try
  {
    const { title, description, deadline } = req.body;

    if ( !title || !description || !deadline )
    {
      return res.status( 400 ).json( { success: false, message: 'All fields are required' } );
    }

    if ( !req.file )
    {
      return res.status( 400 ).json( { success: false, message: 'PDF file is required' } );
    }

    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      Date.now() + '-' + req.file.originalname.split( '.' )[ 0 ]
    );

    const task = await TaskModel.create( {
      title,
      description,
      deadline: new Date( deadline ),
      course: req.user.assignedCourses[ 0 ],
      createdBy: req.user._id,
      pdfFile: cloudinaryResult.secure_url,
    } );

    res.status( 201 ).json( { success: true, task, message: 'Task created successfully' } );
  } catch ( err )
  {
    console.error( err );
    res.status( 500 ).json( { success: false, message: err.message } );
  }
}

export const studentUploadPDF = async ( req, res ) =>
{
  try
  {
    if ( !req.file )
      return res.status( 400 ).json( { success: false, message: "PDF file required" } );

    const taskId = req.params.taskId;
    const task = await TaskModel.findById( taskId );

    if ( !task ) return res.status( 404 ).json( { success: false, message: "Task not found" } );

    if ( !task.submissions ) task.submissions = [];

    task.submissions.push( {
      student: req.user._id,
      pdfFile: req.file.path,
    } );

    await task.save();

    res.status( 200 ).json( { success: true, message: "PDF uploaded successfully" } );
  } catch ( err )
  {
    console.error( err );
    res.status( 500 ).json( { success: false, message: err.message } );
  }
};

export const getTasks = async ( req, res ) =>
{
  try
  {
    const facultyId = req.user._id;

    const tasks = await TaskModel.find( { createdBy: facultyId } )
      .populate( "course", "name code" )
      .sort( { createdAt: -1 } )
      .lean();

    const taskCount = tasks.length;

    res.status( 200 ).json( {
      success: true,
      totalTasks: taskCount,
      tasks,
    } );
  } catch ( err )
  {
    console.error( "Error fetching faculty tasks:", err );
    res.status( 500 ).json( {
      success: false,
      message: "Server error while fetching tasks",
    } );
  }
};

export const getAssignedCoursesForFaculty = async ( req, res ) =>
{
  try
  {
    const facultyId = req.user.id;

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
      .sort( { createdAt: -1 } );

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
      .sort( { createdAt: -1 } );

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


export const exportStudentsExcel = async ( req, res ) =>
{
  try
  {
    const students = await UserModel.find( { role: "Student" } ).lean();

    if ( !students || students.length === 0 )
    {
      return res.status( 404 ).json( { success: false, message: "No students found" } );
    }

    const excelData = students.map( ( stu ) => ( {
      Name: stu.name,
      Email: stu.email,
      CollegeID: stu.collegeId,
      Role: stu.role,
      IsApproved: stu.isApproved,
      CreatedAt: stu.createdAt.toISOString(),
    } ) );

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet( excelData );

    XLSX.utils.book_append_sheet( wb, ws, "Students" );

    const buf = XLSX.write( wb, { type: "buffer", bookType: "xlsx" } );

    res.setHeader( "Content-Disposition", "attachment; filename=students.xlsx" );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send( buf );
  } catch ( err )
  {
    console.error( err );
    res.status( 500 ).json( { success: false, message: err.message } );
  }
};

export const exportEvaluatorExcel = async ( req, res ) =>
{
  try
  {
    const evalutor = await UserModel.find( { role: "Evaluator" } ).lean();

    if ( !evalutor || evalutor.length === 0 )
    {
      return res.status( 404 ).json( { success: false, message: "No Evaluator found" } );
    }

    const excelData = evalutor.map( ( eva ) => ( {
      Name: eva.name,
      Email: eva.email,
      CollegeID: eva.collegeId,
      Role: eva.role,
      IsApproved: eva.isApproved,
      CreatedAt: eva.createdAt.toISOString(),
    } ) );

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet( excelData );

    XLSX.utils.book_append_sheet( wb, ws, "evalutor" );

    const buf = XLSX.write( wb, { type: "buffer", bookType: "xlsx" } );

    res.setHeader( "Content-Disposition", "attachment; filename=evalutor.xlsx" );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send( buf );
  } catch ( err )
  {
    console.error( err );
    res.status( 500 ).json( { success: false, message: err.message } );
  }
};


const parseExcel = ( buffer ) =>
{
  const workbook = XLSX.read( buffer, { type: "buffer" } );
  const sheetName = workbook.SheetNames[ 0 ];
  const sheet = workbook.Sheets[ sheetName ];
  return XLSX.utils.sheet_to_json( sheet );
};


export const uploadExcelAndMap = async ( req, res ) =>
{
  if ( !req.user )
  {
    return res.status( 401 ).json( { success: false, message: "User not authenticated" } );
  }

  if ( req.user.role !== "Faculty" )
  {
    return res.status( 403 ).json( { success: false, message: "Only faculty can upload Excel" } );
  }

  try
  {
    const evalFile = req.files[ "evaluators" ]?.[ 0 ];
    const stuFile = req.files[ "students" ]?.[ 0 ];

    if ( !evalFile || !stuFile )
    {
      return res.status( 400 ).json( { success: false, message: "Both files are required" } );
    }

    const evaluators = parseExcel( evalFile.buffer );
    const students = parseExcel( stuFile.buffer );

    const savedEvaluators = await Promise.all( evaluators.map( async ( e ) =>
    {
      return await UserModel.findOneAndUpdate(
        { email: e.Email },
        {
          name: e.Name,
          collegeId: e.CollegeID,
          role: "Evaluator",
          isApproved: e.IsApproved
        },
        { upsert: true, new: true }
      );
    } ) );

    const savedStudents = await Promise.all( students.map( async ( s ) =>
    {
      return await UserModel.findOneAndUpdate(
        { email: s.Email },
        {
          name: s.Name,
          collegeId: s.CollegeID,
          role: "Student",
          isApproved: s.IsApproved
        },
        { upsert: true, new: true }
      );
    } ) );

    res.status( 200 ).json( { success: true, evaluators: savedEvaluators, students: savedStudents } );
  } catch ( err )
  {
    console.error( err );
    res.status( 500 ).json( { success: false, message: err.message } );
  }
};

export const randomMapEvaluator = async ( req, res ) =>
{
  try
  {

    const facultyId = req.user._id;

    const evaluators = await UserModel.find( { role: "Evaluator" } );
    const students = await UserModel.find( { role: "Student" } );

    for ( let i = students.length - 1; i > 0; i-- )
    {
      const j = Math.floor( Math.random() * ( i + 1 ) );
      [ students[ i ], students[ j ] ] = [ students[ j ], students[ i ] ];
    }

    for ( let i = 0; i < students.length; i++ )
    {
      const evalIndex = i % evaluators.length;
      evaluators[ evalIndex ].mappedStudents.push( students[ i ]._id );
      await evaluators[ evalIndex ].save();
    }

    res.status( 200 ).json( { success: true, message: "Random mapping completed!" } );
  } catch ( err )
  {
    console.error( err );
    res.status( 500 ).json( { success: false, message: err.message } );
  }
};


export const saveSingleMapping = async ( req, res ) =>
{
  try
  {
    const { evaluatorId, studentId } = req.body;

    if ( !evaluatorId || !studentId )
    {
      return res.status( 400 ).json( { success: false, message: "Evaluator or student ID missing" } );
    }

    const evaluator = await UserModel.findById( evaluatorId );
    const student = await UserModel.findById( studentId );

    if ( !evaluator || !student )
    {
      return res.status( 404 ).json( { success: false, message: "Evaluator or student not found" } );
    }

    if ( !evaluator.mappedStudents.includes( student._id ) )
    {
      evaluator.mappedStudents.push( student._id );
      await evaluator.save();
    }

    return res.status( 200 ).json( { success: true, message: "Mapping saved successfully" } );
  } catch ( err )
  {
    console.error( err );
    return res.status( 500 ).json( { success: false, message: err.message } );
  }
};



export const generateFacultyReport = async ( req, res ) =>
{
  try
  {
    const facultyId = req.user._id;

    const faculty = await UserModel.findById( facultyId )
      .populate( "assignedCourses", "name code description" )
      .lean();

    if ( !faculty )
    {
      return res.status( 404 ).json( { success: false, message: "Faculty not found" } );
    }

    const doc = new PDFDocument( { margin: 50 } );
    const chunks = [];
    doc.on( "data", ( chunk ) => chunks.push( chunk ) );
    doc.on( "end", () =>
    {
      const pdfBuffer = Buffer.concat( chunks );
      res.setHeader( "Content-Type", "application/pdf" );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${ faculty.name }_report.pdf`
      );
      res.send( pdfBuffer );
    } );

    doc.fontSize( 20 ).text( "Faculty Report", { align: "center" } );
    doc.moveDown();

    doc.fontSize( 14 ).text( `Name: ${ faculty.name }` );
    doc.text( `Email: ${ faculty.email }` );
    doc.text( `Faculty ID: ${ faculty._id }` );
    doc.moveDown();

    for ( const course of faculty.assignedCourses )
    {
      doc.fontSize( 16 ).text( `Course: ${ course.name } (${ course.code })` );
      doc.fontSize( 12 ).text( `Description: ${ course.description || "N/A" }` );
      doc.moveDown( 0.5 );

      const enrollments = await Enrollment.find( { course: course._id } )
        .populate( "student", "name email" )
        .lean();

      if ( enrollments.length === 0 )
      {
        doc.text( "No students enrolled.\n" );
        continue;
      }

      doc.text( `Total Students: ${ enrollments.length }` );
      doc.moveDown( 0.5 );

      for ( const { student } of enrollments )
      {
        doc.font( "Helvetica-Bold" ).text( `👤 Student: ${ student.name } (${ student.email })` );
        doc.font( "Helvetica" ).moveDown( 0.2 );

        const submissions = await Submission.find( { student: student._id } )
          .populate( {
            path: "task",
            match: { course: course._id },
            select: "title",
          } )
          .lean();

        if ( !submissions.length )
        {
          doc.text( "   - No submissions found.\n" );
          continue;
        }

        for ( const sub of submissions )
        {
          if ( !sub.task ) continue;

          const evalData = await EvaluationModel.findOne( { submission: sub._id } ).lean();
          const marks = evalData ? `${ evalData.marks }/${ evalData.totalMarks }` : "Not evaluated";

          doc.text( `   • Task: ${ sub.task.title }` );
          doc.text( `     Marks: ${ marks }` );
          if ( evalData?.remarks ) doc.text( `     Remarks: ${ evalData.remarks }` );
          doc.moveDown( 0.2 );
        }
        doc.moveDown( 0.5 );
      }

      doc.moveDown( 1 );
      doc.text( "----------------------------------------" );
      doc.moveDown( 1 );
    }

    doc.end();
  } catch ( error )
  {
    console.error( "Error generating faculty report:", error );
    res.status( 500 ).json( { success: false, message: "Failed to generate report" } );
  }
};


