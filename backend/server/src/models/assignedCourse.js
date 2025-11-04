import mongoose from "mongoose";

const assignedCourseSchema = new mongoose.Schema(
  {
    faculty: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const AssignedCourse= mongoose.model("AssignedCourse", assignedCourseSchema);
