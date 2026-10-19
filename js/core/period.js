export const Period = {
  todayStr() { return new Date().toISOString().slice(0,10); },
  weekKey() {
    const d = new Date(); const day = d.getDay() || 7;
    d.setDate(d.getDate() - day + 1);
    return 'W-' + d.toISOString().slice(0,10);
  },
  monthKey() { return new Date().toISOString().slice(0,7); },
  keyFor(freq) {
    if (freq === 'Q') return this.todayStr();
    if (freq === 'H') return this.weekKey();
    return this.monthKey();
  }
};