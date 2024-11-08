import React from "react";
import { createNativeStackNavigator , NativeStackScreenProps } from "@react-navigation/native-stack";
import Home from "../Screens/Home";
import Perfil from "../Screens/Perfil";
import Login from "../Screens/Login";

export type RootStackParamList = {
    Home: undefined;
    Perfil: {userId: string};
    Login: undefined;
}
const Stack = createNativeStackNavigator<RootStackParamList>();
const MainNavigation = () => {
    return(
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Home" component={Home} options={{headerShown:false,title:''}}/>
                <Stack.Screen name="Perfil" component={Perfil} options={{headerShown:false,title:''}}/>
                <Stack.Screen name="Login" component={Login} options={{headerShown:false,title:''}} />
            </Stack.Navigator>
    )


}
export default MainNavigation;