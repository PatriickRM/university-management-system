# Build
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar archivos de configuración de Maven
COPY pom.xml .
COPY src ./src

# Construir el proyecto
RUN mvn clean package -DskipTests

# Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiar el JAR
COPY --from=build /app/target/*.jar app.jar

# Exponer el puerto
EXPOSE 8080

# Variables de entorno
ENV SPRING_PROFILES_ACTIVE=docker

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]