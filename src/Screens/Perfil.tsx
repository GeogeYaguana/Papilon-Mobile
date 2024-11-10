import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/MainNavigation';
import { AuthContext } from '../context/AuthContext';
import BottomTabNavigator from '../Navigation/BottomTabNavigator';
import ProfileHeader from '../Componentes/ProfileHeader/ProfileHeader';
import { usePerfil } from '../Hooks/usePerfil';

interface User {
  correo: string;
  fecha_registro: string;
  id_usuario: number;
  nombre: string;
  telefono: string;
  tipo_usuario: string;
  url_imagen: string;
  usuario_nombre: string;
}

type PerfilProps = NativeStackScreenProps<RootStackParamList, 'Perfil'>;

const Perfil: React.FC<PerfilProps> = ({ route }) => {
  const [user, setUser] = useState<User | null>(null); // Permite que sea null inicialmente
  const { id_usuario } = useContext(AuthContext);
  const { loading, error, profile, fetchPerfil } = usePerfil();

  const handleEditProfile = () => {
    Alert.alert("Editar Perfil", "¡Editar perfil presionado!");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profileData = await fetchPerfil(Number(id_usuario));
        setUser(profileData); // Actualiza el estado con los datos del perfil
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUser();
  }, [fetchPerfil, id_usuario]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text>Cargando...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {user && <ProfileHeader user={user} onEditProfile={handleEditProfile} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
});

export default Perfil;
