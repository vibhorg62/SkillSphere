import express from "express";
import { 
  createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse,
  addLesson, updateLesson, deleteLesson, getCourseContent, getInstructorCourses
} from "../controllers/courseController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createCourse);
router.get("/", authMiddleware, getAllCourses);

router.get("/instructor/my-courses", authMiddleware, getInstructorCourses);

router.get("/:id", authMiddleware, getCourseById);
router.put("/:id", authMiddleware, updateCourse);
router.delete("/:id", authMiddleware, deleteCourse);

router.get("/:id/content", authMiddleware, getCourseContent);

router.post("/:id/lessons", authMiddleware, addLesson);
router.put("/:id/lessons/:lessonId", authMiddleware, updateLesson);
router.delete("/:id/lessons/:lessonId", authMiddleware, deleteLesson);

export default router;