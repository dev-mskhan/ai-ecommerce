import { Router } from "express";
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    getCategoryBySlug,
} from "../controllers/category.controller.js";
import authHandler from "../middleware/auth.middleware.js";
import roleCheck from "../middleware/roleCheck.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator.js";
import { parseFormData } from "../middleware/upload.middleware.js";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/slug/:slug", getCategoryBySlug);

router.post("/", authHandler, roleCheck("admin"), parseFormData("categories", true), validateRequest(createCategorySchema, "body"), createCategory);
router.patch("/:id", authHandler, roleCheck("admin"), parseFormData("categories", true), validateRequest(updateCategorySchema, "body"), updateCategory);
router.delete("/:id", authHandler, roleCheck("admin"), deleteCategory);
router.patch("/:id/toggle", authHandler, roleCheck("admin"), toggleCategoryStatus);

export default router;