import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Perfil from '../Screens/Perfil';

// Definir tipo para las rutas
type BottomTabParamList = {
  Home: undefined;
  Perfil: undefined;
  Settings: undefined;
};

// Pantallas de ejemplo
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Home Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Settings Screen</Text>
  </View>
);

// Crear el Bottom Tab Navigator
const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let emoji: string;

          // Asignar emojis según la pantalla
          if (route.name === 'Home') {
            emoji = '🏠'; // Casa
          } else if (route.name === 'Perfil') {
            emoji = '👤'; // Usuario
          } else if (route.name === 'Settings') {
            emoji = '⚙️'; // Engranaje
          } else {
            emoji = '❓'; // Pregunta
          }

          return (
            <Text style={{ fontSize: size, color: color }}>
              {emoji}
            </Text>
          );
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Perfil" component={Perfil} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
