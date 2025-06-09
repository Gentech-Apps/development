export interface RootState {
  loading: boolean;
  error: string;
  suggestionRequest: suggestionRequest;
  weeklyMenuData: menuData[];
}

export interface menuData {
  dayHindi: string;
  dayId: number;
  subType: subType[];
  day: string;
}

export interface suggestionRequest {
  categoryId: number;
  userId: number;
  suggestion: string;
  status: string;
}

export interface subType {
  weeklyMenuId: number;
  dayId: number;
  breakfast: string;
  lunch: string;
  eveningSnack: string;
  dinner: string;
  breakfastHindi: string;
  lunchHindi: string;
  eveningSnackHindi: string;
  dinnerHindi: string;
  message: string;
  status: string;
  day: string;
}
