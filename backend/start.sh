#!/bin/bash

echo "🚀 Iniciando aplicación en puerto ${PORT:-8080}..."

java \
  -Xmx512m \
  -Xms256m \
  -Dserver.port=$PORT \
  -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-secrets} \
  -jar "$JAR_FILE"