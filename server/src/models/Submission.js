import mongoose from 'mongoose'

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  fileUrl: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["Submitted", "Evaluated"], default: "Submitted" },
});

export default mongoose.model("Submission", submissionSchema);
