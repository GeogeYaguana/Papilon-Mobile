import React, { useState } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const Prueba: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Seleccionar imagen de la galería
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
          setImageUri(response.assets[0].uri || null);
        }
      }
    );
  };

  // Subir imagen a Firebase Storage
  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('No hay imagen seleccionada');
      return;
    }

    const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const reference = storage().ref(`images/${fileName}`);

    try {
      setUploading(true);

      // Subir archivo a Firebase Storage
      const task = reference.putFile(imageUri);

      task.on('state_changed', (snapshot) => {
        console.log(
          `Progreso: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`
        );
      });

      await task;

      // Obtener URL de descarga
      const downloadUrl = await reference.getDownloadURL();
      Alert.alert('Imagen subida exitosamente', `URL: ${downloadUrl}`);
      setImageUri(null);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      Alert.alert('Error', 'No se pudo subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200, marginBottom: 20 }}
        />
      )}
      <Button title="Seleccionar Imagen" onPress={selectImage} />
      <Button
        title={uploading ? 'Subiendo...' : 'Subir Imagen'}
        onPress={uploadImage}
        disabled={uploading}
      />
    </View>
  );
};

export default Prueba;
