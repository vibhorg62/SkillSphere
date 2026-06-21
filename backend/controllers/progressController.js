import Progress from "../models/Progress.js";
import Enrollment from "../models/Enrollment.js";

const markLessonComplete = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const userId = req.user.userId;

        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Only students can track progress" });
        }

        const enrollment = await Enrollment.findOne({ student: userId, course: courseId });
        if (!enrollment) {
            return res.status(403).json({ message: "You are not enrolled in this course" });
        }

        let progress = await Progress.findOne({ student: userId, course: courseId });

        if (!progress) {
            progress = new Progress({ student: userId, course: courseId, completedLessons: [] });
        }

        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            await progress.save();
        }

        return res.status(200).json({
            success: true,
            message: "Lesson marked as complete",
            progress
        });
    } catch (error) {
        console.error("Progress Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.userId;

        const progress = await Progress.findOne({ student: userId, course: courseId });
        
        return res.status(200).json({
            success: true,
            progress: progress || { student: userId, course: courseId, completedLessons: [] }
        });
    } catch (error) {
        console.error("Get Progress Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { markLessonComplete, getCourseProgress };
