const AUTO_INTERVAL = 5000;
let autoPlay = true;
let timer = null;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  setupTheme();
  setupControls();
  loadContent();
});

function setupTheme(){
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if(stored === 'dark'){ root.classList.add('dark'); btn.textContent = '☀️'; }
  btn.addEventListener('click', ()=>{
    root.classList.toggle('dark');
    const dark = root.classList.contains('dark');
    btn.textContent = dark ? '☀️' : '🌙';
    localStorage.setItem('theme', dark?'dark':'light');
  });
}

function setupControls(){
  document.getElementById('prevBtn').addEventListener('click', ()=>scrollByCard(-1));
  document.getElementById('nextBtn').addEventListener('click', ()=>scrollByCard(1));
  const playPause = document.getElementById('playPause');
  playPause.addEventListener('click', ()=>{
    autoPlay = !autoPlay;
    updatePlayPauseIcon();
    if(autoPlay) startAuto(); else stopAuto();
  });
}

function updatePlayPauseIcon(){
  const btn = document.getElementById('playPause');
  btn.innerHTML = autoPlay
    ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
    : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
}

function scrollByCard(delta){
  const container = document.getElementById('cards');
  const width = container.clientWidth;
  container.scrollBy({left: delta * width, behavior:'smooth'});
  resetAuto();
}

function startAuto(){ stopAuto(); timer = setInterval(()=>{ scrollByCard(1); }, AUTO_INTERVAL); }
function stopAuto(){ if(timer) clearInterval(timer); }
function resetAuto(){ if(autoPlay){ stopAuto(); startAuto(); } }

async function loadContent(){
  try{
    const idxRes = await fetch('content/index.json');
    const index = await idxRes.json();
    const cardsCont = document.getElementById('cards');
    for(const entry of index){
      const res = await fetch('content/'+entry.file);
      const md = await res.text();
      const html = mdToHtml(md);
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `<div class="meta">${entry.type} · ${entry.date || ''}</div><div class="content">${html}</div>`;
      cardsCont.appendChild(card);
    }
    const about = await fetch('content/about.md').then(r=>r.text());
    document.getElementById('aboutContent').innerHTML = mdToHtml(about);
    if(autoPlay) startAuto();
    setupKeyboard();
  }catch(e){ console.error(e); document.getElementById('cards').innerHTML='<p>Impossibile caricare i contenuti.</p>'; }
}

function setupKeyboard(){
  const c = document.getElementById('cards');
  c.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') { scrollByCard(1); }
    if(e.key === 'ArrowLeft') { scrollByCard(-1); }
  });
}
