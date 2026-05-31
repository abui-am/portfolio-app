export function findLayerElement(root: HTMLElement, layerId: string) {
  const escaped = CSS.escape(layerId);
  return (
    root.querySelector<HTMLElement>(`[data-figma-layer-id="${escaped}"]`) ??
    root.querySelector<HTMLElement>(`[data-figma-frame-id="${escaped}"]`)
  );
}

export function getLayerBounds(element: HTMLElement): DOMRect {
  const rect = element.getBoundingClientRect();
  if (rect.width > 0 || rect.height > 0) return rect;

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const child of element.children) {
    if (!(child instanceof HTMLElement)) continue;
    const childRect = getLayerBounds(child);
    if (childRect.width === 0 && childRect.height === 0) continue;
    left = Math.min(left, childRect.left);
    top = Math.min(top, childRect.top);
    right = Math.max(right, childRect.right);
    bottom = Math.max(bottom, childRect.bottom);
  }

  if (left === Number.POSITIVE_INFINITY) return rect;
  return new DOMRect(left, top, right - left, bottom - top);
}
