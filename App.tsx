// App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthProvider from './src/context/AuthProvider';
import MainNavigation from './src/Navigation/MainNavigation';

const App = () => {
  return (
    <React.StrictMode>
    <AuthProvider>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </AuthProvider>
    </React.StrictMode>
  );
};

export default App;



