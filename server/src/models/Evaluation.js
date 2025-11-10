const evaluationSchema = new mongoose.Schema({
  submission: { type: mongoose.Schema.Types.ObjectId, ref: "Submission", required: true },
  evaluator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  marks: { type: Number, required: true },
  totalMarks: { type: Number, default: 100 },
  remarks: String,
  evaluatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Evaluation", evaluationSchema);
