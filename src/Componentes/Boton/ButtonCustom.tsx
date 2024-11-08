import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';

type ButtonCustomProps = {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  padding?: number;
  borderRadius?: number;
  fontSize?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const { width } = Dimensions.get('window');

const ButtonCustom: React.FC<ButtonCustomProps> = ({
  title,
  onPress,
  backgroundColor = '#F26538',
  textColor = '#fff',
  padding = 15,
  borderRadius = 10,
  fontSize = 16,
  style,
  textStyle,
}) => {
  // Ajustar el tamaño de la fuente según el ancho de la pantalla
  const adjustedFontSize = fontSize * (width / 375); // Aquí '375' es el ancho del iPhone 11 como referencia

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, padding, borderRadius },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: textColor, fontSize: adjustedFontSize }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    marginVertical: 10,
    width: "30%", 
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default ButtonCustom;
