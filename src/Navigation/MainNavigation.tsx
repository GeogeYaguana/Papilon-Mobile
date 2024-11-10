import React from "react";
import { createNativeStackNavigator , NativeStackScreenProps } from "@react-navigation/native-stack";
import Home from "../Screens/Home";
import Perfil from "../Screens/Perfil";
import Login from "../Screens/Login";
import BottomTabNavigator from "./BottomTabNavigator";

export type RootStackParamList = {
    Home: undefined;
    Perfil:undefined;
    Login: undefined;
    BottomNavigator: undefined;
}
const Stack = createNativeStackNavigator<RootStackParamList>();
const MainNavigation = () => {
    return(
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} options={{headerShown:false,title:''}} />
                <Stack.Screen name="BottomNavigator" component={BottomTabNavigator} />
            </Stack.Navigator>
    )
}
export default MainNavigation;