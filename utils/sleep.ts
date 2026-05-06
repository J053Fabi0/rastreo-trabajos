export function sleepMins(minutes: number): Promise<void> {
  return sleepS(minutes * 60);
}

export default function sleepS(seconds: number): Promise<void> {
  return sleepMs(seconds * 1000);
}

export function sleepMs(milliseconds: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}
