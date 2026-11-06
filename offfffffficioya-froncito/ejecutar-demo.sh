#!/usr/bin/env bash
# Levanta Search, Reputation (con PostgreSQL y datos de prueba) y Reporting en Docker, y abre el frontend con Vite.
# Requisitos: Docker, Node y haber compilado los tres servicios (./mvnw package en cada uno).
#
# Uso, desde front-react-s5 (en Windows, con Git Bash):
#   bash ejecutar-demo.sh             Levanta los servicios y abre el frontend.
#   bash ejecutar-demo.sh servicios   Solo levanta los servicios.
#   bash ejecutar-demo.sh detener     Detiene los servicios y borra los datos de la demo.
cd "$(dirname "$0")" || exit 1
RAIZ="$(cd .. && (pwd -W 2>/dev/null || pwd))"
RED=oy-react-red
SECRETO=cambiar-este-secreto-de-desarrollo-de-al-menos-32-bytes
export MSYS_NO_PATHCONV=1

detener() {
  docker rm -f oy-react-search oy-react-reputation oy-react-reporting oy-react-pg >/dev/null 2>&1
  docker network rm "$RED" >/dev/null 2>&1
}

# Ejecuta un servicio con su JAR. Argumentos: nombre, puerto, perfiles y variables adicionales de Docker.
iniciar_servicio() {
  local nombre=$1 puerto=$2 perfiles=$3
  shift 3
  docker run -d --rm --name "oy-react-$nombre" --network "$RED" -p "$puerto:$puerto" "$@" \
    -v "$RAIZ/oficioya-$nombre/target":/t eclipse-temurin:21-jre \
    sh -c "java -jar /t/oficioya-$nombre-*.jar --spring.profiles.active=$perfiles" >/dev/null
}

esperar_servicio() {
  for _ in $(seq 1 60); do
    docker logs "oy-react-$1" 2>&1 | grep -q "Started Oficioya" && { echo "$1: listo"; return; }
    sleep 2
  done
  echo "$1: NO ARRANCO"
}

base64url() {
  openssl base64 -A | tr '+/' '-_' | tr -d '='
}

# Token HS256 de prueba, igual al de las colecciones de Postman. Argumentos: sub y rol.
token() {
  local ahora cabecera cuerpo firma
  ahora=$(date +%s)
  cabecera=$(printf '{"alg":"HS256","typ":"JWT"}' | base64url)
  cuerpo=$(printf '{"sub":"%s","roles":["%s"],"iat":%s,"exp":%s}' "$1" "$2" "$ahora" "$((ahora + 86400))" | base64url)
  firma=$(printf '%s.%s' "$cabecera" "$cuerpo" | openssl dgst -sha256 -hmac "$SECRETO" -binary | base64url)
  printf '%s.%s.%s' "$cabecera" "$cuerpo" "$firma"
}

iniciar_servicios() {
  for nombre in search reputation reporting; do
    ls "../oficioya-$nombre/target/oficioya-$nombre-"*.jar >/dev/null 2>&1 || {
      echo "Falta compilar oficioya-$nombre: ejecuta ./mvnw package en esa carpeta."
      exit 1
    }
  done
  detener
  docker network create "$RED" >/dev/null
  docker run -d --rm --name oy-react-pg --network "$RED" -e POSTGRES_DB=oficioya_reputation \
    -e POSTGRES_USER=oficioya -e POSTGRES_PASSWORD=oficioya postgres:16 >/dev/null
  until docker exec oy-react-pg pg_isready -U oficioya -d oficioya_reputation >/dev/null 2>&1; do sleep 1; done
  sleep 2
  iniciar_servicio search 8081 demo
  iniciar_servicio reputation 8082 demo,datos-demo -e DB_URL=jdbc:postgresql://oy-react-pg:5432/oficioya_reputation
  iniciar_servicio reporting 8083 demo
  esperar_servicio search
  esperar_servicio reputation
  esperar_servicio reporting

  {
    echo "VITE_TOKEN_CONTRATANTE=$(token 201 ROLE_CONTRATANTE)"
    echo "VITE_TOKEN_TRABAJADOR=$(token 101 ROLE_TRABAJADOR)"
    echo "VITE_TOKEN_ADMINISTRADOR=$(token 1 ROLE_ADMINISTRADOR)"
  } > .env.local
}

case "$1" in
  detener) detener ;;
  servicios) iniciar_servicios ;;
  *)
    iniciar_servicios
    [ -d node_modules ] || npm install
    npm run dev
    detener
    ;;
esac
