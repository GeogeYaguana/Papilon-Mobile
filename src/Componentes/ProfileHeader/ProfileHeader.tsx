import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface User {
  correo: string;
  fecha_registro: string;
  id_usuario: number;
  nombre: string;
  telefono: string;
  tipo_usuario: string;
  url_imagen: string;
  usuario_nombre: string;
}

interface ProfileHeaderProps {
  user: User;
  onEditProfile: () => void; // Función que no retorna nada
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditProfile }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user.url_imagen }}
        style={styles.profileImage}
      />
      <Text style={styles.userName}>{user.usuario_nombre}</Text>
      <Text style={styles.userEmail}>{user.correo}</Text>
      <TouchableOpacity onPress={onEditProfile} style={styles.editButton}>
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "gray",
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileHeader;
