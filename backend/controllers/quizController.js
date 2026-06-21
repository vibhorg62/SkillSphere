import Quiz from "../models/Quiz.js";
import Course from "../models/Course.js";
import Certificate from "../models/Certificate.js";

const createQuiz = async (req, res) => {
    try {
        const { title, questions } = req.body;
        const { courseId } = req.params;

        if (req.user.role !== "instructor") {
            return res.status(403).json({ message: "Only instructors can create quizzes" });
        }

        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You are not authorized to add a quiz to this course" });
        }

        const quiz = await Quiz.create({
            course: courseId,
            title,
            questions
        });

        return res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            quiz
        });
    } catch (error) {
        console.error("Create Quiz Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getCourseQuizzes = async (req, res) => {
    try {
        const { courseId } = req.params;
        const quizzes = await Quiz.find({ course: courseId });

        const mappedQuizzes = quizzes.map(quiz => {
            const qObj = quiz.toObject();
            if (req.user.role === 'student') {
                qObj.questions.forEach(q => delete q.correctAnswer);
            }
            return qObj;
        });

        return res.status(200).json({
            success: true,
            count: mappedQuizzes.length,
            quizzes: mappedQuizzes
        });
    } catch (error) {
        console.error("Get Quizzes Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const submitQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body;

        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Only students can submit quizzes" });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        let score = 0;
        const total = quiz.questions.length;

        quiz.questions.forEach((q, index) => {
            if (answers[index] !== undefined && answers[index] === q.correctAnswer) {
                score++;
            }
        });

        const percentage = (score / total) * 100;
        let certificate = null;

        if (percentage >= 70) {
            certificate = await Certificate.findOneAndUpdate(
                { student: req.user.userId, course: quiz.course },
                { score: percentage, issuedAt: Date.now() },
                { new: true, upsert: true }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Quiz submitted successfully",
            score,
            total,
            percentage: percentage.toFixed(2),
            certificateGenerated: percentage >= 70,
            certificate
        });
    } catch (error) {
        console.error("Submit Quiz Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { createQuiz, getCourseQuizzes, submitQuiz };
