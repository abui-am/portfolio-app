"use client";

import { SelectedProjectFrame } from "@/components/frame/selected-project";
import { selectedProjects } from "@/content/selected-projects";

export function SelectedProjectsSite() {
  return (
    <div className="flex w-full flex-col gap-16 md:gap-24">
      {selectedProjects.map((project) => (
        <SelectedProjectFrame key={project.id} project={project} />
      ))}
    </div>
  );
}
