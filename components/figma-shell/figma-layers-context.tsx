"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type {
  FigmaFrameNode,
  FigmaLayerNode,
  FigmaLayerRegistration,
} from "@/components/figma-shell/figma-layer-types";

interface FigmaLayersContextValue {
  register: (entry: FigmaLayerRegistration) => void;
  unregister: (id: string) => void;
  getFrames: () => FigmaFrameNode[];
  nextOrder: () => number;
  subscribe: (listener: () => void) => () => void;
}

const FigmaLayersContext = createContext<FigmaLayersContextValue | null>(null);

const SERVER_FRAMES_SNAPSHOT: FigmaFrameNode[] = [];

function getServerFramesSnapshot() {
  return SERVER_FRAMES_SNAPSHOT;
}

function buildLayerTree(
  entries: FigmaLayerRegistration[],
  frameId: string,
  parentId: string,
): FigmaLayerNode[] {
  return entries
    .filter((entry) => entry.frameId === frameId && entry.parentId === parentId && !entry.isFrameRoot)
    .sort((a, b) => a.order - b.order)
    .map((entry) => ({
      id: entry.id,
      label: entry.label,
      icon: entry.icon,
      children: buildLayerTree(entries, frameId, entry.id),
    }));
}

function buildFramesSnapshot(entries: FigmaLayerRegistration[]): FigmaFrameNode[] {
  const roots = entries
    .filter((entry) => entry.isFrameRoot)
    .sort((a, b) => a.order - b.order);

  return roots.map((root) => ({
    frameId: root.frameId,
    label: root.label,
    active: root.active,
    order: root.order,
    children: buildLayerTree(entries, root.frameId, root.id),
  }));
}

function isSameRegistration(a: FigmaLayerRegistration, b: FigmaLayerRegistration) {
  return (
    a.id === b.id &&
    a.frameId === b.frameId &&
    a.parentId === b.parentId &&
    a.label === b.label &&
    a.icon === b.icon &&
    a.order === b.order &&
    a.isFrameRoot === b.isFrameRoot &&
    a.active === b.active
  );
}

function createFigmaLayersStore() {
  let entries: FigmaLayerRegistration[] = [];
  let framesSnapshot: FigmaFrameNode[] = SERVER_FRAMES_SNAPSHOT;
  let order = 0;
  const listeners = new Set<() => void>();

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function rebuildSnapshot() {
    framesSnapshot = buildFramesSnapshot(entries);
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getFrames() {
      return framesSnapshot.reverse();
    },
    nextOrder() {
      order += 1;
      return order;
    },
    register(entry: FigmaLayerRegistration) {
      const existing = entries.find((item) => item.id === entry.id);
      if (existing && isSameRegistration(existing, entry)) return;

      entries = [...entries.filter((item) => item.id !== entry.id), entry];
      rebuildSnapshot();
      notify();
    },
    unregister(id: string) {
      if (!entries.some((item) => item.id === id)) return;

      entries = entries.filter((item) => item.id !== id);
      rebuildSnapshot();
      notify();
    },
  };
}

export function FigmaLayersProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createFigmaLayersStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createFigmaLayersStore();
  }

  const store = storeRef.current;

  const value = useMemo(
    (): FigmaLayersContextValue => ({
      register: store.register,
      unregister: store.unregister,
      getFrames: store.getFrames,
      nextOrder: store.nextOrder,
      subscribe: store.subscribe,
    }),
    [store],
  );

  return <FigmaLayersContext.Provider value={value}>{children}</FigmaLayersContext.Provider>;
}

export function useFigmaLayers() {
  const context = useContext(FigmaLayersContext);
  if (!context) {
    throw new Error("useFigmaLayers must be used within FigmaLayersProvider");
  }
  return context;
}

export function useFigmaLayerFrames() {
  const { getFrames, subscribe } = useFigmaLayers();
  return useSyncExternalStore(subscribe, getFrames, getServerFramesSnapshot);
}
