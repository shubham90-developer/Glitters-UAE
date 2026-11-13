import React, { Suspense } from "react";
import PaymentStatus from "./components/PaymentStatus";

export const metadata = {
  title: "Confirming Payment",
  description: "Confirming your payment",
};

const PaymentStatusPage = () => {
  return (
    <Suspense fallback={null}>
      <PaymentStatus />
    </Suspense>
  );
};

export default PaymentStatusPage;
