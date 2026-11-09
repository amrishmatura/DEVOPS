/**
 * DIT University - CSN-452 DevOps Project
 * Main UI Application Coordinator
 */

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  if (typeof initDashboard === 'function') {
    initDashboard();
  }
  setupActionButtons();
});

function setupTabs() {
  const tabs = document.querySelectorAll('.nav-tab-btn');
  const panes = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

function setupActionButtons() {
  const manualBtn = document.getElementById('btn-manual-deploy');
  if (manualBtn) manualBtn.addEventListener('click', executeManualRun);

  const jenkinsBtn = document.getElementById('btn-jenkins-deploy');
  if (jenkinsBtn) jenkinsBtn.addEventListener('click', executeJenkinsRun);

  const printBtn = document.getElementById('btn-print-doc');
  if (printBtn) printBtn.addEventListener('click', () => window.print());
}
