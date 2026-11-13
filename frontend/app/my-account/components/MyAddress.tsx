"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import React, { useEffect, useState } from "react";
import { FiHome, FiMapPin, FiPhone, FiUser, FiX, FiSave } from "react-icons/fi";
import { toast } from "react-toastify"; // ADDED
import {
  IAddress,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from "@/store/addressapi";

const emptyForm = {
  type: "Home" as "Home" | "Office",
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

// ADDED: "+919876543210" -> "+91 98765 43210"
const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "").slice(-10);
  return digits.length === 10
    ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
    : phone;
};

// ADDED: read backend error message from RTK Query error
const getErrorMessage = (error: unknown) => {
  const err = error as { data?: { message?: string } };
  return err?.data?.message || "Something went wrong. Please try again.";
};

const MyAddress = () => {
  // CHANGED: addresses now come from the API (no more dummy data)
  const { data: addresses = [], isLoading } = useGetAddressesQuery();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const isSaving = isAdding || isUpdating;

  const [showModal, setShowModal] = useState(false);

  // ADDED: id of the address being edited (null = adding new)
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDefaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isDefault: e.target.checked,
    }));
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  // ADDED: open modal for a new address
  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // ADDED: open modal pre-filled for editing
  const openEditModal = (item: IAddress) => {
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
    setShowModal(true);
  };

  // CHANGED: saves through the API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSaving) return;

    try {
      if (editingId) {
        await updateAddress({ id: editingId, body: formData }).unwrap();
        toast.success("Address updated successfully");
      } else {
        await addAddress(formData).unwrap();
        toast.success("Address added successfully");
      }

      closeModal();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // ADDED: delete through the API
  const handleRemove = async (id: string) => {
    if (!window.confirm("Remove this address?")) return;

    try {
      await deleteAddress(id).unwrap();
      toast.success("Address removed");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    if (!showModal) return;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showModal]);

  const inputClass = `
    h-11
    w-full
    rounded-xl
    border
    border-gray-200
    bg-gray-50
    px-4
    text-sm
    font-medium
    text-gray-900
    outline-none
    transition-all
    placeholder:font-normal
    placeholder:text-gray-400
    hover:border-gray-300
    focus:border-[#d5ad00]
    focus:bg-white
    focus:ring-4
    focus:ring-[#ffd83d]/15
    dark:border-white/10
    dark:bg-[#0c0c0c]
    dark:text-white
    dark:placeholder:text-gray-600
    dark:hover:border-white/20
    dark:focus:border-[#ffd83d]/60
  `;

  return (
    <>
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#a58200] dark:text-[#ffd83d]">
              Address Book
            </span>

            <h2 className="mt-1.5 text-xl font-black text-gray-950 dark:text-white">
              My Addresses
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your shipping and billing addresses.
            </p>
          </div>

          {/* Add Address */}

          <ThemeBtnOne
            onClick={openAddModal}
            text=" Add New Address"
            icon={<FiMapPin size={14} />}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ffd83d] px-5 text-xs font-extrabold text-black shadow-sm transition hover:-translate-y-0.5 hover:bg-[#ffcf12]"
          />
        </div>

        {/* ADDED: loading + empty states */}
        {isLoading && (
          <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Loading addresses...
          </p>
        )}

        {!isLoading && addresses.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            You have not added any address yet.
          </p>
        )}

        {/* Addresses */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address._id}
              className="group relative rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#ffd83d] hover:shadow-sm dark:border-white/10 dark:bg-[#111111]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff5c4] text-[#9d7b00] dark:bg-[#ffd83d]/10 dark:text-[#ffd83d]">
                    <FiHome size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-gray-950 dark:text-white">
                      {address.type}
                    </h3>

                    {address.isDefault && (
                      <span className="mt-1 inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-extrabold text-green-600 dark:bg-green-500/10 dark:text-green-400">
                        Default Address
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2">
                  <FiUser size={13} className="shrink-0 text-gray-400" />

                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {address.name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <FiPhone size={13} className="shrink-0 text-gray-400" />

                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {formatPhone(address.phone)}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <FiMapPin size={13} className="mt-1 shrink-0 text-gray-400" />

                  <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                    {[
                      address.address,
                      address.city,
                      address.state,
                      address.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => openEditModal(address)}
                  className="cursor-pointer text-xs font-bold text-[#9d7b00] transition hover:underline dark:text-[#ffd83d]"
                >
                  Edit
                </button>

                <span className="h-3 w-px bg-gray-200 dark:bg-white/10" />

                <button
                  type="button"
                  onClick={() => handleRemove(address._id)}
                  className="cursor-pointer text-xs font-bold text-red-500 transition hover:underline"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ADD / EDIT ADDRESS MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-address-title"
            className="max-h-[92vh] w-full max-w-162.5 overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111111]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-100 bg-white px-5 py-5 dark:border-white/10 dark:bg-[#111111] sm:px-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9d7b00] dark:text-[#ffd83d]">
                  Address Book
                </span>

                <h2
                  id="add-address-title"
                  className="mt-1 text-xl font-black text-gray-950 dark:text-white"
                >
                  {editingId ? "Edit Address" : "Add New Address"}
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Enter your delivery address details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-red-50 hover:text-red-500 dark:bg-white/10 dark:text-gray-300"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              {/* Address Type */}
              <div>
                <label className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Address Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {(["Home", "Office"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          type,
                        }))
                      }
                      className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border text-xs font-extrabold transition ${
                        formData.type === type
                          ? "border-[#ffd83d] bg-[#fff9df] text-black ring-2 ring-[#ffd83d]/20 dark:bg-[#ffd83d]/10 dark:text-[#ffd83d]"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-white/10 dark:bg-[#0c0c0c] dark:text-gray-400"
                      }`}
                    >
                      <FiHome size={14} />
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name + Phone */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300"
                  >
                    Full Name
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300"
                  >
                    Phone Number
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  Address
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition placeholder:font-normal placeholder:text-gray-400 hover:border-gray-300 focus:border-[#d5ad00] focus:bg-white focus:ring-4 focus:ring-[#ffd83d]/15 dark:border-white/10 dark:bg-[#0c0c0c] dark:text-white dark:placeholder:text-gray-600 dark:hover:border-white/20 dark:focus:border-[#ffd83d]/60"
                />
              </div>

              {/* City + State */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300"
                  >
                    City
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300"
                  >
                    State
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label
                  htmlFor="pincode"
                  className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  Pincode
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="pincode"
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  required
                  className={inputClass}
                />
              </div>

              {/* Default Address */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/2.5">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={handleDefaultChange}
                  className="mt-0.5 h-4 w-4 accent-[#ffd83d]"
                />

                <div>
                  <p className="text-xs font-extrabold text-gray-800 dark:text-gray-200">
                    Set as default address
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-gray-500 dark:text-gray-400">
                    This address will be selected automatically during checkout.
                  </p>
                </div>
              </label>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-white/10 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-gray-200 px-5 text-xs font-extrabold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  Cancel
                </button>

                <ThemeBtnOne
                  type="submit"
                  text={isSaving ? "Saving..." : "Save Address"}
                  icon={<FiSave size={15} />}
                  className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ffd83d] px-5 text-xs font-extrabold text-black shadow-sm transition hover:-translate-y-0.5 hover:bg-[#ffcf12]"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MyAddress;
