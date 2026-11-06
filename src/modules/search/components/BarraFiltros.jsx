import { BARRIOS, CALIFICACIONES, DIAS } from '../config';
import styles from './BarraFiltros.module.css';

function clase(activo) {
  return activo ? `${styles.chip} ${styles.activo}` : styles.chip;
}

function BarraFiltros({ filtros, oficioId, oficios, alCambiarFiltro, alElegirOficio }) {
  const actualizar = (nombre) => (evento) => alCambiarFiltro(nombre, evento.target.value);

  return (
    <div className={styles.barra}>
      <button
        type="button"
        aria-pressed={filtros.soloDisponibleAhora}
        className={clase(filtros.soloDisponibleAhora)}
        onClick={() => alCambiarFiltro('soloDisponibleAhora', !filtros.soloDisponibleAhora)}
      >
        Disponible ahora
      </button>

      <select
        id="filtro-categoria"
        aria-label="Categoría"
        className={clase(oficioId !== '')}
        onChange={(evento) => alElegirOficio(Number(evento.target.value))}
        value={oficioId ?? ''}
      >
        {oficioId === '' && <option value="">Categoría</option>}
        {oficios.map((oficio) => (
          <option key={oficio.id} value={oficio.id}>
            {oficio.nombre}
          </option>
        ))}
      </select>

      <select
        id="filtro-zona"
        aria-label="Zona"
        className={clase(filtros.barrioIds !== '')}
        onChange={actualizar('barrioIds')}
        value={filtros.barrioIds}
      >
        <option value="">Zona</option>
        {BARRIOS.map((barrio) => (
          <option key={barrio.id} value={barrio.id}>
            {barrio.nombre}
          </option>
        ))}
      </select>

      <input
        id="filtro-precio-minimo"
        aria-label="Precio mínimo"
        className={`${clase(filtros.precioMinimo !== '')} ${styles.precio}`}
        min="0"
        onChange={actualizar('precioMinimo')}
        placeholder="Precio desde"
        type="number"
        value={filtros.precioMinimo}
      />
      <input
        id="filtro-precio-maximo"
        aria-label="Precio máximo"
        className={`${clase(filtros.precioMaximo !== '')} ${styles.precio}`}
        min="0"
        onChange={actualizar('precioMaximo')}
        placeholder="Precio hasta"
        type="number"
        value={filtros.precioMaximo}
      />

      <select
        id="filtro-dia"
        aria-label="Día"
        className={clase(filtros.diaSemana !== '')}
        onChange={actualizar('diaSemana')}
        value={filtros.diaSemana}
      >
        <option value="">Día</option>
        {DIAS.map((dia) => (
          <option key={dia.valor} value={dia.valor}>
            {dia.nombre}
          </option>
        ))}
      </select>

      <select
        id="filtro-calificacion"
        aria-label="Calificación mínima"
        className={clase(filtros.calificacionMinima !== '')}
        onChange={actualizar('calificacionMinima')}
        value={filtros.calificacionMinima}
      >
        <option value="">Calificación</option>
        {CALIFICACIONES.map((calificacion) => (
          <option key={calificacion} value={calificacion}>
            Desde {calificacion.toLocaleString('es-CO', { minimumFractionDigits: 1 })}
          </option>
        ))}
      </select>
    </div>
  );
}

export default BarraFiltros;
