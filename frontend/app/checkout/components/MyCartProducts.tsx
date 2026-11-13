import Image from "next/image";
import Link from "next/link";
import React from "react";

type CheckoutItem = {
  id: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  color?: string;
  size?: string;
};

const checkoutItems: CheckoutItem[] = [
  {
    id: 1,
    name: "Apple iPhone 16 Pro Max 256GB",
    brand: "Apple",
    image: "/img/products/iphone.png",
    price: 4899,
    oldPrice: 5299,
    quantity: 1,
    color: "Black Titanium",
    size: "256GB",
  },
  {
    id: 2,
    name: "Apple AirPods Pro 2nd Generation",
    brand: "Apple",
    image: "/img/products/airpods.png",
    price: 899,
    oldPrice: 1099,
    quantity: 1,
    color: "White",
  },
];

const MyCartProducts = () => {
  return (
    <>
      <div
        className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-4
                    shadow-[0_5px_24px_rgba(0,0,0,0.04)]
    
                    sm:p-5
    mb-4
                    lg:sticky
                    lg:top-25
    
                    dark:border-gray-800
                    dark:bg-[#181818]
                  "
      >
        {" "}
        <div className="flex items-center justify-between gap-3">
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
            My Cart Products
          </h2>

          <Link
            href="/cart"
            className="
                        text-[10px]
                        font-bold
                        text-white
    bg-green-500 px-2 py-1 rounded-lg
                        hover:underline
    
                        dark:text-[#ffd83d]
                      "
          >
            Edit Cart
          </Link>
        </div>{" "}
        {/* PRODUCTS */}
        <div
          className="
                      mt-4
                      space-y-3
                      border-b
                      border-gray-100
                      pb-4
    
                      dark:border-gray-800
                    "
        >
          {checkoutItems.map((item) => (
            <div key={item.id} className="flex gap-2.5">
              <div
                className="
                              relative
                              h-15
                              w-15
                              shrink-0
                              overflow-hidden
                              rounded-lg
                              bg-[#f8f8f8]
                              p-1.5
    
                              dark:bg-[#222]
                            "
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={70}
                  height={70}
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
                                text-[6px]
                                font-bold
                                text-black
                              "
                >
                  {item.quantity}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                                truncate
                                text-[7px]
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
                                text-[9px]
                                font-bold
                                leading-4
                                text-black
                                tracking-wider
                                dark:text-white
                              "
                >
                  {item.name}
                </h3>

                <div className="mt-1 flex flex-wrap gap-1">
                  {item.color && (
                    <span
                      className="
                                    rounded-full
                                    border
                                    border-gray-200
                                    px-1.5
                                    py-0.5
                                    text-[8px]
                                    text-gray-900
    
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
                                    text-[8px]
                                    font-bold
                                    text-gray-900
    
                                    dark:bg-[#29240f]
                                    dark:text-[#ffd83d]
                                  "
                    >
                      {item.size}
                    </span>
                  )}
                </div>
              </div>

              <span
                className="
                              shrink-0
                              text-[9px]
                              font-bold
                              text-black
                                font-serif
                              dark:text-white
                            "
              >
                AED {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyCartProducts;
