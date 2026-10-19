import { I18n } from './core/i18n.js';
import { State } from './core/state.js';
import { Auth } from './services/auth.js';
import { Layout } from './views/layout.js';
import { Dashboard } from './views/dashboard.js';
import { TasksView } from './views/tasks.js';
import { ResultsView } from './views/results.js';
import { ReportsView } from './views/reports.js';
import { SettingsView } from './views/settings.js';
import { Period } from './core/period.js';

let currentView = 'dashboard';

document.addEventListener('DOMContentLoaded', () => {
  State.init();
  I18n.init();

  const showApp = () => {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').classList.remove('hidden');
    Layout.renderSidebar();
    window.navigate('dashboard');
  };

  window.navigate = (view) => {
    currentView = view;
    Layout.setActive(view);
    const tbTitle = document.getElementById('tb-title');
    const container = document.getElementById('view-container');

    try {
      if (view === 'dashboard') { tbTitle.textContent = I18n.t('menu_dashboard'); Dashboard.render(); }
      else if (view === 'tasks') { tbTitle.textContent = I18n.t('menu_tasks'); TasksView.render(); }
      else if (view === 'results') { tbTitle.textContent = I18n.t('menu_results'); ResultsView.render(); }
      else if (view === 'reports') { tbTitle.textContent = I18n.t('menu_reports'); ReportsView.render(); }
      else if (view === 'settings') { tbTitle.textContent = I18n.t('menu_settings'); SettingsView.render(); }
      else { tbTitle.textContent = I18n.t(view); container.innerHTML = '<h2>Vue ' + I18n.t(view) + ' en construction...</h2>'; }
    } catch (e) {
      console.error("ERREUR:", e);
      container.innerHTML = '<div style="color:red; padding:20px; background:#fee2e2; border-radius:8px;"><b>Erreur :</b> ' + e.message + '</div>';
    }
  };

  window.toggleLang = () => {
    const newLang = I18n.lang === 'fr' ? 'ar' : 'fr';
    I18n.set(newLang);
    document.getElementById('lang-toggle').textContent = newLang === 'fr' ? 'عربي' : 'FR';
    Layout.renderSidebar();
    window.navigate(currentView);
  };

  window.saveNewTask = () => {
    const name = document.getElementById('new-task-name').value.trim();
    const freq = document.getElementById('new-task-freq').value;
    if (!name) return;
    const newTask = {
      id: 'custom_' + Date.now(),
      freq: freq,
      label: { fr: name, ar: name }
    };
    State.addCustomTask(TasksView.currentRoleId, newTask);
    document.getElementById('new-task-name').value = '';
    TasksView.render();
  };

  window.setRepPeriod = (period) => { ReportsView.setPeriod(period); };

  window.saveSettings = () => {
    const newName = document.getElementById('input-company-name').value.trim();
    if (newName) {
      State.updateCompany(newName);
      Layout.renderSidebar(); // Met à jour le menu
      alert(I18n.lang === 'ar' ? 'تم الحفظ بنجاح!' : 'Enregistré avec succès !');
    }
  };

  window.resetData = () => {
    if (confirm(I18n.lang === 'ar' ? 'هل أنت متأكد من حذف جميع البيانات؟' : 'Êtes-vous sûr de vouloir tout réinitialiser ?')) {
      State.resetAllData();
      alert(I18n.lang === 'ar' ? 'تمت إعادة التعيين.' : 'Données réinitialisées.');
      window.navigate('dashboard');
    }
  };

  window.selectRole = (roleId) => { TasksView.currentRoleId = roleId; TasksView.render(); };
  window.setResPeriod = (period) => { ResultsView.setPeriod(period); };
  window.toggleTask = (roleId, taskId, freq) => {
    const periodKey = Period.keyFor(freq);
    State.toggleCompletion(roleId, taskId, freq, periodKey);
    TasksView.render();
  };

  if (Auth.checkSession()) { showApp(); }
  else { document.getElementById('app-hint').textContent = 'Connectez-vous (admin / 1234)'; }

  document.getElementById('btn-login').addEventListener('click', () => {
    const u = document.getElementById('login-user').value.trim();
    const p = document.getElementById('login-pw').value;
    const res = Auth.login(u, p);
    if (res.success) { showApp(); }
    else { document.getElementById('app-hint').textContent = '❌ ' + res.error; }
  });

  window.logout = () => {
    Auth.logout();
    document.getElementById('app').classList.add('hidden');
    document.getElementById('login-screen').style.display = 'flex';
  };
});