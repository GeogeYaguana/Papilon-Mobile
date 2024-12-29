import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import api from '../context/AxiosInstance';
import { AuthContext } from '../context/AuthContext';

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  foto_url: string;
  total_canjes: number;
}

const Recomendados = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCanjear, setLoadingCanjear] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { id_usuario } = useContext(AuthContext); // Obtener el ID del usuario desde el contexto

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get('/productos/top-canjes');
        setProductos(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los productos. Intenta nuevamente.');
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const realizarCanjeo = async (idProducto: number) => {
    setLoadingCanjear(true);
    try {
      if (!id_usuario) {
        Alert.alert('Error', 'No se pudo obtener la información del usuario.');
        setLoadingCanjear(false);
        return;
      }

      const id_usuario_num = parseInt(id_usuario, 10);
      if (isNaN(id_usuario_num)) {
        Alert.alert('Error', 'ID de usuario inválido.');
        setLoadingCanjear(false);
        return;
      }

      // Enviar solicitud POST al endpoint '/realizar_canje'
      const response = await api.post('/realizar_canje', {
        id_usuario: id_usuario_num,
        id_producto: idProducto,
        cantidad: 1, // Por defecto, 1 unidad
      });

      // Manejar la respuesta
      if (response.status === 201 || response.status === 200) {
        Alert.alert('Éxito', 'Producto canjeado exitosamente.');
        // Opcional: Actualizar los productos canjeados
        setProductos((prevProductos) =>
          prevProductos.map((producto) =>
            producto.id_producto === idProducto
              ? { ...producto, total_canjes: producto.total_canjes + 1 }
              : producto
          )
        );
      } else {
        Alert.alert('Error', 'No se pudo canjear el producto. Inténtalo de nuevo.');
      }
    } catch (error: any) {
      console.error('Error al canjear el producto:', error);
      const errorMessage = error.response?.data?.error || 'Ocurrió un error al canjear el producto.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoadingCanjear(false);
    }
  };

  const handleCanjear = (idProducto: number) => {
    // Confirmación antes de canjear
    Alert.alert(
      'Confirmar Canjeo',
      '¿Estás seguro de que deseas canjear este producto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Canjear',
          onPress: () => realizarCanjeo(idProducto),
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos más Canjeados</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id_producto.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.foto_url }} style={styles.image} resizeMode="contain" />
            <View style={styles.info}>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.description}>{item.descripcion}</Text>
              <Text style={styles.canjes}>Total Canjes: {item.total_canjes}</Text>
              {/* Botón "Canjear" */}
              <TouchableOpacity
                style={styles.canjearButton}
                onPress={() => handleCanjear(item.id_producto)}
                disabled={loadingCanjear}
              >
                {loadingCanjear ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.canjearButtonText}>Canjear</Text>
                )}
              </TouchableOpacity>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  canjes: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  canjearButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 8,
    alignItems: 'center',
  },
  canjearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
});

export default Recomendados;
