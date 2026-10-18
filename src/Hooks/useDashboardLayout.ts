import { useEffect, useState } from "react";
import {
  getDashboardLayout,
  saveDashboardLayout,
} from "../Services/dashboardLayoutService";
import type { DashboardLayout } from "../Types/dashboardLayout";
import { createDefaultLayout, normalizeLayout } from "../Utils/dashboardLayout";

export function useDashboardLayout() {
  const [layout, setLayout] = useState<DashboardLayout | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDashboardLayout()
      .then((saved) => {
        if (!cancelled) setLayout(normalizeLayout(saved));
      })
      .catch(() => {
        // The dashboard stays usable with the default layout if loading fails
        if (!cancelled) setLayout(createDefaultLayout());
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Throws when saving fails, so the caller can keep the user's unsaved changes
  const save = async (newLayout: DashboardLayout) => {
    await saveDashboardLayout(newLayout);
    setLayout(newLayout);
  };

  return { layout, isLoading: layout === null, save };
}
