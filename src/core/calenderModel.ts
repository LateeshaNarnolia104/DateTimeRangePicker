export type CalendarDay = {
  iso: string;     // "2026-03-01"
  label: string;   // "March 1, 2026"
  dayNumber: number; // 1, 2, 3...
};

export function buildCalendarMonth(year: number, month: number) {
  const days: CalendarDay[] = [];

  const firstDay = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(year, month, day));

    days.push({
      iso: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }),
      dayNumber: day,
    });
  }

  return { days };
}
