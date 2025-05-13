import mongoose from "mongoose";
const Schema=mongoose.Schema;

const userSchema=new Schema({
    phone:{type:String,requied:true},
    name:{type:String,required:false},
    email:{type:String,requied:false},
    exam:{
        type:String,
        enum:['JEE','NEET'],
        requied:false,
    },
    class:{type:Number,required:false},
    city:{type:String,required:false},
    state:{type:String,requied:false},
    courses:[{type:String}]
})

const User=mongoose.model("User",userSchema);
export default User;