// src/Screens/LocalDetail.tsx
import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ActivityIndicator, 
    Alert, 
    FlatList, 
    TouchableOpacity, 
    Dimensions 
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation/MainNavigation";
import api from "../context/AxiosInstance";
import { Producto } from "../types/types";

interface LocalDetailParams {
    idLocal: number;
}

type LocalDetailRouteProp = RouteProp<RootStackParamList, "LocalDetail">;
type LocalDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, "LocalDetail">;

const LocalDetail: React.FC = () => {
    const route = useRoute<LocalDetailRouteProp>();
    const navigation = useNavigation<LocalDetailNavigationProp>();
    const { idLocal } = route.params;

    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await api.get(`/locales/${idLocal}/productos`);
                setProductos(response.data.productos);
            } catch (error: any) {
                console.error("Error al obtener productos del local:", error);
                Alert.alert("Error", "No se pudieron cargar los productos de este local");
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, [idLocal]);

    const handleProductoPress = (idProducto: number) => {
        navigation.navigate("ProductDetail", { idProducto });
    };

    // Componente para renderizar cada producto
    const renderProducto = ({ item }: { item: Producto }) => (
        <TouchableOpacity 
            style={styles.productCard}
            onPress={() => handleProductoPress(item.id_producto)}
        >
            <Image
                source={{ uri: item.foto_url || "https://via.placeholder.com/150" }}
                style={styles.productImage}
            />
            <Text style={styles.productName}>{item.nombre}</Text>
            <Text style={styles.productDescription}>{item.descripcion}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text>Cargando productos...</Text>
            </View>
        );
    }

    if (!productos || productos.length === 0) {
        return (
            <View style={styles.center}>
                <Text>No hay productos para mostrar.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={productos}
            keyExtractor={(item) => item.id_producto.toString()}
            renderItem={renderProducto}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.noProductsText}>No hay productos para mostrar.</Text>}
        />
    );
};

export default LocalDetail;

const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - 40) / 2; // Ajusta el espacio según padding y margin

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContent: {
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    productCard: {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        width: cardWidth,
        marginBottom: 15,
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        alignItems: "center",
        padding: 10,
    },
    productImage: {
        width: "100%",
        height: 100,
        borderRadius: 10,
        marginBottom: 8,
        resizeMode: "cover",
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
        textAlign: "center",
    },
    productDescription: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
    noProductsText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginTop: 20,
    },
});
