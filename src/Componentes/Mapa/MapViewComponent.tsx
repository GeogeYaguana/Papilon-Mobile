import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

export interface Restaurant {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
}

interface MapViewComponentProps {
    restaurants: Restaurant[];
}

const MapViewComponent: React.FC<MapViewComponentProps> = ({ restaurants }) => {
    const [region, setRegion] = useState<Region>({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
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
                        },
                    );
                    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                        Alert.alert('Permiso denegado', 'No se pudo obtener el permiso de ubicación.');
                        return;
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
            getCurrentLocation();
        };

        const getCurrentLocation = () => {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    console.log('Ubicación obtenida:', latitude, longitude);

                    const newRegion = {
                        latitude,
                        longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    };
                    setRegion(newRegion);
                    setUserLocation({ latitude, longitude });
                },
                error => {
                    console.error(error);
                    Alert.alert('Error', `Código ${error.code}: ${error.message}`);               
                 },
                {
                    enableHighAccuracy: false,
                    timeout: 15000,
                    maximumAge: 10000,
                },
            );
        };

        requestLocationPermission();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                showsUserLocation={true}
                showsMyLocationButton={true}
                onRegionChangeComplete={setRegion}
            >
                {userLocation && (
                    <Marker
                        coordinate={userLocation}
                        title="Tu ubicación"
                        description="Ubicación actual"
                        pinColor="blue"
                    />
                )}

                {restaurants.map(restaurant => (
                    <Marker
                        key={restaurant.id}
                        coordinate={{
                            latitude: restaurant.latitude,
                            longitude: restaurant.longitude,
                        }}
                        title={restaurant.name}
                        description={restaurant.name}
                    />
                ))}
            </MapView>
        </View>
    );
};

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

export default MapViewComponent;
