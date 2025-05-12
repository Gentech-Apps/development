export const excludeComasFromString = (value) => {
  if (typeof value === 'string') {
    const splittedValue = value.split(/[,]/);
    const formattedValue = splittedValue.join('');
    return formattedValue;
  }
  return value;
};
