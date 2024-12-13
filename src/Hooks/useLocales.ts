import { useState , useCallback} from 'react';
import api , {setAuthorizationHeader}from '../context/AxiosInstance';

  export const uselocales = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    // Función auxiliar para manejar solicitudes
    const handleRequest = async (request: () => Promise<any>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await request();
        return response.data;
      } catch (err: any) {
        console.error('Error in API request:', err);
        if (err.response?.status === 401) {
          setError('Unauthorized: Please check your credentials.');
        } else {
          setError('An error occurred while fetching data.');
        }
        throw err;
      } finally {
        setLoading(false);
      }
    };
  
    // Función para obtener todos los locales
    const fetchLocales = useCallback(async () => {
      return await handleRequest(() => api.get('/locales'));
    }, []);
  
    // Función para obtener un local por ID
    const fetchLocalesById = useCallback(async (id: string) => {
      return await handleRequest(() => api.get(`/locales/${id}`));
    }, []);
  
    return { fetchLocales, fetchLocalesById, loading, error };
  };