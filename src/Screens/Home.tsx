import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { uselocales } from '../Hooks/useLocales';

const Home = () => {
  const { fetchLocales, loading, error } = uselocales();
  const [locales, setLocales] = useState<any[]>([]);

  useEffect(() => {
    const loadLocales = async () => {
      try {
        const data = await fetchLocales();
        setLocales(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadLocales();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <FlatList
      data={locales}
      keyExtractor={(item) => item.id_local}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.nombre_local}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Home;
