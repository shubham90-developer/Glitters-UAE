"use client";

import React, { useState } from "react";

import Link from "next/link";

import {
  FiArrowLeft,
  FiCheck,
  FiCreditCard,
  FiEdit2,
  FiMapPin,
  FiPackage,
  FiPlus,
  FiShield,
  FiSmartphone,
} from "react-icons/fi";
import OrderSummary from "./OrderSummary";
import { toast } from "react-toastify";
import {
  IAddress,
  IAddressBody,
  useAddAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from "@/store/addressapi";

type PaymentMethod =
  | "card"
  | "upi"
  | "razorpay"
  | "tabby"
  | "cod"
  | "apple-pay";

// UAE has seven emirates
const UAE_EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

const UAE_COUNTRY = "United Arab Emirates";

// builds the single address line shown in the UI and sent to OrderSummary
const formatAddressLine = (a: IAddress) => {
  const line = [a.address, a.city, a.state, UAE_COUNTRY]
    .filter(Boolean)
    .join(", ");
  return a.pincode ? `${line} - ${a.pincode}` : line;
};

const emptyForm: IAddressBody = {
  type: "Home",
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

// "+919876543210" -> "+91 98765 43210"
const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "").slice(-10);
  return digits.length === 10
    ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
    : phone;
};

// read backend error message from an RTK Query error
const getErrorMessage = (error: unknown) => {
  const err = error as { data?: { message?: string } };
  return err?.data?.message || "Something went wrong. Please try again.";
};

// UAE rules -> error message or null
const validateForm = (f: IAddressBody): string | null => {
  if (!f.name.trim()) return "Name is required";

  // UAE mobile: +971 5X XXX XXXX (9 digits after the country code)
  const digits = f.phone.replace(/\D/g, "");
  const uaeNumber = digits.startsWith("971")
    ? digits.slice(3)
    : digits.replace(/^0/, "");
  if (!/^5\d{8}$/.test(uaeNumber)) return "Enter a valid UAE mobile number";

  if (!f.address.trim()) return "Address is required";
  if (!f.city.trim()) return "City is required";
  if (!UAE_EMIRATES.includes(f.state)) return "Please select a UAE emirate";

  return null;
};

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  // saved addresses now come from the API (no more dummy data)
  const {
    data: addresses = [],
    isLoading: addressesLoading,
    isError: addressesError,
  } = useGetAddressesQuery();

  // null = user has not clicked any address yet -> fall back to default / first
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  // true = the add / edit address form is open instead of the saved list
  const [showForm, setShowForm] = useState(false);

  // id of the address being edited (null = adding a new one)
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<IAddressBody>(emptyForm);

  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  const isSaving = isAdding || isUpdating;

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (item: IAddress) => {
    setEditingId(item._id);
    setFormData({
      type: item.type,
      name: item.name,
      phone: formatPhone(item.phone),
      address: item.address,
      city: item.city,
      state: item.state,
      pincode: item.pincode,
      isDefault: item.isDefault,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSaving) return;

    const validationError = validateForm(formData);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      if (editingId) {
        await updateAddress({ id: editingId, body: formData }).unwrap();
        setSelectedAddressId(editingId);
        toast.success("Address updated successfully");
      } else {
        const res = await addAddress(formData).unwrap();
        // select the address that was just added
        setSelectedAddressId(res.data._id);
        toast.success("Address added successfully");
      }

      closeForm();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const editingIsDefault =
    !!editingId && !!addresses.find((a) => a._id === editingId)?.isDefault;

  // currently selected address id (derived, so it stays valid after
  // adding / deleting addresses elsewhere)
  const activeAddressId =
    selectedAddressId && addresses.some((a) => a._id === selectedAddressId)
      ? selectedAddressId
      : ((addresses.find((a) => a.isDefault) ?? addresses[0])?._id ?? null);

  // address sent with the order (only a saved address can be used for now)
  const chosenAddress = showForm
    ? null
    : (addresses.find((a) => a._id === activeAddressId) ?? null);

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
        {/* ============================== */}
        {/* PAGE HEADER */}
        {/* ============================== */}

        <div
          className="
            mb-5
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <div>
            <h1
              className="
                font-serif
                text-[28px]
                font-extrabold
                text-black

                sm:text-[32px]

                lg:text-[38px]

                dark:text-white
              "
            >
              Checkout
            </h1>

            <p
              className="
                mt-1
                text-[14px]
                text-gray-500

                sm:text-[15px]

                dark:text-gray-400
              "
            >
              Complete your order securely
            </p>
          </div>

          <Link
            href="/cart"
            className="
              flex
              items-center
              gap-1.5
              text-[14px]
              font-bold
              text-gray-600
              transition

              hover:text-black

              sm:text-[15px]

              dark:text-gray-300
              dark:hover:text-white
            "
          >
            <FiArrowLeft size={15} />
            Back to Cart
          </Link>
        </div>

        {/* ============================== */}
        {/* CHECKOUT STEPS */}
        {/* ============================== */}

        <div
          className="
            mb-5
            flex
            items-center
            overflow-hidden
            rounded-xl
            border
            border-gray-200
            bg-white
            p-3

            dark:border-gray-800
            dark:bg-[#181818]
          "
        >
          <div className="flex flex-1 items-center gap-2">
            <span
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#ffd83d]
                text-black
              "
            >
              <FiCheck size={14} />
            </span>

            <div className="hidden min-[420px]:block">
              <p className="text-[17px] font-serif font-bold text-black dark:text-white">
                Cart
              </p>

              <p className="text-[15px] text-gray-900">Completed</p>
            </div>
          </div>

          <div className="h-px flex-1 bg-[#ffd83d]" />

          <div
            className="
              flex
              flex-1
              items-center
              justify-center
              gap-2
            "
          >
            <span
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#ffd83d]
                text-[13px]
                font-bold
                text-black
              "
            >
              2
            </span>

            <div className="hidden min-[420px]:block">
              <p className="text-[17px] font-serif font-bold text-black dark:text-white">
                Checkout
              </p>

              <p className="text-[15px] text-gray-900">Shipping & Payment</p>
            </div>
          </div>

          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />

          <div
            className="
              flex
              flex-1
              items-center
              justify-end
              gap-2
            "
          >
            <span
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-gray-100
                text-[13px]
                font-bold
                text-gray-400

                dark:bg-[#252525]
              "
            >
              3
            </span>

            <div className="hidden min-[420px]:block">
              <p className="text-[17px] font-serif font-bold text-gray-400">
                Complete
              </p>

              <p className="text-[15px] text-gray-900">Order placed</p>
            </div>
          </div>
        </div>

        {/* ============================== */}
        {/* LAYOUT */}
        {/* ============================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-4

            lg:grid-cols-[minmax(0,1fr)_350px]

            xl:grid-cols-[minmax(0,1fr)_390px]
            xl:gap-6
          "
        >
          {/* ============================== */}
          {/* LEFT */}
          {/* ============================== */}

          <div className="min-w-0 space-y-4">
            {/* ============================== */}
            {/* SHIPPING ADDRESS */}
            {/* ============================== */}

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
                  mb-4
                  flex
                  items-start
                  justify-between
                  gap-3
                "
              >
                <div className="flex items-center gap-2.5">
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
                    <FiMapPin size={16} />
                  </div>

                  <div>
                    <h2
                      className="
                        font-serif
                        text-[19px]
                        font-extrabold
                        text-black

                        sm:text-[21px]

                        dark:text-white
                      "
                    >
                      Shipping Address
                    </h2>

                    <p className="mt-0.5 text-[15px] text-gray-900">
                      Choose your delivery address
                    </p>
                  </div>
                </div>

                {!showForm && (
                  <button
                    type="button"
                    onClick={openAddForm}
                    className="
                      flex
                      shrink-0
                      cursor-pointer
                      items-center
                      gap-1
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-2.5
                      py-2
                      text-[13px]
                      font-bold
                      text-gray-900
                      transition
                      font-serif
                      hover:border-[#ffd83d]
                      hover:text-black

                      dark:border-gray-700
                      dark:bg-[#202020]
                      dark:text-gray-300
                    "
                  >
                    <FiPlus size={12} />

                    <span className="hidden sm:inline">Different Address</span>

                    <span className="sm:hidden">New</span>
                  </button>
                )}
              </div>

              {!showForm ? (
                <div className="space-y-2.5">
                  {/* LOADING / ERROR / EMPTY STATES */}
                  {addressesLoading && (
                    <p className="py-4 text-center text-[15px] text-gray-500 dark:text-gray-400">
                      Loading your addresses...
                    </p>
                  )}

                  {!addressesLoading && addressesError && (
                    <p className="py-4 text-center text-[15px] text-red-500">
                      Could not load your addresses. Please refresh the page.
                    </p>
                  )}

                  {!addressesLoading &&
                    !addressesError &&
                    addresses.length === 0 && (
                      <p className="py-4 text-center text-[15px] text-gray-500 dark:text-gray-400">
                        You have no saved addresses yet. Add one to continue.
                      </p>
                    )}

                  {addresses.map((address) => {
                    const active = activeAddressId === address._id;

                    return (
                      <button
                        key={address._id}
                        type="button"
                        onClick={() => setSelectedAddressId(address._id)}
                        className={`
                            relative
                            flex
                            w-full
                            cursor-pointer
                            items-start
                            gap-3
                            rounded-xl
                            border
                            p-3
                            text-left
                            transition-all

                            sm:p-4

                            ${
                              active
                                ? `
                                  border-[#ffd83d]
                                  bg-[#fffdf4]
                                  shadow-[0_3px_14px_rgba(255,216,61,0.08)]

                                  dark:bg-[#29260f]
                                `
                                : `
                                  border-gray-200
                                  bg-white

                                  hover:border-gray-300

                                  dark:border-gray-700
                                  dark:bg-[#202020]
                                `
                            }
                          `}
                      >
                        <span
                          className={`
                              mt-1
                              flex
                              h-4
                              w-4
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              border

                              ${
                                active
                                  ? "border-[#ffd83d] bg-[#ffd83d]"
                                  : "border-gray-300 dark:border-gray-600"
                              }
                            `}
                        >
                          {active && (
                            <FiCheck size={10} className="text-black" />
                          )}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-1.5
                              "
                          >
                            <h3
                              className="
                                  text-[15px]
                                  font-bold
                                  text-black
                                  font-serif
                                  sm:text-[16px]

                                  dark:text-white
                                "
                            >
                              {address.name}
                            </h3>

                            <span
                              className="
                                  rounded-full
                                  bg-[#fff4be]
                                  px-2
                                  py-0.5
                                  text-[13px]
                                  font-bold
                                  text-gray-900

                                  dark:bg-[#332c0b]
                                  dark:text-[#ffd83d]
                                "
                            >
                              {address.type}
                            </span>

                            {address.isDefault && (
                              <span
                                className="
                                    rounded-full
                                    bg-green-50
                                    px-2
                                    py-0.5
                                    text-[11px]
                                    font-bold
                                    text-green-600

                                    dark:bg-green-500/10
                                  "
                              >
                                Default
                              </span>
                            )}
                          </div>

                          <p
                            className="
                                mt-1.5
                                max-w-175
                                text-[13px]
                                leading-5
                                text-gray-900

                                sm:text-[15px]

                                dark:text-gray-400
                              "
                          >
                            {formatAddressLine(address)}
                          </p>

                          <p
                            className="
                                mt-1
                                text-[15px]
                                font-semibold
                                text-gray-900
                                font-serif
                                dark:text-gray-300
                              "
                          >
                            {formatPhone(address.phone)}
                          </p>
                        </div>

                        <span
                          className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-gray-200
                              bg-blue-300
                              text-white

                              dark:border-gray-700
                              dark:bg-[#252525]
                              dark:text-gray-300
                            "
                          onClick={(event) => {
                            event.stopPropagation();

                            openEditForm(address);
                          }}
                        >
                          <FiEdit2 size={12} />
                        </span>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={openAddForm}
                    className="
                      flex
                      w-full
                      cursor-pointer
                      items-center
                      justify-center
                      gap-1.5
                      rounded-xl
                      border
                      border-dashed
                      border-gray-300
                      px-3
                      py-3
                      text-[16px]
                      font-bold
                      text-gray-900
                      transition
                      font-serif
                      hover:border-[#ffd83d]
                      hover:text-black

                      dark:border-gray-700
                      dark:text-gray-400
                      dark:hover:text-white
                    "
                  >
                    <FiPlus size={12} />
                    Add New Address
                  </button>
                </div>
              ) : (
                /* ============================== */
                /* ADD / EDIT ADDRESS FORM */
                /* ============================== */

                <form onSubmit={handleSubmit} noValidate>
                  <div
                    className="
                      mb-4
                      flex
                      items-center
                      justify-between
                      gap-3
                      rounded-lg
                      bg-[#f8f8f8]
                      px-3
                      py-2.5

                      dark:bg-[#202020]
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[14px]
                          font-bold
                          text-black

                          dark:text-white
                        "
                      >
                        {editingId ? "Edit Address" : "Add New Address"}
                      </p>

                      <p className="mt-0.5 text-[12px] text-gray-400">
                        Enter shipping details
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeForm}
                      className="
                        cursor-pointer
                        text-[13px]
                        font-bold
                        text-[#9a7600]

                        hover:underline

                        dark:text-[#ffd83d]
                      "
                    >
                      Saved Address
                    </button>
                  </div>

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-3

                      sm:grid-cols-2
                    "
                  >
                    <CheckoutInput
                      label="Full Name"
                      placeholder="Full name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                    />

                    <CheckoutInput
                      label="Phone Number"
                      placeholder="+971 50 123 4567"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                    />

                    <div className="sm:col-span-2">
                      <CheckoutInput
                        label="Address"
                        placeholder="Building, street, apartment"
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                      />
                    </div>

                    <CheckoutInput
                      label="City / Area"
                      placeholder="Enter city or area"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                    />

                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-[15px]
                          font-semibold
                          text-gray-900
                          font-serif
                          dark:text-gray-300
                        "
                      >
                        Emirate
                      </label>

                      <select
                        name="state"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                        className="
                          h-10
                          w-full
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          px-3
                          text-[14px]
                          text-black
                          outline-none
                          transition

                          focus:border-[#ffd83d]

                          sm:h-11

                          dark:border-gray-700
                          dark:bg-[#202020]
                          dark:text-white
                        "
                      >
                        <option value="">Select emirate</option>
                        {UAE_EMIRATES.map((emirate) => (
                          <option key={emirate} value={emirate}>
                            {emirate}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-[15px]
                          font-semibold
                          text-gray-900
                          font-serif
                          dark:text-gray-300
                        "
                      >
                        Country
                      </label>

                      <input
                        type="text"
                        value={UAE_COUNTRY}
                        readOnly
                        className="
                          h-10
                          w-full
                          cursor-not-allowed
                          rounded-lg
                          border
                          border-gray-200
                          bg-gray-100
                          px-3
                          text-[14px]
                          text-gray-600
                          outline-none

                          sm:h-11

                          dark:border-gray-700
                          dark:bg-[#181818]
                          dark:text-gray-400
                        "
                      />
                    </div>

                    <div>
                      <label
                        className="
                          mb-1.5
                          block
                          text-[15px]
                          font-semibold
                          text-gray-900
                          font-serif
                          dark:text-gray-300
                        "
                      >
                        Address Type
                      </label>

                      <div className="flex h-10 gap-2 sm:h-11">
                        {(["Home", "Office"] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, type: t }))
                            }
                            className={`
                              flex-1
                              cursor-pointer
                              rounded-lg
                              border
                              text-[14px]
                              font-bold
                              font-serif
                              transition

                              ${
                                formData.type === t
                                  ? `
                                    border-[#ffd83d]
                                    bg-[#fff4be]
                                    text-black

                                    dark:bg-[#332c0b]
                                    dark:text-[#ffd83d]
                                  `
                                  : `
                                    border-gray-200
                                    bg-white
                                    text-gray-900

                                    hover:border-gray-300

                                    dark:border-gray-700
                                    dark:bg-[#202020]
                                    dark:text-gray-300
                                  `
                              }
                            `}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        className="
                          mb-1.5
                          block
                          text-[15px]
                          font-semibold
                          text-gray-900
                          font-serif
                          dark:text-gray-300
                        "
                      >
                        Delivery Instructions
                        <span className="ml-1 font-normal text-gray-400">
                          (Optional)
                        </span>
                      </label>

                      <textarea
                        rows={3}
                        placeholder="Add delivery instructions..."
                        className="
                          w-full
                          resize-none
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          p-3
                          text-[14px]
                          text-black
                          outline-none

                          placeholder:text-gray-400

                          focus:border-[#ffd83d]

                          dark:border-gray-700
                          dark:bg-[#202020]
                          dark:text-white
                        "
                      />
                    </div>
                  </div>

                  <label
                    className="
                      mt-3
                      flex
                      cursor-pointer
                      items-center
                      gap-2
                    "
                  >
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      disabled={editingIsDefault}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isDefault: e.target.checked,
                        }))
                      }
                      className="h-3.5 w-3.5 accent-[#ffd83d]"
                    />

                    <span className="text-[13px] text-gray-500 dark:text-gray-400">
                      Set as my default address
                    </span>
                  </label>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeForm}
                      disabled={isSaving}
                      className="
                        h-10
                        cursor-pointer
                        rounded-lg
                        border
                        border-gray-200
                        bg-white
                        px-4
                        text-[14px]
                        font-bold
                        font-serif
                        text-gray-900
                        transition

                        hover:border-gray-300

                        disabled:cursor-not-allowed
                        disabled:opacity-60

                        dark:border-gray-700
                        dark:bg-[#202020]
                        dark:text-gray-300
                      "
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="
                        h-10
                        cursor-pointer
                        rounded-lg
                        bg-[#ffd83d]
                        px-5
                        text-[14px]
                        font-bold
                        font-serif
                        text-black
                        transition

                        hover:bg-[#ffcf12]

                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {isSaving
                        ? "Saving..."
                        : editingId
                          ? "Update Address"
                          : "Save Address"}
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* ============================== */}
            {/* DELIVERY METHOD */}
            {/* ============================== */}

            {/* ============================== */}
            {/* PAYMENT METHODS */}
            {/* ============================== */}

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
              <SectionHeading
                icon={<FiCreditCard size={16} />}
                title="Payment Method"
                subtitle="Choose your preferred payment option"
              />

              <div
                className="
                  grid
                  grid-cols-1
                  gap-2

                  sm:grid-cols-2
                "
              >
                <PaymentCard
                  active={paymentMethod === "card"}
                  onClick={() => setPaymentMethod("card")}
                  icon={<FiCreditCard size={17} />}
                  title="Credit / Debit Card"
                  subtitle="Visa, Mastercard & more"
                />

                <PaymentCard
                  active={paymentMethod === "upi"}
                  onClick={() => setPaymentMethod("upi")}
                  icon={<FiSmartphone size={17} />}
                  title="UPI"
                  subtitle="Pay using your UPI ID"
                />

                <PaymentCard
                  active={paymentMethod === "razorpay"}
                  onClick={() => setPaymentMethod("razorpay")}
                  icon={
                    <span
                      className="
                        text-[12px]
                        font-extrabold
                        text-[#2b59c3]
                      "
                    >
                      RZP
                    </span>
                  }
                  title="Razorpay"
                  subtitle="Cards, UPI & wallets"
                />

                <PaymentCard
                  active={paymentMethod === "tabby"}
                  onClick={() => setPaymentMethod("tabby")}
                  icon={
                    <span
                      className="
                        text-[12px]
                        font-extrabold
                        text-black
                      "
                    >
                      tabby
                    </span>
                  }
                  title="Tabby"
                  subtitle="Buy now, pay later"
                />

                <PaymentCard
                  active={paymentMethod === "cod"}
                  onClick={() => setPaymentMethod("cod")}
                  icon={<FiPackage size={17} />}
                  title="Cash on Delivery"
                  subtitle="Pay when order arrives"
                />

                <PaymentCard
                  active={paymentMethod === "apple-pay"}
                  onClick={() => setPaymentMethod("apple-pay")}
                  icon={<span className="text-[12px] font-bold">Pay</span>}
                  title="Apple Pay"
                  subtitle="Fast secure checkout"
                />
              </div>

              {/* CARD DETAILS */}
              {paymentMethod === "card" && (
                <div
                  className="
                    mt-3
                    grid
                    grid-cols-1
                    gap-3
                    rounded-xl
                    border
                    border-gray-200
                    bg-[#fafafa]
                    p-3

                    sm:grid-cols-2

                    dark:border-gray-700
                    dark:bg-[#202020]
                  "
                >
                  <div className="sm:col-span-2">
                    <CheckoutInput
                      label="Card Number"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>

                  <CheckoutInput label="Expiry Date" placeholder="MM / YY" />

                  <CheckoutInput
                    label="CVV"
                    placeholder="•••"
                    type="password"
                  />
                </div>
              )}

              {/* UPI */}
              {paymentMethod === "upi" && (
                <div
                  className="
                    mt-3
                    rounded-xl
                    border
                    border-gray-200
                    bg-[#fafafa]
                    p-3

                    dark:border-gray-700
                    dark:bg-[#202020]
                  "
                >
                  <label className="mb-1.5 block text-[13px] font-semibold text-gray-500">
                    UPI ID
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="username@bank"
                      className="
                        h-10
                        min-w-0
                        flex-1
                        rounded-lg
                        border
                        border-gray-200
                        bg-white
                        px-3
                        text-[14px]
                        outline-none

                        focus:border-[#ffd83d]

                        dark:border-gray-700
                        dark:bg-[#181818]
                        dark:text-white
                      "
                    />

                    <button
                      type="button"
                      className="
                        h-10
                        shrink-0
                        cursor-pointer
                        rounded-lg
                        bg-[#ffd83d]
                        px-4
                        text-[13px]
                        font-bold
                        text-black

                        hover:bg-[#ffcf12]
                      "
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === "razorpay" && (
                <PaymentInfo
                  title="Pay securely with Razorpay"
                  text="Click Place Order to continue to the Razorpay secure payment window."
                />
              )}

              {paymentMethod === "tabby" && (
                <PaymentInfo
                  title="Pay later with Tabby"
                  text="Continue with Tabby to check eligibility and available installment options."
                />
              )}

              {paymentMethod === "cod" && (
                <PaymentInfo
                  title="Cash on Delivery"
                  text="Pay for your order when it is delivered to your address."
                />
              )}

              {paymentMethod === "apple-pay" && (
                <PaymentInfo
                  title="Pay with Apple Pay"
                  text="You will be asked to confirm payment using Apple Pay."
                />
              )}
            </section>
          </div>

          {/* ============================== */}
          {/* ORDER SUMMARY */}
          {/* ============================== */}

          <OrderSummary
            shippingAddress={
              chosenAddress
                ? {
                    name: chosenAddress.name,
                    type: chosenAddress.type,
                    phone: formatPhone(chosenAddress.phone),
                    address: formatAddressLine(chosenAddress),
                  }
                : null
            }
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </main>
  );
};

/* ====================================================== */
/* INPUT */
/* ====================================================== */

const CheckoutInput = ({
  label,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
  inputMode,
  maxLength,
}: {
  label: string;
  placeholder: string;
  type?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) => {
  return (
    <div>
      <label
        className="
          mb-1.5
          block
          text-[15px]
          font-semibold
          text-gray-900
          font-serif    
          dark:text-gray-300
        "
      >
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        className="
          h-10
          w-full
          rounded-lg
          border
          border-gray-200
          bg-white
          px-3
          text-[14px]
          text-black
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
  );
};

/* ====================================================== */
/* SECTION HEADING */
/* ====================================================== */

const SectionHeading = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="mb-4 flex items-center gap-2.5">
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
        {icon}
      </div>

      <div>
        <h2
          className="
            font-serif
            text-[19px]
            font-extrabold
            text-black

            sm:text-[21px]

            dark:text-white
          "
        >
          {title}
        </h2>

        <p className="mt-0.5 text-[15px] text-gray-900">{subtitle}</p>
      </div>
    </div>
  );
};

/* ====================================================== */
/* PAYMENT CARD */
/* ====================================================== */

const PaymentCard = ({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        min-w-0
        cursor-pointer
        items-center
        gap-2.5
        rounded-xl
        border
        p-3
        text-left
        transition-all

        ${
          active
            ? `
              border-[#ffd83d]
              bg-[#fffdf3]
              shadow-[0_3px_12px_rgba(255,216,61,0.08)]

              dark:bg-[#29260f]
            `
            : `
              border-gray-200
              bg-white

              hover:border-gray-300

              dark:border-gray-700
              dark:bg-[#202020]
            `
        }
      `}
    >
      <span
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-[#f5f5f5]
          text-gray-700

          dark:bg-[#292929]
          dark:text-gray-200
        "
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className="
            block
            truncate
            text-[14px]
            font-bold
            text-black
              font-serif
            sm:text-[15px]

            dark:text-white
          "
        >
          {title}
        </span>

        <span
          className="
            mt-0.5
            block
            truncate
            text-[15px]
            text-gray-900
          "
        >
          {subtitle}
        </span>
      </span>

      <span
        className={`
          flex
          h-4
          w-4
          shrink-0
          items-center
          justify-center
          rounded-full
          border

          ${
            active
              ? `
                border-[#ffd83d]
                bg-[#ffd83d]
                text-black
              `
              : `
                border-gray-300

                dark:border-gray-600
              `
          }
        `}
      >
        {active && <FiCheck size={10} />}
      </span>
    </button>
  );
};

/* ====================================================== */
/* PAYMENT INFO */
/* ====================================================== */

const PaymentInfo = ({ title, text }: { title: string; text: string }) => {
  return (
    <div
      className="
        mt-3
        flex
        items-start
        gap-2.5
        rounded-xl
        border
        border-gray-200
        bg-[#fafafa]
        p-3

        dark:border-gray-700
        dark:bg-[#202020]
      "
    >
      <FiShield
        className="
          mt-0.5
          shrink-0
          text-green-600
        "
        size={16}
      />

      <div>
        <p
          className="
            text-[14px]
            font-bold
            text-black

            dark:text-white
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-[13px]
            leading-5
            text-gray-400
          "
        >
          {text}
        </p>
      </div>
    </div>
  );
};

export default Checkout;
