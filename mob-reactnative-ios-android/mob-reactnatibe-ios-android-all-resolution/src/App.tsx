import React, { useEffect } from 'react';
import AppNavigation from './containers/navigation/AppNavigation';
import { backgroundNotificationHandler, getNotificationPermission } from './utils/firebase';

backgroundNotificationHandler();

function App(): JSX.Element {
  useEffect(() => {
    getNotificationPermission();
  });

  return <AppNavigation />;
}

export default App;
