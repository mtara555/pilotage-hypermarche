import { State } from '../core/state.js';
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
};