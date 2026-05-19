import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import User from "./models/User.model.js";
import Order from "./models/Order.model.js";
const orders = [
    {
        buyer: new mongoose.Types.ObjectId("6a04b1750de422ff13f6d48b"),
        items: [
            { product: "6a05e4220d753bbc91bcbc24", quantity: 2, price: 1500 },
            { product: "6a05e4220d753bbc91bcbc24", quantity: 1, price: 1500 },
        ],
        shippingAddress: {
            addressLine1: "Plot 45, Block 7",
            city: "Karachi",
            state: "Sindh",
            country: "Pakistan",
            postalCode: "75500",
        },
        phone: "03001234567",
        subtotal: 3000,
        discount: 0,
        shippingCost: 200,
        tax: 0,
        total: 3200,
        status: "delivered",
        paymentStatus: "paid",
        paymentMethod: "stripe",
        paymentIntentId: "pi_3TXLxXPxP5oALrx51qDajDUS",
    },
    {
        buyer: new mongoose.Types.ObjectId("6a04b1750de422ff13f6d48b"),
        items: [
            { product: "6a05e4220d753bbc91bcbc24", quantity: 3, price: 1500 },
        ],
        shippingAddress: {
            addressLine1: "House 12, Gulshan-e-Iqbal",
            city: "Karachi",
            state: "Sindh",
            country: "Pakistan",
            postalCode: "75300",
        },
        phone: "03001234567",
        subtotal: 4500,
        discount: 0,
        shippingCost: 0,
        tax: 0,
        total: 4500,
        couponCode: "SAVE500",
        status: "shipped",
        paymentStatus: "paid",
        paymentMethod: "stripe",
        paymentIntentId: "pi_4UYMzYQyQ6pBMsy62rEbEVT",
    },
    {
        buyer: new mongoose.Types.ObjectId("6a04b1750de422ff13f6d48b"),
        items: [
            { product: "6a05e4220d753bbc91bcbc24", quantity: 1, price: 1500 },
            { product: "6a05e4220d753bbc91bcbc24", quantity: 2, price: 1500 },
        ],
        shippingAddress: {
            addressLine1: "Flat 3B, Clifton Block 5",
            city: "Karachi",
            state: "Sindh",
            country: "Pakistan",
            postalCode: "75600",
        },
        phone: "03001234567",
        subtotal: 3000,
        discount: 0,
        shippingCost: 0,
        tax: 0,
        total: 3000,
        couponCode: "WELCOME50",
        status: "processing",
        paymentStatus: "paid",
        paymentMethod: "cod",
        paymentIntentId: null,
    },
    {
        buyer: new mongoose.Types.ObjectId("6a04b1750de422ff13f6d48b"),
        items: [
            { product: "6a05e4220d753bbc91bcbc24", quantity: 4, price: 1500 },
            { product: "6a05e4220d753bbc91bcbc24", quantity: 1, price: 1500 },
        ],
        shippingAddress: {
            addressLine1: "Office 7, SITE Area",
            city: "Karachi",
            state: "Sindh",
            country: "Pakistan",
            postalCode: "75730",
        },
        phone: "03001234567",
        subtotal: 7500,
        discount: 0,
        shippingCost: 300,
        tax: 0,
        total: 7800,
        status: "pending",
        paymentStatus: "paid",
        paymentMethod: "stripe",
        paymentIntentId: "pi_5VZNaZRzR7qCNtz73sFcFWU",
    },
]

async function seed() {
    await connectDB();
    await Order.insertMany(orders);
}
seed();

