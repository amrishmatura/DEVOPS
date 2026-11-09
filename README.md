# Comparative Study of Manual and Automated Software Deployment

A comparative engineering evaluation comparing **Manual Terminal Deployment** with a **Jenkins-based Automated CI/CD Pipeline** for a Node.js Express web service.

**GitHub Repository**: [https://github.com/amrishmatura/DEVOPS](https://github.com/amrishmatura/DEVOPS)

---

## 1. Project Overview

This project implements an empirical comparative study between manual software deployment and automated continuous delivery. Both methods deploy the identical Node.js & Express service to ensure parity and benchmark:
1. **Deployment Time** (Automated ~3s vs. manual terminal command execution)
2. **Human Effort** (Hands-off pipeline vs. active operator CLI inputs)
3. **Error Rate** (Deterministic pipeline vs. manual typos/omissions)
4. **Failure Frequency** (Repeatable pipeline environment vs. ad-hoc commands)
5. **Recovery Time** (Automated pipeline rerun vs. manual troubleshooting)

---

## 2. Project Structure

```text
E:\DEVOPS
├── Jenkinsfile                  # 3-Stage Declarative Pipeline (Install -> Deploy -> Verify)
├── README.md                    # Project Documentation & Architecture Guide
├── run_manual_deployment.bat    # Script executing manual deployment steps
├── run_automated_pipeline.bat   # Local 3-stage pipeline execution script
└── deployment-comparison/       # Application Root
    ├── server.js                # Express REST server exposing /health & telemetry APIs
    ├── package.json             # Node.js dependencies
    └── public/                  # Navy Blue & White Dashboard UI
        ├── index.html           # 5-Tab Operational Interface
        ├── css/style.css        # Minimalist navy blue & white theme
        └── js/
            ├── app.js           # Tab coordinator & action buttons
            ├── benchmark.js     # Loads 5 KPIs, comparison table, and audit trail
            └── live_status.js   # Live /health poller & deployment execution runners
```

---

## 3. How to Run

### Method A: Manual Deployment
1. Double-click or run:
   ```cmd
   .\run_manual_deployment.bat
   ```
2. Or execute step-by-step in your terminal:
   ```cmd
   cd deployment-comparison
   npm install
   node server.js
   curl http://localhost:3000/health
   ```
3. Open the Dashboard in your browser: `http://localhost:3000`

---

### Method B: Automated CI/CD Pipeline (Jenkins on Port 8090)
1. **Jenkins Server URL**:
   - Open in your browser: [http://localhost:8090](http://localhost:8090)
2. **Job Configuration**:
   - Job Name: `Deployment-Automation`
   - Type: **Pipeline**
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: `https://github.com/amrishmatura/DEVOPS.git`
   - Branch Specifier: `*/main`
   - Script Path: `Jenkinsfile`
3. Click **Build Now** to execute the pipeline. Jenkins will pull the latest code from GitHub and run the 3 stages:
   - Stage 1: `Install Dependencies` (`npm install`)
   - Stage 2: `Deploy Application` (`start /B node server.js`)
   - Stage 3: `Verify Deployment` (`curl http://localhost:3000/health`)
   - Duration: **~3 seconds** (100% hands-free).

---

### Method C: Interactive Dashboard Runner
1. Open [http://localhost:3000](http://localhost:3000)
2. Go to **Tab 3: Live Deployment Runner**
3. Click **▶ Execute Manual Deployment** or **⚡ Execute Jenkins Pipeline (Real: ~3s)**
4. Inspect live console output, timer, and automatic entry into the deployment audit history log.

---

## 4. Key Endpoints
- `GET /` — Interactive Navy Blue & White operational dashboard
- `GET /health` — Health check endpoint returning `{"status":"Application is running!"}`
- `GET /api/system-status` — Real-time Node runtime diagnostics, memory usage, uptime
- `GET /api/comparison` — Operational comparison data & 5 core DevOps metrics
- `GET /api/deployments` — Deployment audit trail
