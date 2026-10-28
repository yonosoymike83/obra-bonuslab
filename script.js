/*
 * A PEU D'OBRA · MYSTERY CACHE
 * Personalitza CONFIG abans de publicar.
 * En una web estàtica, les respostes i les coordenades són visibles al codi font.
 */
const CONFIG = {
  houseAreaM2: 120,
  pemPerM2: 1200,
  finalCoordinates: 'N 00° 00.000 E 000° 00.000', // SUBSTITUEIX per les coordenades definitives
  pemToleranceEuros: 0,
  stages: [
    {
      id:'foundation', title:'Fonamentació', subtitle:'Sota rasant', question:'Quin sistema de fonamentació encaixa amb una casa amb murs de càrrega i un terreny adequat?',
      description:'La fonamentació transmet les càrregues de l’edifici al terreny.', correct:0, art:'foundation',
      choices:[
        {title:'Sabates corregudes',detail:'Suport continu sota els murs de càrrega.',art:'strip'},
        {title:'Sabates aïllades',detail:'Suports puntuals habituals sota pilars.',art:'isolated'},
        {title:'Llosa de fonamentació',detail:'Una placa contínua sota bona part o tota la planta.',art:'raft'}
      ],
      success:'Les sabates corregudes reparteixen de manera contínua les càrregues dels murs al terreny, si el càlcul i el terreny ho permeten.'
    },
    {
      id:'structure', title:'Estructura', subtitle:'Forjats i càrregues', question:'En una solució tradicional amb murs de càrrega, quin sistema de forjat és coherent amb el plantejament?',
      description:'El forjat recull les càrregues dels pisos i les transmet als elements de suport.', correct:0, art:'structure',
      choices:[
        {title:'Forjat unidireccional',detail:'Biguetes i entrevigat que treballen principalment en una direcció.',art:'joists'},
        {title:'Envà de guix laminat',detail:'Divisió interior que no fa la funció del forjat.',art:'partition'},
        {title:'Fals sostre registrable',detail:'Acabat interior suspès, no estructura del pis.',art:'ceiling'}
      ],
      success:'El forjat unidireccional és una solució habitual. La seva configuració i armadures s’han de definir segons el projecte estructural.'
    },
    {
      id:'roof', title:'Coberta', subtitle:'Protecció superior', question:'La casa tindrà una coberta inclinada tradicional. Quin material és adequat com a cobertura?',
      description:'La coberta protegeix l’edifici de la pluja i evacua l’aigua cap als punts de recollida.', correct:0, art:'roof',
      choices:[
        {title:'Teula àrab',detail:'Peces ceràmiques corbes col·locades sobre el suport i les capes previstes.',art:'tiles'},
        {title:'Parquet de fusta',detail:'Paviment d’acabat per a interiors.',art:'parquet'},
        {title:'Placa de guix',detail:'Placa habitual en envans i sostres interiors.',art:'plaster'}
      ],
      success:'La teula àrab és una cobertura tradicional per a cobertes inclinades. Cal resoldre també impermeabilització, suport i evacuació d’aigua segons el sistema.'
    },
    {
      id:'facade', title:'Façana', subtitle:'Tancament i aïllament', question:'Quina solució combina tancament ceràmic, aïllament tèrmic exterior i acabat continu?',
      description:'La façana separa l’interior de l’exterior i contribueix al confort tèrmic i a la protecció davant la intempèrie.', correct:0, art:'facade',
      choices:[
        {title:'Tancament + SATE',detail:'Full de fàbrica, aïllament exterior i capa d’acabat armada.',art:'sate'},
        {title:'Bloc de formigó vist',detail:'Tancament sense el sistema d’aïllament exterior indicat.',art:'block'},
        {title:'Envà interior',detail:'Divisió interior que no resol una façana completa.',art:'partition'}
      ],
      success:'El SATE incorpora l’aïllament per la cara exterior del tancament, amb capes i fixacions definides pel sistema seleccionat.'
    },
    {
      id:'budget', title:'Pressupost final', subtitle:'PEM de l’obra', question:'Calcula el pressupost d’execució material amb la superfície i el mòdul indicats.',
      description:'Multiplica la superfície construïda pel mòdul orientatiu de PEM per metre quadrat.', correct:'budget', art:'budget', budget:true,
      success:'El PEM coincideix amb el pressupost previst.'
    }
  ]
};

const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat('ca-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const expectedPEM = CONFIG.houseAreaM2 * CONFIG.pemPerM2;
let currentStage = 0;
let selections = {}; // choices are held until final review
let wrongStages = new Set();

const stageNames = CONFIG.stages.map(s=>s.title);
function svgWrap(content, label='') {
  return `<svg viewBox="0 0 360 210" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="concreteShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0e0e0"/><stop offset="1" stop-color="#777"/></linearGradient><linearGradient id="soilShade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#66584a"/><stop offset="1" stop-color="#302a25"/></linearGradient></defs>${content}</svg>`;
}
function artSvg(type, variant='main') {
  const soil = `<path d="M20 146 L180 190 L340 145 L180 101Z" fill="url(#soilShade)" stroke="#8b7968"/><path d="M20 163 L180 207 L340 162" fill="none" stroke="#8b7968" stroke-dasharray="4 5"/>`;
  const foundation = {
    strip:`${soil}<path d="M92 90 L180 115 L268 89 L180 64Z" fill="#d9d9d9" stroke="#f3f3f3"/><path d="M92 90 V128 L180 154 V115Z" fill="#888" stroke="#ccc"/><path d="M180 115 V154 L268 128 V89Z" fill="#666" stroke="#aaa"/><path d="M120 48 L180 65 L240 48 L180 31Z" fill="#d1c7b6" stroke="#eee"/><path d="M120 48 V87 L180 105 V65Z" fill="#8b8173" stroke="#c9c0b4"/><path d="M180 65 V105 L240 87 V48Z" fill="#aaa092" stroke="#ded6ca"/><path d="M110 105 L180 125 L250 104" stroke="#555" stroke-width="3" fill="none"/><path d="M110 113 L180 133 L250 112" stroke="#555" stroke-width="3" fill="none"/><path d="M120 102 V117 M140 108 V123 M160 114 V129 M180 120 V135 M200 114 V129 M220 108 V123 M240 102 V117" stroke="#555" stroke-width="2"/>`,
    isolated:`${soil}<path d="M75 122 L130 138 L165 128 L110 112Z" fill="#ddd" stroke="#fff"/><path d="M75 122 V144 L130 160 V138Z" fill="#888" stroke="#bbb"/><path d="M130 138 V160 L165 150 V128Z" fill="#666" stroke="#aaa"/><path d="M195 100 L250 116 L285 106 L230 90Z" fill="#ddd" stroke="#fff"/><path d="M195 100 V122 L250 138 V116Z" fill="#888" stroke="#bbb"/><path d="M250 116 V138 L285 128 V106Z" fill="#666" stroke="#aaa"/><path d="M105 63 L122 68 L122 120 L105 115Z" fill="#c6bba8"/><path d="M220 43 L237 48 L237 98 L220 93Z" fill="#c6bba8"/><path d="M105 63 L122 68 L237 48 L220 43Z" fill="#eee3d0"/>`,
    raft:`${soil}<path d="M70 115 L180 147 L290 115 L180 83Z" fill="#ddd" stroke="#fff"/><path d="M70 115 V133 L180 166 V147Z" fill="#888" stroke="#bbb"/><path d="M180 147 V166 L290 133 V115Z" fill="#666" stroke="#aaa"/><path d="M98 70 L180 94 L262 70 L180 46Z" fill="#c9bda9" stroke="#eee"/><path d="M98 70 V111 L180 135 V94Z" fill="#978a78" stroke="#cbbda9"/><path d="M180 94 V135 L262 111 V70Z" fill="#b1a28e" stroke="#e3d8c7"/><path d="M83 121 L180 150 L277 121 M100 126 L180 150 L260 126 M115 131 L180 150 L245 131" stroke="#555" stroke-width="2" fill="none"/>`
  };
  const structure = {
    joists:`<path d="M35 148 L180 190 L325 148 L180 106Z" fill="#3d3833" stroke="#766d63"/><path d="M58 125 L180 160 L302 125 L180 90Z" fill="#c4c4c4" stroke="#eee"/><path d="M58 125 L58 145 L180 180 L180 160Z" fill="#777" stroke="#aaa"/><path d="M180 160 L180 180 L302 145 L302 125Z" fill="#666" stroke="#999"/><path d="M74 119 L196 154 M100 112 L222 147 M126 104 L248 139 M152 97 L274 132" stroke="#555" stroke-width="6"/><path d="M74 119 L74 139 M100 112 L100 132 M126 104 L126 124 M152 97 L152 117" stroke="#ddd" stroke-width="1.5"/><path d="M70 77 L180 109 L290 77 L180 45Z" fill="#d4c6ad" stroke="#eee"/><path d="M70 77 V111 L180 143 V109Z" fill="#8c8170" stroke="#bdb09d"/><path d="M180 109 V143 L290 111 V77Z" fill="#a79a86" stroke="#d6c9b7"/>`,
    partition:`<path d="M85 65 L195 97 L275 73 L165 41Z" fill="#d4d4d4" stroke="#eee"/><path d="M85 65 V145 L195 177 V97Z" fill="#777" stroke="#bbb"/><path d="M195 97 V177 L275 153 V73Z" fill="#999" stroke="#ccc"/><path d="M100 78 L100 143 M117 83 L117 148 M134 88 L134 153 M151 93 L151 158 M168 98 L168 163" stroke="#bdbdbd" stroke-width="2"/>`,
    ceiling:`<path d="M50 80 L180 118 L310 80 L180 42Z" fill="#ddd" stroke="#fff"/><path d="M50 80 V98 L180 136 V118Z" fill="#777" stroke="#aaa"/><path d="M180 118 V136 L310 98 V80Z" fill="#555" stroke="#888"/><path d="M65 85 L180 119 L295 85 M95 75 L180 100 L265 75" stroke="#888" stroke-width="2" fill="none"/><path d="M75 130 L180 161 L285 130" stroke="#777" stroke-width="3" fill="none"/>`
  };
  const roof = {
    tiles:`<path d="M65 130 L180 40 L295 130 L180 169Z" fill="#8e8e8e" stroke="#ddd"/><path d="M65 130 L180 40 L180 62 L88 136Z" fill="#d1d1d1"/><path d="M180 40 L295 130 L272 138 L180 62Z" fill="#777"/><path d="M88 136 L180 62 L272 138 L180 169Z" fill="#a5a5a5"/><g stroke="#555" stroke-width="2" fill="none"><path d="M103 124 L193 157 M122 108 L214 150 M141 92 L235 143 M160 77 L255 137 M179 62 L275 131"/><path d="M111 94 L206 127 M132 77 L228 112 M153 61 L250 96"/></g><path d="M65 130 L180 169 L295 130" fill="none" stroke="#eee" stroke-width="3"/>`,
    parquet:`<path d="M60 130 L180 166 L300 130 L180 94Z" fill="#a58a68" stroke="#ddd"/><path d="M60 130 L60 145 L180 181 L180 166Z" fill="#6e5842"/><path d="M180 166 L180 181 L300 145 L300 130Z" fill="#4c3e30"/><g stroke="#d0b18a" stroke-width="2"><path d="M90 121 L210 157 M120 112 L240 148 M150 103 L270 139 M90 135 L90 146 M120 144 L120 155 M150 153 L150 164 M210 153 L210 164 M240 144 L240 155 M270 135 L270 146"/></g>`,
    plaster:`<path d="M80 62 L190 94 L280 67 L170 35Z" fill="#ddd" stroke="#fff"/><path d="M80 62 V136 L190 168 V94Z" fill="#999" stroke="#ccc"/><path d="M190 94 V168 L280 141 V67Z" fill="#666" stroke="#999"/><path d="M95 73 L175 96 M95 91 L175 114 M95 109 L175 132 M95 127 L175 150" stroke="#ccc" stroke-width="2"/>`
  };
  const facade = {
    sate:`<path d="M75 75 L180 42 L285 75 L180 108Z" fill="#ddd" stroke="#fff"/><path d="M75 75 V151 L180 183 V108Z" fill="#aaa" stroke="#eee"/><path d="M180 108 V183 L285 151 V75Z" fill="#777" stroke="#bbb"/><path d="M91 83 V145 L112 151 V89Z" fill="#d7d0bd" stroke="#eee"/><path d="M116 91 V153 L138 160 V98Z" fill="#c9bda8" stroke="#eee"/><path d="M143 99 V161 L165 168 V106Z" fill="#b7aa96" stroke="#eee"/><path d="M188 114 V174 L209 168 V108Z" fill="#d8d0bd" stroke="#eee"/><path d="M214 106 V166 L236 159 V99Z" fill="#c9bda8" stroke="#eee"/><path d="M240 98 V158 L261 151 V91Z" fill="#b7aa96" stroke="#eee"/><path d="M75 75 L180 108 L285 75" fill="none" stroke="#eee" stroke-width="3"/><path d="M92 84 L180 111 L267 84" stroke="#555" stroke-width="2" fill="none"/>`,
    block:`<path d="M85 70 L190 102 L275 76 L170 44Z" fill="#aaa" stroke="#ddd"/><path d="M85 70 V147 L190 179 V102Z" fill="#777" stroke="#aaa"/><path d="M190 102 V179 L275 153 V76Z" fill="#555" stroke="#888"/><g stroke="#bbb" stroke-width="1.5"><path d="M85 90 L190 122 L275 96 M85 110 L190 142 L275 116 M85 130 L190 162 L275 136 M120 81 V158 M155 92 V169 M220 93 V170 M250 84 V161"/></g>`,
    partition:`${structure.partition}`
  };
  let content='';
  if(type==='foundation') content=foundation[variant==='main'?'strip':variant]||foundation.strip;
  else if(type==='structure') content=structure[variant==='main'?'joists':variant]||structure.joists;
  else if(type==='roof') content=roof[variant==='main'?'tiles':variant]||roof.tiles;
  else if(type==='facade') content=facade[variant==='main'?'sate':variant]||facade.sate;
  else content=`<path d="M80 135 L180 170 L280 135 L180 100Z" fill="#777" stroke="#ddd"/><path d="M105 95 L180 117 L255 95 L180 73Z" fill="#bbb" stroke="#eee"/><path d="M105 95 V125 L180 147 V117Z" fill="#666"/><path d="M180 117 V147 L255 125 V95Z" fill="#888"/><path d="M105 95 L180 73 L255 95" stroke="#fff" fill="none" stroke-width="2"/>`;
  const labels = type==='foundation' ? '<text x="22" y="24" class="svg-label">TERRENY</text><path d="M64 28 L111 112" class="svg-line"/><text x="245" y="30" class="svg-label">FORMIGÓ</text><path d="M271 35 L239 85" class="svg-line"/><text x="230" y="190" class="svg-label">ARMADURA</text>' : type==='structure' ? '<text x="22" y="24" class="svg-label">FORJAT</text><path d="M63 28 L117 99" class="svg-line"/><text x="252" y="30" class="svg-label">BIGUETES</text><path d="M278 36 L235 121" class="svg-line"/>' : type==='roof' ? '<text x="20" y="25" class="svg-label">TEULA</text><path d="M54 28 L105 98" class="svg-line"/><text x="250" y="26" class="svg-label">SUPORT</text><path d="M270 30 L230 90" class="svg-line"/>' : type==='facade' ? '<text x="18" y="24" class="svg-label">AÏLLAMENT</text><path d="M80 28 L124 112" class="svg-line"/><text x="252" y="24" class="svg-label">ACABAT</text><path d="M278 30 L251 94" class="svg-line"/>' : '<text x="22" y="25" class="svg-label">PEM</text><text x="250" y="25" class="svg-label">€/m²</text>';
  return svgWrap(`${content}${labels}`,`Il·lustració 3D esquemàtica de ${type}`);
}
function stageArt(stage, variant='main') {
  if(stage.id==='budget') return artSvg('budget','main');
  return artSvg(stage.art,variant);
}
function renderSummary(){
  const list=$('summary-list'); list.innerHTML='';
  CONFIG.stages.forEach((stage,i)=>{
    const choiceIndex=selections[i];
    const item=document.createElement('button'); item.type='button'; item.className='summary-item';
    const status=wrongStages.has(i)?'wrong':choiceIndex!==undefined?'done':'';
    const statusText=status==='wrong'?'!':status==='done'?'✓':'○';
    const choiceLabel=stage.budget?(choiceIndex!==undefined?money(Number(choiceIndex)):'Calcula el PEM'):choiceIndex!==undefined?stage.choices[choiceIndex].title:'Tria un sistema constructiu';
    item.innerHTML=`<span class="summary-art">${stageArt(stage)}</span><span class="summary-info"><strong>${stage.title}</strong><small>${choiceLabel}</small></span><span class="summary-status ${status}">${statusText}</span>`;
    item.addEventListener('click',()=>openStage(i)); list.appendChild(item);
  });
  const count=CONFIG.stages.filter((_,i)=>selections[i]!==undefined).length;
  $('progress-count').textContent=`${count}/${CONFIG.stages.length}`;
  $('progress-fill').style.width=`${count/CONFIG.stages.length*100}%`;
  $('submit-button').disabled=count!==CONFIG.stages.length;
  $('submit-hint').textContent=count===CONFIG.stages.length?'Totes les partides estan emplenades. Ja pots enviar el pressupost.':`Et queden ${CONFIG.stages.length-count} ${CONFIG.stages.length-count===1?'partida':'partides'} per completar.`;
}
function openStage(index){
  currentStage=index; const stage=CONFIG.stages[index];
  $('summary-view').classList.add('hidden'); $('result-view').classList.add('hidden'); $('review-view').classList.add('hidden'); $('chapter-view').classList.remove('hidden');
  $('chapter-kicker').textContent=`PARTIDA ${String(index+1).padStart(2,'0')} · ${stage.subtitle.toUpperCase()}`;
  $('chapter-title').textContent=stage.title; $('chapter-question').textContent=stage.question; $('chapter-number').textContent=String(index+1).padStart(2,'0');
  $('chapter-visual').innerHTML=stageArt(stage);
  $('chapter-note').textContent=stage.description;
  $('chapter-options').innerHTML='';
  $('save-choice').disabled=true;
  if(stage.budget){
    const box=document.createElement('div');box.className='budget-fields';box.innerHTML=`<label for="pem-input">Pressupost d’execució material (€)</label><input id="pem-input" type="number" inputmode="numeric" min="0" step="1" placeholder="Ex. 144000" value="${selections[index]??''}"><p class="budget-hint">Superfície: <strong>${CONFIG.houseAreaM2} m²</strong> · Mòdul orientatiu: <strong>${money(CONFIG.pemPerM2)}/m²</strong></p>`;
    $('chapter-options').appendChild(box); const input=$('pem-input'); $('save-choice').disabled=!input.value.trim(); input.addEventListener('input',()=>{$('save-choice').disabled=!input.value.trim()||Number(input.value)<0;});
  }else{
    stage.choices.forEach((choice,j)=>{
      const button=document.createElement('button');button.type='button';button.className='option-card'+(selections[index]===j?' selected':'');
      button.innerHTML=`<span class="option-image">${stageArt(stage,choice.art)}</span><span class="option-copy"><strong>${choice.title}</strong><p>${choice.detail}</p><span class="option-select"><span class="option-radio"></span>${selections[index]===j?'SELECCIONAT':'SELECCIONA'}</span></span>`;
      button.addEventListener('click',()=>{document.querySelectorAll('.option-card').forEach(el=>el.classList.remove('selected'));button.classList.add('selected');button.querySelector('.option-select').lastChild.textContent='SELECCIONAT';selections[index]=j;$('save-choice').disabled=false;});
      $('chapter-options').appendChild(button);
    });
    $('save-choice').disabled=selections[index]===undefined;
  }
  window.scrollTo({top:0,behavior:'smooth'});
}
function saveChoice(){
  const stage=CONFIG.stages[currentStage];
  if(stage.budget){const input=$('pem-input');if(!input||!input.value.trim()||Number(input.value)<0)return;selections[currentStage]=Number(input.value);}
  wrongStages.delete(currentStage); $('chapter-view').classList.add('hidden'); $('summary-view').classList.remove('hidden');renderSummary();window.scrollTo({top:0,behavior:'smooth'});
}
function submitBudget(){
  wrongStages=new Set();
  CONFIG.stages.forEach((stage,i)=>{
    if(stage.budget){if(Math.abs(Number(selections[i])-expectedPEM)>CONFIG.pemToleranceEuros)wrongStages.add(i);}
    else if(selections[i]!==stage.correct)wrongStages.add(i);
  });
  if(wrongStages.size===0){$('summary-view').classList.add('hidden');$('chapter-view').classList.add('hidden');$('review-view').classList.add('hidden');$('result-view').classList.remove('hidden');$('coordinates').textContent=CONFIG.finalCoordinates;window.scrollTo({top:0,behavior:'smooth'});return;}
  $('summary-view').classList.add('hidden');$('chapter-view').classList.add('hidden');$('result-view').classList.add('hidden');$('review-view').classList.remove('hidden');
  const list=$('review-list');list.innerHTML='';
  [...wrongStages].forEach(i=>{const row=document.createElement('div');row.className='review-row';row.innerHTML=`<div><strong>${CONFIG.stages[i].title}</strong><br><span>Cal revisar aquesta partida</span></div><button type="button">Revisar →</button>`;row.querySelector('button').addEventListener('click',()=>openStage(i));list.appendChild(row);});
  window.scrollTo({top:0,behavior:'smooth'});
}
function goHome(){
  $('chapter-view').classList.add('hidden');$('result-view').classList.add('hidden');$('review-view').classList.add('hidden');$('summary-view').classList.remove('hidden');renderSummary();window.scrollTo({top:0,behavior:'smooth'});
}
function restart(){selections={};wrongStages=new Set();goHome();}
$('home-link').addEventListener('click',e=>{e.preventDefault();goHome();});$('back-button').addEventListener('click',goHome);$('save-choice').addEventListener('click',saveChoice);$('submit-button').addEventListener('click',submitBudget);$('review-home').addEventListener('click',goHome);$('restart-button').addEventListener('click',restart);
$('copy-coordinates').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(CONFIG.finalCoordinates);$('copy-coordinates').textContent='Copiades ✓';}catch{$('copy-coordinates').textContent=CONFIG.finalCoordinates;}});
renderSummary();
