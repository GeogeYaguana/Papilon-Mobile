// src/components/presentational/CategoryBar/CategoryBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
export interface Category {
    id: string;
    title: string;
    icon: string; // Emoji icon
  }
  
interface CategoryBarProps {
  categories: Category[];
  onCategoryPress: (category: string) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ categories, onCategoryPress }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => onCategoryPress(item.title)}
            accessible={true}
            accessibilityLabel={`Categoría ${item.title}`}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'lightblue', // Fondo temporal
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
  title: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
});

export default CategoryBar;
