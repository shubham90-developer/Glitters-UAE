import express from "express";
import {
  BlogsCategoryById,
  createBlogsCategory,
  deleteBlogsCategoryById,
  getAllBlogsCategory,
  updateBlogsCategoryById,
} from "./blogsCategory.controller";

const router = express.Router();

router.post("/", createBlogsCategory);

router.get("/", getAllBlogsCategory);

router.get("/:id", BlogsCategoryById);

router.put("/:id", updateBlogsCategoryById);

router.delete("/:id", deleteBlogsCategoryById);

export const blogCategoryRouter = router;
