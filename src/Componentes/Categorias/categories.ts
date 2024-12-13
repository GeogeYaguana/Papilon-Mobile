// src/data/categories.ts
export interface Category {
    id: string;
    title: string;
    icon: string; // Emoji icon
  }
  
export const categories: Category[] = [
  { id: '1', title: 'Comida', icon: '🍔' },
  { id: '2', title: 'Bebidas', icon: '🍹' },
  { id: '3', title: 'Farmacia', icon: '💊' },
  { id: '4', title: 'Supermercado', icon: '🛒' },
  { id: '5', title: 'Licores', icon: '🍾' },
  { id: '6', title: 'Mascotas', icon: '🐾' },
];
