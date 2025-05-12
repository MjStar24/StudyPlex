import mongoose from "mongoose";

function DbConnect(){
    mongoose.connect(process.env.DB_URL,{
      });

      const db=mongoose.connection;
      db.on("error",console.error.bind(console,"connection error :"));
      db.once("open",()=>{
        console.log("connected...");
      })
}

export default DbConnect;