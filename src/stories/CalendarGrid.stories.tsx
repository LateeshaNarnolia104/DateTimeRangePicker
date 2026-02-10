import type { Meta, StoryObj } from "@storybook/react";
import { CalendarGrid } from "../components/CalendarGrid";

const meta: Meta<typeof CalendarGrid> = {
  title: "Components/Calendar Grid",
  component: CalendarGrid,
};

export default meta;
type Story = StoryObj<typeof CalendarGrid>;

export const February2026: Story = {
  args: {
    year: 2026,
    month: 1,
  },
};
