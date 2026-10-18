export type WidgetId =
  | "kpis"
  | "monthlySpending"
  | "expensesByCategory"
  | "recentTransactions";

export type WidgetSize = "half" | "full";

export interface WidgetConfig {
  id: WidgetId;
  visible: boolean;
  size: WidgetSize;
  // Values of the widget's settings, keyed by WidgetSetting.key
  settings: Record<string, number>;
}

// Saved as JSON with GET/PUT /api/profile/dashboard. The array order is the order
// of the widgets on the dashboard.
export interface DashboardLayout {
  version: 1;
  widgets: WidgetConfig[];
}

export interface WidgetSetting {
  key: string;
  label: string;
  options: number[];
  defaultValue: number;
}

export interface WidgetDefinition {
  id: WidgetId;
  title: string;
  defaultSize: WidgetSize;
  settings: WidgetSetting[];
}
