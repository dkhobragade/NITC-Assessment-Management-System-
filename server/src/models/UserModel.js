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
  role: {
    type: String,
    enum: ["Admin", "Faculty", "Evaluator", "Student"],
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: function () {
      return this.role === "Student" || this.role === "Evaluator" ? true : false;
    },
  },
  // only used for Faculty
  assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

  // only used for Evaluator → mapped students
  mappedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
