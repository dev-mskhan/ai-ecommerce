import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type Role = "admin" | "vendor" | "buyer";
export interface IAddress {
    line: string;
    city: string;
    state: string;
    postalCode?: string;
    isDefault: boolean;
}

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
    rejectReason?: string;
    percentageCut?: number;
    phoneNumber?: string;
    addresses?: IAddress[];
    country?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const addressSchema = new Schema<IAddress>(
    {
        line: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        postalCode: { type: String, trim: true },
        isDefault: { type: Boolean, default: false },
    },
    { _id: false }
);

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
        phoneNumber: { type: String },
        addresses: { type: [addressSchema], default: [] },
        country: { type: String, default: "Pakistan", trim: true },
        isApproved: { type: Boolean, default: false },
        rejectReason: { type: String },
        percentageCut: { type: Number, default: 5 },
    },
    { timestamps: true }
);

// Hash password 
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set("toJSON", {
    transform: (_doc, ret) => {
        const { password, refreshToken, passwordResetToken, emailVerificationToken, percentageCut, ...rest } = ret;
        return rest;
    },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;