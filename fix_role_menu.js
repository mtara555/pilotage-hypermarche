import fs from 'fs';

// 1. On met à jour state.js pour corriger les anciens utilisateurs automatiquement
let stateJs = fs.readFileSync('js/core/state.js', 'utf8');

if (!stateJs.includes('Migration des anciens rôles')) {
  stateJs = stateJs.replace(
    "this.users = Store.get('hm_users', []);",
    `this.users = Store.get('hm_users', []);
    
    // Migration des anciens rôles (role -> systemRole)
    let needsSave = false;
    this.users = this.users.map(u => {
      if (!u.systemRole && u.role) {
        u.systemRole = u.role;
        needsSave = true;
      }
      return u;
    });
    if (needsSave) this.saveUsers();`
  );
  fs.writeFileSync('js/core/state.js', stateJs);
}

// 2. On s'assure que layout.js a bien la condition pour le menu
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
      ...(State.user.systemRole === 'directeur' ? [{ id: 'settings', icon: '⚙️', key: 'menu_settings' }] : [])
    ];

    nav.innerHTML = menuItems.map(item => \`
      <div class="nav-item" id="nav-\${item.id}" onclick="window.navigate('\${item.id}')">
        <span>\${item.icon}</span> \${I18n.t(item.key)}
      </div>
    \`).join('');

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

console.log('✅ CORRECTION DU MENU APPLIQUÉE !');
