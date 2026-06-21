import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    completedLessons: [{
        type: String, // Storing lesson ObjectIds as strings
    }]
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
