import express from "express";
import { markLessonComplete, getCourseProgress } from "../controllers/progressController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:courseId/:lessonId", authMiddleware, markLessonComplete);
router.get("/:courseId", authMiddleware, getCourseProgress);

export default router;
