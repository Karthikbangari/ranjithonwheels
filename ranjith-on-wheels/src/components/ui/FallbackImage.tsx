"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import styles from "./FallbackImage.module.css";

type FallbackImageProps = Omit<ImageProps, "onError" | "fill"> & {
  pendingLabel?: string;
};

export function FallbackImage({ pendingLabel = "Photograph pending", alt, ...imageProps }: FallbackImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={styles.frame}>
      {failed ? (
        <span className={styles.pending}>{pendingLabel}</span>
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
