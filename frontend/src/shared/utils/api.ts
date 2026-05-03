import type { AxiosError } from "axios";

export function extractApiError(error: unknown): string {
  const axiosError = error as AxiosError<unknown>;
  const data = axiosError?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    const objectData = data as Record<string, unknown>;
    const message = objectData.message ?? objectData.Message ?? objectData.mesaj ?? objectData.Mesaj ?? objectData.title;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (axiosError?.message) {
    return axiosError.message;
  }

  return "Beklenmeyen bir hata oluştu.";
}

export function unwrapApiData<T>(value: T | { Veri?: T; veri?: T }): T {
  if (value && typeof value === "object") {
    const objectValue = value as { Veri?: T; veri?: T };
    if (objectValue.Veri !== undefined) {
      return objectValue.Veri;
    }

    if (objectValue.veri !== undefined) {
      return objectValue.veri;
    }
  }

  return value as T;
}
