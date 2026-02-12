import { useState } from "react";
import type { RangeDraft } from "../core/dateTimeModel";
import { convertToUtc } from "../core/convertToUtc";

type Props = {
  label: string;
  value: RangeDraft;
  onChange: (next: RangeDraft) => void;
};

export function DateTimeField({ label, value, onChange }: Props) {
  const [localDate, setLocalDate] = useState("");
  const [localTime, setLocalTime] = useState("");
  const [timezone, setTimezone] = useState("UTC");

  function handleUpdate(date: string, time: string, tz: string) {
    const result = convertToUtc(date, time, tz);

    if (!result.ok) {
      return;
    }

    onChange({
      ...value,
      startUtc: result.value,
    });
  }

  return (
    <fieldset className="flex flex-col gap-3 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
      <legend className="font-bold text-gray-800 px-2">{label}</legend>

      <div className="flex flex-col gap-2">
        <input
          type="date"
          value={localDate}
          onChange={(e) => {
            setLocalDate(e.target.value);
            handleUpdate(e.target.value, localTime, timezone);
          }}
          className="border-2 border-blue-300 bg-white text-gray-800 rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />

        <input
          type="time"
          value={localTime}
          onChange={(e) => {
            setLocalTime(e.target.value);
            handleUpdate(localDate, e.target.value, timezone);
          }}
          className="border-2 border-blue-300 bg-white text-gray-800 rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />

        <select
          value={timezone}
          onChange={(e) => {
            setTimezone(e.target.value);
            handleUpdate(localDate, localTime, e.target.value);
          }}
          className="border-2 border-blue-300 bg-white text-gray-800 rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer hover:border-blue-400"
        >
          <option value="UTC">UTC</option>
          <option value="Asia/Kolkata">Asia/Kolkata</option>
          <option value="America/New_York">America/New_York</option>
        </select>
      </div>
    </fieldset>
  );
}
