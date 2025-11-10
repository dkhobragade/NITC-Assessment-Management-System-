import mongoose from 'mongoose'


const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pdfFile: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});


const taskSchema = new mongoose.Schema( {
  title: { type: String, required: true },
  description: String,
  deadline: Date,
  pdfFile: { type: String },
  submissions: [submissionSchema],
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Faculty
  createdAt: { type: Date, default: Date.now },
} );

export default mongoose.model( "Task", taskSchema );
