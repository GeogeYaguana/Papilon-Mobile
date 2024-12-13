import React from "react";
import { View, Text } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../Navigation/MainNavigation";

type CategoriaRouteProp = RouteProp<RootStackParamList, "Categoria">;

const Categoria: React.FC = () => {
    const route = useRoute<CategoriaRouteProp>();
    const { categoria } = route.params; // Obtiene el parámetro `id`

    return (
        <View>
            <Text>Categoria ID: {categoria}</Text>
        </View>
    );
};

export default Categoria;
