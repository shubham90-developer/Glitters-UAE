import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { appError } from "../../errors/appError";
import { AddToCart } from "./addToCart.model";
import { addToCartSchema, updateCartSchema } from "./addToCart.validation";
import { Product } from "../products/product.model";

// Product + brand, material, size, color ke proper names
// NOTE: select ke field names apne Brand / Material / Size / Color model ke hisaab se rakho
const productPopulate = {
  path: "product",
  populate: [
    { path: "brand", select: "name" },
    { path: "material", select: "name" },
    { path: "variants.size", select: "size" },
    { path: "variants.color", select: "colorName" },
    // coupon attached to the product (used by checkout / cart)
    {
      path: "coupon",
      select: "_id couponName subTitle couponCode couponAmount status",
    },
  ],
};

// ADD TO CART
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { product: productId, quantity } = addToCartSchema.parse(req.body);

    if (!Types.ObjectId.isValid(productId)) {
      return next(new appError("Invalid product id", 400));
    }

    // Product check
    const product = await Product.findOne({
      _id: productId,
      status: "active",
      isDeleted: false,
    });
    if (!product) {
      return next(new appError("Product not found", 404));
    }

    // Same product pehle se cart mein hai to quantity badhao
    let cartItem = await AddToCart.findOne({
      product: productId,
      isDeleted: false,
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await AddToCart.create({ product: productId, quantity });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Product added to cart successfully",
      data: cartItem,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL CART ITEMS (product + brand, material, size, color names ke saath)
export const getAllCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items = await AddToCart.find({ isDeleted: false })
      .populate(productPopulate)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Cart items retrieved successfully",
      totalItems: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE CART ITEM
export const getCartItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const item = await AddToCart.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate(productPopulate);

    if (!item) {
      return next(new appError("Cart item not found", 404));
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Cart item retrieved successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE CART (quantity)
export const updateCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { quantity } = updateCartSchema.parse(req.body);

    const updatedItem = await AddToCart.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { quantity },
      { new: true, runValidators: true },
    ).populate(productPopulate);

    if (!updatedItem) {
      return next(new appError("Cart item not found", 404));
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Cart updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE ONE CART ITEM
export const deleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const item = await AddToCart.findOneAndDelete({ _id: req.params.id });

    if (!item) {
      return next(new appError("Cart item not found", 404));
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Cart item deleted successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// CLEAR FULL CART
export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await AddToCart.deleteMany({});

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};
