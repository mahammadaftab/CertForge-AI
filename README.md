# CertForge AI

An Enterprise Certification Readiness & Workforce Intelligence Platform powered by Microsoft Foundry.

## Tech Stack

**Backend:**
- Python 3.11
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Alembic

**Frontend:**
- Next.js 15
- TypeScript
- Tailwind CSS
- ShadCN UI
- Framer Motion
- Recharts

**AI:**
- Microsoft Foundry
- LangGraph
- LangChain
- OpenAI / Azure OpenAI

## Project Architecture

CertForge AI is structured as a scalable monorepo comprising a modern Next.js 15 frontend and a highly concurrent Python FastAPI backend.
- The **Backend** is strictly divided into `core`, `db`, `api`, `schemas`, and `services` adhering to clean architecture.
- The **Frontend** uses Next.js App Router for server-side rendering (SSR) and client-side rich interactions.
- The **Database** is PostgreSQL with Alembic for robust schema migrations.
- The **Deployment** is containerized with Docker and Docker Compose for easy scaling and environment replication.

## Local Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11 (for local backend development)

### 1. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your actual API keys (OpenAI / Azure OpenAI).

### 2. Run with Docker Compose
The easiest way to run the entire stack locally:
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:8000/api/v1/openapi.json

### 3. Local Development (Without Docker)
**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Architecture Explanation
The backend enforces strong typing with Pydantic and relies on SQLAlchemy ORM for database queries. LangChain and LangGraph power complex AI orchestration directly integrated within the backend `services/ai_service.py` to provide rich intelligence. The frontend consumes these APIs securely and visualizes data using ShadCN and Recharts.
