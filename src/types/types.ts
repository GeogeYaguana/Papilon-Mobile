// src/types/types.ts

// Interfaz según la respuesta del backend
export interface BackendCategory {
    id_categoria: number;
    nombre: string;
    descripcion?: string;
    url_img?: string;
  }
  
  // Interfaz utilizada en el frontend
  export interface Category {
    id: string;
    title: string;
    icon: string;
    description?: string;
  }
  
  // Interfaz para el Producto
export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  descuento: string;
  disponibilidad: boolean;
  fecha_creacion: string;
  foto_url: string;
  id_categoria: number;
  id_local: number;
  precio: string;
  puntos_necesario: number;
}
// src/types/types.ts

// Interface para la información del Local en el Canje
interface LocalInfo {
  id_local: number;
  nombre_local: string;
  direccion: string;
}

// Interface para la información del Producto en el Canje
interface ProductoInfo {
  id_producto: number;
  nombre: string;
  puntos_necesario: number;
}

// Interface para cada Canje
export interface Canje {
  id_canje: number;
  id_cliente: number;
  id_local: number;
  estado: string;
  fecha: string;
  puntos_utilizados: number;
  local: {
    id_local: number;
    nombre_local: string;
    direccion: string;
  };
  detalles: DetalleCanje[]; // Agregamos el arreglo de detalles
}

// Interface para la respuesta del endpoint de canjes
export interface CanjesResponse {
  canjes: Canje[];
}
// src/types/types.ts
// Interface para Detalles del Canje
export interface DetalleCanje {
  id_detalle_canje: number;
  id_producto: number;
  cantidad: number;
  puntos_totales: number;
  valor: string;
  fecha_creacion: string;
  producto: {
    id_producto: number;
    nombre: string;
    puntos_necesario: number;
  };
}
export interface User {
  id_usuario: number;
  usuario_nombre: string;
  nombre: string;
  correo: string;
  telefono: string;
  tipo_usuario: string;
  url_imagen: string;
  fecha_registro: string;
  puntos: number;
}
