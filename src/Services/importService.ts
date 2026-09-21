import type { Transaction } from "../Types/transaction";
import { api } from "./api";

export function handleFileImport(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/api/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
