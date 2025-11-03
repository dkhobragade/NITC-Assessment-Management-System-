import mongoose from "mongoose";

const evalutorSchema = new mongoose.Schema(
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
      default: "Evalutor",
    },
  },
  {
    timestamps: true,
  }
);

const EvalutorUser = mongoose.model("EvalutorUser", evalutorSchema);

export default EvalutorUser;
