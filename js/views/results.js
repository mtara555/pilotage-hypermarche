import { ROLES } from '../config/roles.js';
import { State } from '../core/state.js';
import { Period } from '../core/period.js';

export const ResultsView = {
  currentPeriod: 'Q',
  setPeriod(period) { this.currentPeriod = period; this.render(); },
  render() {
    const container = document.getElementById('view-container');
    const periodKey = Period.keyFor(this.currentPeriod);
    let globalDone = 0; let globalTotal = 0;

    const rolesStats = ROLES.map(role => {
      const tasks = role.tasks || [];
      let done = 0;
      const filteredTasks = tasks.filter(t => t.freq === this.currentPeriod);
      filteredTasks.forEach(task => {
        globalTotal++;
        if (State.isCompleted(role.id, task.id, task.freq, periodKey)) { done++; globalDone++; }
      });
      const pct = filteredTasks.length > 0 ? Math.round((done / filteredTasks.length) * 100) : 0;
      return { ...role, done, total: filteredTasks.length, pct: isNaN(pct) ? 0 : pct };
    });

    const globalPct = globalTotal > 0 ? Math.round((globalDone / globalTotal) * 100) : 0;

    container.innerHTML = `
      <div class="res-header">
        <h2 style="font-size: 18px;">${I18n.t("perf_analysis")}</h2>
        <div class="res-periods">
          <button class="res-period-btn ${this.currentPeriod === 'Q' ? 'active' : ''}" onclick="window.setResPeriod('Q')">Aujourd'hui</button>
          <button class="res-period-btn ${this.currentPeriod === 'H' ? 'active' : ''}" onclick="window.setResPeriod('H')">${I18n.t("this_week")}</button>
          <button class="res-period-btn ${this.currentPeriod === 'M' ? 'active' : ''}" onclick="window.setResPeriod('M')">${I18n.t("this_month")}</button>
        </div>
      </div>
      <div class="kpi-grid">
        <div class="card">
          <div class="kpi-title">${I18n.t("global_rate")}</div>
          <div class="kpi-value">${globalPct}%</div>
          <div class="res-bar-wrap"><div class="res-bar-fill" style="width: ${globalPct}%; background: ${globalPct >= 80 ? '#10b981' : globalPct >= 50 ? '#f59e0b' : '#ef4444'};"></div></div>
        </div>
        <div class="card">
          <div class="kpi-title">${I18n.t("tasks_done")}</div>
          <div class="kpi-value">${globalDone} / ${globalTotal}</div>
        </div>
      </div>
      <h3 style="margin: 24px 0 16px; font-size: 16px;">${I18n.t("detail_by_role")}</h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${rolesStats.map(r => `
          <div class="card" style="display: flex; align-items: center; gap: 20px;">
            <div style="font-size: 24px;">${r.icon}</div>
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-weight: 700; font-size: 14px;">${r.label.fr}</span>
                <span style="font-weight: 900; font-size: 14px; color: ${r.pct >= 80 ? '#10b981' : r.pct >= 50 ? '#f59e0b' : '#ef4444'};">${r.pct}%</span>
              </div>
              <div class="res-bar-wrap" style="margin-top: 0;">
                <div class="res-bar-fill" style="width: ${r.pct}%; background: ${r.color};"></div>
              </div>
            </div>
            <div style="width: 60px; text-align: right; font-size: 12px; color: #64748b; font-weight: 600;">${r.done} / ${r.total}</div>
          </div>
        `).join('')}
      </div>
    `;
  }
};