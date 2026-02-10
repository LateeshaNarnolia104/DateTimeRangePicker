type ConvertResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

export function convertToUtc(
date: string, time: string, _timezone: string): ConvertResult {
  if (!date || !time) {
    return { ok: false, error: "Missing date or time" };
  }

  const d = new Date(`${date}T${time}`);
  return { ok: true, value: d.toISOString() };
}
