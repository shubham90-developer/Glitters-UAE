export type Coupon = {
  _id?: string;
  productId?: string;
  couponName?: string;
  subTitle?: string;
  couponCode?: string;
  couponAmount?: string | number;
  status?: string;
  eligible?: boolean;
};

export type Product = {
  _id: string;
  id?: string;
  name?: string;
  productName?: string;
  title?: string;
  price?: number | string;
  coupon?: Coupon | null;
  coupons?: Coupon[];
  // flat coupon fields (when the API puts the coupon directly on the product)
  couponName?: string;
  subTitle?: string;
  couponCode?: string;
  couponAmount?: string | number;
  status?: string;
  eligible?: boolean;
};

export type ProductCoupon = {
  product: Product;
  coupon: Coupon;
};

export const getProductId = (product: Product): string =>
  String(product._id || product.id || "");

export const getProductName = (product: Product): string =>
  product.productName || product.name || product.title || "Product";

/** One rule for "can this coupon be used?" shared by the list and the cart. */
export const isCouponUsable = (coupon: Coupon): boolean => {
  const amount = Number(coupon.couponAmount);

  return (
    (coupon.status || "").toLowerCase() === "active" &&
    coupon.eligible !== false &&
    Boolean(coupon.couponCode) &&
    Number.isFinite(amount) &&
    amount > 0 &&
    amount <= 100
  );
};
