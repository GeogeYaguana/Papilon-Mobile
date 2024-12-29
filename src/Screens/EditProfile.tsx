// src/Screens/EditPerfil.tsx
import React, { useContext, useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ActivityIndicator, 
    Alert, 
    ScrollView, 
    TouchableOpacity, 
    TextInput 
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import api, { setAuthorizationHeader } from '../context/AxiosInstance'; // Usar 'api' en lugar de 'axios'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/MainNavigation';
import { AuthContext } from '../context/AuthContext';
import { uploadImageToFirebase } from '../Servicios/uploadImageToFirebase';
import { launchImageLibrary } from 'react-native-image-picker';
import ButtonCustom from '../Componentes/Boton/ButtonCustom';
import { User } from '../types/types'; // Asegúrate de que la interfaz User esté exportada

type FormData = {
    usuario_nombre: string; // Añadir el campo usuario_nombre
    nombre: string;
    correo: string;
    password: string;
    telefono: string;
    url_imagen: string;
};

type EditPerfilProps = NativeStackScreenProps<RootStackParamList, 'EditPerfil'>;

const EditPerfil: React.FC<EditPerfilProps> = ({ navigation }) => {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const { id_usuario, token } = useContext(AuthContext);
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Obtener los datos actuales del usuario para prellenar el formulario
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/usuario/${id_usuario}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    const user: User = response.data;
                    setUserData(user);

                    // Prellenar los campos del formulario
                    setValue('usuario_nombre', user.usuario_nombre); // Prellenar usuario_nombre
                    setValue('nombre', user.nombre);
                    setValue('correo', user.correo);
                    setValue('telefono', user.telefono);
                    setValue('url_imagen', user.url_imagen);
                } else {
                    Alert.alert('Error', 'No se pudo obtener la información del usuario.');
                }
            } catch (error: any) {
                console.error('Error fetching user data:', error);
                Alert.alert('Error', 'Ocurrió un error al obtener la información del usuario.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id_usuario, token, setValue]);

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

            // Construir el cuerpo de la solicitud PUT
            const finalData = {
                usuario_nombre: data.usuario_nombre, // Incluir usuario_nombre
                nombre: data.nombre,
                correo: data.correo,
                telefono: data.telefono,
                url_imagen: imageUrl,
                // Solo actualizar la contraseña si el usuario la ha cambiado
                ...(data.password ? { password: data.password } : {}),
            };

            // Realizar la solicitud PUT al backend usando 'api'
            const response = await api.put(`/usuario/${id_usuario}`, finalData);

            if (response.status === 200) {
                Alert.alert('Éxito', 'Perfil actualizado correctamente.');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'No se pudo actualizar el perfil.');
            }
        } catch (error: any) {
            console.error('Error durante la actualización del perfil:', error);
            Alert.alert('Error', 'Ocurrió un problema durante la actualización del perfil.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6200EE" />
                <Text>Cargando información del usuario...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar Perfil</Text>

            {/* Campo Usuario Nombre */}
            <Text style={styles.label}>Nombre de Usuario</Text>
            <Controller
                control={control}
                rules={{ 
                    required: 'El nombre de usuario es obligatorio',
                    minLength: { value: 3, message: 'El nombre de usuario debe tener al menos 3 caracteres' },
                    maxLength: { value: 20, message: 'El nombre de usuario no puede exceder los 20 caracteres' },
                    pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: 'El nombre de usuario solo puede contener letras, números y guiones bajos',
                    },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.textInput}
                        placeholder="Nombre de Usuario"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                    />
                )}
                name="usuario_nombre"
                defaultValue=""
            />
            {errors.usuario_nombre && <Text style={styles.errorText}>{errors.usuario_nombre.message}</Text>}

            {/* Campo Nombre */}
            <Text style={styles.label}>Nombre Completo</Text>
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
            {errors.nombre && <Text style={styles.errorText}>{errors.nombre.message}</Text>}

            {/* Campo Correo */}
            <Text style={styles.label}>Correo Electrónico</Text>
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
            {errors.correo && <Text style={styles.errorText}>{errors.correo.message}</Text>}

            {/* Campo Contraseña */}
            <Text style={styles.label}>Nueva Contraseña (opcional)</Text>
            <Controller
                control={control}
                rules={{
                    minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.textInput}
                        placeholder="Nueva Contraseña (opcional)"
                        secureTextEntry
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="password"
                defaultValue=""
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

            {/* Campo Teléfono */}
            <Text style={styles.label}>Teléfono</Text>
            <Controller
                control={control}
                rules={{ required: 'El teléfono es obligatorio' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.textInput}
                        placeholder="Teléfono"
                        keyboardType="phone-pad"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="telefono"
                defaultValue=""
            />
            {errors.telefono && <Text style={styles.errorText}>{errors.telefono.message}</Text>}

            {/* Botón para seleccionar imagen */}
            <Text style={styles.label}>Imagen de Perfil</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
                {selectedImageUri || userData?.url_imagen ? (
                    <Image
                        source={{ uri: selectedImageUri || userData?.url_imagen }}
                        style={styles.image}
                    />
                ) : (
                    <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
                )}
            </TouchableOpacity>

            {/* Botón de Actualización */}
            <ButtonCustom
                title={uploading ? 'Actualizando...' : 'Actualizar Perfil'}
                onPress={handleSubmit(onSubmit)}
                backgroundColor="#6200EE"
                textColor="#fff"
                borderRadius={30}
                disabled={uploading} // Ahora puedes usar 'disabled'
                loading={uploading}   // Opcional: Mostrar indicador de carga
            />
        </ScrollView>
    );
};

export default EditPerfil;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginTop: 15,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#6200EE',
        padding: 10,
        width: '100%',
        marginTop: 5,
        borderRadius: 10,
    },
    errorText: {
        color: 'red',
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginTop: 5,
    },
    imagePicker: {
        marginTop: 20,
        marginBottom: 20,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imagePickerText: {
        color: '#6200EE',
        fontSize: 16,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
