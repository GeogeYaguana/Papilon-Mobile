import React from 'react';
import { Image, StyleSheet, ImageStyle, View, ViewStyle } from 'react-native';

// Definición de las propiedades del componente
interface ResponsiveImageProps {
  source: { uri: string } | number; // Fuente de la imagen
  width: number; // Ancho deseado de la imagen
  height: number; // Alto deseado de la imagen
  borderRadius?: number; // Radio opcional para esquinas redondeadas
  containerStyle?: ViewStyle; // Estilo opcional para el contenedor
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  source,
  width,
  height,
  borderRadius = 0,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={source}
        style={[{ width, height, borderRadius }, styles.image]}
        resizeMode="cover" // Cambiar según el contexto
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    // Estilo básico, sobrescrito por las propiedades dinámicas
  },
});

export default ResponsiveImage;
