import mongoose from "mongoose";
const Schema=mongoose.Schema;

const bookSchema=new Schema({
  title: {
    type: String,
    required: true,
    trim:true,
  },
  author: {
    type: String,
    required: true,
    trim:true,
  },
  image: {
    type: String,
    required: true,
  },
  standard:{
    type:String,
    required:true,
  },
  subject:{
    type:String,
    required:true,
    trim:true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  quantity:{
    type:Number,
    required:true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
 
}, { timestamps: true });

bookSchema.index({ title: 1, author: 1, standard: 1, subject: 1 }, { unique: true });



const Book=mongoose.model("Book",bookSchema);
export default Book;
