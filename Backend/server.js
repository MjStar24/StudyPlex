import "dotenv/config"

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import DbConnect from "./Services/dbConnection.js";

DbConnect();

const app=express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=> res.json({"message":"Hello from StudyPlex"}));


const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})