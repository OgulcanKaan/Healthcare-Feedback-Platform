import type { ApiRecord } from "@/shared/models/common";

export function pickDefined<T>(source: ApiRecord | null | undefined, ...keys: string[]): T | undefined {
  if (!source) {
    return undefined;
  }

  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null) {
      return value as T;
    }
  }

  return undefined;
}

export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}
