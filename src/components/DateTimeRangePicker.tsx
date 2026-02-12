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

  /* MONTH STATE (0-based month) */
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-based

  const timezones = [
    "Asia/Kolkata",
    "UTC",
  ];

  /* MONTH NAV */
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

  /* TIME HELPERS */
  function timeValueToString(time: TimeValue | null): string | null {
    if (!time) return null;
    return `${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")}`;
  }
  function stringToTimeValue(time: string | null): TimeValue | null {
  if (!time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  return { hours, minutes };
}

  /* VALIDATION */
  useEffect(() => {
    const errs = validateRange(draft, timezone, {
      minUtc: Date.now(),
      maxDurationMs: 7 * 24 * 60 * 60 * 1000,
      blackoutRanges: [],
    });
    setErrors(errs);
  }, [draft, timezone]);

  /* UTC PREVIEW */
  function toUTC(date?: Date | null, time?: string | null) {
    if (!date || !time) return "—";
    const d = new Date(date);
    const [h, m] = time.split(":").map(Number);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  }
  

  const dateSelected = Boolean(draft.start?.date && draft.end?.date);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* HEADER */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <h1 className="text-4xl font-bold text-center mb-2">
            Date & Time Range Picker
          </h1>
          <p className="text-center text-blue-100 text-sm">
            Use ← → ↑ ↓ and Enter to navigate
          </p>
        </div>

        <div className="p-8">
          {/* TIMEZONE */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-3">
              <label className="text-gray-700 font-semibold">Timezone:</label>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="px-4 py-2 border-2 border-blue-300 rounded-lg font-semibold text-gray-700 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                {timezones.map(tz => (
                  <option key={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
        {/* CALENDAR */}
        <section>
          <div className="flex items-center justify-between mb-6 gap-4">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-200 transition font-bold text-xl"
            >
              ←
            </button>

            <h2 className="text-2xl font-bold text-gray-800 flex-1 text-center">
              {MONTH_NAMES[month]} {year}
            </h2>

            <button
              onClick={nextMonth}
              className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-200 transition font-bold text-xl"
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
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="text-2xl text-gray-800 font-bold">Time Selection</h4>
          </div>

          {!dateSelected && (
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
              <p className="text-sm text-amber-800 font-medium">
                Select start & end date first
              </p>
            </div>
          )}

          <div className="grid text-amber-50 grid-cols-2 gap-6">
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
          <div className="p-6 bg-linear-to-br from-gray-50 to-gray-100 text-gray-800 rounded-lg border-2 border-gray-200">
            <h4 className="font-bold text-lg mb-3 text-gray-900">UTC Preview</h4>
            <div className="space-y-2 font-mono text-sm">
              <p><span className="font-bold text-blue-600">Start:</span> <span className="text-gray-700">{toUTC(draft.start?.date, draft.start?.time)}</span></p>
              <p><span className="font-bold text-blue-600">End:</span> <span className="text-gray-700">{toUTC(draft.end?.date, draft.end?.time)}</span></p>
            </div>
          </div>
        </section>
      </div>
        </div>

        {/* ERRORS */}
        {errors.length > 0 && (
          <div className="p-6 bg-red-50 border-t-2 border-red-200">
            <h3 className="font-bold text-red-700 mb-3 text-lg">Validation Errors</h3>
            <div className="space-y-2">
              {errors.map((e, i) => (
                <p key={i} className="text-red-700 text-sm">
                  • {e}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
