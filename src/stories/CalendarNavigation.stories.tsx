import type { Meta, StoryObj } from "@storybook/react";
import { moveFocus } from "../core/calendarNavigation";

const meta: Meta = {
  title: "Core/Calendar Navigation",
};

export default meta;
type Story = StoryObj;

export const ArrowRightFromStart: Story = {
  render: () => {
    const next = moveFocus(0, "right", 28);

    return <div>Next index: {next}</div>;
  },
};

export const ArrowUpFromTop: Story = {
  render: () => {
    const next = moveFocus(3, "up", 28);

    return <div>Next index: {next}</div>;
  },
};
