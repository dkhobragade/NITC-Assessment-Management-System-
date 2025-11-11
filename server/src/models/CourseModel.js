import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema( {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    credits: { type: Number, required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assigned Faculty
    evaluators: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
    students: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ], // enrolled students
    createdAt: { type: Date, default: Date.now },
} );

export default mongoose.model( "Course", courseSchema );
