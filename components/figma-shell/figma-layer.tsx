"use client";

import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { useFigmaLayers } from "@/components/figma-shell/figma-layers-context";
import type { FigmaLayerIcon } from "@/components/figma-shell/figma-layer-types";

interface FigmaFrameContextValue {
  frameId: string;
  rootLayerId: string;
}

interface FigmaLayerContextValue {
  layerId: string;
}

const FigmaFrameContext = createContext<FigmaFrameContextValue | null>(null);
const FigmaLayerContext = createContext<FigmaLayerContextValue | null>(null);

interface FigmaFrameRootProps {
  frameId: string;
  label: string;
  active?: boolean;
  children: ReactNode;
}

export function FigmaFrameRoot({ frameId, label, active, children }: FigmaFrameRootProps) {
  const id = useId();
  const orderRef = useRef<number | null>(null);
  const { register, unregister, nextOrder } = useFigmaLayers();

  const frameContextValue = useMemo(
    (): FigmaFrameContextValue => ({ frameId, rootLayerId: id }),
    [frameId, id],
  );

  useLayoutEffect(() => {
    if (orderRef.current === null) {
      orderRef.current = nextOrder();
    }

    register({
      id,
      frameId,
      parentId: null,
      label,
      icon: "frame",
      order: orderRef.current,
      isFrameRoot: true,
      active,
    });
    return () => unregister(id);
  }, [id, frameId, label, active, register, unregister, nextOrder]);

  return (
    <FigmaFrameContext.Provider value={frameContextValue}>
      {children}
    </FigmaFrameContext.Provider>
  );
}

type FigmaLayerProps<T extends ElementType> = {
  name: string;
  icon?: FigmaLayerIcon;
  as?: T;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export function FigmaLayer<T extends ElementType = "div">({
  name,
  icon = "frame",
  as,
  children,
  ...props
}: FigmaLayerProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const id = useId();
  const orderRef = useRef<number | null>(null);
  const frameContext = useContext(FigmaFrameContext);
  const layerContext = useContext(FigmaLayerContext);
  const { register, unregister, nextOrder } = useFigmaLayers();

  const layerContextValue = useMemo(
    (): FigmaLayerContextValue => ({ layerId: id }),
    [id],
  );

  useLayoutEffect(() => {
    if (!frameContext) return;

    if (orderRef.current === null) {
      orderRef.current = nextOrder();
    }

    register({
      id,
      frameId: frameContext.frameId,
      parentId: layerContext?.layerId ?? frameContext.rootLayerId,
      label: name,
      icon,
      order: orderRef.current,
    });
    return () => unregister(id);
  }, [
    id,
    name,
    icon,
    frameContext,
    layerContext?.layerId,
    register,
    unregister,
    nextOrder,
  ]);

  if (!frameContext) {
    return <Component {...props}>{children}</Component>;
  }

  return (
    <FigmaLayerContext.Provider value={layerContextValue}>
      <Component data-figma-layer={name} data-figma-layer-id={id} data-figma-layer-icon={icon} {...props}>
        {children}
      </Component>
    </FigmaLayerContext.Provider>
  );
}
