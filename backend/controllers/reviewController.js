import Review from "../models/Review.js";
import Enrollment from "../models/Enrollment.js";

const addReview = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.userId;

        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Only students can review courses" });
        }

        const enrollment = await Enrollment.findOne({ student: userId, course: courseId });
        if (!enrollment) {
            return res.status(403).json({ message: "You must be enrolled to review this course" });
        }

        const existingReview = await Review.findOne({ student: userId, course: courseId });
        if (existingReview) {
            existingReview.rating = rating;
            existingReview.comment = comment;
            await existingReview.save();
            return res.status(200).json({ success: true, message: "Review updated successfully", review: existingReview });
        }

        const review = await Review.create({
            student: userId,
            course: courseId,
            rating,
            comment
        });

        return res.status(201).json({ success: true, message: "Review submitted successfully", review });
    } catch (error) {
        console.error("Add Review Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;
        const reviews = await Review.find({ course: courseId }).populate("student", "name");
        
        return res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        console.error("Get Reviews Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { addReview, getCourseReviews };
