import mongoose from "mongoose";
import env from "./env";

const connectDB = async () => {
    try {
        await mongoose.connect(env.mongoUri);
        console.log(`DB Connected`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
}
export default connectDB;