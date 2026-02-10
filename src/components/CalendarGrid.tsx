import { useState } from "react";
import { buildCalendarMonth } from "../core/calenderModel"; 
import { moveFocus } from "../core/calendarNavigation";

type Props = {
  year: number;
  month: number;
  onSelectStart: (isoDate: string) => void;
  onSelectEnd: (isoDate: string) => void;
};

export function CalendarGrid({ year, month, onSelectStart, onSelectEnd }: Props) {
  const calendar = buildCalendarMonth(year, month);
  

  const [focusedIndex, setFocusedIndex] = useState(0);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [endIndex, setEndIndex] = useState<number | null>(null);

  // function used by BOTH click & Enter
  function selectDate(index: number) {
    const iso = calendar.days[index].iso;
    setFocusedIndex(index);

    //  Select start
    if (startIndex === null) {
      setStartIndex(index);
      setEndIndex(null);
      onSelectStart(iso);
      return;
    }

    // Select end
    if (endIndex === null) {
      setEndIndex(index);
      onSelectEnd(iso);
      return;
    }

    // Reset → new start
    setStartIndex(index);
    setEndIndex(null);
    onSelectStart(iso);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    let direction: "left" | "right" | "up" | "down" | null = null;

    if (e.key === "ArrowLeft") direction = "left";
    if (e.key === "ArrowRight") direction = "right";
    if (e.key === "ArrowUp") direction = "up";
    if (e.key === "ArrowDown") direction = "down";

    if (direction) {
      e.preventDefault();
      setFocusedIndex(
        moveFocus(focusedIndex, direction, calendar.days.length)
      );
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      selectDate(focusedIndex); //  Enter
    }
  }

  return (
    <div
      role="grid"
      aria-label="Calendar date picker"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 40px)",
        gap: "4px",
        outline: "none",
      }}
    >
      {calendar.days.map((day, index) => {
        const isStart = index === startIndex;
        const isEnd = index === endIndex;

        const inRange =
          startIndex !== null &&
          endIndex !== null &&
          index > Math.min(startIndex, endIndex) &&
          index < Math.max(startIndex, endIndex);

        const isFocused = index === focusedIndex;

        return (
          <div
            key={day.iso}
            role="gridcell"
            aria-selected={isFocused}
            onClick={() => selectDate(index)} //  CLICK
            style={{
              padding: "8px",
              textAlign: "center",
              border: "1px solid #ccc",
              cursor: "pointer",
              background: isStart || isEnd
                ? "#2563eb"
                : inRange
                ? "#bfdbfe"
                : isFocused
                ? "#cce4ff"
                : "transparent",
              color: isStart || isEnd ? "white" : "black",
            }}
          >
            {day.dayNumber}
          </div>
        );
      })}
    </div>
  );
}
