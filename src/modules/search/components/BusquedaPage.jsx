import { useState } from 'react';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import { useSesion } from '../../sesion/hooks/useSesion';
import { useBusqueda } from '../hooks/useBusqueda';
import BarraFiltros from './BarraFiltros';
import TarjetaTrabajador from './TarjetaTrabajador';
import styles from './BusquedaPage.module.css';

const LARGO_MINIMO = 3;
const LARGO_MAXIMO = 500;

function BusquedaPage() {
  const { token } = useSesion();
  const busqueda = useBusqueda(token);
  const [borrador, setBorrador] = useState('');
  const [aviso, setAviso] = useState(null);

  function enviar(evento) {
    evento.preventDefault();
    const descripcion = borrador.trim();
    if (descripcion.length < LARGO_MINIMO) {
      setAviso(`Describe el servicio con al menos ${LARGO_MINIMO} caracteres.`);
      return;
    }
    setAviso(null);
    busqueda.buscarTexto(descripcion);
  }

  function elegirOficio(id) {
    setBorrador('');
    setAviso(null);
    busqueda.elegirOficio(id);
  }

  return (
    <section className={styles.pagina}>
      <div>
        <span className="eyebrow">Encuentra profesionales</span>
        <h1 className={styles.titulo}>Tu casa, en buenas manos.</h1>
      </div>

      <form className={styles.buscador} onSubmit={enviar}>
        <input
          id="texto-busqueda"
          aria-label="Describe lo que necesitas"
          maxLength={LARGO_MAXIMO}
          onChange={(evento) => setBorrador(evento.target.value)}
          placeholder="¿Qué necesitas reparar hoy?"
          value={borrador}
        />
        <Button type="submit">Buscar</Button>
      </form>
      <ErrorMessage error={aviso} />

      <BarraFiltros
        filtros={busqueda.filtros}
        oficioId={busqueda.texto === null ? busqueda.oficioId : ''}
        oficios={busqueda.oficios}
        alCambiarFiltro={busqueda.cambiarFiltro}
        alElegirOficio={elegirOficio}
      />

      <Resultados busqueda={busqueda} />
    </section>
  );
}

function Resultados({ busqueda }) {
  const { cargando, error, oficioId, oficios, reintentar, resultado, texto } = busqueda;

  if (error) {
    return (
      <div className={styles.estado}>
        <ErrorMessage error={error} />
        <Button variant="secondary" onClick={reintentar}>
          Reintentar
        </Button>
      </div>
    );
  }
  if (cargando) {
    return <p className={styles.estado}>Buscando profesionales…</p>;
  }
  if (resultado.estado === 'REQUIERE_MAS_DETALLE' || resultado.estado === 'ERROR') {
    return <p className={styles.estado}>{resultado.mensaje}</p>;
  }

  const oficio = oficios.find((item) => item.id === oficioId)?.nombre;
  const titulo = texto === null
    ? `Profesionales de ${oficio}`
    : `Sugerencias de ${resultado.oficioIdentificado}`;

  return (
    <div className={styles.resultados}>
      <div className={styles.resumen}>
        <h2>{titulo}</h2>
        <span>{resultado.total} resultados</span>
      </div>
      {resultado.resultados.length === 0 ? (
        <p className={styles.estado}>No hay trabajadores con estos filtros.</p>
      ) : (
        <div className={styles.lista}>
          {resultado.resultados.map((trabajador) => (
            <TarjetaTrabajador key={trabajador.trabajadorId} trabajador={trabajador} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BusquedaPage;
