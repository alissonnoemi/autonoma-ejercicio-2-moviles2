import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './contexts/AuthContext';
import MainNavigation from './Navigation/Navegacion';

export default function App() {
  return (
    <AuthProvider>
      <MainNavigation />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
