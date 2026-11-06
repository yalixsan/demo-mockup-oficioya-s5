import { useSyncExternalStore } from 'react';
import { leerRol, obtenerToken, suscribir } from '../services/sesionService';

export function useSesion() {
  const token = useSyncExternalStore(suscribir, obtenerToken);
  return { token, rol: leerRol(token) };
}
