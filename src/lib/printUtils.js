/**
 * AvisAuto — Utilitaires d'impression
 * Génère une fenêtre d'impression propre sans librairie externe.
 */

function openPrintWindow(title, bodyHTML) {
  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) {
    alert('Autorisez les popups pour imprimer.');
    return;
  }

  win.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: #1e293b;
      background: #fff;
      padding: 32px;
      font-size: 13px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding-bottom: 16px;
      border-bottom: 2px solid #3b82f6;
      margin-bottom: 24px;
    }
    .logo { font-size: 20px; font-weight: 800; color: #3b82f6; letter-spacing: -0.5px; }
    .meta { text-align: right; color: #64748b; font-size: 11px; }
    .meta strong { display: block; font-size: 14px; color: #1e293b; font-weight: 700; }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
      margin: 24px 0 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .section-title .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .dot-green { background: #22c55e; }
    .dot-amber { background: #f59e0b; }
    .dot-blue  { background: #3b82f6; }
    /* Reviews */
    .review-card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 14px;
      break-inside: avoid;
    }
    .review-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .reviewer { font-weight: 700; font-size: 13px; color: #1e293b; }
    .date { font-size: 11px; color: #94a3b8; }
    .stars { color: #f59e0b; font-size: 14px; letter-spacing: 1px; }
    .badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 20px;
    }
    .badge-published { background: #dcfce7; color: #16a34a; }
    .badge-draft     { background: #fef9c3; color: #ca8a04; }
    .badge-pending   { background: #f1f5f9; color: #64748b; }
    .review-text {
      color: #475569;
      font-style: italic;
      margin: 8px 0;
      padding: 8px 12px;
      background: #f8fafc;
      border-left: 3px solid #cbd5e1;
      border-radius: 0 6px 6px 0;
    }
    .response-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #3b82f6;
      margin: 10px 0 4px;
    }
    .response-text {
      color: #1e293b;
      padding: 8px 12px;
      background: #eff6ff;
      border-left: 3px solid #3b82f6;
      border-radius: 0 6px 6px 0;
    }
    /* Insights */
    .strength-card {
      border: 1px solid #bbf7d0;
      background: #f0fdf4;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 10px;
      break-inside: avoid;
    }
    .strength-name { font-weight: 700; color: #15803d; margin-bottom: 3px; }
    .strength-highlight { font-size: 11px; color: #16a34a; margin-bottom: 6px; }
    .strength-count { font-size: 10px; color: #64748b; }
    .theme-card {
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 10px;
      break-inside: avoid;
    }
    .theme-high   { border: 1px solid #fecaca; background: #fff5f5; }
    .theme-medium { border: 1px solid #fde68a; background: #fffbeb; }
    .theme-low    { border: 1px solid #bfdbfe; background: #eff6ff; }
    .theme-name { font-weight: 700; margin-bottom: 4px; }
    .theme-high .theme-name   { color: #b91c1c; }
    .theme-medium .theme-name { color: #92400e; }
    .theme-low .theme-name    { color: #1d4ed8; }
    .example { font-size: 11px; color: #64748b; font-style: italic; margin-top: 4px; }
    .rec-card {
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 10px;
      break-inside: avoid;
      display: flex;
      gap: 10px;
    }
    .rec-priority {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 20px;
      white-space: nowrap;
      align-self: flex-start;
      flex-shrink: 0;
    }
    .prio-urgent    { background: #fee2e2; color: #b91c1c; }
    .prio-important { background: #fef9c3; color: #92400e; }
    .prio-suggéré   { background: #dbeafe; color: #1d4ed8; }
    .rec-title { font-weight: 700; font-size: 13px; color: #1e293b; margin-bottom: 3px; }
    .rec-desc { font-size: 11px; color: #475569; }
    .summary-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      padding: 14px 16px;
      color: #1e293b;
      margin-bottom: 20px;
    }
    .summary-label { font-size: 10px; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .footer {
      margin-top: 32px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
    }
    @media print {
      body { padding: 16px; }
      @page { margin: 1.5cm; size: A4; }
    }
  </style>
</head>
<body>
${bodyHTML}
<script>
  window.onload = function() {
    window.print();
    window.onafterprint = function() { window.close(); };
  };
<\/script>
</body>
</html>`);
  win.document.close();
}

function starsHTML(rating) {
  const full = Math.round(rating || 0);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function formatDateFR(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function badgeClass(status) {
  if (status === 'published') return 'badge-published';
  if (status === 'draft') return 'badge-draft';
  return 'badge-pending';
}

function badgeLabel(status) {
  if (status === 'published') return 'Publié';
  if (status === 'draft') return 'Brouillon';
  return 'En attente';
}

// ─── Print Reviews ────────────────────────────────────────────────────────────

export function printReviews(reviews, companyName) {
  const withResponse = reviews.filter(r => r.generated_text || r.final_text);

  if (withResponse.length === 0) {
    alert('Aucun avis avec réponse à imprimer. Générez d\'abord des réponses.');
    return;
  }

  const today = formatDateFR(new Date().toISOString());

  const reviewsHTML = withResponse.map(r => {
    const responseText = r.final_text || r.generated_text || '';
    const status = r.response_status || r.status || 'pending';
    return `
      <div class="review-card">
        <div class="review-header">
          <div>
            <span class="reviewer">${r.author_name || 'Anonyme'}</span>
            <span class="stars" style="margin-left:8px">${starsHTML(r.rating)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="date">${formatDateFR(r.review_date || r.created_at)}</span>
            <span class="badge ${badgeClass(status)}">${badgeLabel(status)}</span>
          </div>
        </div>
        ${r.text ? `<p class="review-text">"${r.text}"</p>` : '<p style="color:#94a3b8;font-size:11px;margin:6px 0">Aucun commentaire</p>'}
        ${responseText ? `
          <div class="response-label">✦ Réponse AvisAuto</div>
          <div class="response-text">${responseText}</div>
        ` : ''}
      </div>`;
  }).join('');

  const body = `
    <div class="header">
      <div>
        <div class="logo">AvisAuto</div>
        <div style="font-size:12px;color:#64748b;margin-top:2px">Rapport des avis Google</div>
      </div>
      <div class="meta">
        <strong>${companyName || 'Mon Établissement'}</strong>
        Généré le ${today}<br/>
        ${withResponse.length} avis avec réponse
      </div>
    </div>
    <div class="section-title">
      <span class="dot dot-blue"></span>
      Avis &amp; Réponses générées (${withResponse.length})
    </div>
    ${reviewsHTML}
    <div class="footer">AvisAuto — avisauto.app · Rapport généré le ${today}</div>`;

  openPrintWindow(`Avis Google — ${companyName}`, body);
}

// ─── Print Insights ───────────────────────────────────────────────────────────

export function printInsights(analysis, companyName) {
  if (!analysis) return;

  const today = formatDateFR(new Date().toISOString());

  const strengthsHTML = analysis.strengths && analysis.strengths.length > 0
    ? `
      <div class="section-title"><span class="dot dot-green"></span> Points forts (${analysis.strengths.length})</div>
      <div class="grid-2">
        ${analysis.strengths.map(s => `
          <div class="strength-card">
            <div class="strength-name">🏆 ${s.name}</div>
            ${s.highlight ? `<div class="strength-highlight">${s.highlight}</div>` : ''}
            <div class="strength-count">${s.count} mentions clients</div>
            ${s.examples ? s.examples.slice(0, 1).map(ex => `<div class="example">"${ex}"</div>`).join('') : ''}
          </div>`).join('')}
      </div>`
    : '';

  const themesHTML = analysis.themes && analysis.themes.length > 0
    ? `
      <div class="section-title"><span class="dot dot-amber"></span> Axes d'amélioration (${analysis.themes.length})</div>
      <div class="grid-2">
        ${analysis.themes.map(t => `
          <div class="theme-card theme-${t.severity || 'medium'}">
            <div class="theme-name">${t.name}</div>
            <div style="font-size:11px;color:#64748b">${t.count} avis concernés</div>
            ${t.examples ? t.examples.slice(0, 1).map(ex => `<div class="example">"${ex}"</div>`).join('') : ''}
          </div>`).join('')}
      </div>`
    : '';

  const recsHTML = analysis.recommendations && analysis.recommendations.length > 0
    ? `
      <div class="section-title"><span class="dot dot-blue"></span> Plan d'action personnalisé</div>
      ${analysis.recommendations.map(r => `
        <div class="rec-card">
          <span class="rec-priority prio-${r.priority || 'suggéré'}">${
            r.priority === 'urgent' ? 'Urgent' : r.priority === 'important' ? 'Important' : 'Suggéré'
          }</span>
          <div>
            <div class="rec-title">${r.title}</div>
            <div class="rec-desc">${r.description}</div>
          </div>
        </div>`).join('')}`
    : '';

  const body = `
    <div class="header">
      <div>
        <div class="logo">AvisAuto</div>
        <div style="font-size:12px;color:#64748b;margin-top:2px">Rapport d'analyse & recommandations</div>
      </div>
      <div class="meta">
        <strong>${companyName || 'Mon Établissement'}</strong>
        Généré le ${today}
        ${analysis.positive_count ? `<br/>${analysis.positive_count} avis positifs · ${analysis.review_count || 0} avis négatifs` : ''}
      </div>
    </div>
    ${analysis.summary ? `
      <div class="summary-box">
        <div class="summary-label">Résumé</div>
        ${analysis.summary}
      </div>` : ''}
    ${strengthsHTML}
    ${themesHTML}
    ${recsHTML}
    <div class="footer">AvisAuto — avisauto.app · Rapport généré le ${today}</div>`;

  openPrintWindow(`Rapport Insights — ${companyName}`, body);
}
