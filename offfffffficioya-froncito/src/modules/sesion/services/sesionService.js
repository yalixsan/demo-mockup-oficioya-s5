// Sesión provisional de la demo. Con Identity (Squad 1), el token viene del login real.
const CLAVE_TOKEN = 'oficioya.token';

export const CUENTAS_DEMO = [
  {
    clave: 'contratante',
    etiqueta: 'Contratante',
    descripcion: 'Busca profesionales, califica servicios y reporta reseñas.',
    destino: '/buscar',
    token: import.meta.env.VITE_TOKEN_CONTRATANTE,
  },
  {
    clave: 'trabajador',
    etiqueta: 'Trabajador',
    descripcion: 'Consulta tu reputación y califica a tus clientes.',
    destino: '/mis-servicios',
    token: import.meta.env.VITE_TOKEN_TRABAJADOR,
  },
  {
    clave: 'administrador',
    etiqueta: 'Administrador',
    descripcion: 'Supervisa indicadores y exporta reportes.',
    destino: '/admin/reportes',
    token: import.meta.env.VITE_TOKEN_ADMINISTRADOR,
  },
];

const oyentes = new Set();

export function suscribir(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

export function obtenerToken() {
  try {
    return sessionStorage.getItem(CLAVE_TOKEN) ?? '';
  } catch {
    return '';
  }
}

function guardarToken(token) {
  try {
    if (token) {
      sessionStorage.setItem(CLAVE_TOKEN, token);
    } else {
      sessionStorage.removeItem(CLAVE_TOKEN);
    }
  } catch {
    // Sin almacenamiento disponible no hay sesión.
  }
  oyentes.forEach((oyente) => oyente());
}

export function iniciarSesion(token) {
  guardarToken(token);
}

export function cerrarSesion() {
  guardarToken('');
}

// Solo decide qué mostrar. La seguridad real la aplica el back.
export function leerRol(token) {
  try {
    const parte = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const datos = JSON.parse(atob(parte));
    const rol = datos.roles?.[0] ?? datos.role ?? '';
    return rol.replace('ROLE_', '');
  } catch {
    return '';
  }
}
