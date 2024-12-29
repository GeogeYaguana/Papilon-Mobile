// src/Screens/ProductDetail.tsx
import React, { useEffect, useState, useContext } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ActivityIndicator, 
    Alert, 
    ScrollView, 
    TouchableOpacity 
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../Navigation/MainNavigation";
import api from "../context/AxiosInstance";
import { Producto } from "../types/types";
import { AuthContext } from "../context/AuthContext"; // Importar AuthContext

type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;

const ProductDetail: React.FC = () => {
    const route = useRoute<ProductDetailRouteProp>();
    const { idProducto } = route.params;
    const { id_usuario } = useContext(AuthContext); // Acceder a id_usuario desde AuthContext
    const [producto, setProducto] = useState<Producto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingCanjear, setLoadingCanjear] = useState<boolean>(false);

    useEffect(() => {
        const fetchProductoDetail = async () => {
            try {
                const response = await api.get(`/producto/${idProducto}`); // Asegúrate de tener este endpoint
                setProducto(response.data);
            } catch (error: any) {
                console.error("Error al obtener detalles del producto:", error);
                Alert.alert("Error", "No se pudo cargar la información del producto");
            } finally {
                setLoading(false);
            }
        };
        fetchProductoDetail();
    }, [idProducto]);

    const realizarCanjeo = async (cantidad: number) => {
        setLoadingCanjear(true);
        try {
            if (!id_usuario) {
                Alert.alert("Error", "No se pudo obtener la información del usuario.");
                setLoadingCanjear(false);
                return;
            }

            const id_usuario_num = parseInt(id_usuario, 10);
            if (isNaN(id_usuario_num)) {
                Alert.alert("Error", "ID de usuario inválido.");
                setLoadingCanjear(false);
                return;
            }

            // Enviar solicitud POST al endpoint '/realizar_canje'
            const response = await api.post('/realizar_canje', {
                id_usuario: id_usuario_num,
                id_producto: idProducto,
                cantidad, // Enviar la cantidad seleccionada
            });

            // Manejar la respuesta
            if (response.status === 201 || response.status === 200) {
                Alert.alert("Éxito", "Producto canjeado exitosamente.");

                // Opcional: Actualizar la disponibilidad del producto
                setProducto(prev => prev ? { ...prev, disponibilidad: false } : prev);
            } else {
                Alert.alert("Error", "No se pudo canjear el producto. Inténtalo de nuevo.");
            }
        } catch (error: any) {
            console.error("Error al canjear el producto:", error);
            const errorMessage = error.response?.data?.error || "Ocurrió un error al canjear el producto.";
            Alert.alert("Error", errorMessage);
        } finally {
            setLoadingCanjear(false);
        }
    };

    const handleCanjear = () => {
        // Confirmación antes de canjear
        Alert.alert(
            "Confirmar Canjeo",
            "¿Estás seguro de que deseas canjear este producto?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Canjear",
                    onPress: () => realizarCanjeo(1), // Por defecto, 1 unidad
                },
            ],
            { cancelable: true }
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text>Cargando detalles del producto...</Text>
            </View>
        );
    }

    if (!producto) {
        return (
            <View style={styles.center}>
                <Text>No se encontró información del producto.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image 
                source={{ uri: producto.foto_url || "https://via.placeholder.com/300" }}
                style={styles.image}
            />
            <Text style={styles.name}>{producto.nombre}</Text>
            <Text style={styles.description}>{producto.descripcion}</Text>
            <Text style={styles.price}>Precio: ${producto.precio}</Text>
            <Text style={styles.discount}>Descuento: {producto.descuento}%</Text>
            <Text style={styles.availability}>Disponibilidad: {producto.disponibilidad ? "Disponible" : "No Disponible"}</Text>
            <Text style={styles.points}>Puntos Necesarios: {producto.puntos_necesario}</Text>
            
            {/* Botón "Canjear" */}
            <TouchableOpacity 
                style={styles.canjearButton}
                onPress={handleCanjear}
                disabled={!producto.disponibilidad || loadingCanjear}
            >
                {loadingCanjear ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.canjearButtonText}>Canjear</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ProductDetail;

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        padding: 16,
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 16,
        resizeMode: "cover",
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    description: {
        fontSize: 16,
        color: "#666",
        marginBottom: 8,
        textAlign: "center",
    },
    price: {
        fontSize: 16,
        color: "#333",
        marginBottom: 4,
        textAlign: "center",
    },
    discount: {
        fontSize: 16,
        color: "#333",
        marginBottom: 4,
        textAlign: "center",
    },
    availability: {
        fontSize: 16,
        color: "#333",
        marginBottom: 4,
        textAlign: "center",
    },
    points: {
        fontSize: 16,
        color: "#333",
        marginBottom: 16,
        textAlign: "center",
    },
    canjearButton: {
        backgroundColor: "#6200ee",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 20,
        alignItems: "center",
        width: "80%",
    },
    canjearButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
