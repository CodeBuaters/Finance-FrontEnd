import { api } from "./api";
import type { DashboardLayout } from "../Types/dashboardLayout";

// Returns the raw saved layout (validated with normalizeLayout by the caller), or
// null when the user has not customized the dashboard yet (204 No Content).
export async function getDashboardLayout(): Promise<unknown> {
  const response = await api.get("/api/profile/dashboard");

  return response.status === 204 ? null : response.data;
}

export async function saveDashboardLayout(
  layout: DashboardLayout,
): Promise<void> {
  await api.put("/api/profile/dashboard", layout);
}
