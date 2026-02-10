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
    <fieldset className="flex flex-col gap-2">
      <legend className="font-medium">{label}</legend>

      <input
        type="date"
        value={localDate}
        onChange={(e) => {
          setLocalDate(e.target.value);
          handleUpdate(e.target.value, localTime, timezone);
        }}
      />

      <input
        type="time"
        value={localTime}
        onChange={(e) => {
          setLocalTime(e.target.value);
          handleUpdate(localDate, e.target.value, timezone);
        }}
      />

      <select
        value={timezone}
        onChange={(e) => {
          setTimezone(e.target.value);
          handleUpdate(localDate, localTime, e.target.value);
        }}
      >
        <option value="UTC">UTC</option>
        <option value="Asia/Kolkata">Asia/Kolkata</option>
        <option value="America/New_York">America/New_York</option>
      </select>
    </fieldset>
  );
}
