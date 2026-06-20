import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

const enrollCourse=async(req,res)=>{
    const courseId = req.params.courseId;
    const userId = req.user.userId;
    try{
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({ message: "Course not found" });
        }
        if(req.user.role !== "student"){
            return res.status(403).json({ message: "Only students can enroll in courses" });
        }
        const existingEnrollment = await Enrollment.findOne({
            student: userId,
            course: courseId,
        });

        if (existingEnrollment) {
            return res.status(400).json({
                message: "Already enrolled in this course",
            });
        }
        const enrolledCourse = await Enrollment.create({
            student: userId,
            course: courseId,
        });
        return res.status(201).json({
            success: true,
            message: "Enrolled successfully",
            enrollment: enrolledCourse,
        });
    }catch(error){
    console.error("Enrollment Error:", error);

    return res.status(500).json({
        message: "Internal Server Error"
    });
}
}

const myCourses = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can access enrolled courses",
      });
    }

    const enrollments = await Enrollment.find({
      student: req.user.userId,
    })
      .populate("course")
      .populate("student", "name email");

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    console.error("My Courses Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export { enrollCourse, myCourses };