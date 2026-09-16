export type SupportOption = {
  id: string;
  label: string;
  description: string;
  amount?: number;
  currency?: string;
  checkoutUrl?: string;
  enabled: boolean;
};

export const supportConfig = {
  recipientDisplayName: "REPLACE_ME",
  recipientType: "REPLACE_ME",
  providerName: "REPLACE_ME",
  oneTimeEnabled: false,
  recurringEnabled: false,
  transparencyUpdatedAt: "REPLACE_ME",
  options: [] satisfies SupportOption[],
} as const;

// A direct UPI transfer, confirmed by the owner. This is a personal India
// instant-payment transfer, not a card/provider-hosted checkout: no card or
// bank details ever pass through this site, and the amount is chosen freely
// by the supporter in their own UPI app.
export const upiConfig = {
  recipientDisplayName: "Dagara Ranjith Kumar",
  upiId: "7020346416@axl",
  qrImage: "/media/support/upi-qr.jpg",
} as const;

export function isSupportConfigured(): boolean {
  const config = supportConfig as {
    recipientDisplayName: string;
    recipientType: string;
    providerName: string;
    oneTimeEnabled: boolean;
    recurringEnabled: boolean;
    options: SupportOption[];
  };
  return (
    config.recipientDisplayName !== "REPLACE_ME" &&
    config.recipientType !== "REPLACE_ME" &&
    config.providerName !== "REPLACE_ME" &&
    (config.oneTimeEnabled || config.recurringEnabled) &&
    config.options.some((option) => option.enabled && option.checkoutUrl)
  );
}

// Illustrative only — not tied to a real amount until the owner supplies and
// maintains verified figures. Rendered as inactive "coming soon" cards.
export const suggestedSupportLabels = [
  {
    id: "meal",
    label: "A meal on the road",
    description: "Food and water for a day of riding.",
  },
  {
    id: "night",
    label: "A safe night's rest",
    description: "A roof and a lock for the bicycle when camping isn't possible.",
  },
  {
    id: "repair",
    label: "An essential bicycle repair",
    description: "Parts, tools or a shop visit to keep the wheels turning.",
  },
  {
    id: "chapter",
    label: "Help carry the next chapter",
    description: "Visas, permits and the transport a border crossing requires.",
  },
];

export const supportUseCategories = [
  "Food and water",
  "Safe accommodation when camping is not possible",
  "Bicycle parts, repairs and safety equipment",
  "Visas, permits and unavoidable transport",
  "Camera, connectivity and story production",
];

export type SupportFaqItem = {
  question: string;
  answer: string;
};

export const supportFaq: SupportFaqItem[] = [
  {
    question: "Is this a charitable donation?",
    answer:
      "Not currently. This is direct support for an independent traveller, not a registered charity, unless the owner confirms otherwise with documented legal status.",
  },
  {
    question: "Which currencies are accepted?",
    answer:
      "The UPI option accepts Indian Rupees (INR) directly through any UPI app. Other currencies are pending an approved international payment provider.",
  },
  {
    question: "Can I support monthly?",
    answer:
      "Not yet. UPI here is one-time only. Recurring support will only be enabled if an approved payment provider and recipient account support it.",
  },
  {
    question: "How is support used?",
    answer:
      "Support goes toward the categories listed above. Exact amounts or percentages will only be published once verified records are supplied.",
  },
  {
    question: "Who processes the payment?",
    answer:
      "For UPI, India's National Payments Corporation network and your own UPI app process the transfer directly — this site never sees or stores payment details. Other payment methods are pending an approved provider.",
  },
  {
    question: "How do I request payment help or a refund?",
    answer: "TODO_OWNER_APPROVAL — pending a confirmed support/refund contact.",
  },
];
