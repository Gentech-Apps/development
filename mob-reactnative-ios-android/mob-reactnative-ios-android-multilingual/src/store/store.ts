import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import foodMenuReducer from '../containers/FoodMenu/redux/slice';
import groceryReducer from '../containers/Grocery/redux/slice';
import loginReducer from '../containers/Login/redux/slice';
import orderReducer from '../containers/Order/redux/slice';
import networkReducer from '../containers/Reusables/NetworkStatus/redux/slice';
import transactionReducer from '../containers/Transaction/redux/slice';
import weeklyMenuReducer from '../containers/WeeklyMenu/redux/slice';
import navigationReducer from '../navigations/redux/slice';
import rootSaga from './rootSaga';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    login: loginReducer,
    navigation: navigationReducer,
    menu: foodMenuReducer,
    grocery: groceryReducer,
    weeklyMenu: weeklyMenuReducer,
    transaction: transactionReducer,
    order: orderReducer,
    network: networkReducer,
  },
  middleware: [sagaMiddleware],
});

// then run the saga
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
