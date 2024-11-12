import storage from '@react-native-firebase/storage';
import { Alert } from 'react-native';

/**
 * Subir una imagen a Firebase Storage
 * @param imageUri URI de la imagen a subir
 * @param folder Carpeta de destino en Firebase Storage
 * @returns URL de descarga de la imagen subida
 */
export const uploadImageToFirebase = async (
  imageUri: string,
  folder: string = 'images'
): Promise<string | null> => {
  if (!imageUri) {
    Alert.alert('Error', 'No hay imagen seleccionada');
    return null;
  }

  const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
  const reference = storage().ref(`${folder}/${fileName}`);

  try {
    const task = reference.putFile(imageUri);

    task.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Progreso: ${progress}%`);
    });

    await task;

    // Obtener la URL de descarga
    const downloadUrl = await reference.getDownloadURL();
    return downloadUrl;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    Alert.alert('Error', 'No se pudo subir la imagen');
    return null;
  }
};
