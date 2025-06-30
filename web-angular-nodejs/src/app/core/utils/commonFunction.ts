import { Sort } from '@angular/material/sort';
import { LogoutModel } from '../../auth/models/logout.model';
import { LocalStorageService } from '../services/local.storage.services';
import { Regex } from '../constants/regex';

const NumberColumnArray: string[] = [
  'totalMarks',
  'autoCutOffMarks',
  'cutoffMarks',
  'notAppeared',
  'inactive',
  'active',
  'completed',
  'appeared',
  'total',
  'totalRegistration',
];

function compare(a: number | string, b: number | string, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compareString(a: string, b: string, isAsc: boolean): number {
  return (a?.toLowerCase() < b?.toLowerCase() ? -1 : 1) * (isAsc ? 1 : -1);
}

function convertStringToDate(a: string): Date {
  const date = a?.trim()?.split(' ');
  const dateArray = date[0]?.split('/');
  const dateDay = Number(dateArray[0]);
  const dateMonth = Number(dateArray[1]);
  const dateYear = Number(dateArray[2]);

  const dateHours =
    date[2] == 'PM' ? Number(date[1]?.split(':')[0]) + 12 : Number(date[1]?.split(':')[0]);
  const dateMinutes = Number(date[1]?.split(':')[1]);

  return new Date(dateYear, dateMonth, dateDay, dateHours, dateMinutes);
}

function compareDate(a: string, b: string, isAsc: boolean): number {
  const dateA = convertStringToDate(a)?.getTime();
  const dateB = convertStringToDate(b)?.getTime();
  return (dateA < dateB ? -1 : 1) * (isAsc ? 1 : -1);
}

export function sortData(sort: Sort, rowData: any) {
  const data = rowData.slice();
  let sortedData: any = [];
  if (!sort.active || sort.direction === '') {
    return rowData;
  }
  sortedData = data.sort((a: any, b: any) => {
    const isAsc = sort.direction === 'asc';
    let flag = sort.active;

    if (NumberColumnArray.includes(sort.active)) {
      flag = 'number';
    }

    switch (flag) {
      case 'userName':
        return compareString(
          a['firstName'] + ' ' + a['lastName'],
          b['firstName'] + ' ' + b['lastName'],
          isAsc,
        );

      case 'contact':
        return compare(Number.parseInt(a?.mobileNumber), Number.parseInt(b?.mobileNumber), isAsc);

      case 'number':
        return compare(Number.parseInt(a[sort.active]), Number.parseInt(b[sort.active]), isAsc);

      case 'examDate':
        return compareDate(a['examDate'], b['examDate'], isAsc);

      default:
        return compareString(a[sort?.active], b[sort?.active], isAsc);
    }
  });

  return sortedData;
}
export function excelDateToJSDate(date: number): Date {
  return new Date(new Date(Math.round((date - 25569) * 86400 * 1000)).setHours(0, 0, 0, 0));
}
export function excelTimeToJSTime(time: number): Date {
  const fractional_day = time - Math.floor(time) + 0.0000001;
  const total_seconds = Math.floor(86400 * fractional_day);
  return new Date(total_seconds * 1000);
}

export function getLogoutModelObject(userId: number): LogoutModel {
  const logoutModel = new LogoutModel();
  logoutModel.userId = userId;
  logoutModel.token = new LocalStorageService().getItem('token');
  return logoutModel;
}

export function convertSecondstoTimeString(seconds: number): string {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
}

export function isOnlyWhitespaceExcludingHtmlTags(input: string): boolean {
  const withoutHtmlTags = input.replace(Regex.HtmlTag, '');
  const whitespaceRegex = Regex.WhiteSpaces;
  return whitespaceRegex.test(withoutHtmlTags.trim());
}
