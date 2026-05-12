import { GoogleGenAI } from "@google/genai";
import Product, { IProduct } from "../models/Product.model.js";
import Chat from "../models/Chat.model.js";
import env from "../config/env";

const genAI = new GoogleGenAI({ apiKey: env.geminiApiKey });

export const generateEmbedding = async (text: string): Promise<number[]> => {
    const res = await genAI.models.embedContent({
        model: "gemini-embedding-2",
        contents: text,
        config: { outputDimensionality: 1536 }
    });
    return res.embeddings?.[0]?.values as number[] || [];
};
export const buildProductEmbedding = (product: IProduct): string => {
    const categoryName = (product.category as any)?.name ?? '';
    return `${categoryName} ${product.name} ${product.description} ${product.tags.join(" ")}`;
};

export const searchProductsByEmbedding = async (queryEmbedding: number[]) => {
    return Product.aggregate([
        {
            $vectorSearch: {
                index: "products_vector_index",
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: 100,
                limit: 8,
            },
        },
        { $match: { isActive: true } },
        { $addFields: { score: { $meta: "vectorSearchScore" } } },
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category',
                pipeline: [{ $project: { name: 1 } }],
            },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                name: 1, price: 1, discountPrice: 1, slug: 1,
                ratings: 1, stock: 1, description: 1, tags: 1,
                images: { $slice: ["$images", 1] },
                category: 1,
                score: 1,
            },
        },
    ]);
};

export const processAIChat = async (
    userId: string | null,
    userMessage: string,
    chatId?: string
) => {
    let chat = null;

    if (userId) {
        chat = chatId
            ? await Chat.findOne({ _id: chatId, user: userId })
            : await Chat.create({ user: userId, messages: [] });
    }

    const queryEmbedding = await generateEmbedding(userMessage);
    const products = await searchProductsByEmbedding(queryEmbedding);
    const historyContents = chat?.messages.slice(-10).map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
    })) ?? [];
    console.log("historyContents: ", historyContents);
    const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            ...historyContents,
            { role: "user", parts: [{ text: userMessage }] },
        ],
        config: {
            systemInstruction: `You are a smart shopping assistant. Recommend from these products only: ${JSON.stringify(products)}. If nothing matches, say so honestly.`,
        },
    });

    const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (chat) {
        chat.messages.push({ role: "user", content: userMessage, createdAt: new Date() });
        chat.messages.push({ role: "assistant", content: aiResponse, products: products.map(p => p._id), createdAt: new Date() });
        await chat.save();
    }

    return { chatId: chat?._id ?? null, message: aiResponse, products };
};