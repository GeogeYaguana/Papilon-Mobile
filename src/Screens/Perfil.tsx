import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/MainNavigation';
import { AuthContext } from '../context/AuthContext';

type PerfilProps = NativeStackScreenProps<RootStackParamList, 'Perfil'>;

const Perfil: React.FC<PerfilProps> = ({ route }) => {
  const { id_usuario, tipo_cliente, token } = useContext(AuthContext);
  const { userId } = route.params;

  return (
    <View>
  <Text style={styles.text}>ID Usuario: {id_usuario}</Text>
      <Text style={styles.text}>Tipo Cliente: {tipo_cliente}</Text>
      <Text style={styles.text}>Token: {token}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Perfil;

export default Perfil;
