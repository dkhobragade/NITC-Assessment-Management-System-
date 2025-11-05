import mongoose from "mongoose";

const mappingSchema = new mongoose.Schema(
  {
    evaluator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EvalutorUser",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentUser",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Mapping", mappingSchema);
