import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

interface Recomendado {
  id: string;
  title: string;
  description: string;
  image: string;
}

const recomendados: Recomendado[] = [
  {
    id: '1',
    title: 'Restaurante El Buen Sabor',
    description: 'Deliciosa comida ecuatoriana.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP_lVZ9snCkEExBTHbqfMBEZw7mwwfG56rnw&s',
  },
  {
    id: '2',
    title: 'Pizzería La Italiana',
    description: 'Auténtica pizza italiana.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP_lVZ9snCkEExBTHbqfMBEZw7mwwfG56rnw&s',
  },
  {
    id: '3',
    title: 'Sushi Zen',
    description: 'El mejor sushi de la ciudad.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP_lVZ9snCkEExBTHbqfMBEZw7mwwfG56rnw&s',
  },
];

const Recomendados = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recomendados</Text>
      <FlatList
        data={recomendados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            <View style={styles.info}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  carousel: {
    paddingHorizontal: 8,
  },
  card: {
    width: 200,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: '100%',
    height: 120,
  },
  info: {
    padding: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});

export default Recomendados;
