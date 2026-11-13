"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import {
  CardType,
  useAddSavedCardMutation,
  useDeleteSavedCardMutation,
  useGetSavedCardsQuery,
  useSetDefaultCardMutation,
} from "@/store/savedcardsapi";
import React, { useEffect, useState } from "react";
import { FiCreditCard, FiLock, FiSave, FiUser, FiX } from "react-icons/fi";

const emptyForm = {
  holder: "",
  number: "",
  expiry: "",
  cvv: "",
  type: "Visa" as CardType,
  isDefault: false,
};

const SavedCards = () => {
  const { data: cards = [], isLoading } = useGetSavedCardsQuery();
  const [addCard, { isLoading: isSaving }] = useAddSavedCardMutation();
  const [deleteCard] = useDeleteSavedCardMutation();
  const [setDefaultCard] = useSetDefaultCardMutation();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  const closeModal = () => {
    setShowModal(false);
    setError("");
    setFormData(emptyForm);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
    setFormData((prev) => ({ ...prev, number: value }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 3) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    setFormData((prev) => ({ ...prev, expiry: value }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setFormData((prev) => ({ ...prev, cvv: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const digits = formData.number.replace(/\s/g, "");
    if (digits.length < 15) {
      setError("Please enter a valid card number.");
      return;
    }

    // Only safe data goes to our server. Full number and CVV are NEVER sent.
    try {
      await addCard({
        type: formData.type,
        last4: digits.slice(-4),
        expiry: formData.expiry,
        holder: formData.holder,
        isDefault: formData.isDefault,
      }).unwrap();

      closeModal();
    } catch (err: any) {
      setError(err?.data?.message || "Could not save card. Please try again.");
    }
  };

  useEffect(() => {
    if (!showModal) return;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showModal]);

  const inputClass = `
    h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium
    text-gray-900 outline-none transition-all placeholder:text-gray-400
    hover:border-gray-300 focus:border-[#d4aa00] focus:bg-white focus:ring-4
    focus:ring-[#ffd83d]/15 dark:border-white/10 dark:bg-[#0c0c0c] dark:text-white
    dark:placeholder:text-gray-600 dark:hover:border-white/20 dark:focus:border-[#ffd83d]/60
  `;

  return (
    <>
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9d7b00] dark:text-[#ffd83d]">
              Payment Methods
            </span>
            <h2 className="mt-1.5 text-xl font-black text-gray-950 dark:text-white">
              Saved Cards
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your saved payment methods.
            </p>
          </div>

          <ThemeBtnOne
            onClick={() => setShowModal(true)}
            text="       Add New Card"
            icon={<FiCreditCard size={14} />}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ffd83d] px-5 text-xs font-extrabold text-black shadow-sm transition hover:-translate-y-0.5 hover:bg-[#ffcf12]"
          />
        </div>

        {/* States */}
        {isLoading && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading your cards...
          </p>
        )}

        {!isLoading && cards.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You have no saved cards yet.
          </p>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card._id}
              className="relative overflow-hidden rounded-2xl bg-[#181818] p-5 text-white shadow-lg"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5" />
              <div className="absolute -bottom-14 -left-8 h-36 w-36 rounded-full bg-[#ffd83d]/10" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <FiCreditCard size={23} />
                  <div className="flex items-center gap-2">
                    {card.isDefault && (
                      <span className="rounded-full bg-[#ffd83d] px-2.5 py-1 text-[9px] font-black text-black">
                        Default
                      </span>
                    )}
                    <span className="text-sm font-black">{card.type}</span>
                  </div>
                </div>

                <p className="mt-8 text-lg font-bold tracking-[0.12em]">
                  •••• •••• •••• {card.last4}
                </p>

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/50">
                      Card Holder
                    </p>
                    <p className="mt-1 text-xs font-bold">{card.holder}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/50">
                      Expires
                    </p>
                    <p className="mt-1 text-xs font-bold">{card.expiry}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  {!card.isDefault && (
                    <>
                      <button
                        type="button"
                        onClick={() => setDefaultCard(card._id)}
                        className="cursor-pointer text-[11px] font-bold text-[#ffd83d]"
                      >
                        Make Default
                      </button>
                      <span className="h-3 w-px bg-white/10" />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteCard(card._id)}
                    className="cursor-pointer text-[11px] font-bold text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ADD CARD MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-card-title"
            className="max-h-[92vh] w-full max-w-155 overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111111]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-[#111111] sm:p-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9d7b00] dark:text-[#ffd83d]">
                  Payment Method
                </span>
                <h2
                  id="add-card-title"
                  className="mt-1 text-xl font-black text-gray-950 dark:text-white"
                >
                  Add New Card
                </h2>
                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Add your card details securely.
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

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              {/* Card Preview */}
              <div className="relative overflow-hidden rounded-2xl bg-[#181818] p-5 text-white shadow-lg">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5" />
                <div className="absolute -bottom-14 -left-8 h-36 w-36 rounded-full bg-[#ffd83d]/10" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <FiCreditCard size={23} />
                    <span className="text-sm font-black">{formData.type}</span>
                  </div>
                  <p className="mt-7 text-lg font-bold tracking-[0.12em]">
                    {formData.number || "•••• •••• •••• ••••"}
                  </p>
                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-white/50">
                        Card Holder
                      </p>
                      <p className="mt-1 text-xs font-bold">
                        {formData.holder || "YOUR NAME"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-white/50">
                        Expires
                      </p>
                      <p className="mt-1 text-xs font-bold">
                        {formData.expiry || "MM/YY"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Holder */}
              <div>
                <label
                  htmlFor="holder"
                  className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  Card Holder Name
                  <span className="ml-1 text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiUser
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="holder"
                    type="text"
                    name="holder"
                    value={formData.holder}
                    onChange={handleChange}
                    placeholder="Name on card"
                    required
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label
                  htmlFor="number"
                  className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  Card Number
                  <span className="ml-1 text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiCreditCard
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="number"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={formData.number}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Card Type */}
              <div>
                <label
                  htmlFor="type"
                  className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  Card Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="RuPay">RuPay</option>
                  <option value="American Express">American Express</option>
                </select>
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="expiry"
                    className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300"
                  >
                    Expiry Date
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    id="expiry"
                    type="text"
                    inputMode="numeric"
                    value={formData.expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300"
                  >
                    CVV
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiLock
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="cvv"
                      type="password"
                      inputMode="numeric"
                      autoComplete="off"
                      value={formData.cvv}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      required
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
              </div>

              {/* Default */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/2.5">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isDefault: e.target.checked,
                    }))
                  }
                  className="mt-0.5 h-4 w-4 accent-[#ffd83d]"
                />
                <div>
                  <p className="text-xs font-extrabold text-gray-800 dark:text-gray-200">
                    Set as default payment method
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-gray-500 dark:text-gray-400">
                    This card will be selected automatically during checkout.
                  </p>
                </div>
              </label>

              {/* Security */}
              <div className="flex items-start gap-3 rounded-xl bg-green-50 p-4 dark:bg-green-500/5">
                <FiLock
                  size={15}
                  className="mt-0.5 shrink-0 text-green-600 dark:text-green-400"
                />
                <p className="text-[11px] leading-5 text-green-700 dark:text-green-400">
                  Only the last 4 digits and expiry are stored. Your full card
                  number and CVV are never saved.
                </p>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  {error}
                </p>
              )}

              {/* Footer */}
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
                  text={isSaving ? "  Saving..." : "  Save Card"}
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

export default SavedCards;
