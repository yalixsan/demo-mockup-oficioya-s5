import { Navigate } from 'react-router-dom';
import ErrorMessage from '../../core/components/ErrorMessage';
import { useSesion } from '../hooks/useSesion';

function RequiereRol({ roles, children }) {
  const { token, rol } = useSesion();

  if (!token) {
    return <Navigate to="/demo" replace />;
  }
  if (roles && !roles.includes(rol)) {
    return <ErrorMessage error="No tienes permiso para ver esta página." />;
  }
  return children;
}

export default RequiereRol;
