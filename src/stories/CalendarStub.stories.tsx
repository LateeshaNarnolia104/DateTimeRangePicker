import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Debug/Calendar Stub",
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <div
      style={{
        padding: "20px",
        border: "1px dashed #999",
        width: "300px",
      }}
    >
      Calendar will live here 🗓️
    </div>
  ),
};
