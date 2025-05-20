import mongoose from "mongoose";
const Schema=mongoose.Schema;

const courseSchema=new Schema({
    title:{type:String,required:false},
    roomId:{type:String,requied:true,unique:true},
    createdBy:{type:Schema.Types.ObjectId,ref:'User'},  
    educators:[{typs:Schema.Types.ObjectId,ref:'User'}],
    students:[{type:Schema.Types.ObjectId,ref:'User'}],
    type:{
        type:String,
        enum:['PAID','FREE']
    },
    lectures:[
        {
            title:{type:String,required:true},
            description:String,
            videoKey:{
                type:String,
                required:true,
            },
            duration:Number,//in s
            uploadedAt:{
                type:Date,
                default:Date.now
            },
            isLive:{
                type:Boolean,
                default:false,
            }

        }
    ],
    createdAt:{
        type:Date,
        default:Date.now,
    }

})

const Course=mongoose.model("Course",courseSchema);
export default Course;