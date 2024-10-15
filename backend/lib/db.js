import mongoose from "mongoose";
 

 export const coonectDB= async()=>{
    try {
        const conn= await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('found some error in cooonecting MongoDb', error);
        process.exit(1);
    }
 }