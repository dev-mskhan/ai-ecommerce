import { Router } from "express";
import {
    createProduct, updateProduct, deleteProduct,
    getVendorProducts, toggleProductStatus,
    getAllProducts, getProductBySlug,
    adminDeleteProduct, toggleFeaturedProduct,
    updateStock,
    getProductById,
} from "../controllers/product.controller.js";
import authHandler from "../middleware/auth.middleware.js";
import roleCheck from "../middleware/roleCheck.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import { createProductSchema, updateProductSchema, searchProductSchema, updateStockSchema } from "../validators/product.validator.js";
import { parseFormData } from "../middleware/upload.middleware.js";

const router = Router();

// public routes
router.get("/", validateRequest(searchProductSchema, "query"), getAllProducts);
router.get("/vendor", authHandler, roleCheck("vendor"), getVendorProducts);
router.get("/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);

// vendor routes
router.post("/vendor", authHandler, roleCheck("vendor"), parseFormData("images", true), validateRequest(createProductSchema, "body"), createProduct);
router.patch("/vendor/:id", authHandler, roleCheck("vendor"), parseFormData("images", true), validateRequest(updateProductSchema, "body"), updateProduct);
router.delete("/vendor/:id", authHandler, roleCheck("vendor"), deleteProduct);
router.patch("/vendor/:id/toggle", authHandler, roleCheck("vendor"), toggleProductStatus);
router.patch('/vendor/:id/stock', authHandler, roleCheck('vendor'), validateRequest(updateStockSchema, "body", "params"), updateStock);

// admin routes
router.delete("/admin/:id", authHandler, roleCheck("admin"), adminDeleteProduct);
router.patch("/admin/:id/feature", authHandler, roleCheck("admin"), toggleFeaturedProduct);

export default router;