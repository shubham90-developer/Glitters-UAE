export const OPEN_ACCOUNT_MENU_EVENT = "open-account-menu";

export const openAccountMenu = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_ACCOUNT_MENU_EVENT));
};
