export default function toElapsedTime(time: number, maximumTimeUnits = Infinity) {
  const years = Math.floor(time / 1000 / 60 / 60 / 24 / 365);
  const yearsTime = years * 1000 * 60 * 60 * 24 * 365;

  const months = Math.floor((time - yearsTime) / 1000 / 60 / 60 / 24 / 30);
  const monthsTime = months * 1000 * 60 * 60 * 24 * 30;

  const days = Math.floor((time - yearsTime - monthsTime) / 1000 / 60 / 60 / 24);

  const times: string[] = [];

  construct: {
    if (years) times.push(`${years} año${years === 1 ? "" : "s"}`);
    if (times.length >= maximumTimeUnits) break construct;
    if (months) times.push(`${months} mes${months === 1 ? "" : "es"}`);
    if (times.length >= maximumTimeUnits) break construct;
    if (days) times.push(`${days} día${days === 1 ? "" : "s"}`);
  }

  return times.join(" ");
}
