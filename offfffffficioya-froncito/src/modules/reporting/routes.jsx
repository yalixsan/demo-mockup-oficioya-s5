import RequiereRol from '../sesion/components/RequiereRol';
import AdminReportesPage from './components/AdminReportesPage';

export const routes = [
  {
    path: '/admin/reportes',
    element: (
      <RequiereRol roles={['ADMINISTRADOR']}>
        <AdminReportesPage />
      </RequiereRol>
    ),
  },
];

export const navLinks = [{ label: 'Reportes', to: '/admin/reportes' }];
