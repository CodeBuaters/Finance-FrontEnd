import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, X } from "lucide-react";

export default function UploadCard() {
  const [phase, setPhase] = useState<"idle" | "uploading" | "done">("idle");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (name: string) => {
    setFileName(name);
    setPhase("uploading");
    setProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase("done");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-6">
      <h2 className="text-base font-semibold text-slate-900 mb-1">
        Import bank transactions
      </h2>
      <p className="text-sm text-slate-500 mb-5">
        Upload a CSV export from your bank. We'll automatically categorize your
        transactions.
      </p>

      {phase === "idle" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f.name);
          }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-14 cursor-pointer transition-all
              ${dragging ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40"}`}
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
            <Upload size={24} className="text-emerald-600" />
          </div>
          <p className="text-sm font-semibold text-slate-800 mb-1">
            Drag & drop your CSV file here
          </p>
          <p className="text-xs text-slate-400 mb-4">or click to browse</p>
          <button
            type="button"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            Browse File
          </button>
          <p className="text-xs text-slate-400 mt-4">Accepted format: .csv</p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f.name);
            }}
          />
        </div>
      )}

      {phase === "uploading" && (
        <div className="border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <FileText size={18} className="text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {fileName || "transactions.csv"}
              </p>
              <p className="text-xs text-slate-400">Importing...</p>
            </div>
            <button
              onClick={() => setPhase("idle")}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>
      )}

      {phase === "done" && (
        <div className="border border-emerald-200 bg-emerald-50 rounded-2xl p-5 flex items-center gap-4">
          <CheckCircle size={24} className="text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">
              Import successful!
            </p>
            <p className="text-xs text-emerald-600">
              {fileName || "transactions.csv"} — 6 transactions imported, 4
              auto-categorized
            </p>
          </div>
          <button
            onClick={() => setPhase("idle")}
            className="ml-auto text-xs text-emerald-700 hover:underline"
          >
            Import another
          </button>
        </div>
      )}
    </div>
  );
}
