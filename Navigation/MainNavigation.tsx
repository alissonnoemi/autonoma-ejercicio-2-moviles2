import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DetalleTareaScreen from '../screen/DetalleTareaScreen';
import LoginScreen from '../screen/LoginScreen';
import RegistroScreen from '../screen/RegistroScreen';
import InicioScreen from '../screen/InicioScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Inicio" component={InicioScreen} />
        <Stack.Screen name="DetalleTarea" component={DetalleTareaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
