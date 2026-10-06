export type AccountStatus = "trial" | "expired" | "customer";

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing?: string;
}

/** Account as sent to the browser (dates serialised as ISO strings). */
export interface Account {
  uid: string;
  email: string;
  name: string;
  company: string;
  phone: string;
  area: string;
  status: AccountStatus;
  createdAt: string;
  trialEndsAt: string;
  activatedAgents: string[];
  testedAgents: string[];
  bookedCall: boolean;
}

export interface SignupProfile {
  name?: string;
  company?: string;
  phone?: string;
  area?: string;
}
