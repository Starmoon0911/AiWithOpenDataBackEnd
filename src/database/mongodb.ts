import mongoose from "mongoose";

const connectURL: string = process.env.mongodbURL as string;

const connectDatabase = async () => {
    try {
        await mongoose.connect(connectURL)
        console.log("Connected to the db");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);

    }
}

export default connectDatabase;