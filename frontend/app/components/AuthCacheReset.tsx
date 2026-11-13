"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { useFirebaseUser } from "@/hooks/useFirebaseUser";

import { addToCartApi } from "@/store/addToCartApi";
import { wishlistApi } from "@/store/wishlistApi";
// import { orderApi } from "@/store/orderApi";  // baaki user-specific APIs bhi add karo

export default function AuthCacheReset() {
  const dispatch = useDispatch();
  const { user, authLoading } = useFirebaseUser();

  // undefined = abhi tak koi auth state nahi mili
  const previousUid = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (authLoading) return;

    const currentUid = user?.uid ?? null;

    // Sirf tab reset karo jab user sach mein badla ho
    if (
      previousUid.current !== undefined &&
      previousUid.current !== currentUid
    ) {
      dispatch(addToCartApi.util.resetApiState());
      dispatch(wishlistApi.util.resetApiState());
      // dispatch(orderApi.util.resetApiState());
    }

    previousUid.current = currentUid;
  }, [user?.uid, authLoading, dispatch]);

  return null;
}
