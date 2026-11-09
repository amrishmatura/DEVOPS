/**
 * Main Application Orchestrator
 * Connects navigation tabs, loads metrics from API, and initializes views.
 */

let globalMetricsData = null;

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigationTabs();
  await loadMetricsData();
  setupEventListeners();
  calculateSavings(); // Initial calculation
});

function setupNavigationTabs() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      navButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.getElementById(targetTab);
      if (pane) pane.classList.add('active');
    });
  });
}

async function loadMetricsData() {
  try {
    const res = await fetch('/api/metrics');
    const json = await res.parse ? await res.json() : await res.json();
    globalMetricsData = json.data;

    populateScorecards(globalMetricsData);
    populateComparisonTable(globalMetricsData);
    renderComparisonCharts(globalMetricsData);
  } catch (error) {
    console.error('Failed to load metrics:', error);
  }
}

function populateScorecards(data) {
  const scorecardsContainer = document.getElementById('scorecards-container');
  if (!scorecardsContainer || !data.parameters) return;

  let html = '';
  data.parameters.forEach((param) => {
    html += `
      <div class="scorecard">
        <div class="scorecard-label">${param.name}</div>
        <div class="scorecard-delta">-${param.improvementPercent}%</div>
        <div class="scorecard-subtext">Automated Efficiency Gain</div>
        <div class="scorecard-compare">
          <span>Manual: <strong>${param.manualValue} ${param.unit}</strong></span>
          <span>Jenkins: <strong>${param.automatedValue} ${param.unit}</strong></span>
        </div>
      </div>
    `;
  });

  scorecardsContainer.innerHTML = html;
}

function populateComparisonTable(data) {
  const tbody = document.getElementById('comparison-table-body');
  if (!tbody || !data.parameters) return;

  let html = '';
  data.parameters.forEach((param) => {
    html += `
      <tr>
        <td>
          <span class="param-name">${param.name}</span>
          <span class="param-desc">${param.description}</span>
        </td>
        <td>
          <span class="badge-manual">Manual Runbook</span>
          <div><strong>${param.manualRange}</strong> (${param.manualValue} ${param.unit} avg)</div>
        </td>
        <td>
          <span class="badge-jenkins">Jenkins Pipeline</span>
          <div><strong>${param.automatedRange}</strong> (${param.automatedValue} ${param.unit} avg)</div>
        </td>
        <td>
          <span class="delta-pill">-${param.improvementPercent}%</span>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function setupEventListeners() {
  // Calculator inputs
  ['calc-deploys', 'calc-team-size', 'calc-hourly-rate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateSavings);
  });

  // Simulator Buttons
  const runManualBtn = document.getElementById('btn-run-manual');
  if (runManualBtn) {
    runManualBtn.addEventListener('click', () => triggerSimulation('manual'));
  }

  const runJenkinsBtn = document.getElementById('btn-run-jenkins');
  if (runJenkinsBtn) {
    runJenkinsBtn.addEventListener('click', () => triggerSimulation('jenkins'));
  }

  // Print Report Button
  const printBtn = document.getElementById('btn-print-report');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }
}
