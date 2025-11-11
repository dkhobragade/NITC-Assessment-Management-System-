import mongoose from 'mongoose'

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  enrollmentCode: { type: String },
  enrolledAt: { type: Date, default: Date.now },
});

export default mongoose.model("Enrollment", enrollmentSchema);
