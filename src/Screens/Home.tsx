import React, { Component, useContext, useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import Header from '../Componentes/Header/Header';
import MapViewComponent from '../Componentes/Mapa/MapViewComponent';
import Recomendados from './Recomendados';
import CategoryBarContainer from '../Componentes/Categorias';


interface Restaurants {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

const restaurants: Restaurants[] = [
  {
    id: '1',
    name: 'Restaurante El Buen Sabor',
    latitude: 37.78825,
    longitude: -122.4324,
  },
  {
    id: '2',
    name: 'Pizzería La Italiana',
    latitude: 37.78925,
    longitude: -122.4314,
  },
  {
    id: '3',
    name: 'Sushi Zen',
    latitude: 37.79025,
    longitude: -122.4304,
  },
];

const HomeScreen = () => {
  const components = [
    {
      id: 'header',
      component: (
        <Header
        logoSource={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1024px-H%26M-Logo.svg.png',
        }}
      />
      ),
    },{
      id:'carrusel',
      Component:(
        <CategoryBarContainer />
      )
    },
    { id: 'map', component: <MapViewComponent restaurants={restaurants} /> },
    { id: 'recomendados', component: <Recomendados /> },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={components}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <View style={styles.itemContainer}>{item.component}</View>}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Fondo neutro
  },
  contentContainer: {
    // Elimina cualquier margen superior e inferior
    paddingHorizontal: 0, // Asegura que no haya espacio en los lados
    paddingVertical: 0, // Quita márgenes superior e inferior
  },
  itemContainer: {
    marginBottom: 0, // Quita espacio entre los elementos
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noUser: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});


export default HomeScreen;
