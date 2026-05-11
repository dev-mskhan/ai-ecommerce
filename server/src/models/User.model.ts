import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type Role = "admin" | "vendor" | "buyer";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: Role;
    avatar?: string;
    isVerified: boolean;
    isBanned: boolean;
    refreshToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;

    // Vendor-specific
    storeName?: string;
    storeDescription?: string;
    storeAvatar?: string;
    isApproved: boolean;

    comparePassword(candidatePassword: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6, select: false },
        role: { type: String, enum: ["admin", "vendor", "buyer"], default: "buyer" },
        avatar: { type: String },
        isVerified: { type: Boolean, default: false },
        isBanned: { type: Boolean, default: false },
        refreshToken: { type: String, select: false },
        passwordResetToken: { type: String, select: false },
        passwordResetExpires: { type: Date, select: false },
        emailVerificationToken: { type: String, select: false },
        emailVerificationExpires: { type: Date, select: false },

        // Vendor-specific
        storeName: { type: String },
        storeDescription: { type: String },
        storeAvatar: { type: String },
        isApproved: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Hash password 
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON
userSchema.set("toJSON", {
    transform: (_doc, ret) => {
        const { password, refreshToken, passwordResetToken, emailVerificationToken, ...rest } = ret;
        return rest;
    },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;