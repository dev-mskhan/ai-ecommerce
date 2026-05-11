import app from "./app";
import env from "./config/env";
import connectDB from "./config/mongodb";

connectDB();

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
});