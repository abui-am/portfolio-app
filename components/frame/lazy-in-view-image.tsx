"use client";

import Image from "next/image";
import { useFrameInView } from "@/components/frame/use-frame-in-view";

interface LazyInViewImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function LazyInViewImage({ src, alt, width, height, className }: LazyInViewImageProps) {
  const { ref, inView } = useFrameInView(0.1);

  return (
    <span
      ref={ref}
      className="inline-block shrink-0"
      style={{ width, height }}
      aria-hidden={!inView}
    >
      {inView ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          loading="lazy"
          unoptimized
        />
      ) : null}
    </span>
  );
}
