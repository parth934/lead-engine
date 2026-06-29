# Step 1: Use an official Maven image to build the Java JAR
FROM maven:3.9.6-eclipse-temurin-22 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Step 2: Use a lightweight Java runtime image to actually run the app
FROM eclipse-temurin:22-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/lead-engine-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]