# QubeLancer — Global Professional Services & Autonomous Marketplace

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-blue.svg)](#)
[![Python: 3.12+](https://img.shields.io/badge/Python-3.12%2B-blue.svg)](https://www.python.org/)
[![FastAPI: 0.115+](https://img.shields.io/badge/FastAPI-0.115%2B-green.svg)](https://fastapi.tiangolo.com/)
[![React: 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript: 5.x](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Database: PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Reverse Proxy: Caddy](https://img.shields.io/badge/Proxy-Caddy%202-brightgreen.svg)](https://caddyserver.com/)
[![Vercel: Ready](https://img.shields.io/badge/Vercel-Demo%20Ready-black.svg)](https://vercel.com/)

QubeLancer is a high-trust, responsive, global professional services marketplace connecting customers, enterprises, and startups with vetted independent consultants, developers, corporate attorneys, and AI specialists.

The platform provides complete end-to-end project lifecycles: discovering verified talent, conversational AI & voice project brief generation, bidding via structured proposals, executing milestone-based escrow contracts, dual-currency fiat settlement ($ USD marketplace view with ₹ INR Razorpay checkout at $1 = ₹84), deliverable submission, dispute resolution, and bilateral reviews.

---

## ⚡ Deployment Channels

- **Frontend Demo (Vercel):** Seamless client-side flow testing without requiring an active backend server. Built-in interactive mock data and fallbacks for projects, categories, vetted experts, and the QubeLancer AI Copilot.
- **Production (Hetzner Cloud + Namecheap):** Ubuntu 24.04 VPS with Docker Compose, FastAPI, PostgreSQL 16, Caddy automated Let's Encrypt SSL/TLS, and Namecheap DNS pointing to `qubelancer.com`. See [Hetzner + Namecheap Deployment Guide](docs/HETZNER_NAMECHEAP_DEPLOYMENT_GUIDE.md).

---

## 🏛 Architecture Overview

QubeLancer is engineered as a **modular monolith** with autonomous micro-workflows:

- **Backend:** Python 3.12+ with FastAPI, SQLAlchemy 2.0 (async/sync), Pydantic v2, and Alembic migrations.
- **Frontend:** React 19 with TypeScript, Vite, Tailwind CSS, TanStack Query, and Lucide icons.
- **AI Copilot & Voice Intake:** Integrated AI Assistant that converts conversational text or spoken speech into structured job briefs with automatic budget and timeline estimation.
- **Database:** PostgreSQL 16 with UUID v4 primary keys, strict foreign key constraints, and double-entry ledger auditing.
- **Storage:** S3-compatible private object storage with presigned short-lived URLs.
- **Proxy & SSL:** Caddy reverse proxy with automated HTTPS Let's Encrypt certificates.
- **Payments & Dual-Currency:** Marketplace listings rendered in **$ USD** with real-time conversion and settlement in **₹ INR** via Razorpay.
- **Future Ecosystem (BTQ & QUBEX):** Feature-flagged roadmap placeholders only (`btq_payments_enabled=false`, `qubex_benefits_enabled=false`). No active token balances, blockchain wallets, or speculative assets.

---

## 📁 Repository Structure

```text
bitqube-freelance/
├── .env.example               # Comprehensive environment template
├── .gitignore                 # Multi-stack git exclusions
├── README.md                  # Project overview & developer guide
├── docs/                      # Master technical documentation
│   ├── PRODUCT_REQUIREMENTS.md
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATABASE_DESIGN.md
│   ├── ER_DIAGRAM.md
│   ├── API_SPECIFICATION.md
│   ├── SECURITY_THREAT_MODEL.md
│   ├── DEPLOYMENT_RUNBOOK.md
│   ├── TEST_STRATEGY.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── PAYMENT_FLOW.md
│   ├── BACKUP_AND_RECOVERY.md
│   ├── OPERATIONS_RUNBOOK.md
│   └── CHANGELOG.md
├── backend/                   # FastAPI backend application
│   ├── app/
│   │   ├── main.py            # App entrypoint & middleware assembly
│   │   ├── core/              # Config, security, logging, exceptions
│   │   ├── db/                # Engine, base session, migration hooks
│   │   ├── models/            # SQLAlchemy 2.0 declarative models
│   │   ├── schemas/           # Pydantic v2 schemas
│   │   ├── repositories/      # Database query abstraction
│   │   ├── services/          # Business logic domains
│   │   ├── api/v1/            # Versioned API route endpoints
│   │   └── integrations/      # S3 storage & payment adapters
│   ├── migrations/            # Alembic schema migration versions
│   ├── tests/                 # Pytest test suites (unit, integration)
│   ├── pyproject.toml         # Python dependencies & tool configs (Ruff, Mypy)
│   └── Dockerfile             # Production backend container build
├── frontend/                  # React 19 + TypeScript frontend
│   ├── src/
│   │   ├── app/               # Providers, router configuration
│   │   ├── components/        # Reusable UI component library
│   │   ├── features/          # Domain-specific feature modules
│   │   ├── pages/             # Route page views (Public, Customer, Pro, Admin)
│   │   ├── api/               # TanStack Query hooks & Axios client
│   │   └── types/             # Shared TypeScript models
│   ├── tests/                 # Vitest component & hook tests
│   ├── package.json           # Frontend dependencies & scripts
│   ├── vite.config.ts         # Vite bundler configuration
│   ├── tailwind.config.js     # Tailwind CSS design system tokens
│   └── Dockerfile             # Production multi-stage static build
├── deploy/                    # Deployment & Infrastructure configs
│   ├── Caddyfile              # Caddy reverse proxy rules
│   ├── docker-compose.yml     # Local development orchestration
│   └── docker-compose.prod.yml# Production DigitalOcean Droplet orchestration
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Docker & Docker Compose** (Docker 24+, Compose v2)
- **Node.js** (v20 LTS or later) & **npm**
- **Python** (v3.12 or later)

### 2. Environment Setup
Copy the environment template and configure secrets:
```bash
cp .env.example .env
```

### 3. Start Development Services (PostgreSQL + Local MinIO Storage)
```bash
docker compose up -d postgres minio
```

### 4. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

pip install -e ".[dev]"
alembic upgrade head
python -m app.db.seed  # Seeds initial 15 professional categories
uvicorn app.main:app --reload --port 8000
```

### 5. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173` and proxy API calls to `http://localhost:8000`.

---

## 🧪 Testing Suite

### Backend Unit & Integration Tests
```bash
cd backend
pytest -v --cov=app tests/
```

### Frontend Tests
```bash
cd frontend
npm run test           # Vitest unit & component tests
npm run test:e2e       # Playwright end-to-end browser journeys
```

### Code Quality & Linting
```bash
# Backend linting & typing:
ruff check backend/
mypy backend/app/

# Frontend linting & typing:
npm --prefix frontend run lint
npm --prefix frontend run typecheck
```

---

## 📚 Documentation Directory

Detailed engineering specifications are available in the [`docs/`](file:///c:/Users/PathipatiKirankumar/personal/Projects/BITQUBE%20Freelance%20Website-2026/BITQUBE%20Freelance%20Website/docs) directory:
- [Product Requirements](file:///c:/Users/PathipatiKirankumar/personal/Projects/BITQUBE%20Freelance%20Website-2026/BITQUBE%20Freelance%20Website/docs/PRODUCT_REQUIREMENTS.md)
- [System Architecture](file:///c:/Users/PathipatiKirankumar/personal/Projects/BITQUBE%20Freelance%20Website-2026/BITQUBE%20Freelance%20Website/docs/SYSTEM_ARCHITECTURE.md)
- [Database Design](file:///c:/Users/PathipatiKirankumar/personal/Projects/BITQUBE%20Freelance%20Website-2026/BITQUBE%20Freelance%20Website/docs/DATABASE_DESIGN.md)
- [ER Diagram (Mermaid)](file:///c:/Users/PathipatiKirankumar/personal/Projects/BITQUBE%20Freelance%20Website-2026/BITQUBE%20Freelance%20Website/docs/ER_DIAGRAM.md)
- [API Specification](file:///c:/Users/PathipatiKirankumar/personal/Projects/BITQUBE%20Freelance%20Website-2026/BITQUBE%20Freelance%20Website/docs/API_SPECIFICATION.md)
- [Security Threat Model](file:///c:/Users/PathipatiKirankumar/personal/Projects/BITQUBE%20Freelance%20Website-2026/BITQUBE%20Freelance%20Website/docs/SECURITY_THREAT_MODEL.md)
- [Fiat Payment Flow](file:///c:/Users/PathipatiKirankumar/personal/Projects/BITQUBE%20Freelance%20Website-2026/BITQUBE%20Freelance%20Website/docs/PAYMENT_FLOW.md)
- [Deployment Runbook](file:///c:/Users/PathipatiKirankumar/personal/Projects/BITQUBE%20Freelance%20Website-2026/BITQUBE%20Freelance%20Website/docs/DEPLOYMENT_RUNBOOK.md)
- [Backup & Disaster Recovery](file:///c:/Users/PathipatiKirankumar/personal/Projects/BITQUBE%20Freelance%20Website-2026/BITQUBE%20Freelance%20Website/docs/BACKUP_AND_RECOVERY.md)
- [Operations Runbook](file:///c:/Users/PathipatiKirankumar/personal/Projects/BITQUBE%20Freelance%20Website-2026/BITQUBE%20Freelance%20Website/docs/OPERATIONS_RUNBOOK.md)
- [Test Strategy](file:///c:/Users/PathipatiKirankumar/personal/Projects/BITQUBE%20Freelance%20Website-2026/BITQUBE%20Freelance%20Website/docs/TEST_STRATEGY.md)
- [Implementation Plan](file:///c:/Users/PathipatiKirankumar/personal/Projects/BITQUBE%20Freelance%20Website-2026/BITQUBE%20Freelance%20Website/docs/IMPLEMENTATION_PLAN.md)
- [Changelog](file:///c:/Users/PathipatiKirankumar/personal/Projects/BITQUBE%20Freelance%20Website-2026/BITQUBE%20Freelance%20Website/docs/CHANGELOG.md)

---

## ⚖️ Governance & Compliance

- **Regulated Services Disclaimer:** Regulated activities (legal counsel, certified financial advisory, taxation, etc.) must be provided only by authorized professionals with verified credentials in their jurisdiction.
- **Fiat Currency Notice:** All monetary operations are processed in authorized sovereign fiat currencies via compliant, PCI-certified payment infrastructure.
- **Future Token Assets:** BTQ and QUBEX tokens are non-operational future roadmap placeholders. No token sale, smart contract interaction, or crypto asset settlement is conducted within this release.
