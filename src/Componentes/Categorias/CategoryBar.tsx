// src/components/presentational/CategoryBar/CategoryBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { Category } from '../../types/types';
interface CategoryBarProps {
  categories: Category[];
  onCategoryPress: (category: string) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = React.memo(({ categories, onCategoryPress }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => onCategoryPress(item.id)}
            accessible={true}
            accessibilityLabel={`Categoría ${item.title}`}
          >
            {item.icon.startsWith('http') ? (
              // Si `icon` es una URL, usa una imagen
              <Image source={{ uri: item.icon }} style={styles.iconImage} />
            ) : (
              // Si `icon` es un emoji u otro texto, muestra un Text
              <Text style={styles.icon}>{item.icon}</Text>
            )}
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  categoryButton: {
    marginRight: 12,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#6200ee',
    borderRadius: 20,
  },
  icon: {
    fontSize: 24, // Tamaño del emoji
  },
  iconImage: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
});

export default CategoryBar;
