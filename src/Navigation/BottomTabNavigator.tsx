import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text , ScrollView, FlatList, StyleSheet} from 'react-native';
import Perfil from '../Screens/Perfil';
import MapViewComponent from '../Componentes/Mapa/MapViewComponent';
import Home from '../Screens/Home';
import Header from '../Componentes/Header/Header';
import Recomendados from '../Screens/Recomendados';
import CategoryBarContainer from '../Componentes/Categorias';
// Definir tipo para las rutas
type BottomTabParamList = {
  Home: undefined;
  Perfil: undefined;
  Settings: undefined;
  Categoria: {categoria :number};

};

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
      initialRouteName='Home'
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
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Perfil" component={Perfil} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
