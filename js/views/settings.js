import { State } from '../core/state.js';
import { I18n } from '../core/i18n.js';

export const SettingsView = {
  render() {
    const container = document.getElementById('view-container');
    const isAr = I18n.lang === 'ar';

    container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto;">
        <div class="card" style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; margin-bottom: 15px;">🏢 ${isAr ? 'معلومات المتجر' : 'Informations du magasin'}</h3>
          <div style="margin-bottom: 15px;">
            <label style="display: block; font-size: 12px; font-weight: bold; color: #64748b; margin-bottom: 5px;">
              ${isAr ? 'اسم المتجر' : 'Nom de l\'hypermarché'}
            </label>
            <input type="text" id="input-company-name" value="${State.company.nom}" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
          </div>
          <button onclick="window.saveSettings()" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
            ${isAr ? 'حفظ التغييرات' : 'Enregistrer les modifications'}
          </button>
        </div>

        <div class="card" style="border-left: 4px solid #ef4444;">
          <h3 style="font-size: 16px; margin-bottom: 15px; color: #ef4444;">⚠️ ${isAr ? 'منطقة الخطر' : 'Zone de danger'}</h3>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 15px;">
            ${isAr ? 'سيؤدي هذا إلى حذف جميع المهام التي تم تأشيرها اليوم.' : 'Cela supprimera toutes les tâches cochées. Les paramètres et utilisateurs seront conservés.'}
          </p>
          <button onclick="window.resetData()" style="padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
            🗑️ ${isAr ? 'إعادة تعيين البيانات' : 'Réinitialiser les données'}
          </button>
        </div>
      </div>
    `;
  }
};