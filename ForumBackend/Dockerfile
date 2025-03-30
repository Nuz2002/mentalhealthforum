# Use OpenJDK image
FROM eclipse-temurin:17-jdk as build

WORKDIR /app

# Copy source code
COPY . .

# Build the application using Gradle
RUN ./gradlew bootJar

# Use smaller image to run the app
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
