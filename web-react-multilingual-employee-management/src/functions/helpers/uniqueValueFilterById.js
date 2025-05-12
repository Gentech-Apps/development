export const uniqueValueFilterById = (arrayOfObjects, field) => {
  let resArr = [];
  arrayOfObjects.filter((item) => {
    const i = resArr.findIndex((x) => x[field] === item[field]);
    if (i <= -1) {
      resArr.push(item);
    }
    return null;
  });
  return resArr;
};
