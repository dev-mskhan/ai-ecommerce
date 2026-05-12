import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "./config/mongodb";
import User from "./models/User.model";
const app = express();

async function seed() {
    await connectDB();
    await User.create({
        name: "super admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
        isVerified: true,
    });
}
seed();

