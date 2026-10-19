export const SECTORS = [
  { id: 'commercial', icon: '🛍️', label: { fr: 'Commercial', ar: 'التجاري' } },
  { id: 'services', icon: '⚙️', label: { fr: 'Services', ar: 'الخدمات' } }
];
export const ROLES = [
  {
    id: 'pgc', sector: 'commercial', icon: '🏢', color: '#059669',
    label: { fr: 'Chef Département PGC', ar: 'رئيس قسم المنتجات' },
    tasks: [
      { id: 'pgc01', freq: 'Q', label: { fr: "Tour des linéaires", ar: "جولة على الأرفف" } },
      { id: 'pgc07', freq: 'H', label: { fr: "Réunion hebdo", ar: "اجتماع أسبوعي" } }
    ]
  },
  {
    id: 'chef_rayon', sector: 'commercial', icon: '📦', color: '#2563eb',
    label: { fr: 'Chef de Rayon', ar: 'رئيس رف' },
    tasks: [
      { id: 'cr01', freq: 'Q', label: { fr: "Commande fournisseur", ar: "طلب المورد" } },
      { id: 'cr08', freq: 'H', label: { fr: "Analyse ventes", ar: "تحليل المبيعات" } }
    ]
  }
];