import React, { Suspense } from "react";
import OrderSuccess from "./components/OrderSuccess";

export const metadata = {
  title: "Order Placed",
  description: "Your order has been placed successfully",
};

const OrderSuccessPage = () => {
  return (
    <Suspense fallback={null}>
      <OrderSuccess />
    </Suspense>
  );
};

export default OrderSuccessPage;
