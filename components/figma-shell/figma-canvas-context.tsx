"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

interface ZoomApi {
  zoomIn: () => void;
  zoomOut: () => void;
  getScale: () => number;
}

interface FigmaCanvasContextValue {
  focusLayer: (layerId: string) => void;
  registerFocusHandler: (handler: ((layerId: string) => void) | null) => void;
  registerZoomApi: (api: ZoomApi | null) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  getScale: () => number;
  subscribeScale: (listener: () => void) => () => void;
  notifyScaleChange: () => void;
  getSelectedLayerId: () => string | null;
  subscribeSelection: (listener: () => void) => () => void;
}

const FigmaCanvasContext = createContext<FigmaCanvasContextValue | null>(null);

const SERVER_SELECTED_LAYER_ID: string | null = null;
const SERVER_SCALE = 1;

function getServerSelectedLayerId() {
  return SERVER_SELECTED_LAYER_ID;
}

function getServerScale() {
  return SERVER_SCALE;
}

export function FigmaCanvasProvider({ children }: { children: ReactNode }) {
  const focusHandlerRef = useRef<((layerId: string) => void) | null>(null);
  const zoomApiRef = useRef<ZoomApi | null>(null);
  const scaleRef = useRef(1);
  const selectedLayerIdRef = useRef<string | null>(null);
  const selectionListenersRef = useRef(new Set<() => void>());
  const scaleListenersRef = useRef(new Set<() => void>());

  const subscribeSelection = useCallback((listener: () => void) => {
    selectionListenersRef.current.add(listener);
    return () => selectionListenersRef.current.delete(listener);
  }, []);

  const subscribeScale = useCallback((listener: () => void) => {
    scaleListenersRef.current.add(listener);
    return () => scaleListenersRef.current.delete(listener);
  }, []);

  const getSelectedLayerId = useCallback(() => selectedLayerIdRef.current, []);
  const getScale = useCallback(() => scaleRef.current, []);

  const registerFocusHandler = useCallback((handler: ((layerId: string) => void) | null) => {
    focusHandlerRef.current = handler;
  }, []);

  const registerZoomApi = useCallback((api: ZoomApi | null) => {
    zoomApiRef.current = api;
    if (api) {
      scaleRef.current = api.getScale();
      scaleListenersRef.current.forEach((listener) => listener());
    }
  }, []);

  const focusLayer = useCallback((layerId: string) => {
    selectedLayerIdRef.current = layerId;
    selectionListenersRef.current.forEach((listener) => listener());
    focusHandlerRef.current?.(layerId);
  }, []);

  const zoomIn = useCallback(() => {
    zoomApiRef.current?.zoomIn();
    if (zoomApiRef.current) {
      scaleRef.current = zoomApiRef.current.getScale();
      scaleListenersRef.current.forEach((listener) => listener());
    }
  }, []);

  const zoomOut = useCallback(() => {
    zoomApiRef.current?.zoomOut();
    if (zoomApiRef.current) {
      scaleRef.current = zoomApiRef.current.getScale();
      scaleListenersRef.current.forEach((listener) => listener());
    }
  }, []);

  const notifyScaleChange = useCallback(() => {
    if (zoomApiRef.current) {
      scaleRef.current = zoomApiRef.current.getScale();
    }
    scaleListenersRef.current.forEach((listener) => listener());
  }, []);

  const value = useMemo(
    (): FigmaCanvasContextValue => ({
      focusLayer,
      registerFocusHandler,
      registerZoomApi,
      zoomIn,
      zoomOut,
      getScale,
      subscribeScale,
      notifyScaleChange,
      getSelectedLayerId,
      subscribeSelection,
    }),
    [focusLayer, registerFocusHandler, registerZoomApi, zoomIn, zoomOut, getScale, subscribeScale, notifyScaleChange, getSelectedLayerId, subscribeSelection],
  );

  return <FigmaCanvasContext.Provider value={value}>{children}</FigmaCanvasContext.Provider>;
}

export function useFigmaCanvas() {
  const context = useContext(FigmaCanvasContext);
  if (!context) {
    throw new Error("useFigmaCanvas must be used within FigmaCanvasProvider");
  }
  return context;
}

export function useSelectedLayerId() {
  const { getSelectedLayerId, subscribeSelection } = useFigmaCanvas();
  return useSyncExternalStore(subscribeSelection, getSelectedLayerId, getServerSelectedLayerId);
}

export function useCanvasScale() {
  const { getScale, subscribeScale } = useFigmaCanvas();
  return useSyncExternalStore(subscribeScale, getScale, getServerScale);
}
