import mongoose from "mongoose";

const assignedCourseSchema = new mongoose.Schema(
  {
    facultyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyUser",
      required: true,
    },
    facultyName: {
      type: String,
      required: true
    },
    course: {
      type: String,
      required: true,
    },
    courseName: {  // ✅ new field
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const AssignedCourse = mongoose.model( "AssignedCourse", assignedCourseSchema );
