import type { Metadata } from "next";
import { SupportReturnMessage } from "@/components/support/SupportReturnMessage";

export const metadata: Metadata = {
  title: "Thank You",
};

export default function SupportSuccessPage() {
  return (
    <SupportReturnMessage
      headline="Thank you for supporting the journey."
      actions={[
        { href: "/", label: "Back to the journey" },
        { href: "/support", label: "Return to Support", variant: "secondary" },
      ]}
    >
      If you completed a payment, the provider will send you a confirmation directly — this page
      does not verify or record payments itself. If anything looks wrong or you have a question,
      please get in touch through the contact details on this site.
    </SupportReturnMessage>
  );
}
