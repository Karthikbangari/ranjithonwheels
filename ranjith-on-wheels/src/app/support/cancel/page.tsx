import type { Metadata } from "next";
import { SupportReturnMessage } from "@/components/support/SupportReturnMessage";

export const metadata: Metadata = {
  title: "Support Cancelled",
};

export default function SupportCancelPage() {
  return (
    <SupportReturnMessage
      headline="Your support was not completed."
      actions={[
        { href: "/support", label: "Try again" },
        { href: "/", label: "Back to the journey", variant: "secondary" },
      ]}
    >
      No charge was made. You can try again whenever you&apos;re ready, or head back to the
      journey.
    </SupportReturnMessage>
  );
}
