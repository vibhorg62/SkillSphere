import express from "express";
import { enrollCourse, myCourses } from "../controllers/enrollmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:courseId", authMiddleware, enrollCourse);

router.get("/my-courses", authMiddleware, myCourses);

export default router;