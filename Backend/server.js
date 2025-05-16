import "dotenv/config"

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import DbConnect from "./Services/dbConnection.js";

import authRoutes from "./Routes/authRoutes.js"
import activeRoutes from "./Routes/activateRoutes.js"

import bookRoutes from "./Routes/bookRoutes.js"
import centerRoutes from "./Routes/centerRoute.js"
DbConnect();

const app=express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=> res.json({"message":"Hello from StudyPlex"}));

app.use("/auth",authRoutes);
app.use("/book",bookRoutes);
app.use("/center",centerRoutes);
app.use("/activate",activeRoutes);


const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})