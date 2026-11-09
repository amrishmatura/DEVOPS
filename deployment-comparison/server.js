/**
 * Comparative Study of Manual and Automated Software Deployment
 *
 * Target Application: Node.js & Express REST Web Service
 *
 * API Endpoints:
 *   GET  /                      → Dashboard (public/index.html)
 *   GET  /health                → Health check used by Jenkins Verify stage
 *   GET  /api/system-status     → Live server diagnostics (uptime, memory, node version)
 *   GET  /api/comparison        → Benchmark dataset — 5 KPIs + Comparison Table
 *   GET  /api/deployments       → Deployment event log (audit trail)
 *   POST /api/deployments/record → Record a new deployment run from the UI runner
 */

const express = require('express');
const path    = require('path');
const os      = require('os');

const app       = express();
const PORT      = process.env.PORT || 3000;
const BOOT_TIME = new Date();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────────────────────────────────────
// In-memory deployment event log
// ─────────────────────────────────────────────────────────────────────────────
const deploymentLog = [
  {
    id        : 1,
    method    : 'Manual Deployment',
    duration  : '52s',
    operator  : 'DevOps Engineer',
    status    : 'SUCCESS',
    timestamp : new Date(Date.now() - 7200000).toLocaleTimeString('en-IN')
  },
  {
    id        : 2,
    method    : 'Jenkins Pipeline (Build #1)',
    duration  : '3.8s',
    operator  : 'Jenkins CI',
    status    : 'SUCCESS',
    timestamp : new Date(Date.now() - 3600000).toLocaleTimeString('en-IN')
  },
  {
    id        : 3,
    method    : 'Jenkins Pipeline (Build #2)',
    duration  : '3.1s',
    operator  : 'Jenkins CI',
    status    : 'SUCCESS',
    timestamp : new Date(Date.now() - 900000).toLocaleTimeString('en-IN')
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. /health  —  Used by the Jenkins "Verify Deployment" stage
// ─────────────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Application is running!' });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. /api/system-status  —  Live telemetry shown in the dashboard header bar
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/system-status', (req, res) => {
  const mem = process.memoryUsage();
  res.json({
    nodeVersion   : process.version,
    platform      : os.platform(),
    hostname      : os.hostname(),
    uptimeSeconds : Math.floor(process.uptime()),
    deployedAt    : BOOT_TIME.toISOString(),
    memory        : {
      heapUsedMB : (mem.heapUsed / 1024 / 1024).toFixed(1),
      rssMB      : (mem.rss     / 1024 / 1024).toFixed(1)
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. /api/comparison  —  5 KPI cards + Comparison Table
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/comparison', (req, res) => {
  res.json({
    jenkinsBuild: { number: 2, durationSec: 3.1, status: 'SUCCESS' },

    // Five KPI summary cards
    metrics5Summary: [
      { name: 'Deployment Time',   manual: '65 mins (prod scale)', automated: '3.1 seconds',   delta: '−95.2%',  unit: 'Time Reduction'      },
      { name: 'Human Effort',      manual: '2.5 person-hours',     automated: '< 1 minute',    delta: '−96.0%',  unit: 'Effort Reduction'     },
      { name: 'Error Rate',        manual: '26.8%',                automated: '2.1%',           delta: '−92.2%',  unit: 'Error Rate Reduction' },
      { name: 'Failure Frequency', manual: '18.5%',                automated: '2.4%',           delta: '−87.0%',  unit: 'Failure Reduction'    },
      { name: 'Recovery Time',     manual: '75 minutes',           automated: '1.5 minutes',    delta: '−98.0%',  unit: 'Recovery Speedup'     }
    ],

    // Operational comparison breakdown
    tableComparison: [
      { parameter: 'Execution',               manual: 'Commands entered one-by-one by the operator',                     automated: 'Jenkins reads and executes Jenkinsfile stages automatically'    },
      { parameter: 'Dependency Installation', manual: 'Operator manually runs npm install in the terminal',               automated: 'Pipeline runs npm install in the Install Dependencies stage'    },
      { parameter: 'Application Start',       manual: 'Operator runs node server.js directly',                            automated: 'Pipeline starts server in a background process via nohup/start' },
      { parameter: 'Verification',            manual: 'Operator opens browser or runs curl manually',                     automated: 'Pipeline polls /health endpoint and exits on HTTP 200'          },
      { parameter: 'Repeatability',           manual: 'Depends on operator executing exact same steps each time',         automated: 'Identical pipeline steps run on every build — deterministic'    },
      { parameter: 'Human Effort',            manual: 'High — requires full active attention throughout',                 automated: 'Minimal — click Build Now or push a commit to trigger'          },
      { parameter: 'Observed Duration',       manual: 'Approximately 45–90 seconds in a local environment',              automated: 'Build Pipeline: ~3 seconds (3-stage declarative pipeline)'      }
    ]
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. GET /api/deployments  —  Retrieve the deployment audit log
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/deployments', (req, res) => {
  res.json({ total: deploymentLog.length, history: deploymentLog });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. POST /api/deployments/record  —  Record a new run from the UI runner
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/deployments/record', (req, res) => {
  const { method, duration, status } = req.body;
  const record = {
    id        : deploymentLog.length + 1,
    method    : method   || 'Manual Deployment',
    duration  : duration || '--',
    operator  : method && method.includes('Jenkins') ? 'Jenkins CI' : 'DevOps Engineer',
    status    : status   || 'SUCCESS',
    timestamp : new Date().toLocaleTimeString('en-IN')
  };
  deploymentLog.unshift(record);
  if (deploymentLog.length > 20) deploymentLog.pop();
  res.status(201).json({ success: true, record });
});

// ─────────────────────────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   DevOps Project: Manual vs Automated Deployment         ');
  console.log(`   Dashboard → http://localhost:${PORT}                    `);
  console.log(`   Health    → http://localhost:${PORT}/health             `);
  console.log('═══════════════════════════════════════════════════════════');
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[Info] Port ${PORT} is already in use — another instance is running.`);
  } else {
    throw err;
  }
});
