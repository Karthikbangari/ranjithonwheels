"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { upiConfig, buildUpiUri } from "@/content/support";
import styles from "./SupportUPI.module.css";

const PRESET_AMOUNTS = [100, 500, 1000];

// A positive whole rupee amount, or null when the field is empty/invalid —
// never a negative or zero value reaches buildUpiUri.
function parseCustomAmount(raw: string): number | null {
  const value = Number(raw);
  if (!raw.trim() || !Number.isFinite(value) || value <= 0) return null;
  return Math.floor(value);
}

export function SupportUPI() {
  const [copied, setCopied] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [customActive, setCustomActive] = useState(false);

  const customValue = parseCustomAmount(customAmount);
  const amount = customActive ? customValue : selectedPreset;
  const payUri = useMemo(() => buildUpiUri(amount ?? undefined), [amount]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiConfig.manualUpiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (permissions, insecure context); the UPI
      // ID is already shown as plain text, so this is a silent no-op.
    }
  };

  const selectPreset = (value: number) => {
    setSelectedPreset(value);
    setCustomActive(false);
  };

  return (
    <section className={styles.section} id="upi">
      <div className={styles.intro}>
        <Eyebrow>Support directly via UPI</Eyebrow>
        <h2 className={styles.headline}>Choose the option that works in your UPI app.</h2>
        <p className={styles.body}>
          Support can become a meal, a safe night, a bicycle repair, a border crossing or the next
          story shared from the road. Choose whatever amount feels right — there is no fixed price
          on the road ahead.
        </p>
        <span className={styles.recipient}>Recipient: {upiConfig.recipientDisplayName}</span>
        <p className={styles.disclosure}>
          This is a direct personal transfer over India&apos;s UPI network — not a registered
          charity and not tax-deductible. No card or bank details are collected by this website;
          scanning a QR or entering the UPI ID opens your own banking or UPI app to complete the
          transfer.
        </p>
        <p className={styles.appRow}>Works with Google Pay, PhonePe, Paytm, BHIM and any UPI app.</p>
      </div>

      <div className={styles.panel}>
        <div className={styles.amounts} role="group" aria-label="Choose an amount">
          {PRESET_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              className={`${styles.amountButton} ${!customActive && selectedPreset === value ? styles.amountActive : ""}`}
              aria-pressed={!customActive && selectedPreset === value}
              onClick={() => selectPreset(value)}
            >
              ₹{value.toLocaleString("en-IN")}
            </button>
          ))}
          <button
            type="button"
            className={`${styles.amountButton} ${customActive ? styles.amountActive : ""}`}
            aria-pressed={customActive}
            onClick={() => {
              setCustomActive(true);
              setSelectedPreset(null);
            }}
          >
            Custom
          </button>
        </div>

        {customActive ? (
          <div className={styles.customRow}>
            <label htmlFor="custom-amount" className="sr-only">
              Custom amount in rupees
            </label>
            <span className={styles.customPrefix} aria-hidden="true">
              ₹
            </span>
            <input
              id="custom-amount"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              placeholder="Enter an amount"
              className={styles.customInput}
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
            />
          </div>
        ) : null}
        {customActive && customAmount.trim() && customValue === null ? (
          <p className={styles.customError} role="alert">
            Enter a whole number greater than zero.
          </p>
        ) : null}

        <div className={styles.qrWrap}>
          {amount ? (
            <div className={styles.qrGenerated}>
              <QRCodeSVG value={payUri} size={220} level="M" marginSize={2} />
            </div>
          ) : (
            /* Plain <img>, not next/image: the QR must reach the browser at
               native resolution with no resize/format/quality pass — anything
               reprocessed here risks becoming unscannable. See CLAUDE.md §9.2.
               This original photograph is only ever shown when no amount is
               selected; picking an amount switches to a freshly generated
               code above (buildUpiUri), never a modification of this file. */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={upiConfig.qrImage}
              alt={`UPI QR code for ${upiConfig.recipientDisplayName}`}
              width={930}
              height={1600}
              className={styles.qrImage}
            />
          )}
          <span className={styles.qrCaption}>
            {amount ? `Scan to pay ₹${amount.toLocaleString("en-IN")}` : "Scan with any UPI app"}
          </span>
        </div>

        <div className={styles.method}>
          <span className={styles.methodLabel}>Or pay to this UPI ID</span>
          <div className={styles.idRow}>
            <span className={styles.idValue}>{upiConfig.manualUpiId}</span>
            <button
              type="button"
              className={`${styles.copyButton} ${copied ? styles.copyButtonCopied : ""}`}
              onClick={handleCopy}
            >
              {copied ? "Copied" : "Copy UPI ID"}
            </button>
            <span aria-live="polite" className="sr-only">
              {copied ? "UPI ID copied to clipboard" : ""}
            </span>
          </div>
        </div>

        <a href={payUri} className={styles.payButton}>
          Pay with UPI →
        </a>
        <p className={styles.payHint}>
          On a phone this opens your UPI app directly. On a computer, scan the QR code above instead.
        </p>
      </div>
    </section>
  );
}
