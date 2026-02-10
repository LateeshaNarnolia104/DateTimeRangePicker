export type DateTimeDraft = {
  date: Date;
  time: string | null;
};

export type RangeDraft = {
  start: DateTimeDraft | null;
  end: DateTimeDraft | null;
};

export type TimeValue = {
  hours: number;
  minutes: number;
};