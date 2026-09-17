"use client";

import { useState, type ReactNode } from "react";
import Image, { type ImageProps } from "next/image";
import styles from "./FallbackImage.module.css";

type FallbackImageProps = Omit<ImageProps, "onError" | "fill"> & {
  pendingLabel?: string;
  renderFallback?: () => ReactNode;
};

export function FallbackImage({
  pendingLabel = "Photograph pending",
  renderFallback,
  alt,
  ...imageProps
}: FallbackImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={styles.frame}>
      {failed ? (
        renderFallback ? (
          <>
            {renderFallback()}
            <span className="sr-only">{alt}</span>
          </>
        ) : (
          <span className={styles.pending}>{pendingLabel}</span>
        )
      ) : (
        <Image
          {...imageProps}
          alt={alt}
          fill
          className={`${styles.image} ${imageProps.className ?? ""}`}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
