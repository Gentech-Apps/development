import moment from "moment";
import { PeriodFilters } from "../constants/pettyCash";

export default function getStartEndDate(periodFilter, serverDate) {
  const endDate = moment(serverDate, "DD/MM/YYYY");
  const startDate = moment(serverDate, "DD/MM/YYYY");
  const date = moment(serverDate, "DD/MM/YYYY");
  const currentMonth = date.month();
  const year = date.year();

  switch (periodFilter) {
    case PeriodFilters.CURRENT_MONTH:
      startDate.date(1);
      break;
    case PeriodFilters.LAST_MONTH:
      startDate.month(endDate.month() - 1).date(endDate.date() + 1);
      break;
    case PeriodFilters.LAST_3_MONTHS:
      startDate.month(endDate.month() - 3).date(endDate.date() + 1);
      break;
    case PeriodFilters.LAST_6_MONTHS:
      startDate.month(endDate.month() - 6).date(endDate.date() + 1);
      break;
    case PeriodFilters.CURRENT_FINANCIAL_YEAR:
      startDate.set({ month: 3, date: 1 });
      if (currentMonth >= 3) {
        startDate.set({ year: year });
      } else {
        startDate.set({ year: year - 1 });
      }
      break;
    case PeriodFilters.LAST_FINANCIAL_YEAR:
      startDate.set({ month: 3, date: 1 });
      endDate.set({ month: 2, date: 31 }).endOf("day");
      if (currentMonth >= 3) {
        startDate.set({ year: year - 1 });
        endDate.set({ year: year });
      } else {
        startDate.set({ year: year - 2 });
        endDate.set({ year: year - 1 });
      }
      break;
    default:
      startDate.set({ month: 3, date: 1, year: year - 100 });
      break;
  }
  return { startDate, endDate };
}
