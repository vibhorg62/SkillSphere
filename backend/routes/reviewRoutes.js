import express from "express";
import { addReview, getCourseReviews } from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:courseId", authMiddleware, addReview);
router.get("/:courseId", getCourseReviews);

export default router;
