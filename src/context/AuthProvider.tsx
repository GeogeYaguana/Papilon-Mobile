// src/Context/AuthProvider.tsx

import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  id_usuario: string | null;
  tipo_usuario: string | null;
  token: string | null;
}

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [authState, setAuthStateInternal] = useState<AuthState>({
    id_usuario: null,
    tipo_usuario: null,
    token: null,
  });

  const setAuthState = (newState: Partial<AuthState>) => {
    setAuthStateInternal((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('id_usuario');
      await AsyncStorage.removeItem('tipo_usuario');
      await AsyncStorage.removeItem('userToken');
      setAuthStateInternal({
        id_usuario: null,
        tipo_usuario: null,
        token: null,
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const id_usuario = await AsyncStorage.getItem('id_usuario');
        const tipo_usuario = await AsyncStorage.getItem('tipo_usuario');
        const token = await AsyncStorage.getItem('userToken');

        if (id_usuario || tipo_usuario || token) {
          setAuthStateInternal({
            id_usuario,
            tipo_usuario,
            token,
          });
        }
      } catch (error) {
        console.error('Error al cargar el estado de autenticación:', error);
      }
    };

    loadAuthState();
  }, []);

  useEffect(() => {
    const saveAuthState = async () => {
      try {
        if (authState.id_usuario !== null) {
          await AsyncStorage.setItem('id_usuario', String(authState.id_usuario));
        } else {
          await AsyncStorage.removeItem('id_usuario');
        }

        if (authState.tipo_usuario !== null) {
          await AsyncStorage.setItem('tipo_usuario', String(authState.tipo_usuario));
        } else {
          await AsyncStorage.removeItem('tipo_usuario');
        }

        if (authState.token !== null) {
          await AsyncStorage.setItem('userToken', authState.token);
        } else {
          await AsyncStorage.removeItem('userToken');
        }
      } catch (error) {
        console.error('Error al guardar el estado de autenticación:', error);
      }
    };

    saveAuthState();
  }, [authState]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        setAuthState,
        logout, // Proporcionamos la función logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
