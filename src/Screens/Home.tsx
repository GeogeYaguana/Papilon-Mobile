import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

// Definimos una interfaz para las props (si es necesario)
interface HomeProps {
  initialCount?: number;
}

// Componente funcional
const Home: React.FC<HomeProps> = ({ initialCount = 0 }) => {
  // Estado para almacenar el valor del contador
  const [count, setCount] = useState<number>(initialCount);

  // Función para incrementar el contador
  const increment = () => setCount(prevCount => prevCount + 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contador: {count}</Text>
      <Button title="Incrementar" onPress={increment} />
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Home;
