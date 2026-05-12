import mongoose, { Document, Schema } from "mongoose";

interface IMessage {
    role: "user" | "assistant";
    content: string;
    products?: mongoose.Types.ObjectId[];
    createdAt: Date;
}

export interface IChat extends Document {
    user: mongoose.Types.ObjectId;
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
        products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true }
);

const chatSchema = new Schema<IChat>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        messages: [messageSchema],
    },
    { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;