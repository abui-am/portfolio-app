"use client";

import { createContext, useContext, type ReactNode } from "react";

const SiteViewContext = createContext(false);

export function SiteViewProvider({ children }: { children: ReactNode }) {
  return <SiteViewContext.Provider value={true}>{children}</SiteViewContext.Provider>;
}

export function useIsSiteView() {
  return useContext(SiteViewContext);
}
