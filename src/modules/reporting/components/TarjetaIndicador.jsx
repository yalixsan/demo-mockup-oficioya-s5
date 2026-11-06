import styles from './TarjetaIndicador.module.css';

function TarjetaIndicador({ indicador }) {
  const { detalle, nombre, valor, variacionPorcentual: variacion } = indicador;

  return (
    <article className={`card ${styles.tarjeta}`}>
      <p>{nombre}</p>
      <div className={styles.valor}>
        <strong>{valor.toLocaleString('es-CO')}</strong>
        {variacion != null && (
          <span className={variacion >= 0 ? styles.sube : styles.baja}>
            {variacion >= 0 ? '+' : ''}
            {variacion.toLocaleString('es-CO', { maximumFractionDigits: 1 })} %
          </span>
        )}
      </div>
      {detalle && <small>{detalle}</small>}
    </article>
  );
}

export default TarjetaIndicador;
