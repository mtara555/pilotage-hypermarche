import fs from 'fs';

// 1. Mettre à jour state.js (Gestion de la liste des utilisateurs)
fs.writeFileSync(
  'js/core/state.js',
  `import { Store } from './storage.js';

export const State = {
  user: null,
  lang: 'fr',
  users: [],
  completions: {},
  customTasks: {},
  company: { nom: 'Hypermarché' },

  init() {
    this.lang = Store.get('hm_lang', 'fr');
    this.users = Store.get('hm_users', []);
    this.completions = Store.get('hm_completions', {});
    this.customTasks = Store.get('hm_custom_tasks', {});
    this.company = Store.get('hm_company', { nom: 'Hypermarché' });

    // Création de l'admin par défaut si aucun utilisateur n'existe
    if (this.users.length === 0) {
      this.users.push({
        id: 'u1', name: 'Directeur', username: 'admin', password: '1234', 
        systemRole: 'directeur', assignedRoleId: null
      });
      this.saveUsers();
    }
  },

  saveUsers() {
    Store.set('hm_users', this.users);
  },

  addUser(user) {
    this.users.push(user);
    this.saveUsers();
  },

  deleteUser(id) {
    this.users = this.users.filter(u => u.id !== id);
    this.saveUsers();
  },

  updateCompany(name) {
    this.company.nom = name;
    Store.set('hm_company', this.company);
  },

  resetAllData() {
    this.completions = {};
    Store.remove('hm_completions');
    Store.remove('hm_custom_tasks');
  },

  saveCompletions() {
    Store.set('hm_completions', this.completions);
  },

  toggleCompletion(roleId, taskId, freq, periodKey) {
    const key = roleId + '::' + taskId + '::' + periodKey;
    if (this.completions[key]) delete this.completions[key];
    else this.completions[key] = true;
    this.saveCompletions();
    return !!this.completions[key];
  },

  isCompleted(roleId, taskId, freq, periodKey) {
    const key = roleId + '::' + taskId + '::' + periodKey;
    return !!this.completions[key];
  },

  getTasks(roleId, baseTasks) {
    const custom = this.customTasks[roleId] || [];
    return [...baseTasks, ...custom];
  },

  addCustomTask(roleId, task) {
    if (!this.customTasks[roleId]) this.customTasks[roleId] = [];
    this.customTasks[roleId].push(task);
    Store.set('hm_custom_tasks', this.customTasks);
  }
};`
);

// 2. Mettre à jour auth.js (Vérification avec la vraie liste)
fs.writeFileSync(
  'js/services/auth.js',
  `import { State } from '../core/state.js';
import { Store } from '../core/storage.js';

export const Auth = {
  login(username, password) {
    const user = State.users.find(u => u.username === username && u.password === password);
    if (user) {
      State.user = user;
      Store.set('hm_session', { userId: user.id });
      return { success: true, user };
    }
    return { success: false, error: 'Identifiant ou mot de passe incorrect.' };
  },
  logout() {
    State.user = null;
    Store.remove('hm_session');
  },
  checkSession() {
    const session = Store.get('hm_session', null);
    if (session) {
      const user = State.users.find(u => u.id === session.userId);
      if (user) { State.user = user; return true; }
    }
    return false;
  }
};`
);

// 3. Mettre à jour layout.js (Afficher le bon nom/rôle)
fs.writeFileSync(
  'js/views/layout.js',
  `import { State } from '../core/state.js';
import { I18n } from '../core/i18n.js';

export const Layout = {
  renderSidebar() {
    const nav = document.getElementById('sidebar-nav');
    const menuItems = [
      { id: 'dashboard', icon: '📊', key: 'menu_dashboard' },
      { id: 'tasks', icon: '✅', key: 'menu_tasks' },
      { id: 'results', icon: '📈', key: 'menu_results' },
      { id: 'reports', icon: '📄', key: 'menu_reports' },
      { id: 'settings', icon: '⚙️', key: 'menu_settings' }
    ];

    nav.innerHTML = menuItems.map(item => \`
      <div class="nav-item" id="nav-\${item.id}" onclick="window.navigate('\${item.id}')">
        <span>\${item.icon}</span> \${I18n.t(item.key)}
      </div>
    \`).join('');

    // Affichage des infos du vrai utilisateur connecté
    document.getElementById('sb-name').textContent = State.company.nom || 'Hypermarché';
    document.getElementById('sb-uname').textContent = State.user.name;
    
    let roleLabel = State.user.systemRole;
    if (State.user.systemRole === 'directeur') roleLabel = I18n.lang === 'ar' ? 'المدير' : 'Directeur';
    else if (State.user.systemRole === 'chef') roleLabel = I18n.lang === 'ar' ? 'رئيس قسم' : 'Chef de secteur';
    else if (State.user.systemRole === 'employe') roleLabel = I18n.lang === 'ar' ? 'موظف' : 'Employé';
    
    document.getElementById('sb-urole').textContent = roleLabel;
    document.getElementById('sb-avatar').textContent = State.user.name.charAt(0).toUpperCase();
  },
  setActive(id) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const active = document.getElementById('nav-' + id);
    if (active) active.classList.add('active');
  }
};`
);

console.log('✅ FONDATIONS UTILISATEURS PRÊTES (Étape 1/2) !');
