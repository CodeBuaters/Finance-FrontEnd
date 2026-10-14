import { isAxiosError } from "axios";
import type { ImportedTransaction } from "../Types/importedTransaction";
import { api } from "./api";

const toFormData = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
};

// Parses the CSV on the backend and returns the transactions without saving them.
export async function previewImport(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<ImportedTransaction[]> {
  const response = await api.post<ImportedTransaction[]>(
    "/api/import",
    toFormData(file),
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (event.total) onProgress?.((event.loaded / event.total) * 100);
      },
    },
  );

  return response.data;
}

// Parses the CSV and saves the transactions for the signed-in user.
export async function confirmImport(file: File): Promise<string> {
  const response = await api.post<string>("/import", toFormData(file), {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export function getImportErrorMessage(error: unknown) {
  if (isAxiosError(error) && typeof error.response?.data === "string") {
    return error.response.data;
  }
  return "Could not read the CSV file. Check the format and try again.";
}
