import type { Meta, StoryObj } from "@storybook/react";
import { DateTimeRangePicker } from "./DateTimeRangePicker";

const meta: Meta<typeof DateTimeRangePicker> = {
  title: "Picker/DateTimeRangePicker",
  component: DateTimeRangePicker,
  args: {
    timezone: "Asia/Kolkata",
    maxDurationDays: 7,
  },
};

export default meta;

export const Default: StoryObj<typeof DateTimeRangePicker> = {
  args: {
    // months: 9
  }
};
