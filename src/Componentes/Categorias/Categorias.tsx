// src/components/containers/CategoryBarContainer.tsx
import React from 'react';
import CategoryBar from './Categorias_item';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from '../../Navigation/MainNavigation';
import { categories } from './categories';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Categoria">;
const CategoryBarContainer: React.FC = () => {
const navigation = useNavigation<NavigationProp>();
  const handleCategoryPress = (category: string) => {
    navigation.navigate("Categoria", { categoria: category }); // Pasa el `category` como string
  };

  return <CategoryBar categories={categories} onCategoryPress={handleCategoryPress} />;
};

export default CategoryBarContainer;
