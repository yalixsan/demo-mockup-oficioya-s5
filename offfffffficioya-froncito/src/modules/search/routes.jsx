import RequiereRol from '../sesion/components/RequiereRol';
import BusquedaPage from './components/BusquedaPage';

export const routes = [
  {
    path: '/buscar',
    element: (
      <RequiereRol>
        <BusquedaPage />
      </RequiereRol>
    ),
  },
];

export const navLinks = [{ label: 'Buscar', to: '/buscar' }];
