/**
 * Comparative Study of Manual and Automated Software Deployment
 * Backend Service & Simulation Engine
 *
 * This server provides the benchmark datasets and powers the live deployment simulation
 * comparing manual runbooks against a Jenkins continuous delivery pipeline.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Path to our benchmark metrics dataset
const METRICS_FILE = path.join(__dirname, 'data', 'study-metrics.json');

/**
 * GET /api/metrics
 * Returns the benchmark metrics dataset comparing Manual vs. Automated deployments.
 */
app.get('/api/metrics', (req, res) => {
  try {
    const rawData = fs.readFileSync(METRICS_FILE, 'utf8');
    const metrics = JSON.parse(rawData);
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: metrics
    });
  } catch (error) {
    console.error('Failed to read metrics file:', error.message);
    res.status(500).json({
      success: false,
      error: 'Unable to load benchmark dataset.'
    });
  }
});

/**
 * POST /api/simulate
 * Simulates a deployment run for either 'manual' or 'jenkins' mode.
 * Accepts { type: 'manual' | 'jenkins', injectFailure: boolean }
 */
app.post('/api/simulate', (req, res) => {
  const { type = 'jenkins', injectFailure = false } = req.body;

  if (type === 'manual') {
    return res.json(simulateManualDeployment(injectFailure));
  } else if (type === 'jenkins') {
    return res.json(simulateJenkinsDeployment(injectFailure));
  } else {
    return res.status(400).json({
      success: false,
      error: "Invalid deployment type. Must be either 'manual' or 'jenkins'."
    });
  }
});

/**
 * Manual Deployment Simulation Steps & Timings
 */
function simulateManualDeployment(injectFailure) {
  const steps = [
    {
      id: 1,
      title: "1. Team Coordination & SSH Login",
      description: "DevOps engineer opens SSH terminal session to production server host.",
      durationSeconds: 120,
      humanTouchpoints: 1,
      status: "completed",
      log: "Connecting to prod-app-01.internal (203.0.113.15)... Authenticated via SSH key. Session established."
    },
    {
      id: 2,
      title: "2. Git Branch Pull & Dependency Resolution",
      description: "Navigating to /var/www/production and pulling git branch 'release-v2.4'.",
      durationSeconds: 240,
      humanTouchpoints: 1,
      status: "completed",
      log: "git checkout release-v2.4 && git pull origin release-v2.4\nResolving deltas: 100% (52/52), completed.\nnpm install --production (elapsed: 180s)"
    },
    {
      id: 3,
      title: "3. Database Migration Execution",
      description: "Running schema migrations manually via CLI command.",
      durationSeconds: 420,
      humanTouchpoints: 1,
      status: injectFailure ? "failed" : "completed",
      log: injectFailure
        ? "ERROR: Migration 20261109_add_indices failed: lock wait timeout exceeded.\nDatabase rollback initiated manually by engineer."
        : "Executing migration: 20261109_add_indices.sql... Applied in 14.2s. 0 schema conflicts detected."
    },
    {
      id: 4,
      title: "4. Web Server Restart & Service Reload",
      description: "Restarting systemd service unit and reloading Nginx reverse proxy.",
      durationSeconds: injectFailure ? 0 : 180,
      humanTouchpoints: 1,
      status: injectFailure ? "skipped" : "completed",
      log: injectFailure
        ? "Skipped due to migration error."
        : "systemctl restart webapp.service\nnginx -t && systemctl reload nginx. Unit active (running)."
    },
    {
      id: 5,
      title: "5. Manual QA Verification & Rollback (if failed)",
      description: "Manual sanity testing in browser. Reverting commit and DB if errors occur.",
      durationSeconds: injectFailure ? 900 : 360,
      humanTouchpoints: 2,
      status: injectFailure ? "recovered" : "completed",
      log: injectFailure
        ? "ALERT: 502 Bad Gateway detected. Senior engineer paged. Manual git checkout previous commit and database snapshot restore applied (MTTR: 15 mins)."
        : "QA tester executed smoke test suite across 12 critical user flows. Verified HTTP 200 OK. Release signed off."
    }
  ];

  const totalTimeSeconds = steps.reduce((acc, s) => acc + s.durationSeconds, 0);
  const totalHumanMinutes = Math.round(totalTimeSeconds / 60);

  return {
    success: !injectFailure,
    mode: "manual",
    summary: {
      totalTimeSeconds,
      totalTimeDisplay: `${totalHumanMinutes} minutes`,
      humanEffortScore: "High (Multiple manual terminal interactions)",
      errorEncountered: injectFailure,
      mttrSeconds: injectFailure ? 900 : 0
    },
    steps
  };
}

/**
 * Jenkins-based Automated Deployment Simulation Steps & Timings
 */
function simulateJenkinsDeployment(injectFailure) {
  const steps = [
    {
      id: 1,
      stage: "Declarative: Checkout SCM",
      description: "Jenkins webhook detects Git tag push, clones workspace in isolated agent.",
      durationSeconds: 15,
      humanTouchpoints: 0,
      status: "completed",
      log: "[Pipeline] checkout scm\nCloning repository 'git@github.com:enterprise/app.git'\nCommit: f8a1c9e (tag: v2.4.0) checked out cleanly in 12.4s."
    },
    {
      id: 2,
      stage: "Unit & Integration Tests",
      description: "Parallel testing pipeline running 148 automated unit & API test cases.",
      durationSeconds: 65,
      humanTouchpoints: 0,
      status: injectFailure ? "failed" : "completed",
      log: injectFailure
        ? "FAIL: API test suite detected assertion failure at /api/users endpoint (expected 200 got 500).\nPipeline aborted. Deployment blocked before reaching production."
        : "[Pipeline] sh: npm test\n148 tests passed (0 failed, 0 skipped). Code coverage: 94.2%."
    },
    {
      id: 3,
      stage: "Docker Container Build & Registry Push",
      description: "Building reproducible OCI container image and pushing to container registry.",
      durationSeconds: injectFailure ? 0 : 50,
      humanTouchpoints: 0,
      status: injectFailure ? "skipped" : "completed",
      log: injectFailure
        ? "Stage skipped due to previous stage failure."
        : "docker build -t registry.local/app:v2.4.0 .\nPushing layers: 100% complete. Digest: sha256:7bc3e9..."
    },
    {
      id: 4,
      stage: "Zero-Downtime Rolling Deployment",
      description: "Deploying container to Kubernetes cluster with automated health checks.",
      durationSeconds: injectFailure ? 0 : 40,
      humanTouchpoints: 0,
      status: injectFailure ? "skipped" : "completed",
      log: injectFailure
        ? "Stage skipped due to previous stage failure."
        : "kubectl set image deployment/app-deployment app=registry.local/app:v2.4.0\nWaiting for rollout to finish: 3 of 3 updated replicas are available."
    },
    {
      id: 5,
      stage: "Synthetic Health Verification & Auto-Rollback",
      description: "Automated probes verify HTTP responses. Reverts container instantly if unhealthy.",
      durationSeconds: injectFailure ? 20 : 15,
      humanTouchpoints: 0,
      status: injectFailure ? "auto_recovered" : "completed",
      log: injectFailure
        ? "[Auto-Recovery] Pipeline caught test failure. Automated rollback triggered in 18s. Production cluster restored to last known good build (v2.3.9)."
        : "Automated health probe checked /api/health across 5 pods: 200 OK. Slack release notification dispatched."
    }
  ];

  const totalTimeSeconds = steps.reduce((acc, s) => acc + s.durationSeconds, 0);
  const totalMinutes = (totalTimeSeconds / 60).toFixed(1);

  return {
    success: !injectFailure,
    mode: "jenkins",
    summary: {
      totalTimeSeconds,
      totalTimeDisplay: `${totalMinutes} minutes (${totalTimeSeconds} seconds)`,
      humanEffortScore: "Zero-Touch (Fully automated pipeline)",
      errorEncountered: injectFailure,
      mttrSeconds: injectFailure ? 20 : 0
    },
    steps
  };
}

// Start Server
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(` Comparative Study: Manual vs. Automated Software Deployment  `);
  console.log(` Server active on: http://localhost:${PORT}                      `);
  console.log(` Theme: Minimalist Navy Blue & Cream White                      `);
  console.log(`================================================================`);
});
