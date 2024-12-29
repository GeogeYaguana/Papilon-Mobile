import React, { useContext, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  Text,
  ImageSourcePropType,
} from 'react-native';
import { useCliente } from '../../Hooks/useCliente';
import { AuthContext } from '../../context/AuthContext';
import { useClientInfo } from '../../Hooks/useClienteInfo';

interface HeaderProps {
  logoSource: ImageSourcePropType;
}

const Header: React.FC<HeaderProps> = ({ logoSource }) => {
  const { cliente, loading: clienteLoading, error: clienteError, fetchCliente } = useCliente();
  const { clienteInfo, loading: infoLoading, error: infoError, fetchClienteInfo } = useClientInfo();
  const { id_usuario } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id_usuario) {
          await fetchCliente(Number(id_usuario));
        }
      } catch (err) {
        console.error('Error fetching cliente:', err);
      }
    };
    fetchData();
  }, [fetchCliente, id_usuario]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        if (cliente) {
          await fetchClienteInfo(cliente);
        }
      } catch (err) {
        console.error('Error fetching cliente info:', err);
      }
    };
    fetchInfo();
  }, [cliente, fetchClienteInfo ]);

  if (clienteLoading || infoLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (clienteError || infoError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          Error: {clienteError || infoError}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.headerContainer}>
      <View style={styles.rowContainer}>
        <View style={styles.colContainer}>
          <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.colContainer}>
          {clienteInfo ? (
            <Text style={styles.puntosText}>Puntos: {clienteInfo.puntos}</Text>
          ) : (
            <Text style={styles.noDataText}>No se encontró información del cliente</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    paddingHorizontal: 10,
  },
  rowContainer: {
    flexDirection: 'row',           // Usa Flexbox en formato horizontal
    justifyContent: 'space-between',// Espacia las "columnas"
    alignItems: 'center',           // Centra verticalmente
  },
  colContainer: {
    flex: 1,                        // Cada "columna" ocupa el mismo espacio
    alignItems: 'center',           // Centra el contenido horizontalmente
  },
  logo: {
    width: 75,
    height: 75,
    marginBottom: 10,
  },
  puntosText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Header;
