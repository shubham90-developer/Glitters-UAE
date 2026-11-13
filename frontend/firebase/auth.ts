import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "./config";

export const registerWithEmail = async (
  email: string,
  password: string,
  name: string,
) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  if (result.user) {
    await updateProfile(result.user, {
      displayName: name,
    });
  }

  return result.user;
};

export const loginWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);

  return result.user;
};

export const sendResetPasswordEmail = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

// Re-checks the user's password so the backend sees a fresh login time.
export const confirmPassword = async (currentPassword: string) => {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("Not logged in");
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
};

// After the backend changed the email, refresh the local Firebase user + token.
export const refreshAuthUser = async () => {
  const user = auth.currentUser;

  if (!user) return;

  await user.reload();
  await user.getIdToken(true);
};

export const logoutUser = async () => {
  await signOut(auth);
};
