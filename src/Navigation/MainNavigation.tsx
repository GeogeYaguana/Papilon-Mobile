import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../Screens/Login";
import BottomTabNavigator from "./BottomTabNavigator";
import { AuthContext } from "../context/AuthContext";
import Register from "../Screens/Register";
import LocalDetail from "../Screens/LocalDetail";
import Prueba from "../Screens/Prueba";
import Categoria from "../Screens/Categoria";
import ProductDetail from "../Screens/ProductDetail";
import EditPerfil from "../Screens/EditProfile"; // Asegúrate que la ruta es correcta

export type RootStackParamList = {
    Home: undefined;
    Perfil: undefined;
    Login: undefined;
    BottomTabNavigator: undefined;
    Register: undefined;
    Categoria: { categoria: string };
    LocalDetail: { idLocal: number };
    ProductDetail: { idProducto: number };
    EditPerfil: undefined; // Añadir el tipo para EditProfile
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigation: React.FC = () => {
    const { token } = useContext(AuthContext);

    return (
        <Stack.Navigator initialRouteName={token ? "BottomTabNavigator" : "Login"}>
            {token ? (
                <>
                    <Stack.Screen
                        name="BottomTabNavigator"
                        component={BottomTabNavigator}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Categoria"
                        component={Categoria}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="LocalDetail"
                        component={LocalDetail}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ProductDetail"
                        component={ProductDetail}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="EditPerfil" // Corregido el nombre aquí
                        component={EditPerfil}
                        options={{ title: "Editar Perfil" }} // Puedes personalizar las opciones
                    />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Register"
                        component={Register}
                        options={{ headerShown: false }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};

export default MainNavigation;
