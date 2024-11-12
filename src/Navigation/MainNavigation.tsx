import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../Screens/Login";
import BottomTabNavigator from "./BottomTabNavigator";
import { AuthContext } from "../context/AuthContext";
import Register from "../Screens/Register";

export type RootStackParamList = {
    Home: undefined;
    Perfil: undefined;
    Login: undefined;
    BottomTabNavigator: undefined;
    Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigation: React.FC = () => {
    const { token } = useContext(AuthContext);

    return (
        <Stack.Navigator initialRouteName={token ? "BottomTabNavigator" : "Login"}>
            {token ? (
                <Stack.Screen
                    name="BottomTabNavigator"
                    component={BottomTabNavigator}
                    options={{ headerShown: false }}
                />
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
