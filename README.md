# Comparative Study of Manual and Automated Software Deployment

**Course**: CSN-452 DevOps  
**Institution**: DIT University, Dehradun  
**Submitted by**: Hemant Sharma (SAP: 1000020376) & Sakshi Patel (SAP: 100020358)  
**Project Guide**: Mrs. Suchi Johari  
**GitHub Repository**: [https://github.com/amrishmatura/DEVOPS](https://github.com/amrishmatura/DEVOPS)

---

## 1. Project Overview

This project implements an empirical comparative study between **Manual Deployment** and **Automated CI/CD Deployment** using Jenkins. Both methods deploy the same Node.js & Express web service to ensure parity and compare:
1. **Deployment Time** (Local ~8.4s automated vs. manual command entry)
2. **Human Effort** (Hands-off pipeline vs. active operator CLI inputs)
3. **Error Rate** (Deterministic script vs. manual typos/omissions)
4. **Failure Frequency** (Standardized environment vs. ad-hoc commands)
5. **Recovery Time** (Automated pipeline rerun vs. manual debugging)

---

## 2. Project Structure

```text
E:\DEVOPS
├── Jenkinsfile                          # 3-Stage Declarative Pipeline (Install -> Deploy -> Verify)
├── README.md                            # Complete Project Documentation & Viva Guide
├── start_real_jenkins.bat               # Starts local Jenkins CI Server on port 8080
├── run_manual_deployment.bat            # Terminal script executing manual deployment steps
├── run_automated_pipeline.bat           # Local 3-stage pipeline execution script
├── 1000020376_Hemant_Sharma.pdf         # DIT University Project Report Reference
└── deployment-comparison/               # Application Root
    ├── server.js                        # Express server exposing /health, /api/system-status, /api/comparison
    ├── package.json                     # Node.js dependencies
    └── public/                          # Navy Blue & White Dashboard UI
        ├── index.html                   # 5-Tab Academic Interface
        ├── css/style.css                # Minimalist navy blue & white theme
        └── js/
            ├── app.js                   # Tab coordinator & action buttons
            ├── benchmark.js             # Renders 5 KPIs, Table 4.3, and audit history
            └── live_status.js           # Live /health poller & deployment execution runners
```

---

## 3. How to Run

### Method A: Manual Deployment
1. Double-click or run:
   ```cmd
   .\run_manual_deployment.bat
   ```
2. Or run manually step-by-step:
   ```cmd
   cd deployment-comparison
   npm install
   node server.js
   curl http://localhost:3000/health
   ```
3. Open Dashboard in your browser: `http://localhost:3000`

---

### Method B: Automated CI/CD Pipeline (Jenkins)
1. **Start Jenkins Server** (runs locally on port 8080):
   ```cmd
   .\start_real_jenkins.bat
   ```
   - Open: [http://localhost:8080](http://localhost:8080)
   - Initial Admin Password: `5f98dd96a25041a7af1bdb68de273725` (also stored in `~/.jenkins/secrets/initialAdminPassword`)
2. **Job Configuration**:
   - Job Name: `Deployment-Automation`
   - Type: **Pipeline**
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: `https://github.com/amrishmatura/DEVOPS.git`
   - Branch Specifier: `*/main`
   - Script Path: `Jenkinsfile`
3. Click **Build Now** to execute the pipeline. Build #3 runs in ~8.4 seconds.

---

### Method C: Interactive Dashboard Runner
1. Open [http://localhost:3000](http://localhost:3000)
2. Go to **Tab 3: Live Deployment Runner**
3. Click **▶ Execute Manual Deployment** or **⚡ Execute Jenkins Pipeline (Build #3)**
4. Watch the live console output, timer, and automatic entry into the deployment audit history log.

---

## 4. Key Endpoints
- `GET /` — Interactive Navy Blue & White academic dashboard
- `GET /health` — Health check endpoint returning `{"status":"Application is running!"}`
- `GET /api/system-status` — Real-time Node runtime diagnostics, memory usage, uptime
- `GET /api/comparison` — Table 4.3 data & 5 core DevOps metrics
- `GET /api/deployments` — Deployment audit trail
