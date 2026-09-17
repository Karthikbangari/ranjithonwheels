// First-person lines the owner has explicitly signed off to use verbatim.
// Empty until Ranjith approves specific quotes — components must fall back
// to third-person copy rather than inventing a first-person line here.
// OWNER: send any quotes you're comfortable seeing verbatim on the site.
export type ApprovedVoiceLine = {
  id: string;
  text: string;
  context: string;
};

export const approvedVoiceLines: ApprovedVoiceLine[] = [];
