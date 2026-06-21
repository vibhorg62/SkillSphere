import express from "express";
import { createQuiz, getCourseQuizzes, submitQuiz } from "../controllers/quizController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:courseId", authMiddleware, createQuiz);
router.get("/:courseId", authMiddleware, getCourseQuizzes);
router.post("/:quizId/submit", authMiddleware, submitQuiz);

export default router;
