"use client";

import { useEffect, useState } from "react";

import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "@/firebase/config";

export const useFirebaseUser = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      setAuthLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user,
    authLoading,
  };
};
