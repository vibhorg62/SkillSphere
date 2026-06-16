import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async(req,res)=>{
    const {name,email,password,role}=req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({message:"Please provide all required Fields"});
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const user= await User.create({
            name,
            email,
            password:hashedPassword,
            role:role||"student",
        });
        const token=jwt.sign(
            {
            userId:user._id,
            role:user.role,
        },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
);
        return res.status(201).json({ message: "User registered successfully", token, user: { 
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        } });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
export {register};