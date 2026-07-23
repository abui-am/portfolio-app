import type { SelectedProjectDescriptionPart } from "@/components/frame/selected-project/types";

export function formatProjectDescription(
  description: string | SelectedProjectDescriptionPart[],
): string {
  if (typeof description === "string") return description;

  return description
    .map((part) => {
      if (part.type === "text") return part.text;
      return part.text;
    })
    .join("");
}
