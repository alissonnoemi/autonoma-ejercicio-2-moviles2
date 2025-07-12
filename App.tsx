import React from 'react';
import { StatusBar } from 'expo-status-bar';
import MainNavigation from './Navigation/MainNavigation';

export default function App() {
  return (
    <>
      <MainNavigation />
      <StatusBar style="auto" />
    </>
  );
}
