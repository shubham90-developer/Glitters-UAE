"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryById = exports.updateCategoryById = exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const category_model_1 = require("./category.model");
const category_validation_1 = require("./category.validation");
const appError_1 = require("../../errors/appError");
const cloudinary_1 = require("../../config/cloudinary");
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { title } = req.body;
        // Check if category with same title already exists
        const existingCategory = yield category_model_1.Category.findOne({ title, isDeleted: false });
        if (existingCategory) {
            next(new appError_1.appError("Category with this title already exists", 400));
            return;
        }
        // If image is uploaded through multer middleware, req.file will be available
        if (!req.file) {
            next(new appError_1.appError("Image is required", 400));
            return;
        }
        // Get the image URL from req.file
        const image = req.file.path;
        // Validate the input
        const validatedData = category_validation_1.categoryValidation.parse({
            title,
            image
        });
        // Create a new category
        const category = new category_model_1.Category(validatedData);
        yield category.save();
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Category created successfully",
            data: category,
        });
        return;
    }
    catch (error) {
        // If error is during image upload, delete the uploaded image if any
        if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) {
            const publicId = (_b = req.file.path.split('/').pop()) === null || _b === void 0 ? void 0 : _b.split('.')[0];
            if (publicId) {
                yield cloudinary_1.cloudinary.uploader.destroy(`restaurant-categories/${publicId}`);
            }
        }
        next(error);
    }
});
exports.createCategory = createCategory;
const getAllCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.Category.find({ isDeleted: false }).sort({ createdAt: -1 });
        if (categories.length === 0) {
            next(new appError_1.appError("No categories found", 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: "Categories retrieved successfully",
            data: categories,
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getAllCategories = getAllCategories;
const getCategoryById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.Category.findOne({
            _id: req.params.id,
            isDeleted: false
        });
        if (!category) {
            next(new appError_1.appError("Category not found", 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: "Category retrieved successfully",
            data: category,
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getCategoryById = getCategoryById;
const updateCategoryById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const categoryId = req.params.id;
        // Find the category to update
        const category = yield category_model_1.Category.findOne({
            _id: categoryId,
            isDeleted: false
        });
        if (!category) {
            next(new appError_1.appError("Category not found", 404));
            return;
        }
        // Prepare update data
        const updateData = {};
        if (req.body.title) {
            // Check if new title already exists
            if (req.body.title !== category.title) {
                const existingCategory = yield category_model_1.Category.findOne({
                    title: req.body.title,
                    isDeleted: false,
                    _id: { $ne: categoryId }
                });
                if (existingCategory) {
                    next(new appError_1.appError("Category with this title already exists", 400));
                    return;
                }
            }
            updateData.title = req.body.title;
        }
        // If there's a new image
        if (req.file) {
            updateData.image = req.file.path;
            // Delete the old image from cloudinary if it exists
            if (category.image) {
                const publicId = (_a = category.image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
                if (publicId) {
                    yield cloudinary_1.cloudinary.uploader.destroy(`restaurant-categories/${publicId}`);
                }
            }
        }
        // Validate the update data
        if (Object.keys(updateData).length > 0) {
            const validatedData = category_validation_1.categoryUpdateValidation.parse(updateData);
            // Update the category
            const updatedCategory = yield category_model_1.Category.findByIdAndUpdate(categoryId, validatedData, { new: true });
            res.json({
                success: true,
                statusCode: 200,
                message: "Category updated successfully",
                data: updatedCategory,
            });
            return;
        }
        // If no updates provided
        res.json({
            success: true,
            statusCode: 200,
            message: "No changes to update",
            data: category,
        });
        return;
    }
    catch (error) {
        // If error occurs and image was uploaded, delete it
        if ((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) {
            const publicId = (_c = req.file.path.split('/').pop()) === null || _c === void 0 ? void 0 : _c.split('.')[0];
            if (publicId) {
                yield cloudinary_1.cloudinary.uploader.destroy(`restaurant-categories/${publicId}`);
            }
        }
        next(error);
    }
});
exports.updateCategoryById = updateCategoryById;
const deleteCategoryById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.Category.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!category) {
            next(new appError_1.appError("Category not found", 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: "Category deleted successfully",
            data: category,
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCategoryById = deleteCategoryById;
