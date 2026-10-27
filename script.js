/*
 * A PEU D'OBRA · MYSTERY CACHE
 * Personalitza CONFIG abans de publicar a GitHub Pages.
 * Com que és una web estàtica, les respostes i coordenades són visibles al codi font.
 */
const CONFIG = {
  // DADES PROVISIONALS: ajusta-les als valors definitius del teu enigma.
  houseAreaM2: 120,
  pemPerM2: 1200,
  finalCoordinates: 'N 00° 00.000 E 000° 00.000', // SUBSTITUEIX per les coordenades reals
  pemToleranceEuros: 0,
  stages: [
    {
      kicker: 'ETAPA 01 · FONAMENTACIÓ', title: 'Comencem pels fonaments', number: '01', art: 'foundation-art',
      description: 'Abans d’aixecar parets, cal decidir com transmetrem les càrregues al terreny. Per a una casa unifamiliar convencional amb parets de càrrega i un terreny adequat, quina opció encaixa millor amb l’enunciat?',
      choices: [
        { title: 'Sabates corregudes', detail: 'Fonamentació contínua sota les parets de càrrega.' },
        { title: 'Pilots profunds', detail: 'Elements profunds per arribar a estrats resistents.' },
        { title: 'Llosa de fonamentació', detail: 'Una placa contínua sota tota la planta.' }
      ], correct: 0,
      success: 'Correcte! Les sabates corregudes reparteixen les càrregues de les parets al terreny, si les condicions del terreny ho permeten.',
      error: 'No és aquesta. Repassa com es transmeten les càrregues d’una paret de càrrega al terreny.'
    },
    {
      kicker: 'ETAPA 02 · ESTRUCTURA', title: 'Ara toca aixecar la casa', number: '02', art: 'frame-art',
      description: 'Amb la fonamentació resolta, toca definir com treballarà l’estructura. En una solució tradicional amb murs de càrrega, quin sistema de forjat és coherent amb aquest plantejament?',
      choices: [
        { title: 'Forjat unidireccional', detail: 'Biguetes i entrevigat, amb recolzament segons el projecte.' },
        { title: 'Làmina de vidre', detail: 'Un tancament transparent que no resol l’estructura.' },
        { title: 'Panell decoratiu', detail: 'Un acabat de façana sense funció estructural.' }
      ], correct: 0,
      success: 'Molt bé! El forjat unidireccional és una solució habitual, sempre dimensionada i definida pel projecte estructural.',
      error: 'Aquesta opció no resol el sistema estructural descrit. Busca el sistema de forjat que treballa en una direcció.'
    },
    {
      kicker: 'ETAPA 03 · COBERTA', title: 'Que no ens plogui a dins', number: '03', art: 'roof-art',
      description: 'La casa tindrà una coberta inclinada tradicional. Quin acabat de cobertura correspon a la solució descrita?',
      choices: [
        { title: 'Teula àrab', detail: 'Peces ceràmiques corbes col·locades sobre el suport previst.' },
        { title: 'Paviment de parquet', detail: 'Un acabat interior per a terres.' },
        { title: 'Xapa de guix laminat', detail: 'Una placa habitual en envans i sostres interiors.' }
      ], correct: 0,
      success: 'Correcte! La teula àrab és una cobertura tradicional per a cobertes inclinades.',
      error: 'No és el material de cobertura que busquem. Pensa en una teulada inclinada tradicional.'
    },
    {
      kicker: 'ETAPA 04 · FAÇANA', title: 'Tanquem i aïllem', number: '04', art: 'wall-art',
      description: 'Cal resoldre una façana amb tancament ceràmic, aïllament tèrmic exterior i acabat continu. Quina solució coincideix amb la descripció?',
      choices: [
        { title: 'Termoarcilla + SATE', detail: 'Tancament ceràmic, aïllament exterior i acabat de façana.' },
        { title: 'Bloc de formigó vist', detail: 'Sense el sistema d’aïllament exterior indicat.' },
        { title: 'Envà interior de guix', detail: 'Una divisió interior, no una façana completa.' }
      ], correct: 0,
      success: 'Ben vist! El sistema combina el tancament ceràmic amb aïllament tèrmic per l’exterior i l’acabat especificat.',
      error: 'La solució ha d’incloure el tancament ceràmic i l’aïllament tèrmic per l’exterior (SATE).'
    },
    {
      kicker: 'ETAPA 05 · PRESSUPOST', title: 'Fem números', number: '05', art: 'budget-art',
      description: 'Ja tens les solucions constructives. Ara calcula el pressupost d’execució material (PEM) orientatiu multiplicant la superfície construïda pel mòdul de PEM per metre quadrat.',
      budget: true,
      success: 'PEM correcte! Has validat el pressupost i completat el repte.',
      error: 'El càlcul no coincideix. Multiplica els metres quadrats pel mòdul de PEM indicat i introdueix el resultat en euros.'
    }
  ]
};

let currentStage = 0;
let selectedChoice = null;
let completed = new Set();
let budgetValidated = false;
const $ = (id) => document.getElementById(id);
const money = (n) => new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const expectedPEM = CONFIG.houseAreaM2 * CONFIG.pemPerM2;

function renderIllustration(art) {
  const classes = ['construct', art || ''];
  $('illustration').innerHTML = `<div class="${classes.join(' ')}"><div class="block a"></div><div class="block b"></div><div class="block c"></div></div>`;
}
function renderStage() {
  const stage = CONFIG.stages[currentStage];
  selectedChoice = null;
  $('stage-kicker').textContent = stage.kicker;
  $('stage-title').textContent = stage.title;
  $('stage-number').textContent = stage.number;
  $('stage-description').textContent = stage.description;
  renderIllustration(stage.art);
  $('feedback').textContent = '';
  $('feedback').className = 'feedback';
  $('check-button').classList.remove('hidden');
  $('check-button').disabled = true;
  $('next-button').classList.add('hidden');
  $('choices').innerHTML = '';

  if (stage.budget) {
    $('illustration').innerHTML = `<div class="construct budget-art"><div class="block a"></div><div class="block b"></div><div class="block c"></div></div>`;
    const box = document.createElement('div');
    box.className = 'budget-entry';
    box.innerHTML = `<label for="pem-input">PEM total (€)</label><input id="pem-input" type="number" inputmode="numeric" min="0" step="1" placeholder="Ex.: 144000"><p class="budget-hint">Superfície: <strong>${CONFIG.houseAreaM2} m²</strong> · Mòdul orientatiu: <strong>${money(CONFIG.pemPerM2)}/m²</strong></p>`;
    $('choices').appendChild(box);
    $('pem-input').addEventListener('input', () => { $('check-button').disabled = !$('pem-input').value.trim(); });
  } else {
    stage.choices.forEach((choice, i) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'choice';
      button.innerHTML = `<span class="choice-letter">${String.fromCharCode(65+i)}</span><strong>${choice.title}</strong><small>${choice.detail}</small>`;
      button.addEventListener('click', () => {
        selectedChoice = i;
        document.querySelectorAll('.choice').forEach(el => el.classList.remove('selected'));
        button.classList.add('selected'); $('check-button').disabled = false;
        $('feedback').textContent = ''; $('feedback').className = 'feedback';
      });
      $('choices').appendChild(button);
    });
  }
  updateProgress();
}
function updateProgress() {
  const count = completed.size;
  const percent = Math.round(count / CONFIG.stages.length * 100);
  $('progress-label').textContent = `ETAPA ${String(currentStage+1).padStart(2,'0')} DE 05`;
  $('progress-percent').textContent = `${percent}% completat`;
  $('progress-fill').style.width = `${percent}%`;
  $('side-count').textContent = `${count} / 5`;
  $('side-budget').textContent = budgetValidated ? money(expectedPEM) : 'Pendent';
  [...$('step-dots').children].forEach((dot, i) => {
    dot.classList.toggle('active', i === currentStage);
    dot.classList.toggle('done', completed.has(i));
  });
}
function showFeedback(ok, message) {
  $('feedback').textContent = message;
  $('feedback').className = `feedback ${ok ? 'good' : 'bad'}`;
}
function checkAnswer() {
  const stage = CONFIG.stages[currentStage];
  if (stage.budget) {
    const value = Number($('pem-input').value);
    const ok = Number.isFinite(value) && Math.abs(value - expectedPEM) <= CONFIG.pemToleranceEuros;
    if (!ok) { showFeedback(false, `${stage.error} El resultat esperat és ${money(expectedPEM)}.`); return; }
    budgetValidated = true;
  } else if (selectedChoice !== stage.correct) {
    showFeedback(false, stage.error); return;
  }
  completed.add(currentStage);
  showFeedback(true, stage.success);
  $('check-button').classList.add('hidden');
  $('next-button').classList.remove('hidden');
  $('next-button').textContent = currentStage === CONFIG.stages.length - 1 ? 'Veure les coordenades ✓' : 'Continua →';
  updateProgress();
}
function nextStage() {
  if (currentStage < CONFIG.stages.length - 1) { currentStage++; renderStage(); return; }
  $('stage-card').classList.add('hidden');
  $('result-card').classList.remove('hidden');
  $('coordinates').textContent = CONFIG.finalCoordinates;
  $('progress-label').textContent = 'REPTE COMPLETAT';
  $('progress-percent').textContent = '100% completat';
  $('progress-fill').style.width = '100%';
  [...$('step-dots').children].forEach(dot => dot.classList.add('done'));
  window.scrollTo({ top: $('result-card').offsetTop - 30, behavior: 'smooth' });
}
function restart() {
  currentStage = 0; selectedChoice = null; completed = new Set(); budgetValidated = false;
  $('stage-card').classList.remove('hidden'); $('result-card').classList.add('hidden');
  renderStage(); window.scrollTo({ top: $('progress-wrap')?.offsetTop || 0, behavior: 'smooth' });
}
$('check-button').addEventListener('click', checkAnswer);
$('next-button').addEventListener('click', nextStage);
$('restart-button').addEventListener('click', restart);
$('copy-coordinates').addEventListener('click', async () => {
  const text = CONFIG.finalCoordinates;
  try { await navigator.clipboard.writeText(text); $('copy-coordinates').textContent = 'Copiades!'; }
  catch { $('copy-coordinates').textContent = text; }
});
renderStage();
