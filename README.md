# 📸 Photo Sharing Service

이벤트 기반 사진 공유 서비스

QR 코드로 접속한 사용자가 사진을 업로드하고,
이벤트 주최자는 전체 사진을 확인할 수 있습니다.

---

## 🏗️ Project Structure

```bash
photo-sharing/
├── backend/   # Spring Boot (API 서버)
├── frontend/  # React (클라이언트)
```

---

## 🚀 Tech Stack

### Backend

* Java 17
* Spring Boot
* MongoDB
* JWT Authentication
* AWS S3 (Presigned URL)

### Frontend

* React
* TypeScript
* Vite

---

## 🔐 Authentication

* JWT 기반 인증
* Access Token: 15분
* Refresh Token: 7일

```bash
Authorization: Bearer <token>
```

---

## ☁️ File Upload (핵심 구조)

```text
Frontend → Backend → Presigned URL 발급 → S3 직접 업로드
```

* 서버는 파일을 직접 처리하지 않음

---

## 🔒 Security

| 경로                      | 권한    |
| ----------------------- | ----- |
| `/auth/**`              | 공개    |
| `/photos/presigned-url` | 공개    |
| `/host/**`              | HOST  |
| `/user/**`              | USER  |
| 그 외                     | 인증 필요 |

---

## 🌐 Frontend

```bash
cd frontend
npm install
npm run dev
```

* 실행: http://localhost:5173

---

## ⚙️ Backend

```bash
cd backend

./gradlew bootRun
```

* 실행: http://localhost:8080

---

## 🔗 API 연결

* Base URL: http://localhost:8080
* 인증: JWT (Authorization 헤더)

---

## 🚫 권한 처리

* API 요청에서 403 발생 시 프론트에서 처리

```ts
if (error.response.status === 403) {
  window.location.href = "/403";
}
```

---

## 📄 Swagger

http://localhost:8080/swagger-ui/index.html

---

## ⚙️ Environment Variables

`backend/application-local.yml`

| 변수             | 설명         |
| -------------- | ---------- |
| MONGO_URI      | MongoDB 연결 |
| JWT_SECRET     | JWT 키      |
| AWS_REGION     | S3 리전      |
| AWS_ACCESS_KEY | AWS 키      |
| AWS_SECRET_KEY | AWS 시크릿    |
| S3_BUCKET      | 버킷 이름      |
| APP_BASE_URL   | 프론트 주소     |

---

## 📌 특징

* JWT 기반 인증
* S3 presigned URL 업로드 구조
* Clean Architecture (Controller → Service → Repository)
* MongoDB 사용

---
