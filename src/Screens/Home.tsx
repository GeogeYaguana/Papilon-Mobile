import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native';
import Header from '../Componentes/Header/Header';
import MapViewComponent from '../Componentes/Mapa/MapViewComponent';
import Recomendados from './Recomendados';
import CategoryBarContainer from '../Componentes/Categorias/CategoryBarContainer';

const HomeScreen = () => {
  const [points, setPoints] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Simulación de actualización de puntos
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prevPoints) => prevPoints + 1); // Incrementa los puntos cada segundo
    }, 1000);

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  // Lógica para manejar la actualización
  const onRefresh = () => {
    setRefreshing(true);

    // Simula una operación de actualización, como obtener datos desde un servidor
    setTimeout(() => {
      setPoints(0); // Resetea los puntos o realiza otra acción de actualización
      setRefreshing(false);
    }, 2000); // Tiempo de espera para simular la actualización
  };

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
    },
    {
      id: 'carrusel',
      component: <CategoryBarContainer />,
    },
    {
      id: 'map',
      component: <MapViewComponent />,
    },
    {
      id: 'recomendados',
      component: <Recomendados />, // Pasamos los puntos como props si es necesario
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={components}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>{item.component}</View>
        )}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  itemContainer: {
    padding: 10,
  },
});

export default HomeScreen;
