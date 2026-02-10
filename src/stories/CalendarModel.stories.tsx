import type { Meta, StoryObj } from "@storybook/react";
import { buildCalendarMonth } from "../core/calenderModel";

const meta: Meta = {
  title: "Core/Calendar Model",
};

export default meta;
type Story = StoryObj;

export const February2026: Story = {
  render: () => {
    const month = buildCalendarMonth(2026, 1);

    return (
      <pre style={{ fontSize: 12 }}>
        {JSON.stringify(month, null, 2)}
      </pre>
    );
  },
};
