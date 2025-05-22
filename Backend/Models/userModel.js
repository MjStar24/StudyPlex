import mongoose from "mongoose";
const Schema=mongoose.Schema;

const userSchema=new Schema({
    phone:{type:String,requied:true,trim:true},
    name:{type:String,required:false,trim:true},
    email:{type:String,requied:false,trim:true},
    exam:{
        type:String,
        enum:['JEE','NEET'],
        requied:false,
    },
    role:{type:String,enum:['student','educator'],requied:false},
    teacherDetails:{
        qualification:{type:String},
        experience:{type:String},
    },
    Class:{type:String,required:false},
    city:{type:String,required:false},
    state:{type:String,requied:false},
    board:{type:String,requied:false},
    isActivated:{type:Boolean,required:false},
    courses:[{type:Schema.Types.ObjectId,ref:'Course'}]
})

const User=mongoose.model("User",userSchema);
export default User;