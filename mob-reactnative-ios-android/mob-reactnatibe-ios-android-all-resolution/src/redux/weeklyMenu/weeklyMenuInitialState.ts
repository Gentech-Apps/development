export const subType = {
  weeklyMenuId: 0,
  dayId: 0,
  breakfast: '',
  lunch: '',
  eveningSnack: '',
  dinner: '',
  breakfastHindi: '',
  lunchHindi: '',
  eveningSnackHindi: '',
  dinnerHindi: '',
  message: '',
  status: '',
  day: '',
};

export const menuData = {
  dayHindi: '',
  dayId: 0,
  subType: [],
  day: '',
};

export const suggestionRequest = {
  categoryId: 0,
  userId: 0,
  suggestion: '',
  status: 'pending',
};

export const initialState = {
  loading: false,
  error: '',
  suggestionRequest: suggestionRequest,
  weeklyMenuData: [],
};
