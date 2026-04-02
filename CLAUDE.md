# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `backend/` directory:

```bash
# Build
./gradlew build

# Run (uses the `local` Spring profile by default)
./gradlew bootRun

# Run all tests
./gradlew test

# Run a single test class
./gradlew test --tests "com.sychoi.backend.ClassName"

# Clean build artifacts
./gradlew clean
```

## Architecture

Spring Boot 3.3.5 / Java 17 backend. No frontend is included in this repo (frontend is expected at `http://localhost:5173`).

**Layer flow:** Controller → Service → Repository → MongoDB (Spring Data)

**Package structure** under `com.sychoi.backend`:
- `common/` — cross-cutting concerns: `config/` (S3, Security), `exception/` (GlobalExceptionHandler, CustomException), `s3/` (S3Service), `security/` (JwtProvider, JwtAuthenticationFilter)
- `user/` — full implementation: registration, login, JWT issuance
- `photo/` — partially stubbed; only `PhotoController` exists with a presigned-URL endpoint; domain/dto/repository/service are empty

**Auth flow:** Stateless JWT. `/auth/signup` and `/auth/login` return tokens. Subsequent requests send `Authorization: Bearer <token>`. Access tokens expire in 15 min, refresh tokens in 7 days.

**S3 upload flow:** Client calls `GET /photos/presigned-url` → backend generates a 10-minute S3 presigned URL → client uploads the file directly to S3.

**Security rules:**
- Public: `/auth/**`, `/photos/presigned-url`, `/swagger-ui/**`, `/v3/api-docs/**`
- `HOST` role required: `/host/**`
- `USER` role required: `/user/**`
- All other routes require authentication

## Configuration

Active Spring profile is `local`, which reads `application-local.yml` (git-ignored). Required environment variables / local config values:

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | HMAC signing secret |
| `AWS_REGION` | S3 region (default: `ap-northeast-2`) |
| `AWS_ACCESS_KEY` | AWS access key |
| `AWS_SECRET_KEY` | AWS secret key |
| `S3_BUCKET` | S3 bucket name |
| `APP_BASE_URL` | Frontend origin for CORS (default: `http://localhost:5173`) |

Swagger UI is available at `http://localhost:8080/swagger-ui/index.html` when the app is running.
