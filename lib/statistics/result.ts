export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; reason: string }

export function ok<T>(value: T): Result<T> {
  return { ok: true, value }
}

export function err<T>(reason: string): Result<T> {
  return { ok: false, reason }
}
