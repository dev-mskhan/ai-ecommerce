import env from "./config/env.js";
import connectDB from "./config/mongodb.js";
import { httpServer } from "./app.js";

const start = async () => {
    try {
        await connectDB();
        httpServer.listen(env.port, () => {
            console.log(`Server running on  ${env.port}`);
        });
    } catch (err) {
        console.error("Startup error:", err);
        process.exit(1);
    }
};

start();
