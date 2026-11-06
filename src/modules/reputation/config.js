// Datos fijos de la demo que pertenecen a otros dominios (Worker y Service).
export const PERFILES = {
  101: { nombre: 'Carlos Martínez', oficio: 'Plomería' },
  102: { nombre: 'Lucía Fernández', oficio: 'Electricidad' },
  103: { nombre: 'Miguel Torres', oficio: 'Carpintería' },
  104: { nombre: 'Andrea Gómez', oficio: 'Plomería' },
  105: { nombre: 'Jorge Rodríguez', oficio: 'Técnico de electrodomésticos' },
  106: { nombre: 'Paula Ramírez', oficio: 'Profesor particular' },
  107: { nombre: 'Sofía Herrera', oficio: 'Cuidado de mascotas' },
  108: { nombre: 'Daniel Rojas', oficio: 'Plomería' },
};

export const SERVICIOS = {
  CONTRATANTE: [
    { solicitudId: 900001, titulo: 'Reparación de fuga en el lavamanos', contraparte: 'Carlos Martínez', trabajadorId: 101 },
    { solicitudId: 900002, titulo: 'Instalación de tomas eléctricas', contraparte: 'Lucía Fernández', trabajadorId: 102 },
  ],
  TRABAJADOR: [
    { solicitudId: 900001, titulo: 'Reparación de fuga en el lavamanos', contraparte: 'Ana Cárdenas', trabajadorId: 101 },
  ],
};

export const MOTIVOS_REPORTE = [
  { valor: 'FALSA', etiqueta: 'Es falsa' },
  { valor: 'INAPROPIADA', etiqueta: 'Es inapropiada' },
  { valor: 'OFENSIVA', etiqueta: 'Es ofensiva' },
  { valor: 'OTRO', etiqueta: 'Otro motivo' },
];
