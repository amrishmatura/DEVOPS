/**
 * Interactive Simulation Engine
 * Simulates step-by-step execution for both Manual Runbooks and Jenkins Pipelines.
 */

let isSimulationRunning = false;

async function triggerSimulation(type) {
  if (isSimulationRunning) return;

  const terminalBody = document.getElementById('terminal-logs');
  const simStatus = document.getElementById('sim-status');
  const injectFailure = document.getElementById('inject-failure-toggle').checked;

  isSimulationRunning = true;
  terminalBody.innerHTML = '';
  simStatus.innerHTML = `<span style="color: #ffbe6b;">Simulating ${type === 'manual' ? 'Manual Runbook' : 'Jenkins Pipeline'}...</span>`;

  try {
    const response = await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, injectFailure })
    });

    const data = await response.json();

    appendLog(terminalBody, `=== INITIATING ${type.toUpperCase()} DEPLOYMENT SEQUENCE ===`, 'log-info');
    appendLog(terminalBody, `Target Environment: Production Cluster (AWS us-east-1)`, 'log-info');
    appendLog(terminalBody, `Failure Injection Flag: ${injectFailure ? 'ENABLED (Simulating Incident)' : 'DISABLED'}`, 'log-info');
    appendLog(terminalBody, '------------------------------------------------------------', '');

    // Stream steps sequentially with delays for realistic simulation
    for (let i = 0; i < data.steps.length; i++) {
      const step = data.steps[i];
      const stepName = step.title || step.stage;

      appendLog(terminalBody, `\n>> Executing: ${stepName}`, 'log-info');
      appendLog(terminalBody, `   Description: ${step.description}`, '');

      // Wait 600ms per step to give a live terminal feel
      await new Promise(r => setTimeout(r, 650));

      if (step.status === 'failed') {
        appendLog(terminalBody, `   [ERROR] ${step.log}`, 'log-error');
      } else if (step.status === 'recovered' || step.status === 'auto_recovered') {
        appendLog(terminalBody, `   [RECOVERY ACTION] ${step.log}`, 'log-warn');
      } else if (step.status === 'skipped') {
        appendLog(terminalBody, `   [SKIPPED] ${step.log}`, 'log-warn');
      } else {
        appendLog(terminalBody, `   [SUCCESS] ${step.log}`, 'log-success');
      }
    }

    appendLog(terminalBody, '\n------------------------------------------------------------', '');
    if (data.success) {
      appendLog(terminalBody, `✅ DEPLOYMENT FINISHED SUCCESSFULLY!`, 'log-success');
      appendLog(terminalBody, `Total Duration: ${data.summary.totalTimeDisplay}`, 'log-success');
      appendLog(terminalBody, `Human Effort: ${data.summary.humanEffortScore}`, 'log-info');
      simStatus.innerHTML = `<span style="color: #5ad88f;">Completed Successfully (${data.summary.totalTimeDisplay})</span>`;
    } else {
      appendLog(terminalBody, `⚠️ DEPLOYMENT ENCOUNTERED FAILURES AND WAS ROLLED BACK`, 'log-error');
      appendLog(terminalBody, `Mean Time to Recovery (MTTR): ${Math.round(data.summary.mttrSeconds / 60)} minutes`, 'log-warn');
      simStatus.innerHTML = `<span style="color: #ff7575;">Deployment Recovered via Rollback</span>`;
    }

  } catch (err) {
    appendLog(terminalBody, `Simulation failed to execute: ${err.message}`, 'log-error');
    simStatus.innerHTML = `<span style="color: #ff7575;">Execution Error</span>`;
  } finally {
    isSimulationRunning = false;
  }
}

function appendLog(container, text, cssClass) {
  const line = document.createElement('div');
  if (cssClass) line.className = cssClass;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
  container.appendChild(line);
  container.scrollTop = container.scrollHeight;
}
