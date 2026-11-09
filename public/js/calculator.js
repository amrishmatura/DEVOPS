/**
 * ROI & Engineering Effort Calculator
 * Calculates empirical time and financial savings when migrating from manual releases to Jenkins.
 */

function calculateSavings() {
  const deploysPerMonth = parseFloat(document.getElementById('calc-deploys').value) || 10;
  const teamSize = parseFloat(document.getElementById('calc-team-size').value) || 2;
  const hourlyRate = parseFloat(document.getElementById('calc-hourly-rate').value) || 60;

  const annualDeployments = deploysPerMonth * 12;

  // Manual: 2.5 hours per engineer per deployment * team size
  const manualHoursPerDeploy = 2.5 * teamSize;
  const annualManualHours = Math.round(annualDeployments * manualHoursPerDeploy);

  // Jenkins: 0.1 hours (6 mins) total human touchpoint per deployment
  const automatedHoursPerDeploy = 0.1;
  const annualAutomatedHours = Math.round(annualDeployments * automatedHoursPerDeploy);

  const hoursSaved = annualManualHours - annualAutomatedHours;
  const dollarsSaved = Math.round(hoursSaved * hourlyRate);

  // Estimate failure occurrences saved (Manual: 18.5% failures vs Automated 2.4% failures)
  const manualIncidents = Math.round(annualDeployments * 0.185);
  const automatedIncidents = Math.round(annualDeployments * 0.024);
  const incidentsAvoided = Math.max(0, manualIncidents - automatedIncidents);

  // Update DOM
  document.getElementById('res-hours-saved').textContent = `${hoursSaved.toLocaleString()} hrs/year`;
  document.getElementById('res-cost-saved').textContent = `$${dollarsSaved.toLocaleString()}`;
  document.getElementById('res-manual-hours').textContent = `${annualManualHours.toLocaleString()} hrs`;
  document.getElementById('res-automated-hours').textContent = `${annualAutomatedHours.toLocaleString()} hrs`;
  document.getElementById('res-incidents-avoided').textContent = `${incidentsAvoided} incidents/year`;
}
