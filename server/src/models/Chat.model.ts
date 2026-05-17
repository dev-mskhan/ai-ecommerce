import mongoose, { Document, Schema } from "mongoose";

interface IMessage {
    role: "user" | "assistant" | "admin";
    content: string;
    products?: mongoose.Types.ObjectId[];
    createdAt: Date;
}

export interface IChat extends Document {
    user: mongoose.Types.ObjectId;
    assignedAdmin: mongoose.Types.ObjectId | null;
    messages: IMessage[];
    type: "support" | "ai";
    status: "open" | "closed";
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        role: { type: String, enum: ["user", "assistant", "admin"], required: true },
        content: { type: String, required: true },
        products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true }
);

const chatSchema = new Schema<IChat>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        assignedAdmin: { type: Schema.Types.ObjectId, ref: "User", default: null },
        type: {
            type: String,
            enum: ["support", "ai"],
            default: "ai"
        },
        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open"
        },
        messages: [messageSchema]
    },
    { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;