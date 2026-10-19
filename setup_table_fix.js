import fs from 'fs';

// On réécrit entièrement la fin de components.css pour corriger les tableaux (écran + impression)
const cssFix = `
/* --- CORRECTION COMPLETE DES TABLEAUX (ÉCRAN ET PDF) --- */
.print-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background: white;
}
.print-table th,
.print-table td {
  border: 1px solid #cbd5e1;
  padding: 12px 15px;
  font-size: 14px;
  vertical-align: middle;
}
.print-table th {
  background-color: #f8fafc;
  font-weight: 800;
  color: #0f172a;
}

/* Alignement selon la langue */
[dir="rtl"] .print-table th, [dir="rtl"] .print-table td { text-align: right; }
[dir="ltr"] .print-table th, [dir="ltr"] .print-table td { text-align: left; }
.print-table .text-center { text-align: center !important; }

/* Styles spécifiques à l'impression PDF */
@media print {
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
  .no-print { display: none !important; }
  .report-doc { box-shadow: none !important; border: none !important; padding: 0 !important; max-width: 100% !important; }
  .report-title, .report-meta { display: none !important; }
  .print-header { display: block !important; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px; }
  
  table { display: table !important; width: 100% !important; border-collapse: collapse !important; }
  thead { display: table-header-group !important; }
  tbody { display: table-row-group !important; }
  tr { display: table-row !important; page-break-inside: avoid; }
  th, td { 
    display: table-cell !important; 
    border: 1px solid #000 !important; 
    padding: 8px !important; 
  }
  th { background-color: #f2f2f2 !important; }
}
`;

// On ajoute ça à la fin de components.css
fs.appendFileSync('css/components.css', cssFix);

// On s'assure que le tableau dans reports.js utilise bien ces classes
let reportsJs = fs.readFileSync('js/views/reports.js', 'utf8');
// On nettoie les anciens styles inline qui pourraient gêner
reportsJs = reportsJs.replace(/style="text-align: center;"/g, 'class="text-center"');
reportsJs = reportsJs.replace(/style="text-align: center; font-size: 18px; font-weight: bold; color: \${isDone \? '#10b981' : '#ef4444'};"/g, 'class="text-center" style="font-size: 18px; font-weight: bold; color: ${isDone ? "#10b981" : "#ef4444"}";');
fs.writeFileSync('js/views/reports.js', reportsJs);

console.log('✅ TABLEAUX CORRIGÉS (Affichage écran + PDF) !');