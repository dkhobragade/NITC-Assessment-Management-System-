import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyUser", // or "AdminUser" depending on who creates the task
      required: false,
    },
    pdfFile: {
      type: String, // store the file URL or path (e.g., from Firebase, AWS, or local storage)
      required: false,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
