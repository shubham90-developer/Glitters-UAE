import { useCallback, useMemo, useState } from "react";
import {
  Coupon,
  getProductId,
  isCouponUsable,
  Product,
  ProductCoupon,
} from "./Coupon";

type CouponCartItem = {
  productId: string;
  price: number;
  quantity: number;
};

type Feedback = { text: string; isError: boolean } | null;

const round2 = (value: number) => Math.round(value * 100) / 100;

export const useCartCoupon = (cartItems: CouponCartItem[]) => {
  const [code, setCode] = useState("");
  const [selected, setSelected] = useState<ProductCoupon | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<ProductCoupon[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const fail = useCallback((text: string) => {
    setSelected(null);
    setFeedback({ text, isError: true });
  }, []);

  // Core apply logic - used by both the input and the coupon cards.
  const applyCoupon = useCallback(
    (coupon: Coupon, product: Product) => {
      if (!isCouponUsable(coupon)) {
        return fail("This coupon is not currently available.");
      }

      const productId = getProductId(product);
      if (!cartItems.some((item) => item.productId === productId)) {
        return fail(
          "Add the eligible product to your cart to use this coupon.",
        );
      }

      setSelected({ coupon, product });
      setCode(coupon.couponCode || "");
      setFeedback({ text: "Coupon applied successfully.", isError: false });
    },
    [cartItems, fail],
  );

  const applyCode = useCallback(() => {
    const entered = code.trim().toUpperCase();
    if (!entered) return fail("Please enter a coupon code.");

    const match = availableCoupons.find(
      ({ coupon }) => coupon.couponCode?.trim().toUpperCase() === entered,
    );
    if (!match) return fail("Invalid coupon code.");

    applyCoupon(match.coupon, match.product);
  }, [code, availableCoupons, applyCoupon, fail]);

  const changeCode = useCallback(
    (value: string) => {
      setCode(value);
      setFeedback(null);

      const appliedCode = selected?.coupon.couponCode?.toUpperCase();
      if (appliedCode && value.trim().toUpperCase() !== appliedCode) {
        setSelected(null);
      }
    },
    [selected],
  );

  const removeCoupon = useCallback(() => {
    setSelected(null);
    setCode("");
    setFeedback({ text: "Coupon removed.", isError: false });
  }, []);

  // The coupon only counts while its product is still in the cart.
  const activeCoupon = useMemo(() => {
    if (!selected) return null;
    const productId = getProductId(selected.product);
    return cartItems.some((item) => item.productId === productId)
      ? selected
      : null;
  }, [selected, cartItems]);

  const discount = useMemo(() => {
    if (!activeCoupon || !isCouponUsable(activeCoupon.coupon)) return 0;

    const productId = getProductId(activeCoupon.product);
    const percentage = Number(activeCoupon.coupon.couponAmount);

    const eligibleSubtotal = cartItems.reduce(
      (sum, item) =>
        item.productId === productId
          ? sum + item.price * Math.max(0, item.quantity)
          : sum,
      0,
    );

    return Math.min(
      eligibleSubtotal,
      round2((eligibleSubtotal * percentage) / 100),
    );
  }, [activeCoupon, cartItems]);

  return {
    code,
    changeCode,
    applyCode,
    applyCoupon,
    removeCoupon,
    activeCoupon,
    feedback,
    discount,
    setAvailableCoupons, // stable setter, safe to pass as onCouponsLoaded
  };
};
