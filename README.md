<div align="center">

# 🏛️ InnovateIQ
### Institutional Innovation Excellence & Performance Intelligence Platform
**Ministry of AYUSH · Government of India**

[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Connected-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![Express.js](https://img.shields.io/badge/Express.js-4.21.2-000000?logo=express&logoColor=white)](https://expressjs.com/)

---

</div>

## 📌 Executive Overview

**InnovateIQ** is a centralized, enterprise-grade institutional intelligence portal engineered for educational and research institutes under the **Ministry of AYUSH, Government of India**. 

The platform measures, tracks, verifies, and calculates real-time **Weighted Innovation Excellence Indicators (0–100 Composite Score)** across 8 core academic and entrepreneurial verticals, eliminating data silos between departments, institutional administration, and ministerial governance.

---

## ✨ Key Capabilities & Features

- 🎯 **Autonomous Composite Indicator Engine:** Multi-indicator weighted scoring algorithm calculating real-time institutional targets, actuals, achievement ratios, and gap analytics.
- 🔓 **Free Instant Access & Email Data Persistence:** Login-free access flow supporting role-based entry (*Student, Faculty, Researcher, Entrepreneur/Startup, Institution Admin, Reviewer*) with persistent data recovery linked to Email ID.
- 🔬 **8 Connected Innovation Modules:**
  1. **Innovation Projects:** Interdisciplinary R&D, clinical devices, and AI diagnostics.
  2. **Research Publications:** Peer-reviewed journals (*SCI, Scopus, UGC-CARE, PubMed*).
  3. **Intellectual Property (IPR):** Indian & International Patents filed, published, and granted.
  4. **Research Grants:** Extramural sanctioned funding from government (*Ministry of AYUSH, ICMR, DST, DBT*) and industry.
  5. **Incubated Startups:** Student and faculty spin-offs, incubators, seed funding, and commercialization.
  6. **Competitions & Hackathons:** Smart India Hackathons, ideathons, and national awards won.
  7. **Institutional Honors & Awards:** National/international young scientist and research accolades.
  8. **Events & Ideathons:** Workshops, bootcamps, and ecosystem engagement metrics.
- 🛡️ **Peer Review & Verification Queue:** Dual-stage verification workflow allowing audit officers to examine DOIs, patent application numbers, and approve or request corrections.
- 📜 **PDF Certificate Generator:** Instant generation of verifiable digital PDF certificates with unique certificate IDs and authorized signatures.
- 📊 **Executive Analytics & Reporting:** Comprehensive visual dashboards powered by Recharts with CSV/PDF exports.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React 19 & TypeScript 5.7
- **Build Tool:** Vite 6.1
- **Styling:** Tailwind CSS v4 & Lucide Icons
- **Data Visualization:** Recharts
- **PDF & Export Services:** jsPDF, html2canvas, CSV exporter

### **Backend & Database**
- **Runtime Environment:** Node.js & Express.js
- **Cloud Database:** MongoDB Atlas (Mongoose ORM)
- **API Architecture:** RESTful Endpoints (`/api/state`, `/api/records`, `/api/health`)

---

## 📐 System Architecture

```mermaid
flowchart TD
    A[Client User Browser] -->|HTTP / React 19| B[InnovateIQ Frontend]
    B -->|Local State & Persistence| C[DatabaseService / localStorage]
    B -->|REST API Sync| D[Express.js Server :5000]
    D -->|Mongoose ORM| E[MongoDB Atlas Cloud Cluster]
    
    subgraph Data Flow
        E -->|Collection Collections| F[(Users, Projects, Patents, Publications, Grants, Indicators, AuditLogs)]
    end
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** `v18.0.0` or higher
- **Package Manager:** `npm` or `bun`

### 2. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Pradyumansharma444/InnovateIQ.git

# Navigate into project directory
cd InnovateIQ

# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory (or use the included `.env`):

```env
# MongoDB Atlas Configuration
MONGODB_USERNAME="pradyumansharma104_db_user"
MONGODB_PASSWORD="EqOXcmqEhBf56M1X"
MONGODB_URI="mongodb+srv://pradyumansharma104_db_user:EqOXcmqEhBf56M1X@cluster0.qovz0dg.mongodb.net/innovateiq?retryWrites=true&w=majority"

# Server Port
PORT=5000
```

### 4. Database Seeding

To seed MongoDB Atlas with initial demonstration data:

```bash
npm run db:seed
```

### 5. Running the Application

```bash
# Start the Express MongoDB Server (Port 5000)
npm run server

# In a separate terminal, start the Vite Frontend Dev Server (Port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend server & MongoDB Atlas health check |
| `GET` | `/api/state` | Fetches complete database collections state |
| `POST` | `/api/records/:collection` | Inserts a new record into specified collection |
| `PATCH` | `/api/records/:collection/:id` | Updates an existing record by ID |

---

## 📂 Project Structure

```
InnovateIQ/
├── database/
│   ├── models/           # Mongoose schemas (User, Project, Patent, etc.)
│   ├── connect.ts        # MongoDB Atlas Mongoose connection helper
│   ├── seed.ts           # Database seeding script
│   └── server.ts         # Express API server
├── src/
│   ├── components/       # UI Components (Navbar, Sidebar, Modals, Search)
│   ├── context/          # AuthContext & DataContext state management
│   ├── pages/            # Dashboard, Projects, Publications, Reports pages
│   ├── services/         # dbService, IndicatorEngine, ExportService
│   ├── types/            # TypeScript interfaces & types
│   ├── App.tsx           # Application root router
│   └── main.tsx          # React DOM entrypoint
├── .env                  # Environment variables
├── package.json          # Dependencies & scripts
└── vite.config.ts        # Vite configuration
```

---

## 👨‍💻 Author & Credits

- **Lead Developer:** **Pradyuman Sharma**
- **Developed For:** **Ministry of AYUSH · Government of India**
- **Repository:** [github.com/Pradyumansharma444/InnovateIQ](https://github.com/Pradyumansharma444/InnovateIQ)

---

<div align="center">
© 2026 InnovateIQ. All rights reserved. | Ministry of AYUSH · Government of India
</div>
