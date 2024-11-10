// src/Context/AuthContext.tsx

import React, { createContext } from 'react';

interface AuthState {
  id_usuario: string | null;
  tipo_usuario: string | null;
  token: string | null;
  setAuthState: (authState: Partial<AuthState>) => void;
}

export const AuthContext = createContext<AuthState>({
  id_usuario: null,
  tipo_usuario: null,
  token: null,
  setAuthState: () => {},
});
