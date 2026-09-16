import type { Metadata } from "next";
import { SupportHero } from "@/components/support/SupportHero";
import { SupportWhy } from "@/components/support/SupportWhy";
import { SupportOptions } from "@/components/support/SupportOptions";
import { SupportUseBreakdown } from "@/components/support/SupportUseBreakdown";
import { SupportTransparency } from "@/components/support/SupportTransparency";
import { PaymentDisclosure } from "@/components/support/PaymentDisclosure";
import { SupportFAQ } from "@/components/support/SupportFAQ";
import { SupportUPI } from "@/components/support/SupportUPI";
import { SupportFinalCTA } from "@/components/support/SupportFinalCTA";

export const metadata: Metadata = {
  title: "Support the Journey",
  description:
    "Support an independent, self-funded bicycle journey across 23 countries. Payments are provider-hosted; this site never collects card or bank details.",
};

export default function SupportPage() {
  return (
    <>
      <SupportHero />
      <SupportWhy />
      <SupportOptions />
      <SupportUseBreakdown />
      <SupportTransparency />
      <PaymentDisclosure />
      <SupportFAQ />
      <SupportUPI />
      <SupportFinalCTA />
    </>
  );
}
