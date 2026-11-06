# front-react-s5

Parte del frontend del Squad 5 (Search, Reputation y Reporting), en React. Se trabaja fuera del repositorio general `OficioYa-Front`, pero con su misma base y sus reglas, para pasar luego los módulos.

## Módulos

| Módulo | Rutas | Qué hace |
|---|---|---|
| `search` | `/buscar` | Búsqueda por categoría y en lenguaje natural, con filtros combinados |
| `reputation` | `/mis-servicios`, `/trabajadores/:id` | Calificar, ver reputación y reseñas, reportar una reseña |
| `reporting` | `/admin/reportes` | Indicadores, gráfico por día y exportación a CSV |
| `sesion` | `/demo` | Acceso de demo por rol. Se reemplaza cuando exista el login de Identity |

Todas las pantallas son responsive.

## Ejecutar la demo

Se necesita Docker, Node y compilar antes los tres servicios (`./mvnw package` en cada carpeta). En Windows, usa Git Bash:

```bash
bash ejecutar-demo.sh
```

El script levanta los servicios en Docker, crea `.env.local` con tokens de prueba de 24 horas y abre Vite en `http://localhost:5173/demo`. Al cerrarlo con `Ctrl+C`, ejecuta `bash ejecutar-demo.sh detener` si los servicios siguen arriba.

## Límites de la demo

- **Sin login real:** se entra eligiendo un rol.
- **Sin Orchestrator:** `vite.config.js` envía cada ruta directo a su servicio.
- **Datos simulados:** Search y Reporting usan el perfil `demo`. Lo que pertenece a otros dominios está en los archivos `config.js` de cada módulo.

## Otros comandos

```bash
npm run lint
npm run build
```
