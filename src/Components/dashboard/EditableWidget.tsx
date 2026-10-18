import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronUp,
  EyeOff,
  GripVertical,
  Maximize2,
  Minimize2,
} from "lucide-react";
import type { ReactNode } from "react";
import type { WidgetConfig } from "../../Types/dashboardLayout";
import { getWidgetDefinition } from "../../Utils/dashboardLayout";

const iconButton =
  "rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:pointer-events-none disabled:opacity-30";

// A widget in customize mode: a toolbar for arranging it, and the widget itself
// underneath (not clickable while arranging, so links and tooltips stay out of the way).
export default function EditableWidget({
  widget,
  isFirst,
  isLast,
  onShift,
  onSizeChange,
  onSettingChange,
  onHide,
  children,
}: {
  widget: WidgetConfig;
  isFirst: boolean;
  isLast: boolean;
  onShift: (direction: -1 | 1) => void;
  onSizeChange: (size: WidgetConfig["size"]) => void;
  onSettingChange: (key: string, value: number) => void;
  onHide: () => void;
  children: ReactNode;
}) {
  const { title, settings } = getWidgetDefinition(widget.id);
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });
  const isFull = widget.size === "full";

  return (
    <div
      ref={setNodeRef}
      // Translate only: widgets have different sizes, so scaling would distort them
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`rounded-2xl outline-2 outline-dashed outline-offset-4 ${
        isDragging
          ? "relative z-10 outline-emerald-500 opacity-80"
          : "outline-slate-300"
      }`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-1 rounded-xl bg-white px-2 py-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-slate-100">
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className={`${iconButton} cursor-grab touch-none active:cursor-grabbing`}
          aria-label={`Drag ${title}`}
        >
          <GripVertical size={16} />
        </button>
        <span className="mr-auto text-sm font-semibold text-slate-700">
          {title}
        </span>

        {settings.map((setting) => (
          <label
            key={setting.key}
            className="flex items-center gap-1.5 text-xs text-slate-500"
          >
            {setting.label}
            <select
              value={widget.settings[setting.key]}
              onChange={(event) =>
                onSettingChange(setting.key, Number(event.target.value))
              }
              className="rounded-md border border-slate-200 bg-white px-1.5 py-1 text-xs text-slate-700"
            >
              {setting.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}

        <button
          onClick={() => onShift(-1)}
          disabled={isFirst}
          className={iconButton}
          aria-label={`Move ${title} up`}
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={() => onShift(1)}
          disabled={isLast}
          className={iconButton}
          aria-label={`Move ${title} down`}
        >
          <ChevronDown size={16} />
        </button>
        <button
          onClick={() => onSizeChange(isFull ? "half" : "full")}
          // Width only matters in the two-column layout on large screens
          className={`${iconButton} hidden lg:inline-flex`}
          aria-label={isFull ? `Make ${title} half width` : `Make ${title} full width`}
          title={isFull ? "Half width" : "Full width"}
        >
          {isFull ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
        <button
          onClick={onHide}
          className={iconButton}
          aria-label={`Hide ${title}`}
          title="Hide"
        >
          <EyeOff size={16} />
        </button>
      </div>

      <div className="pointer-events-none select-none" aria-hidden>
        {children}
      </div>
    </div>
  );
}
