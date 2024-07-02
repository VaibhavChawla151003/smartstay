import mongoose from "mongoose";

// "database is in different continent" so always use async await while connecting the database

const connectDB = async() =>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`,{
            dbName: "StaySmart"
        })

        console.log(`\n MONGODB connected !! DB HOST: ${connectionInstance.connection.host}`)
    }catch(error){
        console.log("MONGODB connection error" , error);
        process.exit(1);
    }
}

export default connectDB;