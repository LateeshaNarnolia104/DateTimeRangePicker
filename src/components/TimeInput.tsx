type TimeValue = {
  hours: number;
  minutes: number;
};

type Props = {
  label: string;
  value: TimeValue | null;
  onChange: (value: TimeValue) => void;
  disabled?: boolean; 
};

export function TimeInput({ label, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>

      <input
        type="time"
        className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
        value={
          value
            ? `${String(value.hours).padStart(2, "0")}:${String(
                value.minutes
              ).padStart(2, "0")}`
            : ""
        }
        onChange={(e) => {
          const [h, m] = e.target.value.split(":").map(Number);
          onChange({ hours: h, minutes: m });
        }}
      />
    </div>
  );
}
