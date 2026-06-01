"use client";

import type { ReactNode } from "react";
import { FigmaLayersProvider } from "@/components/figma-shell/figma-layers-context";
import { SiteViewProvider } from "@/components/site/site-view-context";

export function PortfolioSiteProviders({ children }: { children: ReactNode }) {
  return (
    <SiteViewProvider>
      <FigmaLayersProvider>{children}</FigmaLayersProvider>
    </SiteViewProvider>
  );
}
