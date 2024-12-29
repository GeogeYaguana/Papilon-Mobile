// src/Screens/Categoria.tsx
import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    Image, 
    ActivityIndicator, 
    Alert 
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation/MainNavigation";
import api from "../context/AxiosInstance";
// Interfaces
interface UsuarioLocal {
    id_usuario: number;
    nombre: string;
    url_imagen: string;
}

interface LocalData {
    id_local: number;
    nombre_local: string;
    descripcion: string;
    latitud: string;
    longitud: string;
    cociente_puntos_local: string;
    direccion: string;
    usuario: UsuarioLocal;
}

type CategoriaRouteProp = RouteProp<RootStackParamList, "Categoria">;
type CategoriaNavigationProp = NativeStackNavigationProp<RootStackParamList, "Categoria">;

const Categoria: React.FC = () => {
    const route = useRoute<CategoriaRouteProp>();
    const navigation = useNavigation<CategoriaNavigationProp>();
    const { categoria } = route.params; // categoria: number

    const [locales, setLocales] = useState<LocalData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const idCategoria = categoria; // Ya es un número
        const fetchLocalesByCategoria = async () => {
            try {
                const response = await api.get(`/locales/categoria/${idCategoria}`);
                setLocales(response.data.locales);
            } catch (error: any) {
                console.error("Error al obtener locales:", error);
                Alert.alert(
                    "Error",
                    "No se pudieron cargar los locales para esta categoría."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLocalesByCategoria();
    }, [categoria]);

    const handleLocalPress = (idLocal: number) => {
        // Navegar a la pantalla de detalle del local
        navigation.navigate("LocalDetail", { idLocal }); // Sin cast
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text>Cargando locales...</Text>
            </View>
        );
    }

    if (!locales || locales.length === 0) {
        return (
            <View style={styles.center}>
                <Text>No se encontraron locales para esta categoría.</Text>
            </View>
        );
    }

    // Renderizar la lista en cuadrícula
    return (
        <View style={styles.container}>
            <FlatList
                data={locales}
                keyExtractor={(item) => item.id_local.toString()}
                numColumns={2}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity 
                            style={styles.cardContainer}
                            onPress={() => handleLocalPress(item.id_local)}
                        >
                            <Image
                                source={{ uri: item.usuario?.url_imagen || "https://via.placeholder.com/150" }}
                                style={styles.image}
                            />
                            <Text style={styles.title}>{item.nombre_local}</Text>
                            <Text style={styles.description}>{item.descripcion}</Text>
                        </TouchableOpacity>
                    );
                }}
                columnWrapperStyle={{ justifyContent: 'space-around' }}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

export default Categoria;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContent: {
        paddingBottom: 20,
    },
    cardContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        width: "45%", 
        marginBottom: 15,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        alignItems: "center",
        padding: 10,
    },
    image: {
        width: "100%",
        height: 100,
        borderRadius: 10,
        marginBottom: 8,
        resizeMode: "cover",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
        textAlign: "center",
    },
    description: {
        fontSize: 13,
        color: "#666",
        textAlign: "center",
    },
});
