/**
 * Comparative Study of Manual and Automated Software Deployment
 * Benchmark & Dashboard Data Loader
 *
 * Fetches data from the server APIs and renders:
 *  - 5 KPI metric cards  (pane-home  #kpi-grid)
 *  - Comparison Table    (pane-table #chapter4-table-body)
 *  - Deployment log      (pane-home  #deployment-history-body)
 *  - Telemetry strip     (pane-home  #telemetry-*)
 */

/* ── Entry point (called by app.js after DOMContentLoaded) ─────── */
async function initDashboard() {
  await Promise.all([
    loadComparisonData(),
    loadTelemetry(),
    loadDeploymentHistory()
  ]);
}

/* ── 1. Comparison data — KPI cards + Table 4.3 ────────────────── */
async function loadComparisonData() {
  try {
    const res  = await fetch('/api/comparison');
    const data = await res.json();

    renderKPICards(data.metrics5Summary);
    renderTable43(data.tableComparison);
  } catch (err) {
    console.error('[benchmark] Failed to load /api/comparison:', err);
  }
}

function renderKPICards(metrics) {
  const grid = document.getElementById('kpi-grid');
  if (!grid || !metrics) return;

  grid.innerHTML = metrics.map(m => `
    <div class="kpi-card">
      <div class="kpi-label">${m.name}</div>
      <div class="kpi-value">${m.delta}</div>
      <div class="kpi-gain">${m.unit}</div>
      <hr class="kpi-sep">
      <div class="kpi-row">Manual: ${m.manual}</div>
      <div class="kpi-row">Jenkins: <strong>${m.automated}</strong></div>
    </div>
  `).join('');
}

function renderTable43(rows) {
  const tbody = document.getElementById('chapter4-table-body');
  if (!tbody || !rows) return;

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td style="font-weight:600; color:var(--blue-900);">${r.parameter}</td>
      <td>
        <span class="badge badge-manual">Manual Run</span>
        <div>${r.manual}</div>
      </td>
      <td>
        <span class="badge badge-jenkins">Jenkins Automated</span>
        <div>${r.automated}</div>
      </td>
    </tr>
  `).join('');
}

/* ── 2. Live server telemetry strip ─────────────────────────────── */
async function loadTelemetry() {
  try {
    const res  = await fetch('/api/system-status');
    const data = await res.json();

    setText('telemetry-node',   `${data.nodeVersion} (${data.platform})`);
    setText('telemetry-host',   data.hostname);
    setText('telemetry-uptime', `${data.uptimeSeconds}s`);
    setText('telemetry-mem',    `${data.memory.heapUsedMB} MB / ${data.memory.rssMB} MB`);
  } catch (err) {
    console.error('[benchmark] Failed to load /api/system-status:', err);
  }
}

/* ── 3. Deployment audit log ────────────────────────────────────── */
async function loadDeploymentHistory() {
  try {
    const res  = await fetch('/api/deployments');
    const data = await res.json();
    const tbody = document.getElementById('deployment-history-body');
    if (!tbody || !data.history) return;

    tbody.innerHTML = data.history.map(d => {
      const isJenkins = d.method.includes('Jenkins');
      return `
        <tr>
          <td><strong style="font-family:var(--font-mono);">#${d.id}</strong></td>
          <td>
            <span class="badge ${isJenkins ? 'badge-jenkins' : 'badge-manual'}">${d.method}</span>
          </td>
          <td><strong style="font-family:var(--font-mono);">${d.duration}</strong></td>
          <td>${d.operator}</td>
          <td><span class="badge badge-success">● ${d.status}</span></td>
          <td>${d.timestamp}</td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error('[benchmark] Failed to load /api/deployments:', err);
  }
}

/* ── Helper ─────────────────────────────────────────────────────── */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
