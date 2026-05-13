import express from "express";
import authRoutes from "./routes/auth.routes";
import vendorRoutes from "./routes/vendor.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import chatRoutes from "./routes/chat.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/vendor', vendorRoutes);
router.use('/category', categoryRoutes);
router.use('/product', productRoutes);
router.use('/chat', chatRoutes);
router.use('/admin', adminRoutes);
router.use('/user', userRoutes);

export default router;