// Tabelas estáticas. Atualize-as se adicionar/remover arquivos nas pastas.

const MANUAIS = [
  { path: 'Manuais/Midi Player Config.pdf', name: 'Midi Player Config.pdf', type: 'pdf' },
  { path: 'Manuais/Manual Musical Beam_eng.pdf', name: 'Manual Musical Beam_eng.pdf', type: 'pdf' },
  { path: 'Manuais/Manual Musical Beam.pdf', name: 'Manual Musical Beam.pdf', type: 'pdf' },
  { path: 'Manuais/Manual Mac Lupa 2024.pdf', name: 'Manual Mac Lupa 2024.pdf', type: 'pdf' },
  { path: 'Manuais/Manual Intrumentos MIDI 17_08_23 .pdf', name: 'Manual Intrumentos MIDI 17_08_23 .pdf', type: 'pdf' },
  { path: 'Manuais/Manual Giro Som_eng.pdf', name: 'Manual Giro Som_eng.pdf', type: 'pdf' },
  { path: 'Manuais/Manual Giro Som.pdf', name: 'Manual Giro Som.pdf', type: 'pdf' },
  { path: 'Manuais/Manual Boasrbells08_eng.pdf', name: 'Manual Boasrbells08_eng.pdf', type: 'pdf' },
  { path: 'Manuais/Manual Boasrbells08.pdf', name: 'Manual Boasrbells08.pdf', type: 'pdf' },
  { path: 'Manuais/Manual Board Som_eng.pdf', name: 'Manual Board Som_eng.pdf', type: 'pdf' },
  { path: 'Manuais/Manual Board Som.pdf', name: 'Manual Board Som.pdf', type: 'pdf' },
  { path: 'Manuais/Manual Big KBD_eng.pdf', name: 'Manual Big KBD_eng.pdf', type: 'pdf' },
  { path: 'Manuais/Manual Big KBD.pdf', name: 'Manual Big KBD.pdf', type: 'pdf' }
];

const DOWNLOADS = [
  {
    path: 'download/PDF- PARTITURAS GRÁTIS SINOS - MARCELO NELLIS.pdf',
    name: 'PDF- PARTITURAS GRÁTIS SINOS - MARCELO NELLIS.pdf',
    type: 'pdf'
  },
  {
    path: 'download/PARTITURA GRÁTIS SINOS - CARLOS.pdf',
    name: 'PARTITURA GRÁTIS SINOS - CARLOS.pdf',
    type: 'pdf'
  }
];

function getIcon(type) {
  switch (type) {
    case 'pdf': return '<i class="far fa-file-pdf" aria-hidden="true"></i>';
    case 'zip': return '<i class="far fa-file-archive" aria-hidden="true"></i>';
    default: return '<i class="far fa-file" aria-hidden="true"></i>';
  }
}

function renderDownloads(tipo) {
  const list = document.getElementById('downloadsList');
  if (!list) return;
  const data = tipo === 'manual' ? MANUAIS : DOWNLOADS;
  if (!data.length) {
    list.innerHTML = '<p>Nenhum arquivo disponível no momento.</p>';
    return;
  }
  list.innerHTML = data.map(file => {
    const encoded = encodeURI(file.path);
    return `
      <div class="download-card">
        ${getIcon(file.type)}
        <div class="download-meta">
          <div class="download-name">${file.name}</div>
          <div class="download-actions">
            <a href="${encoded}" target="_blank" rel="noopener" aria-label="Abrir ${file.name}">
              <i class="fas fa-eye" aria-hidden="true"></i> Abrir
            </a>
            <a href="${encoded}" download aria-label="Baixar ${file.name}">
              <i class="fas fa-download" aria-hidden="true"></i> Baixar
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function initTabs() {
  const url = new URL(window.location.href);
  let tipo = url.searchParams.get('tipo');
  if (tipo !== 'manual' && tipo !== 'download') tipo = 'manual';

  const tabManual = document.getElementById('tab-manual');
  const tabDownload = document.getElementById('tab-download');
  const panel = document.getElementById('panel-lista');

  function selectTab(next) {
    const isManual = next === 'manual';
    tabManual.setAttribute('aria-selected', String(isManual));
    tabDownload.setAttribute('aria-selected', String(!isManual));
    panel.setAttribute('aria-labelledby', isManual ? 'tab-manual' : 'tab-download');
    renderDownloads(next);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('tipo', next);
    history.replaceState(null, '', newUrl.toString());
  }

  tabManual?.addEventListener('click', () => selectTab('manual'));
  tabDownload?.addEventListener('click', () => selectTab('download'));

  // inicial
  selectTab(tipo);
}

document.addEventListener('DOMContentLoaded', initTabs);
