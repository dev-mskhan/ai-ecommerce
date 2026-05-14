import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/mongodb.js";


const start = async () => {
    try {
        await connectDB();
        app.listen(env.port, () => {
            console.log(`Server running on  ${env.port}`);
        });
    } catch (err) {
        console.error("Startup error:", err);
        process.exit(1);
    }
};

start();
