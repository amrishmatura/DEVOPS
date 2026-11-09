/**
 * Comparative Study of Manual and Automated Software Deployment
 * Main UI Application Coordinator
 *
 * Responsibilities:
 *  - Tab switching (all 5 panes)
 *  - Wires run/print buttons to live_status.js and benchmark.js functions
 *  - Calls initDashboard() on load (defined in benchmark.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupActionButtons();

  // Load all dashboard data once the DOM is ready
  if (typeof initDashboard === 'function') {
    initDashboard();
  }
});

/* ── Tab switching ─────────────────────────────────────────────── */
function setupTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const panes   = document.querySelectorAll('.pane');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      // Deactivate all tabs and panes
      buttons.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      // Activate the clicked tab and its corresponding pane
      btn.classList.add('active');
      const pane = document.getElementById(target);
      if (pane) pane.classList.add('active');
    });
  });
}

/* ── Action buttons ─────────────────────────────────────────────── */
function setupActionButtons() {
  // Manual deployment runner (defined in live_status.js)
  const btnManual = document.getElementById('btn-manual');
  if (btnManual) {
    btnManual.addEventListener('click', () => {
      if (typeof executeManualRun === 'function') executeManualRun();
    });
  }

  // Jenkins pipeline runner (defined in live_status.js)
  const btnJenkins = document.getElementById('btn-jenkins');
  if (btnJenkins) {
    btnJenkins.addEventListener('click', () => {
      if (typeof executeJenkinsRun === 'function') executeJenkinsRun();
    });
  }

  // Print academic report
  const btnPrint = document.getElementById('btn-print');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => window.print());
  }
}
