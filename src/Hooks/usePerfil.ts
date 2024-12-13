import { useState, useCallback } from "react";
import api from "../context/AxiosInstance";

interface UserProfile {
  name: string;
  email: string;
  photo: string;
}

export const usePerfil = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Función auxiliar para manejar solicitudes
  const handleRequest = async (request: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await request();
      return response.data;
    } catch (err: any) {
      console.error("Error in API request:", err);
      setError(
        err.response?.data?.message || "An error occurred while fetching data."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el perfil de usuario
  const fetchPerfil = useCallback(async (id: number) => {
    const data = await handleRequest(() => api.get(`/usuario/${id}`));
    setProfile(data);
    return data;
  }, []);
  

  return { loading, error, profile, fetchPerfil };
};
