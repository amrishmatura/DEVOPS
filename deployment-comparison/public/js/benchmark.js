/**
 * DIT University - CSN-452 DevOps Project
 * Benchmark & Deployment Telemetry Coordinator
 */

async function initDashboard() {
  await Promise.all([
    loadBenchmarkData(),
    loadSystemTelemetry(),
    loadDeploymentHistory()
  ]);
}

async function loadBenchmarkData() {
  try {
    const res = await fetch('/api/comparison');
    const data = await res.json();

    renderFiveKPIs(data.metrics5Summary);
    renderChapter4Table(data.tableComparison);
  } catch (err) {
    console.error('Failed to load benchmark comparison:', err);
  }
}

function renderFiveKPIs(metrics) {
  const container = document.getElementById('five-kpis-grid');
  if (!container || !metrics) return;

  let html = '';
  metrics.forEach((m) => {
    html += `
      <div class="metric-card">
        <div class="metric-card-title">${m.name}</div>
        <div class="metric-card-val">${m.delta}</div>
        <div class="metric-card-badge">${m.unit}</div>
        <div class="metric-card-sub">
          <span>Manual: ${m.manual}</span>
        </div>
        <div class="metric-card-sub" style="border:none; margin-top:0.25rem; padding-top:0;">
          <span style="color: var(--blue-navy); font-weight:600;">Jenkins: ${m.automated}</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderChapter4Table(rows) {
  const tbody = document.getElementById('chapter4-table-body');
  if (!tbody || !rows) return;

  let html = '';
  rows.forEach((r) => {
    html += `
      <tr>
        <td style="font-weight: 600; color: var(--blue-navy);">${r.parameter}</td>
        <td>
          <span class="table-badge-manual">Manual Run</span>
          <div>${r.manual}</div>
        </td>
        <td>
          <span class="table-badge-jenkins">Jenkins Automated</span>
          <div>${r.automated}</div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

async function loadSystemTelemetry() {
  try {
    const res = await fetch('/api/system-status');
    const data = await res.json();

    const memEl = document.getElementById('telemetry-mem');
    const uptimeEl = document.getElementById('telemetry-uptime');
    const nodeEl = document.getElementById('telemetry-node');
    const hostEl = document.getElementById('telemetry-host');

    if (memEl) memEl.textContent = `${data.memory.heapUsedMB} MB / ${data.memory.rssMB} MB`;
    if (uptimeEl) uptimeEl.textContent = `${data.uptimeSeconds}s`;
    if (nodeEl) nodeEl.textContent = `${data.nodeVersion} (${data.platform})`;
    if (hostEl) hostEl.textContent = data.hostname;
  } catch (err) {
    console.error('Failed to load telemetry:', err);
  }
}

async function loadDeploymentHistory() {
  try {
    const res = await fetch('/api/deployments');
    const data = await res.json();
    const tbody = document.getElementById('deployment-history-body');
    if (!tbody || !data.history) return;

    let html = '';
    data.history.forEach((d) => {
      const isJenkins = d.method.includes('Jenkins');
      html += `
        <tr>
          <td><strong style="font-family: var(--font-mono);">${d.id}</strong></td>
          <td>
            <span class="${isJenkins ? 'table-badge-jenkins' : 'table-badge-manual'}">${d.method}</span>
          </td>
          <td><strong style="font-family: var(--font-mono);">${d.duration}</strong></td>
          <td>${d.operator}</td>
          <td><span style="color: var(--status-green); font-weight: 600;">● ${d.status}</span></td>
          <td>${d.timestamp}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  } catch (err) {
    console.error('Failed to load deployment history:', err);
  }
}
