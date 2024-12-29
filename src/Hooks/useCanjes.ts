// src/Hooks/useCanjes.ts
import { useState, useEffect } from 'react';
import api from '../context/AxiosInstance';

interface Canje {
  id_canje: number;
  id_cliente: number;
  id_local: number;
  estado: string;
  puntos_utilizados: number;
  local: {
    id_local: number;
    nombre_local: string;
    direccion: string;
  };
  producto: {
    id_producto: number;
    nombre: string;
    puntos_necesario: number;
  };
}

interface UseCanjesReturn {
  canjes: Canje[];
  loadingCanjes: boolean;
  errorCanjes: string | null;
}

const useCanjes = (id_usuario: number): UseCanjesReturn => {
  const [canjes, setCanjes] = useState<Canje[]>([]);
  const [loadingCanjes, setLoadingCanjes] = useState<boolean>(true);
  const [errorCanjes, setErrorCanjes] = useState<string | null>(null);

  useEffect(() => {
    const fetchCanjes = async () => {
      try {
        const response = await api.get(`/canjes/usuario/${id_usuario}`);
        if (response.status === 200) {
          setCanjes(response.data.canjes);
        } else {
          setErrorCanjes('No se pudieron obtener los canjes.');
        }
      } catch (error: any) {
        console.error('Error al obtener los canjes:', error);
        setErrorCanjes(error.response?.data?.error || 'Ocurrió un error al obtener los canjes.');
      } finally {
        setLoadingCanjes(false);
      }
    };

    fetchCanjes();
  }, [id_usuario]);

  return { canjes, loadingCanjes, errorCanjes };
};

export default useCanjes;
