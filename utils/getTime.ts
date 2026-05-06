import moment, { Moment } from "moment-timezone";

export default function getTime(date?: Date | Moment): string {
  const momentDate = date ? moment(date) : moment().tz("America/Monterrey");

  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const day = momentDate.format("D");
  const month = months[momentDate.month()];
  const year = momentDate.format("YYYY");
  const time = momentDate.format("h:mm a");

  return `${day} de ${month} del ${year}, ${time}`;
}
