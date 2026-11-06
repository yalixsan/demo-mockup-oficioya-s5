import { useState } from 'react';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import { MOTIVOS_REPORTE } from '../config';
import * as reputationService from '../services/reputationService';
import Modal from './Modal';
import styles from './Formulario.module.css';

function ReportarModal({ resena, token, alReportar, alCerrar }) {
  const [motivo, setMotivo] = useState(MOTIVOS_REPORTE[0].valor);
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await reputationService.reportarResena(resena.codigo, motivo, descripcion.trim(), token);
      alReportar();
    } catch (e) {
      setError(e.message);
      setEnviando(false);
    }
  }

  return (
    <Modal titulo="Reportar reseña" alCerrar={alCerrar}>
      <form className={styles.formulario} onSubmit={enviar}>
        <label>
          Motivo
          <select id="motivo-reporte" onChange={(e) => setMotivo(e.target.value)} value={motivo}>
            {MOTIVOS_REPORTE.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </label>
        <label>
          Descripción (opcional)
          <textarea
            id="descripcion-reporte"
            maxLength={500}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            value={descripcion}
          />
        </label>
        <ErrorMessage error={error} />
        <div className={styles.acciones}>
          <Button type="button" variant="secondary" onClick={alCerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={enviando}>
            Reportar
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ReportarModal;
