import type {
  DashboardLayout,
  WidgetConfig,
  WidgetDefinition,
  WidgetId,
  WidgetSize,
} from "../Types/dashboardLayout";

// Every widget the dashboard can show, in the default order. A new widget only
// needs an entry here (and a case in DashboardWidget); saved layouts pick it up
// automatically when they are loaded.
export const widgetDefinitions: WidgetDefinition[] = [
  { id: "kpis", title: "Key figures", defaultSize: "full", settings: [] },
  {
    id: "monthlySpending",
    title: "Monthly Spending",
    defaultSize: "half",
    settings: [
      { key: "months", label: "Months", options: [3, 6, 12], defaultValue: 6 },
    ],
  },
  {
    id: "expensesByCategory",
    title: "Expenses by Category",
    defaultSize: "half",
    settings: [],
  },
  {
    id: "recentTransactions",
    title: "Recent Transactions",
    defaultSize: "half",
    settings: [
      { key: "limit", label: "Rows", options: [3, 6, 10], defaultValue: 6 },
    ],
  },
];

const definitionsById = new Map(
  widgetDefinitions.map((definition) => [definition.id, definition]),
);

export const getWidgetDefinition = (id: WidgetId) => definitionsById.get(id)!;

const defaultWidgetConfig = (definition: WidgetDefinition): WidgetConfig => ({
  id: definition.id,
  visible: true,
  size: definition.defaultSize,
  settings: Object.fromEntries(
    definition.settings.map((setting) => [setting.key, setting.defaultValue]),
  ),
});

export const createDefaultLayout = (): DashboardLayout => ({
  version: 1,
  widgets: widgetDefinitions.map(defaultWidgetConfig),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Turns whatever the backend returned into a valid layout: unknown or duplicate
// widgets are dropped, invalid values fall back to the defaults, and widgets that
// are missing (e.g. added after the layout was saved) are appended visible.
export function normalizeLayout(raw: unknown): DashboardLayout {
  if (!isRecord(raw) || !Array.isArray(raw.widgets)) {
    return createDefaultLayout();
  }

  const widgets: WidgetConfig[] = [];
  for (const item of raw.widgets) {
    if (!isRecord(item)) continue;

    const definition = definitionsById.get(item.id as WidgetId);
    if (!definition || widgets.some((widget) => widget.id === definition.id)) {
      continue;
    }

    const defaults = defaultWidgetConfig(definition);
    const savedSettings = isRecord(item.settings) ? item.settings : {};
    widgets.push({
      id: definition.id,
      visible: typeof item.visible === "boolean" ? item.visible : true,
      size:
        item.size === "half" || item.size === "full"
          ? item.size
          : defaults.size,
      settings: Object.fromEntries(
        definition.settings.map((setting) => {
          const value = savedSettings[setting.key];
          return [
            setting.key,
            typeof value === "number" && setting.options.includes(value)
              ? value
              : setting.defaultValue,
          ];
        }),
      ),
    });
  }

  for (const definition of widgetDefinitions) {
    if (!widgets.some((widget) => widget.id === definition.id)) {
      widgets.push(defaultWidgetConfig(definition));
    }
  }

  return { version: 1, widgets };
}

const updateWidget = (
  layout: DashboardLayout,
  id: WidgetId,
  update: (widget: WidgetConfig) => WidgetConfig,
): DashboardLayout => ({
  ...layout,
  widgets: layout.widgets.map((widget) =>
    widget.id === id ? update(widget) : widget,
  ),
});

// Moves a widget to the position of another one (drag and drop)
export function moveWidget(
  layout: DashboardLayout,
  id: WidgetId,
  targetId: WidgetId,
): DashboardLayout {
  const from = layout.widgets.findIndex((widget) => widget.id === id);
  const to = layout.widgets.findIndex((widget) => widget.id === targetId);
  if (from === -1 || to === -1 || from === to) return layout;

  const widgets = [...layout.widgets];
  const [moved] = widgets.splice(from, 1);
  widgets.splice(to, 0, moved);
  return { ...layout, widgets };
}

// Moves a widget one step up or down among the visible widgets (buttons/keyboard)
export function shiftWidget(
  layout: DashboardLayout,
  id: WidgetId,
  direction: -1 | 1,
): DashboardLayout {
  const visible = layout.widgets.filter((widget) => widget.visible);
  const index = visible.findIndex((widget) => widget.id === id);
  const neighbour = visible[index + direction];
  return index === -1 || !neighbour
    ? layout
    : moveWidget(layout, id, neighbour.id);
}

export const setWidgetVisible = (
  layout: DashboardLayout,
  id: WidgetId,
  visible: boolean,
) => updateWidget(layout, id, (widget) => ({ ...widget, visible }));

export const setWidgetSize = (
  layout: DashboardLayout,
  id: WidgetId,
  size: WidgetSize,
) => updateWidget(layout, id, (widget) => ({ ...widget, size }));

export const setWidgetSetting = (
  layout: DashboardLayout,
  id: WidgetId,
  key: string,
  value: number,
) =>
  updateWidget(layout, id, (widget) => ({
    ...widget,
    settings: { ...widget.settings, [key]: value },
  }));
