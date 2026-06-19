import Course from "../models/Course.js";

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
    try{
        const courses=await Course.find().populate("instructor","name email");
        return res.status(200).json({
            success:true,
            count:courses.length,
            courses,
        });
    }catch(error){
        console.error("Get Courses Error:", error);
        return res.status(500).json({
            message:"Internal Server Error",
        });
    }
}

const getCourseById=async(req,res)=>{
    try{
        const course = await Course.findById(req.params.id).populate("instructor","name email");
        if(!course){
            return res.status(404).json({
                message:"Course not found",
            });
        }
        return res.status(200).json({
            success:true,
            course,
        });
    }
    catch(error){
        console.error("Get Course By ID Error:", error);
        return res.status(500).json({
            message:"Internal Server Error",
        });
    }
}

const updateCourse=async(req,res)=>{
    try{
        const { title, description, price, category, thumbnail, lessons } = req.body;
        const course=await Course.findById(req.params.id);
        if(!course){
            return res.status(404).json({
                message:"Course not found",
            });
        }
        if(course.instructor.toString()!==req.user.userId){
            return res.status(403).json({
                message:"You are not authorized to update this course",
            });
        }
        if (title !== undefined) course.title = title;
        if (description !== undefined) course.description = description;
        if (price !== undefined) course.price = price;
        if (category !== undefined) course.category = category;
        if (thumbnail !== undefined) course.thumbnail = thumbnail;
        if (lessons !== undefined) course.lessons = lessons;
        const updatedCourse=await course.save();
        return res.status(200).json({
            success:true,
            course:updatedCourse,
        });
    }catch(error){
        console.error("Update Course Error:", error);
        return res.status(500).json({
            message:"Internal Server Error",
        });
    }
}

const deleteCourse=async(req,res)=>{
    try{
        const course=await Course.findById(req.params.id);
        if(!course){
            return res.status(404).json({
                message:"Course not found",
            });
        }
        if(course.instructor.toString()!==req.user.userId){
            return res.status(403).json({
                message:"You are not authorized to delete this course",
            });
        }
        await course.deleteOne();
        return res.status(200).json({
            success:true,
            message:"Course deleted successfully",
        });
    }catch(error){
        console.error("Delete Course Error:", error);
        return res.status(500).json({
            message:"Internal Server Error",
        });
    }
}

export { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse };