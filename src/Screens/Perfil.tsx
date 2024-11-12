import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/MainNavigation';
import { AuthContext } from '../context/AuthContext';
import ProfileHeader from '../Componentes/ProfileHeader/ProfileHeader';
import { usePerfil } from '../Hooks/usePerfil';
import ButtonCustom from '../Componentes/Boton/ButtonCustom';
import { useNavigation } from '@react-navigation/native';
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

const Perfil: React.FC<PerfilProps> = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<User | null>(null);
  const { id_usuario, logout } = useContext(AuthContext);
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
    Alert.alert('Editar Perfil', '¡Editar perfil presionado!');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profileData = await fetchPerfil(Number(id_usuario));
        setUser(profileData); // Actualiza el estado con los datos del perfil
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    fetchUser();
  }, [fetchPerfil, id_usuario]);

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
      {user ? (
        <>
          <ProfileHeader user={user} onEditProfile={handleEditProfile} onLogOut={handleLogout}/>
      
        </>
      ) : (
        <Text style={styles.noUser}>No se encontró información del usuario</Text>
      )}
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
  noUser: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Perfil;
