"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import AuthCacheReset from "@/app/components/AuthCacheReset";

export function ReduxProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {" "}
      <AuthCacheReset /> {children}
    </Provider>
  );
}
