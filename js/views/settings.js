import { State } from '../core/state.js';
import { I18n } from '../core/i18n.js';
import { ROLES } from '../config/roles.js';

export const SettingsView = {
  render() {
    const container = document.getElementById('view-container');
    const isAr = I18n.lang === 'ar';
    const isDir = State.user.systemRole === 'directeur';

    if (!isDir) {
      container.innerHTML = '<div style="text-align:center; padding: 50px; color: #64748b;">⛔ ' + (isAr ? 'ليس لديك صلاحية للوصول إلى هذه الصفحة.' : 'Accès refusé. Réservé au Directeur.') + '</div>';
      return;
    }

    // Liste des utilisateurs
    const usersHtml = State.users.map(u => {
      const roleName = u.assignedRoleId ? (ROLES.find(r => r.id === u.assignedRoleId)?.label[I18n.lang] || u.assignedRoleId) : '';
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #e2e8f0;">
          <div>
            <div style="font-weight: bold;">${u.name} <span style="font-size: 11px; color: #64748b;">(@${u.username})</span></div>
            <div style="font-size: 12px; color: #e11d48; font-weight: 600;">${u.systemRole === 'directeur' ? (isAr ? 'مدير' : 'Directeur') : roleName}</div>
          </div>
          ${u.username !== 'admin' ? `<button onclick="window.deleteUser('${u.id}')" style="color: #ef4444; background: none; border: none; cursor: pointer; font-size: 18px;">🗑️</button>` : ''}
        </div>
      `;
    }).join('');

    // Options pour le select des rôles
    const roleOptions = ROLES.map(r => `<option value="${r.id}">${r.label[I18n.lang]}</option>`).join('');

    container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto;">
        <!-- GESTION DES UTILISATEURS -->
        <div class="card" style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; margin-bottom: 15px;">👥 ${isAr ? 'إدارة المستخدمين' : 'Gestion des utilisateurs'}</h3>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px dashed #cbd5e1; margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px; font-size: 14px;">${isAr ? 'إضافة مستخدم جديد' : 'Ajouter un utilisateur'}</h4>
            <input type="text" id="new-user-name" placeholder="${isAr ? 'الاسم الكامل' : 'Nom complet'}" style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <input type="text" id="new-user-username" placeholder="${isAr ? 'اسم المستخدم' : 'Identifiant (login)'}" style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <input type="password" id="new-user-pw" placeholder="${isAr ? 'كلمة المرور' : 'Mot de passe'}" style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
            <select id="new-user-role" style="width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
              ${roleOptions}
            </select>
            <button onclick="window.createUser()" style="padding: 8px 16px; background: #0f172a; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">➕ ${isAr ? 'إنشاء' : 'Créer le compte'}</button>
          </div>
          <div>
            ${usersHtml}
          </div>
        </div>

        <!-- PARAMÈTRES DU MAGASIN -->
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

        <!-- RESET -->
        <div class="card" style="border-left: 4px solid #ef4444;">
          <h3 style="font-size: 16px; margin-bottom: 15px; color: #ef4444;">⚠️ ${isAr ? 'منطقة الخطر' : 'Zone de danger'}</h3>
          <button onclick="window.resetData()" style="padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
            🗑️ ${isAr ? 'إعادة تعيين البيانات' : 'Réinitialiser les données'}
          </button>
        </div>
      </div>
    `;
  }
};