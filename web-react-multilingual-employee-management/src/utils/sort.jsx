import { SortOrder } from '../hooks/useSorting';

export const createNumberComparator = (order) => (a, b) => {
  return order === SortOrder.Asc ? a - b : b - a;
};

export const createStringComparator = (order) => (a, b) => {
  a.toLowerCase();
  b.toLowerCase();
  return order === SortOrder.Asc ? a - b : b - a;
};

export const createDateComparator = () => (a, b) => {
  const date1 = new Date(a);
  const date2 = new Date(b);
  date1.setSeconds(0, 0);
  date2.setSeconds(0, 0);
  return date1.getTime() - date2.getTime();
};

export const reverse = (comparator) => (a, b) => {
  return comparator(a, b) * -1;
};

export const sort = (arrayForSorting, comparator, keysToCompare) => {
  return [...arrayForSorting].sort((a, b) => {
    let compareResult = 0;
    try {
      compareResult = comparator(a[keysToCompare], b[keysToCompare]);
    } catch (e) {
      console.error(`The ${keysToCompare} is not comparable`);
    }

    return compareResult;
  });
};
