import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, Image, ScrollView, Button } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import ButtonCustom from '../Componentes/Boton/ButtonCustom';
import { uploadImageToFirebase } from '../Servicios/uploadImageToFirebase';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/MainNavigation';
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
type RegisterProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

const Register: React.FC<RegisterProps> = ({navigation}) => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { setAuthState } = useContext(AuthContext);

  // Manejar selección de imagen
  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.error('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri || null;
          setSelectedImageUri(uri);
        }
      }
    );
  };

  const onSubmit = async (data: FormData) => {
    try {
      setUploading(true);
  
      let imageUrl = data.url_imagen;
  
      // Si hay imagen seleccionada, súbela a Firebase
      if (selectedImageUri) {
        const uploadedUrl = await uploadImageToFirebase(selectedImageUri);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          Alert.alert('Error', 'No se pudo subir la imagen.');
          setUploading(false);
          return;
        }
      }
  
      // Construir el cuerpo de la solicitud POST
      const finalData = {
        ...data,
        url_imagen: imageUrl,
        tipo_usuario: 'cliente', // Siempre será cliente para este caso
        puntos: 0, // Puntos iniciales por defecto
      };
  
      // Realizar la solicitud POST al backend
      const response = await axios.post(`${API_Backend}/crear_cliente`, finalData, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.status === 201) {

        const { id_usuario, token } = response.data; // Suponiendo que devuelves estos datos
        Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente.');
        navigation.navigate('Login');
        // Navegar a la pantalla principal o de inicio de sesión
        // navigation.navigate('Home'); // Si usas React Navigation
      } else {
        Alert.alert('Error', 'No se pudo completar el registro.');
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      Alert.alert('Error', 'Ocurrió un problema durante el registro.');
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../Assets/logo.png')} style={styles.image} />

      {/* Campo Nombre */}
      <Controller
        control={control}
        rules={{ required: 'El nombre es obligatorio' }}
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
        rules={{ required: 'El nombre de usuario es obligatorio' }}
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
          minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
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

      <Controller
      control={control}
      rules={{ required: 'El tipo de usuario es obligatorio' }}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={styles.textInput}
          placeholder="Tipo de usuario (e.g., local, cliente)"
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          editable={false} // Hacer el campo no editable para que siempre sea 'cliente'
        />
      )}
      name="tipo_usuario"
      defaultValue="cliente" // Valor por defecto
    />
      {errors.tipo_usuario && <Text style={{ color: 'red' }}>{errors.tipo_usuario.message}</Text>}

      {/* Botón para seleccionar imagen */}
      <Button
        title="Seleccionar Imagen"
        onPress={selectImage}
      />
      {selectedImageUri && (
        <Image
          source={{ uri: selectedImageUri }}
          style={{ width: 200, height: 200, marginVertical: 10 }}
        />
      )}

      {/* Botón de Registro */}
      <ButtonCustom
        title={uploading ? 'Subiendo...' : 'Registrar'}
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
