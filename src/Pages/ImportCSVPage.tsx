import { useRef, useState } from "react";
import CsvFormatHint from "../Components/csv-import/CsvFormatHint";
import ImportPreview from "../Components/csv-import/ImportPreview";
import UploadCard, {
  type UploadPhase,
} from "../Components/csv-import/UploadCard";
import {
  confirmImport,
  getImportErrorMessage,
  previewImport,
} from "../Services/importService";
import {
  getImportStatus,
  type ImportedTransaction,
} from "../Types/importedTransaction";

export default function ImportCSVPage() {
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<ImportedTransaction[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  // Ignores responses from an upload the user has already cancelled
  const uploadId = useRef(0);

  const reset = () => {
    uploadId.current++;
    setPhase("idle");
    setFile(null);
    setProgress(0);
    setMessage(null);
    setTransactions([]);
    setSaved(false);
  };

  const handleFileSelect = async (selected: File) => {
    const id = ++uploadId.current;
    setFile(selected);
    setProgress(0);
    setSaved(false);

    if (!selected.name.toLowerCase().endsWith(".csv")) {
      setMessage("Only .csv files are supported.");
      setPhase("error");
      return;
    }

    setPhase("uploading");
    try {
      const parsed = await previewImport(selected, setProgress);
      if (id !== uploadId.current) return;
      const categorized = parsed.filter(
        (transaction) => getImportStatus(transaction) === "categorized",
      ).length;
      setTransactions(parsed);
      setMessage(
        `${parsed.length} transactions found, ${categorized} auto-categorized. Review them below and save.`,
      );
      setPhase("done");
    } catch (error) {
      if (id !== uploadId.current) return;
      setMessage(getImportErrorMessage(error));
      setPhase("error");
    }
  };

  const handleConfirm = async () => {
    if (!file) return;
    setSaving(true);
    try {
      setMessage(await confirmImport(file));
      setSaved(true);
    } catch (error) {
      setMessage(getImportErrorMessage(error));
      setPhase("error");
      setTransactions([]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-[1100px]">
      <div className="mb-6">
        <p className="mb-1 text-xs font-medium text-slate-400">Transactions</p>
        <h2 className="text-[25px] font-bold tracking-[-0.04em] text-slate-950">
          Import CSV
        </h2>
      </div>
      <div className="flex flex-col gap-5">
        <UploadCard
          phase={phase}
          fileName={file?.name ?? null}
          progress={progress}
          message={message}
          onFileSelect={handleFileSelect}
          onReset={reset}
        />
        {phase === "done" ? (
          <ImportPreview
            transactions={transactions}
            saving={saving}
            saved={saved}
            onConfirm={handleConfirm}
            onCancel={reset}
          />
        ) : (
          <CsvFormatHint />
        )}
      </div>
    </section>
  );
}
