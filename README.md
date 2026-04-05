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

### ❓ Why Presigned URL?

이 프로젝트는 파일 업로드 시 서버를 거치지 않고
클라이언트가 S3로 직접 업로드하는 구조를 사용합니다.

```text
Frontend → Backend → Presigned URL → S3 직접 업로드
```

#### 장점

* **서버 부하 감소**

  * 파일 데이터가 서버를 거치지 않음

* **빠른 업로드 속도**

  * 중간 단계 없이 S3로 바로 전송

* **비용 절감**

  * 서버 트래픽 및 리소스 사용 감소

* **확장성**

  * 다수 사용자가 동시에 업로드해도 안정적

* **보안**

  * Presigned URL은 만료 시간 및 업로드 권한 제한 가능

#### 비교

```text
❌ 기존 방식
Frontend → Backend → S3

✅ 현재 방식
Frontend → S3 (직접 업로드)
```

👉 서버는 파일을 처리하지 않고 **권한과 URL만 관리**합니다.


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

## 🌍 Deployment

외부 접속 주소:

```id="6c9v9p"
http://54.180.54.23/
```

* 해당 주소로 접속하면 프론트엔드 페이지가 로드됩니다.
* 프론트엔드는 내부적으로 백엔드 API와 통신합니다.

---

### 🔗 API Server

```id="8b7q0k"
http://54.180.54.23/api
```

* Nginx를 통해 `/api` 경로는 Spring Boot 서버로 프록시됩니다.


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

### Local

```bash
http://localhost:8080
```

### Production

```bash
http://54.180.54.23/api
```

* Nginx를 통해 `/api` → Spring Boot로 프록시됨

---

## 🔐 인증

```bash
Authorization: Bearer <token>
```


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

### Local
http://localhost:8080/swagger-ui/index.html

### Production
http://54.180.54.23/swagger-ui/index.html

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

- JWT 기반 Stateless 인증
- ROLE 기반 접근 제어 (USER / HOST)
- S3 Presigned URL 기반 Direct Upload 구조
- React SPA 라우팅 + Spring Forward 처리
- Nginx Reverse Proxy 기반 API 분리 (/api)
- GlobalExceptionHandler 기반 예외 처리
- DTO 분리 및 계층형 아키텍처 적용
- MongoDB 기반 NoSQL 데이터 설계

---

## 🤖 AI-Assisted Development (Claude Code)

이 프로젝트는 Claude Code를 활용하여 개발 생산성과 코드 품질을 향상시켰습니다.

### 🧠 Custom Skills & Rules 설계

프로젝트에 맞는 개발 규칙을 직접 정의하여 AI가 일관된 코드를 생성하도록 구성했습니다.

#### Backend Rules
- Controller → Service → Repository 계층 강제
- DTO(Request/Response) 분리
- GlobalExceptionHandler 기반 예외 처리
- Validation (@Valid) 필수 적용
- Controller에서 Repository 직접 접근 금지

#### API Design Rules
- RESTful URI 설계 (/events, /photos 등)
- 역할 기반 접근 제어 (USER / HOST)
- Presigned URL 기반 업로드 구조 유지 (파일 서버 처리 금지)

#### Frontend Rules
- React + TypeScript 기반 구조 유지
- API 호출 로직 분리 (service layer)
- 인증 상태 기반 라우팅 처리
- 에러 상태 (403 등) 공통 처리

---

### ⚙️ Custom Agent 활용

반복적인 개발 작업을 자동화하기 위해 역할별 AI 에이전트를 구성했습니다.

#### Backend Agent
- Spring Boot 코드 생성
- API 설계 및 DTO 자동 생성
- 인증 및 권한 로직 포함

#### Frontend Agent
- 페이지 및 컴포넌트 생성
- API 연동 코드 작성
- 상태 관리 및 라우팅 처리

---

### 🚀 효과

- 코드 일관성 유지 (규칙 기반 생성)
- 개발 속도 향상 (반복 작업 자동화)
- 아키텍처 안정성 확보 (계층 구조 강제)
- 휴먼 에러 감소 (검증 및 패턴 자동 적용)

---
