import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: { type: String, required: true },

  collegeId: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["Admin", "Faculty", "Evaluator", "Student"],
    required: true,
  },

  /**
   * Approval Rules:
   * - Admin → auto-approved
   * - Faculty → needs Admin approval
   * - Evaluator/Student → needs Faculty approval
   */
  isApproved: {
    type: Boolean,
    default: function () {
      if (this.role === "Admin") return true;
      return false; // Faculty, Evaluator, Student need manual approval
    },
  },

  // Faculty → courses assigned by admin
  assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

  // Evaluator → students mapped by faculty
  mappedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // Faculty who approved Evaluator/Student (optional reference)
  approvedByFaculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // Admin who approved Faculty (optional reference)
  approvedByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
