import dayjs from "dayjs";
import "dayjs/locale/es-mx.js";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Monterrey");

dayjs.locale("es-mx");

/**
 * @param date
 * @returns Formatted text as `D [de] MMM YYYY` */
export default function formatDate(date: Date) {
  const showYear = new Date().getFullYear() !== date.getFullYear();

  return dayjs(date)
    .utc()
    .format(`D [de] MMM${showYear ? " YYYY" : ""}`);
}
