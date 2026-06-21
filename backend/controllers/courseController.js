import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Review from "../models/Review.js";

const createCourse = async (req, res) => {
    try {
        const { title, description, price, category, thumbnail, lessons } =
            req.body;

        if (req.user.role !== "instructor") {
            return res.status(403).json({
                message: "Only instructors can create courses",
            });
        }

        if (!title || !description || !price || !category || !thumbnail) {
            return res.status(400).json({
                message: "Please provide all required fields",
            });
        }

        const course = await Course.create({
            title,
            description,
            price,
            category,
            thumbnail,
            instructor: req.user.userId,
            lessons: lessons || [],
        });

        return res.status(201).json({
            message: "Course created successfully",
            course,
        });
    } catch (error) {
        console.error("Create Course Error:", error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const courses = await Course.find(query).populate("instructor", "name email").select("-lessons");
        return res.status(200).json({
            success: true,
            count: courses.length,
            courses,
        });
    } catch (error) {
        console.error("Get Courses Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

const getCourseById = async (req, res) => {
    try {
        const courseDoc = await Course.findById(req.params.id).populate("instructor", "name email").select("-lessons");
        if (!courseDoc) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        const course = courseDoc.toObject();
        const reviews = await Review.find({ course: req.params.id });
        let averageRating = 0;
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
            averageRating = sum / reviews.length;
        }

        course.averageRating = Number(averageRating.toFixed(1));
        course.numOfReviews = reviews.length;
        return res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        console.error("Get Course By ID Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

const updateCourse = async (req, res) => {
    try {
        const { title, description, price, category, thumbnail, lessons } = req.body;
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }
        if (course.instructor.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not authorized to update this course",
            });
        }
        if (title !== undefined) course.title = title;
        if (description !== undefined) course.description = description;
        if (price !== undefined) course.price = price;
        if (category !== undefined) course.category = category;
        if (thumbnail !== undefined) course.thumbnail = thumbnail;
        if (lessons !== undefined) course.lessons = lessons;
        const updatedCourse = await course.save();
        return res.status(200).json({
            success: true,
            course: updatedCourse,
        });
    } catch (error) {
        console.error("Update Course Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }
        if (course.instructor.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not authorized to delete this course",
            });
        }
        await course.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        console.error("Delete Course Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

const addLesson = async (req, res) => {
    try {
        const { title, youtubeUrl } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (course.instructor.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You are not authorized to add lessons to this course" });
        }
        if (!title || !youtubeUrl) {
            return res.status(400).json({ message: "Title and YouTube URL are required" });
        }

        course.lessons.push({ title, youtubeUrl });
        await course.save();

        return res.status(201).json({
            success: true,
            message: "Lesson added successfully",
            course
        });
    } catch (error) {
        console.error("Add Lesson Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateLesson = async (req, res) => {
    try {
        const { title, youtubeUrl } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (course.instructor.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You are not authorized to update lessons in this course" });
        }

        const lesson = course.lessons.id(req.params.lessonId);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        if (title !== undefined) lesson.title = title;
        if (youtubeUrl !== undefined) lesson.youtubeUrl = youtubeUrl;

        await course.save();
        return res.status(200).json({
            success: true,
            message: "Lesson updated successfully",
            course
        });
    } catch (error) {
        console.error("Update Lesson Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteLesson = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (course.instructor.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You are not authorized to delete lessons from this course" });
        }

        const lesson = course.lessons.id(req.params.lessonId);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        course.lessons.pull(req.params.lessonId);
        await course.save();

        return res.status(200).json({
            success: true,
            message: "Lesson deleted successfully",
            course
        });
    } catch (error) {
        console.error("Delete Lesson Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getCourseContent = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate("instructor", "name email");
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        let hasAccess = false;

        if (course.instructor._id.toString() === req.user.userId) {
            hasAccess = true;
        } else if (req.user.role === 'student') {
            const enrollment = await Enrollment.findOne({
                student: req.user.userId,
                course: req.params.id
            });
            if (enrollment) {
                hasAccess = true;
            }
        }

        if (!hasAccess) {
            return res.status(403).json({ message: "Access denied. Please enroll to view content." });
        }

        return res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        console.error("Get Course Content Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getInstructorCourses = async (req, res) => {
    try {
        if (req.user.role !== "instructor") {
            return res.status(403).json({ message: "Only instructors can access this dashboard" });
        }

        const courses = await Course.find({ instructor: req.user.userId }).select("-lessons");

        const coursesWithStats = await Promise.all(courses.map(async (course) => {
            const studentCount = await Enrollment.countDocuments({ course: course._id });
            return {
                ...course.toObject(),
                students: studentCount
            };
        }));

        return res.status(200).json({
            success: true,
            count: coursesWithStats.length,
            courses: coursesWithStats
        });
    } catch (error) {
        console.error("Instructor Courses Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    addLesson,
    updateLesson,
    deleteLesson,
    getCourseContent,
    getInstructorCourses
};