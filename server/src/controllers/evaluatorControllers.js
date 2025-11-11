import Enrollment from "../models/Enrollment.js";
import Evaluation from "../models/Evaluation.js";
import Submission from "../models/Submission.js";
import TaskModel from "../models/TaskModel.js";
import UserModel from "../models/UserModel.js";
import PDFDocument from "pdfkit";

export const getAllTasks = async ( req, res ) =>
{
  try
  {
    const tasks = await TaskModel.find()
      .populate( "course", "name code" )
      .populate( "createdBy", "name email" )
      .populate( "submissions.student", "name email" )
      .sort( { createdAt: -1 } )
      .lean();

    res.status( 200 ).json( {
      success: true,
      totalTasks: tasks.length,
      tasks,
    } );
  } catch ( err )
  {
    console.error( "Error fetching all tasks:", err );
    res.status( 500 ).json( {
      success: false,
      message: "Server error while fetching tasks",
    } );
  }
};


export const getAssignedStudentsCount = async ( req, res ) =>
{
  try
  {
    const userId = req.user._id;

    const evaluator = await UserModel.findById( userId )
      .select( "name mappedStudents role" )
      .lean();

    if ( !evaluator )
    {
      return res.status( 404 ).json( {
        success: false,
        message: "Evaluator not found",
      } );
    }

    if ( evaluator.role !== "Evaluator" )
    {
      return res.status( 403 ).json( {
        success: false,
        message: "User is not an evaluator",
      } );
    }

    const data = {
      evaluatorId: evaluator._id,
      evaluatorName: evaluator.name,
      assignedStudentsCount: evaluator.mappedStudents.length || 0,
    };

    res.status( 200 ).json( {
      success: true,
      evaluator: data,
    } );
  } catch ( err )
  {
    console.error( "Error fetching assigned students count:", err );
    res.status( 500 ).json( {
      success: false,
      message: "Server error while fetching assigned students",
    } );
  }
};



export const assignMarksToStudent = async ( req, res ) =>
{
  try
  {
    const { submissionId } = req.params;
    const { marks, remarks } = req.body;
    const evaluatorId = req.user._id;

    const submission = await Submission.findById( submissionId );
    if ( !submission )
    {
      return res.status( 404 ).json( { success: false, message: "Submission not found" } );
    }

    let evaluation = await Evaluation.findOne( { submission: submissionId } );

    if ( evaluation )
    {
      evaluation.marks = marks;
      evaluation.remarks = remarks;
      evaluation.evaluator = evaluatorId;
      evaluation.evaluatedAt = new Date();
      await evaluation.save();
    } else
    {
      evaluation = await Evaluation.create( {
        submission: submissionId,
        evaluator: evaluatorId,
        marks,
        remarks,
      } );
    }

    submission.status = "Evaluated";
    await submission.save();

    res.status( 200 ).json( {
      success: true,
      message: "Marks assigned successfully",
      evaluation,
    } );
  } catch ( err )
  {
    console.error( "Error assigning marks:", err );
    res.status( 500 ).json( {
      success: false,
      message: "Server error while assigning marks",
    } );
  }
};



export const getAssignedStudentsForTask = async ( req, res ) =>
{
  try
  {
    const { taskId } = req.params;

    const task = await TaskModel.findById( taskId )
      .populate( "submissions.student", "name collegeId email" )
      .lean();

    if ( !task )
    {
      return res.status( 404 ).json( {
        success: false,
        message: "Task not found",
      } );
    }

    const submissionIds = task.submissions.map( ( s ) => s._id );
    const evaluations = await Evaluation.find( {
      submission: { $in: submissionIds },
    } ).lean();

    const studentsData = task.submissions.map( ( sub ) =>
    {
      const evaluation = evaluations.find(
        ( ev ) => ev.submission.toString() === sub._id.toString()
      );
      return {
        submissionId: sub._id,
        studentId: sub.student?._id,
        name: sub.student?.name || "Unknown",
        rollNo: sub.student?.collegeId || "N/A",
        pdfUrl: sub.pdfFile,
        marks: evaluation?.marks || null,
        evaluatedAt: evaluation?.evaluatedAt || null,
      };
    } );

    res.status( 200 ).json( {
      success: true,
      taskTitle: task.title,
      totalStudents: studentsData.length,
      students: studentsData,
    } );
  } catch ( err )
  {
    console.error( "Error fetching assigned students:", err );
    res.status( 500 ).json( {
      success: false,
      message: "Server error while fetching assigned students",
    } );
  }
};



export const getSubmittedTasksForEvaluator = async ( req, res ) =>
{
  try
  {
    const evaluatorId = req.user._id;

    const evaluator = await UserModel.findById( evaluatorId ).select( "mappedStudents" );
    if ( !evaluator )
    {
      return res.status( 404 ).json( { success: false, message: "Evaluator not found" } );
    }

    if ( !evaluator.mappedStudents || evaluator.mappedStudents.length === 0 )
    {
      return res.status( 200 ).json( {
        success: true,
        submissions: [],
        message: "No students mapped to this evaluator",
      } );
    }

    const submissions = await Submission.find( {
      student: { $in: evaluator.mappedStudents },
    } )
      .populate( "student", "name rollNo email" )
      .populate( {
        path: "task",
        select: "title description course",
        populate: { path: "course", select: "name code" },
      } )
      .lean();

    if ( !submissions || submissions.length === 0 )
    {
      return res.status( 200 ).json( { success: true, submissions: [] } );
    }

    const formatted = submissions.map( ( s ) => ( {
      submissionId: s._id,
      studentName: s.student?.name || "N/A",
      rollNo: s.student?.rollNo || "N/A",
      taskTitle: s.task?.title || "Untitled Task",
      courseName: s.task?.course?.name || "Unknown Course",
      courseCode: s.task?.course?.code || "",
      pdfUrl: s.fileUrl,
      status: s.status,
      submittedAt: s.submittedAt,
    } ) );

    res.status( 200 ).json( { success: true, submissions: formatted } );
  } catch ( err )
  {
    console.error( "❌ Error fetching evaluator submissions:", err );
    res.status( 500 ).json( { success: false, message: "Server error" } );
  }
};


export const getAssignedStudentsWithDetails = async ( req, res ) =>
{
  try
  {
    const evaluatorId = req.user._id;

    const evaluator = await UserModel.findById( evaluatorId )
      .select( "name mappedStudents role" )
      .lean();

    if ( !evaluator )
    {
      return res.status( 404 ).json( { success: false, message: "Evaluator not found" } );
    }

    if ( evaluator.role !== "Evaluator" )
    {
      return res.status( 403 ).json( { success: false, message: "User is not an evaluator" } );
    }

    const students = await UserModel.find( {
      _id: { $in: evaluator.mappedStudents },
    } )
      .select( "name email collegeId role createdAt" )
      .lean();

    const enrichedStudents = await Promise.all(
      students.map( async ( student ) =>
      {
        const enrollments = await Enrollment.find( { student: student._id } )
          .populate( { path: "course", select: "courseName courseCode description" } )
          .lean();

        const submissions = await Submission.find( { student: student._id } )
          .populate( { path: "task", select: "title description dueDate" } )
          .lean();

        const enrichedSubmissions = await Promise.all(
          submissions.map( async ( sub ) =>
          {
            const evaluation = await Evaluation.findOne( { submission: sub._id } )
              .select( "marks remarks evaluator evaluatedAt" )
              .populate( "evaluator", "name email" )
              .lean();

            return {
              submissionId: sub._id,
              taskId: sub.task?._id,
              taskTitle: sub.task?.title,
              status: sub.status,
              fileUrl: sub.fileUrl,
              submittedAt: sub.submittedAt,
              marks: evaluation?.marks || null,
              remarks: evaluation?.remarks || null,
              evaluatedBy: evaluation?.evaluator?.name || null,
              evaluatedAt: evaluation?.evaluatedAt || null,
            };
          } )
        );

        return {
          ...student,
          enrolledCourses: enrollments.map( ( enr ) => ( {
            courseId: enr.course?._id,
            courseName: enr.course?.courseName,
            courseCode: enr.course?.courseCode,
            enrollmentCode: enr.enrollmentCode,
            enrolledAt: enr.enrolledAt,
          } ) ),
          submissions: enrichedSubmissions,
        };
      } )
    );

    res.status( 200 ).json( {
      success: true,
      evaluator: {
        evaluatorId,
        evaluatorName: evaluator.name,
        assignedStudentsCount: students.length,
      },
      assignedStudents: enrichedStudents,
    } );
  } catch ( err )
  {
    console.error( "Error fetching evaluator's assigned students:", err );
    res.status( 500 ).json( {
      success: false,
      message: "Server error while fetching assigned students with details",
    } );
  }
};


export const generateEvaluatorReport = async ( req, res ) =>
{
  try
  {
    const evaluatorId = req.user._id;

    const evaluator = await UserModel.findById( evaluatorId )
      .select( "name email collegeId mappedStudents" )
      .populate( {
        path: "mappedStudents",
        select: "name email collegeId",
      } );

    if ( !evaluator )
    {
      return res.status( 404 ).json( { success: false, message: "Evaluator not found" } );
    }

    const evaluations = await Evaluation.find( { evaluator: evaluatorId } )
      .populate( {
        path: "submission",
        populate: [
          { path: "student", select: "name email collegeId" },
          { path: "task", select: "title description" },
        ],
      } )
      .lean();

    res.setHeader( "Content-Type", "application/pdf" );
    res.setHeader( "Content-Disposition", `attachment; filename=evaluator_report.pdf` );

    const doc = new PDFDocument( { margin: 50 } );
    doc.pipe( res );

    doc.fontSize( 20 ).text( "Evaluator Performance Report", { align: "center" } );
    doc.moveDown();
    doc.fontSize( 12 ).text( `Evaluator Name: ${ evaluator.name }` );
    doc.text( `Email: ${ evaluator.email }` );
    doc.text( `College ID: ${ evaluator.collegeId }` );
    doc.moveDown();

    doc.fontSize( 14 ).text( "Assigned Students:", { underline: true } );
    evaluator.mappedStudents.forEach( ( student, index ) =>
    {
      doc.text( `${ index + 1 }. ${ student.name } (${ student.email })` );
    } );

    doc.moveDown().fontSize( 14 ).text( "Evaluations Done:", { underline: true } );
    doc.moveDown( 0.5 );

    if ( evaluations.length === 0 )
    {
      doc.text( "No evaluations found.", { italic: true } );
    } else
    {
      evaluations.forEach( ( evalData, idx ) =>
      {
        const sub = evalData.submission;
        if ( !sub ) return;
        doc
          .fontSize( 12 )
          .text(
            `${ idx + 1 }. Student: ${ sub.student?.name } (${ sub.student?.email })`
          );
        doc.text( `   Task: ${ sub.task?.title || "Untitled Task" }` );
        doc.text( `   Marks: ${ evalData.marks }/${ evalData.totalMarks }` );
        if ( evalData.remarks ) doc.text( `   Remarks: ${ evalData.remarks }` );
        doc.moveDown( 0.5 );
      } );
    }

    doc.end();
  } catch ( error )
  {
    console.error( "Error generating evaluator report:", error );
    res.status( 500 ).json( { success: false, message: "Failed to generate report" } );
  }
};