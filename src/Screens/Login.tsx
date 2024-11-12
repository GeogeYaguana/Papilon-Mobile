// src/Screens/Login.tsx

import React, { useContext } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/MainNavigation';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import ButtonCustom from '../Componentes/Boton/ButtonCustom';
import { AuthContext } from '../context/AuthContext';
import api , {setAuthorizationHeader} from '../context/AxiosInstance';
type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
type FormData = {
  usuario_nombre: string;
  password: string;
};

const API_Backend: string = 'http://192.168.100.190:5000';

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { setAuthState } = useContext(AuthContext);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(`${API_Backend}/login`, data);
      if (response.status === 200) {
        const { token, id_usuario, tipo_usuario} = response.data;
        setAuthState({
          id_usuario,
          tipo_usuario,
          token,
        });
        setAuthorizationHeader(token);
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', 'Ocurrió un problema durante el inicio de sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../Assets/logo.png')} style={styles.image} />
      <Controller
        control={control}
        rules={{
          required: 'El nombre de usuario es obligatorio',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Nombre de usuario"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="usuario_nombre"
        defaultValue=""
      />
      {errors.usuario_nombre && <Text style={{ color: 'red' }}>{errors.usuario_nombre.message}</Text>}

      {/* Campo password */}
      <Controller
        control={control}
        rules={{
          required: 'La contraseña es obligatoria',
          minLength: {
            value: 6,
            message: 'La contraseña debe tener al menos 6 caracteres',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Contraseña"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
        defaultValue=""
      />
      {errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}

      <ButtonCustom 
        title="Login" 
        onPress={handleSubmit(onSubmit)}
        backgroundColor="#EEC21B" 
        textColor="#fff" 
        borderRadius={30} 
      /> 
  {/* Botón para redirigir a Registro */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>          
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },

  text: {
    fontSize: 14, 
    color: "white", 
    marginTop:20, 
  }, 
  textInput: {
    borderWidth: 1, 
    borderColor: 'gray',
    padding: 10,
    width : '80%', 
    marginTop:30, 
    borderRadius:30,
    backgroundColor: 'white',
    paddingStart:30,
  },

  image: {
    width: 300,  // Ancho de la imagen
    height: 200,  // Altura de la imagen
  },
  registerText: {
    marginTop: 20,
    color: '#0066cc',
    textDecorationLine: 'underline',
  },

});

export default Login;
