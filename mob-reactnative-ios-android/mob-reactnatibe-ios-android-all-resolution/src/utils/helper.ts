import { menus } from '../redux/foodMenu/foodMenuRootState';

const menuCategory = [
  {
    categoryId: 1,
    categoryName: 'All Time',
    foodList: [],
  },
  {
    categoryId: 2,
    categoryName: 'Breakfast',
    foodList: [],
  },
  {
    categoryId: 3,
    categoryName: 'Lunch',
    foodList: [],
  },
  {
    categoryId: 4,
    categoryName: 'Snack',
    foodList: [],
  },
  {
    categoryId: 5,
    categoryName: 'Dinner',
    foodList: [],
  },
];

export const generateRandomString = (length: number) => {
  let result = '';
  const characters = '0123456789';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

export const updateFoodList = (menus: menus[]) => {
  let foodMenuCatData = []; // Replace 'foodMenuCatData' with your actual data
  menuCategory.map((category) => {
    // Filter menus for the current category
    const categoryMenus = menus.filter((menu) => menu.categoryId === category.categoryId);
    // Create a new array with updated food list
    const updatedFoodList = [...category.foodList, ...categoryMenus];
    // Use `put` effect to dispatch an action with the updated category
    foodMenuCatData = [...foodMenuCatData, { ...category, foodList: updatedFoodList }];
  });
  return foodMenuCatData;
};

export const validString = (str: string) => {
  return str !== null && str !== undefined && str !== '';
};

export const trimString = (str: string) => {
  return validString(str) ? str.toString().trim() : '';
};

export const evaluateOrderAcceptDateTimeAsIndianTimezone = (date: string) => {
  const gotDate = new Date(date);
  // Get the current timezone offset in milliseconds
  const timezoneOffset = gotDate.getTimezoneOffset() * 60 * 1000;
  // Calculate the offset for Asia/Kolkata (+5:30 hours)
  const asiaKolkataOffset = 5.5 * 60 * 60 * 1000;
  // Adjust the UTC date to Asia/Kolkata timezone
  let processDateTime = new Date(gotDate.getTime() + timezoneOffset + asiaKolkataOffset);
  const hrs = new Date(processDateTime).getHours();
  const min = new Date(processDateTime).getMinutes();
  // console.log('hrs: ', hrs, ' | min: ', min);

  // We have to close order from 12:30 PM to 05:30 PM
  if (hrs === 12 && min >= 30) return false;
  if (hrs > 12 && hrs < 17) return false;
  if (hrs === 17 && min < 30) return false;

  return true;
};
