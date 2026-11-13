"use client";

import { FormEvent, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { confirmPassword, refreshAuthUser } from "@/firebase/auth";
import { useUpdateEmailMutation } from "@/store/authApi";

const getErrorMessage = (code?: string) => {
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Current password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Could not update email. Please try again.";
  }
};

type Props = {
  email: string;
  canEdit: boolean; // only users who log in with email + password
};

const EditEmail = ({ email, canEdit }: Props) => {
  const [updateEmail] = useUpdateEmailMutation();

  const [editing, setEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setEditing(false);
    setNewEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = newEmail.trim().toLowerCase();

    if (!trimmed || !password) {
      toast.error("Enter the new email and your current password.");
      return;
    }

    if (trimmed === email.toLowerCase()) {
      toast.error("This is already your email.");
      return;
    }

    try {
      setSaving(true);

      // 1. confirm password with Firebase
      await confirmPassword(password);

      // 2. backend updates Firebase + MongoDB
      await updateEmail({ email: trimmed }).unwrap();

      // 3. refresh local Firebase user/token
      await refreshAuthUser();

      toast.success("Email updated successfully.");
      reset();
    } catch (error) {
      const err = error as { code?: string; data?: { message?: string } };
      toast.error(err.data?.message || getErrorMessage(err.code));
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-xs font-bold text-gray-900 font-serif dark:text-gray-300">
          {email}
        </span>

        {canEdit && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Edit email"
            className="shrink-0 cursor-pointer text-gray-400 transition hover:text-[#b58b00]"
          >
            <FiEdit2 size={13} />
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-0 flex-1 space-y-2">
      <input
        type="email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        placeholder="New email"
        autoComplete="email"
        className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-black outline-none focus:border-[#ffd83d] dark:border-white/10 dark:bg-[#181818] dark:text-white"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Current password"
        autoComplete="current-password"
        className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-black outline-none focus:border-[#ffd83d] dark:border-white/10 dark:bg-[#181818] dark:text-white"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="h-8 flex-1 cursor-pointer rounded-lg bg-[#ffd83d] text-[11px] font-extrabold text-black transition hover:bg-[#f5cb1f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={reset}
          disabled={saving}
          className="h-8 flex-1 cursor-pointer rounded-lg bg-gray-100 text-[11px] font-extrabold text-gray-600 transition hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditEmail;
