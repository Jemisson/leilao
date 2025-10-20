import type { AxiosError } from "axios";

type JsonApiErrorItem = { title?: string; detail?: string };

export function normalizeApiErrors(error: unknown): string[] {
  // 1) Erro Axios com response
  const ax = error as AxiosError<any>;

  // JSON:API: { errors: [{ title, detail, ... }] }
  const jsonApiErrors: JsonApiErrorItem[] | undefined = ax?.response?.data?.errors;
  if (Array.isArray(jsonApiErrors) && jsonApiErrors.length > 0) {
    return jsonApiErrors.map((e) => e?.detail || e?.title || "Erro desconhecido");
  }

  // Rails “simples”: { errors: ["msg1", "msg2"] }
  const arrayErrors = ax?.response?.data?.errors;
  if (Array.isArray(arrayErrors) && arrayErrors.length > 0) {
    return arrayErrors.map((e: any) => String(e));
  }

  // Rails por campo: { errors: { email: ["is invalid"], password: ["is too short"] } }
  const objectErrors = ax?.response?.data?.errors;
  if (objectErrors && typeof objectErrors === "object" && !Array.isArray(objectErrors)) {
    const msgs: string[] = [];
    for (const [field, arr] of Object.entries(objectErrors)) {
      if (Array.isArray(arr)) {
        arr.forEach((msg) => msgs.push(`${field} ${msg}`));
      } else if (typeof arr === "string") {
        msgs.push(`${field} ${arr}`);
      }
    }
    if (msgs.length) return msgs;
  }

  // { error: "mensagem única" }
  const singleError = ax?.response?.data?.error;
  if (singleError) return [String(singleError)];

  // Mensagem do Axios ou do JS
  if (ax?.message) return [ax.message];

  return ["Ocorreu um erro inesperado."];
}
