import { useNavigate } from 'react-router-dom';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import { useSesion } from '../hooks/useSesion';
import { CUENTAS_DEMO, cerrarSesion, iniciarSesion } from '../services/sesionService';
import styles from './AccesoDemoPage.module.css';

function AccesoDemoPage() {
  const navigate = useNavigate();
  const { token } = useSesion();
  const sinTokens = CUENTAS_DEMO.some((cuenta) => !cuenta.token);

  function entrar(cuenta, destino = cuenta.destino) {
    iniciarSesion(cuenta.token);
    navigate(destino);
  }

  return (
    <section className={styles.pagina}>
      <div className={styles.encabezado}>
        <span className="eyebrow">Bienvenido a OficioYa</span>
        <h1>Tu espacio en OficioYa</h1>
        <p>Elige con qué rol quieres entrar a la demo.</p>
      </div>

      {sinTokens && <ErrorMessage error="Faltan los tokens de prueba. Ejecuta ejecutar-demo.sh." />}

      <div className={styles.cuentas}>
        {CUENTAS_DEMO.map((cuenta) => (
          <article key={cuenta.clave} className={`card ${styles.cuenta}`}>
            <h2>{cuenta.etiqueta}</h2>
            <p>{cuenta.descripcion}</p>
            <Button disabled={!cuenta.token} onClick={() => entrar(cuenta)}>
              Entrar
            </Button>
          </article>
        ))}
      </div>

      <div className={styles.extras}>
        <button
          type="button"
          className={styles.enlace}
          disabled={sinTokens}
          onClick={() => entrar(CUENTAS_DEMO[0], '/trabajadores/108')}
        >
          Ver el perfil de un trabajador pausado
        </button>
        {token && (
          <Button variant="secondary" onClick={cerrarSesion}>
            Cerrar sesión
          </Button>
        )}
      </div>
    </section>
  );
}

export default AccesoDemoPage;
