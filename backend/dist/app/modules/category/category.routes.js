"use strict";
// import express from 'express';
// import { 
//   createCategory, 
//   getAllCategories, 
//   getCategoryById, 
//   updateCategoryById, 
//   deleteCategoryById 
// } from './category.controller';
// import { upload } from '../../config/cloudinary';
// import { auth } from '../../middlewares/authMiddleware';
// const router = express.Router();
// /**
//  * @swagger
//  * tags:
//  *   name: Categories
//  *   description: Manage categories
//  */
// /**
//  * @swagger
//  * /v1/api/categories:
//  *   post:
//  *     summary: Create a new category
//  *     description: Creates a category with title (required), status (optional) and image upload (required).
//  *     tags: [Categories]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               title:
//  *                 type: string
//  *               status:
//  *                 type: string
//  *                 enum: [active, inactive]
//  *               image:
//  *                 type: string
//  *                 format: binary
//  *             required: [title, image]
//  *     responses:
//  *       201:
//  *         description: Category created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Category'
//  *       400:
//  *         description: Validation error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Error'
//  */
// // Create a new category with image upload
// router.post('/', auth('admin'), upload.single('image'), createCategory);
// /**
//  * @swagger
//  * /v1/api/categories:
//  *   get:
//  *     summary: Get all categories
//  *     tags: [Categories]
//  *     responses:
//  *       200:
//  *         description: List of categories
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Category'
//  */
// // Get all categories
// router.get('/', getAllCategories);
// /**
//  * @swagger
//  * /v1/api/categories/{id}:
//  *   get:
//  *     summary: Get a category by ID
//  *     tags: [Categories]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Category ID
//  *     responses:
//  *       200:
//  *         description: Category details
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Category'
//  *       404:
//  *         description: Category not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Error'
//  */
// // Get a single category by ID
// router.get('/:id', getCategoryById);
// /**
//  * @swagger
//  * /v1/api/categories/{id}:
//  *   put:
//  *     summary: Update a category by ID
//  *     description: Updates title, status and/or image of a category.
//  *     tags: [Categories]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Category ID
//  *     requestBody:
//  *       required: false
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               title:
//  *                 type: string
//  *               status:
//  *                 type: string
//  *                 enum: [active, inactive]
//  *               image:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       200:
//  *         description: Category updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Category'
//  *       404:
//  *         description: Category not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Error'
//  */
// // Update a category by ID with optional image upload
// router.put('/:id', auth('admin'), upload.single('image'), updateCategoryById);
// /**
//  * @swagger
//  * /v1/api/categories/{id}:
//  *   delete:
//  *     summary: Delete a category by ID
//  *     description: Soft deletes a category.
//  *     tags: [Categories]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Category ID
//  *     responses:
//  *       200:
//  *         description: Category deleted successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Success'
//  *       404:
//  *         description: Category not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Error'
//  */
// // Delete a category by ID (soft delete)
// router.delete('/:id', auth('admin'), deleteCategoryById);
// export const categoryRouter = router;
