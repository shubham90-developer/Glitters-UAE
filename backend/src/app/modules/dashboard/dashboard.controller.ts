import { NextFunction, Request, Response } from "express";
import { Product } from "../products/product.model";
import { Order } from "../orders/order.model";
import { User } from "../auth/auth.model";
import { Contact } from "../contacts/contacts.model";
import { CareerEnquiry } from "../careersEnquiry/careerEnquiry.model";
import { BlogsModel } from "../blogs/blogs.model";

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const weekAgo = new Date(startOfToday);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [
      totalProducts,
      totalOrders,
      todaysOrders,
      lastWeekOrders,
      pendingOrders,
      deliveredOrders,
      revenueAgg,
      totalCustomers,
      totalJobEnquiries,
      totalContactEnquiries,
      totalBlogs,
    ] = await Promise.all([
      Product.countDocuments({ isDeleted: false }),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ createdAt: { $gte: weekAgo } }),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.countDocuments({ orderStatus: "delivered" }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      User.countDocuments(),
      CareerEnquiry.countDocuments(),
      Contact.countDocuments({ isDeleted: false }),
      BlogsModel.countDocuments({ isDeleted: false }),
    ]);

    const deliveredRate = totalOrders
      ? Math.round((deliveredOrders / totalOrders) * 1000) / 10
      : 0;

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Dashboard stats retrieved successfully",
      data: {
        totalProducts,
        totalOrders,
        todaysOrders,
        lastWeekOrders,
        pendingOrders,
        deliveredRate,
        totalRevenue: revenueAgg[0]?.total ?? 0,
        totalCustomers,
        totalJobEnquiries,
        totalContactEnquiries,
        totalBlogs,
      },
    });
  } catch (error) {
    next(error);
  }
};
