import { useState } from 'react';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import { useSesion } from '../../sesion/hooks/useSesion';
import { useResumen } from '../hooks/useResumen';
import * as reportingService from '../services/reportingService';
import GraficoBarras from './GraficoBarras';
import TarjetaIndicador from './TarjetaIndicador';
import styles from './AdminReportesPage.module.css';

const INDICADORES = ['SERVICIOS_CUMPLIDOS', 'TRABAJADORES_PAUSADOS', 'RESENAS_REPORTADAS'];

function descargar(archivo, nombre) {
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}

function AdminReportesPage() {
  const { token } = useSesion();
  const { cargando, error, reporte, cambiarRango, reintentar } = useResumen(token);
  const [exportando, setExportando] = useState(false);
  const [errorExportar, setErrorExportar] = useState(null);

  async function exportar() {
    setExportando(true);
    setErrorExportar(null);
    try {
      const { desde, hasta } = reporte;
      const archivo = await reportingService.exportarCsv({ desde, hasta }, token);
      descargar(archivo, `reporte-general-${desde}-a-${hasta}.csv`);
    } catch (e) {
      setErrorExportar(e.message);
    } finally {
      setExportando(false);
    }
  }

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
  if (!reporte) {
    return <p className={styles.estado}>Cargando resumen…</p>;
  }

  const porDia = reporte.estadisticas.find((e) => e.tipo === 'SERVICIOS_CUMPLIDOS_POR_DIA');

  return (
    <section className={styles.pagina}>
      <div className={styles.encabezado}>
        <div>
          <span className="eyebrow">Administración</span>
          <h1>Resumen de la plataforma</h1>
          <p>Supervisa los servicios, el equipo y la calidad de la experiencia.</p>
        </div>
        <Button disabled={exportando} onClick={exportar}>
          Exportar reporte (.CSV)
        </Button>
      </div>
      <ErrorMessage error={errorExportar} />

      <div className={styles.periodo}>
        <label>
          Desde
          <input
            id="periodo-desde"
            max={reporte.hasta}
            onChange={(e) => e.target.value && cambiarRango({ desde: e.target.value, hasta: reporte.hasta })}
            type="date"
            value={reporte.desde}
          />
        </label>
        <label>
          Hasta
          <input
            id="periodo-hasta"
            min={reporte.desde}
            onChange={(e) => e.target.value && cambiarRango({ desde: reporte.desde, hasta: e.target.value })}
            type="date"
            value={reporte.hasta}
          />
        </label>
        <p>
          Comparado con {reporte.desdeComparacion} a {reporte.hastaComparacion}
          {cargando && ' · Actualizando…'}
        </p>
      </div>

      <div className={styles.indicadores}>
        {INDICADORES.map((tipo) => {
          const indicador = reporte.indicadores.find((item) => item.tipo === tipo);
          return indicador && <TarjetaIndicador key={tipo} indicador={indicador} />;
        })}
      </div>

      <div className={`card ${styles.grafico}`}>
        <span className="eyebrow">Desempeño de la plataforma</span>
        <h2>Servicios cumplidos por día</h2>
        {porDia?.puntos.length ? (
          <GraficoBarras puntos={porDia.puntos} />
        ) : (
          <p>No hay servicios en este periodo.</p>
        )}
      </div>
    </section>
  );
}

export default AdminReportesPage;
