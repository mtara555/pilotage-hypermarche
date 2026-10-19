import { State } from '../core/state.js';
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

    nav.innerHTML = menuItems.map(item => `
      <div class="nav-item" id="nav-${item.id}" onclick="window.navigate('${item.id}')">
        <span>${item.icon}</span> ${I18n.t(item.key)}
      </div>
    `).join('');

    document.getElementById('sb-name').textContent = State.company.nom || 'Hypermarché';
    document.getElementById('sb-uname').textContent = State.user.name;
    document.getElementById('sb-urole').textContent = State.user.role;
    document.getElementById('sb-avatar').textContent = State.user.name.charAt(0).toUpperCase();
  },
  setActive(id) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const active = document.getElementById('nav-' + id);
    if (active) active.classList.add('active');
  }
};