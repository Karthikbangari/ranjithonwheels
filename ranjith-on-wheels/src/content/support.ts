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
    answer: "TODO_OWNER_APPROVAL — pending the approved payment provider and recipient account.",
  },
  {
    question: "Can I support monthly?",
    answer:
      "Not yet. Recurring support will only be enabled if the approved payment provider and recipient account support it.",
  },
  {
    question: "How is support used?",
    answer:
      "Support goes toward the categories listed above. Exact amounts or percentages will only be published once verified records are supplied.",
  },
  {
    question: "Who processes the payment?",
    answer: "TODO_OWNER_APPROVAL — pending the approved payment provider.",
  },
  {
    question: "How do I request payment help or a refund?",
    answer: "TODO_OWNER_APPROVAL — pending a confirmed support/refund contact.",
  },
];
