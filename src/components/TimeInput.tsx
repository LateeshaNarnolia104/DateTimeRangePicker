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

export function TimeInput({ label, value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>

      <input
        type="time"
        disabled={disabled}
        className="border-2 border-blue-300 bg-white text-gray-800 rounded-lg px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed"
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
