const TRANSLATIONS = {
  fr: {
    menu_dashboard: "Tableau de bord",
    menu_tasks: "Suivi des tâches",
    menu_results: "Résultats",
    menu_reports: "Rapports",
    menu_settings: "Paramètres",
    logout: "Déconnexion",
    select_role: "Sélectionnez une fonction :",
    check_tasks: "Cochez les tâches au fur et à mesure de la journée.",
    perf_analysis: "Analyse des performances",
    today: "Aujourd'hui",
    this_week: "Cette semaine",
    this_month: "Ce mois",
    global_rate: "Taux global",
    tasks_done: "Tâches réalisées",
    detail_by_role: "Détail par fonction",
    add_task: "Ajouter une tâche",
    task_name: "Nom de la tâche",
    frequency: "Fréquence",
    save: "Enregistrer",
    cancel: "Annuler",
    daily: "Quotidien",
    weekly: "Hebdomadaire",
    monthly: "Mensuel"
  },
  ar: {
    menu_dashboard: "لوحة التحكم",
    menu_tasks: "متابعة المهام",
    menu_results: "النتائج",
    menu_reports: "التقارير",
    menu_settings: "الإعدادات",
    logout: "تسجيل الخروج",
    select_role: "اختر قسماً :",
    check_tasks: "قم بتأشير المهام على مدار اليوم.",
    perf_analysis: "تحليل الأداء",
    today: "اليوم",
    this_week: "هذا الأسبوع",
    this_month: "هذا الشهر",
    global_rate: "النسبة الإجمالية",
    tasks_done: "المهام المنجزة",
    detail_by_role: "التفصيل حسب القسم",
    add_task: "إضافة مهمة",
    task_name: "اسم المهمة",
    frequency: "التكرار",
    save: "حفظ",
    cancel: "إلغاء",
    daily: "يومي",
    weekly: "أسبوعي",
    monthly: "شهري"
  }
};

export const I18n = {
  lang: 'fr',
  init() {
    this.lang = localStorage.getItem('hm_lang') || 'fr';
    this.applyDir();
  },
  set(lang) {
    this.lang = lang;
    localStorage.setItem('hm_lang', lang);
    this.applyDir();
  },
  t(key) {
    return TRANSLATIONS[this.lang][key] || key;
  },
  applyDir() {
    document.documentElement.lang = this.lang;
    document.documentElement.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
  }
};