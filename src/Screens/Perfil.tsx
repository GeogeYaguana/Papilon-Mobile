import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, FlatList, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/MainNavigation';
import { AuthContext } from '../context/AuthContext';
import ProfileHeader from '../Componentes/ProfileHeader/ProfileHeader';
import { usePerfil } from '../Hooks/usePerfil';
import { Canje, CanjesResponse, User } from '../types/types';
import api from '../context/AxiosInstance';

type PerfilProps = NativeStackScreenProps<RootStackParamList, 'Perfil'>;

interface CanjeItemProps {
  canje: Canje;
}

const CanjeItem: React.FC<CanjeItemProps> = ({ canje }) => {
  return (
    <View style={styles.canjeItem}>
      <View style={styles.canjeHeader}>
        <Text style={styles.canjeEstado}>{canje.estado.toUpperCase()}</Text>
        <Text style={styles.canjeFecha}>
          {new Date(canje.fecha).toLocaleDateString()} {new Date(canje.fecha).toLocaleTimeString()}
        </Text>
      </View>
      <View style={styles.canjeDetails}>
        <Text style={styles.canjeDetailText}><Text style={styles.bold}>Local:</Text> {canje.local?.nombre_local || 'N/A'}</Text>
        <Text style={styles.canjeDetailText}><Text style={styles.bold}>Dirección:</Text> {canje.local?.direccion || 'N/A'}</Text>
        <Text style={styles.canjeDetailText}><Text style={styles.bold}>Puntos Utilizados:</Text> {canje.puntos_utilizados}</Text>
        <Text style={styles.bold}>Detalles del Canje:</Text>
        {canje.detalles.map((detalle, index) => (
          <View key={index} style={styles.detalleItem}>
            <Text style={styles.canjeDetailText}><Text style={styles.bold}>Producto:</Text> {detalle.producto.nombre}</Text>
            <Text style={styles.canjeDetailText}><Text style={styles.bold}>Cantidad:</Text> {detalle.cantidad}</Text>
            <Text style={styles.canjeDetailText}><Text style={styles.bold}>Puntos Totales:</Text> {detalle.puntos_totales}</Text>
            <Text style={styles.canjeDetailText}><Text style={styles.bold}>Valor:</Text> {detalle.valor}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const Perfil: React.FC<PerfilProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [idCliente, setIdCliente] = useState<number | null>(null);
  const [errorCliente, setErrorCliente] = useState<string | null>(null);
  const [canjes, setCanjes] = useState<Canje[]>([]);
  const [loadingCanjes, setLoadingCanjes] = useState<boolean>(false);
  const [errorCanjes, setErrorCanjes] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { id_usuario, logout, token } = useContext(AuthContext);
  const { loading, error, profile, fetchPerfil } = usePerfil();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: logout,
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditPerfil');
  };

  const fetchCanjes = async (id_usuario_num: number) => {
    setLoadingCanjes(true);
    setErrorCanjes(null);
    try {
      const response = await api.get<CanjesResponse>(`/canjes/cliente/usuario/${id_usuario_num}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200 && response.data.canjes) {
        setCanjes(response.data.canjes);
      } else {
        setErrorCanjes('No se encontraron canjes para este usuario.');
      }
    } catch (error: any) {
      console.error('Error al obtener canjes:', error);
      if (error.response && error.response.status === 404) {
        setErrorCanjes('No tienes canjes realizados.');
      } else {
        const errorMessage = error.response?.data?.error || 'Ocurrió un error al obtener los canjes.';
        setErrorCanjes(errorMessage);
      }
    } finally {
      setLoadingCanjes(false);
    }
  };

  const fetchClienteId = async (id_usuario_num: number) => {
    try {
      const response = await api.get(`/cliente_id/${id_usuario_num}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 && response.data.id_cliente) {
        setIdCliente(response.data.id_cliente);
      } else {
        setErrorCliente('No se pudo obtener el ID del cliente.');
      }
    } catch (error: any) {
      console.error('Error al obtener el ID del cliente:', error);
      const errorMessage = error.response?.data?.error || 'Ocurrió un error al obtener el ID del cliente.';
      setErrorCliente(errorMessage);
    }
  };

  const fetchUser = async () => {
    try {
      const profileData = await fetchPerfil(Number(id_usuario));
      setUser(profileData);

      if (profileData && profileData.id_usuario) {
        const id_usuario_num = Number(profileData.id_usuario);
        if (!isNaN(id_usuario_num)) {
          await fetchCanjes(id_usuario_num);
          await fetchClienteId(id_usuario_num);
        } else {
          setErrorCanjes('ID de usuario inválido.');
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUser();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchPerfil, id_usuario, token]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {String(error)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user && idCliente ? (
        <>
          <ProfileHeader 
            user={user} 
            id_cliente={idCliente} 
            onEditProfile={handleEditProfile} 
            onLogOut={handleLogout}
          />

          <FlatList
            data={canjes}
            keyExtractor={(item) => item.id_canje.toString()}
            renderItem={({ item }) => <CanjeItem canje={item} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={
              <View style={styles.canjesContainer}>
                <Text style={styles.canjesTitle}>Historial de Canjes</Text>
              </View>
            }
            ListEmptyComponent={
              <Text style={styles.noCanjes}>{errorCanjes || 'No tienes canjes realizados.'}</Text>
            }
          />
        </>
      ) : (
        <Text style={styles.noUser}>Cargando información del cliente...</Text>
      )}
    </View>
  );
};

export default Perfil;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  noUser: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  canjesContainer: {
    marginTop: 20,
  },
  canjesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  canjeItem: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 15,
  },
  canjeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  canjeEstado: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  canjeFecha: {
    fontSize: 12,
    color: '#555',
  },
  canjeDetails: {
    marginTop: 5,
  },
  canjeDetailText: {
    fontSize: 14,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  detalleItem: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e9e9e9',
    borderRadius: 5,
  },
  separator: {
    height: 10,
  },
  noCanjes: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});
