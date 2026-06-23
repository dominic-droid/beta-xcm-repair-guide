// ============================================================
// EPIC Homes — Shared App Logic
// Edit this file to update both index.html and admin.html
// ============================================================

var navHistory = [];
var current = 's-home';
var isMalay = false;
var sheetData = [];
var dataLoaded = false;

var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzvLHPtlr8LpOWx_jJrh_-VTltY0J85zMWq4wK_aOXol20L7KkTyjZTC7jjDB7ZpkKB/exec';
var SHEET_EDIT_URL  = 'https://docs.google.com/spreadsheets/d/1lvZr2VdXWYcdZzr5o20qDTBp0UdDNAOo93tRE5c_B44/edit';
var HOTLINE_NUMBER  = '60197551617';
var WHATSAPP_MSG_EN = 'Hi, I need help with my EPIC Homes repair. Can you assist?';
var WHATSAPP_MSG_MS = 'Hi, saya perlukan bantuan untuk baik pulih rumah EPIC Homes saya. Boleh bantu?';

function goTo(id) {
  document.getElementById(current).classList.remove('active');
  navHistory.push(current);
  current = id;
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
  if (id === 's-admin') renderAdminOverview();
}

function goBack() {
  if (navHistory.length === 0) return;
  document.getElementById(current).classList.remove('active');
  current = navHistory.pop();
  document.getElementById(current).classList.add('active');
  window.scrollTo(0, 0);
}

function toggleLang() {
  isMalay = !isMalay;
  document.querySelectorAll('.lang-en').forEach(function(el){ el.style.display = isMalay ? 'none' : ''; });
  document.querySelectorAll('.lang-ms').forEach(function(el){ el.style.display = isMalay ? '' : 'none'; });
}

function callHotline() {
  var msg = isMalay ? WHATSAPP_MSG_MS : WHATSAPP_MSG_EN;
  window.open('https://wa.me/' + HOTLINE_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
}

function getPlatformIcon(p) {
  p = (p || '').toLowerCase();
  if (p === 'youtube')      return {cls:'ri-yt',  icon:'&#9654;', badge:'b-yt'};
  if (p === 'tiktok')       return {cls:'ri-tt',  icon:'&#9835;', badge:'b-tt'};
  if (p === 'google drive') return {cls:'ri-gd',  icon:'&#128196;',badge:'b-gd'};
  if (p === 'shopify')      return {cls:'ri-shop',icon:'&#128230;',badge:'b-sh'};
  return {cls:'ri-gd', icon:'&#128279;', badge:'b-gd'};
}

function getTypeLabel(type) {
  var t = (type || '').toLowerCase();
  if (t === 'video')   return isMalay ? 'Panduan video'     : 'Video guides';
  if (t === 'guide')   return isMalay ? 'Panduan bergambar' : 'Pictorial guides';
  if (t === 'product') return isMalay ? 'Produk kami'       : 'Products we carry';
  return 'Resources';
}

function buildHotline() {
  return '<button class="hotline-btn" onclick="callHotline()">'
    + '<div class="hotline-icon">&#128222;</div>'
    + '<div class="hotline-text"><div class="hotline-title">'
    + (isMalay ? 'Perlukan bantuan? Hubungi Talian OA' : 'Need help? Call the OA Hotline')
    + '</div></div><div class="hotline-arrow">&#8594;</div></button>';
}

function goToResource(section, subcomponent) {
  var sec = section.replace(/&amp;/g, '&');
  renderResourceScreen(sec, subcomponent);
  goTo('s-resource');
}

function renderResourceScreen(section,subcomponent){
  document.getElementById('resource-title').textContent=subcomponent;
  var body=document.getElementById('resource-body');
  if(!dataLoaded){body.innerHTML='<div class="loading-state"><div class="loading-spinner"></div><span>Loading...</span></div>';return;}
  var rows=sheetData.filter(function(r){return r['Section']===section&&r['Sub-component']===subcomponent;});
  var products=rows.filter(function(r){return(r['Resource Type']||'').toLowerCase()==='product';});
  var videos=rows.filter(function(r){return(r['Resource Type']||'').toLowerCase()==='video';});
  var guides=rows.filter(function(r){return(r['Resource Type']||'').toLowerCase()==='guide';});
  var pc='';
  if(products.length===0){pc='<div class="empty-state">No products added yet</div>';}
  else{products.forEach(function(r){pc+=buildResCard(r);});}
  var gc='';
  if(videos.length===0&&guides.length===0){gc='<div class="empty-state">No guides added yet</div>';}
  else{
    if(videos.length>0){gc+='<div style="font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px">Video guides</div>';videos.forEach(function(r){gc+=buildResCard(r);});}
    if(guides.length>0){gc+='<div style="font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin:8px 0 6px">Pictorial guides</div>';guides.forEach(function(r){gc+=buildResCard(r);});}
  }
  var html='<div style="display:flex;gap:6px;margin-bottom:14px">'
    +'<button style="flex:1;background:var(--orange);color:#fff;border:none;border-radius:10px;padding:9px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font)" id="rtb-p" onclick="switchResTab(\'products\')">Products</button>'
    +'<button style="flex:1;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:9px;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;font-family:var(--font)" id="rtb-g" onclick="switchResTab(\'guides\')">How-to guides</button>'
    +'</div>'
    +'<div id="rtp-p">'+pc+buildHotline()+'</div>'
    +'<div id="rtp-g" style="display:none">'+gc+buildHotline()+'</div>';
  body.innerHTML=html;
}

function switchResTab(name){
  var isProducts=name==='products';
  var btnP=document.getElementById('rtb-p');
  var btnG=document.getElementById('rtb-g');
  var paneP=document.getElementById('rtp-p');
  var paneG=document.getElementById('rtp-g');
  btnP.style.background=isProducts?'var(--orange)':'var(--bg)';
  btnP.style.color=isProducts?'#fff':'var(--muted)';
  btnP.style.border=isProducts?'none':'1px solid var(--border)';
  btnG.style.background=isProducts?'var(--bg)':'var(--orange)';
  btnG.style.color=isProducts?'var(--muted)':'#fff';
  btnG.style.border=isProducts?'1px solid var(--border)':'none';
  paneP.style.display=isProducts?'block':'none';
  paneG.style.display=isProducts?'none':'block';
}

function buildResCard(r){
  var p=getPlatformIcon(r['Platform']);
  var title=(isMalay&&r['Title BM'])?r['Title BM']:r['Title EN'];
  var link=r['Link']||'#';
  return '<a class="res-card" href="'+link+'" target="_blank" rel="noopener">'
    +'<div class="res-icon '+p.cls+'">'+p.icon+'</div>'
    +'<div class="res-text"><div class="res-title">'+(title||'Untitled')+'</div>'
    +'<div class="res-meta"><span class="badge '+p.badge+'">'+(r['Platform']||'')+'</span></div></div>'
    +'<div class="res-arrow">&#8599;</div></a>';
}

function updateCounts() {
  var map = {'Roof':'roof-count','Wall':'wall-count','Windows & Doors':'windows-count','Floor':'floor-count'};
  Object.keys(map).forEach(function(sec) {
    var count = sheetData.filter(function(r){ return r['Section'] === sec; }).length;
    var el = document.getElementById(map[sec]);
    if (el) el.textContent = count > 0 ? count + ' resource' + (count === 1 ? '' : 's') : 'Tap to view';
  });
}

function loadSheetData() {
  fetch(APPS_SCRIPT_URL + '?t=' + Date.now())
    .then(function(res){ return res.json(); })
    .then(function(data){ sheetData = data; dataLoaded = true; updateCounts(); })
    .catch(function() {
      var script = document.createElement('script');
      script.src = APPS_SCRIPT_URL + '?callback=handleData&t=' + Date.now();
      script.onload = function(){ if (document.head.contains(script)) document.head.removeChild(script); };
      script.onerror = function(){ dataLoaded = true; updateCounts(); };
      document.head.appendChild(script);
      setTimeout(function(){ if (!dataLoaded){ dataLoaded = true; updateCounts(); } }, 8000);
    });
}

function handleData(data) {
  sheetData = data;
  dataLoaded = true;
  updateCounts();
}

// Admin functions
function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(function(b) {
    var m = b.getAttribute('onclick').match(/switchTab\(['"]([^'"]+)['"]/);
    if (m) b.classList.toggle('active', m[1] === name);
  });
  document.querySelectorAll('.tab-content').forEach(function(c) {
    c.classList.toggle('active', c.id === 'tab-' + name);
  });
  if (name === 'manage') renderManageList();
}

function renderAdminOverview() {
  if (!dataLoaded) return;
  document.getElementById('stat-total').textContent    = sheetData.length;
  document.getElementById('stat-videos').textContent   = sheetData.filter(function(r){ return (r['Resource Type']||'').toLowerCase() === 'video'; }).length;
  document.getElementById('stat-guides').textContent   = sheetData.filter(function(r){ return (r['Resource Type']||'').toLowerCase() === 'guide'; }).length;
  document.getElementById('stat-products').textContent = sheetData.filter(function(r){ return (r['Resource Type']||'').toLowerCase() === 'product'; }).length;
  document.getElementById('last-updated').textContent  = 'Live from sheet';
  var sm = {'Roof':'admin-roof-count','Wall':'admin-wall-count','Windows & Doors':'admin-windows-count','Floor':'admin-floor-count'};
  Object.keys(sm).forEach(function(sec) {
    var el = document.getElementById(sm[sec]);
    if (el) el.textContent = sheetData.filter(function(r){ return r['Section'] === sec; }).length + ' resources';
  });
}

function renderManageList() {
  var el = document.getElementById('manage-list');
  if (!dataLoaded || sheetData.length === 0) { el.innerHTML = '<div class="empty-state">No resources in sheet yet.</div>'; return; }
  var html = '';
  sheetData.forEach(function(r) {
    html += '<div class="manage-row"><div class="manage-info"><div class="manage-title">' + (r['Title EN'] || 'Untitled') + '</div>'
      + '<div class="manage-meta">' + (r['Section']||'') + ' &middot; ' + (r['Sub-component']||'') + ' &middot; ' + (r['Platform']||'') + '</div></div></div>';
  });
  el.innerHTML = html;
}

function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 3000);
}

function handleAddResource() {
  var sv = document.getElementById('add-section').value.split('|');
  var section = sv[0], subcomp = sv[1];
  var type    = document.getElementById('add-type').value;
  var titleEN = document.getElementById('add-title-en').value.trim();
  var titleMS = document.getElementById('add-title-ms').value.trim();
  var link    = document.getElementById('add-link').value.trim();
  var platform= document.getElementById('add-platform').value;
  if (!titleEN || !link) { alert('Please fill in the English title and link.'); return; }
  var btn = document.getElementById('add-submit-btn');
  btn.disabled = true; btn.textContent = 'Saving...';
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({'Section':section,'Sub-component':subcomp,'Resource Type':type,'Title EN':titleEN,'Title BM':titleMS,'Link':link,'Platform':platform})
  })
  .then(function(res){ return res.json(); })
  .then(function(data) {
    if (data.status === 'success') {
      showToast('Resource saved to sheet!');
      document.getElementById('add-title-en').value = '';
      document.getElementById('add-title-ms').value = '';
      document.getElementById('add-link').value = '';
      loadSheetData();
    } else { showToast('Something went wrong. Try again.'); }
    btn.disabled = false; btn.textContent = 'Save resource';
  })
  .catch(function(){ showToast('Could not connect. Check your internet.'); btn.disabled = false; btn.textContent = 'Save resource'; });
}

window.addEventListener('DOMContentLoaded', function(){ loadSheetData(); });
