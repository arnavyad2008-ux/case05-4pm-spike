# Synergy Thermal-Shield: Case 05 "The 4 PM Spike"
**Campus Thermal-Load Optimization & Dynamic Peak Mitigation System**  
**AI Synergy Hackathon 2026 | Round 1 Case Package**

---

## 🏛️ System Architecture Overview
The platform mitigates recurring weekday electricity-demand spikes occurring between **4:00 PM and 8:00 PM** across educational campus microgrids. By orchestrating:
1. **Predictive Time-Series Spike Forecasting**: Anticipating the magnitude of the 4-8 PM peak as rooftop solar collapses.
2. **Proxy Telemetry Normalization Engine**: Decomposing monthly legacy billing aggregates into pseudo-real-time operational baselines with $<1\%$ energy conservation error.
3. **Thermodynamic Chiller Pre-Cooling**: Utilizing surplus rooftop solar generation (**1:00 PM – 3:00 PM**) to store thermal energy in building mass, allowing chillers to float and coast during 4:00 PM – 8:00 PM.
4. **Automated Safety Ring-Fencing**: Programmatically isolating critical laboratories, biosafety cryogenic freezers, and HPC compute clusters from load shifting.
5. **Human-in-the-Loop Supervisory Console**: Mandatory review and veto authority with cryptographic SHA-256 audit logging.

```
case05-4pm-spike/
├── README.md                      # Architecture guide & quickstart
├── docs/
│   └── SRS.md                     # Complete Software Requirements Specification
├── backend/
│   ├── main.py                    # FastAPI production server with FR-01 to FR-05
│   ├── requirements.txt           # Python dependency manifest
│   └── test_main.py               # 8-suite automated pytest verification
├── frontend/
│   ├── package.json               # Next.js 14 App Router dependencies
│   ├── tsconfig.json              # TypeScript configuration
│   ├── tailwind.config.js         # Tailwind CSS styling config
│   ├── postcss.config.js          # PostCSS processor config
│   ├── next.config.mjs            # Next.js config with simulation headers
│   └── app/
│       ├── layout.tsx             # Root layout with dark theme
│       ├── globals.css            # Global CSS styles
│       └── page.tsx               # Interactive supervisory dashboard
└── notebooks/
    └── dataset_exploration.ipynb  # Interactive data exploration & validation
```

---

## ⚡ Regulatory Boundaries & Safety Protocols
- **Absolute Prohibition on Direct Hardware Actuation**: The platform operates as an advisory decision-support system. Direct automated tripping of electrical circuit breakers or unauthenticated setpoint actuation is strictly prohibited.
- **Mandatory Simulation Watermarking**: All API responses and dashboard surfaces include the watermark:  
  `[SIMULATED ADVISORY - NOT DIRECT ACTUATION]` and headers `X-Synergy-Simulation: True`.

---

## 🚀 Quickstart & Execution Guide

### 1. Backend Server (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
- API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`
- Health & Boundary Verification: `http://127.0.0.1:8000/health`

### 2. Running Automated Backend Tests
```bash
cd backend
python -m pytest test_main.py -v
```
All 8 verification tests validate:
- Boundary simulation headers (`X-Synergy-Simulation: True`)
- FR-01: Energy conservation drift $< 1.0\%$
- FR-02: Peak spike window detection (16:00 – 20:00)
- FR-03: Peak reduction $\ge 15.0\%$ under Thermal Drift Index $\le \pm 1.5^\circ\text{C}$
- FR-04: Automated ring-fencing for all 4 critical labs
- FR-05: Human approval / veto audit trail with SHA-256 integrity

### 3. Frontend Supervisory Console (Next.js App Router)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to access the interactive supervisory dashboard.

### 4. Jupyter Notebook Data Exploration
```bash
cd notebooks
jupyter notebook dataset_exploration.ipynb
```
