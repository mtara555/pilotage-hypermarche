import { ROLES } from '../config/roles.js';

export const Dashboard = {
  render() {
    const container = document.getElementById('view-container');
    
    // On simule quelques statistiques
    container.innerHTML = `
      <div class="kpi-grid">
        <div class="card">
          <div class="kpi-title">Taux global</div>
          <div class="kpi-value">75%</div>
          <div class="kpi-sub">+5% vs hier</div>
        </div>
        <div class="card">
          <div class="kpi-title">Tâches faites</div>
          <div class="kpi-value">42/56</div>
          <div class="kpi-sub">14 restantes</div>
        </div>
        <div class="card">
          <div class="kpi-title">Commercial</div>
          <div class="kpi-value">82%</div>
          <div class="kpi-sub">En bonne voie</div>
        </div>
        <div class="card">
          <div class="kpi-title">Services</div>
          <div class="kpi-value">60%</div>
          <div class="kpi-sub" style="color:#f59e0b;">Attention requise</div>
        </div>
      </div>

      <h3 style="margin-bottom: 15px; font-size: 16px;">Vos fonctions (${ROLES.length})</h3>
      <div style="display: grid; gap: 10px;">
        ${ROLES.map(r => `
          <div class="card" style="display:flex; justify-content:space-between; align-items:center; border-left: 4px solid ${r.color};">
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="font-size:24px;">${r.icon}</span>
              <div>
                <div style="font-weight:800;">${r.label.fr}</div>
                <div style="font-size:12px; color:#64748b;">${r.tasks.length} tâches assignées</div>
              </div>
            </div>
            <button class="btn" style="background:#f1f5f9; padding:8px 16px; border-radius:8px; border:none; cursor:pointer; font-weight:bold;">Voir</button>
          </div>
        `).join('')}
      </div>
    `;
  }
};