import mongoose from "mongoose";

const courseSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String,
    },
    description:{
        required:true,
        type:String,
    },
    price:{
        required:true,
        type:Number,
    },
    category:{
        required:true,
        type:String,
    },
    thumbnail:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    lessons:[{
        title:{
            required:true,
            type:String,
        },
        youtubeUrl:{
            type:String,
        },
        videoUrl:{
            type:String,
        },
        thumbnail:{
            type:String,
        }
    }]
},{
    timestamps:true,
}
)

const Course=mongoose.model('Course',courseSchema);
export default Course;