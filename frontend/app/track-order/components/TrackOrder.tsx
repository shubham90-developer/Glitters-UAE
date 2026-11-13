"use client";

import React, { useState } from "react";
import Image from "next/image";

import {
  FiCheck,
  FiClock,
  FiHelpCircle,
  FiMapPin,
  FiPackage,
  FiSearch,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";

type TrackingStep = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  current?: boolean;
};

type OrderItem = {
  id: number;
  name: string;
  brand: string;
  image: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
};

const trackingSteps: TrackingStep[] = [
  {
    id: 1,
    title: "Order Confirmed",
    description: "Your order has been confirmed.",
    date: "24 Sep 2026",
    time: "10:20 AM",
    completed: true,
  },
  {
    id: 2,
    title: "Order Packed",
    description: "Your products have been packed.",
    date: "24 Sep 2026",
    time: "1:45 PM",
    completed: true,
  },
  {
    id: 3,
    title: "Shipped",
    description: "Your order has left our warehouse.",
    date: "24 Sep 2026",
    time: "4:30 PM",
    completed: true,
  },
  {
    id: 4,
    title: "Out for Delivery",
    description: "Your order is on the way to you.",
    date: "25 Sep 2026",
    time: "9:15 AM",
    completed: true,
    current: true,
  },
  {
    id: 5,
    title: "Delivered",
    description: "Your order will be delivered soon.",
    date: "Expected 25 Sep 2026",
    time: "",
    completed: false,
  },
];

const orderItems: OrderItem[] = [
  {
    id: 1,
    name: "Apple iPhone 16 Pro Max 256GB",
    brand: "Apple",
    image: "/img/products/iphone.png",
    quantity: 1,
    price: 4899,
    color: "Black Titanium",
    size: "256GB",
  },
  {
    id: 2,
    name: "Apple AirPods Pro 2nd Generation",
    brand: "Apple",
    image: "/img/products/airpods.png",
    quantity: 1,
    price: 899,
    color: "White",
  },
];

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");

  const [email, setEmail] = useState("");

  const [showTracking, setShowTracking] = useState(true);

  const handleTrack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!orderNumber.trim()) return;

    setShowTracking(true);
  };

  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const shipping = 0;

  const total = subtotal + shipping;

  return (
    <main
      className="
        min-h-screen
        bg-[#f7f7f8]
        py-4
        sm:py-6
        lg:py-8
        dark:bg-[#0f0f0f]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-375
          px-3
          sm:px-5
          lg:px-8
          xl:px-10
        "
      >
        {/* HERO */}
        <section
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            px-4
            py-7
            sm:px-6
            sm:py-9
            lg:px-8
            lg:py-10
            dark:border-gray-800
            dark:bg-[#181818]
          "
        >
          <div
            className="
              absolute
              -right-20
              -top-20
              h-60
              w-60
              rounded-full
              bg-[#ffd83d]/10
              blur-3xl
            "
          />

          <div className="relative max-w-190">
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-[#fff6ce]
                px-2.5
                py-1
                text-[8px]
                font-bold
                text-[#806300]
                sm:text-[9px]
                dark:bg-[#2b260f]
                dark:text-[#ffd83d]
              "
            >
              <FiTruck size={11} />
              Track your shipment
            </span>

            <h1
              className="
                mt-3
                font-serif
                text-[22px]
                font-extrabold
                text-black
                sm:text-[28px]
                lg:text-[34px]
                dark:text-white
              "
            >
              Track Your Order
            </h1>

            <p
              className="
                mt-2
                max-w-155
                text-[9px]
                leading-5
                text-gray-500
                sm:text-[10px]
                lg:text-[12px]
                dark:text-gray-400
              "
            >
              Enter your order number and email address to check the latest
              delivery status of your order.
            </p>

            {/* TRACK FORM */}
            <form
              onSubmit={handleTrack}
              className="
                mt-5
                grid
                max-w-180
                grid-cols-1
                gap-2.5
                sm:grid-cols-[1fr_1fr_auto]
              "
            >
              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-[12px]
                    font-semibold
                    text-gray-900
                    font-serif
                    dark:text-gray-300
                  "
                >
                  Order Number
                </label>

                <div
                  className="
                    flex
                    h-10
                    items-center
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-3
                    transition
                    focus-within:border-[#ffd83d]
                    sm:h-11
                    dark:border-gray-700
                    dark:bg-[#202020]
                  "
                >
                  <FiPackage size={12} className="shrink-0 text-gray-400" />

                  <input
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="ORD-123456"
                    className="
                      h-full
                      min-w-0
                      flex-1
                      bg-transparent
                      px-2
                      text-[12px]
                      font-bold
                      text-black
                      outline-none
                      placeholder:text-gray-400
                      dark:text-white
                    "
                  />
                </div>
              </div>

              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-[12px]
                    font-semibold
                    text-gray-900
                    font-serif
                    dark:text-gray-300
                  "
                >
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-3
                    text-[12px]
                    text-black
                    font-bold
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-[#ffd83d]
                    sm:h-11
                    dark:border-gray-700
                    dark:bg-[#202020]
                    dark:text-white
                  "
                />
              </div>

              <ThemeBtnOne
                type="submit"
                text="Track Order"
                icon={<FiSearch size={12} />}
                className="
                  mt-auto
                  flex
                  h-10
                  cursor-pointer
                  items-center
                  justify-center
                  gap-1.5
                  rounded-lg
                  bg-[#ffd83d]
                  px-5
                  font-serif
                  text-[9px]
                  font-extrabold
                  text-black
                  transition
                  hover:bg-[#ffcf12]
                  sm:h-11
                "
              />
            </form>
          </div>
        </section>

        {showTracking && (
          <>
            {/* ORDER STATUS TOP */}
            <section
              className="
                mt-4
                grid
                grid-cols-2
                gap-2.5
                sm:gap-3
                lg:grid-cols-4
              "
            >
              <StatusCard
                icon={<FiShoppingBag size={16} />}
                label="Order Number"
                value="ORD-123456"
              />

              <StatusCard
                icon={<FiTruck size={16} />}
                label="Current Status"
                value="Out for Delivery"
                green
              />

              <StatusCard
                icon={<FiClock size={16} />}
                label="Estimated Delivery"
                value="25 Sep 2026"
              />

              <StatusCard
                icon={<FiPackage size={16} />}
                label="Courier"
                value="Express Delivery"
              />
            </section>

            {/* MAIN */}
            <div
              className="
                mt-4
                grid
                grid-cols-1
                gap-4
                lg:grid-cols-[minmax(0,1fr)_350px]
                xl:grid-cols-[minmax(0,1fr)_390px]
                xl:gap-6
              "
            >
              {/* LEFT */}
              <div className="min-w-0 space-y-4">
                {/* TRACKING */}
                <section
                  className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-4
                    sm:p-5
                    lg:p-6
                    dark:border-gray-800
                    dark:bg-[#181818]
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <div>
                      <h2
                        className="
                          font-serif
                          text-[15px]
                          font-extrabold
                          text-black
                          sm:text-[17px]
                          dark:text-white
                        "
                      >
                        Shipment Tracking
                      </h2>

                      <p
                        className="
                          mt-0.5
                          text-[8px]
                          text-gray-400
                        "
                      >
                        Latest order delivery updates
                      </p>
                    </div>

                    <span
                      className="
                        rounded-full
                        bg-green-50
                        px-2.5
                        py-1
                        text-[7px]
                        font-bold
                        text-green-600
                        dark:bg-green-500/10
                      "
                    >
                      In Transit
                    </span>
                  </div>

                  {/* MOBILE TIMELINE */}
                  <div className="mt-6 space-y-0">
                    {trackingSteps.map((step, index) => (
                      <TrackingItem
                        key={step.id}
                        step={step}
                        last={index === trackingSteps.length - 1}
                      />
                    ))}
                  </div>
                </section>

                {/* ITEMS */}
                <section
                  className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-4
                    sm:p-5
                    dark:border-gray-800
                    dark:bg-[#181818]
                  "
                >
                  <div>
                    <h2
                      className="
                        font-serif
                        text-[14px]
                        font-extrabold
                        text-black
                        sm:text-[16px]
                        dark:text-white
                      "
                    >
                      Items in Your Order
                    </h2>

                    <p
                      className="
                        mt-0.5
                        text-[12px]
                        text-gray-900
                      "
                    >
                      2 products in this shipment
                    </p>
                  </div>

                  <div
                    className="
                      mt-4
                      divide-y
                      divide-gray-100
                      dark:divide-gray-800
                    "
                  >
                    {orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="
                            flex
                            gap-3
                            py-3
                            first:pt-0
                            last:pb-0
                          "
                      >
                        <div
                          className="
                              relative
                              h-17.5
                              w-17.5
                              shrink-0
                              overflow-hidden
                              rounded-xl
                              bg-[#f8f8f8]
                              p-2
                              dark:bg-[#222]
                            "
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={90}
                            height={90}
                            className="
                                h-full
                                w-full
                                object-contain
                              "
                          />

                          <span
                            className="
                                absolute
                                right-1
                                top-1
                                flex
                                h-4
                                min-w-4
                                items-center
                                justify-center
                                rounded-full
                                bg-[#ffd83d]
                                px-1
                                text-[12px]
                                font-bold
                                text-black
                              "
                          >
                            {item.quantity}
                          </span>
                        </div>

                        <div
                          className="
                              min-w-0
                              flex-1
                            "
                        >
                          <p
                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-gray-400
                              "
                          >
                            {item.brand}
                          </p>

                          <h3
                            className="
                                mt-0.5
                                line-clamp-2
                                font-serif
                                text-[12px]
                                font-bold
                                leading-4
                                text-black
                                sm:text-[10px]
                                dark:text-white
                              "
                          >
                            {item.name}
                          </h3>

                          <div
                            className="
                                mt-1.5
                                flex
                                flex-wrap
                                gap-1
                              "
                          >
                            {item.color && (
                              <span
                                className="
                                    rounded-full
                                    border
                                    border-gray-200
                                    px-1.5
                                    py-0.5
                                    text-[10px]
                                    text-gray-500
                                    dark:border-gray-700
                                    dark:text-gray-400
                                  "
                              >
                                {item.color}
                              </span>
                            )}

                            {item.size && (
                              <span
                                className="
                                    rounded-full
                                    bg-[#fff8d8]
                                    px-1.5
                                    py-0.5
                                    text-[10px]
                                    font-bold
                                    text-[#806400]
                                    dark:bg-[#29240f]
                                    dark:text-[#ffd83d]
                                  "
                              >
                                {item.size}
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          className="
                              shrink-0
                              text-right
                            "
                        >
                          <p
                            className="
                                text-[12px]
                                font-bold
                                text-black
                                font-serif
                                dark:text-white
                              "
                          >
                            AED {item.price.toLocaleString()}
                          </p>

                          <p
                            className="
                                mt-1
                                text-[10px]
                                text-gray-900
                              "
                          >
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* SIDEBAR */}
              <aside className="space-y-4">
                {/* DELIVERY ADDRESS */}
                <section
                  className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-4
                    sm:p-5
                    dark:border-gray-800
                    dark:bg-[#181818]
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2.5
                    "
                  >
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#fff6ce]
                        text-[#8b6a00]
                        dark:bg-[#2b260f]
                        dark:text-[#ffd83d]
                      "
                    >
                      <FiMapPin size={14} />
                    </div>

                    <div>
                      <h2
                        className="
                          font-serif
                          text-[12px]
                          font-extrabold
                          text-black
                          dark:text-white
                        "
                      >
                        Delivery Address
                      </h2>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          text-gray-900
                        "
                      >
                        Shipping destination
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      mt-4
                      rounded-xl
                      bg-[#f8f8f8]
                      p-3
                      dark:bg-[#202020]
                    "
                  >
                    <p
                      className="
                        text-[12px]
                        font-bold
                        font-serif
                        text-black
                        dark:text-white
                      "
                    >
                      John Doe
                    </p>

                    <p
                      className="
                        mt-1.5
                        text-[12px]
                        leading-4
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Apartment 1204, Marina Heights Tower, Dubai Marina, Dubai,
                      United Arab Emirates
                    </p>

                    <p
                      className="
                        mt-2
                        text-[12px]
                        font-semibold
                        text-gray-900
                        font-serif
                        dark:text-gray-300
                      "
                    >
                      +971 50 123 4567
                    </p>
                  </div>
                </section>

                {/* ORDER SUMMARY */}
                <section
                  className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-4
                    sm:p-5
                    dark:border-gray-800
                    dark:bg-[#181818]
                  "
                >
                  <h2
                    className="
                      font-serif
                      text-[13px]
                      font-extrabold
                      text-black
                      dark:text-white
                    "
                  >
                    Order Summary
                  </h2>

                  <div
                    className="
                      mt-4
                      space-y-3
                    "
                  >
                    <SummaryRow
                      label="Subtotal"
                      value={`AED ${subtotal.toLocaleString()}`}
                    />

                    <SummaryRow label="Shipping" value="FREE" green />

                    <div
                      className="
                        border-t
                        border-gray-100
                        pt-3
                        dark:border-gray-800
                      "
                    >
                      <div
                        className="
                          flex
                          items-end
                          justify-between
                          gap-3
                        "
                      >
                        <div>
                          <p
                            className="
                              text-[12px]
                              font-bold
                              text-black
                              dark:text-white
                            "
                          >
                            Total
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-[10px]
                              text-gray-900
                            "
                          >
                            Inclusive of VAT
                          </p>
                        </div>

                        <p
                          className="
                            font-serif
                            text-[17px]
                            font-extrabold
                            text-black
                            dark:text-white
                          "
                        >
                          AED {total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* HELP */}
                <section
                  className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-4
                    sm:p-5
                    dark:border-gray-800
                    dark:bg-[#181818]
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#fff6ce]
                      text-[#8b6a00]
                      dark:bg-[#2b260f]
                      dark:text-[#ffd83d]
                    "
                  >
                    <FiHelpCircle size={14} />
                  </div>

                  <h3
                    className="
                      mt-3
                      font-serif
                      text-[12px]
                      font-extrabold
                      text-black
                      dark:text-white
                    "
                  >
                    Need Help?
                  </h3>

                  <p
                    className="
                      mt-1
                      text-[12px]
                      leading-4
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Contact our support team if you have questions about your
                    shipment.
                  </p>

                  <ThemeBtnOne
                    text=" Contact Support"
                    url="/contact-us"
                    className="
                      mt-4
                      flex
                      h-9
                      font-serif
                      w-full
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#ffd83d]
                      text-[8px]
                      font-extrabold
                      text-black
                      transition
                      hover:bg-[#ffcf12]
                    "
                  />
                </section>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

/* ========================================= */
/* STATUS CARD */
/* ========================================= */

const StatusCard = ({
  icon,
  label,
  value,
  green = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  green?: boolean;
}) => {
  return (
    <div
      className="
        rounded-xl
        border
        border-gray-200
        bg-white
        p-3
        sm:p-4
        dark:border-gray-800
        dark:bg-[#181818]
      "
    >
      <div
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-lg
          bg-[#fff6ce]
          text-[#8b6a00]
          dark:bg-[#2b260f]
          dark:text-[#ffd83d]
        "
      >
        {icon}
      </div>

      <p
        className="
          mt-2.5
          text-[12px]
          text-gray-900
          font-serif
          font-bold
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-0.5
          truncate
          text-[12px]
          font-bold

          ${green ? "text-green-600" : "text-black dark:text-white"}
        `}
      >
        {value}
      </p>
    </div>
  );
};

/* ========================================= */
/* TRACKING ITEM */
/* ========================================= */

const TrackingItem = ({
  step,
  last,
}: {
  step: TrackingStep;
  last: boolean;
}) => {
  return (
    <div
      className="
        relative
        flex
        gap-3
      "
    >
      {!last && (
        <span
          className={`
            absolute
            left-3.75
            top-8
            h-[calc(100%-8px)]
            w-0.5

            ${step.completed ? "bg-[#ffd83d]" : "bg-gray-200 dark:bg-gray-700"}
          `}
        />
      )}

      <div
        className={`
          relative
          z-10
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          border-2

          ${
            step.completed
              ? `
                border-[#ffd83d]
                bg-[#ffd83d]
                text-black
              `
              : `
                border-gray-200
                bg-white
                text-gray-300

                dark:border-gray-700
                dark:bg-[#202020]
              `
          }

          ${step.current ? "shadow-[0_0_0_5px_rgba(255,216,61,0.14)]" : ""}
        `}
      >
        {step.completed ? <FiCheck size={13} /> : <FiPackage size={12} />}
      </div>

      <div
        className={`
          min-w-0
          flex-1

          ${last ? "" : "pb-6"}
        `}
      >
        <div
          className="
            flex
            flex-col
            gap-1
            sm:flex-row
            sm:items-start
            sm:justify-between
            sm:gap-4
          "
        >
          <div>
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <h3
                className={`
                  text-[9px]
                  font-bold
                  sm:text-[12px]

                  ${
                    step.completed
                      ? "text-black dark:text-white"
                      : "text-gray-400"
                  }
                `}
              >
                {step.title}
              </h3>

              {step.current && (
                <span
                  className="
                    rounded-full
                    bg-green-50
                    px-2
                    py-0.5
                    text-[10px]
                    font-bold
                    text-green-600
                    dark:bg-green-500/10
                  "
                >
                  Current
                </span>
              )}
            </div>

            <p
              className="
                mt-0.5
                text-[7px]
                leading-4
                text-gray-900
                sm:text-[10px]
              "
            >
              {step.description}
            </p>
          </div>

          <div
            className="
              shrink-0
              sm:text-right
            "
          >
            <p
              className="
                text-[10px]
                font-semibold
                text-gray-900
                dark:text-gray-400
              "
            >
              {step.date}
            </p>

            {step.time && (
              <p
                className="
                  mt-0.5
                  text-[10px]
                  text-gray-900
                "
              >
                {step.time}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================= */
/* SUMMARY ROW */
/* ========================================= */

const SummaryRow = ({
  label,
  value,
  green = false,
}: {
  label: string;
  value: string;
  green?: boolean;
}) => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-3
      "
    >
      <span
        className="
          text-[12px]
          text-gray-900
          font-bold
          dark:text-gray-400
        "
      >
        {label}
      </span>

      <span
        className={`
          text-[8px]
          font-bold

          ${green ? "text-green-600" : "text-black dark:text-white"}
        `}
      >
        {value}
      </span>
    </div>
  );
};

export default TrackOrder;
