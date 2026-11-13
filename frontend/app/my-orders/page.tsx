import Breadcrumb from "../components/Breadcrumb";
import MyOrders from "../my-account/components/MyOrders";

export const metadata = {
  title: "My Orders",
  description: "View your orders",
};

const MyOrdersPage = () => {
  return (
    <>
      <Breadcrumb />
      <div className="mx-auto w-full max-w-4xl px-3 py-8">
        <MyOrders />
      </div>
    </>
  );
};

export default MyOrdersPage;
