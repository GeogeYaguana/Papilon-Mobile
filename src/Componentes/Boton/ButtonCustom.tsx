// src/Componentes/Boton/ButtonCustom.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

type ButtonCustomProps = {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
};

const ButtonCustom: React.FC<ButtonCustomProps> = ({
    title,
    onPress,
    backgroundColor = '#6200EE',
    textColor = '#fff',
    borderRadius = 30,
    disabled = false,
    loading = false,
    style,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.button,
                {
                    backgroundColor: disabled ? '#A5A5A5' : backgroundColor,
                    borderRadius: borderRadius,
                },
                style,
            ]}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator size="small" color={textColor} />
            ) : (
                <Text style={[styles.text, { color: textColor }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        // Sombra para iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Sombra para Android
        elevation: 5,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ButtonCustom;
