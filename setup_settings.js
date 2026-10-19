import fs from 'fs';

// 1. Mettre à jour le State pour sauvegarder le nom de l'entreprise
let stateJs = fs.readFileSync('js/core/state.js', 'utf8');
if (!stateJs.includes('updateCompany')) {
  stateJs = stateJs.replace(
    'saveCompletions() {',
    `updateCompany(name) {
    this.company.nom = name;
    Store.set('hm_company', this.company);
  },

  resetAllData() {
    this.completions = {};
    Store.remove('hm_completions');
    Store.remove('hm_custom_tasks');
  },

  saveCompletions() {`
  );
  fs.writeFileSync('js/core/state.js', stateJs);
}

// 2. Créer settings.js
fs.writeFileSync(
  'js/views/settings.js',
  `import { State } from '../core/state.js';
import { I18n } from '../core/i18n.js';

export const SettingsView = {
  render() {
    const container = document.getElementById('view-container');
    const isAr = I18n.lang === 'ar';

    container.innerHTML = \`
      <div style="max-width: 600px; margin: 0 auto;">
        <div class="card" style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; margin-bottom: 15px;">🏢 \${isAr ? 'معلومات المتجر' : 'Informations du magasin'}</h3>
          <div style="margin-bottom: 15px;">
            <label style="display: block; font-size: 12px; font-weight: bold; color: #64748b; margin-bottom: 5px;">
              \${isAr ? 'اسم المتجر' : 'Nom de l\\'hypermarché'}
            </label>
            <input type="text" id="input-company-name" value="\${State.company.nom}" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
          </div>
          <button onclick="window.saveSettings()" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
            \${isAr ? 'حفظ التغييرات' : 'Enregistrer les modifications'}
          </button>
        </div>

        <div class="card" style="border-left: 4px solid #ef4444;">
          <h3 style="font-size: 16px; margin-bottom: 15px; color: #ef4444;">⚠️ \${isAr ? 'منطقة الخطر' : 'Zone de danger'}</h3>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 15px;">
            \${isAr ? 'سيؤدي هذا إلى حذف جميع المهام التي تم تأشيرها اليوم.' : 'Cela supprimera toutes les tâches cochées. Les paramètres et utilisateurs seront conservés.'}
          </p>
          <button onclick="window.resetData()" style="padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
            🗑️ \${isAr ? 'إعادة تعيين البيانات' : 'Réinitialiser les données'}
          </button>
        </div>
      </div>
    \`;
  }
};`
);

// 3. Mettre à jour layout.js pour afficher le vrai nom du magasin
let layoutJs = fs.readFileSync('js/views/layout.js', 'utf8');
layoutJs = layoutJs.replace(
  "document.getElementById('sb-uname').textContent = State.user.name;",
  `document.getElementById('sb-name').textContent = State.company.nom || 'Hypermarché';
    document.getElementById('sb-uname').textContent = State.user.name;`
);
fs.writeFileSync('js/views/layout.js', layoutJs);

// 4. Mettre à jour app.js pour inclure la vue et les actions
let appJs = fs.readFileSync('js/app.js', 'utf8');

// Import
if (!appJs.includes('import { SettingsView }')) {
  appJs = appJs.replace(
    "import { ReportsView } from './views/reports.js';",
    "import { ReportsView } from './views/reports.js';\nimport { SettingsView } from './views/settings.js';"
  );
}

// Route
if (!appJs.includes('SettingsView.render()')) {
  appJs = appJs.replace(
    "else { tbTitle.textContent = I18n.t(view); container.innerHTML = '<h2>Vue ' + I18n.t(view) + ' en construction...</h2>'; }",
    `else if (view === 'settings') { tbTitle.textContent = I18n.t('menu_settings'); SettingsView.render(); }
      else { tbTitle.textContent = I18n.t(view); container.innerHTML = '<h2>Vue ' + I18n.t(view) + ' en construction...</h2>'; }`
  );
}

// Actions globales
if (!appJs.includes('window.saveSettings')) {
  appJs = appJs.replace(
    'window.selectRole = (roleId) => {',
    `window.saveSettings = () => {
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

  window.selectRole = (roleId) => {`
  );
}
fs.writeFileSync('js/app.js', appJs);

console.log('✅ VUE PARAMÈTRES générée avec succès !');
