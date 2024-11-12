// src/Screens/Register.tsx

import React from 'react';
import { View, Text, StyleSheet, Alert, TextInput, Image, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import ButtonCustom from '../Componentes/Boton/ButtonCustom';

type FormData = {
  nombre: string;
  usuario_nombre: string;
  password: string;
  correo: string;
  tipo_usuario: string;
  url_imagen: string;
  telefono: string;
};

const API_Backend: string = 'http://192.168.100.190:5000';

const Register: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(`${API_Backend}/register`, data, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente.');
        // Navegar al login o pantalla inicial
      } else {
        Alert.alert('Error', 'No se pudo completar el registro.');
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      Alert.alert('Error', 'Ocurrió un problema durante el registro.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../Assets/logo.png')} style={styles.image} />

      {/* Campo Nombre */}
      <Controller
        control={control}
        rules={{
          required: 'El nombre es obligatorio',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Nombre completo"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="nombre"
        defaultValue=""
      />
      {errors.nombre && <Text style={{ color: 'red' }}>{errors.nombre.message}</Text>}

      {/* Campo Usuario */}
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

      {/* Campo Contraseña */}
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

      {/* Campo Correo */}
      <Controller
        control={control}
        rules={{
          required: 'El correo es obligatorio',
          pattern: {
            value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
            message: 'Ingresa un correo válido',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="correo"
        defaultValue=""
      />
      {errors.correo && <Text style={{ color: 'red' }}>{errors.correo.message}</Text>}

      {/* Campo Tipo de Usuario */}
      <Controller
        control={control}
        rules={{
          required: 'El tipo de usuario es obligatorio',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Tipo de usuario (e.g., local, cliente)"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="tipo_usuario"
        defaultValue=""
      />
      {errors.tipo_usuario && <Text style={{ color: 'red' }}>{errors.tipo_usuario.message}</Text>}

      {/* Campo URL Imagen */}
      <Controller
        control={control}
        rules={{
          required: 'La URL de la imagen es obligatoria',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="URL de imagen"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="url_imagen"
        defaultValue=""
      />
      {errors.url_imagen && <Text style={{ color: 'red' }}>{errors.url_imagen.message}</Text>}

      {/* Campo Teléfono */}
      <Controller
        control={control}
        rules={{
          required: 'El teléfono es obligatorio',
          pattern: {
            value: /^[0-9]+$/,
            message: 'Ingresa solo números',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Teléfono"
            keyboardType="numeric"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="telefono"
        defaultValue=""
      />
      {errors.telefono && <Text style={{ color: 'red' }}>{errors.telefono.message}</Text>}

      {/* Botón de Registro */}
      <ButtonCustom
        title="Registrar"
        onPress={handleSubmit(onSubmit)}
        backgroundColor="#EEC21B"
        textColor="#fff"
        borderRadius={30}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    width: '100%',
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});

export default Register;
