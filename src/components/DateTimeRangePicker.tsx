import { useState, useEffect } from "react";
import { CalendarGrid } from "./CalendarGrid";
import { TimeInput } from "./TimeInput";
import type { RangeDraft, TimeValue } from "../core/dateTimeModel";
import { validateRange } from "../core/validateRange";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export function DateTimeRangePicker() {
  const [draft, setDraft] = useState<RangeDraft>({
    start: null,
    end: null,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  /* 📅 MONTH STATE (0-based month) */
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // ✅ 0-based

  const timezones = [
    "Asia/Kolkata",
    "UTC",
    "America/New_York",
    "Europe/London",
    "Australia/Sydney",
  ];

  /* ⏮️⏭️ MONTH NAV */
  function prevMonth() {
    setDraft({ start: null, end: null });
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  }

  function nextMonth() {
    setDraft({ start: null, end: null });
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  }

  /* ⏱️ TIME HELPERS */
  function timeValueToString(time: TimeValue | null): string | null {
    if (!time) return null;
    return `${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")}`;
  }
  function stringToTimeValue(time: string | null): TimeValue | null {
  if (!time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  return { hours, minutes };
}

  /* ✅ VALIDATION */
  useEffect(() => {
    const errs = validateRange(draft, timezone, {
      minUtc: Date.now(),
      maxDurationMs: 7 * 24 * 60 * 60 * 1000,
      blackoutRanges: [],
    });
    setErrors(errs);
  }, [draft, timezone]);

  /* 🌍 UTC PREVIEW */
  function toUTC(date?: Date | null, time?: string | null) {
    if (!date || !time) return "—";
    const d = new Date(date);
    const [h, m] = time.split(":").map(Number);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  }
  

  const dateSelected = Boolean(draft.start?.date && draft.end?.date);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-2xl">
      {/* HEADER */}
      <h1 className="text-4xl font-black text-center mb-2">
        Date Time Range Picker
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Use ← → ↑ ↓ and Enter
      </p>

      {/* TIMEZONE */}
      <div className="flex justify-center mb-10">
        <select
          value={timezone}
          onChange={e => setTimezone(e.target.value)}
          className="px-4 py-2 border-2 rounded-xl font-semibold"
        >
          {timezones.map(tz => (
            <option key={tz}>{tz}</option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* CALENDAR */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold"
            >
              ←
            </button>

            <h2 className="text-2xl font-extrabold">
              {MONTH_NAMES[month]} {year}
            </h2>

            <button
              onClick={nextMonth}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold"
            >
              →
            </button>
          </div>

          <CalendarGrid
            year={year}
            month={month}
            onSelectStart={(isoDate) =>
              setDraft({
                start: { date: new Date(isoDate), time: null },
                end: null,
              })
            }
            onSelectEnd={(isoDate) =>
              setDraft(p =>
                p.start
                  ? {
                      ...p,
                      end: { date: new Date(isoDate), time: null },
                    }
                  : p
              )
            }
          />
        </section>

        {/* TIME INPUTS */}
        <section className="space-y-6">
          <h4 className="text-2xl font-bold">Time Selection</h4>

          {!dateSelected && (
            <p className="text-sm text-gray-500">
              Select start & end date first
            </p>
          )}

          <div className="grid grid-cols-2 gap-6">
            <TimeInput
              label="Start Time"
              value={stringToTimeValue(draft.start?.time ?? null)}

              onChange={(time) =>
                setDraft(p =>
                  p.start
                    ? {
                        ...p,
                        start: {
                          ...p.start,
                          time: timeValueToString(time),
                        },
                      }
                    : p
                )
              }
              disabled={!dateSelected}
            />

            <TimeInput
              label="End Time"
               value={stringToTimeValue(draft.end?.time ?? null)}
              onChange={(time) =>
                setDraft(p =>
                  p.end
                    ? {
                        ...p,
                        end: {
                          ...p.end,
                          time: timeValueToString(time),
                        },
                      }
                    : p
                )
              }
              disabled={!dateSelected}
            />
          </div>

          {/* UTC PREVIEW */}
          <div className="p-4 bg-gray-50 rounded-xl border">
            <h4>UTC Previw</h4>
            <p><b>Start:</b> {toUTC(draft.start?.date, draft.start?.time)}</p>
            <p><b>End:</b> {toUTC(draft.end?.date, draft.end?.time)}</p>
          </div>
        </section>
      </div>

      {/* ERRORS */}
      {errors.length > 0 && (
        <div className="mt-8 p-6 bg-red-50 rounded-xl">
          {errors.map((e, i) => (
            <p key={i} className="text-red-700 font-semibold">
              ⚠ {e}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
