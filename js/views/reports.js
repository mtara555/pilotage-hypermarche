import { ROLES } from '../config/roles.js';
import { State } from '../core/state.js';
import { Period } from '../core/period.js';
import { I18n } from '../core/i18n.js';

export const ReportsView = {
  currentPeriod: 'Q',
  setPeriod(period) { this.currentPeriod = period; this.render(); },
  
  render() {
    const container = document.getElementById('view-container');
    const periodKey = Period.keyFor(this.currentPeriod);
    
    // Formatage de la date propre
    const today = new Date();
    let dateStr = '';
    if (I18n.lang === 'ar') {
      const jours = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const mois = ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      dateStr = jours[today.getDay()] + ' ' + today.getDate() + ' ' + mois[today.getMonth()] + ' ' + today.getFullYear();
    } else {
      dateStr = today.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Construction du tableau
    let tableRows = '';
    ROLES.forEach(role => {
      const allTasks = State.getTasks(role.id, role.tasks || []);
      const tasks = allTasks.filter(t => t.freq === this.currentPeriod);
      
      if (tasks.length > 0) {
        tasks.forEach((task, index) => {
          const isDone = State.isCompleted(role.id, task.id, task.freq, periodKey);
          const label = I18n.lang === 'ar' ? task.label.ar : task.label.fr;
          const roleLabel = I18n.lang === 'ar' ? role.label.ar : role.label.fr;
          
          tableRows += `
            <tr>
              ${index === 0 ? `<td rowspan="${tasks.length}" style="font-weight: bold; background-color: #f8fafc; text-align: center;">${roleLabel}</td>` : ''}
              <td>${label}</td>
              <td class="text-center">${task.freq}</td>
              <td class="text-center" style="font-size: 18px; font-weight: bold; color: ${isDone ? "#10b981" : "#ef4444"}";>${isDone ? '✓' : '✗'}</td>
            </tr>
          `;
        });
      }
    });

    const periodLabel = this.currentPeriod === 'Q' ? I18n.t('today') : this.currentPeriod === 'H' ? I18n.t('this_week') : I18n.t('this_month');

    container.innerHTML = `
      <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div class="res-periods">
          <button class="res-period-btn ${this.currentPeriod === 'Q' ? 'active' : ''}" onclick="window.setRepPeriod('Q')">${I18n.t('today')}</button>
          <button class="res-period-btn ${this.currentPeriod === 'H' ? 'active' : ''}" onclick="window.setRepPeriod('H')">${I18n.t('this_week')}</button>
          <button class="res-period-btn ${this.currentPeriod === 'M' ? 'active' : ''}" onclick="window.setRepPeriod('M')">${I18n.t('this_month')}</button>
        </div>
        <button onclick="window.print()" style="padding: 10px 20px; background: #e11d48; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px;">
          🖨️ Imprimer / PDF
        </button>
      </div>

      <div class="report-doc">
        <!-- En-tête pour l'impression -->
        <div class="print-header">
          <h1 style="font-size: 28px; margin-bottom: 10px;">${I18n.lang === 'ar' ? 'تقرير متابعة المهام' : 'Rapport de Suivi des Tâches'}</h1>
          <p style="margin: 5px 0;">${I18n.lang === 'ar' ? 'التاريخ' : 'Date'} : ${dateStr}</p>
          <p style="margin: 5px 0;">${I18n.lang === 'ar' ? 'الفترة' : 'Période'} : ${periodLabel}</p>
        </div>

        <!-- En-tête visible à l'écran -->
        <div class="report-title">${I18n.lang === 'ar' ? 'تقرير متابعة المهام' : 'Rapport de Suivi des Tâches'}</div>
        <div class="report-meta">${dateStr} — ${periodLabel}</div>

        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 25%; text-align: center;">${I18n.lang === 'ar' ? 'القسم' : 'Fonction'}</th>
              <th>${I18n.lang === 'ar' ? 'المهمة' : 'Tâche'}</th>
              <th style="width: 10%; text-align: center;">${I18n.lang === 'ar' ? 'التكرار' : 'Fréq.'}</th>
              <th style="width: 10%; text-align: center;">${I18n.lang === 'ar' ? 'الحالة' : 'Statut'}</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows || '<tr><td colspan="4" style="text-align:center; padding: 20px;">Aucune tâche pour cette période.</td></tr>'}
          </tbody>
        </table>
        
        <div style="margin-top: 50px; display: flex; justify-content: space-between;">
          <div style="text-align: center; width: 200px;">
            <div style="border-bottom: 1px solid #000; height: 40px;"></div>
            <div style="margin-top: 5px; font-size: 12px;">${I18n.lang === 'ar' ? 'توقيع الإدارة' : 'Signature Direction'}</div>
          </div>
        </div>
      </div>
    `;
  }
};