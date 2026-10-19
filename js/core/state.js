import { Store } from './storage.js';

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
};