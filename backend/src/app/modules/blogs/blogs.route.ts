import express from "express";

import { upload } from "../../config/cloudinary";

import {
  BlogsById,
  createBlogs,
  deleteBlogsById,
  getAllBlogs,
  updateBlogsById,
} from "./blogs.controller";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "writtenByImage",
      maxCount: 1,
    },
  ]),
  createBlogs,
);

router.get("/", getAllBlogs);

router.get("/:id", BlogsById);

router.put(
  "/:id",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "writtenByImage",
      maxCount: 1,
    },
  ]),
  updateBlogsById,
);

router.delete("/:id", deleteBlogsById);

export const blogRouter = router;
