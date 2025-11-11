import { uploadToCloudinary } from "../middlewares/upload.js";
import CourseModel from "../models/CourseModel.js";
import EnrollmentModel from "../models/Enrollment.js";
import Evaluation from "../models/Evaluation.js";
import Submission from "../models/Submission.js";
import TaskModel from "../models/TaskModel.js";

export const enrollStudentByCode = async ( req, res ) =>
{
    try
    {
        const studentId = req.user._id;
        const { enrollmentCode } = req.body;

        if ( !enrollmentCode )
        {
            return res.status( 400 ).json( {
                success: false,
                message: "Enrollment code is required",
            } );
        }

        const course = await CourseModel.findOne( { code: enrollmentCode } );
        if ( !course )
        {
            return res.status( 404 ).json( {
                success: false,
                message: "Course not found with this enrollment code",
            } );
        }

        const alreadyEnrolled = await EnrollmentModel.findOne( {
            student: studentId,
            course: course._id,
        } );

        if ( alreadyEnrolled )
        {
            return res.status( 400 ).json( {
                success: false,
                message: "You are already enrolled in this course",
            } );
        }

        const enrollment = new EnrollmentModel( {
            student: studentId,
            course: course._id,
            enrollmentCode: course.code,
        } );

        await enrollment.save();

        if ( !course.students.includes( studentId ) )
        {
            course.students.push( studentId );
            await course.save();
        }

        return res.status( 200 ).json( {
            success: true,
            message: `Enrolled successfully in ${ course.name }`,
            course: {
                _id: course._id,
                name: course.name,
                code: course.code,
            },
        } );
    } catch ( err )
    {
        console.error( "Error enrolling student:", err );

        return res.status( 500 ).json( {
            success: false,
            message: err.message || "Server error while enrolling student",
        } );
    }
};



export const getStudentEnrollments = async ( req, res ) =>
{
    try
    {
        const studentId = req.user._id;

        const enrollments = await EnrollmentModel.find( { student: studentId } )
            .populate( {
                path: "course",
                select: "name code description credits faculty students",
                populate: {
                    path: "faculty",
                    select: "name email",
                },
            } )
            .lean();

        const enrolledCourses = enrollments.map( ( enroll ) => ( {
            enrollmentId: enroll._id,
            courseId: enroll.course._id,
            name: enroll.course.name,
            code: enroll.course.code,
            description: enroll.course.description,
            credits: enroll.course.credits,
            faculty: enroll.course.faculty
                ? {
                    _id: enroll.course.faculty._id,
                    name: enroll.course.faculty.name,
                    email: enroll.course.faculty.email,
                }
                : null,
            totalStudents: enroll.course.students.length,
            enrolledAt: enroll.enrolledAt,
        } ) );

        return res.status( 200 ).json( {
            success: true,
            totalCourses: enrolledCourses.length,
            courses: enrolledCourses,
        } );
    } catch ( err )
    {
        console.error( "Error fetching student enrollments:", err );
        return res.status( 500 ).json( {
            success: false,
            message: "Server error while fetching enrollments",
        } );
    }
};



export const getStudentEnrollmentsWithTaskCount = async ( req, res ) =>
{
    try
    {
        const studentId = req.user._id;

        const enrollments = await EnrollmentModel.find( { student: studentId } )
            .populate( {
                path: "course",
                select: "name code description credits faculty students",
                populate: {
                    path: "faculty",
                    select: "name email",
                },
            } )
            .lean();

        const coursesWithTaskCount = await Promise.all(
            enrollments.map( async ( enroll ) =>
            {
                const course = enroll.course;

                const taskCount = await TaskModel.countDocuments( { course: course._id } );

                return {
                    enrollmentId: enroll._id,
                    courseId: course._id,
                    name: course.name,
                    code: course.code,
                    description: course.description,
                    credits: course.credits,
                    faculty: course.faculty
                        ? {
                            _id: course.faculty._id,
                            name: course.faculty.name,
                            email: course.faculty.email,
                        }
                        : null,
                    totalStudents: course.students.length,
                    enrolledAt: enroll.enrolledAt,
                    taskCount,
                };
            } )
        );

        return res.status( 200 ).json( {
            success: true,
            totalCourses: coursesWithTaskCount.length,
            courses: coursesWithTaskCount,
        } );
    } catch ( err )
    {
        console.error( "Error fetching student enrollments with tasks:", err );
        return res.status( 500 ).json( {
            success: false,
            message: "Server error while fetching enrollments and tasks",
        } );
    }
};


export const getTasksForEnrolledCourse = async ( req, res ) =>
{
    try
    {
        const studentId = req.user._id;
        const { courseId } = req.params;

        const enrollment = await EnrollmentModel.findOne( { student: studentId, course: courseId } );
        if ( !enrollment )
        {
            return res.status( 403 ).json( { success: false, message: "Student not enrolled in this course" } );
        }

        const tasks = await TaskModel.find( { course: courseId } )
            .populate( "course", "name code" )
            .populate( "createdBy", "name email" )
            .lean();

        for ( const task of tasks )
        {
            const submission = await Submission.findOne( { student: studentId, task: task._id } ).lean();
            task.submissions = submission ? [ submission ] : [];
        }

        res.status( 200 ).json( {
            success: true,
            totalTasks: tasks.length,
            tasks,
        } );
    } catch ( err )
    {
        console.error( "Error fetching tasks for course:", err );
        res.status( 500 ).json( {
            success: false,
            message: "Server error while fetching tasks",
        } );
    }
};


export const studentUploadPDF = async ( req, res ) =>
{
    try
    {
        const studentId = req.user._id;
        const { taskId } = req.params;

        if ( !req.file )
        {
            return res.status( 400 ).json( { success: false, message: "No file uploaded" } );
        }

        const task = await TaskModel.findById( taskId );
        if ( !task )
        {
            return res.status( 404 ).json( { success: false, message: "Task not found" } );
        }

        const result = await uploadToCloudinary( req.file.buffer, `${ studentId }-${ taskId }` );

        let submission = await Submission.findOne( { student: studentId, task: taskId } );

        if ( submission )
        {
            submission.fileUrl = result.secure_url;
            submission.submittedAt = new Date();
            submission.status = "Submitted";
            await submission.save();
        } else
        {
            submission = await Submission.create( {
                student: studentId,
                task: taskId,
                fileUrl: result.secure_url,
                fileName: req.file.originalname,
                status: "Submitted",
            } );
        }

        return res.status( 200 ).json( {
            success: true,
            message: "File uploaded successfully",
            submission,
        } );
    } catch ( err )
    {
        console.error( "Error uploading submission:", err );
        return res.status( 500 ).json( {
            success: false,
            message: "Server error while uploading PDF",
        } );
    }
};



export const getTasksForCourse = async ( req, res ) =>
{
    try
    {
        const { courseId } = req.params;
        const studentId = req.user._id;

        console.log( "courseId", courseId, studentId )

        const tasks = await TaskModel.find( { course: courseId } )
            .populate( "course", "name code description" )
            .populate( "createdBy", "name email" )
            .lean();

        console.log( "tasks", tasks )

        const filteredTasks = tasks.map( ( task ) =>
        {
            const mySubmission = task.submissions?.find(
                ( sub ) => sub.student?.toString() === studentId.toString()
            );

            console.log( "filteredTasks", filteredTasks )

            return {
                ...task,
                submissions: mySubmission ? [ mySubmission ] : [],
            };
        } );

        res.status( 200 ).json( {
            success: true,
            tasks: filteredTasks,
        } );
    } catch ( err )
    {
        console.error( "Error fetching course tasks:", err );
        res.status( 500 ).json( {
            success: false,
            message: "Server error while fetching course tasks",
        } );
    }
};


export const getStudentResults = async ( req, res ) =>
{
    try
    {
        const studentId = req.user._id;

        const submissions = await Submission.find( { student: studentId } )
            .populate( {
                path: "task",
                select: "title course",
                populate: {
                    path: "course",
                    model: "Course",
                    select: "courseName courseCode name code",
                },
            } )
            .populate( {
                path: "student",
                select: "name collegeId",
            } )
            .lean();

        const results = await Promise.all(
            submissions.map( async ( sub ) =>
            {
                const evaluation = await Evaluation.findOne( { submission: sub._id } )
                    .populate( "evaluator", "name" )
                    .lean();

                console.log( "Course populated:", sub.task?.course );

                const course = sub.task?.course || {};

                return {
                    submissionId: sub._id,
                    courseName: course.courseName || course.name || "N/A",
                    courseCode: course.courseCode || course.code || "",
                    taskTitle: sub.task?.title || "Untitled Task",
                    fileUrl: sub.fileUrl,
                    status: sub.status,
                    submittedAt: sub.submittedAt,
                    marks: evaluation?.marks ?? null,
                    totalMarks: evaluation?.totalMarks ?? 100,
                    remarks: evaluation?.remarks || "",
                    evaluatedAt: evaluation?.evaluatedAt || null,
                    evaluatedBy: evaluation?.evaluator?.name || null,
                };
            } )
        );

        res.status( 200 ).json( {
            success: true,
            count: results.length,
            results,
        } );
    } catch ( err )
    {
        console.error( "Error fetching student results:", err );
        res.status( 500 ).json( {
            success: false,
            message: "Server error while fetching student results",
        } );
    }
};



export const getAllCoursesBasic = async ( req, res ) =>
{
    try
    {
        const courses = await CourseModel.find( {}, "name code" ).lean();
        res.status( 200 ).json( {
            success: true,
            courses,
        } );
    } catch ( error )
    {
        console.error( "Error fetching course list:", error );
        res.status( 500 ).json( {
            success: false,
            message: "Error fetching course list",
        } );
    }
};