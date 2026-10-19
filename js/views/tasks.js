import { ROLES } from '../config/roles.js';
import { State } from '../core/state.js';
import { Period } from '../core/period.js';
import { I18n } from '../core/i18n.js';

export const TasksView = {
  currentRoleId: 'pgc',
  render() {
    const container = document.getElementById('view-container');
    
    // Traduction des noms de rôles
    const roleSelector = ROLES.map(r => {
      const roleLabel = I18n.lang === 'ar' ? r.label.ar : r.label.fr;
      return `
        <button class="role-btn ${r.id === this.currentRoleId ? 'active' : ''}" onclick="window.selectRole('${r.id}')">
          <span>${r.icon}</span> ${roleLabel}
        </button>
      `;
    }).join('');

    const role = ROLES.find(r => r.id === this.currentRoleId);
    
    // Fusionner les tâches de base et les tâches personnalisées
    const allTasks = role ? State.getTasks(role.id, role.tasks || []) : [];
    
    let tasksHtml = allTasks.map(task => {
      const periodKey = Period.keyFor(task.freq);
      const isDone = State.isCompleted(role.id, task.id, task.freq, periodKey);
      const label = I18n.lang === 'ar' ? task.label.ar : task.label.fr;
      
      return `
        <div class="task-item ${isDone ? 'done' : ''}" onclick="window.toggleTask('${role.id}', '${task.id}', '${task.freq}')">
          <div class="task-check">✓</div>
          <div class="task-content">
            <div class="task-title">${label}</div>
          </div>
          <span class="task-badge badge-${task.freq}">${task.freq}</span>
        </div>
      `;
    }).join('');

    // Formulaire d'ajout (caché par défaut)
    const addFormHtml = `
      <div id="add-task-form" style="display: none; background: #f8fafc; padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px dashed #cbd5e1;">
        <h4 style="margin-bottom: 15px;">${I18n.t('add_task')}</h4>
        <input type="text" id="new-task-name" placeholder="${I18n.t('task_name')}..." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 10px;">
        <select id="new-task-freq" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 15px;">
          <option value="Q">${I18n.t('daily')}</option>
          <option value="H">${I18n.t('weekly')}</option>
          <option value="M">${I18n.t('monthly')}</option>
        </select>
        <div style="display: flex; gap: 10px;">
          <button onclick="window.saveNewTask()" style="flex: 1; padding: 10px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">${I18n.t('save')}</button>
          <button onclick="document.getElementById('add-task-form').style.display='none'" style="flex: 1; padding: 10px; background: #e2e8f0; color: #475569; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">${I18n.t('cancel')}</button>
        </div>
      </div>
    `;

    container.innerHTML = `
      <div style="margin-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 600;">${I18n.t('select_role')}</div>
      <div class="role-selector">${roleSelector}</div>
      
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="font-size: 18px;">${role ? (I18n.lang === 'ar' ? role.label.ar : role.label.fr) : ''}</h2>
          <button onclick="document.getElementById('add-task-form').style.display='block'" style="padding: 8px 16px; background: #0f172a; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">+ ${I18n.t('add_task')}</button>
        </div>
        
        <div class="task-list">${tasksHtml}</div>
        ${addFormHtml}
      </div>
    `;
  }
};