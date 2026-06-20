import express from "express";
import enrollCourse from "../controllers/enrollmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:courseId", authMiddleware, enrollCourse);

export default router;