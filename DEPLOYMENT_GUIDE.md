# CertForge AI - Production Deployment Guide (Azure)

This document provides a comprehensive guide for deploying the CertForge AI platform to a production environment on Microsoft Azure, ensuring enterprise-grade security, scalability, and performance.

---

## 1. Architecture Overview

CertForge AI is a cloud-native platform utilizing the following production stack:
- **Frontend:** React + Vite + Tailwind CSS (Deployable to Azure Static Web Apps or Vercel).
- **Backend:** FastAPI (Python 3.11) + LangGraph Agents (Deployable to Azure App Service or Azure Container Apps).
- **Database:** MongoDB Atlas (M10+ Dedicated Cluster recommended) via Beanie ODM.
- **WebSockets:** Integrated FastAPI WebSockets for real-time agent/dashboard sync.

> **Note:** The backend uses an asynchronous MongoDB architecture. If PostgreSQL is strictly required, a full SQLAlchemy migration sprint is necessary.

---

## 2. Infrastructure Setup (Azure)

### A. Deploying FastAPI Backend (Azure App Service)
1. Navigate to the **Azure Portal**.
2. Create a new **Web App** (App Service).
3. **Publish:** Code (or Docker Container).
4. **Runtime stack:** Python 3.11.
5. **Operating System:** Linux.
6. **Plan:** Standard S1 or Premium P1v2 (for WebSocket concurrency).

**Startup Command:**
In the Azure App Service configuration, set the Startup Command:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### B. Database (MongoDB Atlas)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create an **M10 Dedicated Cluster** (or higher for production).
3. Set the cloud provider to **Azure** and match your App Service region (e.g., `West US 3`).
4. In Network Access, allow IP access from your Azure App Service outbound IP addresses (or setup VNet peering).
5. Copy the connection string.

### C. Deploying Frontend (Azure Static Web Apps)
1. Navigate to the **Azure Portal**.
2. Create a new **Static Web App**.
3. **Source:** Connect your GitHub repository.
4. **Build Details:**
   - Build Presets: **React** (or Custom)
   - App location: `/frontend`
   - Api location: *(leave blank)*
   - Output location: `dist`
5. Click **Review + Create** to deploy the frontend.

---

## 3. Environment Variables Configuration

In Azure App Service > **Configuration** > **Application settings**, add the following environment variables (also found in `.env.example`):

| Variable | Value | Description |
| :--- | :--- | :--- |
| `PROJECT_NAME` | `CertForge AI Production` | Application Title |
| `API_V1_STR` | `/api/v1` | API Base Route |
| `BACKEND_CORS_ORIGINS`| `https://your-frontend-domain.com` | Restrict to your production UI |
| `MONGODB_URL` | `mongodb+srv://user:pass@cluster...` | Atlas Connection String |
| `MONGODB_DB_NAME` | `certforge_prod` | Database Name |
| `SECRET_KEY` | `your-secure-random-256-bit-key` | JWT Signing Key (Must rotate) |
| `GEMINI_API_KEY` | `AIzaSy...` | Required for Foundry IQ Embeddings |

### Frontend Environment Variables
In your Azure Static Web Apps environment configuration (or Vercel), add the following variable so the frontend can securely communicate with the backend:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-backend.azurewebsites.net` | Your production backend URL |

---

## 4. Security & Authentication Configuration

### Authentication (JWT)
The application relies on JWT tokens. **CRITICAL:** Before deploying to production, generate a secure `SECRET_KEY`:
```bash
openssl rand -hex 32
```
Paste the output into the `SECRET_KEY` variable in Azure.

### CORS
CORS is strictly managed via the `BACKEND_CORS_ORIGINS` variable. Ensure no wildcard (`*`) origins are used in production to prevent Cross-Site Request Forgery (CSRF).

---

## 5. Monitoring & Logging

### Azure Application Insights
To enable deep telemetry, telemetry tracking, and latency monitoring across the LangGraph agents:
1. Create an **Application Insights** resource in Azure.
2. Add the `APPLICATIONINSIGHTS_CONNECTION_STRING` to your backend Environment Variables.
3. The backend utilizes standard Python `logging`. App Service automatically captures stdout/stderr into Log Stream.

---

## 6. Health Checks & Verification

The backend exposes a high-fidelity health endpoint that verifies database connectivity.

**Health Endpoint:**
`GET https://your-backend.azurewebsites.net/api/v1/health/`

**Expected Response (200 OK):**
```json
{
  "status": "ok",
  "database": "connected",
  "message": "CertForge AI API is running."
}
```

If the database link is severed, the endpoint returns a `degraded` status, which Azure Load Balancers can use to cycle traffic.

---

## 7. Continuous Integration / Continuous Deployment (CI/CD)

A sample `azure-pipelines.yml` has been included in the repository root to automate the build and deployment process.

1. Connect your GitHub/Azure DevOps repository to Azure Pipelines.
2. Point it to the `azure-pipelines.yml` file.
3. Ensure the Azure Service Connection is configured to allow pushing to your App Service.

---

## 8. Post-Deployment Verification

1. Navigate to your frontend domain.
2. Register a new user (the first user should manually be upgraded to `root_admin` via MongoDB Compass).
3. Access `/system-settings` to verify the **System Health** pulse stream.
4. Execute a **Foundry IQ** query to test the Agent execution and WebSocket mesh payload delivery.
