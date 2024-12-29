// src/Componentes/Mapa/MapViewComponent.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import api from '../../context/AxiosInstance';

// Interfaz usada en el frontend
export interface Local {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

const MapViewComponent: React.FC = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Locales para mostrar en el mapa
  const [locals, setLocals] = useState<Local[]>([]);

  // Guarda el id del watch para poder limpiarlo después
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    // 1. Solicitar permisos y luego iniciar el watch
    requestLocationPermission();

    // 2. Obtener locales de tu backend
    fetchLocals();

    // Importante: limpiar el watch cuando el componente se desmonte
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Solicita permiso de geolocalización (Android)
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de Ubicación',
            message: 'La aplicación necesita acceder a tu ubicación.',
            buttonPositive: 'Aceptar',
            buttonNegative: 'Cancelar',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permiso denegado', 'No se pudo obtener el permiso de ubicación.');
          return;
        }
      } catch (err) {
        console.warn(err);
      }
    }

    // Inicia la suscripción a la ubicación en tiempo real
    watchUserLocation();
  };

  // Suscripción a actualizaciones de la ubicación
  const watchUserLocation = () => {
    const id = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Ubicación en tiempo real:', latitude, longitude);

        // Si quieres que el mapa te siga automáticamente
        setRegion((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
      },
      (error) => {
        console.error(error);
        Alert.alert('Error', `Código ${error.code}: ${error.message}`);
      },
      {
        enableHighAccuracy: true,    // mayor precisión (usa más batería)
        distanceFilter: 10,         // notificar cambios cada 10 mts (ajusta según tu necesidad)
        interval: 5000,             // [Android] intervalo deseado en ms para recibir updates
        fastestInterval: 2000,      // [Android] intervalo máximo en ms entre notificaciones
      }
    );

    setWatchId(id);
  };

  // Llama a tu endpoint para obtener la lista de locales
  const fetchLocals = async () => {
    try {
      const response = await api.get('/locales'); 
      // Asegúrate de que el backend devuelva algo como:
      // [
      //   {
      //     "id_local": 1,
      //     "nombre_local": "Local 1",
      //     "latitud": "37.78825",
      //     "longitud": "-122.4324"
      //   },
      //   ...
      // ]

      // Convertimos latitud y longitud a número:
      const transformedLocals: Local[] = response.data.map((localBackend: any) => ({
        id: localBackend.id_local.toString(),
        name: localBackend.nombre_local,
        latitude: parseFloat(localBackend.latitud),
        longitude: parseFloat(localBackend.longitud),
      }));
      setLocals(transformedLocals);
    } catch (error: any) {
      console.error('Error al obtener locales:', error);
      Alert.alert('Error', 'No se pudieron cargar los locales');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChangeComplete={setRegion}
      >
        {/* Marcadores de locales */}
        {locals.map((local) => (
          <Marker
            key={local.id}
            coordinate={{
              latitude: local.latitude,
              longitude: local.longitude,
            }}
            title={local.name}
            description={local.name}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapViewComponent;

const styles = StyleSheet.create({
  container: {
    height: 300,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
