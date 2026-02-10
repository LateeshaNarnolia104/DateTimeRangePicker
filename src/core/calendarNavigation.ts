export type MoveDirection = "left" | "right" | "up" | "down";

export function moveFocus(
  currentIndex: number,
  direction: MoveDirection,
  totalDays: number
): number {
  const COLUMNS = 7;

  let nextIndex = currentIndex;

  switch (direction) {
    case "left":
      nextIndex = currentIndex - 1;
      break;
    case "right":
      nextIndex = currentIndex + 1;
      break;
    case "up":
      nextIndex = currentIndex - COLUMNS;
      break;
    case "down":
      nextIndex = currentIndex + COLUMNS;
      break;
  }

  if (nextIndex < 0) return 0;
  if (nextIndex >= totalDays) return totalDays - 1;

  return nextIndex;
}
