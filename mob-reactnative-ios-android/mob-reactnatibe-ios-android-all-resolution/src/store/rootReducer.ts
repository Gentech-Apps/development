import { combineReducers } from 'redux';
import { reducer as loginReducer } from '../redux/login/loginSlice';
import { reducer as foodMenuReducer } from '../redux/foodMenu/foodMenuSlice';
import { reducer as weeklyMenuReducer } from '../redux/weeklyMenu/weeklyMenuSlice';
import { reducer as orderStatusReducer } from '../redux/orderStatus/orderStatusSlice';
import { reducer as transactionReducer } from '../redux/transaction/transactionSlice';
import { reducer as networkReducer } from '../redux/networkStatus/networkStatusSlice';

const rootReducer = combineReducers({
  loginReducer,
  foodMenuReducer,
  weeklyMenuReducer,
  orderStatusReducer,
  transactionReducer,
  networkReducer,
  // Add more reducers as needed
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
