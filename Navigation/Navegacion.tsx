import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screen/LoginScreen';
import RegistroScreen from '../screen/RegistroScreen';
import InicioScreen from '../screen/InicioScreen';
import DetalleTareaScreen from '../screen/DetalleTareaScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Inicio" component={InicioScreen} />
            <Stack.Screen name="DetalleTarea" component={DetalleTareaScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registro" component={RegistroScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
