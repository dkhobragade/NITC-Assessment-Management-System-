import mongoose from "mongoose";

const mappingSchema = new mongoose.Schema(
  {
    evaluator: {
      type: Object,
      required: true,
    },
    student: {
      type: Object,
      required: true,
    },
    facultyId: {
      type: String, // store the faculty ID
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Mapping", mappingSchema);
