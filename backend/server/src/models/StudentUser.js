import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    approved: {
      type: Boolean,
      default: false, // default to false, admin must approve later
    },
    role: {
      type: String,
      default: "Student",
    },
  },
  {
    timestamps: true,
  }
);

const StudentUser = mongoose.model("StudentUser", studentSchema);

export default StudentUser;
