import fs from 'fs';

// 1. Ajouter les styles pour l'impression (Print CSS)
const cssToAppend = `
/* --- Styles pour l'impression / PDF --- */
@media print {
  body { background: white !important; overflow: visible !important; height: auto !important; }
  #sidebar, #topbar, .no-print { display: none !important; }
  #app { display: block !important; height: auto !important; }
  #main { overflow: visible !important; }
  #view-container { padding: 0 !important; overflow: visible !important; }
  .card { border: none !important; box-shadow: none !important; padding: 0 !important; }
  .print-header { display: block !important; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0f172a; padding-bottom: 20px; }
  .print-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  .print-table th, .print-table td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 13px; }
  .print-table th { background: #f1f5f9; font-weight: bold; }
  .print-check { font-family: monospace; font-size: 16px; }
}
/* Styles pour l'écran */
.print-header { display: none; }
.report-doc { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); max-width: 900px; margin: 0 auto; }
.report-title { font-size: 24px; font-weight: 900; margin-bottom: 5px; }
.report-meta { color: #64748b; font-size: 14px; margin-bottom: 30px; }
.report-section-title { font-size: 18px; font-weight: 800; margin: 25px 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
`;
fs.appendFileSync('css/components.css', cssToAppend);

// 2. Créer reports.js
fs.writeFileSync('js/views/reports.js', `import { ROLES } from '../config/roles.js';
import { State } from '../core/state.js';
import { Period } from '../core/period.js';
import { I18n } from '../core/i18n.js';

export const ReportsView = {
  currentPeriod: 'Q',
  setPeriod(period) { this.currentPeriod = period; this.render(); },
  
  render() {
    const container = document.getElementById('view-container');
    const periodKey = Period.keyFor(this.currentPeriod);
    const dateStr = new Date().toLocaleDateString(I18n.lang === 'ar' ? 'ar-DZ' : 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Construction du tableau
    let tableRows = '';
    ROLES.forEach(role => {
      const allTasks = State.getTasks(role.id, role.tasks || []);
      const tasks = allTasks.filter(t => t.freq === this.currentPeriod);
      
      if (tasks.length > 0) {
        tasks.forEach((task, index) => {
          const isDone = State.isCompleted(role.id, task.id, task.freq, periodKey);
          const label = I18n.lang === 'ar' ? task.label.ar : task.label.fr;
          
          tableRows += \`
            <tr>
              \${index === 0 ? \`<td rowspan="\${tasks.length}" style="font-weight: bold; background: #f8fafc;">\${I18n.lang === 'ar' ? role.label.ar : role.label.fr}</td>\` : ''}
              <td>\${label}</td>
              <td style="text-align: center;">\${task.freq}</td>
              <td style="text-align: center;" class="print-check">\${isDone ? '✓' : '✗'}</td>
            </tr>
          \`;
        });
      }
    });

    const periodLabel = this.currentPeriod === 'Q' ? I18n.t('today') : this.currentPeriod === 'H' ? I18n.t('this_week') : I18n.t('this_month');

    container.innerHTML = \`
      <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div class="res-periods">
          <button class="res-period-btn \${this.currentPeriod === 'Q' ? 'active' : ''}" onclick="window.setRepPeriod('Q')">\${I18n.t('today')}</button>
          <button class="res-period-btn \${this.currentPeriod === 'H' ? 'active' : ''}" onclick="window.setRepPeriod('H')">\${I18n.t('this_week')}</button>
          <button class="res-period-btn \${this.currentPeriod === 'M' ? 'active' : ''}" onclick="window.setRepPeriod('M')">\${I18n.t('this_month')}</button>
        </div>
        <button onclick="window.print()" style="padding: 10px 20px; background: #e11d48; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px;">
          🖨️ Imprimer / PDF
        </button>
      </div>

      <div class="report-doc">
        <!-- En-tête spécifique pour l'impression -->
        <div class="print-header">
          <h1 style="font-size: 28px; margin-bottom: 10px;">\${I18n.lang === 'ar' ? 'تقرير متابعة المهام' : 'Rapport de Suivi des Tâches'}</h1>
          <p>Date : \${dateStr}</p>
          <p>Période : \${periodLabel}</p>
        </div>

        <!-- En-tête visible à l'écran -->
        <div class="report-title">\${I18n.lang === 'ar' ? 'تقرير متابعة المهام' : 'Rapport de Suivi des Tâches'}</div>
        <div class="report-meta">\${dateStr} — \${periodLabel}</div>

        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 25%;">\${I18n.lang === 'ar' ? 'القسم' : 'Fonction'}</th>
              <th>\${I18n.lang === 'ar' ? 'المهمة' : 'Tâche'}</th>
              <th style="width: 10%; text-align: center;">\${I18n.lang === 'ar' ? 'التكرار' : 'Fréq.'}</th>
              <th style="width: 10%; text-align: center;">\${I18n.lang === 'ar' ? 'الحالة' : 'Statut'}</th>
            </tr>
          </thead>
          <tbody>
            \${tableRows || '<tr><td colspan="4" style="text-align:center; padding: 20px;">Aucune tâche pour cette période.</td></tr>'}
          </tbody>
        </table>
        
        <div style="margin-top: 50px; display: flex; justify-content: space-between;">
          <div style="text-align: center; width: 200px;">
            <div style="border-bottom: 1px solid #000; height: 40px;"></div>
            <div style="margin-top: 5px; font-size: 12px;">Signature Direction</div>
          </div>
        </div>
      </div>
    \`;
  }
};`);

// 3. Mettre à jour app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');

// Import
if (!appJs.includes("import { ReportsView }")) {
  appJs = appJs.replace(
    "import { ResultsView } from './views/results.js';",
    "import { ResultsView } from './views/results.js';\nimport { ReportsView } from './views/reports.js';"
  );
}

// Route
if (!appJs.includes("ReportsView.render()")) {
  appJs = appJs.replace(
    "else if (view === 'results') { tbTitle.textContent = I18n.t('menu_results'); ResultsView.render(); }",
    `else if (view === 'results') { tbTitle.textContent = I18n.t('menu_results'); ResultsView.render(); }
      else if (view === 'reports') { tbTitle.textContent = I18n.t('menu_reports'); ReportsView.render(); }`
  );
}

// Fonction globale
if (!appJs.includes("window.setRepPeriod")) {
  appJs = appJs.replace(
    "window.selectRole = (roleId) => {",
    `window.setRepPeriod = (period) => { ReportsView.setPeriod(period); };\n\n  window.selectRole = (roleId) => {`
  );
}

fs.writeFileSync('js/app.js', appJs);

console.log('✅ VUE RAPPORTS (Export PDF) générée avec succès !');