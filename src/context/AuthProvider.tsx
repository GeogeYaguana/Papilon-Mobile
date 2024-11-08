// src/Context/AuthProvider.tsx

import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  id_usuario: string | null;
  tipo_cliente: string | null;
  token: string | null;
}

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [authState, setAuthStateInternal] = useState<AuthState>({
    id_usuario: null,
    tipo_cliente: null,
    token: null,
  });

  const setAuthState = (newState: Partial<AuthState>) => {
    setAuthStateInternal((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const id_usuario = await AsyncStorage.getItem('id_usuario');
        const tipo_cliente = await AsyncStorage.getItem('tipo_cliente');
        const token = await AsyncStorage.getItem('userToken');

        if (id_usuario || tipo_cliente || token) {
          setAuthStateInternal({
            id_usuario,
            tipo_cliente,
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
  
        if (authState.tipo_cliente !== null) {
          await AsyncStorage.setItem('tipo_cliente', String(authState.tipo_cliente));
        } else {
          await AsyncStorage.removeItem('tipo_cliente');
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
