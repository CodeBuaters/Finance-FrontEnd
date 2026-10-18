import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Plus, Settings2 } from "lucide-react";
import { useState } from "react";
import DashboardWidget, {
  type DashboardData,
} from "../Components/dashboard/DashboardWidget";
import EditableWidget from "../Components/dashboard/EditableWidget";
import { useUserContext } from "../Context/userContextType";
import { useDashboardKpis } from "../Hooks/useDashboardKpis";
import { useDashboardLayout } from "../Hooks/useDashboardLayout";
import { useExpensesByCategory } from "../Hooks/useExpensesByCategory";
import { useMonthlySpending } from "../Hooks/useMonthlySpending";
import { useTransactions } from "../Hooks/useTransactions";
import type { DashboardLayout, WidgetId } from "../Types/dashboardLayout";
import {
  createDefaultLayout,
  getWidgetDefinition,
  moveWidget,
  setWidgetSetting,
  setWidgetSize,
  setWidgetVisible,
  shiftWidget,
} from "../Utils/dashboardLayout";

const secondaryButton =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50";

export default function DashboardPage() {
  const { user } = useUserContext();
  const { layout, isLoading: isLayoutLoading, save } = useDashboardLayout();
  // The layout being edited in customize mode, null when not customizing
  const [draft, setDraft] = useState<DashboardLayout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const activeLayout = draft ?? layout;
  const visibleWidgets =
    activeLayout?.widgets.filter((widget) => widget.visible) ?? [];
  const hiddenWidgets =
    activeLayout?.widgets.filter((widget) => !widget.visible) ?? [];
  const isVisible = (id: WidgetId) =>
    visibleWidgets.some((widget) => widget.id === id);

  // Each dataset is fetched once, and only when a visible widget needs it
  const monthlySpending = useMonthlySpending(
    isVisible("monthlySpending") || isVisible("kpis"),
  );
  const transactions = useTransactions(
    isVisible("recentTransactions") || isVisible("kpis"),
  );
  const kpis = useDashboardKpis(isVisible("kpis"), monthlySpending, transactions);
  const categorySpending = useExpensesByCategory(isVisible("expensesByCategory"));
  const data: DashboardData = {
    kpis: { data: kpis.kpis, error: kpis.error },
    monthlySpending,
    categorySpending,
    transactions,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const updateDraft = (update: (layout: DashboardLayout) => DashboardLayout) =>
    setDraft((current) => (current ? update(current) : current));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      updateDraft((current) =>
        moveWidget(current, active.id as WidgetId, over.id as WidgetId),
      );
    }
  };

  const startCustomizing = () => {
    setSaveError(false);
    setDraft(layout);
  };

  const handleSave = async () => {
    if (!draft) return;
    setIsSaving(true);
    setSaveError(false);
    try {
      await save(draft);
      setDraft(null);
    } catch {
      // Stay in customize mode so the changes aren't lost
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-[1100px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-400">Overview</p>
          <h2 className="text-[25px] font-bold tracking-[-0.04em] text-slate-950">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
          </h2>
        </div>

        {layout &&
          (draft ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setDraft(createDefaultLayout())}
                className={secondaryButton}
              >
                Reset to default
              </button>
              <button
                onClick={() => setDraft(null)}
                disabled={isSaving}
                className={secondaryButton}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSaving ? "Saving…" : "Save"}
              </button>
            </div>
          ) : (
            <button
              onClick={startCustomizing}
              className={`${secondaryButton} flex items-center gap-2`}
            >
              <Settings2 size={16} />
              Customize
            </button>
          ))}
      </div>

      {saveError && (
        <p className="mb-4 text-sm text-red-500">
          Could not save your dashboard. Please try again.
        </p>
      )}

      {isLayoutLoading || !activeLayout ? (
        <p className="text-sm text-slate-400">Loading dashboard…</p>
      ) : draft ? (
        <>
          {hiddenWidgets.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-slate-300 p-3">
              <span className="mr-1 text-sm text-slate-500">Hidden widgets:</span>
              {hiddenWidgets.map((widget) => (
                <button
                  key={widget.id}
                  onClick={() =>
                    updateDraft((current) =>
                      setWidgetVisible(current, widget.id, true),
                    )
                  }
                  className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
                >
                  <Plus size={14} />
                  {getWidgetDefinition(widget.id).title}
                </button>
              ))}
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleWidgets.map((widget) => widget.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 gap-x-4 gap-y-8 lg:grid-cols-2">
                {visibleWidgets.map((widget, index) => (
                  <div
                    key={widget.id}
                    className={widget.size === "full" ? "lg:col-span-2" : ""}
                  >
                    <EditableWidget
                      widget={widget}
                      isFirst={index === 0}
                      isLast={index === visibleWidgets.length - 1}
                      onShift={(direction) =>
                        updateDraft((current) =>
                          shiftWidget(current, widget.id, direction),
                        )
                      }
                      onSizeChange={(size) =>
                        updateDraft((current) =>
                          setWidgetSize(current, widget.id, size),
                        )
                      }
                      onSettingChange={(key, value) =>
                        updateDraft((current) =>
                          setWidgetSetting(current, widget.id, key, value),
                        )
                      }
                      onHide={() =>
                        updateDraft((current) =>
                          setWidgetVisible(current, widget.id, false),
                        )
                      }
                    >
                      <DashboardWidget widget={widget} data={data} />
                    </EditableWidget>
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {visibleWidgets.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-400">
              All widgets are hidden. Add them back from the list above.
            </p>
          )}
        </>
      ) : visibleWidgets.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          Your dashboard is empty. Use Customize to add widgets.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleWidgets.map((widget) => (
            <div
              key={widget.id}
              className={widget.size === "full" ? "lg:col-span-2" : ""}
            >
              <DashboardWidget widget={widget} data={data} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
