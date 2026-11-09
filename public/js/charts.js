/**
 * Comparative Study: Pure SVG Visual Benchmark Charts
 * High contrast, minimal, matching Navy Blue & Cream White aesthetics.
 */

function renderComparisonCharts(metricsData) {
  const container = document.getElementById('charts-container');
  if (!container || !metricsData || !metricsData.parameters) return;

  const params = metricsData.parameters;

  let html = '';

  params.forEach((param) => {
    const maxVal = Math.max(param.manualValue, param.automatedValue);
    const manualWidth = Math.max(12, Math.round((param.manualValue / maxVal) * 100));
    const autoWidth = Math.max(8, Math.round((param.automatedValue / maxVal) * 100));

    html += `
      <div class="chart-box">
        <div class="chart-header">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.25rem;">
            <h3>${param.name} (${param.unit})</h3>
            <span class="delta-pill">-${param.improvementPercent}% Reduction</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${param.description}</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.9rem; margin-top: 1.25rem;">
          <!-- Manual Deployment Bar -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.3rem;">
              <span style="font-weight: 600; color: #8f2323;">Manual Deployment</span>
              <span style="font-family: var(--font-mono); font-weight: 600;">${param.manualValue} ${param.unit} (${param.manualRange})</span>
            </div>
            <div style="background-color: var(--bg-subtle); height: 26px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-light);">
              <div style="width: ${manualWidth}%; background-color: #a83232; height: 100%; transition: width 0.6s ease; display:flex; align-items:center; justify-content:flex-end; padding-right: 8px;">
                <span style="color: #ffffff; font-size: 0.75rem; font-family: var(--font-mono); font-weight: 500;">Baseline</span>
              </div>
            </div>
          </div>

          <!-- Jenkins Automated Bar -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.3rem;">
              <span style="font-weight: 600; color: var(--navy-deep);">Jenkins Automated Pipeline</span>
              <span style="font-family: var(--font-mono); font-weight: 600; color: var(--navy-deep);">${param.automatedValue} ${param.unit} (${param.automatedRange})</span>
            </div>
            <div style="background-color: var(--bg-subtle); height: 26px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-light);">
              <div style="width: ${autoWidth}%; background-color: #15294a; height: 100%; transition: width 0.6s ease; display:flex; align-items:center; justify-content:flex-end; padding-right: 8px;">
                <span style="color: #fcfbf7; font-size: 0.75rem; font-family: var(--font-mono); font-weight: 500;">Automated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}
