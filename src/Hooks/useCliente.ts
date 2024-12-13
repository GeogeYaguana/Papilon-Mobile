import { useState, useCallback } from 'react';
import api from '../context/AxiosInstance';

interface ClienteResponse {
  id_cliente: number;
}

export const useCliente = () => {
  const [cliente, setCliente] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCliente = useCallback(async (id_usuario: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Usamos la instancia de Axios personalizada (api)
      const response = await api.get<ClienteResponse>('/get_cliente', {
        params: { id_usuario },
      });
      setCliente(response.data.id_cliente);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Unexpected error occurred');
      } else {
        setError('Error fetching cliente');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { cliente, loading, error, fetchCliente };
};
