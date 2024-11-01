import mongoose from "mongoose";

const connectToDb = async()=>{
    try {
        await mongoose.connect(process.env.MongoDbUrl);
        console.log("Connected to MOngoDb")
    } catch (error) {
        console.log(error)
    }
}

export default connectToDb;