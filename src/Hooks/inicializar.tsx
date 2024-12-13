import { setAuthorizationHeader } from "../context/AxiosInstance";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initializeApp = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Recuperar el token.
      if (token) {
        setAuthorizationHeader(token); // Configurar el header si existe el token.
      }
    } catch (error) {
      console.error('Error al inicializar la app:', error);
    }
  };
  