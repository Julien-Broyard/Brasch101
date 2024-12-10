import { Time } from "@sapphire/time-utilities";
import { roundNumber } from "@sapphire/utilities";

type TimeConverter = {
  (value: number): number;
  fromMilliseconds: (milliseconds: number) => number;
  fromSeconds: (seconds: number) => number;
  fromMinutes: (minutes: number) => number;
  fromHours: (hours: number) => number;
  fromDays: (days: number) => number;
  fromMonths: (months: number) => number;
  fromYears: (years: number) => number;
  toMilliseconds: (value: number) => number;
  toSeconds: (value: number) => number;
  toMinutes: (value: number) => number;
  toHours: (value: number) => number;
  toDays: (value: number) => number;
  toMonths: (value: number) => number;
  toYears: (value: number) => number;
};

export const milliseconds: TimeConverter = Object.assign(
  (milliseconds: number): number => milliseconds,
  {
    toMilliseconds: (value: number): number => value,
    fromMilliseconds: (value: number): number => value,
    fromSeconds: (seconds: number): number => seconds * Time.Second,
    fromMinutes: (minutes: number): number => minutes * Time.Minute,
    fromHours: (hours: number): number => hours * Time.Hour,
    fromDays: (days: number): number => days * Time.Day,
    fromMonths: (months: number): number => months * Time.Month,
    fromYears: (years: number): number => years * Time.Year,
    toSeconds: (value: number): number => roundNumber(value / Time.Second),
    toMinutes: (value: number): number => roundNumber(value / Time.Minute),
    toHours: (value: number): number => roundNumber(value / Time.Hour),
    toDays: (value: number): number => roundNumber(value / Time.Day),
    toMonths: (value: number): number => roundNumber(value / Time.Month),
    toYears: (value: number): number => roundNumber(value / Time.Year),
  },
);

export const seconds: TimeConverter = Object.assign(
  (seconds: number): number => seconds * Time.Second,
  {
    fromMilliseconds: (milliseconds: number): number =>
      roundNumber(milliseconds / Time.Second),
    fromSeconds: (seconds: number): number => seconds,
    fromMinutes: (minutes: number): number => minutes * 60,
    fromHours: (hours: number): number => hours * 3600,
    fromDays: (days: number): number => days * 86400,
    fromMonths: (months: number): number => months * 2592000,
    fromYears: (years: number): number => years * 31536000,
    toMilliseconds: (value: number): number => value * Time.Second,
    toSeconds: (value: number): number => value,
    toMinutes: (value: number): number => roundNumber(value / 60),
    toHours: (value: number): number => roundNumber(value / 3600),
    toDays: (value: number): number => roundNumber(value / 86400),
    toMonths: (value: number): number => roundNumber(value / 2592000),
    toYears: (value: number): number => roundNumber(value / 31536000),
  },
);

export const minutes: TimeConverter = Object.assign(
  (minutes: number): number => minutes * Time.Minute,
  {
    fromMilliseconds: (milliseconds: number): number =>
      roundNumber(milliseconds / Time.Minute),
    fromSeconds: (seconds: number): number => roundNumber(seconds / 60),
    fromMinutes: (minutes: number): number => minutes,
    fromHours: (hours: number): number => hours * 60,
    fromDays: (days: number): number => days * 1440,
    fromMonths: (months: number): number => months * 43200,
    fromYears: (years: number): number => years * 525600,
    toMilliseconds: (value: number): number => value * Time.Minute,
    toSeconds: (value: number): number => value * 60,
    toMinutes: (value: number): number => value,
    toHours: (value: number): number => roundNumber(value / 60),
    toDays: (value: number): number => roundNumber(value / 1440),
    toMonths: (value: number): number => roundNumber(value / 43200),
    toYears: (value: number): number => roundNumber(value / 525600),
  },
);

export const hours: TimeConverter = Object.assign(
  (hours: number): number => hours * Time.Hour,
  {
    fromMilliseconds: (milliseconds: number): number =>
      roundNumber(milliseconds / Time.Hour),
    fromSeconds: (seconds: number): number => roundNumber(seconds / 3600),
    fromMinutes: (minutes: number): number => roundNumber(minutes / 60),
    fromHours: (hours: number): number => hours,
    fromDays: (days: number): number => days * 24,
    fromMonths: (months: number): number => months * 720,
    fromYears: (years: number): number => years * 8760,
    toMilliseconds: (value: number): number => value * Time.Hour,
    toSeconds: (value: number): number => value * 3600,
    toMinutes: (value: number): number => value * 60,
    toHours: (value: number): number => value,
    toDays: (value: number): number => roundNumber(value / 24),
    toMonths: (value: number): number => roundNumber(value / 720),
    toYears: (value: number): number => roundNumber(value / 8760),
  },
);

export const days: TimeConverter = Object.assign(
  (days: number): number => days * Time.Day,
  {
    fromMilliseconds: (milliseconds: number): number =>
      roundNumber(milliseconds / Time.Day),
    fromSeconds: (seconds: number): number => roundNumber(seconds / 86400),
    fromMinutes: (minutes: number): number => roundNumber(minutes / 1440),
    fromHours: (hours: number): number => roundNumber(hours / 24),
    fromDays: (days: number): number => days,
    fromMonths: (months: number): number => months * 30,
    fromYears: (years: number): number => years * 365,
    toMilliseconds: (value: number): number => value * Time.Day,
    toSeconds: (value: number): number => value * 86400,
    toMinutes: (value: number): number => value * 1440,
    toHours: (value: number): number => value * 24,
    toDays: (value: number): number => value,
    toMonths: (value: number): number => roundNumber(value / 30),
    toYears: (value: number): number => roundNumber(value / 365),
  },
);

export const months: TimeConverter = Object.assign(
  (months: number): number => months * Time.Month,
  {
    fromMilliseconds: (milliseconds: number): number =>
      roundNumber(milliseconds / Time.Month),
    fromSeconds: (seconds: number): number => roundNumber(seconds / 2592000),
    fromMinutes: (minutes: number): number => roundNumber(minutes / 43200),
    fromHours: (hours: number): number => roundNumber(hours / 720),
    fromDays: (days: number): number => roundNumber(days / 30),
    fromMonths: (months: number): number => months,
    fromYears: (years: number): number => years * 12,
    toMilliseconds: (value: number): number => value * Time.Month,
    toSeconds: (value: number): number => value * 2592000,
    toMinutes: (value: number): number => value * 43200,
    toHours: (value: number): number => value * 720,
    toDays: (value: number): number => value * 30,
    toMonths: (value: number): number => value,
    toYears: (value: number): number => roundNumber(value / 12),
  },
);

export const years: TimeConverter = Object.assign(
  (years: number): number => years * Time.Year,
  {
    fromMilliseconds: (milliseconds: number): number =>
      roundNumber(milliseconds / Time.Year),
    fromSeconds: (seconds: number): number => roundNumber(seconds / 31536000),
    fromMinutes: (minutes: number): number => roundNumber(minutes / 525600),
    fromHours: (hours: number): number => roundNumber(hours / 8760),
    fromDays: (days: number): number => roundNumber(days / 365),
    fromMonths: (months: number): number => roundNumber(months / 12),
    fromYears: (years: number): number => years,
    toMilliseconds: (value: number): number => value * Time.Year,
    toSeconds: (value: number): number => value * 31536000,
    toMinutes: (value: number): number => value * 525600,
    toHours: (value: number): number => value * 8760,
    toDays: (value: number): number => value * 365,
    toMonths: (value: number): number => value * 12,
    toYears: (value: number): number => value,
  },
);
