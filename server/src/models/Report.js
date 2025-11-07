const reportSchema = new mongoose.Schema({
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  generatedAt: { type: Date, default: Date.now },
  reportType: { type: String, enum: ["Course", "Faculty", "Evaluator", "Student"] },
  data: mongoose.Schema.Types.Mixed, // JSON summary
});

export default mongoose.model("Report", reportSchema);
