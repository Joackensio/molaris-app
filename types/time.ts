export interface Time {
  hours: number;
  minutes: number;
}

export function formatTime(time: Time): string {
  return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
}