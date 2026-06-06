"use client";

import type { ReactNode } from "react";
import {
  aboutMeInspectableLayerIds,
  aboutMePrinciples,
  aboutMePropertiesPrinciples,
  getAboutTrait,
} from "@/content/about-me";
import type { AboutLayerId } from "@/content/about-me";

interface AboutMePropertiesPanelProps {
  selectedId: AboutLayerId;
}

function PropertyRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-[#e6e6e6] py-3 last:border-b-0">
      <p className="mb-1.5 text-[10px] font-semibold tracking-wide text-[#7a7a7a] uppercase">{label}</p>
      <div className="text-[13px] leading-relaxed text-[#333]">{children}</div>
    </div>
  );
}

function AboutPropertiesPanelBody({ layerId }: { layerId: AboutLayerId }) {
  const trait = getAboutTrait(layerId);

  if (trait) {
    return (
      <>
        <PropertyRow label="Name">{trait.name}</PropertyRow>
        <PropertyRow label="Description">{trait.description}</PropertyRow>
        <PropertyRow label="Examples">
          <ul className="space-y-2">
            {trait.evidence.map((item) => (
              <li key={item} className="flex gap-2 text-[12px] leading-snug text-[#555]">
                <span className="shrink-0 text-[#7c4dff]" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PropertyRow>
      </>
    );
  }



  return null;
}

export function AboutMePropertiesPanel({ selectedId }: AboutMePropertiesPanelProps) {
  return (
    <div
      data-frame-reveal="actions"
      className="min-w-0 overflow-hidden rounded-lg border border-[#e6e6e6] bg-white"
    >
      <div className="border-b border-[#e6e6e6] px-3 py-2">
        <p className="text-[11px] font-semibold text-[#333]">Properties</p>
      </div>
      <div className="grid px-3 py-1 [&>*]:col-start-1 [&>*]:row-start-1">
        {aboutMeInspectableLayerIds.map((layerId) => {
          const isActive = selectedId === layerId;

          return (
            <div
              key={layerId}
              className={`about-panel-layer ${isActive ? "about-panel-layer--active" : ""}`}
              aria-hidden={!isActive}
            >
              <AboutPropertiesPanelBody layerId={layerId} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
