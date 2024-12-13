import { useState, useCallback } from 'react';
import api from '../context/AxiosInstance';

interface Usuario {
  id_usuario: number;
  nombre: string;
  usuario_nombre: string;
  correo: string;
  tipo_usuario: string;
  url_imagen: string;
  telefono: string;
  puntos: number;
}

interface Cliente {
  id_cliente: number;
  id_usuario: number;
  puntos: number;
  usuario: Usuario;
  [key: string]: any; // Para otros campos que pueda tener la respuesta
}

export const useClientInfo = () => {
  const [clienteInfo, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClienteInfo = useCallback(async (id_cliente: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Cliente>(`/clientes/${id_cliente}`);
      setCliente(response.data);
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

  return { clienteInfo, loading, error, fetchClienteInfo };
};
