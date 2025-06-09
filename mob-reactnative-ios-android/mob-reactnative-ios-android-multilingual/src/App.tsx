import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { RootSiblingParent } from 'react-native-root-siblings';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import AppProvider from './AppProvider';
import { ThemeProvider } from './ThemeProvider';
import { store } from './store/store';
import { getNotificationPermission } from './utils/helpers/utils';

function App(): JSX.Element {
  useEffect(() => {
    // Toaster(LOGIN_SUCCESS_HI);
    getNotificationPermission();
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <ThemeProvider>
          <RootSiblingParent>
            <AppProvider />
          </RootSiblingParent>
        </ThemeProvider>
      </PaperProvider>
    </Provider>
  );
}

export default App;
