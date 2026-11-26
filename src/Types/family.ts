// GET /api/family – the family of the logged in user
export interface Family {
  id: number;
  name: string;
  // Invite code others type in to join, e.g. "K7P2XQ9M"
  code: string;
  members: { id: number; firstName: string; lastName: string }[];
}

// Whose data the dashboard shows
export type DashboardScope = "me" | "family";
