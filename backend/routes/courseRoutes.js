import express from "express";
import { 
  createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse,
  addLesson, updateLesson, deleteLesson, getCourseContent, getInstructorCourses
} from "../controllers/courseController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadImage, uploadLessonFiles } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, uploadImage.single('thumbnail'), createCourse);
router.get("/", authMiddleware, getAllCourses);

router.get("/instructor/my-courses", authMiddleware, getInstructorCourses);

router.get("/:id", authMiddleware, getCourseById);
router.put("/:id", authMiddleware, uploadImage.single('thumbnail'), updateCourse);
router.delete("/:id", authMiddleware, deleteCourse);

router.get("/:id/content", authMiddleware, getCourseContent);

const lessonUpload = uploadLessonFiles.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

router.post("/:id/lessons", authMiddleware, lessonUpload, addLesson);
router.put("/:id/lessons/:lessonId", authMiddleware, lessonUpload, updateLesson);
router.delete("/:id/lessons/:lessonId", authMiddleware, deleteLesson);

export default router;