import type { RangeDraft } from "./dateTimeModel";
import { convertToUtc } from "./convertToUtc";

export type RangeValidationError =
  | "INCOMPLETE_RANGE"
  | "START_AFTER_END"
  | "INVALID_DATE"
  | "BLACKOUT_CONFLICT"
  | "DURATION_EXCEEDED";

export type RangeConstraints = {
  minUtc?: number;
  maxUtc?: number;
  maxDurationMs?: number;
  blackoutRanges?: Array<{
    startUtc: number;
    endUtc: number;
  }>;
};

export function validateRange(
  draft: RangeDraft,
  timezone: string,
  constraints: RangeConstraints = {}
): RangeValidationError[] {
  const errors: RangeValidationError[] = [];

  // Do NOT validate until everything exists
  if (
    !draft.start?.date ||
    !draft.start?.time ||
    !draft.end?.date ||
    !draft.end?.time
  ) {
    return errors;
  }

  let startUtc: number;
  let endUtc: number;

  try {
    
    const startResult = convertToUtc(
  draft.start.date.toISOString().slice(0, 10),
  draft.start.time,
  timezone
);

const endResult = convertToUtc(
  draft.end.date.toISOString().slice(0, 10),
  draft.end.time,
  timezone
);

if (!startResult.ok || !endResult.ok) {
  errors.push("INVALID_DATE");
  return errors;
}

startUtc = Number(startResult.value);
endUtc = Number(endResult.value);

  } catch {
    errors.push("INVALID_DATE");
    return errors;
  }

  if (startUtc >= endUtc) {
    errors.push("START_AFTER_END");
  }

  if (
    (constraints.minUtc !== undefined && startUtc < constraints.minUtc) ||
    (constraints.maxUtc !== undefined && endUtc > constraints.maxUtc)
  ) {
    errors.push("INVALID_DATE");
  }

  if (
    constraints.maxDurationMs !== undefined &&
    endUtc - startUtc > constraints.maxDurationMs
  ) {
    errors.push("DURATION_EXCEEDED");
  }

  if (constraints.blackoutRanges) {
    for (const blackout of constraints.blackoutRanges) {
      const overlaps =
        startUtc < blackout.endUtc && endUtc > blackout.startUtc;

      if (overlaps) {
        errors.push("BLACKOUT_CONFLICT");
        break;
      }
    }
  }

  return errors;
}
