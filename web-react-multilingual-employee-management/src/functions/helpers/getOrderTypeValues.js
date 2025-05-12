export const getOrderTypeValues = (type) => {
  if (decodeURIComponent(window.location.pathname).includes('מטלפרס')) {
    switch (type) {
      case 0:
        return 'ביקור טכנאי';
      case 2:
        return 'ביקורת';
      case 3:
        return 'חצי שנתית';
      case 4:
        return 'עבודה';
      case 5:
        return 'תיקון ליקויים';
      default:
        return null;
    }
  } else {
    switch (type) {
      case 0:
        return 'רגילה';
      case 1:
        return 'מיוחדת';
      case 7:
        return 'קריאת שירות';
      default:
        return null;
    }
  }
};
