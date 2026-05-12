import { Router } from "express";
import {
    createProduct, updateProduct, deleteProduct,
    getVendorProducts, toggleProductStatus,
    getAllProducts, getProductBySlug,
    adminDeleteProduct, toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import authHandler from "../middleware/auth.middleware.js";
import roleCheck from "../middleware/roleCheck.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import { createProductSchema, updateProductSchema, searchProductSchema } from "../validators/product.validator.js";
import { parseFormData } from "../middleware/upload.middleware.js";

const router = Router();

// public routes
router.get("/", validateRequest(searchProductSchema, "query"), getAllProducts);
router.get("/:slug", getProductBySlug);

// vendor routes
router.get("/vendor/my-products", authHandler, roleCheck("vendor"), getVendorProducts);
router.post("/", authHandler, roleCheck("vendor"), parseFormData("products", true), validateRequest(createProductSchema), createProduct);
router.patch("/:id", authHandler, roleCheck("vendor"), parseFormData("products", true), validateRequest(updateProductSchema), updateProduct);
router.delete("/:id", authHandler, roleCheck("vendor"), deleteProduct);
router.patch("/:id/toggle", authHandler, roleCheck("vendor"), toggleProductStatus);

// admin routes
router.delete("/admin/:id", authHandler, roleCheck("admin"), adminDeleteProduct);
router.patch("/admin/:id/feature", authHandler, roleCheck("admin"), toggleFeaturedProduct);

export default router;