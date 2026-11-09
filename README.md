# Comparative Study of Manual and Automated Software Deployment
### Course: CSN-452 (DevOps) • School of Computing, DIT University, Dehradun

A real-world practical project and comparative study demonstrating **Manual Software Deployment** versus **Jenkins-based Automated Software Deployment** for a Node.js & Express application.

---

## 📋 Project Summary

| Detail | Information |
| :--- | :--- |
| **Project Title** | Comparative Study of Manual and Automated Software Deployment |
| **Course Code** | CSN-452 (DevOps) |
| **Institution** | School of Computing, DIT University, Dehradun |
| **Guide** | Mrs. Suchi Johari |
| **Submitted By** | Hemant Sharma, Sakshi Patel |
| **Repository Name** | `deployment-comparison` |
| **Target Runtime** | Node.js & Express (Port: 3000) |
| **Health Check Endpoint** | `http://localhost:3000/health` $\rightarrow$ `{"status":"Application is running!"}` |
| **Jenkins Build Benchmark** | **Build #3**: Duration **8.4 seconds** (Status: **SUCCESS**) |

---

## 📂 Repository Structure

```text
E:\DEVOPS\
│
├── Jenkinsfile                          # Exact Declarative Pipeline script from Report Chapter 3.3
│
├── run_manual_deployment.bat             # 1-Click Manual Deployment execution (Windows)
├── run_automated_pipeline.bat            # 1-Click Automated Pipeline execution (Windows)
├── run_manual_deployment.sh              # 1-Click Manual Deployment execution (Linux/macOS)
├── run_automated_pipeline.sh             # 1-Click Automated Pipeline execution (Linux/macOS)
│
├── deployment-comparison/               # Application directory checked out by Jenkins
│   ├── server.js                        # Express backend serving application & /health endpoint
│   ├── package.json                     # Express dependency & npm start script
│   │
│   └── public/                          # Front-end UI (Minimal Navy Blue & Cream White theme)
│       ├── index.html                   # Welcoming app + Chapter 4 Comparative Dashboard
│       ├── css/
│       │   └── style.css                # Navy & Cream theme, Non-AI typography (Lora, Work Sans)
│       └── js/
│           ├── app.js                   # Navigation & event coordinator
│           ├── live_status.js           # Real-time health poller & execution runner
│           └── benchmark.js             # Table 4.3 loader from Chapter 4 of report
│
└── README.md                            # Comprehensive documentation & presentation guide
```

---

## 🚀 How to Execute Real Deployments

### 1. Manual Deployment Process (Chapter 4.1)
In the manual method, deployment commands are entered directly in the terminal from the application directory:

```bash
cd deployment-comparison
npm install
node server.js
```
Or simply double-click: **`run_manual_deployment.bat`**

Verification:
- Application URL: `http://localhost:3000`
- Health Endpoint: `http://localhost:3000/health` (Returns: `{"status":"Application is running!"}`)

---

### 2. Automated Jenkins Pipeline Process (Chapter 3.3 & 4.2)
In the automated method, Jenkins executes the declarative stages defined in the `Jenkinsfile`:

1. **Stage 1 (Install Dependencies)**:
   ```bash
   node -v && npm -v && npm install
   ```
2. **Stage 2 (Deploy Application)**:
   ```bash
   nohup node server.js > app.log 2>&1 &
   ```
3. **Stage 3 (Verify Deployment)**:
   ```bash
   for i in 1 2 3 4 5; do
     if curl -fsS http://localhost:3000/health; then
       echo "Deployment successful!"
       exit 0
     fi
     sleep 2
   done
   ```

To run this exact automated pipeline locally with automatic timing:
```bash
./run_automated_pipeline.bat
```
*(Recorded duration matches Jenkins Build #3: **8.4 seconds** with a green success indicator).*

---

## 📊 Chapter 4.3: Comparative Analysis Table

| Parameter | Manual Deployment | Automated Deployment (Jenkins) |
| :--- | :--- | :--- |
| **Execution** | Commands are entered manually by the operator. | Jenkins executes defined stages from the `Jenkinsfile`. |
| **Dependency Installation** | Operator runs `npm install`. | Pipeline runs `npm install` automatically. |
| **Application Start** | Operator runs `node server.js`. | Pipeline starts `server.js` as a background process. |
| **Verification** | Operator opens browser URL or runs `curl`. | Pipeline verifies `/health` response automatically. |
| **Repeatability** | Depends on operator following the same steps. | Defined steps are deterministically repeated. |
| **Human Effort** | Requires continuous manual command execution. | Requires initiating/triggering the Jenkins job. |
| **Observed Duration** | 45–90s (local test) / 45–65 mins (prod scale). | **Build #3 displayed 8.4 seconds in Jenkins.** |

---

## 🎓 How to Demonstrate to Your Invigilator

1. **Open the Application**:
   - Start the app: `cd deployment-comparison && npm start`
   - Open browser: `http://localhost:3000`
   - Show the hero card displaying:
     *“Software Deployment Project – Welcome! Comparative Study of Manual and Automated Software Deployment”* with the live green status pill.
2. **Open the Live Health Check**:
   - Navigate to `http://localhost:3000/health`. Show the exact JSON output:
     `{"status":"Application is running!"}`.
3. **Show Tab 2 (Chapter 4 Comparative Table)**:
   - Walk through the 7 comparison parameters directly from Table 4.3 of your report.
4. **Trigger the Real Deployment Runner (Tab 3)**:
   - Click **“Execute Manual Deployment Run”** to show the manual terminal commands.
   - Click **“Execute Jenkins Pipeline (Build #3)”** to demonstrate the automated stages finishing in **8.4 seconds**.
5. **Show the Jenkinsfile (Tab 4)**:
   - Explain the 3 stages: `Install Dependencies` $\rightarrow$ `Deploy Application` $\rightarrow$ `Verify Deployment`.
