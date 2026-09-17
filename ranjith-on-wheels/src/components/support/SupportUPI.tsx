"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { upiConfig } from "@/content/support";
import styles from "./SupportUPI.module.css";

export function SupportUPI() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiConfig.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (permissions, insecure context); the UPI
      // ID is already shown as plain text, so this is a silent no-op.
    }
  };

  return (
    <section className={styles.section} id="upi">
      <div className={styles.qrWrap}>
        {/* Plain <img>, not next/image: the QR must reach the browser at
            native resolution with no resize/format/quality pass — anything
            reprocessed here risks becoming unscannable. See CLAUDE.md §9.2. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={upiConfig.qrImage}
          alt={`UPI QR code for ${upiConfig.recipientDisplayName}`}
          width={930}
          height={1600}
          className={styles.qrImage}
        />
      </div>
      <div className={styles.copy}>
        <Eyebrow>Support directly via UPI</Eyebrow>
        <h2 className={styles.headline}>Scan, or send to this UPI ID.</h2>
        <p className={styles.body}>
          Choose whatever amount feels right in your own UPI app — there is no fixed price on
          the road ahead.
        </p>
        <div className={styles.idRow}>
          <span className={styles.idValue}>{upiConfig.upiId}</span>
          <button type="button" className={`${styles.copyButton} ${copied ? styles.copyButtonCopied : ""}`} onClick={handleCopy}>
            {copied ? "Copied" : "Copy UPI ID"}
          </button>
          <span aria-live="polite" className="sr-only">
            {copied ? "UPI ID copied to clipboard" : ""}
          </span>
        </div>
        <span className={styles.recipient}>Recipient: {upiConfig.recipientDisplayName}</span>
        <p className={styles.disclosure}>
          This is a direct personal transfer over India&apos;s UPI network — not a registered
          charity and not tax-deductible. No card or bank details are collected by this website;
          scanning the QR or entering the UPI ID opens your own banking or UPI app to complete the
          transfer.
        </p>
      </div>
    </section>
  );
}
