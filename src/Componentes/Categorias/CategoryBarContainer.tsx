// src/Componentes/Categorias/CategoryBarContainer.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import CategoryBar from './CategoryBar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from '../../Navigation/MainNavigation';
import api , {setAuthorizationHeader} from '../../context/AxiosInstance';
import { Category, BackendCategory } from '../../types/types';
import { AuthContext } from '../../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Categoria">;

const CategoryBarContainer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { token } = useContext(AuthContext); // Usar el contexto de autenticación si está configurado

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Establecer el encabezado de autorización si hay un token
    setAuthorizationHeader(token);

    const fetchCategories = async () => {
      try {
        const response = await api.get<BackendCategory[]>('/categorias'); // Usa el endpoint relativo
        // Mapea los datos del backend al formato esperado por el frontend
        const mappedCategories: Category[] = response.data.map((categoria) => ({
          id: categoria.id_categoria.toString(),
          title: categoria.nombre,
          icon: categoria.url_img || 'https://n9.cl/gc5xfp', // Usa un icono por defecto si no hay url_img
        }));
        setCategories(mappedCategories);
        setLoading(false);
      } catch (err: any) {
        console.error('Error al obtener las categorías:', err);
        // Manejo detallado de errores
        if (err.response) {
          // El servidor respondió con un estado diferente de 2xx
          setError(`Error: ${err.response.status} - ${err.response.data.message || 'Fallo en la solicitud.'}`);
        } else if (err.request) {
          // La solicitud fue hecha pero no se recibió respuesta
          setError('No se recibió respuesta del servidor.');
        } else {
          // Algo pasó al configurar la solicitud
          setError('Error al configurar la solicitud.');
        }
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]); // Dependencia en el token para actualizar el encabezado si cambia

  const handleCategoryPress = (category: string) => {
    navigation.navigate("Categoria", { categoria: category });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0000ff" />
        <Text style={styles.loadingText}>Cargando categorías...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return <CategoryBar categories={categories} onCategoryPress={handleCategoryPress} />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  errorContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'lightcoral',
    alignItems: 'center',
  },
});

export default CategoryBarContainer;
