# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Gradle wrapper 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 의존성 다운로드 (캐시 활용)
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon || true

# 소스 복사 및 빌드
COPY src src
RUN ./gradlew bootJar --no-daemon

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# 빌드된 JAR 복사
COPY --from=build /app/build/libs/*.jar app.jar

# Render는 PORT 환경변수를 자동 설정
EXPOSE 8484

# Render: PORT를 server.port로 전달
CMD ["sh", "-c", "exec java -jar -Dserver.port=${PORT:-8484} app.jar"]
