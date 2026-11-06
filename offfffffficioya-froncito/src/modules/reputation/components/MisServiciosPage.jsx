import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../core/design-system/Button';
import { useSesion } from '../../sesion/hooks/useSesion';
import { SERVICIOS } from '../config';
import CalificarModal from './CalificarModal';
import styles from './MisServiciosPage.module.css';

// La lista es fija en la demo porque los servicios pertenecen a Service.
function MisServiciosPage() {
  const { token, rol } = useSesion();
  const [enCalificacion, setEnCalificacion] = useState(null);
  const [calificados, setCalificados] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  function alCalificar() {
    setCalificados((actuales) => [...actuales, enCalificacion.solicitudId]);
    setEnCalificacion(null);
    setMensaje('Gracias, tu calificación quedó registrada.');
  }

  return (
    <section className={styles.pagina}>
      <div>
        <span className="eyebrow">Historial reciente</span>
        <h1>Mis servicios</h1>
      </div>

      {mensaje && <p role="status" className={styles.mensaje}>{mensaje}</p>}

      <ul className={`card ${styles.lista}`}>
        {SERVICIOS[rol].map((servicio) => (
          <li key={servicio.solicitudId} className={styles.servicio}>
            <div className={styles.datos}>
              <strong>{servicio.titulo}</strong>
              <span>Con {servicio.contraparte}</span>
            </div>
            <div className={styles.acciones}>
              <span className={styles.estado}>Cumplida</span>
              {calificados.includes(servicio.solicitudId) ? (
                <Link to={`/trabajadores/${servicio.trabajadorId}`} className={styles.enlace}>
                  Ver perfil
                </Link>
              ) : (
                <Button onClick={() => setEnCalificacion(servicio)}>Calificar</Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {enCalificacion && (
        <CalificarModal
          servicio={enCalificacion}
          token={token}
          alCalificar={alCalificar}
          alCerrar={() => setEnCalificacion(null)}
        />
      )}
    </section>
  );
}

export default MisServiciosPage;
