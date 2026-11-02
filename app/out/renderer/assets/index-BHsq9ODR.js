async function LPEnsureUsageKey(){
 const api=window.lorevia;const current=await api.usageKeyStatus();if(current.active)return;
 const gate=document.createElement('div');gate.className='lp-unlock';gate.innerHTML=`<form class="lp-unlock-card"><span class="lp-eyebrow">LOREVIA COMMUNITY</span><div class="lp-unlock-mark" aria-hidden="true">L</div><h1>Deine Geschichten<br>beginnen hier.</h1><p>Gib deinen Nutzungsschlüssel ein, um Lorevia auf diesem PC freizuschalten.</p><label for="lpUsageKey">Dein Nutzungsschlüssel</label><textarea id="lpUsageKey" rows="3" required spellcheck="false" autocomplete="off" placeholder="LV1.…"></textarea><button type="submit">Lorevia freischalten <span aria-hidden="true">↗</span></button><p class="lp-unlock-status" role="status" aria-live="polite"></p><small>Einmal eingeben. Lokal gespeichert. Keine Anmeldung.</small></form>`;
 document.body.append(gate);const input=gate.querySelector('textarea');input.focus();
 await new Promise(resolve=>gate.querySelector('form').addEventListener('submit',async e=>{e.preventDefault();const button=gate.querySelector('button'),status=gate.querySelector('.lp-unlock-status');button.disabled=true;try{const r=await api.activateUsageKey(input.value.trim());if(r.active){gate.remove();resolve();return;}status.textContent=r.error||'Freischaltung fehlgeschlagen.';}catch{status.textContent='Der Schlüssel konnte gerade nicht geprüft werden.';}finally{button.disabled=false;}}));
}
await LPEnsureUsageKey();

function LPDownloadUpdate(){
 let dialog=document.getElementById('lpUpdateDialog');if(dialog){dialog.showModal();return;}
 dialog=document.createElement('dialog');dialog.id='lpUpdateDialog';dialog.className='lp-update-dialog';dialog.innerHTML='<div><span class="lp-eyebrow">LOREVIA COMMUNITY</span><h2>Die neueste Version für dich.</h2><p id="lpUpdateStatus" role="status" aria-live="polite">Neueste Version wird gesucht …</p><progress id="lpUpdateProgress" max="100"></progress><p id="lpUpdateFile"></p><button type="button" class="btn ghost" id="lpUpdateClose">Schließen</button></div>';
 document.body.append(dialog);dialog.showModal();dialog.querySelector('button').onclick=()=>{dialog.close();if(!dialog.dataset.running)dialog.remove();};
 const status=dialog.querySelector('#lpUpdateStatus'),progress=dialog.querySelector('progress');dialog.dataset.running='1';
 const unsubscribe=window.lorevia.onCommunityProgress(p=>{status.textContent=p.status||'';if(p.total>0)progress.value=Math.round(p.completed/p.total*100);else progress.removeAttribute('value');});
 window.lorevia.downloadCommunity().then(r=>{if(!r.ok)throw Error(r.error);status.textContent='Version '+r.version+' wurde heruntergeladen und geprüft.';progress.value=100;dialog.querySelector('#lpUpdateFile').textContent='Du findest das Setup hier:\n'+r.file+'\n\nZum Installieren das Setup öffnen. Deine lokalen Geschichten bleiben erhalten.';}).catch(e=>{status.textContent='Download nicht möglich: '+e.message;progress.hidden=true;}).finally(()=>{unsubscribe();delete dialog.dataset.running;if(!dialog.open)dialog.remove();});
}

// Character dossier shared by storage, editor and story prompts.
var LP_GROUPS = [
 ['identitaet','Identität','01','Wer steckt hinter dem Namen?'],
 ['aussehen','Aussehen','02','Eine klare Vorstellung, auch ohne Bild.'],
 ['persoenlichkeit','Persönlichkeit','03','Eigenheiten dürfen sich widersprechen.'],
 ['psychologie','Wünsche & Gefühle','04','Was treibt die Figur an?'],
 ['vergangenheit','Vergangenheit','05','Es braucht keine tragische Kindheit.'],
 ['beziehungen','Beziehungen','06','Nähe und Vertrauen haben zwei Perspektiven.'],
 ['kommunikation','Sprache','07','Eine eigene Stimme für jede Figur.'],
 ['faehigkeiten','Fähigkeiten','08','Wissen ist nicht dasselbe wie Können.'],
 ['eigenheiten','Eigenheiten','09','Die kleinen Dinge machen sie wiedererkennbar.'],
 ['moral','Werte & Grenzen','10','Was würde sie niemals tun?'],
 ['entwicklung','Entwicklung','11','Veränderung braucht Erlebnisse und Zeit.'],
 ['verhalten','KI-Verhalten','12','Eigenständig, ohne den Spieler zu übernehmen.'],
 ['bild','Bildprompt','13','Extern generieren. Hier den Prompt vorbereiten.']
];
// key, label, group, visibility level; base controls keep compatibility with older stories.
var LP_FIELDS = [
 ['spitzname','Spitzname','identitaet',2],['geschlecht','Geschlecht','identitaet',1],['spezies','Spezies','identitaet',1],['herkunft','Herkunft','identitaet',2],['geburtstag','Geburtstag','identitaet',3],['stand','Gesellschaftlicher Stand','identitaet',2],
 ['gewicht','Gewicht','aussehen',3],['koerperbau','Körperbau','aussehen',2],['muskeln','Muskeldefinition','aussehen',3],['haltung','Körperhaltung','aussehen',2],['haut','Hautfarbe','aussehen',2],['frisur','Frisur & Haarlänge','aussehen',2],['gesicht','Gesichtsform','aussehen',3],['merkmale','Narben, Tattoos & Besonderheiten','aussehen',2],['fantasy','Ohren, Hörner, Flügel & weitere Merkmale','aussehen',2],
 ['widersprueche','Innere Widersprüche','persoenlichkeit',2],['unsicherheit','Wann wird sie unsicher?','persoenlichkeit',3],
 ['ziel','Was möchte die Figur erreichen?','psychologie',1],['beduerfnis','Was braucht sie wirklich?','psychologie',2],['angst','Wovor hat sie Angst?','psychologie',1],['schwaeche','Eine Schwäche','psychologie',1],['geheimnis','Was verheimlicht sie?','psychologie',2],['freude','So zeigt sie Freude','psychologie',2],['wut','So reagiert sie auf Wut','psychologie',2],['trauer','So geht sie mit Trauer um','psychologie',3],['stress','So reagiert sie auf Stress & Angst','psychologie',2],['zuneigung','So zeigt sie Zuneigung','psychologie',2],['eifersucht','Eifersucht & Enttäuschung','psychologie',3],['scham','Scham & Verlegenheit','psychologie',3],['zustand','Aktuelle Stimmung und ihre Ursache','psychologie',2],
 ['kindheit','Kindheit & Erziehung','vergangenheit',2],['bildung','Bildung & Ausbildung','vergangenheit',2],['praegung','Prägende Erlebnisse','vergangenheit',2],['erfolge','Erfolge & Niederlagen','vergangenheit',3],['fruehereBeziehungen','Frühere Beziehungen','vergangenheit',3],['lebenslage','Aktuelle Lebenssituation','vergangenheit',2],
 ['fremde','Verhalten gegenüber Fremden','beziehungen',2],['naehe','Verhalten gegenüber Freunden & Familie','beziehungen',2],['autoritaet','Autoritäten & Feinde','beziehungen',3],['hilfsbereitschaft','Umgang mit Hilfsbedürftigen','beziehungen',3],
 ['wortwahl','Wortwahl & Satzlänge','kommunikation',2],['direktheit','Direktheit & Höflichkeit','kommunikation',2],['humor','Humor','kommunikation',2],['fluchen','Fluchen & Dialekt','kommunikation',3],['sprechweise','Sprechtempo & Lautstärke','kommunikation',3],['initiative','Gespräche beginnen, widersprechen & beenden','kommunikation',2],['flirt','Flirtverhalten','kommunikation',3],
 ['koennen','Praktische Fähigkeiten mit Niveau','faehigkeiten',2],['wissen','Theoretisches Wissen','faehigkeiten',2],['persoenlichesWissen','Bekanntes über andere Figuren','faehigkeiten',3],['geheimesWissen','Geheimes Wissen: Wer weiß davon?','faehigkeiten',3],['nichtwissen','Was weiß oder kann sie ausdrücklich nicht?','faehigkeiten',2],
 ['vorlieben','Vorlieben & Lieblingsessen','eigenheiten',2],['abneigungen','Abneigungen','eigenheiten',2],['gewohnheiten','Gewohnheiten & nervöse Reaktionen','eigenheiten',2],['alltag','Schlaf, Ordnung & Lieblingsorte','eigenheiten',3],
 ['werte','Werte & Überzeugungen','moral',2],['grenze','Was würde sie niemals tun?','moral',1],['dilemma','Loyalität, Gesetze & moralische Konflikte','moral',3],['verzeihen','Fehler zugeben & Verrat verzeihen','moral',3],
 ['ausgangspunkt','Ausgangspersönlichkeit','entwicklung',2],['konflikte','Persönliche Konflikte','entwicklung',2],['potenzial','Mögliche Entwicklung, keine vorbestimmte Handlung','entwicklung',2],['wendepunkte','Erlebte Wendepunkte und ihre Ursache','entwicklung',3],['lektionen','Erlernte Lektionen & aktueller Stand','entwicklung',3],
 ['eigeninitiative','Handlungsinitiative','verhalten',2],['entscheidungen','Entscheidungsfreiheit & Zielstrebigkeit','verhalten',3],['konflikt','Konfliktbereitschaft','verhalten',2],['emotionalitaet','Sichtbarer Gefühlsausdruck','verhalten',3],['anpassung','Anpassungsfähigkeit & Beziehungspflege','verhalten',3]
];
var LP_BASE = [['name','Name','identitaet',1,'name'],['alter','Alter','identitaet',1,'age'],['beruf','Beruf / Tätigkeit','identitaet',1,'job'],['wohnsituation','Wohnort / Wohnsituation','identitaet',2,'housing'],['groesse','Größe','aussehen',2,'height'],['aussehen','Gesamterscheinung','aussehen',1,'appearance'],['haare','Haare','aussehen',2,null],['augen','Augen','aussehen',2,null],['outfit','Aktuelle Kleidung','aussehen',2,null],['persoenlichkeit','Persönlichkeit','persoenlichkeit',1,'personality'],['eltern','Familie','beziehungen',2,'family'],['beziehungen','Freunde, Partner & andere Beziehungen','beziehungen',2,'relationships'],['erinnerungen','Erinnerungen','vergangenheit',2,'memories'],['stimme','Stimmklang','kommunikation',2,'voiceDesc'],['notizen','Weitere feste Vorgaben','verhalten',2,'notes']];
var LP_TRAITS = [['offenheit','Verschlossen','Offen'],['selbstbewusstsein','Unsicher','Selbstsicher'],['geselligkeit','Introvertiert','Extrovertiert'],['geduld','Ungeduldig','Geduldig'],['temperament','Ruhig','Impulsiv'],['empathie','Distanziert','Einfühlsam'],['humor','Ernst','Humorvoll'],['ehrlichkeit','Unehrlich','Ehrlich'],['mut','Ängstlich','Mutig'],['vertrauen','Misstrauisch','Vertrauensvoll'],['ordnung','Chaotisch','Ordentlich'],['konflikt','Nachgiebig','Konfrontativ'],['eigenstaendigkeit','Abhängig','Unabhängig'],['dominanz','Zurückhaltend','Bestimmend']];
var LP_PRESETS = {
 student:{label:'Student / Studentin',brief:'Eine erwachsene Figur im Studium. Eigene Interessen und ein Alltag neben der Handlung.',fields:{bildung:'Studiert; Fach entscheidet die KI.',ziel:'Den eigenen Weg finden.'}},
 soldier:{label:'Soldat / Soldatin',brief:'Eine erwachsene Figur mit militärischer Ausbildung. Persönlichkeit und Haltung zum Beruf dürfen vielschichtig sein.',fields:{koennen:'Militärische Grundausbildung; konkrete Spezialisierung passend zur Welt.'}},
 mage:{label:'Magier / Magierin',brief:'Eine erwachsene magiebegabte Figur. Fähigkeiten, Grenzen und Kosten der Magie müssen zu dieser Welt passen.',fields:{nichtwissen:'Magie macht die Figur weder allwissend noch unfehlbar.'}},
 noble:{label:'Wohlhabende Familie',brief:'Eine erwachsene Figur aus wohlhabendem Elternhaus. Geld bestimmt weder automatisch Moral noch Persönlichkeit.',fields:{stand:'Wohlhabend'}},
 adventurer:{label:'Abenteurer / Abenteurerin',brief:'Eine erwachsene reisende Figur mit einem eigenen Ziel, hilfreichen Fähigkeiten und nachvollziehbaren Grenzen.',fields:{ziel:'Ein persönliches Abenteuer bestehen.'}},
 merchant:{label:'Händler / Händlerin',brief:'Eine erwachsene Figur, die Handel betreibt. Ein eigener Alltag, Kontakte und Interessen.',fields:{koennen:'Verhandeln und Warenkenntnis; Niveau passend zum Hintergrund.'}}
};
function lpText(value,max=1600){return typeof value==='string'?value.trim().slice(0,max):'';}
function lpNormalize(value){
 const v=value&&typeof value==='object'?value:{};const out={version:1,fields:{},traits:{},locked:[],relations:[],image:{},imageFixed:{},profile:'natuerlich'};
 for(const [k]of LP_FIELDS){const s=lpText(v.fields?.[k]);if(s)out.fields[k]=s;}
 for(const [k]of LP_TRAITS){if(typeof v.traits?.[k]==='number'&&Number.isFinite(v.traits[k]))out.traits[k]=Math.round(Math.min(100,Math.max(0,v.traits[k])));}
 const valid=new Set([...LP_FIELDS,...LP_BASE].map(f=>f[0]));out.locked=Array.isArray(v.locked)?[...new Set(v.locked.filter(k=>valid.has(k)))]:[];
 out.relations=(Array.isArray(v.relations)?v.relations:[]).slice(0,24).map(r=>({name:lpText(r?.name,80),sicht:lpText(r?.sicht,700),vertrauen:lpText(String(r?.vertrauen??''),20),sympathie:lpText(String(r?.sympathie??''),20),respekt:lpText(String(r?.respekt??''),20),konflikt:lpText(String(r?.konflikt??''),20),ursache:lpText(r?.ursache,700)})).filter(r=>r.name);
 for(const k of ['style','view','pose','clothing','expression','background','light','ratio','language','negative']){const s=lpText(v.image?.[k],500);if(s)out.image[k]=s;}
 for(const k of ['aussehen','haare','augen','spezies','koerperbau','haut','merkmale','fantasy']){const s=lpText(v.imageFixed?.[k]);if(s)out.imageFixed[k]=s;}
 if(['passiv','natuerlich','aktiv'].includes(v.profile))out.profile=v.profile;
 return out;
}
function lpDossierLines(figure){
 const a=lpNormalize(figure?.akte);const lines=LP_FIELDS.filter(f=>a.fields[f[0]]).map(f=>f[1]+': '+a.fields[f[0]]);
 if(Object.keys(a.traits).length)lines.push('Grundtemperament (0–100; keine momentane Stimmung): '+LP_TRAITS.filter(t=>a.traits[t[0]]!==undefined).map(t=>t[1]+' ↔ '+t[2]+': '+a.traits[t[0]]).join('; '));
 for(const r of a.relations)lines.push('Einseitige Sicht auf '+r.name+': '+r.sicht+'; Vertrauen '+r.vertrauen+', Sympathie '+r.sympathie+', Respekt '+r.respekt+', Konflikt '+r.konflikt+'; Ursache: '+r.ursache+'. Diese Sicht gilt nicht automatisch umgekehrt.');
 if(lines.length)lines.push('Initiativeprofil: '+a.profile+'. Eigenschaften und Widersprüche respektieren. Aktuelle Stimmung ist keine dauerhafte Persönlichkeit. Entwicklung nur durch passende Erlebnisse; Wissen nicht zwischen Figuren übertragen. Geheimnisse bleiben den nicht eingeweihten Figuren unbekannt. Keine automatischen Handlungen oder Gedanken für Spielerfiguren.');
 return lines;
}
function lpApplySuggestions(figure,suggestion){
 const out=JSON.parse(JSON.stringify(figure||{}));out.akte=lpNormalize(out.akte);const s=suggestion&&typeof suggestion==='object'?suggestion:{};
 for(const [key]of LP_BASE)if(!lpText(out[key])&&!out.akte.locked.includes(key)&&typeof s.base?.[key]==='string')out[key]=lpText(s.base[key],key==='name'?80:1600);
 for(const [key]of LP_FIELDS)if(!out.akte.fields[key]&&!out.akte.locked.includes(key)&&typeof s.fields?.[key]==='string')out.akte.fields[key]=lpText(s.fields[key]);
 return out;
}
function lpImagePrompt(figure,options){
 const a=lpNormalize(figure?.akte),o={...a.image,...options};const en=o.language==='en';const fixed=Object.keys(a.imageFixed).length?a.imageFixed:{aussehen:figure.aussehen,haare:figure.haare,augen:figure.augen,...Object.fromEntries(['spezies','koerperbau','haut','merkmale','fantasy'].map(k=>[k,a.fields[k]]))};
 const terms=[];terms.push(en?'Create a character image. Preserve all stated physical traits.':'Erstelle eine Charakterdarstellung. Behalte alle angegebenen körperlichen Merkmale bei.');
 for(const [key,label]of [['style',en?'Style':'Stil'],['view',en?'View':'Ansicht'],['pose',en?'Pose':'Haltung'],['expression',en?'Expression':'Gesichtsausdruck'],['background',en?'Background':'Hintergrund'],['light',en?'Lighting':'Beleuchtung'],['ratio',en?'Aspect ratio':'Bildformat']])if(o[key])terms.push(label+': '+o[key]+'.');
 if(figure.name)terms.push((en?'Character':'Figur')+': '+figure.name+'.');if(figure.alter)terms.push((en?'Age':'Alter')+': '+figure.alter+'.');
 for(const [k,v]of Object.entries(fixed))if(v)terms.push((({aussehen:en?'Appearance':'Gesamterscheinung',haare:en?'Hair':'Haare',augen:en?'Eyes':'Augen',spezies:en?'Species':'Spezies',koerperbau:en?'Build':'Körperbau',haut:en?'Skin':'Haut',merkmale:en?'Distinctive features':'Besondere Merkmale',fantasy:en?'Fantasy traits':'Fantasymerkmale'})[k])+': '+v+'.');
 const clothing=o.clothing||figure.outfit;if(clothing)terms.push((en?'Clothing':'Kleidung')+': '+clothing+'.');
 terms.push(en?'Coherent proportions, consistent character design. Do not invent unstated physical traits.':'Stimmige Proportionen, einheitliches Charakterdesign. Keine nicht festgelegten Körpermerkmale erfinden.');
 return {prompt:terms.join('\n'),negative:lpText(o.negative,500),needsTranslation:en&&Object.values(fixed).some(Boolean)};
}

function LPInitEditor(host){
 const form=document.getElementById('figurForm'),api=window.lorevia;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const state={mode:1,tab:'start',akte:lpNormalize(),extra:{},revision:0,busy:false};
 const original=document.createElement('details');original.className='lp-legacy';original.innerHTML='<summary>Weitere Angaben, Beziehungen & Anhänge</summary>';
 const actions=form.querySelector('.form-actions'),title=document.getElementById('figurFormTitel'),save=document.getElementById('vorlageSpeichern');
 for(const el of [...form.children])if(el!==actions&&el!==title&&el!==save)original.append(el);
 const root=document.createElement('section');root.className='lp-editor';root.setAttribute('aria-label','Charaktereditor');
 root.innerHTML=`<header class="lp-hero"><div><span class="lp-eyebrow">LOREVIA · CHARAKTERATELIER</span><h2>Aus einer Idee wird eine Figur.</h2><p>Du bestimmst, was feststeht. Lorevia hilft beim Rest.</p></div><span class="lp-seal" aria-hidden="true">L</span></header>
 <div class="lp-toolbar"><div class="lp-modes" role="group" aria-label="Detailgrad"><button type="button" data-mode="1" aria-pressed="true">Einfach</button><button type="button" data-mode="2" aria-pressed="false">Erweitert</button><button type="button" data-mode="3" aria-pressed="false">Experte</button></div><span class="lp-local">Nur auf deinem PC gespeichert</span></div>
 <div class="lp-layout"><nav class="lp-tabs" aria-label="Charakterbereiche"></nav><div class="lp-body"><div class="lp-page"></div><div class="lp-status" role="status" aria-live="polite"></div><div class="lp-preview" hidden></div></div></div>`;
 form.prepend(root);form.insertBefore(original,actions);actions.append(save);title.classList.add('lp-form-title');
 const page=root.querySelector('.lp-page'),tabs=root.querySelector('.lp-tabs'),status=root.querySelector('.lp-status'),preview=root.querySelector('.lp-preview');
 function say(text){status.textContent=text;}
 function figure(){const f=host.read();return {...f,...state.extra,akte:lpNormalize(state.akte)};}
 function writeFigure(f){host.write(f);state.extra={};for(const [k,,,,control]of LP_BASE)if(!control&&f[k])state.extra[k]=f[k];state.akte=lpNormalize(f.akte);state.revision++;render();}
 function field(key,label,base=false){const f=figure(),value=base?f[key]||'':state.akte.fields[key]||'';const locked=state.akte.locked.includes(key);
  return `<label class="lp-field"><span>${esc(label)}<button type="button" class="lp-lock ${locked?'is-locked':''}" data-lock="${key}" aria-pressed="${locked}" title="Für KI-Ergänzungen sperren">${locked?'Gesperrt':'Sperren'}</button></span>${['name','alter','beruf','spezies','geschlecht','spitzname','geburtstag','groesse'].includes(key)?`<input data-field="${key}" data-base="${base}" value="${esc(value)}" maxlength="${key==='name'?80:1600}" placeholder="Leer lassen: KI entscheidet">`:`<textarea data-field="${key}" data-base="${base}" rows="2" maxlength="1600" placeholder="Deine Vorgabe – oder offen lassen">${esc(value)}</textarea>`}</label>`;
 }
 function currentFields(group){return [...LP_BASE.filter(f=>f[2]===group&&f[3]<=state.mode).map(f=>field(f[0],f[1],true)),...LP_FIELDS.filter(f=>f[2]===group&&f[3]<=state.mode).map(f=>field(f[0],f[1]))].join('');}
 function imagePage(){const o=state.akte.image;const select=(key,label,values)=>`<label class="lp-field"><span>${label}</span><select data-image="${key}">${values.map(([v,n])=>`<option value="${v}" ${o[key]===v?'selected':''}>${n}</option>`).join('')}</select></label>`;
  page.innerHTML=`<span class="lp-kicker">13 / VISUELLE IDENTITÄT</span><h3>Deine Figur. Dein Bildprompt.</h3><p>Prompt kopieren und in einer externen Bild-KI verwenden. Hier werden keine Bilder erzeugt oder angezeigt.</p><div class="lp-grid">${select('style','Bildstil',[['Realistisch','Realistisch'],['Anime','Anime'],['Fantasyillustration','Fantasy'],['Pixelart','Pixelart'],['3D-Rendering','3D']])}${select('view','Darstellung',[['Porträt','Porträt'],['Oberkörper','Oberkörper'],['Ganzkörper','Ganzkörper'],['Referenzblatt: Vorder-, Seiten- und Rückansicht derselben Figur','Referenzblatt']])}${select('ratio','Bildformat',[['2:3','2:3 · Hochformat'],['1:1','1:1 · Quadratisch'],['16:9','16:9 · Querformat']])}${select('language','Sprache',[['de','Deutsch'],['en','Englisch · mit lokaler KI übersetzen']])}${['pose:Haltung','clothing:Kleidung (optional abweichend)','expression:Gesichtsausdruck','background:Hintergrund','light:Beleuchtung','negative:Negativ-Prompt (optional)'].map(item=>{const [k,l]=item.split(':');return `<label class="lp-field"><span>${l}</span><input data-image="${k}" value="${esc(o[k]||'')}" maxlength="500"></label>`;}).join('')}</div><div class="lp-callout"><strong>Aussehen beibehalten</strong><p>Speichere die festen Merkmale für weitere Prompts. Kleidung, Haltung und Umgebung bleiben veränderbar.</p><button type="button" class="btn ghost" data-command="freeze">Aktuelles Aussehen festhalten</button><button type="button" class="btn ghost" data-command="unfreeze">Feste Merkmale zurücksetzen</button><span class="lp-fixed-count">${Object.keys(state.akte.imageFixed).length} feste Merkmale</span></div><div class="lp-buttons"><button type="button" class="btn primary" data-command="image">Bildprompt erstellen</button><button type="button" class="btn ghost" data-command="optimize">Mit KI optimieren</button></div><label class="lp-field"><span>Bildprompt · frei bearbeitbar</span><textarea id="lpPrompt" rows="9" placeholder="Dein Prompt erscheint hier."></textarea></label><div class="lp-buttons"><button type="button" class="btn ghost" data-command="copy">Prompt kopieren</button><button type="button" class="btn ghost" data-command="copy-negative">Negativ-Prompt kopieren</button></div><p class="lp-note">Für wiedererkennbare Bilder verwende in deiner Bild-KI zusätzlich ein Referenzbild. Den fertigen Bildimport findest du unter „Weitere Angaben, Beziehungen & Anhänge“.</p>`;
 }
 function render(){
  tabs.innerHTML=[['start','Schnellstart','✦'],...LP_GROUPS.filter(g=>state.mode>1||['identitaet','aussehen','persoenlichkeit','psychologie','moral','bild'].includes(g[0]))].map(g=>`<button type="button" data-tab="${g[0]}" aria-current="${state.tab===g[0]?'page':'false'}"><span>${g[2]}</span>${g[1]}</button>`).join('');
  root.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.mode===state.mode)));
  preview.hidden=true;
  if(state.tab==='bild'){imagePage();return;}
  if(state.tab==='start'){
   page.innerHTML=`<span class="lp-kicker">DEIN EINSTIEG</span><h3>Was weißt du schon über die Figur?</h3><p>Ein Name, ein paar Ideen oder eine Vorlage reichen. Alles andere ist optional.</p><div class="lp-preset-grid">${Object.entries(LP_PRESETS).map(([k,v])=>`<button type="button" data-preset="${k}"><span>${esc(v.label)}</span><small>Als Ausgangspunkt verwenden ↗</small></button>`).join('')}</div><label class="lp-field lp-wide"><span>Deine Idee in eigenen Worten</span><textarea id="lpIdea" rows="3" placeholder="Zum Beispiel: Eine freche Elfe, 24 Jahre, studiert und kommt aus einer reichen Familie.">${esc(host.idea||'')}</textarea></label><div class="lp-grid">${[['name','Name'],['alter','Alter'],['aussehen','Wie sieht die Figur aus?'],['persoenlichkeit','Wie ist sie?']].map(x=>field(x[0],x[1],true)).join('')}${[['spezies','Was ist sie?'],['ziel','Was möchte sie erreichen?'],['schwaeche','Eine besondere Schwäche']].map(x=>field(x[0],x[1])).join('')}</div><div class="lp-buttons"><button type="button" class="btn primary" data-command="complete">✦ Mit KI vervollständigen</button><button type="button" class="btn ghost" data-command="random">Zufällige Figur vorschlagen</button></div><div class="lp-callout"><strong>Deine Angaben bleiben deine Angaben.</strong><p>Die KI schlägt Ergänzungen vor. Du kannst jeden Vorschlag bearbeiten, abwählen oder übernehmen.</p></div><div class="lp-buttons"><button type="button" class="btn ghost" data-command="export">Charakter exportieren</button><label class="btn ghost lp-import">Charakter importieren<input type="file" accept=".json,application/json" id="lpImport" hidden></label><button type="button" class="btn ghost" data-command="check">Widersprüche prüfen</button><button type="button" class="btn ghost" data-command="soul">Figur vertiefen</button></div><details class="lp-dialog-test"><summary>Dialogtest · verändert deine Geschichte nicht</summary><p>Teste die Stimme deiner Figur mit einer kurzen Gesprächssituation.</p><textarea id="lpDialogInput" rows="2" placeholder="Du kommst zu spät zum gemeinsamen Frühstück. Was sagt sie?"></textarea><button type="button" class="btn ghost" data-command="dialog">Figur antworten lassen</button><div id="lpDialogOutput" class="lp-dialog-output" role="status"></div></details>`;
   page.querySelector('.lp-preset-grid').insertAdjacentHTML('beforebegin',`<label class="lp-owner"><input type="checkbox" id="lpIsPlayer" ${form.isPlayer.checked?'checked':''}> Das ist meine Spielerfigur · nur ich steuere sie</label>`);
   page.querySelector('#lpIsPlayer').addEventListener('change',function(){form.isPlayer.checked=this.checked;form.isPlayer.dispatchEvent(new Event('change',{bubbles:true}));changed();});
   return;
  }
  const g=LP_GROUPS.find(g=>g[0]===state.tab);page.innerHTML=`<span class="lp-kicker">${g[2]} / CHARAKTERAKTE</span><h3>${esc(g[1])}</h3><p>${esc(g[3])}</p><div class="lp-grid">${currentFields(g[0])}</div><button type="button" class="btn ghost" data-command="group">✦ Offene Angaben hier ergänzen</button>`;
  if(g[0]==='persoenlichkeit'&&state.mode>1)page.insertAdjacentHTML('beforeend',`<details class="lp-traits"><summary>Grundtemperament · optionale Regler</summary><p>Nicht gesetzt bedeutet offen. Ein Wert von 50 ist eine bewusste mittlere Ausprägung.</p>${LP_TRAITS.map(([k,l,r])=>`<label><span>${l} <b>↔</b> ${r}</span><input type="checkbox" data-trait-use="${k}" ${state.akte.traits[k]!==undefined?'checked':''} aria-label="${l} bis ${r} festlegen"><input type="range" min="0" max="100" value="${state.akte.traits[k]??50}" data-trait="${k}" ${state.akte.traits[k]===undefined?'disabled':''} aria-label="${l} bis ${r}"><output>${state.akte.traits[k]??'offen'}</output></label>`).join('')}</details>`);
  if(g[0]==='verhalten')page.insertAdjacentHTML('beforeend',`<label class="lp-field"><span>Initiativeprofil</span><select id="lpProfile">${[['passiv','Passiv · reagiert überwiegend'],['natuerlich','Natürlich · passend zu Figur und Situation'],['aktiv','Aktiv · verfolgt eigene Ziele energisch']].map(([v,n])=>`<option value="${v}" ${state.akte.profile===v?'selected':''}>${n}</option>`).join('')}</select></label><p class="lp-note">Auch eine schüchterne Figur kann Initiative zeigen. Dieses Profil erlaubt keine Kontrolle über Spielerfiguren.</p>`);
  if(g[0]==='beziehungen')page.insertAdjacentHTML('beforeend',`<div class="lp-callout"><strong>Persönliche Sicht auf eine andere Figur</strong><p>Vertrauen und Sympathie gelten nur aus dieser Perspektive. Verwandtschaft und Partnerrollen werden weiterhin unter „Weitere Angaben“ verknüpft.</p><div id="lpRelations">${state.akte.relations.map((r,i)=>`<fieldset class="lp-relation"><legend>${esc(r.name)}</legend>${['name:Figur','sicht:Meine Sicht auf sie','vertrauen:Vertrauen (0–100 oder Beschreibung)','sympathie:Sympathie','respekt:Respekt','konflikt:Konfliktpotenzial','ursache:Gemeinsame Vergangenheit / Ursache'].map(x=>{const[k,l]=x.split(':');return `<label>${l}<input data-rel="${i}" data-key="${k}" value="${esc(r[k])}"></label>`;}).join('')}<button type="button" data-remove-rel="${i}" class="btn ghost">Sicht entfernen</button></fieldset>`).join('')}</div><button type="button" class="btn ghost" data-command="relation">Sicht hinzufügen</button></div>`);
 }
 function collectImage(){const image={...state.akte.image};page.querySelectorAll('[data-image]').forEach(el=>image[el.dataset.image]=el.value);state.akte.image=image;return image;}
 function changed(){state.revision++;preview.hidden=true;}
 root.addEventListener('input',e=>{
  const el=e.target;if(el.id==='lpIdea'){host.idea=el.value;changed();return;}
  if(el.dataset.field){if(el.dataset.base==='true'){const spec=LP_BASE.find(f=>f[0]===el.dataset.field);if(spec[4])host.set(spec[4],el.value);else state.extra[spec[0]]=el.value;}else state.akte.fields[el.dataset.field]=el.value;changed();}
  if(el.dataset.image){collectImage();changed();}
  if(el.dataset.trait){state.akte.traits[el.dataset.trait]=+el.value;el.parentElement.querySelector('output').textContent=el.value;changed();}
  if(el.dataset.rel!==undefined){state.akte.relations[+el.dataset.rel][el.dataset.key]=el.value;changed();}
 });
 root.addEventListener('change',async e=>{
  const el=e.target;if(el.dataset.traitUse){const k=el.dataset.traitUse;if(el.checked)state.akte.traits[k]=50;else delete state.akte.traits[k];changed();render();}
  if(el.id==='lpProfile'){state.akte.profile=el.value;changed();}
  if(el.id==='lpImport'&&el.files[0]){try{if(el.files[0].size>500000)throw Error('Datei ist zu groß.');const data=JSON.parse(await el.files[0].text());if(data.format!=='lorevia-charakter'||!data.figur||typeof data.figur.name!=='string')throw Error('Keine Lorevia-Charakterdatei.');const f=host.normalize(data.figur);delete f.photo;delete f.brief;delete f.id;f.bezuege=[];writeFigure(f);say('Charakter importiert. Mit „Figur hinzufügen“ in diese Geschichte übernehmen.');}catch(err){say('Import fehlgeschlagen: '+err.message);}}
 });
 async function request(task,question='',scope){
  if(state.busy)return;state.busy=true;const rev=state.revision;root.classList.add('lp-busy');say('Die lokale KI arbeitet … auf schwächeren PCs kann das dauern.');
  try{const r=await api.characterAssist({task,figure:figure(),idea:host.idea||'',question,scope,context:host.context()});if(!r.ok)throw Error(r.error);if(rev!==state.revision){say('Die Figur wurde während der Anfrage geändert. Bitte erneut anfragen.');return;}return r;}
  catch(e){say('KI-Anfrage fehlgeschlagen: '+e.message);}finally{state.busy=false;root.classList.remove('lp-busy');}
 }
 function showSuggestions(r){
  const rows=[...Object.entries(r.suggestion?.base||{}).map(([k,v])=>({k,v,base:true,label:LP_BASE.find(f=>f[0]===k)?.[1]})),...Object.entries(r.suggestion?.fields||{}).map(([k,v])=>({k,v,base:false,label:LP_FIELDS.find(f=>f[0]===k)?.[1]}))].filter(x=>x.label&&typeof x.v==='string');
  const now=figure();const filtered=rows.filter(x=>!state.akte.locked.includes(x.k)&&!(x.base?now[x.k]:state.akte.fields[x.k]));
  preview.hidden=false;preview.innerHTML='<span class="lp-kicker">DEIN ENTWURF</span><h3>Welche Ergänzungen passen?</h3>'+filtered.map((x,i)=>`<label class="lp-suggestion"><span><input type="checkbox" data-accept="${i}" checked>${esc(x.label)}</span><textarea data-suggestion="${i}" rows="2">${esc(x.v)}</textarea></label>`).join('')+'<button type="button" class="btn primary" id="lpAccept">Auswahl in den Editor übernehmen</button><button type="button" class="btn ghost" id="lpReject">Verwerfen</button>';
  preview.querySelector('#lpAccept').onclick=()=>{const suggestion={base:{},fields:{}};filtered.forEach((x,i)=>{if(preview.querySelector(`[data-accept="${i}"]`).checked)suggestion[x.base?'base':'fields'][x.k]=preview.querySelector(`[data-suggestion="${i}"]`).value;});writeFigure(lpApplySuggestions(figure(),suggestion));say('Ergänzungen übernommen. Du kannst alles bearbeiten und danach speichern.');};
  preview.querySelector('#lpReject').onclick=()=>{preview.hidden=true;say('Vorschläge verworfen.');};say(filtered.length?filtered.length+' Ergänzungen zur Auswahl.':'Keine offenen Angaben in diesem Bereich.');preview.scrollIntoView({behavior:'smooth',block:'nearest'});
 }
 root.addEventListener('click',async e=>{
  const mode=e.target.closest('[data-mode]'),tab=e.target.closest('[data-tab]'),lock=e.target.closest('[data-lock]'),preset=e.target.closest('[data-preset]'),remove=e.target.closest('[data-remove-rel]');
  if(mode){state.mode=+mode.dataset.mode;state.tab='start';render();return;}if(tab){state.tab=tab.dataset.tab;render();return;}
  if(lock){const k=lock.dataset.lock;state.akte.locked=state.akte.locked.includes(k)?state.akte.locked.filter(x=>x!==k):[...state.akte.locked,k];changed();render();return;}
  if(preset){const p=LP_PRESETS[preset.dataset.preset];writeFigure(lpApplySuggestions(figure(),{fields:p.fields}));host.idea=[host.idea,p.brief].filter(Boolean).join('\n');render();say('Vorlage als Ausgangspunkt gesetzt. Eigene Angaben bleiben erhalten.');return;}
  if(remove){state.akte.relations.splice(+remove.dataset.removeRel,1);changed();render();return;}
  const command=e.target.closest('[data-command]')?.dataset.command;if(!command)return;
  if(command==='relation'){state.akte.relations.push({name:'Neue Figur',sicht:'',vertrauen:'',sympathie:'',respekt:'',konflikt:'',ursache:''});changed();render();return;}
  if(command==='freeze'){const f=figure();state.akte.imageFixed={};for(const k of ['aussehen','haare','augen','spezies','koerperbau','haut','merkmale','fantasy']){const v=f[k]||state.akte.fields[k];if(v)state.akte.imageFixed[k]=v;}changed();render();say('Feste Merkmale für künftige Bildprompts gespeichert.');return;}
  if(command==='unfreeze'){state.akte.imageFixed={};changed();render();return;}
  if(command==='image'||command==='optimize'){const opts=collectImage(),draft=lpImagePrompt(figure(),opts);let prompt=draft.prompt;if(command==='optimize'||opts.language==='en'){const r=await request('image',JSON.stringify({prompt,language:opts.language||'de',optimize:command==='optimize'}));if(!r)return;prompt=r.text;}page.querySelector('#lpPrompt').value=prompt;say('Prompt erstellt. Du kannst ihn bearbeiten und kopieren.');return;}
  if(command==='copy'||command==='copy-negative'){const text=command==='copy'?page.querySelector('#lpPrompt').value:collectImage().negative||'';if(!text){say('Es gibt noch keinen Text zum Kopieren.');return;}try{await api.copyCharacterText(text);say('In die Zwischenablage kopiert.');}catch(e){say('Kopieren fehlgeschlagen: '+e.message);}return;}
  if(command==='export'){const f=figure();delete f.photo;delete f.brief;delete f.id;delete f.quelle;f.bezuege=[];const blob=new Blob([JSON.stringify({format:'lorevia-charakter',version:1,figur:f},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(f.name||'Charakter').replace(/[<>:"/\\|?*]/g,'_')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);say('Charakter exportiert. Bilder und Verknüpfungen zu dieser Geschichte werden nicht übertragen.');return;}
  if(command==='dialog'){const question=page.querySelector('#lpDialogInput').value.trim();if(!question){say('Beschreibe zuerst eine Gesprächssituation.');return;}const r=await request('dialog',question);if(r){page.querySelector('#lpDialogOutput').textContent=r.text;say('Testantwort · deine Geschichte wurde nicht verändert.');}return;}
  if(['complete','group','random','soul','check'].includes(command)){const task=['check','soul'].includes(command)?command:'complete',question=command==='random'?'Schlage eine zufällige, zur Welt passende erwachsene Figur vor. Bestehende Angaben bleiben erhalten.':'';const r=await request(task,question,command==='group'?state.tab:undefined);if(r){if(task==='complete')showSuggestions(r);else{preview.hidden=false;preview.innerHTML='<h3>'+ (task==='check'?'Hinweise zur Figur':'Fragen, die deine Figur vertiefen')+'</h3><p class="lp-feedback"></p>';preview.querySelector('p').textContent=r.text;say('Hinweise sind Vorschläge. Es wurde nichts geändert.');}}}
 });
 form.addEventListener('input',e=>{if(!root.contains(e.target)){changed();}});
 host.editor={read:()=>({akte:lpNormalize(state.akte),...state.extra}),load(f){state.akte=lpNormalize(f?.akte);state.extra={};for(const [k,,,,control]of LP_BASE)if(!control&&f?.[k])state.extra[k]=f[k];host.idea='';changed();render();}};
 render();return host.editor;
}

// Gemeinsame, unabhängig testbare Ergänzungen für die gesicherte Version 0.4.11.
var LV_WORLD_HELP = {
  Fantasy: 'Eine eigene Welt mit Magie oder fantastischen Wesen. Moderne Technik kann dazugehören.',
  Modern: 'Eine Welt mit heutiger Lebensweise und Technik; auch mit erfundenen Städten.',
  'Antike / Altertum': 'Frühe Hochkulturen, Stadtstaaten oder antike Reiche.',
  Mittelalter: 'Burgen, Dörfer, Handwerk und feudale Herrschaft; Magie ist optional.',
  'Science-Fiction': 'Zukünftige oder alternative Technik, etwa Raumfahrt oder künstliche Intelligenz.',
  Historisch: 'Eine vergangene Epoche mit ihren Lebensweisen und gesellschaftlichen Verhältnissen.',
  Dystopie: 'Eine bedrückende Gesellschaft, etwa mit Überwachung, Unterdrückung oder knappen Ressourcen.',
  Märchen: 'Eine märchenhafte Erzählwelt mit Feen, Wundern und typischen Märchenmotiven.',
  Mischform: 'Mehrere Weltarten verbinden; die gewählten Merkmale gelten gemeinsam.',
  Eigenes: 'Deine eigene Weltart frei beschreiben.'
};
var LV_RELATION_ROLES = ['Fester Freund', 'Feste Freundin', 'Feste Partnerschaft', 'Freund', 'Freundin', 'Bester Freund', 'Beste Freundin', 'Freundschaft', 'Kollege', 'Kollegin', 'Kollegiale Beziehung', 'Rivale', 'Rivalin', 'Rivalität', 'Geschwister', 'Halbgeschwister', 'Zwillingsgeschwister', 'Kind', 'Elternteil', 'Enkelkind', 'Großelternteil', 'Nichte/Neffe', 'Tante/Onkel', 'Cousin/Cousine', 'Ehepartner', 'Stiefkind', 'Stiefelternteil', 'Stiefgeschwister', 'Schwiegerelternteil', 'Schwiegerkind', 'Schwägerin/Schwager'];
var LV_STORY_SCHEMA = {type:'object',properties:{blocks:{type:'array',minItems:1,maxItems:12,items:{type:'object',properties:{type:{type:'string',enum:['action','speech','thought','whisper','paragraph']},text:{type:'string'},who:{type:'string'},parts:{type:'array',maxItems:6,items:{type:'object',properties:{type:{type:'string',enum:['action','speech','whisper','thought']},text:{type:'string',maxLength:900},who:{type:'string'}},required:['type','text']}}},required:['type']}},warteAufSpieler:{type:'boolean'},entscheidung:{type:'object',properties:{wer:{type:'string'},was:{type:'string'},warum:{type:'string'}},required:['wer','was','warum']}},required:['blocks','warteAufSpieler']};
function lvGender(f) {
  var value = String(f.geschlecht || f.gender || '').toLowerCase();
  var match = String(f.notizen || f.notes || '').match(/geschlecht\s*:\s*(weiblich|männlich|divers)/i);
  if (match) value = match[1].toLowerCase();
  return /^(weiblich|female|w)$/.test(value) ? 'w' : /^(männlich|male|m)$/.test(value) ? 'm' : '';
}
function lvInverse(art, target) {
  var gender = lvGender(target || {});
  function pick(m, w, neutral) { return gender === 'w' ? w : gender === 'm' ? m : neutral; }
  if (/^(Fester Freund|Feste Freundin|Feste Partnerschaft)$/i.test(art)) return pick('Fester Freund', 'Feste Freundin', 'Feste Partnerschaft');
  if (/^(Bruder|Schwester|Geschwister)$/.test(art)) return pick('Bruder', 'Schwester', 'Geschwister');
  if (/^(Halbbruder|Halbschwester|Halbgeschwister)$/.test(art)) return pick('Halbbruder', 'Halbschwester', 'Halbgeschwister');
  if (/^(Zwillingsbruder|Zwillingsschwester|Zwillingsgeschwister)$/.test(art)) return pick('Zwillingsbruder', 'Zwillingsschwester', 'Zwillingsgeschwister');
  if (/^(Vater|Mutter|Elternteil)$/.test(art)) return pick('Sohn', 'Tochter', 'Kind');
  if (/^(Sohn|Tochter|Kind)$/.test(art)) return pick('Vater', 'Mutter', 'Elternteil');
  if (/^(Opa|Oma|Großelternteil)$/.test(art)) return pick('Enkel', 'Enkelin', 'Enkelkind');
  if (/^(Enkel|Enkelin|Enkelkind)$/.test(art)) return pick('Opa', 'Oma', 'Großelternteil');
  if (/^(Onkel|Tante|Tante\/Onkel)$/.test(art)) return pick('Neffe', 'Nichte', 'Nichte/Neffe');
  if (/^(Neffe|Nichte|Nichte\/Neffe)$/.test(art)) return pick('Onkel', 'Tante', 'Tante/Onkel');
  if (/^(Cousin|Cousine|Cousin\/Cousine)$/.test(art)) return pick('Cousin', 'Cousine', 'Cousin/Cousine');
  if (/^(Ehemann|Ehefrau|Ehepartner)$/.test(art)) return pick('Ehemann', 'Ehefrau', 'Ehepartner');
  if (/^(Stiefvater|Stiefmutter|Stiefelternteil)$/.test(art)) return pick('Stiefsohn', 'Stieftochter', 'Stiefkind');
  if (/^(Stiefsohn|Stieftochter|Stiefkind)$/.test(art)) return pick('Stiefvater', 'Stiefmutter', 'Stiefelternteil');
  if (/^(Stiefbruder|Stiefschwester|Stiefgeschwister)$/.test(art)) return pick('Stiefbruder', 'Stiefschwester', 'Stiefgeschwister');
  if (/^(Schwiegervater|Schwiegermutter|Schwiegerelternteil)$/.test(art)) return pick('Schwiegersohn', 'Schwiegertochter', 'Schwiegerkind');
  if (/^(Schwiegersohn|Schwiegertochter|Schwiegerkind)$/.test(art)) return pick('Schwiegervater', 'Schwiegermutter', 'Schwiegerelternteil');
  if (/^(Schwager|Schwägerin|Schwägerin\/Schwager)$/.test(art)) return pick('Schwager', 'Schwägerin', 'Schwägerin/Schwager');
  if (/^(Bester Freund|Beste Freundin)$/.test(art)) return pick('Bester Freund', 'Beste Freundin', 'Freundschaft');
  if (/^(Freund|Freundin|Freundschaft)$/.test(art)) return pick('Freund', 'Freundin', 'Freundschaft');
  if (/^(Kollege|Kollegin|Kollegiale Beziehung)$/.test(art)) return pick('Kollege', 'Kollegin', 'Kollegiale Beziehung');
  if (/^(Rivale|Rivalin|Rivalität)$/.test(art)) return pick('Rivale', 'Rivalin', 'Rivalität');
  return '';
}
function lvIncoming(figuren, target) {
  var result = [];
  for (var f of figuren || []) {
    if (!f || f === target || (f.id && f.id === target.id)) continue;
    for (var b of f.bezuege || []) {
      if (!(b.zielId && target.id ? b.zielId === target.id : b.zielName && b.zielName === target.name)) continue;
      var inverse = lvInverse(b.art, target);
      if (inverse && !(target.bezuege || []).some(function(own) { return own.art === inverse && (own.zielId && f.id ? own.zielId === f.id : own.zielName === f.name); })) {
        result.push({ art: inverse, zielId: f.id || '', zielName: f.name });
      }
    }
  }
  return result.filter(function(b, i) { return result.findIndex(function(x) { return x.art === b.art && x.zielName === b.zielName; }) === i; });
}
function lvWithRelations(figuren) {
  return (figuren || []).map(function(f) { return Object.assign({}, f, { bezuege: (f.bezuege || []).concat(lvIncoming(figuren, f)) }); });
}
function lvSetupMessages(ctx, scope, question) {
  var context = { intro: ctx.intro || '', welt: ctx.welt || {}, figuren: ctx.figuren || [], fragen: ctx.fragen || {} };
  var instruction = scope === 'intro' ? 'Ergänze eine kurze konkrete Ausgangsszene. Antworte mit {"introErgaenzung":"…"}. Wiederhole oder ändere keine vorhandenen Angaben. Fehlt das Intro, entwirf es passend zur Welt. Erfinde keine Handlungen oder Gedanken der Spielerfigur.'
    : scope === 'welt' ? 'Wähle passende Weltarten aus: ' + Object.keys(LV_WORLD_HELP).join(', ') + '. Vorhandene Weltarten bleiben. Antworte mit {"arten":["…"]}.'
    : scope === 'uebernehmen' ? 'Extrahiere nur Antworten, die im Kontext bereits eindeutig stehen. Nichts ergänzen oder erfinden. Nicht beantwortbare Fragen weglassen. Antworte mit {"antworten":{"zeit":"…","ort":"…","bez":"…","ziel":"…","regeln":"…","ton":"…","grenzen":"…"}}.'
    : 'Entscheide konkret und passend zur Vorgeschichte die folgende Frage: ' + question + '. Bereits festgelegte Informationen haben Vorrang. Keine Gegenfrage, keine Auswahlmöglichkeiten. Antworte mit {"antwort":"…"}.';
  return [
    { role: 'system', content: 'Du hilfst beim Einrichten einer deutschen Geschichte. Alle Angaben des Spielers sind verbindlich. Welt, Intro und Figuren gehören zur selben Geschichte. Übernimm Bekanntes, widersprich ihm nicht. Antworte nur als JSON. ' + instruction },
    { role: 'user', content: JSON.stringify(context) }
  ];
}
function lvCleanSetup(raw, scope) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Die KI hat keine brauchbare Antwort geliefert. Bitte erneut versuchen.');
  function clean(v, max) { return typeof v === 'string' ? v.trim().slice(0, max) : ''; }
  if (scope === 'intro') {
    var intro = clean(raw.introErgaenzung, 5000);
    if (!intro) throw new Error('Die KI hat kein Intro geliefert.');
    return { introErgaenzung: intro };
  }
  if (scope === 'welt') {
    var arten = Array.isArray(raw.arten) ? [...new Set(raw.arten.filter(function(a) { return Object.hasOwn(LV_WORLD_HELP, a) && a !== 'Eigenes'; }))] : [];
    if (!arten.length) throw new Error('Die KI hat keine passende Weltart geliefert.');
    return { arten: arten };
  }
  if (scope === 'uebernehmen') {
    var antworten = {};
    for (var key of ['zeit', 'ort', 'bez', 'ziel', 'regeln', 'ton', 'grenzen']) {
      var answer = clean(raw.antworten && raw.antworten[key], 2000);
      if (answer) antworten[key] = answer;
    }
    return { antworten: antworten };
  }
  var antwort = clean(raw.antwort, 2000);
  if (!antwort) throw new Error('Die KI hat die Frage nicht beantwortet.');
  return { antwort: antwort };
}
function lvAbsentViolations(text, story) {
  if (!story.spielerAbwesend) return [];
  var player = (story.characters || []).find(function(c) { return c.isPlayer; });
  var name = player && player.name || '';
  var narr = String(text || '').replace(/\*\*[\s\S]*?\*\*/g, ' ').replace(/\*[^*\n]+\*/g, ' ');
  var escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var namedAction = name && new RegExp('(?:^|[.!?]\\s+|\\n)' + escaped + '\\s+(?:kommt|steht|sitzt|geht|betritt|sagt|fragt|nimmt|ist hier|ist da|nickt|lächelt)', 'i').test(narr);
  var physical = /\b(?:neben|vor|hinter|gegenüber|mit|zu)\s+dir\b|\b(?:sieht|schaut|blickt|stößt|berührt|umarmt|küsst|fragt)\s+dich\b/i.test(narr);
  var encounter = new RegExp('\\b(?:sieht|schaut|blickt|grüßt|berührt|umarmt|küsst|fragt|begrüßt)\\s+(?:kurz\\s+)?(?:' + (escaped || '(?!)') + '|den Spieler)\\b', 'i').test(narr);
  var continuity = false;
  if (name && typeof checkContinuity === 'function') {
    var memory = { figuren: {} }; memory.figuren[name] = { fakten: {}, gesperrt: [], wissen: [], anwesend: false };
    var check = checkContinuity(text, memory, [{name:name,isPlayer:false}]);
    continuity = check.violations.length > 0 || check.events.length > 0;
  }
  return namedAction || physical || encounter || continuity ? [{ code: 'spieler-abwesend', msg: 'Die Spielerfigur ist noch nicht aufgetreten. Schreibe nur die Szene der anderen Figuren; keine Anwesenheit, Begegnung oder Handlung der Spielerfigur erfinden.' }] : [];
}
function lvGroundAnswers(answers, ctx) {
  var world = ctx.welt || {};
  var source = [ctx.intro || '',world.rohtext || '',...(world.fakten || []).map(function(f){return f.value || '';})].join('\n');
  function norm(t){return String(t).toLowerCase().replace(/\s+/g,' ').trim();}
  var result = {};
  var types = {
    zeit: /\d|morgen|abend|nacht|mittag|jahr|winter|sommer|frühling|herbst/i,
    bez: /mutter|vater|schwester|bruder|famil|freund|partner|kennen|fremd|kolleg|rival/i,
    ziel: /will|möcht|ziel|such|brauch|plant|vorhat|versuch/i,
    regeln: /magie|magisch|technik|gesetz|regel|verbot|erlaub|handy|kamera|wesen|elf|fee/i,
    grenzen: /nie|nicht|verbot|tabu|grenz/i
  };
  for(var key of Object.keys(answers || {})) {
    var value = answers[key];
    if(!norm(value) || !norm(source).includes(norm(value))) continue;
    if(types[key] && !types[key].test(value)) continue;
    result[key] = value;
  }
  return result;
}
function lvIsEntryInput(text) {
  var t = typeof lvSplitInput === 'function' ? lvSplitInput(text).storyText : String(text || '').trim();
  if (!t) return false;
  if (/^(?:bitte\s+)?(?:kürzer(?: bitte)?|splitt?e(?: bitte)?|mehr eigenständigkeit|eigenständiger)[.!]?$/i.test(t)) return false;
  if (/^(?:das\s+)?(?:entscheidest du|entscheide du|du entscheidest|ki entscheidet)[.!]?$/i.test(t)) return false;
  return true;
}
function lvStoryJson(raw) {
  var parsed = JSON.parse(String(raw).replace(/^```(?:json)?\s*|\s*```$/g,''));
  if (!Array.isArray(parsed.blocks) || !parsed.blocks.length || parsed.blocks.length > 12) throw new Error('Ungültige Geschichte');
  var sections = [];
  for (var block of parsed.blocks) {
    if(block?.type==='paragraph'&&Array.isArray(block.parts)){
      var hasAttribution=block.parts.some(p=>p.type==='action'&&block.parts.some(s=>s.who&&p.text?.includes(s.who)));
      var parts=block.parts.map(function(part){if(!part||typeof part.text!=='string')return '';var value=part.text.trim().replace(/\*+/g,'');if(value.length>900)throw new Error('Absatzteil zu lang');if(part.type==='speech'||part.type==='whisper'){var rendered=(part.type==='speech'?'**':'*')+'„'+value.replace(/^[„“"»]+|[„“"«]+$/g,'')+'“'+(part.type==='speech'?'**':'*');return !hasAttribution&&part.who?part.who+' sagt: '+rendered:rendered;}if(part.type==='thought')return '*'+value+'*';return part.type==='action'?value:'';}).filter(Boolean);
      if(parts.length)sections.push(parts.join(' '));
      if(parsed.warteAufSpieler===true&&block.parts.some(p=>['speech','whisper'].includes(p.type)))break;
      continue;
    }
    if (!block || typeof block.text !== 'string' || !block.text.trim()) continue;
    var text = block.text.trim().replace(/\*\*/g,'');
    if (text.length > 1600) throw new Error('Absatz zu lang');
    if (block.type === 'speech') sections.push('**' + text.replace(/^[„“"»]+|[„“"«]+$/g,'') + '**');
    else if (block.type === 'thought' || block.type === 'whisper') sections.push('*' + text.replace(/\*/g,'') + '*');
    else if (block.type === 'action') sections.push(text);
    // Wenn die Szene eine Spielerantwort benötigt, endet sie an der ersten
    // vollständigen Frage statt das Warten noch mehrfach auszuerzählen.
    if (parsed.warteAufSpieler === true && (block.type === 'speech' || block.type === 'whisper') && /\?[“"»«]?$/.test(text)) break;
  }
  if (!sections.length) throw new Error('Leere Geschichte');
  var decision = parsed.entscheidung;
  if (decision && typeof decision.was === 'string' && decision.was.trim()) sections.push('[[ENTSCHEIDUNG: ' + String(decision.wer || '').replace(/[|\]\r\n]/g,' ') + ' | ' + decision.was.replace(/[|\]\r\n]/g,' ') + ' | ' + String(decision.warum || '').replace(/[|\]\r\n]/g,' ') + ']]');
  return sections.join('\n\n') + (parsed.warteAufSpieler === true ? '\n\n[[WARTE_AUF_SPIELER]]' : '');
}
function lvRemovePlayerNarration(text, story, ctx) {
  if (!story.inputShown && ctx.mode !== 'tick' && ctx.mode !== 'rewrite') return {text:text,removed:[]};
  var removed=[];
  var kept=paragraphs(text).map(function(p){
    return sentences(p).filter(function(sentence){
      // NPC-Dialog wird als Dialog geprüft; Gedanken über eigene Spielerhandlungen
      // dürfen nicht durch die Kursiv-Markierung am Wächter vorbeigehen.
      var probe = /^\*[^*]/.test(sentence) ? sentence.replace(/\*/g,'') : sentence;
      var playerVariants=[story].concat((story.ownedNames || []).map(function(name){return Object.assign({},story,{characters:(story.characters || []).map(function(c){return Object.assign({},c,{isPlayer:c.name===name});})});}));
      var bad=playerVariants.some(function(variant){return checkOutput(probe,variant,ctx).violations.some(function(v){return v.code==='spieler-erfunden'||v.code==='du-form';});});
      if (story.inputShown && /^\*\*[\s\S]*\*\*$/.test(sentence.trim())) {
        var normalized = sentence.toLowerCase().replace(/[^a-zäöüß0-9\s]/g,' ').replace(/\s+/g,' ').trim();
        var input = String(ctx.playerInput || '').toLowerCase().replace(/[^a-zäöüß0-9\s]/g,' ').replace(/\s+/g,' ').trim();
        if (normalized.split(' ').length >= 4 && input.includes(normalized)) bad = true;
      }
      if(bad) removed.push(sentence);
      return !bad;
    }).join(' ');
  }).filter(Boolean);
  return {text:kept.join('\n\n'),removed:removed};
}

// Aus Christians Regeltext, Klammerkorrektur und zehn Stilbeispielen abgeleitet.
// Beispielnamen, Verwandtschaft und Handlung werden nicht zum globalen Storykanon.
var LV_STYLE_PROFILE = [
  'SCHREIBSTIL UND SPIELREGELN DES SPIELERS:',
  'Schreibe flüssiges, natürliches Deutsch mit direkten, charaktergerechten Dialogen. Jede Figur hat eine eigene Stimme, eigene Ziele, Verpflichtungen und Schwächen. Keine automatische Zustimmung, Bewunderung oder Verliebtheit; etablierte Beziehungen dürfen vertraut sein.',
  'Ein Absatz trägt einen kleinen erzählerischen Schwerpunkt, meist ein bis drei kurze Sätze. Handlung und Dialog dürfen im selben Absatz stehen. Beschreibe Gesten nur, wenn sie etwas vermitteln. Keine Füllbewegungen, kein Pathos, keine Therapiereden und keine ständigen Wiederholungen.',
  'Nicht alle Anwesenden reagieren auf jede Aussage. Lass nur passende Figuren sprechen; andere dürfen ihrem eigenen Alltag nachgehen. Witz und Sarkasmus müssen zur Figur passen und dürfen nicht zur immer gleichen Floskel werden.',
  'Spielerhandlungen, Gefühle, Gedanken, Antworten und Entscheidungen kommen ausschließlich vom Spieler. Seine bereits sichtbare Eingabe nicht wiederholen. Eine andere Figur darf sein Verhalten falsch interpretieren. Bei einem Angriff ist nur der Versuch vorgegeben, kein garantierter Treffer; stoppe vor der nächsten Spielerreaktion.',
  'Die Welt entwickelt sich eigenständig. Konflikte und Beziehungen haben nachvollziehbare Konsequenzen. Der Spieler kann irren und scheitern. Keine automatische moralische oder sachliche Überlegenheit des Spielers.',
  'Gesprochene Sprache fett, Flüstern kursiv, normale Handlung unformatiert. Runde Klammern sind ausschließlich außerweltliche Regieanweisungen des Spielers, niemals Gedankenformat oder Figurenwissen. NPC-Gedanken nur sparsam in Sternchen; nie Spieler-Gedanken erfinden.',
  'Meist 80–200 Wörter, kleine Antworten kürzer; größere Familien- oder emotionale Szenen bei Bedarf bis etwa 250–350 Wörter. Richtwerte, kein Auffüllen. Enden an einem natürlichen Handlungspunkt; keine pauschale Schlussfrage Was tust du?',
  'BEHAUPTUNG IST NICHT WAHRHEIT: Halte bestätigte Tatsachen, Aussagen einzelner Figuren und Vermutungen auseinander. Unbewiesene Behauptungen nicht als bestätigte Fakten festschreiben. Jede Figur weiß nur, was sie selbst erlebt oder nachweisbar erfahren hat.',
  'An einer notwendigen Spielerentscheidung anhalten: beispielsweise nach dem Klopfen und der Bitte um Einlass nicht eigenmächtig öffnen oder den Spieler zustimmen lassen. Setze warteAufSpieler auf true, wenn der nächste Beat seine Reaktion benötigt.'
].join('\n');

function lvSplitInput(value) {
  var input=String(value || ''), story='', directions=[], direction='', depth=0, quote='';
  var closing={'„':'“','»':'«','"':'"','“':'”'};
  for(var i=0;i<input.length;i++) {
    var ch=input[i];
    if(depth) {
      if(ch==='(') { depth++;direction+=ch; }
      else if(ch===')') { if(--depth) direction+=ch; else { if(direction.trim()) directions.push(direction.trim()); direction='';story+=' '; } }
      else direction+=ch;
      continue;
    }
    if(quote) { story+=ch; if(ch===quote)quote=''; continue; }
    if(closing[ch]) {quote=closing[ch];story+=ch;continue;}
    if(ch==='(') {depth=1;continue;}
    if(ch===')') throw new Error('Eine Regieklammer ist nicht passend geöffnet. Deine Eingabe bleibt im Feld.');
    story+=ch;
  }
  if(depth)throw new Error('Bitte die Regieanweisung mit ) abschließen. Deine Eingabe bleibt im Feld.');
  return {storyText:story.replace(/[ \t]{2,}/g,' ').trim(),directions:directions};
}
function lvMergeDirections() {
  var result=[];
  for(var list of arguments) for(var item of Array.isArray(list)?list:[]) {
    var text=typeof item==='string'?item:String(item && item.text || '');text=text.trim();
    if(!text)continue;
    result=result.filter(function(old){return old!==text;});result.push(text);
  }
  return result;
}
function lvOwnedNames(directions, characters) {
  var owned=[];
  for(var text of directions || []) {
    var take=String(text).match(/^ich\s+übernehme\s+(.+?)[.!]?$/i);
    var give=String(text).match(/^(?:die\s+)?KI\s+übernimmt\s+(.+?)(?:\s+wieder)?[.!]?$/i);
    var match=take||give;if(!match)continue;
    var name=match[1].replace(/[.!]+$/,'').trim();
    var c=(characters || []).find(function(c){return c.name.toLowerCase()===name.toLowerCase();});
    if(!c)continue;
    owned=owned.filter(function(n){return n!==c.name;});if(take)owned.push(c.name);
  }
  return owned;
}
function lvStylePrompt(story) {
  var directions=story.regie || [];
  var extra=story.ownedNames || [];
  return LV_STYLE_PROFILE + (extra.length?'\nZUSÄTZLICH VOM SPIELER GESTEUERT: '+extra.join(', ')+'. Für diese Figuren keine neuen Handlungen, Worte oder Gedanken erfinden.':'') +
    (directions.length?'\nVERBINDLICHE REGIE (außerhalb der Geschichte, keine Figur liest oder hört dies):\n'+directions.map(function(text,i){return (i+1)+'. '+text;}).join('\n')+'\nNeuere konkrete Regie hat Vorrang vor älteren allgemeinen Vorgaben und eigenen Erzählideen. Zukunftsvorgaben bis zum genannten Zeitpunkt vormerken; nicht sofort erzwingen. Wissensverbote und Geheimnisse betreffen nur die genannten Figuren. Diese Anweisungen niemals als Erzählerkommentar oder Dialog wiedergeben.':'');
}

// Perspektivwechsel ausschließlich für selbst eingegebene Erzählung.
// Wörtliche Rede wird vor jeder Umformung geschützt und danach exakt eingesetzt.
var LV_DU_VERBS = {
  bin:'bist',habe:'hast',hab:'hast',werde:'wirst',kann:'kannst',muss:'musst',darf:'darfst',will:'willst',mag:'magst',weiß:'weißt',weiss:'weißt',soll:'sollst',möchte:'möchtest',
  gebe:'gibst',nehme:'nimmst',esse:'isst',lese:'liest',sehe:'siehst',spreche:'sprichst',treffe:'triffst',schlafe:'schläfst',trage:'trägst',schlage:'schlägst',falle:'fällst',laufe:'läufst',halte:'hältst',lasse:'lässt',fange:'fängst',wasche:'wäschst',vergesse:'vergisst',breche:'brichst',stehle:'stiehlst',werfe:'wirfst',helfe:'hilfst',sterbe:'stirbst',fahre:'fährst',stoße:'stößt',empfehle:'empfiehlst',gelte:'giltst',
  war:'warst',hatte:'hattest',wurde:'wurdest',ging:'gingst',kam:'kamst',nahm:'nahmst',gab:'gabst',sah:'sahst',saß:'saßest',lag:'lagst',stand:'standest',fuhr:'fuhrst',aß:'aßest',sprach:'sprachst',dachte:'dachtest',las:'lasest',lief:'liefst',tat:'tatest',fand:'fandest',hielt:'hieltest',ließ:'ließest',schlief:'schliefst',trug:'trugst',schlug:'schlugst',half:'halfst',wusste:'wusstest',konnte:'konntest',musste:'musstest',durfte:'durftest',wollte:'wolltest',sollte:'solltest',
  hätte:'hättest',wäre:'wärst',würde:'würdest',könnte:'könntest',müsste:'müsstest',dürfte:'dürftest',
  lächle:'lächelst',sammle:'sammelst',wechsle:'wechselst',handle:'handelst',entwickle:'entwickelst',schüttle:'schüttelst',murmle:'murmelst',
  geh:'gehst',mach:'machst',sag:'sagst',frag:'fragst',schau:'schaust',guck:'guckst',grins:'grinst',nick:'nickst',lächel:'lächelst',denk:'denkst',setz:'setzt',stell:'stellst',leg:'legst',zeig:'zeigst'
};
var LV_REGULAR_ACTIONS = 'gehe mache sage frage schaue gucke grinse nicke denke setze stelle lege zeige stehe sitze drehe öffne schließe höre fühle spüre merke glaube hoffe erinnere berühre umarme küsse lache weine rufe flüstere murmle murmele antworte erwidere warte bleibe komme kehre hole bringe ziehe drücke schiebe hebe senke bewege beuge lehne atme reiche schüttle schüttele streiche spiele lerne tanze arbeite rede schreibe suche brauche prüfe probiere probiere erzähle erkläre entschuldige verabschiede verabschiede verbeuge verstehe verstecke überlege beschließe entscheide versuche zögere ändere verbessere beobachte betrachte betone notiere schenke danke grüße trinke rieche schmecke hasse liebe bevorzuge sammle lebe wohne'.split(' ');
function lvRegularDu(word) {
  if (!/e$/.test(word)) return '';
  var stem=word.slice(0,-1);
  if (/[sßzx]$/.test(stem)) return stem+'t';
  if (/[dt]$|[^aeiouäöüyrlh][mn]$/.test(stem)) return stem+'est';
  return stem+'st';
}
for(var lvAction of LV_REGULAR_ACTIONS) if(!LV_DU_VERBS[lvAction])LV_DU_VERBS[lvAction]=lvRegularDu(lvAction);
function lvDuVerb(word, allowRegular) {
  if(LV_DU_VERBS[word])return LV_DU_VERBS[word];
  for(var stem of ['nehme','gebe','sehe','spreche','treffe','trage','schlage','falle','laufe','halte','lasse','fange','breche','werfe','fahre','lese','stehe','komme']) {
    if(word===stem)continue;
    if(word.endsWith(stem) && /^(?:an|auf|aus|ein|ab|be|ent|er|ver|zer|mit|nach|vor|zurück|über|unter|durch|um|wieder|weg)$/.test(word.slice(0,-stem.length))) return word.slice(0,-stem.length)+(LV_DU_VERBS[stem]||lvRegularDu(stem));
  }
  return allowRegular ? lvRegularDu(word) : '';
}
function lvProtectSpeech(value) {
  var speech=[], text=String(value || '');
  text=text.replace(/(?:\*\*)?[„"“»]([^"“”«]*?)["“”«](?:\*\*)?|\*\*([^*]+)\*\*/g,function(full,quoted,bold){
    var content=quoted===undefined?bold:quoted;
    var exact=full.replace(/^\*\*|\*\*$/g,'');
    speech.push({content:content,formatted:'**'+exact+'**'});
    return '\uE000'+(speech.length-1)+'\uE001'+(/[.!?…][“"«”]?$/.test(exact)?'\uE002':'');
  });
  return {text:text,speech:speech};
}
function lvToDuNarration(value) {
  var protectedText=lvProtectSpeech(value), text=protectedText.text;
  var parts=text.split(/([.!?;\n\uE002]+)/), previousPlayer=false;
  var foreign=/^(?:er|sie|es|wir|ihr|man)$/i;
  var skip=/^(?:eine|die|diese|jene|meine|deine|ihre|unsere|eure|keine|welche|gerade|heute|morgen|leise|lange|gerne|lieber|bitte|zuhause|nachhause)$/i;
  for(var p=0;p<parts.length;p+=2) {
    var clause=parts[p];
    if(!clause.trim())continue;
    // Kommas und neue Subjekte begrenzen den Geltungsbereich, die Wörter
    // anderer Figuren werden dadurch nicht in die zweite Person umgeformt.
    var chunks=clause.split(/(,)/), active=previousPlayer;
    for(var c=0;c<chunks.length;c+=2) {
      var chunk=chunks[c], hasIch=/\bich\b/i.test(chunk), explicit=/\b(?:ich|du)\b/i.test(chunk), alreadyDu=explicit&&!hasIch;
      var words=chunk.match(/[A-Za-zÄÖÜäöüß]+|[^A-Za-zÄÖÜäöüß]+/g)||[];
      var first=words.findIndex(function(w){return /^[A-Za-zÄÖÜäöüß]+$/.test(w);});
      var start=first>=0?words[first]:'';
      var startsVerb=!!lvDuVerb(start.toLowerCase(),false);
      if(explicit)active=true;
      else if(foreign.test(start)||/^(?:dass|weil|während|obwohl|wenn|als)\b/i.test(chunk.trim()))active=false;
      else if(start && /^[A-ZÄÖÜ]/.test(start) && !startsVerb && !/^(?:Und|Dann|Danach|Anschließend|Daraufhin|Nun|Jetzt|Dabei|Meine|Mein|Meinen|Meinem|Meiner)$/.test(start))active=false;
      else if(startsVerb)active=true;
      var finiteSeen=false, afterCoord=false;
      var subordinate=/^\s*(?:weil|dass|während|obwohl|wenn|als|ob|bevor|nachdem|sobald|solange|bis|was|wer|wo|wie|warum)\b/i.test(chunk);
      var finitePositions=new Set();
      if(subordinate&&hasIch) {
        var group=[];
        function endGroup(){if(group.length){var last=group[group.length-1];if(!skip.test(words[last])&&lvDuVerb(words[last].toLowerCase(),true))finitePositions.add(last);}group=[];}
        for(var wi=0;wi<words.length;wi++) if(/^[A-Za-zÄÖÜäöüß]+$/.test(words[wi])) {
          if(/^(?:und|aber|doch|oder)$/i.test(words[wi]))endGroup();else group.push(wi);
        }
        endGroup();
      }
      for(var i=0;i<words.length;i++) {
        var w=words[i]; if(!/^[A-Za-zÄÖÜäöüß]+$/.test(w))continue;
        var lower=w.toLowerCase(), upper=w[0]===w[0].toUpperCase();
        if(lower==='ich') {words[i]=upper?'Du':'du';active=true;finiteSeen=false;afterCoord=false;continue;}
        if(lower==='du') {active=true;continue;}
        if(lower==='mich'||lower==='mir'||/^mein(?:e|en|em|er|es)?$/.test(lower)) {
          var pronoun=lower==='mich'?'dich':lower==='mir'?'dir':lower.replace(/^mein/,'dein');
          words[i]=upper?pronoun[0].toUpperCase()+pronoun.slice(1):pronoun;afterCoord=false;continue;
        }
        if(/^(?:und|aber|doch|während|weil|als|dass|obwohl)$/.test(lower)) {afterCoord=true;continue;}
        if(afterCoord && (foreign.test(lower)||(upper&&!lvDuVerb(lower,false)))) {active=false;afterCoord=false;continue;}
        if(active && !alreadyDu && (!finiteSeen||afterCoord||(subordinate&&finitePositions.has(i))) && (!subordinate||!hasIch||finitePositions.has(i)) && (!upper || i===first)) {
          var form=lvDuVerb(lower,hasIch&&!finiteSeen&&!skip.test(lower));
          if(form) {words[i]=upper?form[0].toUpperCase()+form.slice(1):form;finiteSeen=true;afterCoord=false;}
        }
      }
      if(startsVerb&&!explicit && !/^(?:und|aber|doch)\b/i.test(chunk.trim())) {
        words[first]='Du '+words[first][0].toLowerCase()+words[first].slice(1);
      }
      chunks[c]=words.join('');
    }
    parts[p]=chunks.join('');previousPlayer=active;
  }
  text=parts.join('').replace(/\uE002/g,'');
  return text.replace(/\uE000(\d+)\uE001/g,function(_,i){return protectedText.speech[+i].formatted;});
}
function lvOwnInputBlocks(value) {
  var raw=lvSplitInput(value).storyText;
  if(!raw)return [];
  return raw.split(/\n\s*\n/).filter(function(p){return p.trim();}).map(function(paragraph){
    var converted=lvToDuNarration(paragraph.trim());
    var onlySpeech=/^\*\*([\s\S]+)\*\*$/.exec(converted);
    return {type:onlySpeech?'speech':'action',who:'du',from:'eingabe',text:onlySpeech?onlySpeech[1]:converted,eingabeOriginal:paragraph.trim()};
  });
}

// General narration rules. Personal stories and reference chats never belong here.
function lvContinuation(value) {
  var v=value&&typeof value==='object'?value:{},out={version:1};
  function text(x,n){return typeof x==='string'?x.trim().slice(0,n):'';}
  for(var k of ['datum','ort','stand'])out[k]=text(v[k],k==='stand'?1800:180);
  for(var k of ['kanon','offen','luecken'])out[k]=(Array.isArray(v[k])?v[k]:[]).map(x=>text(x,500)).filter(Boolean).slice(0,32);
  out.behauptungen=(Array.isArray(v.behauptungen)?v.behauptungen:[]).slice(0,20).map(x=>({text:text(x?.text,500),quelle:text(x?.quelle,100),status:text(x?.status,80)||'unbestätigt'})).filter(x=>x.text);
  out.wissen=(Array.isArray(v.wissen)?v.wissen:[]).slice(0,24).map(x=>({wer:text(x?.wer,100),was:text(x?.was,500)})).filter(x=>x.wer&&x.was);
  out.termine=(Array.isArray(v.termine)?v.termine:[]).slice(0,16).map(x=>({wann:text(x?.wann,100),was:text(x?.was,500),status:text(x?.status,100)})).filter(x=>x.was);
  return out;
}
function lvContinuationPrompt(value){
  var c=lvContinuation(value),lines=[];
  if(c.stand)lines.push('GESICHERTER FORTSETZUNGSSTAND (spätere Originalereignisse haben Vorrang): '+c.stand);
  if(c.datum||c.ort)lines.push('Zeit und Ort dieses Ausgangsstands: '+[c.datum,c.ort].filter(Boolean).join(' · '));
  if(c.kanon.length)lines.push('BESTÄTIGTER KANON:\n'+c.kanon.map(x=>'- '+x).join('\n'));
  if(c.behauptungen.length)lines.push('AUSSAGEN, KEINE BEWIESENEN TATSACHEN:\n'+c.behauptungen.map(x=>'- '+x.quelle+': '+x.text+' ['+x.status+']').join('\n'));
  if(c.wissen.length)lines.push('WISSENSGRENZEN:\n'+c.wissen.map(x=>'- '+x.wer+': '+x.was).join('\n'));
  if(c.offen.length)lines.push('OFFEN – NICHT ALS BEREITS GEKLÄRT ERZÄHLEN:\n'+c.offen.map(x=>'- '+x).join('\n'));
  if(c.termine.length)lines.push('VORGEMERKTE TERMINE – KEIN VORWEGGENOMMENES ERGEBNIS:\n'+c.termine.map(x=>'- '+x.wann+': '+x.was+'; '+x.status).join('\n'));
  if(c.luecken.length)lines.push('IMPORTLÜCKEN – KEINE VERGANGENEN EREIGNISSE DAZUERFINDEN:\n'+c.luecken.map(x=>'- '+x).join('\n'));
  return lines.join('\n\n');
}
function lvEpicScope(raw){
  var input=lvSplitInput(raw||''),directions=input.directions.join(' ');
  var request=/(?:beschreib\w*|erzähl\w*|gestalt\w*)[^.!?]{0,70}(?:episch|kampf)|(?:kampf|kampfszene)[^.!?]{0,70}(?:ausgestalten|episch)/i.test(directions);
  var combat=/kämpf|kampf|waffe|pistole|gewehr|angreif|angriff|schlag|schläg|schieß|schieße|lege?\s+(?:ich\s+)?los|leg(?:e)?\s+los|hieb|tritt|trete|klinge|schwert/i.test(input.storyText);
  return request&&combat&&input.storyText?{art:'kampf',einmalig:true,handlung:input.storyText.slice(0,2500)}:null;
}
function lvScopePrompt(story){
  if(!story.ausgestaltung)return 'SPIELERKONTROLLE: Keine neuen Spielerhandlungen, Worte, Gedanken, Gefühle oder Entscheidungen. Nur die anderen Figuren fortführen.';
  return 'EINMALIGE FREIGABE FÜR DIESE KAMPFSZENE: Der Spieler erlaubt zusätzliche körperliche Kampfhandlungen seiner Figur innerhalb der begonnenen Auseinandersetzung. Alle diese Handlungen zwingend in Du-Form: Du weichst aus, du parierst. Niemals den Spielernamen, er oder seine als Erzählperspektive der Spielerfigur verwenden. Gestalte Bewegungen, sichtbare Abläufe, Folgen und Reaktionen anschaulich aus. Seine ausdrücklich genannten Grenzen gelten. Keine neuen Dialoge, Gedanken, Gefühle, Ziele, Ortsreisen oder Entscheidungen seiner Figur erfinden. Vor einem neuen Konflikt, Gegnerangebot oder einer notwendigen Entscheidung anhalten. Keine automatische Freigabe im nächsten Zug oder beim Welt-Takt.';
}
function lvCard(c,present){
  var f=c.bogen||{},details=[],limit=c.isPlayer?650:present?1200:280;
  for(var [key,label]of [['alter','Alter'],['beruf','Tätigkeit'],['persoenlichkeit','Persönlichkeit'],['stimme','Stimme'],['beziehungen','Beziehungen'],['eltern','Familie'],['aussehen','Aussehen'],['haare','Haare'],['augen','Augen'],['outfit','Kleidung']])if(f[key])details.push(label+': '+String(f[key]));
  if(f.akte&&typeof lpDossierLines==='function')details.push(lpDossierLines(f).join('; '));
  if(f.notizen)details.push(f.notizen);
  if(!details.length)details.push(c.profile||'');
  var profile=details.join('; ');return c.name+' ['+(c.isPlayer?'Spielerfigur':present?'hier anwesend':'abwesend, nicht spontan auftreten lassen')+'] '+profile.slice(0,limit);
}
function lvNarrativeSchema(story){
 var names=(story.characters||[]).filter(c=>!c.isPlayer&&(!story.status?.present||story.status.present.includes(c.name))).map(c=>c.name);
 if(!names.length)names=['Erzähler'];
 var action={type:'object',properties:{type:{type:'string',enum:['action']},text:{type:'string',maxLength:750}},required:['type','text'],additionalProperties:false};
 var speech={type:'object',properties:{type:{type:'string',enum:['speech','whisper']},who:{type:'string',enum:names},text:{type:'string',maxLength:750}},required:['type','who','text'],additionalProperties:false};
 return {type:'object',properties:{blocks:{type:'array',minItems:1,maxItems:10,items:{type:'object',properties:{type:{type:'string',enum:['paragraph']},parts:{type:'array',minItems:1,maxItems:4,items:{anyOf:[action,speech]}}},required:['type','parts'],additionalProperties:false}},warteAufSpieler:{type:'boolean'},entscheidung:LV_STORY_SCHEMA.properties.entscheidung},required:['blocks','warteAufSpieler'],additionalProperties:false};
}
function lvStructureInstruction(story,decision){
 return 'Gib nur JSON nach dem Schema aus. blocks enthält Absätze. Jeder Absatz besteht ausschließlich aus type: paragraph und parts. In parts gehören erzählte Handlungen in type: action mit text; jeder gesprochene Satz gehört getrennt in type: speech oder whisper mit who und text. who ist der tatsächliche NPC-Name, kein Textbestandteil. Keine Rede in action-Teilen verstecken. Keine zusätzlichen Feldnamen im Text. Verbinde kurze Handlung und passende Rede innerhalb desselben Absatzes. Wenn der Spieler reagieren muss, warteAufSpieler: true und nach dem ersten an ihn gerichteten Redebeitrag enden. '+lvScopePrompt(story)+(decision?' Die tatsächlich getroffene NPC-Entscheidung zusätzlich in entscheidung mit wer, was und warum.':'');
}
function lvNarrativeSystem(story){
  var chars=story.characters||[],p=chars.find(c=>c.isPlayer),present=new Set(story.status?.present||chars.filter(c=>!c.isPlayer).map(c=>c.name));
  var lines=['Du erzählst eine fortlaufende deutschsprachige Rollenspielgeschichte. Schreibe die nächste konkrete Szene, keinen Bericht über das Schreiben.',
    'Der Spieler steuert '+(p?.name||'seine Figur')+'. Seine bereits sichtbare Eingabe nicht nacherzählen. Erzählung über die Spielerfigur ausschließlich in Du-Form. Keine neuen Behauptungen über ihr Inneres.',
    lvScopePrompt(story),story.ausgestaltung?lvStylePrompt(story).replace('Spielerhandlungen, Gefühle, Gedanken, Antworten und Entscheidungen kommen ausschließlich vom Spieler.','Spielerworte, Gefühle, Gedanken und Entscheidungen kommen ausschließlich vom Spieler. Zusätzliche körperliche Kampfhandlungen sind nur durch die einmalige Freigabe erlaubt.').replace('stoppe vor der nächsten Spielerreaktion.','stoppe vor der nächsten Spielerentscheidung.'):lvStylePrompt(story),
    'DIALOGREGIE: Wer spricht, soll durch passende Handlung oder Zuschreibung klar sein. Handlung und gesprochene Worte dürfen im selben Absatz stehen. Alle gesprochenen Sätze gehören in speech- oder whisper-Teile, nie als action tarnen. who enthält nur den tatsächlichen Sprechernamen. Die Rollen der Figuren nicht vertauschen. Charaktergerechte Wortwahl und gelegentlicher Humor statt austauschbarer Zustimmung. Keine zusätzlichen Figuren auftreten lassen, nur um den Text zu verlängern.',
    'KONTINUITÄT: Behauptungen, Vermutungen und bestätigte Ereignisse unterscheiden. Ein Termin ist noch kein Ergebnis. Gefühle haben Vorgeschichte und ändern sich nachvollziehbar. Keine künstlichen Eifersuchtswechsel oder plötzlichen Liebeserklärungen. Nebenfiguren verfolgen auch eigene Pflichten.',
    'KONSEQUENZEN: Verletzungen und Entscheidungen wirken nach. Keine automatische Unbesiegbarkeit oder Lösung zugunsten des Spielers. Die Welt darf scheitern, widersprechen und eigene Grenzen setzen. Ein Nein wird respektiert. Erwachsene Sprache und sinnliche Nähe passen zur jeweiligen Figur; keine pornografischen Details.',
    'Keine außerhalb der Szene liegende Vorgeschichte erfinden, um Importlücken zu schließen. Kein Wissen ohne eine Quelle, Beobachtung oder Mitteilung. Nicht jede Figur kennt die privaten Gespräche der anderen.',
    'FORMAT: Absätze mit verbundenen Handlungen und Dialogen. Gesprochene Worte fett, Flüstern kursiv. Keine Menüvorschläge, keine Erklärung und kein „Wenn du möchtest“. Datumszeilen setzt die App; keine zusätzlichen Kapitel- oder Ortsüberschriften.',
    story.ausgestaltung?'UMFANG: Etwa 250–450 Wörter für die freigegebene Kampfszene; Rhythmus, klare räumliche Abläufe und wenige aussagekräftige Reaktionen. Keine endlose Siegesparade.':'UMFANG: Meist 150–280 Wörter; größere Szenen mit mehreren Figuren etwa 250–350, wenn genug geschieht. Zwei Figuren und kurze Antworten kürzer. Niemals auffüllen. An der nächsten echten Spielerentscheidung stoppen.'];
  if(story.spielerAbwesend)lines.push('SPIELERFIGUR NOCH ABWESEND: niemand sieht oder trifft sie, sie tritt nicht automatisch auf.');
  if(typeof regelnPrompt==='function'){var options=regelnPrompt(story.regeln);if(options)lines.push(options);}
  if(story.regeln?.entscheidung===false)lines.push('Offene Entscheidungen nur im durch die Szene zwingend nötigen Umfang ergänzen.');
  if(story.corrections?.length)lines.push('DAUERHAFTE KORREKTUREN: '+story.corrections.join('; '));
  lines.push('FIGUREN IN DER SZENE – FESTE STECKBRIEFE:\n'+chars.filter(c=>c.isPlayer||present.has(c.name)).map(c=>lvCard(c,present.has(c.name))).join('\n'));
  var away=chars.filter(c=>!c.isPlayer&&!present.has(c.name));if(away.length)lines.push('NICHT IN DIESER SZENE: '+away.map(c=>c.name).join(', ')+'. Nicht ohne nachvollziehbaren Anlass neu auftreten lassen.');
  var wp=typeof weltPrompt==='function'?weltPrompt(story.welt):'';if(wp)lines.push(wp.slice(0,1600));
  if(story.intro)lines.push('INTRO / WELT: '+String(story.intro).slice(0,2400));
  if(story.questions?.length)lines.push('FESTGELEGTE ANTWORTEN: '+story.questions.map(q=>q.text+': '+q.answer).join('\n').slice(0,1600));
  if(story.memoryText)lines.push('GESPEICHERTE BEOBACHTUNGEN:\n'+String(story.memoryText).slice(0,2600));
  var continuation=lvContinuationPrompt(story.fortsetzung);if(continuation)lines.push(continuation);
  if(story.status?.place||story.status?.time)lines.push('AKTUELLE SZENE: '+[story.status.place,story.status.time].filter(Boolean).join(' · '));
  if(story.raumOutfitText)lines.push(story.raumOutfitText);
  if(story.attachmentsText)lines.push(story.attachmentsText);
  return lines.filter(Boolean).join('\n\n');
}
function lvNarrativeMessages(messages,story){
  var out=messages.map(m=>({...m}));
  // Keep recent original dialogue; avoid a context overflow that silently removes the beginning.
  var budget=32000,used=out.filter(m=>m.role!=='assistant').reduce((n,m)=>n+String(m.content||'').length,0);
  for(var i=out.length-1;i>=0;i--)if(out[i].role==='assistant'){
    if(used+out[i].content.length>budget){out[i].content='[Älterer Abschnitt gekürzt; maßgeblich sind Kanon und aktuelle Szene.] '+out[i].content.slice(-Math.max(200,Math.min(1800,budget-used)));}
    used+=out[i].content.length;
  }
  if(story.ausgestaltung){for(var m of out)if(m.role==='user'&&m.content.includes('Schreibe eine unmittelbare Fortsetzung'))m.content='Erzähle die freigegebene Kampfszene nach der einmaligen Freigabe im Systemprofil. Keine Wiederholung der bereits sichtbaren Eingabe. Keine neuen Spielerworte, Gefühle oder Entscheidungen. Beende die Szene vor der nächsten notwendigen Spielerentscheidung.';}
  return out;
}
function lvNarrativeCheck(text,story,ctx,base){
  var narration=typeof narrationOnly==='function'?narrationOnly(text):String(text).replace(/\*\*[\s\S]*?\*\*/g,'');
  var inspect=String(text).replace(/\*\*[^]*?\*\*/g,'').replace(/\*[^*\n]+\*/g,'');
  var cleaned=String(text).replace(/\*\*([^]*?)\*\*/g,(_m,s)=>'**'+s.replace(/[„“"]/g,'')+'**').replace(/\*([^*\n]+)\*/g,(_m,s)=>'*'+s.replace(/[„“"]/g,'')+'*');
  var scoped=story.ausgestaltung&&ctx.mode==='player';
  var result=base(cleaned,scoped?{...story,inputShown:false}:story,scoped?{...ctx,mode:'player',playerInput:''}:ctx);
  for(var player of (story.characters||[]).filter(c=>c.isPlayer)){
    var first=player.name.split(/\s+/)[0];if(!first)continue;
    var candidates=[player.name];if(!(story.characters||[]).some(c=>!c.isPlayer&&c.name.split(/\s+/)[0]===first))candidates.push(first);
    var named=new RegExp('\\b(?:'+[...new Set(candidates)].map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')s?\\b','i');
    if(named.test(narration))result.violations.push({code:'du-form',msg:'Die Spielerfigur in der Erzählung ausschließlich als du/dir/dein ansprechen. Ihren Namen nur in tatsächlich gesprochenem NPC-Dialog verwenden.'});
    var alias=new RegExp('\\b'+first.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s+(?:duckt|springt|geht|schaut|blickt|atmet|sagt|denkt|greift|nutzt|hält|setzt|zielt|fühlt|spürt|starrt|lächelt|grinst|lacht|schießt|führt|macht|zieht|lässt|weicht|rennt|dreht|kennt|rollt|versucht|antwortet)\\b','i');
    var relative=new RegExp('\\b'+first.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?:\\s+'+player.name.split(/\s+/).slice(1).join('\\s+')+')?(?:\\s+an)?,\\s*(?:der|die)\\b','i');
    if(alias.test(narration)||relative.test(narration))result.violations.push({code:'du-form',msg:'Auch die kurze Namensform der Spielerfigur darf nicht als Erzählerhandlung in dritter Person verwendet werden.'});
  }
  if(!scoped&&(story.inputShown||ctx.mode==='tick'||ctx.mode==='rewrite')&&/\bdu\b/i.test(narration)&&!result.violations.some(v=>v.code==='spieler-erfunden'))result.violations.push({code:'spieler-erfunden',msg:'Neue Du-Erzählung gehört außerhalb einer ausdrücklich freigegebenen Ausgestaltung nur dem Spieler.'});
  if(scoped){
    if(/^\s*(?:Er|Sein|Seine|Ihn|Ihm)\b/.test(narration))result.violations.push({code:'du-form',msg:'Die freigegebene Spielerhandlung nicht mit einem mehrdeutigen Er beginnen; ausdrücklich Du-Perspektive verwenden.'});
    var forbidden=/\bdu\s+(?:sagst|fragst|rufst|flüsterst|antwortest|erwiderst|denkst|fühlst|spürst|hoffst|glaubst|beschließt|entscheidest|verliebst|verzeihst|willst)\b|\b(?:sagst|fragst|denkst|fühlst|entscheidest)\s+du\b|\bdir\s+(?:wird|ist)\s+(?:klar|bewusst)\b|\bdu\s+(?:fährst|reist|fliegst)\b/i;
    if(forbidden.test(narration))result.violations.push({code:'spieler-erfunden',msg:'Die einmalige Kampffreigabe erlaubt keine neuen Spielerworte, Gefühle, Gedanken, Reisen oder Entscheidungen.'});
  }
  result.ok=result.violations.length===0;return result;
}
async function lvReviewNarrative(story,text,model){
 var players=(story.characters||[]).filter(c=>c.isPlayer).map(c=>c.name);
 var context={ausschliesslichVomSpielerGesteuert:players,npcDieFreiHandelnDuerfen:(story.characters||[]).filter(c=>!c.isPlayer).map(c=>c.name),figuren:(story.characters||[]).filter(c=>c.isPlayer||story.status?.present?.includes(c.name)).map(c=>lvCard(c,true)),fortsetzung:lvContinuation(story.fortsetzung),letzteSzene:(story.sections||[]).slice(-2).map(s=>s.text),freigabe:lvScopePrompt(story)};
 var schema={type:'object',properties:{fehler:{type:'array',maxItems:3,items:{type:'object',properties:{art:{type:'string',enum:['spieler','kanon','wissen','sprache']},zitat:{type:'string',maxLength:220},grund:{type:'string',maxLength:350}},required:['art','zitat','grund'],additionalProperties:false}}},required:['fehler'],additionalProperties:false};
 var response=await client.chat({model,stream:false,think:false,format:schema,options:{temperature:0.1,num_ctx:8192,num_predict:600},messages:[{role:'system',content:'Prüfe einen deutschen Rollenspielentwurf. Beanstande nur konkrete Verstöße: vertauschte Figur/Rolle/Beruf; unbestätigte Aussage als Tatsache; privates Wissen ohne Informationsquelle; erfundene Spielerworte/Gedanken oder nicht freigegebene Spielerhandlungen; offensichtlich unsinniges Deutsch. Neue passende NPC-Details sind erlaubt. Keine Stilvorlieben als Faktenfehler ausgeben. Für jeden Fehler ein exaktes wörtliches Zitat aus dem Entwurf und einen kurzen sachlichen Grund. Wenn nichts sicher falsch ist, fehler: []. Keine Neufassung.'},{role:'user',content:JSON.stringify({vorgaben:context,entwurf:text})}]});
 var result=JSON.parse(response.message?.content||'{}');if(!Array.isArray(result.fehler))throw Error('Die Qualitätsprüfung hat kein gültiges Ergebnis geliefert.');
 return result.fehler.filter(f=>f&&typeof f.zitat==='string'&&f.zitat.trim().length>=5&&text.toLowerCase().includes(f.zitat.toLowerCase())&&typeof f.grund==='string'&&(f.art!=='spieler'||/\bdu\b/i.test(f.zitat)||players.some(n=>f.zitat.includes(n)||f.zitat.includes(n.split(' ')[0])))).map(f=>({code:'qualitaet',msg:'Konkreter Widerspruch im Entwurf: '+f.zitat+' – '+f.grund}));
}
function lvAssertNarrativeSpeakers(raw,story){
  var data=JSON.parse(raw),players=(story.characters||[]).filter(c=>c.isPlayer).map(c=>c.name.toLowerCase());
  for(var block of data.blocks||[])for(var part of block.parts||[block]){
   if(/\b(?:who|parts|blocks)\s*[:=]/i.test(part.text||''))throw Error('Die KI hat technische Feldnamen in die Szene geschrieben.');
   if(['speech','thought','whisper'].includes(part.type)&&part.who&&(['du','spieler'].includes(part.who.toLowerCase())||players.some(n=>n===part.who.toLowerCase()||n.split(' ')[0]===part.who.toLowerCase())))throw Error('Die KI hat der Spielerfigur eigene Worte oder Gedanken zugewiesen.');
  }
}
function lvStoryDate(ctx){
  var names=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  function parse(value){var s=String(value||''),iso=s.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);if(iso)return iso[0];var m=s.match(/\b(\d{1,2})\.\s*(Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\s+(20\d{2})\b/i);return m?m[3]+'-'+String(names.findIndex(n=>n.toLowerCase()===m[2].toLowerCase())+1).padStart(2,'0')+'-'+m[1].padStart(2,'0'):'';}
  var direct=parse(ctx.eingabe),saved=ctx.speicher?.szene?.datum||'',last='';
  for(var b of ctx.verlauf||[]){var d=parse(b.text);if(d)last=d;}
  var value=direct||saved||last||parse(ctx.speicher?.fortsetzung?.datum)||parse(ctx.intro);
  if(!direct&&value&&/\b(?:am\s+)?nächsten\s+(?:morgen|tag)|ein(?:en)?\s+tag\s+später/i.test(lvSplitInput(ctx.eingabe||'').storyText)){var date=new Date(value+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+1);value=date.toISOString().slice(0,10);}
  if(!/^20\d{2}-\d{2}-\d{2}$/.test(value))return null;var date=new Date(value+'T12:00:00Z');if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==value)return null;
  return {iso:value,label:date.getUTCDate()+'. '+names[date.getUTCMonth()]+' '+date.getUTCFullYear(),alreadyShown:last===value};
}

function LVInitContinuation(host){
 var bar=document.getElementById('lvContinuityBar');if(!bar)return;
 var dialog=document.createElement('dialog');dialog.className='lv-continuation-dialog';
 dialog.innerHTML='<form method="dialog"><h2>Fortsetzungsstand</h2><p>Bewahre wichtige Zusammenhänge getrennt von Vermutungen. Spätere Ereignisse und deine aktuellen Angaben haben Vorrang.</p><div class="row"><label>Ausgangsdatum<input name="datum" type="date"></label><label>Ort<input name="ort" maxlength="180"></label></div><label>Stand der Handlung<textarea name="stand" rows="3" maxlength="1800"></textarea></label><label>Bestätigte Tatsachen · eine pro Zeile<textarea name="kanon" rows="5"></textarea></label><label>Aussagen und Vermutungen · Quelle | Aussage | Status<textarea name="behauptungen" rows="3"></textarea></label><label>Wissensgrenzen · Figur | weiß / weiß noch nicht<textarea name="wissen" rows="3"></textarea></label><label>Offene Fragen · eine pro Zeile<textarea name="offen" rows="3"></textarea></label><label>Termine · Wann | Was | Status<textarea name="termine" rows="3"></textarea></label><label>Noch fehlende Importabschnitte<textarea name="luecken" rows="2"></textarea></label><p class="hint">Keine automatischen Testergebnisse oder erfundenen Rückblenden. Ergänze fehlende Ereignisse erst, wenn du weißt, was passiert ist.</p><div class="form-actions"><button class="btn primary" type="submit" value="save">Stand speichern</button><button class="btn ghost" type="submit" value="cancel">Abbrechen</button></div></form>';
 document.body.append(dialog);var form=dialog.querySelector('form');
 function refresh(){var c=lvContinuation(host.get());bar.querySelector('[data-continuation-status]').textContent=c.luecken.length?'Import mit dokumentierten Lücken':c.stand?'Fortsetzungsstand gespeichert':'Ziele, offene Fragen und Wissen getrennt behalten';}
 function open(){var c=lvContinuation(host.get());for(var k of ['datum','ort','stand'])form.elements[k].value=c[k]||'';for(var k of ['kanon','offen','luecken'])form.elements[k].value=c[k].join('\n');form.elements.behauptungen.value=c.behauptungen.map(x=>[x.quelle,x.text,x.status].join(' | ')).join('\n');form.elements.wissen.value=c.wissen.map(x=>[x.wer,x.was].join(' | ')).join('\n');form.elements.termine.value=c.termine.map(x=>[x.wann,x.was,x.status].join(' | ')).join('\n');dialog.showModal();}
 bar.querySelector('button').addEventListener('click',open);
 form.addEventListener('submit',function(e){if(e.submitter?.value!=='save')return;var c={};for(var k of ['datum','ort','stand'])c[k]=form.elements[k].value;for(var k of ['kanon','offen','luecken'])c[k]=form.elements[k].value.split('\n');function rows(k,keys){return form.elements[k].value.split('\n').filter(x=>x.trim()).map(line=>{var p=line.split('|').map(x=>x.trim());return Object.fromEntries(keys.map((key,i)=>[key,p[i]||'']));});}c.behauptungen=rows('behauptungen',['quelle','text','status']);c.wissen=rows('wissen',['wer','was']);c.termine=rows('termine',['wann','was','status']);host.set(lvContinuation(c));refresh();});
 new MutationObserver(refresh).observe(document.getElementById('schreiben'),{attributes:true,attributeFilter:['class']});refresh();return {refresh};
}

// src/shared/figur-ki.js
var BEZUG_ARTEN = [
	"Vater",
	"Mutter",
	"Sohn",
	"Tochter",
	"Bruder",
	"Schwester",
	"Halbbruder",
	"Halbschwester",
	"Zwillingsbruder",
	"Zwillingsschwester",
	"Opa",
	"Oma",
	"Enkel",
	"Enkelin",
	"Onkel",
	"Tante",
	"Neffe",
	"Nichte",
	"Cousin",
	"Cousine",
	"Ehemann",
	"Ehefrau",
	"Stiefvater",
	"Stiefmutter",
	"Stiefsohn",
	"Stieftochter",
	"Stiefbruder",
	"Stiefschwester",
	"Schwiegervater",
	"Schwiegermutter",
	"Schwager",
	"Schwägerin"
];
/** Arten aus 0.4.9, die keine Familie sind (Freund, Chef, Rivale …) – wandern ins Feld „Freunde & Bekannte“. */
BEZUG_ARTEN = BEZUG_ARTEN.concat(LV_RELATION_ROLES);
var istFamilienBezug = (art) => BEZUG_ARTEN.some((a) => a.toLowerCase() === String(art || "").trim().toLowerCase());
var t = (v, max = 80) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
/** Bezug säubern: Art aus der Liste (oder eigene, kurz), Ziel = id + Name einer anderen Figur. */
function normBezuege(list) {
	const out = [];
	for (const b of Array.isArray(list) ? list : []) {
		if (!b || typeof b !== "object") continue;
		const art = BEZUG_ARTEN.find((a) => a.toLowerCase() === t(b.art).toLowerCase()) || t(b.art, 40);
		const zielName = t(b.zielName, 80);
		const zielId = /^fig_[a-z0-9_-]{1,40}$/i.test(b.zielId || "") ? String(b.zielId) : "";
		if (!art) continue;
		if (!zielName && !zielId && !BEZUG_ARTEN.includes(art)) continue;
		if ((zielName || zielId) && out.some((x) => x.art === art && (zielId ? x.zielId === zielId : x.zielName === zielName))) continue;
		out.push(zielId ? {
			art,
			zielId,
			zielName
		} : zielName ? {
			art,
			zielName
		} : {
			art,
			zielName: ""
		});
		if (out.length >= 12) break;
	}
	return out;
}
var bezugText = (b) => {
	const z = b.zielName || "… (Name entscheidet die KI)";
	return /\b(in|von|mit)$/.test(b.art) ? `${b.art} ${z}` : `${b.art} von ${z}`;
};
/** Namen der Ziele aus der aktuellen Besetzung nachziehen (Umbenennen); Ziele, die es nicht mehr gibt, bleiben mit altem Namen. */
function bezuegeAktualisieren(bezuege, figuren) {
	const nachId = new Map((figuren || []).filter((f) => f && f.id).map((f) => [f.id, f.name]));
	return normBezuege((bezuege || []).map((b) => b.zielId && nachId.get(b.zielId) ? {
		...b,
		zielName: nachId.get(b.zielId)
	} : b));
}
/** Gegenrichtung für die Anzeige beim Ziel: wer hat einen Bezug auf diese Figur? → ['Raven: Vater von Mika'] */
function bezuegeAuf(figuren, figur) { return lvIncoming(figuren, figur).map(function(b) { return bezugText(b); }); }
/**
* Alte Nicht-Familien-Bezüge (0.4.9: Freundin, Chef, Rivale …) verlustfrei ins Freitext-Feld verschieben.
* → {figur, verschoben:['Freundin von Mika']} – figur unverändert, wenn nichts zu tun ist.
*/
function bezuegeTrennen(figur) {
	const alle = Array.isArray(figur?.bezuege) ? figur.bezuege : [];
	const weg = alle.filter((b) => b && !istFamilienBezug(b.art));
	if (!weg.length) return {
		figur,
		verschoben: []
	};
	const zeilen = weg.map(bezugText);
	const alt = String(figur.beziehungen || "").trim();
	const neu = zeilen.filter((z) => !alt.toLowerCase().includes(z.toLowerCase()));
	const f = {
		...figur,
		bezuege: alle.filter((b) => b && istFamilienBezug(b.art))
	};
	if (!f.bezuege.length) delete f.bezuege;
	if (neu.length) f.beziehungen = (alt ? alt + "\n" : "") + neu.join("\n");
	if (Array.isArray(f.kiFelder) && f.kiFelder.includes("bezuege") && !f.bezuege) f.kiFelder = f.kiFelder.filter((k) => k !== "bezuege");
	return {
		figur: f,
		verschoben: zeilen
	};
}
/** Felder, die man ausdrücklich der KI überlassen kann (Lorevia-Schlüssel → Anzeige). */
var KI_FELDER = [
	["alter", "Alter"],
	["groesse", "Größe"],
	["stimme", "Stimme"],
	["beruf", "Beruf"],
	["wohnsituation", "Wohnsituation"],
	["eltern", "Eltern/Familie"],
	["bezuege", "Familie in dieser Geschichte"],
	["beziehungen", "Freunde & Bekannte"],
	["erinnerungen", "Frühere Erinnerungen"],
	["aussehen", "Aussehen"],
	["persoenlichkeit", "Persönlichkeit"],
	["hobbys", "Hobbys"],
	["zuege", "Charakterzüge"],
	["kurzBio", "Kurz-Bio"]
];
var KI_KEYS = KI_FELDER.map((x) => x[0]);
var kiLabel = (k) => (KI_FELDER.find((x) => x[0] === k) || [k, k])[1];
function normKiFelder(list) {
	return KI_KEYS.filter((k) => Array.isArray(list) && list.includes(k));
}
/** Feld an/aus in der Liste „entscheidet die KI“. */
function kiUmschalten(list, k) {
	const l = normKiFelder(list);
	return KI_KEYS.includes(k) ? l.includes(k) ? l.filter((x) => x !== k) : normKiFelder([...l, k]) : l;
}
/** Ergebnis in die Figur übernehmen: gefüllte Felder gelten ab jetzt fest (aus „entscheidet die KI“ raus). */
function fuellUebernehmen(figur, ergebnis) {
	const f = {
		...figur,
		...ergebnis.werte
	};
	f.kiFelder = normKiFelder(figur.kiFelder).filter((k) => !ergebnis.gefuellt.includes(k));
	return f;
}
// src/shared/bogen.js
var HOBBYS = [
	"Lesen",
	"Schreiben",
	"Gaming",
	"Sport",
	"Kochen",
	"Backen",
	"Musik hören",
	"Instrument",
	"Zeichnen",
	"Fotografie",
	"Wandern",
	"Reisen",
	"Filme/Serien",
	"Theater",
	"Garten",
	"Basteln",
	"Tanzen",
	"Fahrrad",
	"Tiere",
	"Sammeln"
];
var ZUEGE = [
	"ordentlich",
	"chaotisch",
	"stur",
	"geduldig",
	"impulsiv",
	"ruhig",
	"frech",
	"schüchtern",
	"mutig",
	"ängstlich",
	"loyal",
	"misstrauisch",
	"humorvoll",
	"ernst",
	"neugierig",
	"nachdenklich",
	"direkt",
	"diplomatisch",
	"ehrgeizig",
	"gelassen"
];
/** Textfelder in Anzeige-Reihenfolge (key → Label) */
var BOGEN_TEXTFELDER = [
	["alter", "Alter"],
	["groesse", "Größe"],
	["stimme", "Stimme"],
	["beruf", "Beruf"],
	["wohnsituation", "Wohnsituation"],
	["eltern", "Eltern/Familie"],
	["beziehungen", "Beziehungen"],
	["erinnerungen", "Frühere Erinnerungen"],
	["aussehen", "Aussehen"],
	["persoenlichkeit", "Persönlichkeit"]
];
var MAX_BEZ_ERIN = 3e3;
var mehrzeilig = (v, max) => String(v ?? "").replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, max);
var SEX_STUFEN = [
	["dezent", "dezent"],
	["normal", "normal"],
	["freizuegig", "freizügig"],
	["explizit", "explizit"],
	["pervers", "pervers"]
];
var BETT_STILE = [
	["dominant", "dominant"],
	["stoehnend-laut", "stöhnend-laut"],
	["spielerisch-neckend", "spielerisch-neckend"],
	["zurueckhaltend", "zurückhaltend"],
	["schuechtern", "schüchtern"]
];
var SEX_STANDARD = "dezent";
var BETT_STANDARD = "zurueckhaltend";
var schluessel = (v) => String(v ?? "").toLowerCase().trim().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[\s_–—]+/g, "-").replace(/-+/g, "-");
var findeWert = (liste, v) => {
	const k = schluessel(v);
	const p = liste.find((x) => x[0] === k);
	return p ? p[0] : "";
};
/** Erlaubter sexualityLevel-Schlüssel oder '' (unbekannt). Nimmt Schlüssel und Anzeige (freizügig/freizuegig). */
var sexStufeOder = (v) => findeWert(SEX_STUFEN, v);
var bettStilOder = (v) => findeWert(BETT_STILE, v);
/** Allowlist mit Standard: unbekannt/fehlt → dezent bzw. zurueckhaltend */
var sexStufe = (v) => sexStufeOder(v) || "dezent";
var bettStil = (v) => bettStilOder(v) || "zurueckhaltend";
var sexLabel = (v) => SEX_STUFEN.find((p) => p[0] === sexStufe(v))[1];
var bettLabel = (v) => BETT_STILE.find((p) => p[0] === bettStil(v))[1];
/**
* Steckbrief-/Charakterbrief-Text nach Sexualität + Stil im Bett durchsuchen.
* Erkennt z. B. „Sexualität: explizit“, „sexualityLevel = freizuegig“, „Im Bett: schüchtern“, „Stil im Bett – stöhnend-laut“, „bedroomStyle: dominant“.
* → { sexualityLevel?, bedroomStyle? } – nur Werte, die wirklich im Text stehen.
*/
function sexAusBrief(text) {
	const t = String(text ?? "");
	const out = {};
	if (!t.trim()) return out;
	const zeile = (re, finde) => {
		for (const m of t.matchAll(re)) {
			const w = finde(m[1]) || finde(m[1].split(/[,;/(|]/)[0]) || finde(m[1].split(/\s+/)[0]);
			if (w) return w;
		}
		return "";
	};
	const sx = zeile(/(?:sexualit(?:ä|ae|a)t(?:s-?(?:stufe|level|intensit(?:ä|ae)t))?|sexuality-?level|sex-?stufe|intensit(?:ä|ae)t)\s*[:=–—-]\s*([^\n\r.]{2,40})/gi, sexStufeOder);
	if (sx) out.sexualityLevel = sx;
	const be = zeile(/(?:(?:stil\s+)?im\s+bett|bett-?stil|bedroom-?style)\s*[:=–—-]\s*([^\n\r.]{2,40})/gi, bettStilOder);
	if (be) out.bedroomStyle = be;
	return out;
}
var MAX_LANG = 1500;
var txt$1 = (v, max = 400) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
/** Auswahl begrenzen: nur bekannte Werte, keine Doppelten, höchstens max. */
function limitAuswahl(list, erlaubt, max) {
	const set = new Map(erlaubt.map((x) => [x.toLowerCase(), x]));
	const out = [];
	for (const v of Array.isArray(list) ? list : []) {
		const k = set.get(String(v || "").toLowerCase().trim());
		if (k && !out.includes(k)) out.push(k);
		if (out.length >= max) break;
	}
	return out;
}
/** Knopf an/aus. Gibt {liste, voll} zurück – voll = Limit erreicht, Wert wurde nicht hinzugefügt. */
function toggleAuswahl(list, wert, max) {
	const l = Array.isArray(list) ? [...list] : [];
	const i = l.indexOf(wert);
	if (i >= 0) {
		l.splice(i, 1);
		return {
			liste: l,
			voll: false
		};
	}
	if (l.length >= max) return {
		liste: l,
		voll: true
	};
	l.push(wert);
	return {
		liste: l,
		voll: false
	};
}
/** Figur aus UI/State → saubere Form. Alte Figuren ({name, rolle, notizen, mein}) bleiben gültig. */
function normalizeFigur(f = {}) {
	f = vonLira(f || {});
	const out = {
		name: txt$1(f.name, 80),
		rolle: txt$1(f.rolle, 80),
		notizen: String(f.notizen ?? "").trim().slice(0, 4e3),
		mein: !!f.mein,
		alter: txt$1(f.alter, 40),
		groesse: txt$1(f.groesse, 30),
		stimme: txt$1(f.stimme, 300),
		beruf: f.keinBeruf ? "keiner" : txt$1(f.beruf, 80),
		keinBeruf: !!f.keinBeruf || /^(keiner|kein beruf|keinen)$/i.test(txt$1(f.beruf)),
		wohnsituation: txt$1(f.wohnsituation, 120),
		eltern: txt$1(f.eltern, 600),
		aussehen: txt$1(f.aussehen, MAX_LANG),
		persoenlichkeit: txt$1(f.persoenlichkeit, MAX_LANG),
		beziehungen: mehrzeilig(f.beziehungen, MAX_BEZ_ERIN),
		erinnerungen: mehrzeilig(f.erinnerungen, MAX_BEZ_ERIN),
		hobbys: limitAuswahl(f.hobbys, HOBBYS, 4),
		zuege: limitAuswahl(f.zuege, ZUEGE, 5),
		kurzBio: f.mein ? String(f.kurzBio ?? "").trim().slice(0, 1200) : ""
	};
	if (out.keinBeruf) out.beruf = "keiner";
	const photo = datei(f.photo || f.foto, "image");
	if (photo) out.photo = photo;
	const brief = datei(f.brief, "document");
	if (brief) out.brief = brief;
	if (f.quelle) out.quelle = txt$1(f.quelle, 400);
	if (/^#[0-9a-f]{6}$/i.test(f.color || "")) out.color = String(f.color).toLowerCase();
	if (/^fig_[a-z0-9_-]{1,40}$/i.test(f.id || "")) out.id = String(f.id);
	if (typeof f.voiceId === "string" && /^[a-z0-9_.-]{1,80}$/i.test(f.voiceId)) {
		out.voiceId = f.voiceId;
		if (f.voiceName) out.voiceName = txt$1(f.voiceName, 80);
	}
	const ausBrief = (!sexStufeOder(f.sexualityLevel) || !bettStilOder(f.bedroomStyle)) && out.brief?.text ? sexAusBrief(out.brief.text) : {};
	out.sexualityLevel = sexStufeOder(f.sexualityLevel) || ausBrief.sexualityLevel || "dezent";
	out.bedroomStyle = bettStilOder(f.bedroomStyle) || ausBrief.bedroomStyle || "zurueckhaltend";
	const haare = txt$1(f.haare, 120);
	if (haare) out.haare = haare;
	const augen = txt$1(f.augen, 120);
	if (augen) out.augen = augen;
	const outfit = txt$1(f.outfit, 600);
	if (outfit) out.outfit = outfit;
	const outfitPhoto = datei(f.outfitPhoto, "image");
	if (outfitPhoto) out.outfitPhoto = outfitPhoto;
	if (f.briefBogen) out.briefBogen = true;
	const bz = normBezuege(f.bezuege);
	if (bz.length) out.bezuege = bz;
	const ki = normKiFelder(f.kiFelder);
	if (ki.length) out.kiFelder = ki;
	const bo = Array.isArray(f.bildOptikFelder) ? [...new Set(f.bildOptikFelder.filter((k) => [
		"aussehen",
		"haare",
		"augen",
		"outfit"
	].includes(k)))] : [];
	if (bo.length) out.bildOptikFelder = bo;
	out.akte=lpNormalize(f.akte);
	return out;
}
/** 0.4.4: Felder, die beim Bearbeiten im Figur-Formular erhalten bleiben (kommen aus dem Outfit-Dialog). */
var OPTIK_FELDER = [
	"haare",
	"augen",
	"outfit",
	"outfitPhoto",
	"bildOptikFelder"
];
var MAX_BRIEF_CHARS = 6e3;
/** Datei-Verweis säubern: {id, name, mime, path, kind, text? (Brief), beschreibung? (Bild)} */
function datei(d, kind) {
	if (!d || typeof d !== "object" || !d.path) return null;
	const o = {
		id: txt$1(d.id, 60),
		name: txt$1(d.name, 120) || "Datei",
		mime: txt$1(d.mime, 120),
		path: String(d.path).slice(0, 1e3),
		kind
	};
	if (kind === "document" && d.text) o.text = String(d.text).replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, MAX_BRIEF_CHARS);
	if (kind === "image" && d.beschreibung) o.beschreibung = txt$1(d.beschreibung, 800);
	return o;
}
/** Liras UI-Form (englische Schlüssel, siehe lira/lorevia/ui/LIESMICH.md) → Lorevia-Form. Deutsche Schlüssel gewinnen. */
var LIRA_KEYS = {
	role: "rolle",
	notes: "notizen",
	age: "alter",
	height: "groesse",
	voiceDesc: "stimme",
	housing: "wohnsituation",
	family: "eltern",
	appearance: "aussehen",
	personality: "persoenlichkeit",
	hobbies: "hobbys",
	traits: "zuege",
	bio: "kurzBio",
	hair: "haare",
	eyes: "augen",
	outfitText: "outfit",
	outfitImage: "outfitPhoto",
	relationships: "beziehungen",
	memories: "erinnerungen"
};
function vonLira(f) {
	const o = { ...f };
	for (const [en, de] of Object.entries(LIRA_KEYS)) if (o[de] === void 0 && o[en] !== void 0) o[de] = o[en];
	if (o.mein === void 0 && o.isPlayer !== void 0) o.mein = !!o.isPlayer;
	if (o.beruf === void 0 && "job" in o) {
		if (o.job === null) o.keinBeruf = true;
		else o.beruf = o.job;
	}
	return o;
}
var istHaupt = (f) => !!(f && (f.mein || f.isPlayer || /^haupt/i.test(String(f.rolle ?? f.role ?? ""))));
function zaehleFiguren(figuren = []) {
	const l = (figuren || []).filter((f) => f && f.name);
	const haupt = l.filter(istHaupt).length;
	return {
		haupt,
		neben: l.length - haupt,
		mein: l.filter((f) => f.mein || f.isPlayer).length
	};
}
/** Darf fig (neu oder an Stelle index) so gespeichert werden? → {ok, grund} */
function figurErlaubt(figuren = [], fig, index = -1) {
	const z = zaehleFiguren((figuren || []).filter((x, i) => i !== index && x && x.name));
	if (istHaupt(fig) && z.haupt >= 4) return {
		ok: false,
		grund: `Höchstens 4 Hauptfiguren (dein Char zählt mit). Mach eine andere zur Nebenfigur oder entferne sie.`
	};
	if (!istHaupt(fig) && z.neben >= 8) return {
		ok: false,
		grund: `Höchstens 8 Nebenfiguren. Entferne eine, bevor du eine neue hinzufügst.`
	};
	return { ok: true };
}
/** 0.4.7 (Christian): Anzeige-Reihenfolge – dein Char zuerst, dann Hauptfiguren, dann Nebenfiguren.
*  Stabil: innerhalb einer Gruppe bleibt die Reihenfolge. Gibt ein neues Array zurück (gleiche Objekte). */
function figurenSortieren(figuren = []) {
	const rang = (f) => f && (f.mein || f.isPlayer) ? 0 : istHaupt(f) ? 1 : 2;
	return (figuren || []).map((f, i) => ({
		f,
		i,
		r: rang(f)
	})).sort((a, b) => a.r - b.r || a.i - b.i).map((x) => x.f);
}
/** 0.3.5: leere Steckbrief-Punkte (Beschriftungen). Ist „Das entscheidest du“ an, darf die KI sie festlegen. */
function offeneFelder(f) {
	const n = normalizeFigur(f);
	const out = [];
	for (const [k, label] of BOGEN_TEXTFELDER) {
		if (k === "beruf" && n.keinBeruf) continue;
		if (!String(n[k] || "").trim() || (n.kiFelder || []).includes(k)) out.push(label);
	}
	const ki = n.kiFelder || [];
	if (!n.hobbys.length || ki.includes("hobbys")) out.push("Hobbys");
	if (!n.zuege.length || ki.includes("zuege")) out.push("Charakterzüge");
	if (ki.includes("bezuege")) out.push("Bezüge zu anderen Figuren");
	if (n.mein && (!String(n.kurzBio || "").trim() || ki.includes("kurzBio"))) out.push("Kurz-Bio");
	return out;
}
var norm = (s) => String(s ?? "").toLowerCase().normalize("NFC").replace(/\([^)]*\)/g, " ").replace(/^[\s\d.)•◦▪*·\-–—]+/, "").replace(/[:：]\s*$/, "").replace(/\s+/g, " ").trim();
var BRIEF_KOPF = [
	["name", /^(name|vollständiger name|vor- und nachname)$/],
	["alter", /^alter$/],
	["groesse", /^(größe|groesse|körpergröße)$/],
	["stimme", /^(stimme|stimmlage|sprechweise)$/],
	["beruf", /^(beruf|job|arbeit|tätigkeit|beschäftigung)$/],
	["wohnsituation", /^(wohnsituation|wohnen|wohnort|wohnung|zuhause|lebt)$/],
	["eltern", /^(eltern|familie|eltern ?\/ ?familie|eltern (?:&|und) familie|verwandtschaft|herkunftsfamilie|geschwister)$/],
	["beziehungen", /^(beziehungen|beziehungsstatus|bezugspersonen|freunde|freundschaften|soziales umfeld|sozialverhalten.*|verhalten gegenüber anderen)$/],
	["erinnerungen", /^(frühere erinnerungen|erinnerungen|vorgeschichte|vergangenheit|hintergrund|hintergrundgeschichte|geschichte|backstory|lebenslauf|kindheit)$/],
	["aussehen", /^(aussehen|erscheinung.*|äußeres|äusseres|optik|körperbau|statur)$/],
	["persoenlichkeit", /^(persönlichkeit|charakter|charakterbeschreibung|charaktereigenschaften|wesen|eigenschaften)$/],
	["zuege", /^(charakterzüge|züge)$/],
	["hobbys", /^(hobbys|hobbies|hobby|freizeit|interessen)$/],
	["haare", /^(haare|haarfarbe|frisur)$/],
	["augen", /^(augen|augenfarbe)$/],
	["outfit", /^(kleidung|outfit|kleidungsstil)$/],
	["kurzBio", /^(kurz-?bio|kurzbiografie|kurzbiographie|bio|kurzbeschreibung)$/],
	["sex", /^(sexualität|sexualitaet|sexualitätsstufe|sexualität ?\/ ?intensität|sexuality-?level|sex-?stufe|intensität)$/],
	["bett", /^(im bett|stil im bett|wie (?:sie|er|es) im bett (?:ist|sind)|im bett ist (?:sie|er)|bettverhalten|im schlafzimmer|bett-?stil|bedroom-?style)$/],
	["intim", /(intimität|sexualität|liebe|partnerwahl|verliebt|beziehungswunsch|mehr von einer beziehung|verspielte seite|romantik|leidenschaft)/],
	["extra", /^(rasse|spezies|art|volk|geschlecht|status|gewicht|nation|herkunft|sozialstruktur|stärken|schwächen|fähigkeit(?:en)?|trigger.*|macken|lebensmotto|motto|vorlieben|abneigungen|ziele|kampf.*|besonderheit.*|magie.*|animalisches verhalten|formen.*|grunddaten|tiergestalt|sonstiges|notizen?)$/]
];
var kopfArt = (zeile) => {
	const n = norm(zeile);
	if (!n || n.length > 60 || /[.!?,;…]$|\.\s/.test(n)) return "";
	const k = BRIEF_KOPF.find(([, re]) => re.test(n));
	return k ? k[0] : "";
};
var FELD_NAME = {
	alter: "Alter",
	groesse: "Größe",
	stimme: "Stimme",
	beruf: "Beruf",
	wohnsituation: "Wohnsituation",
	eltern: "Eltern/Familie",
	beziehungen: "Beziehungen",
	erinnerungen: "Frühere Erinnerungen",
	aussehen: "Aussehen",
	persoenlichkeit: "Persönlichkeit",
	hobbys: "Hobbys",
	zuege: "Charakterzüge",
	haare: "Haare",
	augen: "Augen",
	outfit: "Outfit",
	kurzBio: "Kurz-Bio",
	notizen: "Notizen",
	sexualityLevel: "Sexualität",
	bedroomStyle: "Im Bett"
};
/** Brief-Text → Abschnitte [{art, titel, zeilen[]}] (art '' = Text vor dem ersten bekannten Abschnitt). */
function briefAbschnitte(text) {
	const out = [];
	let akt = {
		art: "",
		titel: "",
		zeilen: []
	};
	out.push(akt);
	for (const roh of String(text ?? "").replace(/\r/g, "").split("\n")) {
		const z = roh.replace(/\t+/g, " ").trim();
		if (!z) continue;
		const bullet = /^[•◦▪*·\-–]\s/.test(z) || /^[•◦▪]/.test(z);
		if (bullet) {
			const m = z.replace(/^[•◦▪*·\-–]\s*/, "").match(/^([^:：]{1,30})[:：]\s*(.+)$/), k = m ? kopfArt(m[1]) : "";
			if (k && ![
				"extra",
				"intim",
				"name"
			].includes(k)) {
				out.push({
					art: k,
					titel: m[1].trim(),
					zeilen: [m[2].trim()],
					inline: true
				});
				continue;
			}
		}
		if (!bullet) {
			const m = z.match(/^([^:：]{1,45})[:：]\s*(.*)$/);
			const kInline = m ? kopfArt(m[1]) : "";
			if (kInline && m[2].trim()) {
				out.push({
					art: kInline,
					titel: m[1].trim(),
					zeilen: [m[2].trim()],
					inline: true
				});
				akt = {
					art: akt.art,
					titel: akt.titel,
					zeilen: [],
					fortsetzung: true
				};
				out.push(akt);
				continue;
			}
			const k = kopfArt(z);
			if (k) {
				akt = {
					art: k,
					titel: z.replace(/[:：]\s*$/, "").trim(),
					zeilen: []
				};
				out.push(akt);
				continue;
			}
		}
		akt.zeilen.push(z);
	}
	return out.filter((a) => a.zeilen.length);
}
var HOBBY_WORTE = [
	["Lesen", /\b(lesen|liest|bücher|buch|romane)\b/],
	["Schreiben", /\b(schreiben|schreibt|tagebuch|gedichte)\b/],
	["Gaming", /\b(gaming|zocken|videospiel\w*|games|konsole)\b/],
	["Sport", /\b(sport\w*|training|trainier\w*|kampfkunst|kampfsport|fitness|laufen|läuft|joggen|nachtläufe|klettern|schwimmen|boxen)\b/],
	["Kochen", /\b(kochen|kocht)\b/],
	["Backen", /\b(backen|backt)\b/],
	["Musik hören", /\bmusik hören\b|\bmusik\b(?!instrument)/],
	["Instrument", /\b(instrument|gitarre|klavier|geige|flöte|schlagzeug|singen|gesang)\b/],
	["Zeichnen", /\b(zeichnen|zeichnet|malen|malt|skizz\w*)\b/],
	["Fotografie", /\b(fotograf\w*|fotos)\b/],
	["Wandern", /\b(wandern|wandert|natur|wald)\b/],
	["Reisen", /\b(reisen|reist)\b/],
	["Filme/Serien", /\b(filme?|serien?|kino)\b/],
	["Theater", /\btheater\b/],
	["Garten", /\b(garten|pflanzen)\b/],
	["Basteln", /\b(basteln|bastelt|zerlegen|schrauben|handwerk\w*|nähen)\b/],
	["Tanzen", /\b(tanzen|tanzt)\b/],
	["Fahrrad", /\b(fahrrad|radfahren|bike)\b/],
	["Tiere", /\b(tiere|tieren|hund|katze|pferde?|reiten)\b/],
	["Sammeln", /\b(sammeln|sammelt)\b/]
];
var ZUG_WORTE = {
	ordentlich: /\bordentlich\b/,
	chaotisch: /\bchaotisch\b/,
	stur: /\bstur\b/,
	geduldig: /\bgeduldig\b/,
	impulsiv: /\bimpulsiv\b|\bkurze zündschnur\b|\btemperamentvoll\b/,
	ruhig: /\bruhig\b/,
	frech: /\bfrech\b/,
	"schüchtern": /\bschüchtern\b/,
	mutig: /\bmutig\b/,
	"ängstlich": /\bängstlich\b/,
	loyal: /\bloyal\b|\bloyalität\b/,
	misstrauisch: /\bmisstrau\w*\b/,
	humorvoll: /\bhumorvoll\b|\bwitzig\b/,
	ernst: /\bernst\b/,
	neugierig: /\bneugierig\b/,
	nachdenklich: /\bnachdenklich\b/,
	direkt: /\b(?:ist|sehr|eher|ziemlich|offen und) direkt\b|\bdirekte art\b/,
	diplomatisch: /\bdiplomatisch\b/,
	ehrgeizig: /\behrgeizig\b/,
	gelassen: /\bgelassen\b/
};
var negiert = (t, idx) => /\b(nicht|kein\w*|nie|niemals|ohne)\s+(?:\S+\s+)?$/.test(t.slice(Math.max(0, idx - 22), idx));
var findeOhneNein = (t, re) => {
	const g = new RegExp(re.source, "g");
	let m;
	while (m = g.exec(t)) {
		if (!negiert(t, m.index)) return m.index;
		if (!m[0].length) g.lastIndex++;
	}
	return -1;
};
var BETT_WORTE = [
	["dominant", /\bdominan\w*|\bdominier\w*/],
	["schuechtern", /\bschüchtern\w*|\bjungfrau\b|\bunerfahren\b/],
	["stoehnend-laut", /\bstöhn\w*|\blaut im bett\b/],
	["spielerisch-neckend", /\bneck\w*|\bspielerisch\w*|\bverspielt\w*/],
	["zurueckhaltend", /\bzurückhaltend\b|\bdistanziert\b|\bhält abstand\b/]
];
/** Stil im Bett aus Brief-Text erkennen (nur Wörter, die dastehen; Verneinungen zählen nicht). → Schlüssel oder '' */
function bettAusText(text) {
	const t = String(text ?? "").toLowerCase();
	let best = "", n = 0;
	for (const [k, re] of BETT_WORTE) {
		const g = new RegExp(re.source, "g");
		let m, c = 0;
		while (m = g.exec(t)) if (!negiert(t, m.index)) c++;
		if (c > n) {
			n = c;
			best = k;
		}
	}
	return best;
}
/**
* 0.4.8: Charakterbrief-Text → Steckbrief-Felder (Lorevia-Form). Nur, was im Brief steht.
* → { alter?, groesse?, …, hobbys?:[], zuege?:[], sexualityLevel?, bedroomStyle?, bettErkannt?:true, notizen? }
*/
function steckbriefAusBrief(text, { mein = false } = {}) {
	const t = String(text ?? "");
	const out = {};
	if (!t.trim()) return out;
	const ab = briefAbschnitte(t);
	const zeilen = (a) => a.zeilen.map((z) => z.replace(/^[•◦▪*·\-–]\s*/, "").trim()).filter(Boolean);
	const einzeilig = (a) => a.zeilen.map((z, i) => {
		const b = /^[•◦▪*·\-–]/.test(z), x = z.replace(/^[•◦▪*·\-–]\s*/, "").trim();
		return i === 0 ? x : (b || /^[•◦▪*·\-–]/.test(a.zeilen[i - 1]) ? "; " : " ") + x;
	}).join("");
	const mehr = (a) => a.zeilen.map((z) => z.replace(/^[◦▪*·]\s*/, "• ")).join("\n");
	const dazu = (k, v, sep = " ") => {
		v = String(v || "").trim();
		if (!v) return;
		out[k] = out[k] ? out[k] + sep + v : v;
	};
	const notiz = [], intimText = [], wesenText = [], hobbyText = [];
	for (const a of ab) switch (a.art) {
		case "alter":
		case "groesse":
		case "stimme":
		case "beruf":
		case "wohnsituation":
		case "haare":
		case "augen":
			if (!out[a.art]) out[a.art] = einzeilig(a);
			break;
		case "eltern":
		case "aussehen":
		case "outfit":
			dazu(a.art, einzeilig(a));
			break;
		case "persoenlichkeit":
			dazu("persoenlichkeit", einzeilig(a));
			wesenText.push(zeilen(a).join(" "));
			break;
		case "beziehungen":
		case "erinnerungen":
			dazu(a.art, mehr(a), "\n\n");
			break;
		case "kurzBio":
			if (mein) dazu("kurzBio", zeilen(a).join(" "));
			else notiz.push(a.titel + ": " + einzeilig(a));
			break;
		case "hobbys":
			hobbyText.push(...zeilen(a));
			break;
		case "zuege":
			wesenText.push(zeilen(a).join(" "));
			out._zuegeExplizit = (out._zuegeExplizit || []).concat(zeilen(a));
			break;
		case "sex": {
			const w = sexStufeOder(einzeilig(a)) || sexAusBrief("Sexualität: " + einzeilig(a)).sexualityLevel || SEX_STUFEN.map((p) => p[0]).find((k) => findeOhneNein(schluessel(einzeilig(a)), new RegExp("\\b" + k + "\\b")) >= 0);
			if (w) out.sexualityLevel = w;
			else notiz.push(a.titel + ": " + einzeilig(a));
			break;
		}
		case "bett": {
			const v = einzeilig(a);
			const w = bettStilOder(v) || sexAusBrief("Im Bett: " + v).bedroomStyle || bettAusText(v);
			if (w) out.bedroomStyle = w;
			notiz.push(a.titel + ": " + v);
			break;
		}
		case "intim":
			intimText.push(zeilen(a).join(" "));
			notiz.push(a.titel + ": " + einzeilig(a));
			break;
		case "extra":
			notiz.push(a.titel + ": " + einzeilig(a));
			if (/stärken|schwächen/i.test(a.titel)) wesenText.push(zeilen(a).join(" "));
	}
	const ex = sexAusBrief(t);
	if (!out.sexualityLevel && ex.sexualityLevel) out.sexualityLevel = ex.sexualityLevel;
	if (!out.bedroomStyle && ex.bedroomStyle) out.bedroomStyle = ex.bedroomStyle;
	if (!out.bedroomStyle) {
		const w = bettAusText(intimText.join(" ")) || bettAusText(wesenText.join(" "));
		if (w) {
			out.bedroomStyle = w;
			out.bettErkannt = true;
		}
	}
	if (hobbyText.length) {
		const h = [];
		for (const z of hobbyText) {
			const l = z.toLowerCase();
			for (const [name, re] of HOBBY_WORTE) if (!h.includes(name) && findeOhneNein(l, re) >= 0) h.push(name);
		}
		if (h.length) out.hobbys = h.slice(0, 4);
		notiz.push("Hobbys: " + hobbyText.join("; "));
	}
	const wt = (out._zuegeExplizit || []).concat(wesenText).join(" ").toLowerCase();
	if (wt) {
		const z = ZUEGE.map((k) => [k, findeOhneNein(wt, ZUG_WORTE[k])]).filter((x) => x[1] >= 0).sort((a, b) => a[1] - b[1]).map((x) => x[0]);
		if (z.length) out.zuege = z.slice(0, 5);
	}
	delete out._zuegeExplizit;
	if (notiz.length) out.notizen = notiz.join("\n").slice(0, 3600);
	return out;
}
/**
* 0.4.8: Felder aus dem Brief in eine Figur übernehmen – nur leere Felder (Standard bei Sexualität/Im Bett zählt als leer).
* → { figur (neues Objekt), felder:[Anzeigenamen] }
*/
function briefInFigur(fig, text) {
	const f = { ...fig || {} };
	const w = steckbriefAusBrief(text, { mein: !!f.mein });
	const felder = [];
	for (const k of [
		"alter",
		"groesse",
		"stimme",
		"beruf",
		"wohnsituation",
		"eltern",
		"beziehungen",
		"erinnerungen",
		"aussehen",
		"persoenlichkeit",
		"haare",
		"augen",
		"outfit",
		"kurzBio"
	]) {
		if (!w[k] || String(f[k] ?? "").trim()) continue;
		if (k === "beruf" && f.keinBeruf) continue;
		f[k] = w[k];
		felder.push(FELD_NAME[k]);
	}
	for (const k of ["hobbys", "zuege"]) if (w[k] && w[k].length && !(Array.isArray(f[k]) && f[k].length)) {
		f[k] = w[k];
		felder.push(FELD_NAME[k]);
	}
	if (w.sexualityLevel && (!sexStufeOder(f.sexualityLevel) || f.sexualityLevel === "dezent") && w.sexualityLevel !== sexStufe(f.sexualityLevel)) {
		f.sexualityLevel = w.sexualityLevel;
		felder.push(FELD_NAME.sexualityLevel);
	}
	if (w.bedroomStyle && (!bettStilOder(f.bedroomStyle) || f.bedroomStyle === "zurueckhaltend") && w.bedroomStyle !== bettStil(f.bedroomStyle)) {
		f.bedroomStyle = w.bedroomStyle;
		felder.push(FELD_NAME.bedroomStyle);
	}
	if (w.notizen) {
		const alt = String(f.notizen ?? "").trim();
		if (!alt.includes("Aus dem Charakterbrief:")) {
			f.notizen = (alt ? alt + "\n\n" : "") + "Aus dem Charakterbrief:\n" + w.notizen;
			felder.push(FELD_NAME.notizen);
		}
	}
	return {
		figur: f,
		felder,
		bettErkannt: !!w.bettErkannt && felder.includes(FELD_NAME.bedroomStyle)
	};
}
// src/shared/geschichten.js
/** Lesbarer Titel: Feld titel/title in der Story, sonst aus der ID („geschichte-2026-10-30-14-02-11“ → „Geschichte vom 30.10.2026, 14:02“). */
function geschichteTitel(id, data) {
	const t = data && (data.titel || data.title);
	if (t && String(t).trim()) return String(t).trim().slice(0, 80);
	const s = String(id || "");
	const m = s.match(/^geschichte-(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})/);
	if (m) return `Geschichte vom ${m[3]}.${m[2]}.${m[1]}, ${m[4]}:${m[5]}`;
	if (!s) return "Geschichte";
	const w = s.replace(/[-_]+/g, " ").trim();
	return w.charAt(0).toUpperCase() + w.slice(1);
}
/**
* 0.4.8 (Christian via Saskia): Eine Geschichte gilt erst als gestartet, wenn „Geschichte starten“ gedrückt wurde
* (Feld gestartet = Zeitstempel) oder schon Text im Verlauf steht (ältere Geschichten). Vorher wird nichts gespeichert.
*/
function istGestartet(data) {
	return !!(data && typeof data === "object" && (data.gestartet || Array.isArray(data.verlauf) && data.verlauf.length));
}
/** Kurzdaten einer Geschichte für die Liste (data = geladenes JSON oder null). */
function geschichteKurz(id, data, changed = 0) {
	const d = data && typeof data === "object" ? data : {};
	const figuren = Array.isArray(d.figuren) ? d.figuren.filter((f) => f && f.name) : [];
	const verlauf = Array.isArray(d.verlauf) ? d.verlauf : [];
	const mein = figuren.find((f) => f.mein || f.isPlayer);
	const letzter = verlauf.slice().reverse().find((b) => b && typeof b.text === "string" && b.text.trim());
	const preview = letzter ? letzter.text.replace(/\s+/g, " ").replace(/[*_]/g, "").trim().slice(0, 160) : "";
	const names = figurenNamen(figuren);
	return {
		title: geschichteTitel(id, d),
		updatedAt: Number(changed) || 0,
		preview,
		figures: names,
		figuresCount: figuren.length,
		paragraphs: verlauf.length,
		id: String(id),
		titel: geschichteTitel(id, d),
		changed: Number(changed) || 0,
		figuren: figuren.length,
		absaetze: verlauf.length,
		mein: mein ? String(mein.name) : "",
		lesbar: !!data,
		gestartet: istGestartet(d)
	};
}
/** Namen für die Figuren-Tags: dein Char zuerst, dann Haupt, dann Neben (wie in der Figurenliste). */
function figurenNamen(figuren) {
	const rang = (f) => f.mein || f.isPlayer ? 0 : /^haupt/i.test(String(f.rolle ?? f.role ?? "")) ? 1 : 2;
	return figuren.map((f, i) => ({
		f,
		i
	})).sort((a, b) => rang(a.f) - rang(b.f) || a.i - b.i).map((x) => String(x.f.name));
}
/** Neueste zuerst; bei Gleichstand nach ID (stabil, deterministisch). */
function geschichtenSortieren(liste = []) {
	return (liste || []).slice().sort((a, b) => (b.changed || 0) - (a.changed || 0) || String(a.id).localeCompare(String(b.id)));
}
// src/shared/regeln.js
var REGEL_SCHALTER = [
	{
		key: "auswertung",
		id: "dialogAuswertung",
		label: "Dialog-Auswertung",
		info: "Gesprochenes auswerten (Absicht, Ton, Lüge, Unterton) – per Knopf oder „werte aus“."
	},
	{
		key: "weltTakt",
		id: "weltTakt",
		label: "Welt-Takt",
		info: "Nach 45 Sekunden ohne Eingabe geht die Welt weiter. Pausiert, solange du tippst."
	},
	{
		key: "entscheidung",
		id: "duEntscheidest",
		label: "„Das entscheidest du“",
		info: "Die KI entscheidet sofort selbst, ohne Rückfrage, und hält sich danach daran."
	},
	{
		key: "naehe",
		id: "naeheTempo",
		label: "Nähe-Tempo",
		info: "Beziehungen wachsen langsam – keine sofortige Nähe."
	},
	{
		key: "formatExtras",
		id: "formatExtras",
		label: "Format-Extras (Flüstern/Gedanken)",
		info: "Geflüstertes kursiv, Gedanken in Sternchen."
	}
];
var FESTE_REGELN = [
	{
		id: "duSteuerung",
		label: "Du-Steuerung nur dein Char",
		info: "Nur du bestimmst, was dein Charakter sagt, denkt und tut."
	},
	{
		id: "kurzeAbsaetze",
		label: "Kurze Absätze",
		info: "Ein Beat pro Absatz, keine Textwände."
	},
	{
		id: "dialogFett",
		label: "Gesprochenes fett",
		info: "Rede steht immer fett, nie in Anführungszeichen."
	},
	{
		id: "orte",
		label: "Orte / Teleport",
		info: "Wer geht, bleibt weg – bis die Story ihn sichtbar zurückholt."
	},
	{
		id: "boegenSpeicher",
		label: "Charakterbögen + Storyspeicher",
		info: "Ausgefüllte Felder und gemerkte Fakten sind verbindlich."
	}
];
function defaultRegeln() {
	return Object.fromEntries(REGEL_SCHALTER.map((r) => [r.key, true]));
}
/** Liras Regel-IDs (getRules/setRule) → interne Schlüssel */
var REGEL_ID = Object.fromEntries(REGEL_SCHALTER.map((r) => [r.id, r.key]));
/** Unbekannte Schlüssel fallen weg, fehlende sind an. Nimmt {key:bool}, {liraId:bool} oder Liras Liste [{id, enabled}]. */
function normalizeRegeln(r) {
	const out = defaultRegeln();
	if (Array.isArray(r)) {
		for (const x of r) {
			const k = REGEL_ID[x?.id] || (x?.id in out ? x.id : null);
			if (k && x.enabled === false) out[k] = false;
		}
		return out;
	}
	if (r && typeof r === "object") for (const k of Object.keys(out)) {
		const id = REGEL_SCHALTER.find((x) => x.key === k).id;
		if (r[k] === false || r[k] === void 0 && r[id] === false) out[k] = false;
	}
	return out;
}
/** Für Liras Regeln-Panel: getRules() → [{id, label, info, enabled, locked}] */
function regelListe(r) {
	const n = normalizeRegeln(r);
	return [...REGEL_SCHALTER.map((x) => ({
		id: x.id,
		label: x.label,
		info: x.info,
		enabled: n[x.key],
		locked: false
	})), ...FESTE_REGELN.map((x) => ({
		id: x.id,
		label: x.label,
		info: x.info,
		enabled: true,
		locked: true
	}))];
}
/** setRule(id, on): gibt neue Regeln zurück oder null (unbekannt/fest) */
function setzeRegel(r, id, on) {
	const k = REGEL_ID[id] || (REGEL_SCHALTER.some((x) => x.key === id) ? id : null);
	if (!k) return null;
	return {
		...normalizeRegeln(r),
		[k]: !!on
	};
}
var YT_HOSTS = [
	"youtube.com",
	"youtu.be",
	"youtube-nocookie.com"
];
/** YouTube-Link → normalisierte https-URL, sonst ''. youtube.com (watch, shorts, live, embed; www./m./music.) und youtu.be. */
function ytUrl(u) {
	u = String(u ?? "").trim();
	if (!u || /\s/.test(u)) return "";
	if (/^[a-z][a-z0-9+.-]*:/i.test(u) && !/^https?:\/\//i.test(u)) return "";
	if (!/^https?:\/\//i.test(u)) u = "https://" + u.replace(/^\/+/, "");
	let x;
	try {
		x = new URL(u);
	} catch {
		return "";
	}
	if (x.username || x.password || x.port && x.port !== "443" && x.port !== "80") return "";
	const h = x.hostname.toLowerCase().replace(/^(www\.|m\.|music\.)/, "");
	if (!YT_HOSTS.includes(h)) return "";
	if (h === "youtu.be" && x.pathname.length < 2) return "";
	x.protocol = "https:";
	x.port = "";
	return x.href;
}
var txt = (v, max) => String(v ?? "").replace(/\r/g, "").replace(/[ \t]+/g, " ").trim().slice(0, max);
/** Lied-Block säubern. Ohne Titel → null. Ungültige URL fällt weg (Titel bleibt, wie Liras Anzeige ohne Link). */
function normalizeSong(b = {}) {
	if (!b || typeof b !== "object") return null;
	const title = txt(b.title, 120).replace(/\n+/g, " ");
	if (!title) return null;
	const out = {
		type: "song",
		title
	};
	if (b.id) out.id = String(b.id).slice(0, 60);
	const url = ytUrl(b.url);
	if (url) out.url = url;
	const t = txt(b.text, 800);
	if (t) out.text = t;
	out.who = b.who ? String(b.who).slice(0, 80) : "du";
	for (const k of ["from", "turn"]) if (b[k] !== void 0) out[k] = b[k];
	return out;
}
new RegExp(`\\b((?:geh(?:e|st|t|en)?|lauf(?:e|en)?|läufst|läuft|komm(?:e|st|t|en)?|betr(?:ete|ittst|itt|eten)|tr(?:ete|ittst|itt|eten)|eil(?:e|st|t|en)|renn(?:e|st|t|en)|schleich(?:e|st|t|en)|flücht(?:e|est|et|en)|zieh(?:e|st|t|en)\\s+sich|zurückzieh(?:e|st|t|en)|verschwind(?:e|est|et|en)|setz(?:e|t|en)\\s+(?:dich|mich|sich)|leg(?:e|st|t|en)\\s+(?:dich|mich|sich)|bin|bist|ist|sind|sitz(?:e|t|en)|steh(?:e|st|t|en)|lieg(?:e|st|t|en)|wart(?:e|est|et|en)|bleib(?:e|st|t|en)))\\b[^.!?\\n]{0,40}?\\b((?:in(?=\\s+[A-ZÄÖÜ][\\wäöüß]*s\\s+[A-ZÄÖÜ])|ins|im|in\\s+(?:die|den|das|der|dem|sein|seine|seinem|seiner|ihr|ihre|ihrem|ihrer|dein|deine|deinem|deiner|mein|meine|meinem|meiner|ein|eine|einen|einem|einer)|zum|zur|auf\\s+(?:den|die|das|dem|der)))\\s+((?:[a-zäöüß]+\\s+){0,2}?)([A-ZÄÖÜ][\\wäöüß-]+(?:s)?(?:\\s+[A-ZÄÖÜ][\\wäöüß-]+)?)`, "g");
/** Raum-Text säubern: „die Küche“ → „Küche“, „ins Schlafzimmer“ → „Schlafzimmer“ */
function raumName(t) {
	return String(t || "").replace(/^\s*(ins|im|in|zum|zur|auf|die|den|das|der|dem)\s+/gi, "").replace(/\s+/g, " ").trim().slice(0, 60);
}
/** „Christian“ → „Christians“, „Max“ → „Max'“ */
function genitiv(name) {
	const n = String(name || "").trim().split(/\s+/)[0];
	return /[sßxz]$/i.test(n) ? n + "’" : n + "s";
}
/**
* Kurzer Raum-Name, wie du ihn sagst („Wohnzimmer“, „mein Zimmer“) → fester Raum für den Speicher.
* „mein/dein Zimmer“ wird zum Zimmer deines Chars („Christians Zimmer“), „ihr/sein Zimmer“ zum Zimmer der Figur.
*/
function raumLabel(text, { spielerName = "", figurName = "" } = {}) {
	let r = String(text || "").replace(/[\r\n]+/g, " ").trim();
	const m = r.match(/^(mein|meine|meinem|dein|deine|deinem|ihr|ihre|ihrem|sein|seine|seinem)\s+(.+)$/i);
	if (m) {
		const wer = /^(mein|dein)/i.test(m[1]) ? spielerName : figurName;
		if (wer) r = genitiv(wer) + " " + m[2];
	}
	return raumName(r);
}
/** Kurzes Outfit, wie du es sagst („Abendkleid“, „Schlafzeug“) – nur säubern, nichts dazuerfinden. */
function outfitLabel(text) {
	return String(text || "").replace(/\s+/g, " ").trim().slice(0, 600);
}
// src/shared/bild-optik.js
var BILD_FELDER = [
	"aussehen",
	"haare",
	"augen",
	"outfit"
];
var BILD_LABEL = {
	aussehen: "Aussehen",
	haare: "Haare",
	augen: "Augen",
	outfit: "Outfit/Kleidung"
};
/**
* Ergebnis in die Figur übernehmen. Erstes Mal: nur leere Optik-Felder.
* Nochmal drücken (fig.bildOptikFelder vorhanden): Felder, die vorher aus dem Bild kamen, werden erneuert –
* was du selbst eingetragen hast, bleibt stehen. Andere Felder (Persönlichkeit, Bio …) werden nie angefasst.
* Rückgabe {figur, gesetzt:[...], behalten:[...]}
*/
function bildOptikUebernehmen(figur, ergebnis) {
	const f = { ...figur || {} };
	const vorher = Array.isArray(f.bildOptikFelder) ? f.bildOptikFelder.filter((k) => BILD_FELDER.includes(k)) : [];
	const gesetzt = [], behalten = [];
	for (const k of BILD_FELDER) {
		const neu = ergebnis?.werte?.[k];
		if (!neu) continue;
		const alt = String(f[k] || "").trim();
		if (!alt || vorher.includes(k)) {
			if (alt !== neu) f[k] = neu;
			gesetzt.push(k);
		} else behalten.push(k);
	}
	f.bildOptikFelder = [...new Set(vorher.concat(gesetzt))];
	return {
		figur: f,
		gesetzt,
		behalten
	};
}
var bildOptikLabels = (felder) => (felder || []).map((k) => BILD_LABEL[k] || k).join(", ");
// src/shared/hoerprobe.js
/** Was muss vor der Hörprobe passieren? */
function probePlan(v, { online = true } = {}) {
	if (!v) return "unbekannt";
	if (v.stub) return "stub";
	if (v.ready) return "abspielen";
	if (!online) return "offline";
	return v.engine === "kokoro" ? "paket" : "einzeln";
}
var probeTexte = {
	unbekannt: () => "Diese Stimme gibt es nicht (mehr).",
	stub: () => "Eigene Stimme aus einer Hörprobe (XTTS) kommt in einem späteren Update.",
	offline: (v) => `Keine Internetverbindung – ${v.name} muss für die Hörprobe einmalig geladen werden. Bitte mit Internet nochmal ▶ drücken.`,
	laedt: (v, mb) => `${v.name} wird für die Hörprobe geladen${mb ? ` (einmalig ca. ${mb} MB)` : ""} … Hörprobe startet danach von selbst.`,
	fehler: (v, e) => `${v.name} konnte nicht geladen werden${e ? ": " + e : ""}. Internet prüfen und nochmal ▶ drücken.`,
	nichtBereit: (v) => `${v.name} ist nach dem Laden noch nicht bereit (Download unvollständig?). Bitte nochmal ▶ drücken.`
};
/**
* Hörprobe mit Nachladen.
* deps: stimme(id) → v | null (aktueller Stand), online() → bool,
*       laufend() → Promise | null (eine Ladung läuft schon), ladePaket() → Promise<{ok,error}> (Kokoro),
*       ladeEinzeln(id) → Promise<{ok,error}> (Piper), aktualisieren() → Promise (Status neu holen),
*       abspielen(id) → Promise<{ok,error}>, melde(text) (Toast/Hinweis).
* → Promise<{ok, geladen?, error?, plan}>
*/
async function hoerprobeMitLaden(id, deps) {
	const melde = (t) => {
		try {
			deps.melde && deps.melde(t);
		} catch {}
	};
	try {
		const lauf = deps.laufend && deps.laufend();
		if (lauf) {
			try {
				await lauf;
			} catch {}
			if (deps.aktualisieren) await deps.aktualisieren();
		}
		let v = deps.stimme(id);
		const plan = probePlan(v, { online: deps.online ? deps.online() !== false : true });
		if (plan === "abspielen") return {
			...await deps.abspielen(v.id),
			plan,
			geladen: !!lauf
		};
		if (plan === "unbekannt" || plan === "stub" || plan === "offline") {
			const error = probeTexte[plan](v);
			melde(error);
			return {
				ok: false,
				error,
				plan,
				gemeldet: true
			};
		}
		melde(probeTexte.laedt(v, deps.groesseMB ? deps.groesseMB(plan) : 0));
		let r;
		try {
			r = plan === "paket" ? await deps.ladePaket() : await deps.ladeEinzeln(v.id);
		} catch (e) {
			r = {
				ok: false,
				error: String(e && e.message || e)
			};
		}
		if (deps.aktualisieren) try {
			await deps.aktualisieren();
		} catch {}
		if (!r || !r.ok) {
			const error = probeTexte.fehler(v, r && r.error);
			melde(error);
			return {
				ok: false,
				error,
				plan,
				gemeldet: true
			};
		}
		v = deps.stimme(id);
		if (!v || !v.ready) {
			const error = probeTexte.nichtBereit(deps.stimme(id) || { name: "Die Stimme" });
			melde(error);
			return {
				ok: false,
				error,
				plan,
				gemeldet: true
			};
		}
		return {
			...await deps.abspielen(v.id),
			plan,
			geladen: true
		};
	} catch (e) {
		const error = "Hörprobe gerade nicht möglich: " + String(e && e.message || e);
		melde(error);
		return {
			ok: false,
			error,
			gemeldet: true
		};
	}
}
// src/shared/stimmen.js
var HF = "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/de/de_DE";
/** Deutsche Piper-Stimmen. id = Dateiname ohne .onnx */
var STIMMEN = [{
	id: "de_DE-thorsten-medium",
	name: "Thorsten",
	art: "männlich",
	rolle: "Erzähler",
	onnx: {
		url: `${HF}/thorsten/medium/de_DE-thorsten-medium.onnx`,
		size: 63201294,
		sha256: "7e64762d8e5118bb578f2eea6207e1a35a8e0c30595010b666f983fc87bb7819"
	},
	json: {
		url: `${HF}/thorsten/medium/de_DE-thorsten-medium.onnx.json`,
		size: 4819,
		sha256: "974adee790533adb273a1ac88f49027d2a1b8f0f2cf4905954a4791e79264e85"
	}
}, {
	id: "de_DE-kerstin-low",
	name: "Kerstin",
	art: "weiblich",
	rolle: "Figuren",
	onnx: {
		url: `${HF}/kerstin/low/de_DE-kerstin-low.onnx`,
		size: 63104526,
		sha256: "d352a7641892cebf2903859af94e9ba81a141110215fe3943bcda7f7da401b7a"
	},
	json: {
		url: `${HF}/kerstin/low/de_DE-kerstin-low.onnx.json`,
		size: 4158,
		sha256: "56e708556b7b9b7a53c4f8957e021421e69f11a600962bba554cffbe72cf2d47"
	}
}];
/** Markdown/Klammern raus, damit Piper keine Sternchen vorliest. */
function sprechText(t) {
	return String(t || "").replace(/\*\*|__|\*|_/g, "").replace(/[„“”»«"]/g, "").replace(/\[[^\]]*\]|\([^)]*Anhang[^)]*\)/g, "").replace(/\s+/g, " ").trim();
}
/** Text in kurze Sprech-Stücke (max. ~2 Sätze / ~220 Zeichen), passend zu Lorevias kurzen Absätzen. */
function sprechStuecke(t, max = 220) {
	const s = sprechText(t);
	if (!s) return [];
	const saetze = s.match(/[^.!?…]+[.!?…]+|\S[^.!?…]*$/g) || [s];
	const out = [];
	let cur = "";
	for (let x of saetze) {
		x = x.trim();
		if (!x) continue;
		while (x.length > max) {
			let cut = x.lastIndexOf(", ", max);
			if (cut < max / 2) cut = x.lastIndexOf(" ", max);
			if (cut < 1) cut = max;
			if (cur) {
				out.push(cur);
				cur = "";
			}
			out.push(x.slice(0, cut + 1).trim());
			x = x.slice(cut + 1).trim();
		}
		const n = cur ? cur + " " + x : x;
		if (cur && (n.length > max || (n.match(/[.!?…]/g) || []).length > 2)) {
			out.push(cur);
			cur = x;
		} else cur = n;
	}
	if (cur) out.push(cur);
	return out;
}
/** Welche Blöcke werden vorgelesen? Nur KI-Text (keine eigenen Eingaben, keine Anhänge/Szenenwechsel). */
function sollSprechen(b, modus = "alles") {
	if (!b || !b.text || b.from === "eingabe" || b.from === "anhang") return false;
	if (b.type === "speech") return true;
	if (b.type === "action") return modus !== "dialog";
	return false;
}
var WEIBLICH = /\b(weiblich|frau|mädchen|hell|hoch|sanft|zart|sopran|alt-?stimme|mezzo)/i;
var MAENNLICH = /\b(männlich|mann|junge|tief|rau|dunkel|bass|bariton|brumm)/i;
/** Wer spricht? Letzter Figurenname im Absatz davor (gleicher Abschnitt), sonst null. */
function sprecherRaten(verlauf, i, namen) {
	const ns = (namen || []).filter(Boolean);
	if (!ns.length) return null;
	const cand = [];
	const b = verlauf[i];
	for (let j = i - 1; j >= 0 && j >= i - 3; j--) {
		const v = verlauf[j];
		if (!v || v.from === "eingabe" || b && v.turn !== b.turn) break;
		if (v.type === "action") {
			cand.push(v.text);
			break;
		}
	}
	for (const t of cand) {
		let best = null, pos = -1;
		for (const n of ns) {
			const p = String(t).lastIndexOf(n);
			if (p > pos) {
				pos = p;
				best = n;
			}
		}
		if (best) return best;
	}
	return null;
}
var pv = (dir, id, onnx, json) => ({
	id,
	onnx: {
		url: `${HF}/${dir}/${id}.onnx`,
		size: onnx[0],
		sha256: onnx[1]
	},
	json: {
		url: `${HF}/${dir}/${id}.onnx.json`,
		size: json[0],
		sha256: json[1]
	}
});
/** Weitere Piper-Modelle (MIT-Programm; Stimmen-Lizenzen siehe THIRD_PARTY_LICENSES.md) – nur bei Bedarf geladen. */
var PIPER_EXTRA = [
	pv("eva_k/x_low", "de_DE-eva_k-x_low", [20628813, "e88cf290fbfb768bf111330d2e8a46e376b0d85e3423a28bfebbc863a260dad8"], [4158, "ef14b3dcb279ab4b18422a7a132877bee7a148821bd91152fb7ae9c4b3d79625"]),
	pv("karlsson/low", "de_DE-karlsson-low", [63104526, "f9793bf7e461a472b3916cf260774bfc9812e9eb72601b147ed649d01064e8fe"], [4159, "3b2095adbfeede316f22007a0a09d4bfc25514b7189850740b06800a6cfb9838"]),
	pv("pavoque/low", "de_DE-pavoque-low", [63104526, "96cd41fe2303dfe4745422a2580658bdbc5f935b7ee67640a94da7435a502a26"], [4158, "07d43d8946e869209a12d9b4fd780e3f277fe9afb305c21491a68bd97e01b74f"]),
	pv("ramona/low", "de_DE-ramona-low", [63104526, "a1068592532aad8c49bf3d1a01b8749c11d7dba726689ee28ad64e7b627ae4c5"], [4157, "64906ab7a050ac685fa3dcea044baa798f67ed77be164f9c668a69298c6487d2"]),
	pv("thorsten_emotional/medium", "de_DE-thorsten_emotional-medium", [76745905, "c1764e652266cd6dcebf1b95c61973df5970a5f5272e94b655ff1ddf9a99d1ff"], [5031, "92895b9e99f7cfc13f4a9879da615c3d6e0baa4d660e26d7b685abdd27a6d1d3"])
];
[...STIMMEN, ...PIPER_EXTRA];
/**
* Alle Stimmen. art = "weiblich · …" / "männlich · …" (Lira-Filter), geschlecht 'w' | 'm'.
* kokoro: {modell, sid, speed} · piper: {modell, speaker?, tempo} · xtts: Platzhalter (stub:true).
*/
var STIMMEN_POOL = [
	{
		id: "kokoro-martin",
		name: "Martin",
		art: "männlich · warm, klar – Erzähler",
		geschlecht: "m",
		engine: "kokoro",
		kokoro: {
			modell: "martin",
			sid: 0,
			speed: 1
		}
	},
	{
		id: "kokoro-victoria",
		name: "Victoria",
		art: "weiblich · klar, freundlich",
		geschlecht: "w",
		engine: "kokoro",
		kokoro: {
			modell: "victoria",
			sid: 0,
			speed: 1
		}
	},
	{
		id: "kokoro-martin-ruhig",
		name: "Martin (ruhig)",
		art: "männlich · langsam, nachdenklich",
		geschlecht: "m",
		engine: "kokoro",
		kokoro: {
			modell: "martin",
			sid: 0,
			speed: .88
		}
	},
	{
		id: "kokoro-victoria-lebhaft",
		name: "Victoria (lebhaft)",
		art: "weiblich · schneller, munter",
		geschlecht: "w",
		engine: "kokoro",
		kokoro: {
			modell: "victoria",
			sid: 0,
			speed: 1.12
		}
	},
	{
		id: "kokoro-victoria-ruhig",
		name: "Victoria (ruhig)",
		art: "weiblich · ruhig, sanft",
		geschlecht: "w",
		engine: "kokoro",
		kokoro: {
			modell: "victoria",
			sid: 0,
			speed: .9
		}
	},
	{
		id: "kokoro-victoria-langsam",
		name: "Victoria (erzählend)",
		art: "weiblich · langsam, erzählend",
		geschlecht: "w",
		engine: "kokoro",
		kokoro: {
			modell: "victoria",
			sid: 0,
			speed: .8
		}
	},
	{
		id: "kokoro-victoria-eilig",
		name: "Victoria (aufgeregt)",
		art: "weiblich · schnell, aufgeregt",
		geschlecht: "w",
		engine: "kokoro",
		kokoro: {
			modell: "victoria",
			sid: 0,
			speed: 1.25
		}
	},
	{
		id: "piper-thorsten",
		name: "Thorsten",
		art: "männlich · ruhig, deutlich",
		geschlecht: "m",
		engine: "piper",
		piper: {
			modell: "de_DE-thorsten-medium",
			tempo: 1
		}
	},
	{
		id: "piper-kerstin",
		name: "Kerstin",
		art: "weiblich · hell, freundlich",
		geschlecht: "w",
		engine: "piper",
		piper: {
			modell: "de_DE-kerstin-low",
			tempo: 1
		}
	},
	{
		id: "piper-eva",
		name: "Eva",
		art: "weiblich · weich, jung",
		geschlecht: "w",
		engine: "piper",
		piper: {
			modell: "de_DE-eva_k-x_low",
			tempo: 1
		}
	},
	{
		id: "piper-ramona",
		name: "Ramona",
		art: "weiblich · lebendig, mittleres Alter",
		geschlecht: "w",
		engine: "piper",
		piper: {
			modell: "de_DE-ramona-low",
			tempo: 1
		}
	},
	{
		id: "piper-kerstin-ruhig",
		name: "Kerstin (ruhig)",
		art: "weiblich · hell, ruhig",
		geschlecht: "w",
		engine: "piper",
		piper: {
			modell: "de_DE-kerstin-low",
			tempo: 1.15
		}
	},
	{
		id: "piper-eva-lebhaft",
		name: "Eva (lebhaft)",
		art: "weiblich · jung, flott",
		geschlecht: "w",
		engine: "piper",
		piper: {
			modell: "de_DE-eva_k-x_low",
			tempo: .88
		}
	},
	{
		id: "piper-ramona-ruhig",
		name: "Ramona (ruhig)",
		art: "weiblich · warm, gelassen",
		geschlecht: "w",
		engine: "piper",
		piper: {
			modell: "de_DE-ramona-low",
			tempo: 1.15
		}
	},
	{
		id: "piper-karlsson",
		name: "Karlsson",
		art: "männlich · tief, älter",
		geschlecht: "m",
		engine: "piper",
		piper: {
			modell: "de_DE-karlsson-low",
			tempo: 1
		}
	},
	{
		id: "piper-pavoque",
		name: "Pavoque",
		art: "männlich · förmlich, ernst",
		geschlecht: "m",
		engine: "piper",
		piper: {
			modell: "de_DE-pavoque-low",
			tempo: 1
		}
	},
	{
		id: "piper-thorsten-fluestern",
		name: "Thorsten (flüsternd)",
		art: "männlich · flüsternd, geheimnisvoll",
		geschlecht: "m",
		engine: "piper",
		piper: {
			modell: "de_DE-thorsten_emotional-medium",
			speaker: 7,
			tempo: 1
		}
	},
	{
		id: "piper-thorsten-wuetend",
		name: "Thorsten (wütend)",
		art: "männlich · wütend, laut",
		geschlecht: "m",
		engine: "piper",
		piper: {
			modell: "de_DE-thorsten_emotional-medium",
			speaker: 1,
			tempo: 1
		}
	},
	{
		id: "piper-thorsten-amuesiert",
		name: "Thorsten (amüsiert)",
		art: "männlich · amüsiert, verschmitzt",
		geschlecht: "m",
		engine: "piper",
		piper: {
			modell: "de_DE-thorsten_emotional-medium",
			speaker: 0,
			tempo: 1
		}
	},
	{
		id: "xtts-eigene",
		name: "Eigene Stimme (XTTS)",
		art: "eigene · aus einer Hörprobe geklont – kommt später",
		geschlecht: "",
		engine: "xtts",
		stub: true
	}
];
var ERZAEHLER_ID = "erzaehler";
var STANDARD_ERZAEHLER = "kokoro-martin";
var stimmeNachId = (id) => STIMMEN_POOL.find((v) => v.id === id) || null;
/** Alte 0.3.x-Werte (Piper-Dateinamen) auf Pool-Ids abbilden. */
function poolId(id) {
	if (!id) return null;
	if (stimmeNachId(id)) return id;
	const v = STIMMEN_POOL.find((x) => x.piper && x.piper.modell === id && x.piper.speaker == null);
	return v ? v.id : null;
}
/** Automatische Stimme (voiceId null): nach Bogenfeld „Stimme“, sonst abwechselnd; Kokoro bevorzugt. */
function autoStimme(figur, index = 0, bereit = () => true) {
	const d = String(figur?.stimme || figur?.voiceDesc || "");
	const reihe = (MAENNLICH.test(d) ? "m" : WEIBLICH.test(d) ? "w" : index % 2 === 0 ? "w" : "m") === "w" ? [
		"kokoro-victoria",
		"kokoro-victoria-lebhaft",
		"piper-kerstin",
		"piper-eva",
		"piper-ramona"
	] : [
		"kokoro-martin-ruhig",
		"piper-thorsten",
		"piper-karlsson",
		"piper-pavoque",
		"kokoro-martin"
	];
	const bereite = reihe.filter((id) => bereit(id));
	const n = Math.floor(index / 2);
	return bereite.length ? bereite[n % bereite.length] : reihe[0];
}
/**
* 0.4.0-Sprechaufträge: [{text, voiceId, index}] – voiceId der Figur (verknüpft) oder automatisch,
* Erzähler = erzaehlerId (Standard Martin). Ersatz/Engine-Wahl macht der Hauptprozess (sprechendeStimme).
*/
function sprechAuftraege2(verlauf, startIndex, figuren = [], modus = "alles", opt = {}) {
	const bereit = opt.bereit || (() => true);
	const erz = poolId(opt.erzaehlerId) || "kokoro-martin";
	const ki = (figuren || []).filter((f) => f && f.name && !(f.mein || f.isPlayer));
	const namen = ki.map((f) => f.name);
	const out = [];
	for (let i = startIndex; i < (verlauf || []).length; i++) {
		const b = verlauf[i];
		if (!sollSprechen(b, modus)) continue;
		let voiceId = erz;
		if (b.type === "speech") {
			let wer = b.who && namen.find((n) => n.toLowerCase() === String(b.who).toLowerCase());
			if (!wer) wer = sprecherRaten(verlauf, i, namen);
			const idx = Math.max(0, wer ? namen.indexOf(wer) : 0);
			const f = ki[idx];
			voiceId = f ? poolId(f.voiceId) || autoStimme(f, idx, bereit) : autoStimme({}, 0, bereit);
		}
		for (const text of sprechStuecke(b.text)) out.push({
			text,
			voiceId,
			index: i
		});
	}
	return out;
}
/** Figuren-Id „fig_…“ (Lira-Vertrag). */
function neueFigurId(now = Date.now(), rnd = Math.random) {
	return "fig_" + now.toString(36) + Math.floor(rnd() * 1e8).toString(36);
}
/** Öffentliche Liste für LoreviaBridge.listVoices(). */
function voiceListe(bereit = () => false) {
	return STIMMEN_POOL.map((v) => ({
		id: v.id,
		name: v.name,
		art: v.art,
		geschlecht: v.geschlecht,
		engine: v.engine,
		ready: !v.stub && !!bereit(v.id),
		...v.stub ? { stub: true } : {}
	}));
}
// src/shared/welt.js
var WELT_ARTEN = [
	"Fantasy",
	"Modern",
	"Antike / Altertum",
	"Mittelalter",
	"Science-Fiction",
	"Historisch",
	"Dystopie",
	"Märchen",
	"Mischform",
	"Eigenes"
];
var WELT_EIGEN = "Eigenes";
var _n = 0;
function weltId() {
	return "w" + Date.now().toString(36) + (_n++).toString(36);
}
function weltLeer() {
	return {
		arten: [],
		artEigen: "",
		staedteAnzahl: 0,
		staedte: [],
		rohtext: "",
		fakten: []
	};
}
function weltNorm(w) {
	const d = weltLeer();
	w = w && typeof w === "object" ? w : {};
	d.arten = Array.isArray(w.arten) ? [...new Set(w.arten.filter((x) => typeof x === "string" && x.trim()).map((x) => x.trim()))] : [];
	d.artEigen = String(w.artEigen || "");
	d.staedte = Array.isArray(w.staedte) ? w.staedte.map((x) => String(x == null ? "" : x)) : [];
	const benannt = d.staedte.filter((x) => x.trim()).length;
	d.staedteAnzahl = Math.min(50, Math.max(0, parseInt(w.staedteAnzahl, 10) || 0, benannt));
	if (benannt > d.staedteAnzahl) d.staedteAnzahl = benannt;
	d.rohtext = String(w.rohtext || "");
	d.fakten = Array.isArray(w.fakten) ? w.fakten.filter((f) => f && String(f.label || "").trim()).map((f) => ({
		id: f.id || weltId(),
		label: String(f.label).trim(),
		value: f.value == null ? "" : String(f.value).trim(),
		quelle: f.quelle === "du" ? "du" : "ki"
	})) : [];
	return d;
}
function weltHatInhalt(w) {
	return !!(w && ((w.arten || []).length || w.staedteAnzahl || (w.staedte || []).some((x) => String(x).trim()) || String(w.rohtext || "").trim() || (w.fakten || []).length));
}
/** Für Bridge/Export: leere Stadtzeilen raus, sonst alles (auch der volle Rohtext). */
function weltExport(w) {
	const n = weltNorm(w);
	n.staedte = n.staedte.map((x) => x.trim()).filter(Boolean);
	n.fakten = n.fakten.map((f) => {
		const o = {
			id: f.id,
			label: f.label
		};
		if (f.value) o.value = f.value;
		if (f.quelle) o.quelle = f.quelle;
		return o;
	});
	return n;
}
/** setWorld: neue Daten übernehmen, aber einen vorhandenen Rohtext nie durch einen leeren ersetzen. */
function weltSetzen(alt, neu) {
	const a = weltNorm(alt), n = weltNorm(neu);
	if (!n.rohtext.trim() && a.rohtext.trim() && !(neu && Object.prototype.hasOwnProperty.call(neu, "rohtext"))) n.rohtext = a.rohtext;
	return n;
}
var key = (f) => (String(f.label) + "|" + String(f.value || "")).toLowerCase().replace(/\s+/g, " ").trim();
/** Neue Fakten nur ERGÄNZEN (Duplikate raus, bestehende – v. a. eigene – bleiben unverändert). → {welt, neu} */
function faktenMischen(welt, neue) {
	const w = weltNorm(welt), da = new Set(w.fakten.map(key));
	let n = 0;
	for (const f of neue || []) {
		if (!f || !String(f.label || "").trim()) continue;
		const x = {
			id: f.id || weltId(),
			label: String(f.label).trim().slice(0, 60),
			value: f.value == null ? "" : String(f.value).trim().slice(0, 200),
			quelle: "ki"
		};
		if (da.has(key(x))) continue;
		w.fakten.push(x);
		da.add(key(x));
		n++;
	}
	return {
		welt: w,
		neu: n
	};
}
var STICHWORTE = [
	[
		"magie",
		"Magie",
		"vorhanden"
	],
	[
		"drache",
		"Wesen",
		"Drachen"
	],
	[
		"elfen",
		"Wesen",
		"Elfen"
	],
	[
		"zwerg",
		"Wesen",
		"Zwerge"
	],
	[
		"vampir",
		"Wesen",
		"Vampire"
	],
	[
		"könig",
		"Herrschaft",
		"Königreich"
	],
	[
		"kaiser",
		"Herrschaft",
		"Kaiserreich"
	],
	[
		"rat ",
		"Herrschaft",
		"Rat"
	],
	[
		"republik",
		"Herrschaft",
		"Republik"
	],
	[
		"krieg",
		"Konflikt",
		"Krieg"
	],
	[
		"rebell",
		"Konflikt",
		"Rebellion"
	],
	[
		"meer",
		"Landschaft",
		"Küste / Meer"
	],
	[
		"hafen",
		"Landschaft",
		"Hafen"
	],
	[
		"wald",
		"Landschaft",
		"Wälder"
	],
	[
		"wüste",
		"Landschaft",
		"Wüste"
	],
	[
		"gebirge",
		"Landschaft",
		"Gebirge"
	],
	[
		"insel",
		"Landschaft",
		"Inseln"
	],
	[
		"götter",
		"Glaube",
		"Götter"
	],
	[
		"tempel",
		"Glaube",
		"Tempel"
	],
	[
		"technik",
		"Technik",
		"vorhanden"
	],
	[
		"dampf",
		"Technik",
		"Dampfkraft"
	],
	[
		"raumschiff",
		"Technik",
		"Raumfahrt"
	],
	[
		"winter",
		"Klima",
		"kalt"
	],
	[
		"regen",
		"Klima",
		"regnerisch"
	],
	[
		"hitze",
		"Klima",
		"heiß"
	]
];
var STOPP = /^(Die|Der|Das|Den|Dem|Des|Ein|Eine|Einen|Einem|Einer|Dort|Hier|Wenn|Aber|Und|Oder|Doch|Seit|Nach|Vor|Bei|Mit|Von|Auch|Nur|Alle|Jeder|Jede|Man|Sie|Er|Es|Wir|Ihr|Im|In|Am|An|Auf|Aus|Zum|Zur|Als|Wie|Was|Wer|Wo|Gibt|Viele|Manche|Niemand|Magie|Technik|Krieg|Götter|Herrscher)$/;
/** Städte, die im Text ausdrücklich als Stadt/Hauptstadt/Hafenstadt benannt sind. */
function staedteAusText(text) {
	const t = String(text || ""), out = [];
	const re = /\b(?:(?:Haupt|Hafen|Grenz|Handels|Berg|Küsten|Königs|Reichs)?[Ss]tadt|Ort|Dorf|Festung|Siedlung|Metropole)\s+(?:namens\s+|genannt\s+)?([A-ZÄÖÜ][\wäöüß'-]{2,}(?:\s+[A-ZÄÖÜ][\wäöüß'-]{2,})?)/g;
	let m;
	while (m = re.exec(t)) {
		const n = m[1].trim();
		if (!STOPP.test(n.split(/\s+/)[0]) && !out.includes(n)) out.push(n);
	}
	const re2 = /\b(?:[Ii]n|[Nn]ach|[Aa]us|[Vv]on)\s+([A-ZÄÖÜ][\wäöüß'-]{2,}),\s+(?:der|die|einer|eine|dem)\s+(?:[\wäöüß]+\s+)?[\wäöüß]*(?:[Ss]tadt|[Dd]orf|[Ff]estung|[Mm]etropole)/g;
	while (m = re2.exec(t)) {
		const n = m[1].trim();
		if (!STOPP.test(n) && !out.includes(n)) out.push(n);
	}
	return out;
}
/** Leichte, regelbasierte Auswertung (Fallback ohne KI und Ergänzung zur KI). Keine Zusammenfassung. */
function weltFaktenHeuristik(text, welt) {
	const w = weltNorm(welt), t = String(text || ""), lc = t.toLowerCase(), out = [];
	const add = (label, value) => {
		if (!out.some((f) => f.label === label && f.value === (value || ""))) out.push({
			label,
			value: value || ""
		});
	};
	const arten = w.arten.filter((a) => a !== WELT_EIGEN).concat(w.artEigen.trim() && w.arten.includes("Eigenes") ? [w.artEigen.trim()] : []);
	if (arten.length) add("Weltart", arten.join(" + "));
	const orte = [...new Set(w.staedte.map((x) => x.trim()).filter(Boolean).concat(staedteAusText(t)))];
	if (orte.length) add("Städte", orte.join(", "));
	for (const [k, l, v] of STICHWORTE) if (lc.includes(k)) add(l, v);
	const zaehl = {};
	for (const x of t.match(/\b[A-ZÄÖÜ][a-zäöüß]{3,}\b/g) || []) zaehl[x] = (zaehl[x] || 0) + 1;
	Object.keys(zaehl).filter((x) => zaehl[x] > 1 && !orte.includes(x) && !STOPP.test(x)).slice(0, 3).forEach((x) => add("Name", x));
	return out;
}
// src/shared/farben.js
var FARBE_DU = "#1a1a1a";
var NPC_FARBEN = [
	"#c0392b",
	"#2e6bb8",
	"#2d8a5c",
	"#8e44ad",
	"#c47a1a"
];
var HG_PRESETS = [
	{
		name: "Creme",
		farbe: "#fbf6ea"
	},
	{
		name: "Pergament",
		farbe: "#f1e4c8"
	},
	{
		name: "Blau",
		farbe: "#e8f0fa"
	},
	{
		name: "Grau",
		farbe: "#ececea"
	},
	{
		name: "Weiß",
		farbe: "#ffffff"
	}
];
var HG_STANDARD = HG_PRESETS[0].farbe;
function hexOk(c) {
	return /^#[0-9a-f]{6}$/i.test(c || "");
}
var istDu = (x) => !!(x && (x.mein || x.isPlayer));
/** Nächste freie Palettenfarbe (Figur mit Index `ausser` zählt nicht mit). */
function naechsteFarbe(figuren, ausser = -1) {
	const benutzt = (figuren || []).filter((x, i) => x && i !== ausser && !istDu(x) && hexOk(x.color)).map((x) => x.color.toLowerCase());
	for (const c of NPC_FARBEN) if (!benutzt.includes(c)) return c;
	return NPC_FARBEN[benutzt.length % NPC_FARBEN.length];
}
/** Figuren ohne gültige Farbe bekommen eine (dein Char schwarz, sonst Palette). Ändert die Liste direkt. */
function farbenAuffuellen(figuren) {
	(figuren || []).forEach((x, i) => {
		if (x && !hexOk(x.color)) x.color = istDu(x) ? FARBE_DU : naechsteFarbe(figuren, i);
	});
	return figuren;
}
/** Wechsel „mein Char“: Standardfarben ziehen mit, selbst gewählte bleiben. */
function farbeBeiRollenwechsel(x, wirdDu) {
	const c = String(x.color || "").toLowerCase();
	if (wirdDu && (!hexOk(c) || NPC_FARBEN.includes(c))) x.color = FARBE_DU;
	if (!wirdDu && (!hexOk(c) || c === "#1a1a1a")) x.color = null;
}
function rgb(h) {
	h = h.replace("#", "");
	return [
		0,
		2,
		4
	].map((i) => parseInt(h.substr(i, 2), 16));
}
function hex(c) {
	return "#" + c.map((v) => {
		v = Math.max(0, Math.min(255, Math.round(v)));
		return (v < 16 ? "0" : "") + v.toString(16);
	}).join("");
}
function lum(h) {
	return rgb(h).map((v) => {
		v /= 255;
		return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4);
	}).reduce((a, v, i) => a + v * [
		.2126,
		.7152,
		.0722
	][i], 0);
}
function kontrast(a, b) {
	const x = lum(a), y = lum(b);
	return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
function hgDunkel(bg) {
	return lum(bg) < .25;
}
/** Farbe so weit Richtung Schwarz/Weiß ziehen, bis sie auf bg lesbar ist (≥ 4,5:1). */
function lesbar(fg, bg) {
	if (!hexOk(fg) || !hexOk(bg)) return fg;
	const ziel = hgDunkel(bg) ? [
		255,
		255,
		255
	] : [
		0,
		0,
		0
	], c = rgb(fg);
	let out = fg;
	for (let t = 0; t <= 1.0001 && kontrast(out, bg) < 4.5; t += .05) out = hex(c.map((v, i) => v + (ziel[i] - v) * t));
	return out;
}
/** Rohfarbe eines Sprechers: 'du' → dein Char, Name → Figur, unbekannt → feste Palettenfarbe aus dem Namen. */
function sprecherFarbe(who, figuren) {
	const fs = (figuren || []).filter(Boolean);
	if (who === "du") {
		const p = fs.find(istDu);
		return p && hexOk(p.color) ? p.color : FARBE_DU;
	}
	if (!who) return null;
	const n = String(who).trim().toLowerCase();
	const f = fs.find((x) => String(x.name || "").trim().toLowerCase() === n);
	if (f && hexOk(f.color)) return f.color;
	if (f && istDu(f)) return FARBE_DU;
	let h = 0;
	for (let i = 0; i < n.length; i++) h = h * 31 + n.charCodeAt(i) >>> 0;
	return NPC_FARBEN[h % NPC_FARBEN.length];
}
// src/renderer/app.js
var APP_VERSION = "0.4.11";
(function() {
	"use strict";
	var API = window.lorevia || null;
	var IDLE_SECONDS = 45;
	var MAX_AUTO_TICKS = 3;
	var STORE_KEY = "lorevia-ui-v1";
	var settings = {
		model: "qwen3.5:4b",
		currentStory: "meine-geschichte"
	};
	function emptyState() {
		return {
			version: 2,
regie: [], wartetAufSpieler: false,
spielerAbwesend: false,
			figuren: [],
			intro: "",
			fragen: {},
			verlauf: [],
			besucht: {},
			anwesend: null,
			korrekturen: [],
			turn: 0,
			speicher: null,
			anhange: [],
			regeln: normalizeRegeln(null),
			welt: weltNorm(null)
		};
	}
	var state = emptyState();
	var saveTimer = null;
	function save() {
		clearTimeout(saveTimer);
		saveTimer = setTimeout(flushSave, 300);
	}
	var entwurfDatei = "";
	function flushSave() {
		clearTimeout(saveTimer);
		saveTimer = null;
		if (!istGestartet(state) && !(entwurfDatei && entwurfDatei === settings.currentStory)) return;
		if (API) API.saveStory(settings.currentStory, state).catch(function(e) {
			console.error("Speichern fehlgeschlagen", e);
		});
		else try {
			localStorage.setItem(STORE_KEY, JSON.stringify(state));
		} catch (e) {}
	}
	window.addEventListener("beforeunload", function() {
		if (saveTimer) flushSave();
	});
	function loadState() {
		if (API) return API.loadSettings().then(function(s) {
			settings = s || settings;
			if (s && s.idleSeconds) IDLE_SECONDS = s.idleSeconds;
			if (s && s.maxAutoTicks) MAX_AUTO_TICKS = s.maxAutoTicks;
			return API.loadStory(settings.currentStory);
		}).then(function(d) {
			return d;
		}).catch(function() {
			return null;
		});
		try {
			return Promise.resolve(JSON.parse(localStorage.getItem(STORE_KEY)));
		} catch (e) {
			return Promise.resolve(null);
		}
	}
	var FRAGEN = [
		{
			id: "zeit",
			q: "Wann spielt die Geschichte? (Zeit, Jahreszeit, Tageszeit)"
		},
		{
			id: "ort",
			q: "Wo genau beginnt die erste Szene?"
		},
		{
			id: "bez",
			q: "Wie stehen die Hauptfiguren zueinander?"
		},
		{
			id: "ziel",
			q: "Was will dein Char gerade, was steht im Weg?"
		},
		{
			id: "regeln",
			q: "Gibt es Regeln der Welt? (Magie, Technik, Gesetze, Tabus)"
		},
		{
			id: "ton",
			q: "Welcher Ton? (ruhig, düster, romantisch, spannend …)"
		},
		{
			id: "grenzen",
			q: "Was soll die KI nie tun oder schreiben?"
		}
	];
	var WELT_DEMO = [
		[
			{
				type: "action",
				text: "Draußen schlägt eine Autotür zu."
			},
			{
				type: "action",
				text: "Joran geht ans Fenster. Er schiebt den Vorhang ein Stück zur Seite."
			},
			{
				type: "speech",
				text: "Da ist noch jemand."
			}
		],
		[{
			type: "action",
			text: "Elin steht auf. Sie holt ein Handtuch aus dem Schrank und legt es neben dich auf den Stuhl."
		}, {
			type: "action",
			text: "Sie sagt nichts dazu. Schaut nur kurz zu dir."
		}],
		[
			{
				type: "action",
				text: "Das Licht über dem Herd flackert einmal."
			},
			{
				type: "action",
				text: "Joran flucht leise."
			},
			{
				type: "speech",
				text: "Nicht schon wieder der Strom."
			}
		]
	];
	var demoIndex = 0;
	window.LoreviaBridge = {
		continueStory: function(ctx) {
			if (!API) {
				var b = WELT_DEMO[demoIndex++ % WELT_DEMO.length];
				return new Promise(function(r) {
					setTimeout(function() {
						r(b.slice());
					}, 600);
				});
			}
			return API.continueStory(ctx, settings.model).then(function(r) {
				if (!r || !r.ok) throw new Error(r && r.error || "Keine Antwort");
				var blocks = r.blocks || [];
				blocks.rewrite = r.mode === "rewrite";
blocks.warteAufSpieler = r.warteAufSpieler === true;
				blocks.korrekturen = r.corrections || [];
				blocks.violations = r.violations || [];
				blocks.speicher = r.speicher || null;
				blocks.anwesend = r.anwesend || null;
				blocks.entscheidung = r.entscheidung || null;
				blocks.verworfen = r.verworfen || [];
				return blocks;
			});
		},
		analyzeDialogue: function(ctx, umfang) {
			if (!API) return new Promise(function(r) {
				setTimeout(function() {
					r({
						eintraege: [{
							wer: "Joran",
							zitat: "Da ist noch jemand.",
							absicht: "will warnen",
							ton: "leise, angespannt",
							widerspruch: "",
							luege: "nein",
							unterton: "Angst"
						}],
						fazit: "Joran ist nervös.",
						quelle: "demo"
					});
				}, 400);
			});
			return API.analyzeDialogue(ctx, settings.model, umfang).then(function(r) {
				if (!r || !r.ok) throw new Error(r && r.error || "Keine Antwort");
				var a = r.auswertung || {
					eintraege: [],
					fazit: ""
				};
				a.quelle = r.quelle;
				a.leer = !!r.leer;
				a.speicher = r.speicher || null;
				return a;
			});
		},
		requestFullscreen: function() {
			if (API && API.requestFullscreen) return API.requestFullscreen();
			return Promise.resolve(false);
		},
		getWorld: function() {
			return weltExport(W());
		},
		setWorld: function(data) {
			try {
				state.welt = weltSetzen(W(), data);
				flushSave();
				return Promise.resolve({ ok: true });
			} catch (e) {
				return Promise.resolve({
					ok: false,
					error: String(e && e.message || e)
				});
			}
		},
		analyzeWorldText: function(text) {
			var t = String(text == null ? "" : text);
			if (t.trim() || !W().rohtext.trim()) {
				W().rohtext = t;
				flushSave();
			}
			if (!API || !API.analyzeWorld) return new Promise(function(r) {
				setTimeout(function() {
					r({
						ok: true,
						fakten: weltFaktenHeuristik(t, W()),
						quelle: "regeln"
					});
				}, 300);
			});
			return API.analyzeWorld(t, weltExport(W()), settings.model).then(function(r) {
				if (!r || !r.ok) return {
					ok: true,
					fakten: weltFaktenHeuristik(t, W()),
					quelle: "regeln",
					error: r && r.error || ""
				};
				return r;
			}, function() {
				return {
					ok: true,
					fakten: weltFaktenHeuristik(t, W()),
					quelle: "regeln"
				};
			});
		},
		getWriteBg: function() {
			return schreibHg();
		},
		setWriteBg: function(hex) {
			if (!hexOk(hex)) return Promise.resolve({ ok: false });
			settings.schreibHg = hex.toLowerCase();
			if (!API) return Promise.resolve({ ok: true });
			return Promise.resolve(API.saveSettings(settings)).then(function() {
				return { ok: true };
			}, function() {
				return { ok: false };
			});
		},
		getVoicesEnabled: function() {
			return stimmenAn();
		},
		setVoicesEnabled: function(on) {
			if (!API || !API.stimmenStatus) return Promise.resolve({ ok: false });
			if (!on) {
				settings.stimmen = false;
				stimmenStopp();
				stimmenSpeichern();
				renderStimmen();
				return Promise.resolve({ ok: true });
			}
			if (!stimmen.ready) return Promise.resolve({
				ok: true,
				needsDownload: true,
				online: istOnline()
			});
			settings.stimmen = true;
			stimmenSpeichern();
			renderStimmen();
			return Promise.resolve({ ok: true });
		},
		downloadVoices: function(onProgress) {
			return ladeStimmen(onProgress);
		},
		listVoices: function() {
			return stimmenListeLaden().then(function(l) {
				return l.map(function(v) {
					return {
						id: v.id,
						name: v.name,
						art: v.art,
						geschlecht: v.geschlecht,
						engine: v.engine,
						ready: !!v.ready,
						stub: !!v.stub
					};
				});
			});
		},
		getVoiceStatus: function() {
			return (API && API.stimmenStatus ? API.stimmenStatus().then(function(s) {
				statusUebernehmen(s);
				return s;
			}, function() {
				return stimmStatus;
			}) : Promise.resolve(stimmStatus)).then(function(s) {
				s = s || {};
				return {
					engine: s.engine || "kokoro",
					ready: !!s.ready,
					kokoroReady: !!s.kokoroReady,
					nurErsatz: !!s.nurErsatz,
					downloading: !!(s.downloading || stimmen.laden),
					prozent: stimmen.laden ? stimmen.prozent : s.prozent,
					offlineReadable: true,
					online: istOnline(),
					enabled: stimmenAn(),
					groesseMB: s.groesseMB || stimmen.groesseMB
				};
			});
		},
		setFigureVoice: function(figureId, voiceId) {
			var r = figurStimmeSetzen(figureId, voiceId || null);
			if (r.ok) {
				stimmAllesRendern();
				renderFiguren();
			}
			return Promise.resolve(r);
		},
		getFigureVoice: function(figureId) {
			if (figureId === "erzaehler") return erzaehlerStimme();
			var x = figurNachId(figureId);
			return x ? x.voiceId || null : null;
		},
		previewVoice: function(voiceId) {
			return previewVoice(voiceId);
		},
		stopPreview: function() {
			probeStopp();
			return Promise.resolve({ ok: true });
		},
		cloneVoice: function() {
			return Promise.resolve({
				ok: false,
				error: "Eigene Stimme aus einer Hörprobe (XTTS) kommt in einem späteren Update.",
				stub: true
			});
		},
		getVersion: function() {
			return appVersion;
		},
		checkUpdate: function() {
			if (!API || !API.checkUpdate) return Promise.resolve({ available: false });
			return API.checkUpdate().then(function(u) {
				update = u && u.available ? u : null;
				renderUpdateBtn();
				zeigeUpdateBox();
				return {
					available: !!update,
					version: update && update.version,
					notes: update && update.notes
				};
			});
		},
		startUpdate: function() {
			if (!API || !API.installUpdate) return Promise.resolve({
				ok: false,
				error: "Updates gibt es nur in der installierten App."
			});
			flushSave();
			return API.installUpdate().then(function(r) {
				return {
					ok: !!(r && r.ok),
					error: r && r.error
				};
			});
		},
		reportError: function(d) {
			d = d || {};
			if (!API || !API.saveBugReport) return Promise.resolve({
				ok: false,
				error: "Fehlerberichte speichert nur die installierte App."
			});
			var daten = {
				art: d.art || "sonstiges",
				notiz: d.text || "(ohne Beschreibung)",
				screenshotDataUrl: d.screenshotDataUrl || "",
				geschichte: settings.currentStory,
				modell: settings.model,
				regeln: regeln(),
				figuren: state.figuren.map(function(f) {
					return {
						name: f.name,
						mein: !!(f.mein || f.isPlayer),
						rolle: f.rolle || f.role
					};
				}),
				verlauf: state.verlauf.slice(-30)
			};
			return API.saveBugReport(JSON.parse(JSON.stringify(daten))).then(function(r) {
				return {
					ok: !!(r && r.ok),
					path: r && r.dir,
					error: r && r.error
				};
			});
		},
		getRules: function() {
			return regelListe(regeln());
		},
		setRule: function(id, on) {
			var neu = setzeRegel(regeln(), id, on);
			if (!neu) return Promise.resolve({ ok: false });
			state.regeln = neu;
			save();
			renderRegelnKurz();
			if (REGEL_ID[id] === "weltTakt" || id === "weltTakt") resetIdle();
			return Promise.resolve({ ok: true });
		},
		listCharacterLibrary: function() {
			return bibLaden().then(function(r) {
				return {
					folder: bib.dir,
					items: bib.eintraege.map(function(c) {
						return {
							id: c.id,
							name: c.name,
							summary: c.brief ? c.brief.name : "",
							photo: c.foto ? {
								path: c.foto.path,
								name: c.foto.name,
								ausBrief: !!c.foto.ausBrief
							} : null,
							brief: c.brief ? {
								name: c.brief.name,
								path: c.brief.path
							} : null
						};
					}),
					error: r && !r.ok ? r.error || "Ordner nicht gefunden" : void 0
				};
			});
		},
		extractPhotoFromBrief: function(brief) {
			if (!brief || !brief.path || !API || !API.briefFoto) return Promise.resolve(null);
			return API.briefFoto(settings.currentStory, brief.path).then(function(r) {
				if (!r || !r.ok || !r.photo) return null;
				return { photo: {
					id: r.photo.id,
					name: r.photo.name,
					mime: r.photo.mime,
					path: r.photo.path,
					kind: "image",
					size: r.photo.size,
					ausBrief: true
				} };
			}, function() {
				return null;
			});
		},
		getHobbyOptions: function() {
			return HOBBYS.slice();
		},
		getTraitOptions: function() {
			return ZUEGE.slice();
		}
	};
	var ki = {
		ready: !API,
		running: false,
		hasModel: false,
		pulling: false,
		setup: false
	};
	function checkKI() {
		if (!API) return Promise.resolve(ki);
		setKI("Prüfe KI …", "");
		return API.ollamaStatus(settings.model).then(function(s) {
			ki.running = !!s.running;
			ki.hasModel = !!s.hasModel;
			ki.ready = ki.running && ki.hasModel;
			renderKI();
			if (ki.ready && isActive("schreiben")) {
				maybeStart();
				resetIdle();
			}
			return ki;
		});
	}
	function setKI(txt, cls) {
		var el = document.getElementById("kiStatus");
		if (el) {
			el.textContent = txt;
			el.className = "side-small " + (cls || "");
		}
		var st = document.getElementById("kiStartStatus");
		if (st) {
			st.textContent = txt;
			st.className = "ki-start-status " + (cls || "");
		}
	}
	function renderKI() {
		var ladenHidden = !(ki.running && !ki.hasModel) || ki.pulling || ki.setup;
		["kiLaden", "kiStartLaden"].forEach(function(id) {
			var b = document.getElementById(id);
			if (b) b.hidden = ladenHidden;
		});
		["kiSetup", "kiStartSetup"].forEach(function(id) {
			var b = document.getElementById(id);
			if (b) b.hidden = ki.running || ki.setup || !(API && API.setupKI);
		});
		["kiDownload", "kiStartDownload"].forEach(function(id) {
			var b = document.getElementById(id);
			if (b) b.hidden = ki.running || ki.setup;
		});
		if (ki.setup) return;
		if (ki.ready) setKI("✓ KI bereit: " + settings.model + " ist installiert. Du kannst loslegen.", "ok");
		else if (!ki.running) setKI("Ollama fehlt oder läuft nicht. „KI einrichten“ drücken: Lorevia installiert Ollama und lädt das Modell (einmalig ca. 3–4 GB).", "bad");
		else if (!ki.pulling) setKI("Ollama läuft. Das Modell " + settings.model + " fehlt noch: „Modell laden (~3–4 GB)“ drücken.", "bad");
	}
	function pullModel() {
		ki.pulling = true;
		renderKI();
		var progs = [document.getElementById("kiProgress"), document.getElementById("kiStartProgress")];
		var bars = [document.getElementById("kiBar"), document.getElementById("kiStartBar")];
		progs.forEach(function(x) {
			x.hidden = false;
		});
		setKI("Modell wird geladen … (einmalig, ca. 3–4 GB)", "");
		var off = API.onPullProgress(function(p) {
			var pct = p.total ? Math.round(100 * (p.completed || 0) / p.total) : 0;
			bars.forEach(function(b) {
				b.style.width = pct + "%";
			});
			setKI((p.status || "Lade …") + (pct ? " · " + pct + " %" : ""), "");
		});
		API.pullModel(settings.model).then(function(r) {
			off();
			ki.pulling = false;
			progs.forEach(function(x) {
				x.hidden = true;
			});
			if (!r.ok) setKI("Laden fehlgeschlagen: " + r.error, "bad");
			return checkKI();
		});
	}
	function setupKI() {
		if (!API || !API.setupKI || ki.setup) return;
		ki.setup = true;
		renderKI();
		var progs = [document.getElementById("kiProgress"), document.getElementById("kiStartProgress")];
		var bars = [document.getElementById("kiBar"), document.getElementById("kiStartBar")];
		progs.forEach(function(x) {
			x.hidden = false;
		});
		bars.forEach(function(b) {
			b.style.width = "0%";
		});
		setKI("KI wird eingerichtet … (einmalig, kann einige Minuten dauern)", "");
		var off = API.onSetupProgress(function(p) {
			var pct = p.total ? Math.round(100 * (p.completed || 0) / p.total) : 0;
			bars.forEach(function(b) {
				b.style.width = pct + "%";
			});
			setKI((p.status || "Einrichten …") + (pct ? " · " + pct + " %" : ""), "");
		});
		API.setupKI(settings.model).then(function(r) {
			off();
			ki.setup = false;
			progs.forEach(function(x) {
				x.hidden = true;
			});
			if (!r.ok) {
				renderKI();
				setKI("Einrichten fehlgeschlagen: " + r.error + " · Alternativ: „Ollama-Webseite“.", "bad");
				return;
			}
			return checkKI();
		});
	}
	var stimmen = {
		ready: false,
		kokoroReady: false,
		nurErsatz: false,
		laden: false,
		groesseMB: 421,
		gen: 0,
		queue: [],
		spielt: null,
		prozent: 0,
		fehler: ""
	};
	var ENGINE_NAME = {
		kokoro: "Kokoro",
		xtts: "XTTS",
		piper: "Piper"
	};
	var stimmListe = voiceListe(function() {
		return !API;
	});
	var stimmStatus = {
		engine: "kokoro",
		ready: !API,
		offlineReadable: true,
		online: navigator.onLine !== false
	};
	var stimmFilter = "alle";
	var STIMMEN_AUS = true;
	function stimmenAn() {
		return !STIMMEN_AUS && !!(settings.stimmen && stimmen.ready);
	}
	function stimmNach(id) {
		id = poolId(id) || id;
		for (var i = 0; i < stimmListe.length; i++) if (stimmListe[i].id === id) return stimmListe[i];
		return null;
	}
	function stimmName(id) {
		var v = stimmNach(id);
		return v ? v.name : "unbekannt";
	}
	function stimmGeschlecht(v) {
		var a = String(v.geschlecht || v.art || "").toLowerCase();
		return /^w|weiblich/.test(a) ? "w" : /^m|männlich/.test(a) ? "m" : "";
	}
	function stimmArt(v) {
		return String(v.art || "").replace(/^(weiblich|männlich)\s*·\s*/i, "");
	}
	function stimmeBereit(id) {
		var v = stimmNach(id);
		return !!(v && v.ready);
	}
	function istOnline() {
		return navigator.onLine !== false && stimmStatus.online !== false;
	}
	function setStimmenText(t, cls) {
		var el = document.getElementById("stimmenStatus");
		if (el) {
			el.textContent = t;
			el.className = "side-small " + (cls || "");
		}
	}
	function erzaehlerStimme() {
		return state.erzaehlerStimme || null;
	}
	function renderStimmen() {
		var an = stimmenAn();
		if (!document.getElementById("stimmenBox")) return;
		var sch = document.getElementById("stimmenSchalter"), leiste = document.getElementById("stimmenLeiste");
		if (!sch) return;
		sch.setAttribute("aria-pressed", an ? "true" : "false");
		sch.disabled = stimmen.laden;
		if (leiste) {
			leiste.checked = an || stimmen.laden;
			leiste.disabled = stimmen.laden;
			leiste.closest("label").title = stimmen.laden ? "Stimmen werden geladen … " + (stimmen.prozent || 0) + " %" : an ? "Stimmen an (lokal, offline)" : stimmen.ready ? "Stimmen aus" : "Stimmen aus · beim Einschalten einmalig ca. " + stimmen.groesseMB + " MB laden";
		}
		document.getElementById("stimmenProgress").hidden = !stimmen.laden;
		document.getElementById("stimmenBar").style.width = (stimmen.prozent || 0) + "%";
		document.getElementById("stimmenModus").value = settings.stimmenModus || "alles";
		document.getElementById("stimmenStopp").hidden = !(an && (stimmen.spielt || stimmen.queue.length));
		statusAnwenden();
		if (stimmen.laden) {
			sch.textContent = "Stimmen werden geladen …";
			return;
		}
		sch.textContent = an ? "Stimmen aus" : stimmen.ready ? "Stimmen an" : "Stimmen laden + an (~" + stimmen.groesseMB + " MB)";
		if (stimmen.fehler) setStimmenText(stimmen.fehler, "bad");
		else if (an) setStimmenText("✓ Stimmen an: " + stimmName(erzaehlerStimme() || "kokoro-martin") + " erzählt, die Figuren sprechen mit eigener Stimme" + (stimmen.nurErsatz ? " (Ersatz-Stimmen Piper, bis Kokoro geladen ist)" : "") + ".", "ok");
		else if (stimmen.ready) setStimmenText("Stimmen sind aus. Geladen und bereit. Du liest selbst.", "");
		else setStimmenText("Stimmen sind aus – du liest selbst. Beim ersten Einschalten lädt Lorevia einmalig ca. " + stimmen.groesseMB + " MB (Kokoro + 2 deutsche Stimmen, lokal und kostenlos).", "");
	}
	function statusAnwenden() {
		var offline = !istOnline();
		var s;
		if (stimmen.laden) s = {
			t: "Stimmenpaket lädt … " + (stimmen.prozent || 0) + " % · bis dahin: lesen",
			k: "laedt"
		};
		else if (!stimmen.ready && offline) s = {
			t: "Ohne Verbindung: lesen (Stimmen laden, sobald Internet da ist)",
			k: "aus"
		};
		else if (!stimmen.ready) s = {
			t: "Ohne Stimmenpaket: lesen (wird beim Einschalten geladen)",
			k: "aus"
		};
		else if (stimmen.nurErsatz) s = {
			t: "Nur Ersatz-Stimmen (Piper) bereit",
			k: "laedt"
		};
		else s = {
			t: (ENGINE_NAME[stimmStatus.engine] || "Stimmen") + " bereit · lokal & kostenlos" + (offline ? " · offline" : ""),
			k: "an"
		};
		[
			"stimmStatusForm",
			"stimmStatusZs",
			"stimmStatusPop"
		].forEach(function(id) {
			var el = document.getElementById(id);
			if (!el) return;
			el.textContent = s.t;
			el.className = "stimm-status " + s.k;
		});
		var lesen = document.getElementById("stimmLesen");
		if (lesen) {
			lesen.hidden = stimmenAn();
			lesen.title = s.t;
		}
	}
	function statusUebernehmen(s) {
		if (!s) return;
		stimmStatus = s;
		stimmen.ready = !!s.ready;
		stimmen.kokoroReady = !!s.kokoroReady;
		stimmen.nurErsatz = !!s.nurErsatz;
		if (s.groesseMB) stimmen.groesseMB = s.groesseMB;
		if (Array.isArray(s.stimmen) && s.stimmen.length) stimmListe = s.stimmen;
	}
	function checkStimmen() {
		if (STIMMEN_AUS) {
			document.body.classList.add("stimmen-aus");
			return Promise.resolve();
		}
		if (!API || !API.stimmenStatus) {
			var b = document.getElementById("stimmenBox");
			if (b) b.innerHTML = "<p class=\"side-small\">Stimmen gibt es nur in der Lorevia-App. Hier: Demo-Hörprobe.</p>";
			stimmAllesRendern();
			return Promise.resolve();
		}
		return API.stimmenStatus().then(function(s) {
			statusUebernehmen(s);
			stimmAllesRendern();
		}, function() {
			stimmAllesRendern();
		});
	}
	function stimmenSpeichern() {
		if (API) API.saveSettings(settings);
	}
	function ladeStimmen(onProgress, opts) {
		if (STIMMEN_AUS) return Promise.resolve({
			ok: false,
			aus: true
		});
		opts = opts || {};
		if (!API || !API.setupStimmen) return Promise.resolve({ ok: false });
		if (stimmen.laden) return Promise.resolve({
			ok: false,
			laeuft: true
		});
		var vorher = !!settings.stimmen;
		var p = ladeStimmenJetzt(onProgress, opts, vorher);
		stimmen.ladePromise = p;
		return p.then(function(r) {
			if (stimmen.ladePromise === p) stimmen.ladePromise = null;
			return r;
		});
	}
	function ladeStimmenJetzt(onProgress, opts, vorher) {
		if (navigator.onLine === false && !stimmen.ready) {
			stimmen.fehler = "Keine Internetverbindung – Lorevia liest einfach weiter. Stimmen später nochmal einschalten.";
			settings.stimmen = false;
			renderStimmen();
			stimmen.fehler = "";
			toast("Ohne Verbindung: keine Stimmen, du liest einfach weiter.");
			return Promise.resolve({
				ok: false,
				offline: true,
				error: "offline"
			});
		}
		stimmen.laden = true;
		stimmen.prozent = 0;
		stimmen.fehler = "";
		renderStimmen();
		setStimmenText("Stimmen werden geladen … (einmalig ca. " + stimmen.groesseMB + " MB)", "");
		setDownload({
			titel: "Stimmen werden geladen …",
			prozent: 0,
			detail: "Kokoro-Stimmen (Deutsch: Martin + Victoria) · ca. " + stimmen.groesseMB + " MB, einmalig",
			status: "laeuft"
		});
		var off = API.onStimmenProgress(function(p) {
			stimmen.prozent = p.prozent || 0;
			var mbDone = p.completed ? Math.round(p.completed / 1048576) : 0, mbAll = p.total ? Math.round(p.total / 1048576) : stimmen.groesseMB;
			renderStimmen();
			setStimmenText((p.status || "Lade …") + " · " + stimmen.prozent + " % (" + mbDone + " von " + mbAll + " MB)", "");
			var detail = mbDone + " von " + mbAll + " MB" + (p.status ? " · " + p.status : "");
			setDownload({
				titel: "Stimmen werden geladen …",
				prozent: stimmen.prozent,
				detail,
				status: "laeuft"
			});
			if (typeof onProgress === "function") try {
				onProgress({
					prozent: stimmen.prozent,
					detail
				});
			} catch (e) {}
		});
		return API.setupStimmen().then(function(r) {
			off();
			stimmen.laden = false;
			if (!r || !r.ok) {
				stimmen.fehler = "Stimmen laden fehlgeschlagen: " + (r && r.error || "unbekannt") + " · Du liest einfach weiter. Internet prüfen und nochmal einschalten.";
				if (!opts.nurProbe) {
					settings.stimmen = false;
					stimmenSpeichern();
				}
				renderStimmen();
				setDownload({
					titel: "Stimmen konnten nicht geladen werden",
					prozent: stimmen.prozent || 0,
					detail: (r && r.error || "unbekannt") + " · Lorevia liest einfach weiter.",
					status: "fehler"
				});
				return checkStimmen().then(function() {
					return {
						ok: false,
						error: r && r.error
					};
				});
			}
			statusUebernehmen(r);
			stimmen.ready = true;
			if (!opts.nurProbe) {
				settings.stimmen = true;
				stimmenSpeichern();
			} else settings.stimmen = vorher;
			stimmAllesRendern();
			setDownload({
				titel: "Stimmen sind bereit",
				prozent: 100,
				detail: (r.hinweis ? r.hinweis + " · " : "") + (opts.nurProbe ? "Hörprobe startet. Vorlesen in der Geschichte: Schalter „Stimmen“ beim Schreiben." : "Ab jetzt wird vorgelesen. Ausschalten: Schalter „Stimmen“ oben."),
				status: "fertig"
			});
			setTimeout(function() {
				var bn = document.getElementById("downloadBanner");
				if (bn && bn.classList.contains("fertig")) hideDownload();
			}, 4e3);
			return { ok: true };
		}, function(err) {
			off();
			stimmen.laden = false;
			if (!opts.nurProbe) settings.stimmen = false;
			renderStimmen();
			setDownload({
				titel: "Stimmen konnten nicht geladen werden",
				prozent: stimmen.prozent || 0,
				detail: String(err && err.message || err) + " · Lorevia liest einfach weiter.",
				status: "fehler"
			});
			return {
				ok: false,
				error: String(err && err.message || err)
			};
		});
	}
	function ladeEinzelStimme(id) {
		var v = stimmNach(id);
		if (!API || !API.stimmeLaden || !v) return Promise.resolve({
			ok: false,
			error: "Nur in der Lorevia-App"
		});
		if (stimmen.laden) return Promise.resolve({
			ok: false,
			laeuft: true,
			error: "Es lädt gerade schon etwas"
		});
		stimmen.laden = true;
		stimmen.prozent = 0;
		stimmen.fehler = "";
		stimmeLaedt[v.id] = true;
		renderStimmen();
		setDownload({
			titel: "Stimme " + v.name + " wird geladen …",
			prozent: 0,
			detail: "Für die Hörprobe, einmalig",
			status: "laeuft"
		});
		var off = API.onStimmenProgress ? API.onStimmenProgress(function(pr) {
			stimmen.prozent = pr.prozent || 0;
			var mbDone = pr.completed ? Math.round(pr.completed / 1048576) : 0, mbAll = pr.total ? Math.round(pr.total / 1048576) : 0;
			renderStimmen();
			setDownload({
				titel: "Stimme " + v.name + " wird geladen …",
				prozent: stimmen.prozent,
				detail: (mbAll ? mbDone + " von " + mbAll + " MB" : "") + (pr.status ? " · " + pr.status : ""),
				status: "laeuft"
			});
		}) : function() {};
		var fertig = function(r) {
			off();
			stimmen.laden = false;
			delete stimmeLaedt[v.id];
			if (r && r.ok) {
				statusUebernehmen(r);
				stimmAllesRendern();
				setDownload({
					titel: "Stimme " + v.name + " ist bereit",
					prozent: 100,
					detail: "Hörprobe startet.",
					status: "fertig"
				});
				setTimeout(function() {
					var bn = document.getElementById("downloadBanner");
					if (bn && bn.classList.contains("fertig")) hideDownload();
				}, 3e3);
				return { ok: true };
			}
			var err = r && r.error || "unbekannt";
			renderStimmen();
			setDownload({
				titel: "Stimme " + v.name + " konnte nicht geladen werden",
				prozent: stimmen.prozent || 0,
				detail: err + " · Internet prüfen und nochmal ▶ drücken.",
				status: "fehler"
			});
			return {
				ok: false,
				error: err
			};
		};
		var p = API.stimmeLaden(v.id).then(fertig, function(e) {
			return fertig({
				ok: false,
				error: String(e && e.message || e)
			});
		});
		stimmen.ladePromise = p;
		return p.then(function(r) {
			if (stimmen.ladePromise === p) stimmen.ladePromise = null;
			return r;
		});
	}
	var stimmeLaedt = {};
	function stimmeNachladen(id) {
		if (STIMMEN_AUS) return;
		var v = stimmNach(id);
		if (!API || !API.stimmeLaden || !v || v.ready || v.stub || stimmeLaedt[v.id] || stimmen.laden) return;
		if (navigator.onLine === false) {
			toast(v.name + " wird geladen, sobald Internet da ist. Bis dahin spricht eine Ersatz-Stimme.");
			return;
		}
		stimmeLaedt[v.id] = true;
		API.stimmeLaden(v.id).then(function(r) {
			delete stimmeLaedt[v.id];
			if (r && r.ok) {
				statusUebernehmen(r);
				stimmAllesRendern();
				toast(v.name + " ist geladen – Hörprobe jetzt möglich.");
			} else toast(v.name + " konnte nicht geladen werden" + (r && r.error ? ": " + r.error : "") + ". Bis dahin spricht eine Ersatz-Stimme.", 6e3);
		}, function() {
			delete stimmeLaedt[v.id];
		});
	}
	function stimmenUmschalten() {
		if (STIMMEN_AUS) return;
		if (stimmen.laden) return;
		if (stimmenAn()) {
			settings.stimmen = false;
			stimmenStopp();
			stimmenSpeichern();
			renderStimmen();
			return;
		}
		stimmen.fehler = "";
		if (!stimmen.ready) {
			ladeStimmen();
			return;
		}
		settings.stimmen = true;
		stimmenSpeichern();
		renderStimmen();
	}
	function stimmenStopp() {
		stimmen.gen++;
		stimmen.queue = [];
		if (stimmen.spielt) {
			try {
				stimmen.spielt.audio.pause();
			} catch (e) {}
			URL.revokeObjectURL(stimmen.spielt.url);
			stimmen.spielt = null;
		}
		markiereSprecher(null);
		renderStimmen();
	}
	function markiereSprecher(i) {
		var alt = storyEl.querySelector("p.spricht");
		if (alt) alt.classList.remove("spricht");
		if (i == null) return;
		var ps = storyEl.children;
		if (ps.length !== state.verlauf.length) return;
		var el = ps[i];
		if (el && el.tagName === "P") el.classList.add("spricht");
	}
	function synth(job) {
		if (!job.p) job.p = API.sprechenStimme ? API.sprechenStimme(job.text, job.voiceId) : API.sprechen(job.text, job.voiceId);
		return job.p;
	}
	function vorlesen(start) {
		if (!stimmenAn() || !API || !API.sprechen) return;
		var neu = sprechAuftraege2(state.verlauf, start, state.figuren, settings.stimmenModus, {
			bereit: stimmeBereit,
			erzaehlerId: erzaehlerStimme()
		});
		if (!neu.length) return;
		var wasEmpty = !stimmen.spielt && !stimmen.queue.length;
		stimmen.queue = stimmen.queue.concat(neu);
		if (wasEmpty) naechsterSatz(stimmen.gen);
		renderStimmen();
	}
	function naechsterSatz(gen) {
		if (gen !== stimmen.gen) return;
		var job = stimmen.queue.shift();
		if (!job) {
			stimmen.spielt = null;
			markiereSprecher(null);
			renderStimmen();
			return;
		}
		if (stimmen.queue[0]) synth(stimmen.queue[0]);
		synth(job).then(function(r) {
			if (gen !== stimmen.gen) return;
			if (!r || !r.ok || !r.wav) {
				if (r && r.error) {
					stimmen.fehler = "Vorlesen klappt gerade nicht: " + r.error + " · Du liest einfach weiter.";
					renderStimmen();
					stimmen.fehler = "";
				}
				naechsterSatz(gen);
				return;
			}
			var url = URL.createObjectURL(new Blob([r.wav], { type: "audio/wav" }));
			var audio = new Audio(url);
			stimmen.spielt = {
				audio,
				url
			};
			markiereSprecher(job.index);
			renderStimmen();
			var weiterSo = function() {
				URL.revokeObjectURL(url);
				if (gen === stimmen.gen) {
					stimmen.spielt = null;
					naechsterSatz(gen);
				}
			};
			audio.onended = weiterSo;
			audio.onerror = weiterSo;
			audio.play().catch(weiterSo);
		}, function() {
			naechsterSatz(gen);
		});
	}
	document.getElementById("stimmenSchalter").addEventListener("click", stimmenUmschalten);
	document.getElementById("stimmenLeiste").addEventListener("change", function(e) {
		if (e.target.checked === stimmenAn()) return;
		if (stimmen.laden) {
			renderStimmen();
			return;
		}
		stimmenUmschalten();
		renderStimmen();
	});
	document.getElementById("stimmenStopp").addEventListener("click", stimmenStopp);
	document.getElementById("stimmenModus").addEventListener("change", function(e) {
		settings.stimmenModus = e.target.value;
		stimmenSpeichern();
	});
	window.addEventListener("online", function() {
		stimmStatus.online = true;
		checkStimmen();
	});
	window.addEventListener("offline", function() {
		stimmStatus.online = false;
		stimmAllesRendern();
	});
	var probeAudio = null, probeLaeuft = null;
	function probeStopp() {
		if (probeAudio) {
			try {
				probeAudio.a.pause();
			} catch (e) {}
			URL.revokeObjectURL(probeAudio.url);
			var f = probeAudio.fertig;
			probeAudio = null;
			if (f) f();
		}
	}
	function demoTon() {
		try {
			var C = window.AudioContext || window.webkitAudioContext;
			if (!C) return;
			var ctx = new C(), o = ctx.createOscillator(), g = ctx.createGain();
			o.type = "sine";
			o.frequency.value = 660;
			g.gain.setValueAtTime(1e-4, ctx.currentTime);
			g.gain.exponentialRampToValueAtTime(.12, ctx.currentTime + .03);
			g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + .35);
			o.connect(g);
			g.connect(ctx.destination);
			o.start();
			o.stop(ctx.currentTime + .4);
			setTimeout(function() {
				try {
					ctx.close();
				} catch (e) {}
			}, 600);
		} catch (e) {}
	}
	function previewVoice(voiceId) {
		if (STIMMEN_AUS) return Promise.resolve({
			ok: false,
			error: "Vorlese-Stimmen sind vorerst ausgeschaltet."
		});
		var v = stimmNach(voiceId);
		if (!v) return Promise.resolve({
			ok: false,
			error: "Unbekannte Stimme"
		});
		if (v.stub) return Promise.resolve({
			ok: false,
			error: "Eigene Stimme (XTTS) kommt in einem späteren Update."
		});
		if (!v.ready) return Promise.resolve({
			ok: false,
			error: v.name + " ist noch nicht geladen.",
			needsDownload: true
		});
		if (!API || !API.stimmeProbe) return new Promise(function(r) {
			demoTon();
			setTimeout(function() {
				r({
					ok: true,
					demo: true
				});
			}, 900);
		});
		probeStopp();
		return API.stimmeProbe(v.id).then(function(r) {
			if (!r || !r.ok || !r.wav) return {
				ok: false,
				error: r && r.error || "Hörprobe nicht möglich"
			};
			return new Promise(function(resolve) {
				var url = URL.createObjectURL(new Blob([r.wav], { type: "audio/wav" })), a = new Audio(url);
				var ende = function(ok) {
					return function() {
						if (probeAudio && probeAudio.a === a) {
							URL.revokeObjectURL(url);
							probeAudio = null;
						}
						resolve(ok ? { ok: true } : {
							ok: false,
							error: "Abspielen fehlgeschlagen"
						});
					};
				};
				probeAudio = {
					a,
					url,
					fertig: ende(true)
				};
				a.onended = ende(true);
				a.onerror = ende(false);
				a.play().catch(ende(false));
			});
		}, function(e) {
			return {
				ok: false,
				error: String(e && e.message || e)
			};
		});
	}
	function probeMarkieren(id) {
		probeLaeuft = id;
		document.querySelectorAll("[data-probe]").forEach(function(b) {
			b.classList.toggle("spielt", !!id && b.dataset.probe === id);
		});
	}
	function hoerprobe(id) {
		if (STIMMEN_AUS) return;
		var v = stimmNach(id);
		if (!v) return;
		if (v.stub) {
			toast("Eigene Stimme aus einer Hörprobe (XTTS) kommt in einem späteren Update.");
			return;
		}
		if (!v.ready && API) {
			hoerprobeLaden(id);
			return;
		}
		if (probeLaeuft === id) {
			probeStopp();
			probeMarkieren(null);
			return;
		}
		probeMarkieren(id);
		if (!API) toast("Hörprobe: " + v.name + " – Demo, in der App hörst du die echte Stimme.");
		previewVoice(id).then(function(r) {
			if (r && r.ok === false) toast("Hörprobe von " + v.name + " gerade nicht möglich" + (r.error ? ": " + r.error : "") + ".");
		}).then(function() {
			if (probeLaeuft === id) probeMarkieren(null);
		});
	}
	var probeWartet = null;
	function hoerprobeLaden(id) {
		if (STIMMEN_AUS) return;
		if (probeWartet === id) {
			toast("Lädt schon – die Hörprobe startet gleich von selbst.");
			return;
		}
		probeWartet = id;
		probeMarkieren(id);
		hoerprobeMitLaden(id, {
			stimme: stimmNach,
			online: function() {
				return navigator.onLine !== false;
			},
			laufend: function() {
				return stimmen.ladePromise || null;
			},
			groesseMB: function(plan) {
				return plan === "paket" ? stimmen.groesseMB : 0;
			},
			ladePaket: function() {
				return ladeStimmen(null, { nurProbe: true });
			},
			ladeEinzeln: ladeEinzelStimme,
			aktualisieren: checkStimmen,
			abspielen: function(vid) {
				if (probeWartet !== id) return Promise.resolve({
					ok: true,
					abgebrochen: true
				});
				probeMarkieren(vid);
				return previewVoice(vid);
			},
			melde: function(t) {
				toast(t, 6e3);
			}
		}).then(function(r) {
			var v = stimmNach(id);
			if (r && r.ok === false && !r.gemeldet && !r.abgebrochen) toast("Hörprobe von " + (v ? v.name : "der Stimme") + " gerade nicht möglich" + (r.error ? ": " + r.error : "") + ".");
		}).then(function() {
			if (probeWartet === id) probeWartet = null;
			if (probeLaeuft === id) probeMarkieren(null);
		});
	}
	function idsAuffuellen() {
		var neu = false;
		(state.figuren || []).forEach(function(x) {
			if (x && typeof x === "object" && !x.id) {
				x.id = neueFigurId();
				neu = true;
			}
		});
		return neu;
	}
	function figurNachId(id) {
		return (state.figuren || []).filter(function(f) {
			return f && f.id === id;
		})[0] || null;
	}
	function figurStimmeSetzen(figurId, voiceId) {
		voiceId = voiceId ? poolId(voiceId) || null : null;
		if (voiceId && !stimmNach(voiceId)) return {
			ok: false,
			error: "Unbekannte Stimme"
		};
		if (figurId === "erzaehler") {
			state.erzaehlerStimme = voiceId;
			save();
		} else {
			var x = figurNachId(figurId);
			if (!x) return {
				ok: false,
				error: "Unbekannte Figur"
			};
			x.voiceId = voiceId;
			x.voiceName = voiceId ? stimmName(voiceId) : null;
			save();
		}
		if (voiceId && !stimmeBereit(voiceId) && settings.stimmen) stimmeNachladen(voiceId);
		return { ok: true };
	}
	function nutzerVon(voiceId, ausserId) {
		return figurenFuerStimmen().filter(function(x) {
			return x.voiceId === voiceId && x.id !== ausserId;
		}).map(function(x) {
			return x.name;
		});
	}
	function stimmeFormSetzen(id) {
		if (!form.voiceId) return;
		form.voiceId.value = id || "";
		renderStimmKarten();
	}
	function renderStimmKarten() {
		var box = document.getElementById("stimmKarten");
		if (!box) return;
		var gew = form.voiceId.value || "", eigeneId = bearbeite >= 0 && state.figuren[bearbeite] ? state.figuren[bearbeite].id : null;
		var liste = stimmListe.filter(function(v) {
			return stimmFilter === "alle" || stimmGeschlecht(v) === stimmFilter;
		});
		liste.sort(function(a, b) {
			return (a.engine === "piper") - (b.engine === "piper") || (a.engine === "xtts") - (b.engine === "xtts");
		});
		box.innerHTML = "<button type=\"button\" class=\"stimm-karte auto" + (gew === "" ? " an" : "") + "\" role=\"radio\" aria-checked=\"" + (gew === "") + "\" data-stimme=\"\"><span class=\"stimm-ikon\" aria-hidden=\"true\">✦</span><span class=\"stimm-text\"><span class=\"stimm-name\">Automatisch</span><span class=\"stimm-art\">passend zur Beschreibung</span></span></button>" + liste.map(function(v) {
			var an = v.id === gew, g = stimmGeschlecht(v), andere = nutzerVon(v.id, eigeneId);
			return "<div class=\"stimm-karte" + (an ? " an" : "") + (v.engine === "piper" ? " fallback" : "") + (v.ready ? "" : " fehlt") + "\" role=\"radio\" tabindex=\"0\" aria-checked=\"" + an + "\" data-stimme=\"" + esc(v.id) + "\"><span class=\"stimm-ikon " + g + "\" aria-hidden=\"true\">" + esc(v.name.charAt(0)) + "</span><span class=\"stimm-text\"><span class=\"stimm-name\">" + esc(v.name) + "</span><span class=\"stimm-art\">" + esc(stimmArt(v)) + "</span><span class=\"stimm-tags\"><span class=\"stimm-engine " + esc(v.engine) + "\">" + esc(v.engine === "piper" ? "Piper · Ersatz" : ENGINE_NAME[v.engine] || v.engine) + "</span>" + (v.stub ? "<span class=\"stimm-fehlt\">kommt später</span>" : v.ready ? "" : "<span class=\"stimm-fehlt\">noch nicht geladen</span>") + (andere.length ? "<span class=\"stimm-auch\" title=\"Doppelt ist erlaubt\">auch: " + esc(andere.join(", ")) + "</span>" : "") + "</span></span><button type=\"button\" class=\"stimm-probe\" data-probe=\"" + esc(v.id) + "\" title=\"Hörprobe\" aria-label=\"Hörprobe " + esc(v.name) + "\"><svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path d=\"M8 5v14l11-7z\" fill=\"currentColor\"/></svg></button></div>";
		}).join("");
		var z = document.getElementById("stimmZahl"), nErs = stimmListe.filter(function(v) {
			return v.engine === "piper";
		}).length, nStub = stimmListe.filter(function(v) {
			return v.stub;
		}).length;
		if (z) z.textContent = stimmListe.length - nErs - nStub + " Stimmen" + (nErs ? " + " + nErs + " Ersatz" : "");
	}
	document.getElementById("stimmKarten").addEventListener("click", function(e) {
		var p = e.target.closest("[data-probe]");
		if (p) {
			e.stopPropagation();
			hoerprobe(p.dataset.probe);
			return;
		}
		var k = e.target.closest("[data-stimme]");
		if (!k) return;
		form.voiceId.value = k.dataset.stimme;
		renderStimmKarten();
	});
	document.getElementById("stimmKarten").addEventListener("keydown", function(e) {
		var k = e.target.closest("[data-stimme]");
		if (k && (e.key === "Enter" || e.key === " ") && !e.target.closest("[data-probe]")) {
			e.preventDefault();
			k.click();
		}
	});
	document.getElementById("stimmFilter").addEventListener("click", function(e) {
		var b = e.target.closest("[data-filter]");
		if (!b) return;
		stimmFilter = b.dataset.filter;
		Array.prototype.forEach.call(this.children, function(c) {
			c.classList.toggle("an", c === b);
		});
		renderStimmKarten();
	});
	function figurenFuerStimmen() {
		return [{
			id: ERZAEHLER_ID,
			name: "Erzähler",
			color: "#8a7a5a",
			role: "erzählt die Szene",
			voiceId: erzaehlerStimme(),
			erzaehler: true
		}].concat((state.figuren || []).filter(Boolean).map(function(x) {
			return {
				id: x.id,
				name: x.name,
				color: x.color,
				isPlayer: !!x.mein,
				role: x.rolle || "Hauptfigur",
				voiceId: x.voiceId || null
			};
		}));
	}
	function stimmOptionen(gew, erz) {
		return "<option value=\"\"" + (gew ? "" : " selected") + ">" + (erz ? "Automatisch (" + esc(stimmName(STANDARD_ERZAEHLER)) + ")" : "Automatisch") + "</option>" + [
			["kokoro", "Kokoro · natürlich"],
			["xtts", "XTTS · eigene Stimme (kommt später)"],
			["piper", "Piper · nur Ersatz"]
		].map(function(g) {
			var l = stimmListe.filter(function(v) {
				return v.engine === g[0];
			});
			if (!l.length) return "";
			return "<optgroup label=\"" + g[1] + "\">" + l.map(function(v) {
				return "<option value=\"" + esc(v.id) + "\"" + (v.id === gew ? " selected" : "") + (v.stub ? " disabled" : "") + ">" + esc(v.name + " – " + stimmArt(v) + (v.stub ? "" : v.ready ? "" : " (lädt später)")) + "</option>";
			}).join("") + "</optgroup>";
		}).join("");
	}
	function zuordnungHTML() {
		return figurenFuerStimmen().map(function(x) {
			var c = hexOk(x.color) ? x.color : FARBE_DU;
			return "<div class=\"stimm-zeile" + (x.isPlayer ? " mein" : "") + "\"><span class=\"stimm-figur\"><span class=\"farb-swatch\" style=\"background:" + esc(c) + "\"></span><span class=\"stimm-figur-name\">" + esc(x.name) + "</span><span class=\"stimm-figur-rolle\">" + esc(x.isPlayer ? "dein Char (wird nicht vorgelesen)" : x.role) + "</span></span><span class=\"stimm-select-wrap\"><select data-figur=\"" + esc(x.id) + "\" aria-label=\"Stimme für " + esc(x.name) + "\">" + stimmOptionen(x.voiceId, x.erzaehler) + "</select><button type=\"button\" class=\"stimm-probe\" data-probe-figur=\"" + esc(x.id) + "\" title=\"Hörprobe\" aria-label=\"Hörprobe für " + esc(x.name) + "\"><svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path d=\"M8 5v14l11-7z\" fill=\"currentColor\"/></svg></button></span></div>";
		}).join("") + (state.figuren.length ? "" : "<p class=\"stimm-demo-notiz\">Noch keine Figuren · leg Figuren an, dann stehen sie hier.</p>") + probeLeisteHTML();
	}
	function probeLeisteHTML() {
		return "<div class=\"stimm-probeleiste\"><span class=\"stimm-probe-titel\">Erst reinhören:</span>" + stimmListe.filter(function(v) {
			return !v.stub;
		}).map(function(v) {
			return "<button type=\"button\" class=\"stimm-probe-chip" + (v.engine === "piper" ? " fallback" : "") + (v.ready ? "" : " fehlt") + "\" data-probe=\"" + esc(v.id) + "\" title=\"" + esc(stimmArt(v) + (v.ready ? "" : " · noch nicht geladen")) + "\"><svg viewBox=\"0 0 24 24\" width=\"11\" height=\"11\" aria-hidden=\"true\"><path d=\"M8 5v14l11-7z\" fill=\"currentColor\"/></svg>" + esc(v.name) + "</button>";
		}).join("") + "</div>";
	}
	function renderStimmZuordnungen() {
		["zsStimmen", "stimmPopListe"].forEach(function(id) {
			var el = document.getElementById(id);
			if (el) el.innerHTML = zuordnungHTML();
		});
		var figs = figurenFuerStimmen(), n = figs.filter(function(x) {
			return x.voiceId;
		}).length;
		var z = document.getElementById("zsStimmZahl");
		if (z) z.textContent = n + " / " + figs.length + " gewählt";
	}
	function zuordnungAendern(e) {
		var sel = e.target.closest("select[data-figur]");
		if (!sel) return;
		var id = sel.dataset.figur, v = sel.value || null;
		if (!figurStimmeSetzen(id, v).ok) {
			toast("Stimme konnte nicht gespeichert werden.");
			return;
		}
		var x = id === "erzaehler" ? { name: "Erzähler" } : figurNachId(id);
		toast((x ? x.name : "Figur") + ": " + (v ? stimmName(v) + (stimmeBereit(v) ? "" : " (bis sie geladen ist, spricht eine Ersatz-Stimme)") : "automatisch"));
		stimmAllesRendern();
		renderFiguren();
	}
	function zuordnungKlick(e) {
		var q = e.target.closest("[data-probe]");
		if (q) {
			e.stopPropagation();
			hoerprobe(q.dataset.probe);
			return;
		}
		var p = e.target.closest("[data-probe-figur]");
		if (!p) return;
		e.stopPropagation();
		var x = figurenFuerStimmen().filter(function(f) {
			return f.id === p.dataset.probeFigur;
		})[0];
		if (x && x.voiceId) hoerprobe(x.voiceId);
		else if (x && x.erzaehler) hoerprobe(STANDARD_ERZAEHLER);
		else toast("Automatisch: die Stimme wird nach der Beschreibung gewählt.");
	}
	["zsStimmen", "stimmPopListe"].forEach(function(id) {
		var el = document.getElementById(id);
		if (!el) return;
		el.addEventListener("change", zuordnungAendern);
		el.addEventListener("click", zuordnungKlick);
	});
	var stimmZuBtn = document.getElementById("stimmZuBtn"), stimmPop = document.getElementById("stimmPop");
	function stimmPopZeigen(an) {
		stimmPop.hidden = !an;
		stimmZuBtn.setAttribute("aria-expanded", String(an));
		if (an) {
			renderStimmZuordnungen();
			var hp = document.getElementById("hgPop");
			if (hp && !hp.hidden) {
				hp.hidden = true;
				document.getElementById("hgBtn").setAttribute("aria-expanded", "false");
			}
		}
	}
	stimmZuBtn.addEventListener("click", function(e) {
		e.stopPropagation();
		stimmPopZeigen(stimmPop.hidden);
	});
	stimmPop.addEventListener("click", function(e) {
		e.stopPropagation();
	});
	document.addEventListener("click", function() {
		if (!stimmPop.hidden) stimmPopZeigen(false);
	});
	document.addEventListener("keydown", function(e) {
		if (e.key === "Escape" && !stimmPop.hidden) stimmPopZeigen(false);
	});
	function stimmAllesRendern() {
		renderStimmen();
		if (!document.getElementById("stimmenBox")) statusAnwenden();
		renderStimmKarten();
		renderStimmZuordnungen();
		if (isActive("schreiben")) renderSide();
	}
	function stimmenListeLaden() {
		if (!API || !API.stimmenListe) return Promise.resolve(stimmListe);
		return API.stimmenListe().then(function(l) {
			if (Array.isArray(l) && l.length) stimmListe = l;
			return stimmListe;
		}, function() {
			return stimmListe;
		});
	}
	function setDownload(o) {
		o = o || {};
		var bn = document.getElementById("downloadBanner");
		if (!bn) return;
		var pz = Math.max(0, Math.min(100, Math.round(+o.prozent || 0)));
		bn.hidden = false;
		bn.classList.toggle("fertig", o.status === "fertig");
		bn.classList.toggle("fehler", o.status === "fehler");
		document.getElementById("dlTitel").textContent = o.titel || "Wird geladen …";
		document.getElementById("dlProzent").textContent = pz + " %";
		var bal = document.getElementById("dlBalken");
		bal.setAttribute("aria-valuenow", pz);
		bal.querySelector("i").style.width = pz + "%";
		document.getElementById("dlDetail").textContent = o.detail || "";
	}
	function hideDownload() {
		var bn = document.getElementById("downloadBanner");
		if (bn) bn.hidden = true;
	}
	document.getElementById("dlZu").addEventListener("click", hideDownload);
	function schreibHg() {
		return hexOk(settings.schreibHg) ? settings.schreibHg.toLowerCase() : HG_STANDARD;
	}
	function hgAnwenden() {
		var bg = schreibHg(), root = document.documentElement.style;
		root.setProperty("--story-bg", bg);
		if (hgDunkel(bg)) root.setProperty("--story-text", "#f3efe6");
		else root.removeProperty("--story-text");
		var pr = document.getElementById("hgPresets");
		if (pr) pr.innerHTML = HG_PRESETS.map(function(h) {
			return "<button type=\"button\" class=\"hg-preset" + (h.farbe === bg ? " an" : "") + "\" data-hg=\"" + h.farbe + "\" title=\"" + esc(h.name) + "\"><i style=\"background:" + h.farbe + "\"></i>" + esc(h.name) + "</button>";
		}).join("");
		var eig = document.getElementById("hgEigen");
		if (eig) eig.value = bg;
		if (storyEl) renderStory();
		renderLegende();
	}
	function hgSetzen(farbe) {
		var alt = settings.schreibHg;
		window.LoreviaBridge.setWriteBg(farbe).then(function(r) {
			if (!r || !r.ok) {
				settings.schreibHg = alt;
				toast("Hintergrund konnte nicht gespeichert werden.", 4e3);
			}
			hgAnwenden();
		});
		hgAnwenden();
	}
	document.getElementById("hgBtn").addEventListener("click", function(e) {
		e.stopPropagation();
		var pop = document.getElementById("hgPop");
		pop.hidden = !pop.hidden;
		this.setAttribute("aria-expanded", pop.hidden ? "false" : "true");
	});
	document.getElementById("hgPresets").addEventListener("click", function(e) {
		var b = e.target.closest("[data-hg]");
		if (b) hgSetzen(b.dataset.hg);
	});
	document.getElementById("hgEigen").addEventListener("change", function(e) {
		hgSetzen(e.target.value);
	});
	document.addEventListener("click", function(e) {
		var pop = document.getElementById("hgPop");
		if (pop && !pop.hidden && !e.target.closest("#hgPop") && !e.target.closest("#hgBtn")) {
			pop.hidden = true;
			document.getElementById("hgBtn").setAttribute("aria-expanded", "false");
		}
	});
	document.addEventListener("keydown", function(e) {
		if (e.key === "Escape") {
			var pop = document.getElementById("hgPop");
			if (pop && !pop.hidden) pop.hidden = true;
		}
	});
	function farbeVon(who) {
		var c = sprecherFarbe(who, state.figuren);
		return c ? lesbar(c, schreibHg()) : "";
	}
	function swatch(c) {
		return hexOk(c) ? "<span class=\"farb-swatch\" style=\"background:" + c + "\"></span>" : "";
	}
	function kiNamen() {
		return state.figuren.filter(function(x) {
			return !x.mein;
		}).map(function(x) {
			return x.name;
		});
	}
	function sprecherVon(b, i) {
		if (!b || b.type !== "speech") return null;
		if (b.who === "du" || b.from === "eingabe") return "du";
		if (b.who) return b.who;
		return i >= 0 ? sprecherRaten(state.verlauf, i, kiNamen()) : null;
	}
	function renderLegende() {
		var el = document.getElementById("dialogLegende");
		if (!el) return;
		el.innerHTML = state.figuren.length ? state.figuren.map(function(x) {
			return "<span>" + swatch(x.color || (x.mein ? "#1a1a1a" : "")) + esc(x.name) + (x.mein ? " (du)" : "") + "</span>";
		}).join("") : "";
	}
	var update = null;
	function checkUpdate() {
		if (!API || !API.checkUpdate) return;
		API.checkUpdate().then(function(u) {
			update = u && u.available ? u : null;
			zeigeUpdateBox();
			renderUpdateBtn();
		});
	}
	function zeigeUpdateBox() {
		var box = document.getElementById("updateBox");
		if (!update) {
			box.hidden = true;
			return;
		}
		document.getElementById("updateText").textContent = "Neue Version " + update.version + " ist da (du hast " + update.current + "). " + (update.notes || "") + " Deine Geschichten bleiben erhalten.";
		box.hidden = false;
	}
	function installUpdate() {
		if (!update) return;
		if (!confirm("Lorevia " + update.version + " jetzt installieren? Lorevia schließt sich kurz und startet danach neu. Deine Geschichten bleiben erhalten.")) return;
		flushSave();
		var btn = document.getElementById("updateInstall"), txt = document.getElementById("updateText");
		btn.disabled = true;
		var ub = document.getElementById("updateBtn");
		ub.disabled = true;
		setUpdateBanner({
			phase: "holen",
			status: "Hole neue Version …",
			prozent: 0,
			detail: "Prüfe den Installer-Ordner …"
		});
		var off = API.onUpdateProgress(function(p) {
			txt.textContent = p.status || "Update …";
			setUpdateBanner(p);
		});
		function fertig(r) {
			try {
				off();
			} catch (e) {}
			if (r && r.ok) return;
			btn.disabled = false;
			ub.disabled = false;
			ub.classList.remove("sucht");
			renderUpdateBtn();
			var msg = "Update fehlgeschlagen: " + (r && r.error || "unbekannt");
			txt.textContent = msg;
			zeigeUpdateBoxFehler();
			setUpdateBanner({
				phase: "fehler",
				status: "Update hat nicht geklappt",
				prozent: 100,
				detail: r && r.error || "unbekannt"
			});
			toast(msg, 1e4);
		}
		API.installUpdate().then(fertig, function(e) {
			fertig({
				ok: false,
				error: String(e && e.message || e)
			});
		});
	}
	function zeigeUpdateBoxFehler() {
		var box = document.getElementById("updateBox");
		if (box) box.hidden = false;
	}
	function setUpdateBanner(p) {
		p = p || {};
		var bn = document.getElementById("updateBanner");
		if (!bn) return;
		var pz = Math.max(0, Math.min(100, Math.round(+p.prozent || 0)));
		bn.hidden = false;
		bn.classList.toggle("fehler", p.phase === "fehler");
		bn.classList.toggle("fertig", p.phase === "installieren");
		document.getElementById("updTitel").textContent = p.status || "Update …";
		document.getElementById("updProzent").textContent = p.phase === "fehler" ? "" : pz + " %";
		var bal = document.getElementById("updBalken");
		bal.setAttribute("aria-valuenow", pz);
		bal.querySelector("i").style.width = pz + "%";
		document.getElementById("updDetail").textContent = p.detail || "\xA0";
		var reihe = [
			"holen",
			"pruefen",
			"installieren"
		], i = reihe.indexOf(p.phase);
		document.querySelectorAll("#updSchritte [data-phase]").forEach(function(s) {
			var j = reihe.indexOf(s.dataset.phase);
			s.classList.toggle("aktiv", j === i);
			s.classList.toggle("erledigt", i >= 0 && j < i);
		});
		document.getElementById("updZu").hidden = p.phase !== "fehler";
	}
	document.getElementById("updZu").addEventListener("click", function() {
		document.getElementById("updateBanner").hidden = true;
	});
	var START_SPLASH_MS = 2300, STORY_SPLASH_MS = 1800, FADE_MS = 600;
	var splashEl = document.getElementById("coverSplash");
	var splashTimer = null, splashDone = [];
	function splashVisible() {
		return splashEl.classList.contains("visible");
	}
	function showSplash(ms, text, done) {
		if (done) splashDone.push(done);
		if (splashVisible()) return;
		document.getElementById("coverSplashText").textContent = text || "";
		splashEl.classList.remove("fading");
		splashEl.classList.add("visible");
		splashEl.setAttribute("aria-hidden", "false");
		clearTimeout(splashTimer);
		splashTimer = setTimeout(hideSplash, ms);
	}
	function hideSplash() {
		if (!splashVisible() || splashEl.classList.contains("fading")) return;
		clearTimeout(splashTimer);
		splashEl.classList.add("fading");
		setTimeout(function() {
			splashEl.classList.remove("visible", "fading");
			splashEl.setAttribute("aria-hidden", "true");
			var cbs = splashDone;
			splashDone = [];
			cbs.forEach(function(f) {
				try {
					f();
				} catch (e) {}
			});
		}, FADE_MS);
	}
	splashEl.addEventListener("click", hideSplash);
	document.addEventListener("keydown", function(e) {
		if (splashVisible()) {
			e.preventDefault();
			hideSplash();
		}
	}, true);
	function loadStory(verlauf) {
		if (Array.isArray(verlauf)) {
			state.verlauf = verlauf.slice();
			save();
		}
		if (isActive("schreiben")) {
			stopIdle();
			showSplash(STORY_SPLASH_MS, "Deine Geschichte wird geladen …", function() {
				renderStory();
				maybeStart();
				resetIdle();
				document.getElementById("eingabe").focus();
			});
		} else go("schreiben");
	}
	window.LoreviaUI = Object.assign(window.LoreviaUI || {}, {
		loadStory,
		showSplash,
		hideSplash
	});
	function lvRenderEntry() {
 var quality=document.getElementById("lvQualityCheck");if(quality)quality.checked=settings.qualitaetPruefen===true;
  var banner = document.getElementById('spielerEinstieg');
  if (banner) banner.hidden = state.spielerAbwesend !== true;
  var option = document.getElementById('spielerSpaeter');
  if (option) { option.checked = state.spielerAbwesend === true; option.disabled = istGestartet(state); }
  var known = document.getElementById('lvIntroKnown');
  if (known) known.textContent = state.welt && state.welt.rohtext ? 'Deine Weltbeschreibung wird auch beim Intro berücksichtigt. Du musst sie hier nicht wiederholen.' : '';
  var model = document.getElementById('lvModell');
  if (model && ['qwen3.5:2b','qwen3.5:4b','qwen3.5:9b','qwen3.5:35b-a3b'].includes(settings.model)) model.value = settings.model;
}
document.getElementById('lvQualityCheck').addEventListener('change',function(){settings.qualitaetPruefen=this.checked;if(API)API.saveSettings(settings).catch(e=>toast(e.message));});
document.getElementById('lvModell').addEventListener('change',function(){
  settings.model = this.value; ki.ready=false;
  if(API) API.saveSettings(settings).then(checkKI).catch(function(e){toast('Modell konnte nicht gespeichert werden: '+e.message);});
  else checkKI();
});
document.getElementById('spielerSpaeter').addEventListener('change', function() {
  state.spielerAbwesend = this.checked; save(); lvRenderEntry();
});
document.getElementById('spielerJetzt').addEventListener('click', function() {
  if (busy || !ki.ready) { toast('Bitte warten, bis die KI bereit ist.'); return; }
  if (eingabe.value.trim()) { toast('Deine Eingabe bleibt erhalten. Sende sie, um deine Figur auftreten zu lassen.'); eingabe.focus(); return; }
  eingabe.value = 'Ich komme zur Szene hinzu.'; senden();
});
async function lvAskSetup(scope, id, button) {
  var status = document.getElementById(scope === 'welt' ? 'lvWeltStatus' : scope === 'intro' ? 'lvSetupStatus' : 'lvFragenStatus');
  if (!API || !API.resolveSetup) { status.textContent = 'Diese Funktion benötigt die lokale KI in der Lorevia-App.'; return; }
  if (button.disabled) return;
  var snapshot = JSON.stringify({ intro:state.intro,welt:weltExport(W()),figuren:state.figuren,fragen:state.fragen });
  var currentStory = settings.currentStory;
  var selected = scope === 'frage' ? FRAGEN.find(function(f){return f.id === id;}) : null;
  button.disabled = true; status.textContent = 'Die KI arbeitet …';
  try {
    var result = await API.resolveSetup(JSON.parse(snapshot), scope, selected ? selected.q : '', settings.model);
    if (!result || !result.ok) throw new Error(result && result.error || 'Keine Antwort von der KI.');
    // Nie nach einem Geschichtenwechsel oder zwischenzeitlicher Bearbeitung Daten überschreiben.
    if (settings.currentStory !== currentStory || JSON.stringify({intro:state.intro,welt:weltExport(W()),figuren:state.figuren,fragen:state.fragen}) !== snapshot) {
      status.textContent = 'Deine Angaben haben sich geändert. Bitte erneut anfordern; deine Eingaben bleiben erhalten.'; return;
    }
    if (scope === 'intro') {
      state.intro = [state.intro, result.introErgaenzung].filter(Boolean).join('\n\n');
      intro.value = state.intro; countIntro();
    } else if (scope === 'welt') {
      W().arten = [...new Set(W().arten.concat(result.arten || []))]; renderWeltArten();
    } else if (scope === 'frage') {
      var previous = state.fragen[id] && state.fragen[id].antwort || '';
      state.fragen[id] = { antwort: [previous, result.antwort].filter(Boolean).join('\n'), ok: true }; renderFragen();
    } else {
      var count = 0;
      Object.keys(result.antworten || {}).forEach(function(key) {
        if (String(state.fragen[key] && state.fragen[key].antwort || '').trim()) return;
        state.fragen[key] = {antwort:result.antworten[key],ok:true}; count++;
      });
      renderFragen(); status.textContent = count ? count + ' Antworten aus Welt und Intro übernommen.' : 'Keine weiteren eindeutigen Antworten gefunden. Bestehende Antworten bleiben erhalten.';
    }
    save(); lvRenderEntry();
    if (scope !== 'uebernehmen') status.textContent = 'Übernommen. Du kannst den Text jederzeit bearbeiten.';
  } catch(error) { status.textContent = error.message || String(error); }
  finally { button.disabled = false; }
}
document.getElementById('introKI').addEventListener('click',function(){lvAskSetup('intro','',this);});
document.getElementById('weltKI').addEventListener('click',function(){lvAskSetup('welt','',this);});
document.getElementById('fragenUebernehmen').addEventListener('click',function(){lvAskSetup('uebernehmen','',this);});

var ORDER = [
		"start",
		"intro",
		"figuren",
		"welt",
		"fragen",
		"uebersicht",
		"schreiben"
	];
	function isActive(id) {
		return document.getElementById(id).classList.contains("active");
	}
	function go(id) {
		if (id === 'intro') { document.getElementById('spielerSpaeter').checked = state.spielerAbwesend === true; }
  lvRenderEntry();
  if(id === 'fragen') renderFragen();
  var wasWriting = isActive("schreiben");
		document.querySelectorAll(".screen").forEach(function(s) {
			s.classList.toggle("active", s.id === id);
		});
		state.besucht[id] = true;
		save();
		var idx = ORDER.indexOf(id);
		document.querySelectorAll(".step").forEach(function(b) {
			var i = ORDER.indexOf(b.dataset.go);
			b.classList.toggle("current", i === idx);
			b.classList.toggle("done", i < idx && i > 0);
		});
		var navId = id === "welt" || id === "intro" || id === "fragen" || id === "uebersicht" ? "figuren" : id;
		document.querySelectorAll(".sb-item[data-nav]").forEach(function(b) {
			b.classList.toggle("active", b.dataset.nav === navId);
		});
		document.body.classList.toggle("ohne-flow", id === "start" || id === "geschichten");
		if (id === "geschichten") renderGeschichten();
		if (id === "uebersicht") renderUebersicht();
		if (id === "welt") renderWelt();
		document.querySelector("main").scrollTop = 0;
		if (id === "schreiben") {
			renderSide();
			renderStory();
			stopIdle();
			var startWriting = function() {
				if (!isActive("schreiben")) return;
				maybeStart();
				resetIdle();
				document.getElementById("eingabe").focus();
			};
			if (wasWriting) startWriting();
			else showSplash(STORY_SPLASH_MS, "Deine Geschichte wird geladen …", startWriting);
		} else stopIdle();
	}
	document.addEventListener("click", function(e) {
		var t = e.target.closest("[data-go]");
		if (t) {
			e.preventDefault();
			if (isActive("figuren") && t.dataset.go === "intro" && zaehleFiguren(state.figuren).mein !== 1) {
				toast("Bitte zuerst deinen Char festlegen: „Das ist mein Char“ ankreuzen oder in der Bibliothek „Als mein Char“ wählen.", 7e3);
				return;
			}
			go(t.dataset.go);
		}
	});
	LVInitContinuation({get:()=>state.speicher?.fortsetzung,set:function(value){state.speicher=state.speicher||leererSpeicher();state.speicher.fortsetzung=value;if(value.datum)state.speicher.szene.datum=value.datum;state.wartetAufSpieler=true;save();resetIdle();}});
 var form = document.getElementById("figurForm");
	var bearbeite = -1, auswahl = {
		hobbys: [],
		zuege: []
	};
	var bezugAuswahl = [], kiAuswahl = [];
	var FELD = {
		name: "name",
		role: "rolle",
		age: "alter",
		height: "groesse",
		job: "beruf",
		housing: "wohnsituation",
		family: "eltern",
		appearance: "aussehen",
		personality: "persoenlichkeit",
		voiceDesc: "stimme",
		bio: "kurzBio",
		notes: "notizen",
		relationships: "beziehungen",
		memories: "erinnerungen"
	};
	function chipsHTML(liste, gewaehlt, art, max) {
		var voll = gewaehlt.length >= max;
		return liste.map(function(w) {
			var an = gewaehlt.indexOf(w) >= 0;
			return "<button type=\"button\" class=\"chip" + (an ? " an" : "") + "\" data-chip=\"" + art + "\" data-wert=\"" + esc(w) + "\" aria-pressed=\"" + an + "\"" + (voll && !an ? " disabled" : "") + ">" + esc(w) + "</button>";
		}).join("");
	}
	function renderChips() {
		document.getElementById("hobbyChips").innerHTML = chipsHTML(HOBBYS, auswahl.hobbys, "hobbys", 4);
		document.getElementById("zugChips").innerHTML = chipsHTML(ZUEGE, auswahl.zuege, "zuege", 5);
		var hz = document.getElementById("hobbyZaehler"), zz = document.getElementById("zugZaehler");
		hz.textContent = auswahl.hobbys.length + " / 4";
		hz.classList.toggle("voll", auswahl.hobbys.length >= 4);
		zz.textContent = auswahl.zuege.length + " / 5";
		zz.classList.toggle("voll", auswahl.zuege.length >= 5);
		kiSync();
		renderEntscheidForm();
	}
	var KI_FORM = {
		alter: "age",
		groesse: "height",
		stimme: "voiceDesc",
		beruf: "job",
		wohnsituation: "housing",
		eltern: "family",
		beziehungen: "relationships",
		erinnerungen: "memories",
		aussehen: "appearance",
		persoenlichkeit: "personality",
		kurzBio: "bio"
	};
	function kiWrap(k) {
		if (k === "hobbys") return (document.getElementById("hobbyChips") || { closest: function() {
			return null;
		} }).closest("fieldset");
		if (k === "zuege") return (document.getElementById("zugChips") || { closest: function() {
			return null;
		} }).closest("fieldset");
		if (k === "bezuege") return document.getElementById("bezugBox");
		var el = form && form[KI_FORM[k]];
		return el ? el.closest("label") || el.parentNode : null;
	}
	function kiTogglesEinbauen() {
		KI_FELDER.forEach(function(p) {
			var w = kiWrap(p[0]);
			if (!w || w.querySelector("[data-ki]")) return;
			var b = document.createElement("button");
			b.type = "button";
			b.className = "ki-toggle";
			b.dataset.ki = p[0];
			b.title = p[1] + ": bewusst der KI überlassen – sie legt es passend fest, danach gilt es fest";
			((w.tagName === "FIELDSET" ? w.querySelector("legend") : w) || w).appendChild(b);
		});
		kiSync();
	}
	function kiSync() {
		if (!form) return;
		KI_FELDER.forEach(function(p) {
			var k = p[0], an = kiAuswahl.indexOf(k) >= 0, w = kiWrap(k);
			if (!w) return;
			w.classList.toggle("ki-feld", an);
			var b = w.querySelector("[data-ki=\"" + k + "\"]");
			if (b) {
				b.textContent = an ? "✦ entscheidet die KI ✓" : "✦ entscheidet die KI";
				b.setAttribute("aria-pressed", an ? "true" : "false");
			}
			var el = KI_FORM[k] && form[KI_FORM[k]];
			if (el) el.disabled = an || k === "beruf" && form.noJob.checked;
			if (k === "bezuege") [].forEach.call(w.querySelectorAll("select, input, #bezugDazu"), function(x) {
				x.disabled = an;
			});
		});
	}
	form.addEventListener("click", function(e) {
		var b = e.target.closest && e.target.closest("[data-ki]");
		if (!b) return;
		e.preventDefault();
		kiAuswahl = kiUmschalten(kiAuswahl, b.dataset.ki);
		kiSync();
		renderEntscheidForm();
	});
	function bezugZiele() {
		var selbst = bearbeite >= 0 ? state.figuren[bearbeite] : null;
		return (state.figuren || []).filter(function(f) {
			return f && f.name && f !== selbst;
		});
	}
	function renderBezuege() {
		var liste = document.getElementById("bezugListe"), art = document.getElementById("bezugArt");
		document.getElementById("bezugZiel");
		if (!liste) return;
		bezugAuswahl = bezuegeAktualisieren(bezugAuswahl, state.figuren);
		liste.innerHTML = bezugAuswahl.length ? bezugAuswahl.map(function(b, i) {
			return "<span class=\"tag bezug\">" + esc(bezugText(b)) + " <button type=\"button\" class=\"bezug-weg\" data-bezugweg=\"" + i + "\" aria-label=\"Bezug entfernen\">×</button></span>";
		}).join("") : "<span class=\"hint klein\">Noch keine Bezüge.</span>";
		var selbst = bearbeite >= 0 ? state.figuren[bearbeite] : null;
  if (selbst) { var auto = lvIncoming(state.figuren, selbst); if(auto.length) liste.innerHTML += '<p class="hint">Automatisch verknüpft: ' + auto.map(function(b){return esc(bezugText(b));}).join(' · ') + ' (am ursprünglichen Bezug ändern)</p>'; }
  if (!art.options.length) art.innerHTML = BEZUG_ARTEN.map(function(a) {
			return "<option>" + esc(a) + "</option>";
		}).join("");
		var ziele = bezugZiele();
		document.getElementById("bezugZielListe").innerHTML = ziele.map(function(f) {
			return "<option value=\"" + esc(f.name) + "\"></option>";
		}).join("");
		document.getElementById("bezugDazu").disabled = kiAuswahl.indexOf("bezuege") >= 0;
	}
	document.getElementById("bezugDazu").addEventListener("click", function() {
		var ziel = document.getElementById("bezugZiel"), name = String(ziel.value || "").replace(/\s+/g, " ").trim();
		var fig = name ? bezugZiele().filter(function(f) {
			return f.name.toLowerCase() === name.toLowerCase();
		})[0] : null;
		var b = {
			art: document.getElementById("bezugArt").value,
			zielName: fig ? fig.name : name
		};
		if (fig && fig.id) b.zielId = fig.id;
		bezugAuswahl = normBezuege(bezugAuswahl.concat([b]));
		ziel.value = "";
		renderBezuege();
		if (!name) toast("Bezug ohne Namen: den Namen legt die KI fest (z. B. mit „✦ KI füllt Char“).", 6e3);
	});
	document.getElementById("bezugListe").addEventListener("click", function(e) {
		var i = e.target.dataset.bezugweg;
		if (i === void 0) return;
		bezugAuswahl.splice(+i, 1);
		renderBezuege();
	});
	form.addEventListener("click", function(e) {
		var b = e.target.closest("[data-chip]");
		if (!b || b.disabled) return;
		var art = b.dataset.chip, max = art === "hobbys" ? 4 : 5;
		auswahl[art] = toggleAuswahl(auswahl[art], b.dataset.wert, max).liste;
		renderChips();
	});
	var farbeManuell = false;
	function farbeSetzen(c, manuell) {
		if (!hexOk(c)) return;
		form.color.value = c.toLowerCase();
		farbeManuell = !!manuell;
		var pr = document.getElementById("farbProbe");
		pr.style.color = lesbar(c, schreibHg());
	}
	form.color.addEventListener("input", function() {
		farbeSetzen(form.color.value, true);
	});
	function syncMeinFeld() {
		document.getElementById("bioFeld").hidden = !form.isPlayer.checked;
		if (form.isPlayer.checked) form.role.value = "Hauptfigur";
		form.role.disabled = form.isPlayer.checked;
	}
	form.isPlayer.addEventListener("change", function() {
		syncMeinFeld();
		renderEntscheidForm();
		if (!farbeManuell) farbeSetzen(form.isPlayer.checked ? FARBE_DU : naechsteFarbe(state.figuren, bearbeite), false);
	});
	form.noJob.addEventListener("change", function() {
		form.job.disabled = form.noJob.checked || kiAuswahl.indexOf("beruf") >= 0;
		if (form.noJob.checked) form.job.value = "";
	});
	function formLeeren() {
		form.reset();
 if(typeof lpHost!=="undefined"&&lpHost.editor)lpHost.editor.load({});
		bearbeite = -1;
		auswahl = {
			hobbys: [],
			zuege: []
		};
		bezugAuswahl = [];
		kiAuswahl = [];
		form.job.disabled = false;
		document.getElementById("figurSubmit").textContent = "Figur hinzufügen";
		document.getElementById("figurFormTitel").textContent = "Neue Figur";
		document.getElementById("figurAbbrechen").hidden = true;
		upl = {
			photo: null,
			brief: null
		};
		renderUploads();
		farbeSetzen(naechsteFarbe(state.figuren, -1), false);
		form.sexualityLevel.value = SEX_STANDARD;
		form.bedroomStyle.value = BETT_STANDARD;
		syncMeinFeld();
		renderChips();
		stimmeFormSetzen(null);
		renderBezuege();
	}
	function setzeWohnen(v) {
		var sel = form.housing;
		v = v || "";
		if (v && ![].some.call(sel.options, function(o) {
			return o.value === v || o.text === v;
		})) {
			var o = document.createElement("option");
			o.text = v;
			o.dataset.extra = "1";
			sel.add(o);
		}
		sel.value = v;
	}
	function formFuellen(i) {
		var x = state.figuren[i];
		if (!x) return;
		formLeeren();
		bearbeite = i;
		[].forEach.call(form.housing.querySelectorAll("[data-extra]"), function(o) {
			o.remove();
		});
		Object.keys(FELD).forEach(function(k) {
			if (k !== "housing" && form[k]) form[k].value = k === "job" && x.keinBeruf ? "" : x[FELD[k]] || "";
		});
		setzeWohnen(x.wohnsituation);
		form.role.value = x.rolle || "Hauptfigur";
		form.isPlayer.checked = !!x.mein;
		form.noJob.checked = !!x.keinBeruf;
		form.job.disabled = !!x.keinBeruf;
		auswahl = {
			hobbys: (x.hobbys || []).slice(),
			zuege: (x.zuege || []).slice()
		};
		bezugAuswahl = (x.bezuege || []).slice();
		kiAuswahl = normKiFelder(x.kiFelder);
		form.sexualityLevel.value = sexStufe(x.sexualityLevel);
		form.bedroomStyle.value = bettStil(x.bedroomStyle);
		upl = {
			photo: x.photo || null,
			brief: x.brief || null
		};
		renderUploads();
		farbeSetzen(hexOk(x.color) ? x.color : x.mein ? FARBE_DU : naechsteFarbe(state.figuren, i), false);
		farbeManuell = hexOk(x.color) && x.color !== "#1a1a1a" && NPC_FARBEN.indexOf(x.color) < 0;
		document.getElementById("figurSubmit").textContent = "Änderungen speichern";
		document.getElementById("figurFormTitel").textContent = x.name + " bearbeiten";
		document.getElementById("figurAbbrechen").hidden = false;
		syncMeinFeld();
		renderChips();
		stimmeFormSetzen(x.voiceId || null);
		renderBezuege();
		form.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
		form.name.focus();
 if(lpHost.editor)lpHost.editor.load(x);
	}
	function formRoh() {
		var roh = {
			mein: form.isPlayer.checked,
			keinBeruf: form.noJob.checked || /^keiner?$/i.test(form.job.value.trim()),
			hobbys: auswahl.hobbys,
			zuege: auswahl.zuege
		};
		Object.keys(FELD).forEach(function(k) {
			roh[FELD[k]] = form[k] ? form[k].value : "";
		});
		roh.photo = upl.photo;
		roh.brief = upl.brief;
		roh.sexualityLevel = sexStufe(form.sexualityLevel.value);
		roh.bedroomStyle = bettStil(form.bedroomStyle.value);
		roh.color = hexOk(form.color.value) ? form.color.value.toLowerCase() : roh.mein ? FARBE_DU : naechsteFarbe(state.figuren, bearbeite);
		if (roh.mein) roh.rolle = "Hauptfigur";
		var selbstId = bearbeite >= 0 && state.figuren[bearbeite] ? state.figuren[bearbeite].id : "";
		roh.bezuege = bezuegeAktualisieren(bezugAuswahl, state.figuren).filter(function(b) {
			return !selbstId || b.zielId !== selbstId;
		});
		roh.kiFelder = kiAuswahl.slice();
		Object.assign(roh,lpHost.editor ? lpHost.editor.read() : {});
		return roh;
	}
	form.addEventListener("submit", function(e) {
		e.preventDefault();
		var fig = normalizeFigur(formRoh());
		if (!fig.name) return;
		var altFig = bearbeite >= 0 ? state.figuren[bearbeite] : null;
		if (altFig) OPTIK_FELDER.forEach(function(k) {
			if (altFig[k] && !Object.prototype.hasOwnProperty.call(lpHost.editor.read(),k)) fig[k] = altFig[k];
		});
		[
			"haare",
			"augen",
			"outfit"
		].forEach(function(k) {
			if (upl[k] && !fig[k]) fig[k] = String(upl[k]).slice(0, k === "outfit" ? 600 : 120);
		});
		(upl.bildGesetzt || []).forEach(function(k) {
			if (upl[k]) fig[k] = String(upl[k]).slice(0, k === "outfit" ? 600 : 120);
		});
		if (upl.bildOptikFelder && upl.bildOptikFelder.length) fig.bildOptikFelder = upl.bildOptikFelder.slice();
		if (fig.brief) fig.briefBogen = true;
		fig.id = altFig && altFig.id || neueFigurId();
		fig.voiceId = form.voiceId && form.voiceId.value || null;
		fig.voiceName = fig.voiceId ? stimmName(fig.voiceId) : null;
		if (fig.voiceId && !stimmeBereit(fig.voiceId) && settings.stimmen) stimmeNachladen(fig.voiceId);
		var erl = figurErlaubt(state.figuren, fig, bearbeite);
		if (!erl.ok) {
			toast(erl.grund, 7e3);
			return;
		}
		if (fig.mein) state.figuren.forEach(function(x, i) {
			if (x.mein && i !== bearbeite) {
				x.mein = false;
				farbeBeiRollenwechsel(x, false);
			}
		});
		if (bearbeite >= 0 && state.figuren[bearbeite]) {
			var alt = state.figuren[bearbeite];
			if (alt.name !== fig.name && Array.isArray(state.anwesend)) {
				var ai = state.anwesend.indexOf(alt.name);
				if (ai >= 0) state.anwesend[ai] = fig.name;
			}
			state.figuren[bearbeite] = fig;
		} else state.figuren.push(fig);
		farbenAuffuellen(state.figuren);
		var neu = fig;
		save();
		formLeeren();
		renderFiguren();
		stimmAllesRendern();
		form.name.focus();
		fotoBeschreiben(neu);
	});
	document.getElementById("figurAbbrechen").addEventListener("click", formLeeren);
	var kiFuelltGerade = false;
	function kiFuellenAnfrage(fig) {
		if (!API || !API.kiFuellen) return Promise.resolve({
			ok: false,
			error: "„KI füllt Char“ geht nur in der Lorevia-App (mit lokaler KI)."
		});
		if (!fig.id && bearbeite >= 0 && state.figuren[bearbeite]) fig = Object.assign({}, fig, { id: state.figuren[bearbeite].id });
		return API.kiFuellen({
			figur: fig,
			figuren: state.figuren,
			intro: state.intro || "",
			welt: weltExport(W())
		}, settings.model).catch(function(e) {
			return {
				ok: false,
				error: "Die KI konnte die Figur gerade nicht füllen: " + (e && e.message || e)
			};
		});
	}
	function kiFuellMeldung(name, r) {
		if (!r || !r.ok) return r && r.error || "Die KI konnte die Figur gerade nicht füllen.";
		if (!(r.felder || []).length) return name + ": Steckbrief ist schon vollständig – nichts offen. (Tipp: „✦ entscheidet die KI“ an einem Feld setzen, dann füllt die KI genau das neu.)";
		if (!(r.gefuellt || []).length) return name + ": Die KI hat nichts Brauchbares geliefert – bitte nochmal versuchen.";
		return "";
	}
	function kiFuelltKarte(i, btn) {
		var x = state.figuren[i];
		if (!x || kiFuelltGerade) return;
		kiFuelltGerade = true;
		if (btn) {
			btn.disabled = true;
			btn.textContent = "✦ KI füllt …";
		}
		kiFuellenAnfrage(x).then(function(r) {
			kiFuelltGerade = false;
			var fehler = kiFuellMeldung(x.name, r);
			if (fehler) {
				toast(fehler, 8e3);
				renderFiguren();
				return;
			}
			var n = normalizeFigur(fuellUebernehmen(x, r));
			Object.keys(n).forEach(function(k) {
				x[k] = n[k];
			});
			if (!n.kiFelder) delete x.kiFelder;
			save();
			renderFiguren();
			var idx = state.figuren.indexOf(x);
			if (idx >= 0 && (bearbeite === idx || bearbeite < 0 && !form.name.value.trim())) formFuellen(idx);
			toast(x.name + ": KI hat gefüllt – " + r.gefuellt.map(kiLabel).join(", ") + ". Steht jetzt im Steckbrief, du kannst alles ändern.", 8e3);
		});
	}
	document.getElementById("figurKiFuellen").addEventListener("click", function() {
		var b = this;
		if (kiFuelltGerade) return;
		var fig = normalizeFigur(formRoh());
		if (!fig.name) {
			toast("Gib der Figur zuerst einen Namen – dann füllt die KI den Rest.", 6e3);
			form.name.focus();
			return;
		}
		kiFuelltGerade = true;
		b.disabled = true;
		var alt = b.textContent;
		b.textContent = "✦ KI füllt …";
		kiFuellenAnfrage(fig).then(function(r) {
			kiFuelltGerade = false;
			b.disabled = false;
			b.textContent = alt;
			var fehler = kiFuellMeldung(fig.name, r);
			if (fehler) {
				toast(fehler, 8e3);
				return;
			}
			var w = r.werte;
			Object.keys(KI_FORM).forEach(function(k) {
				if (w[k] === void 0) return;
				if (k === "wohnsituation") setzeWohnen(w[k]);
				else if (form[KI_FORM[k]]) form[KI_FORM[k]].value = w[k];
			});
			if (w.hobbys) auswahl.hobbys = w.hobbys.slice();
			if (w.zuege) auswahl.zuege = w.zuege.slice();
			if (w.bezuege) {
				bezugAuswahl = w.bezuege.slice();
				renderBezuege();
			}
			kiAuswahl = kiAuswahl.filter(function(k) {
				return r.gefuellt.indexOf(k) < 0;
			});
			renderChips();
			toast("KI hat eingetragen: " + r.gefuellt.map(kiLabel).join(", ") + ". Mit „" + document.getElementById("figurSubmit").textContent + "“ übernehmen – oder vorher ändern.", 9e3);
		});
	});
	var bildFuelltGerade = false;
	function ausBildAnfrage(pfad) {
		if (!API || !API.ausBildFuellen) return Promise.resolve({
			ok: false,
			error: "„Aus Bild füllen“ geht nur in der Lorevia-App (mit lokaler KI)."
		});
		if (!pfad) return Promise.resolve({
			ok: false,
			error: "Diese Figur hat noch kein Bild – bitte zuerst ein Bild (PNG/JPG) wählen."
		});
		return API.ausBildFuellen(pfad, settings.visionModel || settings.model).catch(function(e) {
			return {
				ok: false,
				error: "Die KI konnte das Bild gerade nicht auslesen: " + (e && e.message || e)
			};
		});
	}
	function ausBildMeldung(name, u) {
		if (!u.gesetzt.length) return name + ": Nichts geändert – " + (u.behalten.length ? bildOptikLabels(u.behalten) + " hast du schon selbst ausgefüllt, das bleibt." : "auf dem Bild war zur Optik nichts Sicheres zu erkennen.");
		return name + ": aus dem Bild übernommen – " + bildOptikLabels(u.gesetzt) + "." + (u.behalten.length ? " Schon ausgefüllt, bleibt: " + bildOptikLabels(u.behalten) + "." : "") + " Du kannst alles ändern.";
	}
	function ausBildKarte(i, btn) {
		var x = state.figuren[i];
		if (!x || bildFuelltGerade) return;
		bildFuelltGerade = true;
		if (btn) {
			btn.disabled = true;
			btn.textContent = "Bild wird gelesen …";
		}
		ausBildAnfrage(x.photo && x.photo.path).then(function(r) {
			bildFuelltGerade = false;
			if (!r || !r.ok) {
				toast(r && r.error || "Die KI konnte das Bild gerade nicht auslesen.", 8e3);
				renderFiguren();
				return;
			}
			var u = bildOptikUebernehmen(x, r);
			var n = normalizeFigur(u.figur);
			if (u.gesetzt.indexOf("aussehen") >= 0 && n.kiFelder) n.kiFelder = n.kiFelder.filter(function(k) {
				return k !== "aussehen";
			});
			Object.keys(n).forEach(function(k) {
				x[k] = n[k];
			});
			if (!n.kiFelder || !n.kiFelder.length) delete x.kiFelder;
			save();
			renderFiguren();
			var idx = state.figuren.indexOf(x);
			if (idx >= 0 && bearbeite === idx) formFuellen(idx);
			toast(ausBildMeldung(x.name, u), 9e3);
		});
	}
	document.getElementById("fotoAusBild").addEventListener("click", function() {
		var b = this;
		if (bildFuelltGerade) return;
		var altFig = bearbeite >= 0 ? state.figuren[bearbeite] : null;
		var name = form.name.value.trim() || "Figur";
		bildFuelltGerade = true;
		b.disabled = true;
		var alt = b.textContent;
		b.textContent = "Bild wird gelesen …";
		ausBildAnfrage(upl.photo && upl.photo.path).then(function(r) {
			bildFuelltGerade = false;
			b.disabled = false;
			b.textContent = alt;
			if (!r || !r.ok) {
				toast(r && r.error || "Die KI konnte das Bild gerade nicht auslesen.", 8e3);
				return;
			}
			var cur = {
				aussehen: form.appearance.value,
				bildOptikFelder: upl.bildOptikFelder || altFig && altFig.bildOptikFelder || []
			};
			[
				"haare",
				"augen",
				"outfit"
			].forEach(function(k) {
				cur[k] = upl[k] || altFig && altFig[k] || "";
			});
			var u = bildOptikUebernehmen(cur, r);
			if (u.gesetzt.indexOf("aussehen") >= 0) {
				form.appearance.value = u.figur.aussehen;
				kiAuswahl = kiAuswahl.filter(function(k) {
					return k !== "aussehen";
				});
				kiSync();
				renderEntscheidForm();
			}
			upl.bildGesetzt = (upl.bildGesetzt || []).slice();
			[
				"haare",
				"augen",
				"outfit"
			].forEach(function(k) {
				if (u.gesetzt.indexOf(k) >= 0) {
					upl[k] = u.figur[k];
					if (upl.bildGesetzt.indexOf(k) < 0) upl.bildGesetzt.push(k);
				}
			});
			upl.bildOptikFelder = u.figur.bildOptikFelder;
			toast(ausBildMeldung(name, u) + (u.gesetzt.length ? " Mit „" + document.getElementById("figurSubmit").textContent + "“ übernehmen." : ""), 9e3);
		});
	});
	function esc(s) {
		return String(s).replace(/[&<>"]/g, function(c) {
			return {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				"\"": "&quot;"
			}[c];
		});
	}
	function inline(s) {
		return esc(s).replace(/\*\*([\s\S]+?)\*\*/g, "<strong>$1</strong>").replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
	}
	function bogenKurz(x) {
		var t = [];
		if (x.alter) t.push(x.alter + (/^\d+$/.test(x.alter) ? " Jahre" : ""));
		if (x.groesse) t.push(x.groesse);
		if (x.keinBeruf) t.push("kein Beruf");
		else if (x.beruf) t.push(x.beruf);
		if (x.wohnsituation) t.push("wohnt " + x.wohnsituation);
		return t.join(" · ");
	}
	function bezErinKarte(x) {
		var bz = (x.bezuege || []).map(bezugText), auf = bezuegeAuf(state.figuren, x);
		if (!x.beziehungen && !x.erinnerungen && !bz.length && !auf.length) return "";
		return "<div class=\"bez-erin-karte\">" + (bz.length || auf.length ? "<div class=\"bez-erin-block\"><span class=\"bez-erin-titel\">Familie</span><p>" + esc(bz.concat(auf.map(function(a) {
			return "↔ " + a;
		})).join(" · ")) + "</p></div>" : "") + (x.beziehungen ? "<div class=\"bez-erin-block\"><span class=\"bez-erin-titel\">Freunde &amp; Bekannte</span><p>" + esc(x.beziehungen) + "</p></div>" : "") + (x.erinnerungen ? "<div class=\"bez-erin-block\"><span class=\"bez-erin-titel\">Frühere Erinnerungen</span><p>" + esc(x.erinnerungen) + "</p></div>" : "") + "</div>";
	}
	function figurenOrdnen() {
		var sortiert = figurenSortieren(state.figuren);
		if (sortiert.every(function(f, i) {
			return f === state.figuren[i];
		})) return false;
		var offen = bearbeite >= 0 ? state.figuren[bearbeite] : null;
		state.figuren.splice.apply(state.figuren, [0, state.figuren.length].concat(sortiert));
		if (offen) bearbeite = state.figuren.indexOf(offen);
		return true;
	}
	function renderFiguren() {
		farbenAuffuellen(state.figuren);
		var sexNeu = sexAuffuellen();
		var bezNeu = bezuegeAufraeumen();
		var umsortiert = figurenOrdnen();
		if (idsAuffuellen() || sexNeu || bezNeu || umsortiert) save();
		var box = document.getElementById("figurListe");
		box.innerHTML = state.figuren.map(function(x, i) {
			var kurz = bogenKurz(x), tags = (x.zuege || []).map(function(z) {
				return "<span class=\"tag zug\">" + esc(z) + "</span>";
			}).concat((x.hobbys || []).map(function(h) {
				return "<span class=\"tag hobby\">" + esc(h) + "</span>";
			})).join("");
			return "<div class=\"figur" + (x.mein ? " mein" : "") + "\">" + (x.photo && x.photo.path ? "<div class=\"av foto\"><img data-bild=\"" + esc(x.photo.path) + "\" alt=\"\"></div>" : "<div class=\"av\" style=\"color:" + (x.mein ? "" : esc(lesbar(x.color, "#ffffff"))) + "\">" + esc(x.name.charAt(0).toUpperCase()) + "</div>") + "<div class=\"info\"><div class=\"name\">" + swatch(x.color) + esc(x.name) + (x.mein ? "<span class=\"badge\">dein Char</span>" : "") + "</div><div class=\"meta\">" + esc(x.rolle) + (x.mein ? " · steuerst du" : " · steuert die KI") + (kurz ? " · " + esc(kurz) : "") + "</div>" + (tags ? "<div class=\"tags\">" + tags + "</div>" : "") + (x.stimme ? "<div class=\"notes\"><strong>Stimme:</strong> " + esc(x.stimme) + "</div>" : "") + "<div class=\"notes sex-stufe\"><strong>Sexualität:</strong> " + esc(sexLabel(x.sexualityLevel)) + " · <strong>Im Bett:</strong> " + esc(bettLabel(x.bedroomStyle)) + "</div>" + (x.mein || STIMMEN_AUS ? "" : "<div class=\"notes\"><strong>Vorlese-Stimme:</strong> " + esc(x.voiceId ? stimmName(x.voiceId) : "automatisch") + "</div>") + (x.mein && x.kurzBio ? "<div class=\"notes\"><strong>Kurz-Bio:</strong> " + esc(x.kurzBio) + "</div>" : "") + bezErinKarte(x) + (x.notizen ? "<div class=\"notes\">" + esc(x.notizen) + "</div>" : "") + optikZeile(x) + entscheidZeile(x) + (x.brief ? "<button type=\"button\" class=\"brief-link\" data-oeffnen=\"" + esc(x.brief.path) + "\"><span class=\"dok-icon klein\">" + esc(endung(x.brief.name)) + "</span>Charakterbrief: " + esc(x.brief.name) + (x.brief.text ? "" : " (Text nicht lesbar)") + "</button>" : "") + "</div><div class=\"actions\"><button class=\"btn ghost small\" data-edit=\"" + i + "\">Bearbeiten</button><button class=\"btn ghost small\" data-outfit=\"" + i + "\" title=\"Outfit setzen (Bezeichnung + Bild)\">Outfit</button><button class=\"btn ghost small\" data-aussehen=\"" + i + "\" title=\"Haare und Augen fest vorgeben\">Haare &amp; Augen</button>" + (x.mein ? "" : "<button class=\"btn ghost small\" data-mein=\"" + i + "\">Als mein Char</button>") + "<button class=\"btn ghost small\" data-kifuellen=\"" + i + "\" title=\"Offene und „entscheidet die KI“-Felder jetzt füllen – das Ergebnis steht danach im Steckbrief\">✦ KI füllt Char</button>" + (x.brief ? "<button class=\"btn ghost small\" data-briefbogen=\"" + i + "\" title=\"Leere Felder im Steckbrief aus dem Charakterbrief füllen\">Aus Brief füllen</button>" : "") + "<button class=\"btn ghost small\" data-ausbild=\"" + i + "\" title=\"Nur Optik aus dem Bild der Figur: Aussehen, Haare, Augen, Outfit/Kleidung – Persönlichkeit und Beschreibung bleiben vom Steckbrief/Brief\">Aus Bild füllen</button><button class=\"btn ghost small\" data-del=\"" + i + "\">Entfernen</button></div></div>";
		}).join("");
		document.getElementById("figurLeer").style.display = state.figuren.length ? "none" : "block";
		bilderLaden(box);
		renderZaehler();
	}
	document.getElementById("figurListe").addEventListener("click", function(e) {
		var m = e.target.dataset.mein, d = e.target.dataset.del, ed = e.target.dataset.edit;
		if (e.target.dataset.outfit !== void 0) {
			outfitOeffnen(+e.target.dataset.outfit);
			return;
		}
		if (e.target.dataset.aussehen !== void 0) {
			aussehenOeffnen(+e.target.dataset.aussehen);
			return;
		}
		if (e.target.dataset.kifuellen !== void 0) {
			kiFuelltKarte(+e.target.dataset.kifuellen, e.target);
			return;
		}
		if (e.target.dataset.ausbild !== void 0) {
			ausBildKarte(+e.target.dataset.ausbild, e.target);
			return;
		}
		if (e.target.dataset.briefbogen !== void 0) {
			var bf = state.figuren[+e.target.dataset.briefbogen];
			e.target.disabled = true;
			briefInListenFigur(bf).then(function() {
				save();
				renderFiguren();
			});
			return;
		}
		if (e.target.closest("[data-regeln-oeffnen]")) {
			regelnZeigen(true);
			return;
		}
		var ob = e.target.closest("[data-oeffnen]");
		if (ob) {
			if (API && API.openAttachment) API.openAttachment(ob.dataset.oeffnen);
			return;
		}
		if (ed !== void 0) {
			formFuellen(+ed);
			return;
		}
		if (m !== void 0) {
			var kand = Object.assign({}, state.figuren[+m], {
				mein: true,
				rolle: "Hauptfigur"
			});
			var erl = figurErlaubt(state.figuren, kand, +m);
			if (!erl.ok) {
				toast(erl.grund, 7e3);
				return;
			}
			state.figuren.forEach(function(x, i) {
				var war = !!x.mein;
				x.mein = i == m;
				if (i == m) x.rolle = "Hauptfigur";
				if (war !== x.mein) farbeBeiRollenwechsel(x, x.mein);
			});
			farbenAuffuellen(state.figuren);
		} else if (d !== void 0) {
			if (!confirm("„" + state.figuren[+d].name + "“ entfernen?")) return;
			state.figuren.splice(+d, 1);
			if (bearbeite === +d) formLeeren();
		} else return;
		save();
		renderFiguren();
	});
	renderChips();
	kiTogglesEinbauen();
	renderBezuege();
	var LIMITS = {
		maxHaupt: 4,
		maxNeben: 8,
		zaehlen: function() {
			return zaehleFiguren(state.figuren);
		},
		erlaubt: function(fig, index) {
			return figurErlaubt(state.figuren, normalizeFigur(fig || {}), index == null ? -1 : index);
		}
	};
	function renderZaehler() {
		var z = zaehleFiguren(state.figuren), el = document.getElementById("figurZaehler");
		if (!el) return;
		el.innerHTML = "<span class=\"" + (z.haupt >= 4 ? "voll" : "") + "\">Hauptfiguren " + z.haupt + " / 4</span> · <span class=\"" + (z.neben >= 8 ? "voll" : "") + "\">Nebenfiguren " + z.neben + " / 8</span> · " + (z.mein === 1 ? "dein Char ✓" : "<span class=\"voll\">noch kein Char von dir</span>");
		var bz = document.getElementById("bibZaehler");
		if (bz) bz.innerHTML = el.innerHTML;
	}
	function bilderLaden(root) {
		(root || document).querySelectorAll("img[data-bild]:not([src])").forEach(function(img) {
			ladeBild(img.dataset.bild).then(function(u) {
				if (u) img.src = u;
			});
		});
	}
	function fotoBeschreiben(fig) {
		if (!fig || !fig.photo || fig.photo.beschreibung || !API || !API.describeImage || !ki.ready) return;
		var pfad = fig.photo.path;
		API.describeImage(pfad, {
			model: settings.visionModel || settings.model,
			hint: "Beschreibe nur das Aussehen der Person auf dem Bild (Haare, Augen, Gesicht, Statur, Kleidung), kurz und sachlich."
		}).then(function(r) {
			if (!r || !r.ok || !r.text) return;
			state.figuren.forEach(function(x) {
				if (x.photo && x.photo.path === pfad) x.photo.beschreibung = String(r.text).slice(0, 800);
			});
			save();
		}).catch(function() {});
	}
	var upl = {
		photo: null,
		brief: null
	};
	function renderUploads() {
		var fv = document.getElementById("fotoVorschau"), bv = document.getElementById("briefVorschau");
		if (!fv) return;
		fv.innerHTML = upl.photo ? "<img data-bild=\"" + esc(upl.photo.path) + "\" alt=\"" + esc(upl.photo.name || "Bild") + "\">" + (upl.photo.ausBrief ? "<span class=\"aus-brief\">aus Brief erkannt</span>" : "") : "<span class=\"foto-leer\">Kein Bild</span>";
		bv.innerHTML = upl.brief ? "<span class=\"brief-chip\"><span class=\"dok-icon\">" + esc(endung(upl.brief.name)) + "</span><span class=\"dok-info\"><span class=\"dok-name\" title=\"" + esc(upl.brief.name) + "\">" + esc(upl.brief.name) + "</span><span class=\"dok-meta\">" + (upl.brief.text ? "Charakterbrief · " + upl.brief.text.length + " Zeichen gelesen" : "Charakterbrief · Text nicht lesbar") + "</span></span></span>" : "<span class=\"foto-leer\">Kein Dokument</span>";
		document.getElementById("fotoWeg").hidden = !upl.photo;
		document.getElementById("briefWeg").hidden = !upl.brief;
		document.getElementById("fotoWaehlen").textContent = upl.photo ? "Anderes Bild" : "Bild wählen";
		document.getElementById("briefWaehlen").textContent = upl.brief ? "Anderes Dokument" : "Dokument wählen";
		bilderLaden(fv);
	}
	[[
		"photo",
		"foto",
		"image/*"
	], [
		"brief",
		"brief",
		".odt,.docx,.pdf,.txt,.md"
	]].forEach(function(p) {
		var art = p[0], id = p[1];
		document.getElementById(id + "Waehlen").addEventListener("click", function() {
			if (!API || !API.pickFiles) {
				toast("Bild und Charakterbrief gehen nur in der Lorevia-App.");
				return;
			}
			API.pickFiles({
				accept: p[2],
				storyId: settings.currentStory,
				withErrors: true
			}).then(function(r) {
				if (r.errors && r.errors.length) toast(r.errors.join(" "), 7e3);
				var f = r.files && r.files[0];
				if (!f) return;
				if (art === "photo" && f.kind !== "image") {
					toast("Bitte ein Bild wählen.");
					return;
				}
				if (art === "brief" && f.kind !== "document") {
					toast("Bitte ein Dokument wählen (ODT, Word, PDF, Text).");
					return;
				}
				upl[art] = f;
				renderUploads();
				if (art === "brief") {
					bildAusBrief(f);
					briefInsFormular(f);
				}
			});
		});
		document.getElementById(id + "Weg").addEventListener("click", function() {
			upl[art] = null;
			if (art === "brief" && upl.photo && upl.photo.ausBrief) upl.photo = null;
			renderUploads();
		});
	});
	function briefInsFormular(brief) {
		if (!brief || !brief.text) return;
		var roh = {
			mein: form.isPlayer.checked,
			keinBeruf: form.noJob.checked,
			hobbys: auswahl.hobbys.slice(),
			zuege: auswahl.zuege.slice(),
			sexualityLevel: form.sexualityLevel.value,
			bedroomStyle: form.bedroomStyle.value
		};
		Object.keys(FELD).forEach(function(k) {
			roh[FELD[k]] = form[k] ? form[k].value : "";
		});
		var r = briefInFigur(roh, brief.text), f = r.figur;
		if (!r.felder.length) return;
		Object.keys(FELD).forEach(function(k) {
			if (k === "name" || k === "role" || !form[k]) return;
			var v = f[FELD[k]];
			if (v && !String(form[k].value || "").trim()) {
				if (k === "housing") setzeWohnen(v);
				else form[k].value = v;
			}
		});
		auswahl = {
			hobbys: (f.hobbys || []).slice(0, 4),
			zuege: (f.zuege || []).slice(0, 5)
		};
		form.sexualityLevel.value = sexStufe(f.sexualityLevel);
		form.bedroomStyle.value = bettStil(f.bedroomStyle);
		[
			"haare",
			"augen",
			"outfit"
		].forEach(function(k) {
			if (f[k]) upl[k] = f[k];
		});
		renderChips();
		toast("Aus dem Charakterbrief übernommen: " + r.felder.join(", ") + (r.bettErkannt ? " (Im Bett aus dem Text erkannt – änderbar)" : ""), 7e3);
	}
	function briefInListenFigur(x, still) {
		if (!x || !x.brief) return Promise.resolve(null);
		return (API && API.briefText && x.brief.path ? API.briefText(x.brief.path).catch(function() {
			return null;
		}) : Promise.resolve(null)).then(function(r) {
			if (r && r.ok && r.text) x.brief.text = String(r.text).slice(0, 6e3);
			var e = briefInFigur(x, x.brief.text || "");
			var n = normalizeFigur(Object.assign({}, e.figur, { briefBogen: true }));
			Object.keys(n).forEach(function(k) {
				x[k] = n[k];
			});
			x.briefBogen = true;
			if (!still) toast(e.felder.length ? x.name + ": aus dem Charakterbrief übernommen – " + e.felder.join(", ") + (e.bettErkannt ? " (Im Bett aus dem Text erkannt – änderbar)" : "") : x.name + ": im Brief steht nichts Neues für leere Felder.", 7e3);
			return e;
		});
	}
	function briefeNachfuellen() {
		var offen = (state.figuren || []).filter(function(x) {
			return x && x.brief && !x.briefBogen;
		});
		if (!offen.length) return;
		Promise.all(offen.map(function(x) {
			return briefInListenFigur(x, true);
		})).then(function(rs) {
			var namen = offen.filter(function(x, i) {
				return rs[i] && rs[i].felder.length;
			}).map(function(x) {
				return x.name;
			});
			renderFiguren();
			save();
			if (namen.length) toast("Steckbrief aus dem Charakterbrief ergänzt: " + namen.join(", "), 6e3);
		}).catch(function() {});
	}
	var bezAufgeraeumtGemeldet = false;
	function bezuegeAufraeumen() {
		var namen = [];
		(state.figuren || []).forEach(function(x, i) {
			if (!x || typeof x !== "object") return;
			var r = bezuegeTrennen(x);
			if (!r.verschoben.length) return;
			Object.keys(x).forEach(function(k) {
				if (!(k in r.figur)) delete x[k];
			});
			Object.keys(r.figur).forEach(function(k) {
				x[k] = r.figur[k];
			});
			namen.push(x.name);
		});
		if (namen.length && !bezAufgeraeumtGemeldet) {
			bezAufgeraeumtGemeldet = true;
			setTimeout(function() {
				toast("Freunde, Kollegen usw. stehen jetzt unter „Freunde & Bekannte“ (vorher Bezüge): " + namen.join(", ") + ". Bezüge sind nur noch Familie.", 9e3);
			}, 0);
		}
		return namen.length > 0;
	}
	function sexAuffuellen() {
		var geaendert = false;
		(state.figuren || []).forEach(function(x) {
			if (!x || typeof x !== "object") return;
			if (sexStufeOder(x.sexualityLevel) === x.sexualityLevel && bettStilOder(x.bedroomStyle) === x.bedroomStyle) return;
			var n = normalizeFigur(x);
			x.sexualityLevel = n.sexualityLevel;
			x.bedroomStyle = n.bedroomStyle;
			geaendert = true;
		});
		return geaendert;
	}
	function bildAusBrief(brief) {
		if (!brief || !API || !API.briefFoto || upl.photo && !upl.photo.ausBrief) return;
		window.LoreviaBridge.extractPhotoFromBrief(brief).then(function(r) {
			if (!r || !r.photo || !r.photo.path || upl.brief !== brief || upl.photo && !upl.photo.ausBrief) return;
			upl.photo = r.photo;
			renderUploads();
			toast("Bild aus Charakterbrief übernommen – „Anderes Bild“ ersetzt es.");
		}).catch(function() {});
	}
	var bibModal = document.getElementById("bibModal"), bib = {
		dir: "",
		eintraege: [],
		thumbs: {},
		art: "andere"
	};
	var BIB_ORDNERNAME = {
		andere: "Charaktere und co",
		mein: "Eigene Figuren"
	};
	function bibLaden() {
		if (!API || !API.scanBibliothek) return Promise.resolve({
			ok: false,
			error: "nur in der App"
		});
		return (bib.art === "mein" ? API.scanMeinChar || function() {
			return Promise.resolve({
				ok: false,
				error: "Bitte Lorevia aktualisieren"
			});
		} : API.scanBibliothek)().then(function(r) {
			r = r || {};
			bib.dir = r.dir || "";
			bib.eintraege = r.eintraege || [];
			bib.ok = r.ok;
			bib.error = r.error;
			return r;
		});
	}
	function bibNeuLaden() {
		document.getElementById("bibListe").innerHTML = "<p class=\"bib-leer\">Figuren werden geladen …</p>";
		return bibLaden().then(renderBib).catch(function() {
			document.getElementById("bibListe").innerHTML = "<div class=\"bib-leerstand\"><p>Figuren konnten gerade nicht geladen werden.</p><button class=\"btn ghost\" type=\"button\" data-bib=\"neu\">Neu einlesen</button></div>";
		});
	}
	function bibName(n) {
		return String(n || "").trim().toLowerCase();
	}
	function bibSortieren(liste, namen) {
		return liste.map(function(c, i) {
			return {
				c,
				i,
				d: namen.indexOf(bibName(c.name)) >= 0 ? 0 : 1
			};
		}).sort(function(a, b) {
			return a.d - b.d || a.i - b.i;
		}).map(function(x) {
			return x.c;
		});
	}
	function renderBib() {
		var sucheEl = document.getElementById("bibSuche"), q = sucheEl.value.trim().toLowerCase();
		var namen = state.figuren.map(function(x) {
			return bibName(x.name);
		});
		var z = zaehleFiguren(state.figuren), hauptVoll = z.haupt >= 4, nebenVoll = z.neben >= 8;
		var mein = bib.art === "mein", ordnerName = BIB_ORDNERNAME[bib.art];
		document.getElementById("bibTitel").textContent = mein ? "Eigene Charaktervorlagen" : "Charakterbibliothek";
		document.getElementById("bibOrdner").innerHTML = (mein ? "Dein Char kommt nur aus: " : "Andere Figuren/NPCs aus: ") + "<code>" + esc(bib.dir || ordnerName) + "</code>";
		renderZaehler();
		var box = document.getElementById("bibListe");
		var hatItems = bib.ok && bib.eintraege.length > 0;
		sucheEl.hidden = !hatItems;
		if (!bib.ok) {
			box.innerHTML = "<div class=\"bib-leerstand\"><h3>Charakter-Ordner nicht gefunden</h3><p>Lorevia liest immer <code>" + esc(bib.dir || ordnerName) + "</code>. " + (bib.error && bib.error !== "Ordner nicht gefunden" ? esc(bib.error) + ". " : "Liegt der Ordner dort? (OneDrive: einmal öffnen, damit er geladen ist.) ") + "</p><button class=\"btn ghost\" type=\"button\" data-bib=\"neu\">Neu einlesen</button></div>";
			return;
		}
		if (!hatItems) {
			box.innerHTML = "<div class=\"bib-leerstand\"><h3>Noch keine Figuren in „" + esc(ordnerName) + "“</h3><p>Ein Unterordner je Figur oder Steckbrief (ODT, Word, PDF) mit Bild.</p><button class=\"btn ghost\" type=\"button\" data-bib=\"neu\">Neu einlesen</button></div>";
			return;
		}
		var liste = bib.eintraege.filter(function(c) {
			return !q || (c.name + " " + (c.brief ? c.brief.name : "")).toLowerCase().indexOf(q) >= 0;
		});
		liste = bibSortieren(liste, namen);
		var nDrin = liste.filter(function(c) {
			return namen.indexOf(bibName(c.name)) >= 0;
		}).length;
		box.innerHTML = liste.length ? liste.map(function(c, li) {
			var drin = namen.indexOf(bibName(c.name)) >= 0;
			return (nDrin && li === 0 ? "<div class=\"bib-gruppe\">Schon in deiner Geschichte (" + nDrin + ")</div>" : nDrin && li === nDrin ? "<div class=\"bib-gruppe\">Weitere Figuren</div>" : "") + bibZeile(c, drin, drin ? state.figuren[namen.indexOf(bibName(c.name))] : null);
		}).join("") : "<p class=\"bib-leer\">Keine Figur zu „" + esc(sucheEl.value.trim()) + "“ – Suche leeren, um alle " + bib.eintraege.length + " zu sehen.</p>";
		function bibZeile(c, drin, fx) {
			var std = mein ? hauptVoll && !z.mein ? "" : "mein" : !hauptVoll ? "haupt" : !nebenVoll ? "neben" : "";
			var waehlbar = !drin && !!std;
			var av = c.foto ? "<span class=\"av\"><img data-thumb=\"" + esc(c.foto.path) + "\" alt=\"\">" + (c.foto.ausBrief ? "<span class=\"aus-brief\">aus Brief</span>" : "") + "</span>" : "<span class=\"av\">" + esc(c.name.charAt(0).toUpperCase()) + "</span>";
			return "<div class=\"bib-eintrag" + (drin ? " drin" : "") + (waehlbar ? " waehlbar" : "") + "\"" + (waehlbar ? " data-zeile=\"" + esc(c.id) + "\" data-std=\"" + std + "\" tabindex=\"0\" role=\"button\" title=\"Klicken: als " + (std === "mein" ? "dein Char" : std === "haupt" ? "Hauptfigur" : "Nebenfigur") + " übernehmen\"" : "") + ">" + av + "<div class=\"bib-info\"><div class=\"bib-name\">" + esc(c.name) + "</div><div class=\"bib-meta\" title=\"" + esc(c.quelle || "") + "\">" + esc([c.brief ? c.brief.name : "", c.foto && !c.brief ? c.foto.name : ""].filter(Boolean).join(" · ") || "–") + "</div><div class=\"bib-tags\">" + (c.foto ? "<span class=\"tag\">" + (c.foto.ausBrief ? "Bild aus Brief" : "Bild") + "</span>" : "") + (c.brief ? "<span class=\"tag zug\">Charakterbrief</span>" : "") + "</div></div>" + (drin ? "<span class=\"tag gewaehlt\">✓ gewählt · " + esc(fx && fx.mein ? "dein Char" : fx && fx.rolle || "dabei") + "</span>" : "<div class=\"bib-aktion\">" + (mein ? "<button class=\"btn primary small\" type=\"button\" data-import=\"" + esc(c.id) + "\" data-als=\"mein\"" + (hauptVoll && !z.mein ? " disabled" : "") + " title=\"Wird dein Char (Hauptfigur, Du-Form)\">Als mein Char</button></div>" : "<button class=\"btn ghost small\" type=\"button\" data-import=\"" + esc(c.id) + "\" data-als=\"haupt\"" + (hauptVoll ? " disabled title=\"Hauptfiguren voll (4/4)\"" : "") + ">Als Hauptfigur</button><button class=\"btn ghost small\" type=\"button\" data-import=\"" + esc(c.id) + "\" data-als=\"neben\"" + (nebenVoll ? " disabled title=\"Nebenfiguren voll (8/8)\"" : "") + ">Als Nebenfigur</button></div>")) + "</div>";
		}
		box.querySelectorAll("img[data-thumb]").forEach(function(img) {
			var p = img.dataset.thumb;
			if (bib.thumbs[p]) {
				img.src = bib.thumbs[p];
				return;
			}
			API.bibliothekBild(p).then(function(u) {
				if (u) {
					bib.thumbs[p] = u;
					img.src = u;
				}
			});
		});
	}
	function bibOeffnen(art) {
		art = art === "mein" ? "mein" : "andere";
		if (bib.art !== art) {
			bib.art = art;
			bib.eintraege = [];
			bib.dir = "";
		}
		if (!API || !API.scanBibliothek) {
			toast("Die Charakter-Bibliothek gibt es nur in der Lorevia-App.");
			return;
		}
		document.getElementById("bibSuche").value = "";
		bibModal.hidden = false;
		requestAnimationFrame(function() {
			bibModal.classList.add("offen");
		});
		bibNeuLaden();
	}
	function bibSchliessen() {
		bibModal.classList.remove("offen");
		setTimeout(function() {
			bibModal.hidden = true;
		}, 200);
	}
	document.getElementById("bibBtn").addEventListener("click", function() {
		bibOeffnen("andere");
	});
	document.getElementById("meinCharBtn").addEventListener("click", function() {
		bibOeffnen("mein");
	});
	document.getElementById("bibSuche").addEventListener("input", renderBib);
	document.addEventListener("keydown", function(e) {
		if (e.key === "Escape" && !bibModal.hidden) bibSchliessen();
	});
	function bibUebernehmen(id, als, b) {
		var c = bib.eintraege.filter(function(x) {
			return x.id === id;
		})[0];
		if (!c) return;
		var roh = {
			name: c.name,
			rolle: als === "neben" ? "Nebenfigur" : "Hauptfigur",
			mein: als === "mein",
			quelle: c.quelle || ""
		};
		var erl = figurErlaubt(state.figuren, normalizeFigur(roh), -1);
		if (!erl.ok) {
			toast(erl.grund, 7e3);
			return;
		}
		if (b) {
			b.disabled = true;
			b.textContent = "Wird übernommen …";
		}
		API.importCharakter(settings.currentStory, c.foto && c.foto.path, c.brief && c.brief.path).then(function(r) {
			if (r.errors && r.errors.length) toast(r.errors.join(" "), 7e3);
			if(c.vorlage){var selectedMein=roh.mein,selectedRole=roh.rolle;roh=Object.assign({},c.vorlage,{mein:selectedMein,rolle:selectedRole,bezuege:[]});delete roh.id;}
			roh.photo = r.photo;
			roh.brief = r.brief;
			if (roh.photo && c.foto && c.foto.ausBrief) roh.photo.ausBrief = true;
			var ausBrief = c.vorlage ? {figur:roh,felder:[]} : briefInFigur(roh, roh.brief && roh.brief.text);
			roh = ausBrief.figur;
			if (roh.brief) roh.briefBogen = true;
			var fig = normalizeFigur(roh);
			if (fig.mein) state.figuren.forEach(function(x) {
				x.mein = false;
			});
			state.figuren.push(fig);
			save();
			renderFiguren();
			renderBib();
			toast(fig.name + " übernommen" + (fig.mein ? " – das ist jetzt dein Char." : ".") + (ausBrief.felder.length ? " Aus dem Charakterbrief in den Steckbrief: " + ausBrief.felder.join(", ") + (ausBrief.bettErkannt ? " (Im Bett aus dem Text erkannt – änderbar)" : "") + "." : fig.brief && fig.brief.text ? " Charakterbrief gelesen." : fig.brief ? " Brief-Text nicht lesbar." : ""), 8e3);
			fotoBeschreiben(fig);
		}).catch(function(err) {
			if (b) {
				b.disabled = false;
				b.textContent = "Nochmal versuchen";
			}
			toast("Figur konnte nicht übernommen werden: " + (err && err.message || err), 7e3);
		});
	}
	bibModal.addEventListener("click", function(e) {
		if (e.target === bibModal || e.target.closest("[data-schliessen=\"bib\"]")) {
			bibSchliessen();
			return;
		}
		if (e.target.closest("[data-bib]")) {
			bibNeuLaden();
			return;
		}
		var b = e.target.closest("[data-import]");
		if (b) {
			if (!b.disabled) bibUebernehmen(b.dataset.import, b.dataset.als, b);
			return;
		}
		var zl = e.target.closest("[data-zeile]");
		if (zl) bibUebernehmen(zl.dataset.zeile, zl.dataset.std, zl.querySelector("[data-als=\"" + zl.dataset.std + "\"]"));
	});
	bibModal.addEventListener("keydown", function(e) {
		var zl = e.target.closest && e.target.closest("[data-zeile]");
		if (zl && e.target === zl && (e.key === "Enter" || e.key === " ")) {
			e.preventDefault();
			bibUebernehmen(zl.dataset.zeile, zl.dataset.std, zl.querySelector("[data-als=\"" + zl.dataset.std + "\"]"));
		}
	});
	var lpHost={idea:'',read:()=>formRoh(),normalize:normalizeFigur,set:function(key,value){if(key==='housing')setzeWohnen(value);else if(form[key]){form[key].value=value;form[key].dispatchEvent(new Event('input',{bubbles:true}));}},write:function(fig){Object.keys(FELD).forEach(function(k){if(fig[FELD[k]]!==undefined){if(k==='housing')setzeWohnen(fig[FELD[k]]);else if(form[k])form[k].value=fig[FELD[k]];}});},context:()=>({intro:state.intro||'',welt:weltExport(W()),figuren:state.figuren})};
var lpWriteBase=lpHost.write;lpHost.write=function(fig){lpWriteBase(fig);if(fig.hobbys)auswahl.hobbys=fig.hobbys.slice();if(fig.zuege)auswahl.zuege=fig.zuege.slice();if(fig.sexualityLevel)form.sexualityLevel.value=fig.sexualityLevel;if(fig.bedroomStyle)form.bedroomStyle.value=fig.bedroomStyle;renderChips();};
LPInitEditor(lpHost);
document.getElementById('vorlageSpeichern').addEventListener('click',async function(){
 const button=this;const fig=normalizeFigur(formRoh());if(!fig.name){toast('Bitte gib deiner Figur einen Namen.');form.name.focus();return;}
 button.disabled=true;try{const r=await API.saveTemplate(settings.currentStory,fig);if(!r.ok)throw Error(r.error);toast(fig.name+' als wiederverwendbare Vorlage gespeichert.');}catch(e){toast('Vorlage nicht gespeichert: '+e.message,7000);}finally{button.disabled=false;}
 });
	var FELD_LABEL = {
		age: "Alter",
		height: "Größe",
		voiceDesc: "Stimme",
		job: "Beruf",
		housing: "Wohnsituation",
		family: "Eltern/Familie",
		relationships: "Freunde & Bekannte",
		memories: "Frühere Erinnerungen",
		appearance: "Aussehen",
		personality: "Persönlichkeit",
		bio: "Kurz-Bio"
	};
	function entscheidAn() {
		return regeln().entscheidung !== false;
	}
	function offeneFragenFuer(x) {
		var ids = [];
		if (x.mein) ids.push("ziel");
		if (istHaupt(x)) ids.push("bez");
		return FRAGEN.filter(function(f) {
			var st = state.fragen[f.id] || {};
			return ids.indexOf(f.id) >= 0 && !st.ok && !String(st.antwort || "").trim();
		});
	}
	function entscheidStatus() {
		var an = entscheidAn();
		return "<span class=\"entscheid-status " + (an ? "an" : "aus") + "\">Regel „Das entscheidest du“: <strong>" + (an ? "An" : "Aus") + "</strong></span>";
	}
	function entscheidHinweis(n) {
		if (!n) return "Alles ausgefüllt. Die KI hält sich an den Steckbrief.";
		return entscheidAn() ? "Offene Punkte darf die KI selbst festlegen, wenn die Geschichte sie braucht. Danach gelten sie fest." : "Regel ist aus: Die KI legt offene Punkte nicht von sich aus fest (nur wenn die Szene es zwingend braucht). Füll sie aus oder schalte die Regel an.";
	}
	function entscheidZeile(x) {
		var offen = offeneFelder(x), fr = offeneFragenFuer(x);
		if (!offen.length && !fr.length) return "<div class=\"entscheid-zeile\">" + entscheidStatus() + " · Steckbrief vollständig</div>";
		return "<div class=\"entscheid-zeile\">" + entscheidStatus() + " <button type=\"button\" class=\"link-btn\" data-regeln-oeffnen>Regeln öffnen</button>" + (offen.length ? "<div class=\"offen-liste\"><span class=\"offen-titel\">Offen" + (entscheidAn() ? " – entscheidet die KI" : "") + ":</span> " + offen.map(function(o) {
			return "<span class=\"tag offen\">" + esc(o) + "</span>";
		}).join("") + "</div>" : "") + (fr.length ? "<div class=\"offen-liste\"><span class=\"offen-titel\">Offene Fragen:</span> " + fr.map(function(f) {
			return "<span class=\"tag offen\">" + esc(f.q) + "</span>";
		}).join("") + "</div>" : "") + "</div>";
	}
	function renderEntscheidForm() {
		var box = document.getElementById("entscheidForm");
		if (!box || !form || !FELD_LABEL) return;
		var offen = [];
		Object.keys(FELD_LABEL).forEach(function(k) {
			var el = form[k];
			if (!el) return;
			var wrap = el.closest("label") || el.parentNode;
			var relevant = k !== "bio" || form.isPlayer.checked;
			var ki = kiAuswahl.indexOf(FELD[k]) >= 0;
			var leer = relevant && !ki && !(k === "job" && form.noJob.checked) && !String(el.value || "").trim();
			if (wrap) wrap.classList.toggle("offen-feld", leer);
			if (leer) offen.push(FELD_LABEL[k]);
			else if (ki && relevant) offen.push(FELD_LABEL[k] + " (KI)");
		});
		[[
			"hobbyChips",
			"hobbys",
			"Hobbys"
		], [
			"zugChips",
			"zuege",
			"Charakterzüge"
		]].forEach(function(c) {
			var g = document.getElementById(c[0]), ki = kiAuswahl.indexOf(c[1]) >= 0;
			var leer = !ki && !auswahl[c[1]].length;
			if (g && g.closest("fieldset")) g.closest("fieldset").classList.toggle("offen-feld", leer);
			if (leer) offen.push(c[2]);
			else if (ki) offen.push(c[2] + " (KI)");
		});
		if (kiAuswahl.indexOf("bezuege") >= 0) offen.push("Familie (KI)");
		box.innerHTML = "<div class=\"entscheid-kopf\">" + entscheidStatus() + " <button type=\"button\" class=\"link-btn\" data-regeln-oeffnen>In den Regeln ändern</button></div><p class=\"hint klein\">" + esc(entscheidHinweis(offen.length)) + "</p>" + (offen.length ? "<div class=\"offen-liste\"><span class=\"offen-titel\">Noch offen:</span> " + offen.map(function(o) {
			return "<span class=\"tag offen\">" + esc(o) + "</span>";
		}).join("") + "</div>" : "");
	}
	document.getElementById("entscheidForm").addEventListener("click", function(e) {
		if (e.target.closest("[data-regeln-oeffnen]")) regelnZeigen(true);
	});
	form.addEventListener("input", renderEntscheidForm);
	form.addEventListener("change", renderEntscheidForm);
	function uebersichtDaten() {
		var figs = state.figuren.filter(function(x) {
			return x && x.name;
		});
		var mein = figs.filter(function(x) {
			return x.mein;
		})[0] || null;
		var r = regeln();
		return {
			mein,
			hauptfiguren: figs.filter(function(x) {
				return istHaupt(x) && !x.mein;
			}),
			nebenfiguren: figs.filter(function(x) {
				return !istHaupt(x);
			}),
			intro: state.intro || "",
			welt: weltExport(W()),
			fragen: FRAGEN.map(function(f) {
				var st = state.fragen[f.id] || {};
				return {
					id: f.id,
					frage: f.q,
					antwort: st.antwort || "",
					geklaert: !!st.ok || !!String(st.antwort || "").trim()
				};
			}),
			regeln: regelListe(r),
			entscheidung: r.entscheidung !== false,
			zahlen: zaehleFiguren(figs),
			maxHaupt: 4,
			maxNeben: 8
		};
	}
	function zsKurz(t, max) {
		t = String(t || "").replace(/\s+/g, " ").trim();
		return t.length > max ? t.slice(0, max - 1).replace(/\s+\S*$/, "") + " …" : t;
	}
	function zsKarte(x, gross) {
		var teile = [];
		if (x.age) teile.push(/^\d+$/.test(String(x.age).trim()) ? x.age + " J." : x.age);
		if (x.keinBeruf) teile.push("kein Beruf");
		else if (x.job) teile.push(x.job);
		if ((x.zuege || []).length) teile.push(x.zuege.slice(0, 3).join(", "));
		if (teile.length) teile.push("Sexualität: " + sexLabel(x.sexualityLevel));
		var detail = zsKurz(x.mein && x.bio ? x.bio : x.personality || x.notes || x.appearance || "", 150);
		var o = offeneFelder(x), anh = [];
		if (x.photo) anh.push("Bild");
		if (x.brief) anh.push("Charakterbrief");
		var av = x.photo && x.photo.path ? "<span class=\"zs-av foto\"><img data-bild=\"" + esc(x.photo.path) + "\" alt=\"\"></span>" : "<span class=\"zs-av\" style=\"--fc:" + esc(zsFarbe(x)) + "\">" + esc(String(x.name || "?").charAt(0).toUpperCase()) + "</span>";
		return "<div class=\"zs-figur" + (gross ? " gross" : "") + (x.mein ? " mein" : "") + "\">" + av + "<div class=\"zs-figur-info\"><div class=\"zs-figur-name\"><span class=\"farb-swatch\" style=\"background:" + esc(zsFarbe(x)) + "\" title=\"Dialogfarbe\"></span>" + esc(x.name || "Ohne Namen") + (x.mein ? "<span class=\"badge\" title=\"Steuerst du\">dein Char</span>" : "<span class=\"zs-ki\" title=\"Steuert die KI\">KI</span>") + "</div>" + (x.role && x.role !== "Hauptfigur" ? "<div class=\"zs-figur-rolle\">" + esc(x.role) + "</div>" : "") + (teile.length ? "<div class=\"zs-figur-kurz\">" + esc(teile.join(" · ")) + "</div>" : "") + (detail ? "<div class=\"zs-figur-detail\">" + esc(detail) + "</div>" : "") + (anh.length || o.length ? "<div class=\"zs-figur-anh\">" + esc(anh.join(" · ")) + (o.length ? (anh.length ? " · " : "") + "<span class=\"tag offen\" title=\"" + esc(o.join(", ")) + "\">" + o.length + " offen</span>" : "") + "</div>" : "") + "</div></div>";
	}
	function zsFarbe(x) {
		return hexOk(x.color) ? x.color : sprecherFarbe(x.mein ? "du" : x.name, state.figuren) || "#1a1a1a";
	}
	function renderUebersicht() {
		var el = function(id) {
			return document.getElementById(id);
		};
		if (!el("zsLimits")) return;
		var d = uebersichtDaten(), z = d.zahlen;
		el("zsLimits").innerHTML = "<span class=\"limit" + (z.haupt >= d.maxHaupt ? " voll" : "") + "\">Hauptfiguren <b>" + z.haupt + " / " + d.maxHaupt + "</b></span><span class=\"limit" + (z.neben >= d.maxNeben ? " voll" : "") + "\">Nebenfiguren <b>" + z.neben + " / " + d.maxNeben + "</b></span><span class=\"zs-limits-notiz\">max. " + d.maxHaupt + " Haupt (dein Char zählt mit) · " + d.maxNeben + " Neben</span>";
		el("zsSpieler").innerHTML = d.mein ? zsKarte(d.mein, true) : "<div class=\"zs-figur zs-figur-leer\"><p class=\"zs-leer\">Noch kein Char markiert. <button class=\"zs-link\" type=\"button\" data-go=\"figuren\">Jetzt festlegen</button></p></div>";
		el("zsHaupt").innerHTML = d.hauptfiguren.length ? d.hauptfiguren.map(function(x) {
			return zsKarte(x, false);
		}).join("") : "<div class=\"zs-figur zs-figur-leer\"><p class=\"zs-leer\">Keine weiteren Hauptfiguren. Die KI bringt bei Bedarf Figuren ins Spiel.</p></div>";
		var nb = el("zsNeben");
		nb.innerHTML = d.nebenfiguren.length ? "<span class=\"zs-neben-titel\">Nebenfiguren</span>" + d.nebenfiguren.map(function(x) {
			return "<span class=\"zs-neben-chip\"><span class=\"farb-swatch\" style=\"background:" + esc(zsFarbe(x)) + "\"></span>" + esc(x.name) + "</span>";
		}).join("") : "";
		nb.hidden = !d.nebenfiguren.length;
		var st = String(d.intro || "").trim();
		el("zsSetting").innerHTML = st ? st.split(/\n\s*\n/).slice(0, 3).map(function(a) {
			return "<p>" + esc(zsKurz(a, 320)) + "</p>";
		}).join("") : "<p class=\"zs-leer\">Noch kein Intro. Die KI beginnt dann mit einer ruhigen Anfangsszene. <button class=\"zs-link\" type=\"button\" data-go=\"intro\">Intro schreiben</button></p>";
		var offen = d.fragen.filter(function(q) {
			return !q.geklaert;
		}), ok = d.fragen.filter(function(q) {
			return q.geklaert;
		});
		var fz = el("zsFragenZaehler");
		fz.textContent = offen.length ? offen.length + " offen" : "alle geklärt";
		fz.classList.toggle("voll", !offen.length);
		var offenText = d.entscheidung ? "noch offen · „Das entscheidest du“ ist an, die KI darf es festlegen" : "noch offen · bleibt offen, bis du es klärst";
		el("zsFragen").innerHTML = d.fragen.length ? offen.concat(ok).map(function(q) {
			var frage = String(q.frage || "").replace(/\s*\([^)]*\)\s*$/, "");
			if (q.geklaert) return "<li class=\"ok\" title=\"" + esc(q.frage + (q.antwort ? " – " + q.antwort : "")) + "\"><span class=\"zs-frage-mark\" aria-hidden=\"true\">✓</span><span class=\"zs-frage-text\">" + esc(frage) + (q.antwort ? " <span class=\"zs-antwort\">" + esc(zsKurz(q.antwort, 90)) + "</span>" : "") + "</span></li>";
			return "<li class=\"offen\"><span class=\"zs-frage-mark\" aria-hidden=\"true\">?</span><span class=\"zs-frage-text\">" + esc(frage) + "<span class=\"zs-antwort offen\">" + esc(offenText) + "</span></span></li>";
		}).join("") : "<li class=\"zs-leer\">Keine Fragen.</li>";
		var an = d.regeln.filter(function(r) {
			return r.enabled;
		}), aus = d.regeln.filter(function(r) {
			return !r.enabled;
		});
		var fest = an.filter(function(r) {
			return r.locked;
		});
		var schloss = "<svg viewBox=\"0 0 24 24\" width=\"12\" height=\"12\" aria-hidden=\"true\"><rect x=\"5\" y=\"11\" width=\"14\" height=\"10\" rx=\"2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M8 11V8a4 4 0 0 1 8 0v3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>";
		el("zsRegeln").innerHTML = an.filter(function(r) {
			return !r.locked;
		}).map(function(r) {
			return "<span class=\"zs-regel" + (r.id === "duEntscheidest" || r.id === "entscheidung" ? " wichtig" : "") + "\" title=\"" + esc(r.info || r.label) + "\"><i class=\"zs-punkt\"></i>" + esc(r.label) + "</span>";
		}).join("") + (fest.length ? "<span class=\"zs-regel fest\" tabindex=\"0\" title=\"Immer an: " + esc(fest.map(function(r) {
			return r.label;
		}).join(", ")) + "\">" + schloss + fest.length + " feste Grundregeln</span>" : "") || "<p class=\"zs-leer\">Keine Regel aktiv.</p>";
		var ausEl = el("zsRegelnAus");
		ausEl.textContent = aus.length ? "Aus: " + aus.map(function(r) {
			return r.label;
		}).join(", ") : "";
		ausEl.hidden = !aus.length;
		document.getElementById("zsWelt").innerHTML = zsWeltHTML(W());
		var w = [];
		if (z.mein !== 1) w.push("Markiere zuerst deinen Char. Ohne ihn kann die Geschichte nicht starten.");
		if (z.haupt > d.maxHaupt) w.push("Zu viele Hauptfiguren (" + z.haupt + " / " + d.maxHaupt + ").");
		if (z.neben > d.maxNeben) w.push("Zu viele Nebenfiguren (" + z.neben + " / " + d.maxNeben + ").");
		var wEl = el("zsWarnung");
		wEl.textContent = w.join(" ");
		wEl.hidden = !w.length;
		el("geschichteStarten").disabled = !!w.length;
		renderStimmZuordnungen();
		bilderLaden(el("uebersicht"));
	}
	document.getElementById("zsRegelnBtn").addEventListener("click", function() {
		regelnZeigen(true);
	});
	document.getElementById("geschichteStarten").addEventListener("click", function() {
		var z = zaehleFiguren(state.figuren);
		if (z.mein !== 1) {
			toast("Bitte zuerst deinen Char festlegen (Figuren → „Das ist mein Char“).", 7e3);
			go("figuren");
			return;
		}
		if (z.haupt > 4 || z.neben > 8) {
			toast("Zu viele Figuren: höchstens 4 Haupt- und 8 Nebenfiguren.", 7e3);
			go("figuren");
			return;
		}
		if (!state.gestartet) state.gestartet = Date.now();
		if (API) API.saveSettings(settings);
		flushSave();
		go("schreiben");
	});
	window.LoreviaUI = window.LoreviaUI || {};
	window.LoreviaUI.uebersicht = uebersichtDaten;
	window.LoreviaUI.offeneFelder = offeneFelder;
	window.LoreviaUI.entscheidungAn = entscheidAn;
	window.LoreviaUI.limits = LIMITS;
	window.LoreviaUI.maxHaupt = 4;
	window.LoreviaUI.maxNeben = 8;
	window.LoreviaUI.figurenZahl = LIMITS.zaehlen;
	window.LoreviaUI.refreshSummary = renderUebersicht;
	window.LoreviaUI.oeffneBibliothek = bibOeffnen;
	window.LoreviaUI.setDownload = setDownload;
	window.LoreviaUI.hideDownload = hideDownload;
	window.LoreviaUI.farbeVon = function(who) {
		return farbeVon(who);
	};
	window.LoreviaUI.setWriteBg = hgSetzen;
	var intro = document.getElementById("introText");
	function countIntro() {
		var n = intro.value.trim() ? intro.value.trim().split(/\s+/).length : 0;
		document.getElementById("introCounter").textContent = n + (n === 1 ? " Wort" : " Wörter");
	}
	intro.addEventListener("input", function() {
		state.intro = intro.value;
		save();
		countIntro();
	});
	function W() {
		var w = state.welt;
		if (!(w && Array.isArray(w.arten) && Array.isArray(w.staedte) && Array.isArray(w.fakten) && typeof w.rohtext === "string")) state.welt = w = weltNorm(w);
		return w;
	}
	var faktEdit = null;
	var weltArtBox = document.getElementById("weltArten"), weltEigenFeld = document.getElementById("weltEigenFeld"), weltEigen = document.getElementById("weltEigen");
	var weltAnzahl = document.getElementById("weltAnzahl"), stadtListe = document.getElementById("stadtListe");
	var weltText = document.getElementById("weltText"), faktenListe = document.getElementById("faktenListe");
	function renderWeltArten() {
		var w = W();
		weltArtBox.innerHTML = WELT_ARTEN.map(function(a) {
			var an = w.arten.indexOf(a) >= 0;
			return "<button type=\"button\" class=\"chip" + (an ? " an" : "") + "\" data-wert=\"" + esc(a) + "\" aria-pressed=\"" + an + "\">" + esc(a === "Eigenes" ? "Eigenes …" : a) + '<small class="lv-world-help">' + esc(LV_WORLD_HELP[a] || '') + '</small></button>';
		}).join("");
		var n = w.arten.length, z = document.getElementById("weltArtZaehler");
		z.textContent = n ? n + " gewählt" : "keine";
		z.classList.toggle("voll", n > 0);
		weltEigenFeld.hidden = w.arten.indexOf(WELT_EIGEN) < 0;
		weltEigen.value = w.artEigen;
	}
	weltArtBox.addEventListener("click", function(e) {
		var b = e.target.closest(".chip");
		if (!b) return;
		var w = W(), i = w.arten.indexOf(b.dataset.wert);
		if (i >= 0) w.arten.splice(i, 1);
		else w.arten.push(b.dataset.wert);
		save();
		renderWeltArten();
		if (b.dataset.wert === "Eigenes" && !weltEigenFeld.hidden) weltEigen.focus();
	});
	weltEigen.addEventListener("input", function() {
		W().artEigen = weltEigen.value;
		save();
	});
	function renderStaedte(fokus) {
		var w = W();
		weltAnzahl.value = w.staedteAnzahl;
		stadtListe.innerHTML = w.staedte.map(function(s, i) {
			return "<li class=\"stadt-zeile\"><span class=\"stadt-nr\">" + (i + 1) + "</span><input class=\"stadt-name\" data-i=\"" + i + "\" value=\"" + esc(s) + "\" placeholder=\"Name der Stadt, offen lassen geht auch\" aria-label=\"Stadt " + (i + 1) + "\"><button class=\"chip-weg\" type=\"button\" data-weg=\"" + i + "\" aria-label=\"Stadt " + (i + 1) + " entfernen\" title=\"Entfernen\">×</button></li>";
		}).join("") || "<li class=\"stadt-leer\">Noch keine Städte. Die KI entscheidet dann selbst, wie viele es gibt.</li>";
		if (fokus != null) {
			var el = stadtListe.querySelector("[data-i=\"" + fokus + "\"]");
			if (el) el.focus();
		}
	}
	weltAnzahl.addEventListener("change", function() {
		var w = W(), n = Math.max(0, Math.min(50, parseInt(weltAnzahl.value, 10) || 0));
		var benannt = w.staedte.filter(function(x) {
			return x.trim();
		}).length;
		n = Math.max(n, benannt);
		w.staedteAnzahl = n;
		while (w.staedte.length < Math.min(n, 30)) w.staedte.push("");
		for (var i = w.staedte.length - 1; i >= 0 && w.staedte.length > n; i--) if (!w.staedte[i].trim()) w.staedte.splice(i, 1);
		save();
		renderStaedte();
	});
	stadtListe.addEventListener("input", function(e) {
		var el = e.target.closest(".stadt-name");
		if (!el) return;
		W().staedte[+el.dataset.i] = el.value;
		save();
	});
	stadtListe.addEventListener("click", function(e) {
		var b = e.target.closest("[data-weg]");
		if (!b) return;
		var w = W();
		w.staedte.splice(+b.dataset.weg, 1);
		w.staedteAnzahl = Math.max(w.staedte.length, w.staedteAnzahl - 1);
		save();
		renderStaedte();
	});
	document.getElementById("stadtNeu").addEventListener("click", function() {
		var w = W();
		if (w.staedte.length >= 30) {
			toast("Höchstens 30 Städte als Liste. Weitere erfindet die KI.");
			return;
		}
		w.staedte.push("");
		w.staedteAnzahl = Math.max(w.staedteAnzahl, w.staedte.length);
		save();
		renderStaedte(w.staedte.length - 1);
	});
	function weltZaehlen() {
		var t = weltText.value.trim(), n = t ? t.split(/\s+/).length : 0;
		document.getElementById("weltCounter").textContent = n + (n === 1 ? " Wort" : " Wörter");
	}
	weltText.addEventListener("input", function() {
		W().rohtext = weltText.value;
		save();
		weltZaehlen();
	});
	function renderFakten() {
		var w = W(), block = document.getElementById("faktenBlock");
		block.hidden = !w.fakten.length && faktEdit === null;
		document.getElementById("faktenZaehler").textContent = w.fakten.length || "";
		faktenListe.innerHTML = w.fakten.map(function(f) {
			if (faktEdit === f.id) return "<div class=\"fakt bearbeiten\" data-id=\"" + esc(f.id) + "\"><input class=\"fakt-label\" value=\"" + esc(f.label) + "\" placeholder=\"Was? z. B. Herrscher\" aria-label=\"Bezeichnung\"><input class=\"fakt-wert\" value=\"" + esc(f.value) + "\" placeholder=\"Wert, optional\" aria-label=\"Wert\"><button class=\"btn primary small\" type=\"button\" data-fertig>Fertig</button></div>";
			return "<div class=\"fakt" + (f.quelle === "du" ? " von-dir" : "") + "\" data-id=\"" + esc(f.id) + "\"><button class=\"fakt-text\" type=\"button\" data-bearbeiten title=\"Bearbeiten\">" + (f.value ? "<span class=\"fakt-label\">" + esc(f.label) + "</span><span class=\"fakt-wert\">" + esc(f.value) + "</span>" : "<span class=\"fakt-wert\">" + esc(f.label) + "</span>") + "</button><button class=\"chip-weg\" type=\"button\" data-loeschen aria-label=\"Fakt entfernen\" title=\"Entfernen\">×</button></div>";
		}).join("");
		var ed = faktenListe.querySelector(".bearbeiten .fakt-label");
		if (ed && document.activeElement !== ed && !faktenListe.contains(document.activeElement)) ed.focus();
	}
	function faktUebernehmen() {
		var el = faktenListe.querySelector(".fakt.bearbeiten");
		if (!el) return;
		var w = W(), f = w.fakten.filter(function(x) {
			return x.id === el.dataset.id;
		})[0];
		if (!f) return;
		var l = el.querySelector(".fakt-label").value.trim(), v = el.querySelector(".fakt-wert").value.trim();
		if (!l && !v) w.fakten.splice(w.fakten.indexOf(f), 1);
		else {
			if (l !== f.label || v !== f.value) f.quelle = "du";
			f.label = l || v;
			f.value = l ? v : "";
		}
		faktEdit = null;
		save();
		renderFakten();
	}
	faktenListe.addEventListener("click", function(e) {
		var k = e.target.closest(".fakt");
		if (!k) return;
		if (e.target.closest("[data-fertig]")) {
			faktUebernehmen();
			return;
		}
		if (e.target.closest("[data-loeschen]")) {
			var w = W();
			w.fakten = w.fakten.filter(function(x) {
				return x.id !== k.dataset.id;
			});
			save();
			renderFakten();
			return;
		}
		if (e.target.closest("[data-bearbeiten]")) {
			faktUebernehmen();
			faktEdit = k.dataset.id;
			renderFakten();
		}
	});
	faktenListe.addEventListener("keydown", function(e) {
		if (e.key === "Enter" && e.target.closest(".fakt.bearbeiten")) {
			e.preventDefault();
			faktUebernehmen();
		}
		if (e.key === "Escape" && faktEdit) {
			faktEdit = null;
			renderFakten();
		}
	});
	document.getElementById("faktNeu").addEventListener("click", function() {
		faktUebernehmen();
		var f = {
			id: weltId(),
			label: "",
			value: "",
			quelle: "du"
		};
		W().fakten.push(f);
		faktEdit = f.id;
		renderFakten();
	});
	document.getElementById("weltAuswerten").addEventListener("click", function() {
		var b = this, label = b.querySelector("span"), text = weltText.value, w = W();
		w.rohtext = text;
		flushSave();
		if (!text.trim() && !w.arten.length && !w.staedte.some(function(x) {
			return x.trim();
		})) {
			toast("Schreib zuerst etwas über deine Welt.");
			weltText.focus();
			return;
		}
		b.disabled = true;
		b.classList.add("laeuft");
		label.textContent = "Wird ausgewertet …";
		window.LoreviaBridge.analyzeWorldText(text).then(function(r) {
			if (!r || !r.ok) throw r && r.error || 0;
			faktUebernehmen();
			var m = faktenMischen(W(), r.fakten);
			m.welt.rohtext = W().rohtext;
			state.welt = m.welt;
			save();
			renderFakten();
			var n = m.neu, wie = r.quelle === "ki" ? "" : " (ohne KI, nur Stichwörter)";
			toast(n ? n + (n === 1 ? " Fakt" : " Fakten") + " ergänzt" + wie + ". Dein Text bleibt vollständig gespeichert." : "Nichts Neues gefunden. Dein Text bleibt gespeichert.");
		}).catch(function(err) {
			toast("Auswertung hat nicht geklappt" + (typeof err === "string" && err ? ": " + err : ".") + " Dein Text ist gespeichert.");
		}).then(function() {
			b.disabled = false;
			b.classList.remove("laeuft");
			label.textContent = "Struktur vorschlagen";
		});
	});
	function renderWelt() {
		renderWeltArten();
		renderStaedte();
		weltText.value = W().rohtext;
		weltZaehlen();
		renderFakten();
	}
	document.getElementById("weltWeiter").addEventListener("click", function() {
		var b = this;
		b.disabled = true;
		faktUebernehmen();
		window.LoreviaBridge.setWorld(weltExport(W())).then(function(r) {
			if (r && r.ok === false) throw r.error || 0;
			go("fragen");
		}).catch(function(err) {
			toast("Welt konnte nicht gespeichert werden" + (typeof err === "string" && err ? ": " + err : ".") + " Deine Eingaben bleiben im Fenster.");
			go("fragen");
		}).then(function() {
			b.disabled = false;
		});
	});
	function zsWeltHTML(w) {
		if (!w || !weltHatInhalt(w)) return "<p class=\"zs-leer\">Keine Welt festgelegt. Die KI richtet sich nach deinem Intro. <button class=\"zs-link\" type=\"button\" data-go=\"welt\">Welt gestalten</button></p>";
		var arten = w.arten.filter(function(a) {
			return a !== WELT_EIGEN;
		}).concat(w.artEigen && w.arten.indexOf("Eigenes") >= 0 ? [w.artEigen] : []);
		var orte = w.staedte.map(function(x) {
			return String(x).trim();
		}).filter(Boolean), rest = Math.max(0, w.staedteAnzahl - orte.length);
		var h = "";
		if (arten.length) h += "<div class=\"zs-welt-arten\">" + arten.map(function(a) {
			return "<span class=\"zs-welt-art\">" + esc(a) + "</span>";
		}).join("") + "</div>";
		if (w.staedteAnzahl || orte.length) h += "<p class=\"zs-welt-zeile\"><span class=\"zs-welt-titel\">" + (w.staedteAnzahl || orte.length) + ((w.staedteAnzahl || orte.length) === 1 ? " Stadt" : " Städte") + "</span>" + esc(orte.join(" · ")) + (rest ? "<span class=\"zs-welt-rest\">" + (orte.length ? " + " : "") + rest + " offen</span>" : "") + "</p>";
		var fk = w.fakten.filter(function(f) {
			return !/^(weltart|städte|staedte)$/i.test(f.label);
		});
		if (fk.length) h += "<div class=\"zs-welt-fakten\">" + fk.slice(0, 4).map(function(f) {
			return "<span class=\"zs-welt-fakt\">" + (f.value ? "<b>" + esc(f.label) + "</b> " + esc(f.value) : esc(f.label)) + "</span>";
		}).join("") + (fk.length > 4 ? "<span class=\"zs-welt-fakt mehr\">+" + (fk.length - 4) + "</span>" : "") + "</div>";
		if (w.rohtext.trim()) h += "<p class=\"zs-welt-roh\">" + esc(zsKurz(w.rohtext, 180)) + "</p>";
		return h;
	}
	window.LoreviaUI.getWorld = function() {
		return weltExport(W());
	};
	window.LoreviaUI.setWorld = function(d) {
		return window.LoreviaBridge.setWorld(d).then(function(r) {
			renderWelt();
			return r;
		});
	};
	function renderFragen() {
		document.getElementById("fragenListe").innerHTML = FRAGEN.map(function(f) {
			var s = state.fragen[f.id] || {};
			return "<div class=\"frage" + (s.ok ? " ok" : "") + "\" data-id=\"" + f.id + "\"><label class=\"q\"><input type=\"checkbox\"" + (s.ok ? " checked" : "") + "> <span>" + esc(f.q) + "</span></label><textarea rows=\"2\" placeholder=\"Deine Antwort (optional)\">" + esc(s.antwort || "") + "</textarea></div>";
		}).join("");
  document.querySelectorAll('#fragenListe .frage').forEach(function(box) {
    var button=document.createElement('button'); button.type='button'; button.className='btn ghost small'; button.textContent='✦ KI entscheidet';
    button.addEventListener('click',function(){lvAskSetup('frage',box.dataset.id,button);}); box.appendChild(button);
  });
	}
	document.getElementById("fragenListe").addEventListener("input", function(e) {
		var box = e.target.closest(".frage");
		if (!box) return;
		var id = box.dataset.id, s = state.fragen[id] || (state.fragen[id] = {});
		if (e.target.type === "checkbox") {
			s.ok = e.target.checked;
			box.classList.toggle("ok", s.ok);
		} else s.antwort = e.target.value;
		save();
	});
	var storyEl = document.getElementById("story");
	function kiFiguren() {
		return state.figuren.filter(function(x) {
			return !x.mein;
		}).map(function(x) {
			return x.name;
		});
	}
	function anwesend() {
		return state.anwesend ? state.anwesend.slice() : kiFiguren();
	}
	function renderSide() {
 lvRenderEntry();
		var ul = document.getElementById("sideFiguren");
		if (!state.figuren.length) ul.innerHTML = "<li class=\"ki\">Noch keine Figuren. Leg sie unter „1 · Figuren“ an.</li>";
		else {
			var da = anwesend();
			ul.innerHTML = state.figuren.map(function(x) {
				if (x.mein) return "<li class=\"du\">" + swatch(x.color || "#1a1a1a") + esc(x.name) + " (du)</li>";
				var im = da.indexOf(x.name) >= 0;
				return "<li class=\"" + (im ? "" : "weg") + "\">" + swatch(x.color) + esc(x.name) + "<span class=\"ki\">KI</span>" + (STIMMEN_AUS ? "" : "<span class=\"side-stimme\" title=\"Vorlese-Stimme\">" + esc(x.voiceId ? stimmName(x.voiceId) : "auto") + "</span>") + "<button type=\"button\" data-raum=\"" + esc(x.name) + "\" title=\"Umschalten\">" + (im ? "im Raum" : "weg") + "</button></li>";
			}).join("");
		}
		renderLegende();
		document.getElementById("korrGemerkt").textContent = state.korrekturen.length ? "Gemerkt: " + state.korrekturen.join(", ") : "";
		document.getElementById("weltPause").textContent = paused ? "Weiterlaufen lassen" : "Pause";
		renderRegelnKurz();
		var sk = document.getElementById("speicherKurz");
		if (sk) {
			var sp = state.speicher, n = 0;
			if (sp && sp.figuren) for (var k in sp.figuren) n += Object.keys(sp.figuren[k].fakten || {}).length;
			var ort = sp && sp.szene && sp.szene.ort;
			var ent = sp && (sp.entscheidungen || []).length;
			sk.textContent = sp ? n + " Fakten gemerkt" + (ent ? " · " + ent + " Entscheidungen" : "") + (ort ? " · Ort: " + ort : "") + ((state.anhange || []).length ? " · " + state.anhange.length + " Anhänge" : "") : "Füllt sich beim Schreiben.";
		}
	}
	document.getElementById("sideFiguren").addEventListener("click", function(e) {
		var n = e.target.dataset.raum;
		if (n === void 0) return;
		var da = anwesend(), i = da.indexOf(n);
		if (i >= 0) da.splice(i, 1);
		else da.push(n);
		state.anwesend = da;
		if (state.speicher && state.speicher.figuren && state.speicher.figuren[n]) {
			var f = state.speicher.figuren[n];
			f.anwesend = da.indexOf(n) >= 0;
			if (f.anwesend) delete f.weg;
			else f.weg = {
				abschnitt: state.turn,
				grund: "von dir auf „weg“ gesetzt"
			};
		}
		save();
		renderSide();
	});
	function blockHTML(b, isNew, i) {
		if (b.type === "scene") return "<hr class=\"scene\">";
		if (b.type === "image") return imageHTML(b, isNew);
		if (b.type === "document") return docHTML(b, isNew);
		if (b.type === "room" || b.type === "outfit") {
			if (b.who !== "du") return "";
			return b.type === "room" ? raumKarte(b, " you" + (isNew ? " new" : "")) : outfitKarte(b, " you" + (isNew ? " new" : ""));
		}
		if (b.type === "song") {
			var du = b.who === "du" || b.from === "anhang" ? " you" : "";
			var yt = ytUrl(b.url);
			var titel = esc(b.title || "Lied");
			var tlink = yt ? "<a class=\"lied-titel\" href=\"" + esc(yt) + "\" target=\"_blank\" rel=\"noopener\" title=\"Auf YouTube öffnen\">" + titel + "</a>" : "<span class=\"lied-titel\">" + titel + "</span>";
			return "<div class=\"story-lied" + du + (isNew ? " new" : "") + "\"><span class=\"lied-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\"><path d=\"M9 18V5l11-2v13\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><circle cx=\"6\" cy=\"18\" r=\"3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"/><circle cx=\"17\" cy=\"16\" r=\"3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"/></svg></span><span class=\"lied-info\"><span class=\"lied-meta\">Lied · YouTube</span>" + tlink + (b.text ? "<p class=\"lied-bezug\">" + esc(b.text) + "</p>" : "") + "</span></div>";
		}
		if (b.type === "note") return "<p class=\"note" + (isNew ? " new" : "") + "\">" + esc(b.text) + "</p>";
		var cls = [
			b.type === "speech" ? "speech" : "action",
			b.who === "du" ? "you" : "",
			isNew ? "new" : ""
		].join(" ").trim();
		if (b.type === "speech") {
			var wer = sprecherVon(b, i === void 0 ? -1 : i), farbe = wer ? farbeVon(wer) : "";
			if (farbe) return "<p class=\"" + cls + "\" data-who=\"" + esc(wer) + "\" style=\"color:" + farbe + "\">" + inline(b.text) + "</p>";
		}
		return "<p class=\"" + cls + "\">" + inline(b.text) + "</p>";
	}
	function renderStory() {
		if (!Array.isArray(state.verlauf)) state.verlauf = [];
		storyEl.innerHTML = state.verlauf.length ? state.verlauf.map(function(b, i) {
			return blockHTML(b, false, i);
		}).join("") : "<p class=\"wait\">Die Geschichte beginnt, sobald die KI bereit ist.</p>";
		hydrateImages();
		storyEl.scrollTop = storyEl.scrollHeight;
	}
	var imgCache = {}, pending = [];
	function attId(b) {
		return b.id || b.path || b.name;
	}
	function endung(name) {
		var m = /\.([a-z0-9]{1,5})$/i.exec(name || "");
		return m ? m[1].toUpperCase() : "DOK";
	}
	function imageHTML(b, isNew) {
		var src = b.src && /^data:/.test(b.src) ? b.src : imgCache[b.path] || "";
		var d = b.beschreibung || "", du = b.who === "du" || b.from === "anhang" ? " you" : "";
		if (!b.path && !src) return "<figure class=\"story-bild fehlt" + du + (isNew ? " new" : "") + "\"><div class=\"bild-fehlt\">Bild nicht mehr verfügbar</div></figure>";
		return "<figure class=\"story-bild" + du + (isNew ? " new" : "") + "\" data-att=\"" + esc(attId(b)) + "\"><img alt=\"" + esc(b.alt || b.name || "Bild") + "\"" + (src ? " src=\"" + esc(src) + "\"" : "") + " data-path=\"" + esc(b.path || "") + "\"><figcaption>" + esc(b.name || "Bild") + (API ? "<button type=\"button\" class=\"bild-knopf\" data-beschreiben=\"" + esc(attId(b)) + "\">" + (d ? "neu beschreiben" : "Bild beschreiben") + "</button>" : "") + (d ? "<span class=\"beschreibung\">" + esc(d) + "</span>" : "") + "</figcaption></figure>";
	}
	function docHTML(b, isNew) {
		var a = findAnhang(attId(b)) || b;
		var info = a.textInfo || (a.text ? "Inhalt gelesen" : "Dokument");
		return "<button type=\"button\" class=\"story-dok" + (b.who === "du" || b.from === "anhang" ? " you" : "") + (isNew ? " new" : "") + "\" data-oeffnen=\"" + esc(b.path || "") + "\"><span class=\"dok-icon\">" + esc(endung(b.name)) + "</span><span class=\"dok-info\"><span class=\"dok-name\">" + esc(b.name || "Dokument") + "</span><span class=\"dok-meta\">" + esc(info) + (b.path ? " · öffnen" : "") + "</span></span></button>";
	}
	function ladeBild(p) {
		if (!API || !API.readAttachment || !p) return Promise.resolve(null);
		if (imgCache[p]) return Promise.resolve(imgCache[p]);
		return API.readAttachment(p).then(function(u) {
			if (u) imgCache[p] = u;
			return u;
		});
	}
	function hydrateImages() {
		roHydrate(storyEl);
		storyEl.querySelectorAll("figure.story-bild img:not([src])").forEach(function(img) {
			var p = img.dataset.path;
			if (!p) return;
			ladeBild(p).then(function(u) {
				if (u) img.src = u;
				else {
					var f = img.closest("figure");
					if (f) {
						f.classList.add("fehlt");
						img.outerHTML = "<div class=\"bild-fehlt\">Bild nicht mehr verfügbar</div>";
					}
				}
			});
		});
	}
	function findAnhang(id) {
		for (var i = 0; i < (state.anhange || []).length; i++) {
			var a = state.anhange[i];
			if (a.id === id || a.path === id) return a;
		}
		return null;
	}
	function setInfo(t) {
		var el = document.getElementById("transferInfo");
		if (el) el.textContent = t || "";
	}
	var hinweisTimer = null;
	function zeigeHinweis(t) {
		var el = document.getElementById("anhangHinweis");
		el.textContent = t;
		el.hidden = !t;
		clearTimeout(hinweisTimer);
		hinweisTimer = setTimeout(function() {
			el.hidden = true;
		}, 9e3);
	}
	function renderPending() {
		var box = document.getElementById("anhangLeiste");
		box.hidden = !pending.length;
		box.innerHTML = pending.map(function(a, i) {
			return "<div class=\"anhang-chip\">" + (a.kind === "image" ? "<img alt=\"\"" + (imgCache[a.path] ? " src=\"" + esc(imgCache[a.path]) + "\"" : "") + ">" : "<span class=\"dok-icon klein\">" + esc(endung(a.name)) + "</span>") + "<span class=\"chip-name\" title=\"" + esc(a.name + (a.textInfo ? " – " + a.textInfo : "")) + "\">" + esc(a.name) + "</span><button type=\"button\" class=\"chip-weg\" data-weg=\"" + i + "\" aria-label=\"" + esc(a.name) + " entfernen\" title=\"Entfernen\">×</button></div>";
		}).join("");
	}
	document.getElementById("anhangLeiste").addEventListener("click", function(e) {
		var i = e.target.dataset.weg;
		if (i === void 0) return;
		pending.splice(+i, 1);
		renderPending();
		eingabe.focus();
	});
	function vormerken(files, errors) {
		if (errors && errors.length) zeigeHinweis(errors.join(" "));
		if (!files || !files.length) return;
		files.forEach(function(f) {
			f.kind = f.kind || (/^image\//.test(f.mime || "") ? "image" : "document");
			pending.push(f);
			if (f.kind === "image") {
				ladeBild(f.path).then(renderPending);
				if (ki.ready) beschreibeDatei(f, true);
			}
		});
		renderPending();
		resetIdle();
		eingabe.focus();
	}
	function speicherBild(id, text) {
		if (!state.speicher) state.speicher = {
			version: 1,
			figuren: {},
			szene: {
				ort: "",
				zeit: ""
			},
			beziehungen: [],
			bilder: {},
			verlauf: []
		};
		if (!state.speicher.bilder) state.speicher.bilder = {};
		state.speicher.bilder[id] = text;
	}
	function beschreibeDatei(f, still) {
		if (!API || !API.describeImage) return Promise.resolve(null);
		f.beschreibt = true;
		return API.describeImage(f.path, { model: settings.visionModel || settings.model }).then(function(r) {
			f.beschreibt = false;
			if (!r || !r.ok) {
				if (!still) setIdle("Bild beschreiben ging nicht: " + (r && r.error || "unbekannt"), false);
				return null;
			}
			f.beschreibung = r.text;
			state.verlauf.forEach(function(x) {
				if (x.type === "image" && attId(x) === f.id) x.beschreibung = r.text;
			});
			var a = findAnhang(f.id);
			if (a) a.beschreibung = r.text;
			speicherBild(f.id, r.text);
			save();
			if (a) {
				renderStory();
				renderSide();
			}
			return r.text;
		});
	}
	function beschreiben(id) {
		var b = null;
		state.verlauf.forEach(function(x) {
			if (x.type === "image" && attId(x) === id) b = x;
		});
		if (!b) return;
		var btn = storyEl.querySelector("[data-beschreiben=\"" + cssEsc(id) + "\"]");
		if (btn) {
			btn.disabled = true;
			btn.textContent = "beschreibe …";
		}
		beschreibeDatei(findAnhang(id) || {
			id,
			path: b.path
		}, false).then(function(t) {
			if (t) return;
			if (btn) {
				btn.disabled = false;
				btn.textContent = "Bild beschreiben";
			}
		});
	}
	function cssEsc(s) {
		return String(s).replace(/["\\]/g, "\\$&");
	}
	function nurApp() {
		zeigeHinweis("Anhänge gehen nur in der Lorevia-App.");
	}
	function pickAnhang() {
		if (!API || !API.pickFiles) return nurApp();
		API.pickFiles({
			accept: "image/*,.pdf,.txt,.md,.docx",
			storyId: settings.currentStory,
			withErrors: true
		}).then(function(r) {
			vormerken(r.files, r.errors);
		}).catch(function(e) {
			zeigeHinweis("Dateien konnten nicht geöffnet werden: " + (e && e.message || e));
		});
	}
	function dateienRein(fileList) {
		if (!API || !API.addFiles) return nurApp();
		API.addFiles(settings.currentStory, fileList).then(function(r) {
			vormerken(r.files, r.errors);
		}).catch(function(e) {
			zeigeHinweis("Einfügen fehlgeschlagen: " + (e && e.message || e));
		});
	}
	storyEl.addEventListener("click", function(e) {
		var t = e.target.closest("[data-beschreiben]");
		if (t) {
			beschreiben(t.dataset.beschreiben);
			return;
		}
		var o = e.target.closest("[data-oeffnen]");
		if (o && o.dataset.oeffnen && API && API.openAttachment) API.openAttachment(o.dataset.oeffnen);
	});
	(function() {
		var comp = document.querySelector(".composer"), wrap = storyEl.parentNode;
		function hatDateien(e) {
			return e.dataTransfer && [].indexOf.call(e.dataTransfer.types || [], "Files") >= 0;
		}
		["dragenter", "dragover"].forEach(function(ev) {
			wrap.addEventListener(ev, function(e) {
				if (hatDateien(e)) {
					e.preventDefault();
					comp.classList.add("drop");
				}
			});
		});
		wrap.addEventListener("dragleave", function(e) {
			if (!wrap.contains(e.relatedTarget)) comp.classList.remove("drop");
		});
		wrap.addEventListener("drop", function(e) {
			comp.classList.remove("drop");
			if (!e.dataTransfer || !e.dataTransfer.files.length) return;
			e.preventDefault();
			dateienRein(e.dataTransfer.files);
		});
		document.getElementById("eingabe").addEventListener("paste", function(e) {
			var files = e.clipboardData && e.clipboardData.files;
			if (files && files.length) {
				e.preventDefault();
				dateienRein(files);
			}
		});
	})();
	function append(blocks) {
		var w = storyEl.querySelector("p.wait");
		if (w) w.remove();
		var vorher = state.verlauf.length;
		blocks.forEach(function(b) {
			state.verlauf.push(b);
			storyEl.insertAdjacentHTML("beforeend", blockHTML(b, true, state.verlauf.length - 1));
		});
		save();
		storyEl.scrollTo({
			top: storyEl.scrollHeight,
			behavior: "smooth"
		});
		vorlesen(vorher);
	}
	function replaceLast(blocks) {
		var v = state.verlauf, keep = [];
		while (v.length && (v[v.length - 1].from === "eingabe" || v[v.length - 1].from === "anhang")) {
			var x = v.pop();
			if (x.from === "anhang") keep.unshift(x);
		}
		if (v.length) {
			var t = v[v.length - 1].turn;
			while (v.length && v[v.length - 1].from !== "eingabe" && v[v.length - 1].turn === t) v.pop();
		}
		var ab = v.length;
		blocks.forEach(function(b) {
			v.push(b);
		});
		keep.forEach(function(b) {
			v.push(b);
		});
		save();
		renderStory();
		stimmenStopp();
		vorlesen(ab);
	}
	var ENTSCHEIDUNG_RE = /\b(?:(?:das|dies|es|den rest|alles weitere|wie es weitergeht)\s+)?entscheidest\s+du(?!\s+dich)(?:\s+(?:selbst|allein|einfach))?\b(?!\s*\?)|\bentscheid(?:e)?\s+du(?:\s+(?:das|selbst|einfach|mal))?\b|\bdu\s+entscheidest(?=\s*(?:[.!…]|$|\s+(?:das|es|hier|jetzt|selbst|allein|wer|was|wie|ob|wohin|welche[nrs]?|über|für)\b))|\bentscheide\s+(?:du\s+)?(?:selbst|allein|für mich)\b|\bdu\s+darfst\s+(?:das\s+|es\s+)?(?:selbst\s+|frei\s+)?entscheiden\b|\b(?:das\s+|es\s+)?überlass(?:e)?\s+(?:ich\s+)?dir(?:\s+die\s+entscheidung)?\b|\b(?:das\s+ist\s+)?deine\s+entscheidung\b|\b(?:das\s+)?liegt\s+(?:ganz\s+)?bei\s+dir\b|\bsuch\s+du\s+(?:es\s+)?aus\b|\bdu\s+(?:suchst|wählst)\s+(?:das\s+|es\s+)?aus\b/i;
	function istEntscheidung(t) {
		return ENTSCHEIDUNG_RE.test(String(t || "").replace(/[„"“»][^"“”«]*["“”«]/g, " "));
	}
	function lvBaseParseEingabe(t) {
		if (!regeln().entscheidung) return parseEingabeRoh(t);
		var out = [], notiz = null;
		parseEingabeRoh(t).forEach(function(b) {
			if (b.type !== "action" || !ENTSCHEIDUNG_RE.test(b.text)) {
				out.push(b);
				return;
			}
			var saetze = b.text.split(/(?<=[.!?…])\s+/), davor = [];
			saetze.forEach(function(x) {
				if (!ENTSCHEIDUNG_RE.test(x)) {
					davor.push(x);
					return;
				}
				if (davor.length) {
					out.push({
						type: "action",
						who: "du",
						from: "eingabe",
						text: davor.join(" ")
					});
					davor = [];
				}
				notizSatz(x);
			});
			if (davor.length) out.push({
				type: "action",
				who: "du",
				from: "eingabe",
				text: davor.join(" ")
			});
		});
		function notizSatz(satz) {
			var rest = satz.replace(new RegExp(ENTSCHEIDUNG_RE.source, "gi"), " ").replace(/\s*,\s*(?=[.!?…]|$)/g, "").replace(/\s{2,}/g, " ").replace(/^[\s.,!?…;:–-]+|[\s.,!?…;:–-]+$/g, "").trim();
			if (!notiz) {
				notiz = {
					type: "note",
					who: "du",
					from: "eingabe",
					eingabe: satz,
					teile: []
				};
				out.push(notiz);
			} else notiz.eingabe += " " + satz;
			if (rest) notiz.teile.push(rest);
		}
		if (notiz) {
			notiz.text = "(Du überlässt die Entscheidung der KI" + (notiz.teile.length ? ": " + notiz.teile.join("; ") : "") + ".)";
			delete notiz.teile;
		}
		return out;
	}
function parseEingabe(text) {
  var raw=lvSplitInput(text).storyText;
  if (regeln().entscheidung && istEntscheidung(raw)) return lvBaseParseEingabe(raw).map(function(b){return b.type==='action'?Object.assign({},b,{text:lvToDuNarration(b.text)}):b;});
  return lvOwnInputBlocks(text);
}
	function parseEingabeRoh(t) {
		var out = [], re = /[„"“»]([^"“”«]+)["“”«]/g, last = 0, m;
		function act(s) {
			s = s.trim();
			if (s) splitSentences(s).forEach(function(x) {
				out.push({
					type: "action",
					who: "du",
					from: "eingabe",
					text: x
				});
			});
		}
		while (m = re.exec(t)) {
			act(t.slice(last, m.index));
			out.push({
				type: "speech",
				who: "du",
				from: "eingabe",
				text: m[1].trim()
			});
			last = re.lastIndex;
		}
		act(t.slice(last));
		return out;
	}
	function splitSentences(s) {
		var parts = s.match(/[^.!?…]+[.!?…]+["”“]?|\S[^.!?…]*$/g) || [s], res = [], cur = "";
		parts.forEach(function(p) {
			p = p.trim();
			var n = cur ? cur + " " + p : p;
			if (cur && (n.split(/[.!?…]/).length > 3 || n.length > 160)) {
				res.push(cur);
				cur = p;
			} else cur = n;
		});
		if (cur) res.push(cur);
		return res;
	}
	var busy = false, paused = false, autoTicks = 0;
	function maybeStart() {
		if (!state.verlauf.length && ki.ready && !busy && state.figuren.length) weiter("idle");
	}
	function weiter(trigger, eingabe, neu) {
		if (busy) return;
		busy = true;
		stopIdle();
		if (!ki.ready) {
			busy = false;
			renderKI();
			setIdle("Die KI ist noch nicht bereit (siehe links „KI“).", true);
			return;
		}
		setIdle(trigger === "user" ? "Die anderen reagieren …" : "Die Welt bewegt sich …", true);
		document.getElementById("senden").disabled = true;
		var ctx = {
			trigger,
regie: state.regie || [],
spielerAbwesend: state.spielerAbwesend === true,
			eingabe: eingabe || "",
			figuren: state.figuren,
			intro: state.intro,
			welt: weltExport(W()),
			fragen: state.fragen,
			verlauf: state.verlauf,
			anwesend: state.anwesend,
			korrekturen: state.korrekturen,
			speicher: state.speicher,
			turn: state.turn,
			regeln: regeln(),
			entscheidung: trigger === "user" && regeln().entscheidung && istEntscheidung(eingabe),
			anhange: (neu || []).map(function(f) {
				return {
					id: f.id,
					name: f.name,
					mime: f.mime,
					path: f.path,
					kind: f.kind
				};
			}),
			alleAnhange: state.anhange || []
		};
		var ro = raumOutfitKontext();
		ctx.kontext = ro.kontext;
		ctx.raum = ro.raum;
		ctx.outfits = ro.outfits;
		var ok = true;
		window.LoreviaBridge.continueStory(JSON.parse(JSON.stringify(ctx))).then(function(blocks) {
			blocks = blocks || [];
			state.wartetAufSpieler = blocks.warteAufSpieler === true;
if (blocks.korrekturen) state.korrekturen = blocks.korrekturen;
			if (blocks.speicher) state.speicher = blocks.speicher;
			if (blocks.anwesend) state.anwesend = blocks.anwesend;
			var turn = ++state.turn, kind = trigger === "user" ? "player" : "tick";
			var tagged = blocks.filter(function(b) {
				return b && b.type !== "image" && b.type !== "document" && b.type !== "room" && b.type !== "outfit";
			}).map(function(b) {
				var o = {
					type: b.type,
					text: b.text,
					turn,
					kind
				};
				if (b.who === "du") o.who = "du";
				return o;
			});
			if (blocks.rewrite) replaceLast(tagged);
			else append(tagged);
			autoTicks = trigger === "idle" ? autoTicks + 1 : 0;
			if (blocks.entscheidung) zeigeHinweis("Entschieden: " + (blocks.entscheidung.wer ? blocks.entscheidung.wer + " – " : "") + blocks.entscheidung.was);
			else if (blocks.verworfen && blocks.verworfen.length) zeigeHinweis(blocks.verworfen.length + " regelwidrige Satz/Sätze verworfen. Deine eigene Eingabe bleibt erhalten.");
			renderSide();
		}).catch(function(err) {
			ok = false;
			setIdle("Fortsetzung nicht übernommen: " + (err && err.message || "Bitte erneut versuchen."), false);
			if (API) checkKI();
		}).then(function() {
			busy = false;
			document.getElementById("senden").disabled = false;
			if (ok) resetIdle();
		});
	}
	var eingabe = document.getElementById("eingabe");
	function senden() {
		var t = eingabe.value.trim();
		if (!t && !pending.length || busy) return;
  var parsedInput; try {parsedInput=lvSplitInput(t);} catch(error){toast(error.message,7000);return;}
  state.regie=lvMergeDirections(state.regie,parsedInput.directions); state.wartetAufSpieler=false;
  save();
		if (stimmen.spielt || stimmen.queue.length) stimmenStopp();
		if (t && !pending.length && regeln().auswertung && istAuswertungsWunsch(t)) {
			eingabe.value = "";
			oeffneAuswertung(true);
			return;
		}
		if (!ki.ready && pending.length) {
			setIdle("Die KI ist noch nicht bereit (siehe links „KI“).", true);
			return;
		}
		if (state.spielerAbwesend && lvIsEntryInput(t)) { state.spielerAbwesend = false; save(); lvRenderEntry(); }
if (!Array.isArray(state.anhange)) state.anhange = [];
		var neu = pending.splice(0);
		var blocks = neu.map(function(f) {
			var a = {
				id: f.id,
				name: f.name,
				mime: f.mime,
				path: f.path,
				kind: f.kind,
				size: f.size
			};
			if (f.text) a.text = f.text;
			if (f.textInfo) a.textInfo = f.textInfo;
			if (f.beschreibung) a.beschreibung = f.beschreibung;
			state.anhange.push(a);
			if (f.beschreibung) speicherBild(f.id, f.beschreibung);
			return f.kind === "image" ? {
				type: "image",
				id: f.id,
				name: f.name,
				alt: f.name,
				mime: f.mime,
				path: f.path,
				who: "du",
				from: "anhang",
				beschreibung: f.beschreibung
			} : {
				type: "document",
				id: f.id,
				name: f.name,
				mime: f.mime,
				path: f.path,
				who: "du",
				from: "anhang"
			};
		});
		renderPending();
		if (t) blocks = blocks.concat(parseEingabe(t));
		append(blocks);
		hydrateImages();
		eingabe.value = "";
		weiter("user", t, neu);
	}
	document.getElementById("senden").addEventListener("click", senden);
	document.getElementById("anhangBtn").addEventListener("click", pickAnhang);
	var FAKTEN = [
		["nachname", "Nachname"],
		["haarfarbe", "Haarfarbe"],
		["augenfarbe", "Augenfarbe"],
		["haare", "Haare"],
		["augen", "Augen"],
		["alter", "Alter"],
		["aussehen", "Aussehen"],
		["kleidung", "Kleidung"],
		["beruf", "Beruf"],
		["wohnort", "Wohnort"],
		["groesse", "Größe"],
		["stimme", "Stimme"],
		["wohnsituation", "Wohnsituation"],
		["familie", "Eltern/Familie"],
		["hobbys", "Hobbys"],
		["zuege", "Charakterzüge"],
		["sonstiges", "Sonstiges"]
	];
	function leererSpeicher() {
		return {
			version: 1,
			figuren: {},
			szene: {
				ort: "",
				zeit: ""
			},
			beziehungen: [],
			bilder: {},
			verlauf: [],
			entscheidungen: [],
			auswertungen: []
		};
	}
	function oeffneSpeicher() {
		var sp = state.speicher || leererSpeicher(), da = anwesend();
		var html = "";
		state.figuren.forEach(function(x) {
			var f = (sp.figuren || {})[x.name] || {
				fakten: {},
				wissen: []
			};
			html += "<div class=\"speicher-figur\" data-figur=\"" + esc(x.name) + "\"><h3>" + esc(x.name) + (x.mein ? " <small>(du)</small>" : " <label><input type=\"checkbox\" data-feld=\"anwesend\"" + (da.indexOf(x.name) >= 0 ? " checked" : "") + "> in der Szene</label>") + "</h3><div class=\"speicher-grid\">" + FAKTEN.map(function(k) {
				return "<label>" + k[1] + "<input data-fakt=\"" + k[0] + "\" value=\"" + esc((f.fakten || {})[k[0]] || "") + "\"></label>";
			}).join("") + "<label>Raum<input data-feld=\"raum\" value=\"" + esc(f.raum || "") + "\" placeholder=\"z. B. Küche\"></label></div><label class=\"feld\">Weiß (eine Sache pro Zeile)<textarea rows=\"2\" data-feld=\"wissen\">" + esc((f.wissen || []).join("\n")) + "</textarea></label></div>";
		});
		if (!state.figuren.length) html += "<p class=\"empty\">Noch keine Figuren.</p>";
		html += "<div class=\"speicher-grid\"><label class=\"feld\">Ort der Szene<input id=\"spOrt\" value=\"" + esc(sp.szene && sp.szene.ort || "") + "\"></label><label class=\"feld\">Zeit<input id=\"spZeit\" value=\"" + esc(sp.szene && sp.szene.zeit || "") + "\"></label></div>";
		html += "<label class=\"feld\">Beziehungen (eine pro Zeile: Mara ↔ Jona: Geschwister)<textarea id=\"spBez\" rows=\"3\">" + esc((sp.beziehungen || []).map(function(b) {
			return b.a + " ↔ " + b.b + ": " + b.art;
		}).join("\n")) + "</textarea></label>";
		var bilder = (state.anhange || []).filter(function(a) {
			return a.kind === "image";
		});
		if (bilder.length) html += "<h3>Bilder</h3>" + bilder.map(function(a) {
			return "<label class=\"feld\">" + esc(a.name) + "<textarea rows=\"2\" data-bild=\"" + esc(a.id) + "\">" + esc((sp.bilder || {})[a.id] || a.beschreibung || "") + "</textarea></label>";
		}).join("");
		if ((sp.entscheidungen || []).length) html += "<h3>Entscheidungen der KI (gelten fest)</h3><ul class=\"speicher-log\">" + sp.entscheidungen.slice(-10).reverse().map(function(e) {
			return "<li><b>" + esc(e.wer || "") + "</b>" + (e.wer ? " – " : "") + esc(e.was || "") + (e.warum ? " <i>(" + esc(e.warum) + ")</i>" : "") + "</li>";
		}).join("") + "</ul>";
		var la = (sp.auswertungen || []).slice(-1)[0];
		if (la) html += "<h3>Letzte Auswertung des Gesprochenen</h3>" + auswertungHTML(la, true);
		if ((sp.verlauf || []).length) html += "<h3>Zuletzt gemerkt</h3><ul class=\"speicher-log\">" + sp.verlauf.slice(-8).reverse().map(function(v) {
			return "<li>" + esc(v.text) + "</li>";
		}).join("") + "</ul>";
		document.getElementById("speicherInhalt").innerHTML = html;
		document.getElementById("speicherDialog").showModal();
	}
	function sichereSpeicher() {
		var sp = JSON.parse(JSON.stringify(state.speicher || leererSpeicher()));
		sp.figuren = sp.figuren || {};
		var da = [];
		document.querySelectorAll("#speicherInhalt [data-figur]").forEach(function(box) {
			var n = box.dataset.figur, f = sp.figuren[n] || (sp.figuren[n] = {
				fakten: {},
				gesperrt: [],
				anwesend: true,
				wissen: []
			});
			f.fakten = f.fakten || {};
			f.gesperrt = f.gesperrt || [];
			box.querySelectorAll("[data-fakt]").forEach(function(i) {
				var k = i.dataset.fakt, v = i.value.trim(), alt = f.fakten[k] || "";
				if (v === alt) return;
				if (v) {
					f.fakten[k] = v;
					if (f.gesperrt.indexOf(k) < 0) f.gesperrt.push(k);
				} else {
					delete f.fakten[k];
					f.gesperrt = f.gesperrt.filter(function(x) {
						return x !== k;
					});
				}
				(sp.verlauf = sp.verlauf || []).push({
					abschnitt: state.turn,
					text: n + ": " + k + " " + (alt ? alt + " → " : "") + (v || "(gelöscht)") + " (von dir)"
				});
			});
			var rf = box.querySelector("[data-feld=\"raum\"]");
			if (rf) {
				var mc = state.figuren.find(function(y) {
					return y.mein;
				});
				var rv = raumLabel(rf.value, {
					spielerName: mc ? mc.name : "",
					figurName: n
				}), ra = f.raum || "";
				if (rv !== ra) {
					if (rv) {
						f.raum = rv;
						f.raumSeit = state.turn;
					} else {
						delete f.raum;
						delete f.raumSeit;
					}
					(sp.verlauf = sp.verlauf || []).push({
						abschnitt: state.turn,
						text: n + ": Raum " + (ra ? ra + " → " : "") + (rv || "(gelöscht)") + " (von dir)"
					});
				}
			}
			var w = box.querySelector("[data-feld=\"wissen\"]");
			if (w) f.wissen = w.value.split("\n").map(function(x) {
				return x.trim();
			}).filter(Boolean);
			var a = box.querySelector("[data-feld=\"anwesend\"]");
			if (a) {
				f.anwesend = a.checked;
				if (a.checked) {
					delete f.weg;
					da.push(n);
				} else if (!f.weg) f.weg = {
					abschnitt: state.turn,
					grund: "von dir auf „weg“ gesetzt"
				};
			}
		});
		sp.szene = {
			ort: document.getElementById("spOrt").value.trim(),
			zeit: document.getElementById("spZeit").value.trim()
		};
		sp.beziehungen = document.getElementById("spBez").value.split("\n").map(function(l) {
			var m = l.match(/^\s*(.+?)\s*(?:↔|<->|\/|\sund\s)\s*(.+?)\s*:\s*(.+)$/);
			return m ? {
				a: m[1],
				b: m[2],
				art: m[3].trim()
			} : null;
		}).filter(Boolean);
		sp.bilder = sp.bilder || {};
		document.querySelectorAll("#speicherInhalt [data-bild]").forEach(function(t) {
			var id = t.dataset.bild, v = t.value.trim();
			sp.bilder[id] = v;
			var an = findAnhang(id);
			if (an) an.beschreibung = v;
			state.verlauf.forEach(function(b) {
				if (b.type === "image" && attId(b) === id) b.beschreibung = v;
			});
		});
		sp.verlauf = (sp.verlauf || []).slice(-40);
		state.speicher = sp;
		if (state.figuren.some(function(x) {
			return !x.mein;
		})) state.anwesend = da;
		save();
		renderSide();
		renderStory();
	}
	document.getElementById("speicherOeffnen").addEventListener("click", oeffneSpeicher);
	document.getElementById("speicherDialog").addEventListener("close", function() {
		if (document.getElementById("speicherDialog").returnValue === "ok") sichereSpeicher();
	});
	function istAuswertungsWunsch(t) {
		return t.length <= 90 && /\b(werte?|wertet)\b[^.!?]{0,40}\baus\b|\bauswert(en|ung)\b|\banalysier\w*\b[^.!?]{0,30}\b(dialog\w*|gespräch\w*|gesprochene\w*|gesagt\w*|rede)|\b(dialog|gespräch|gesprochenes)\s+analysieren\b/i.test(t);
	}
	var AUSW_FELDER = [
		["absicht", "Absicht"],
		["ton", "Ton"],
		["widerspruch", "Widerspruch"],
		["luege", "Lüge"],
		["unterton", "Unterton"]
	];
	function auswertungHTML(a, kurz) {
		var e = a.eintraege || [];
		if (!e.length) return "<p class=\"empty\">" + esc(a.fazit || "Kein Gesprochenes der anderen Figuren in diesem Bereich.") + "</p>";
		return "<ol class=\"auswertung\">" + e.slice(0, kurz ? 6 : 40).map(function(x) {
			return "<li><div class=\"ausw-zitat\"><span class=\"ausw-wer\">" + esc(x.wer || "?") + ":</span> <strong>" + esc(x.zitat || "") + "</strong></div><dl>" + AUSW_FELDER.filter(function(f) {
				var v = (x[f[0]] || "").trim();
				return v && !(f[0] === "luege" && /^nein\b/i.test(v));
			}).map(function(f) {
				var warn = f[0] === "widerspruch" || f[0] === "luege" ? " class=\"warn\"" : "";
				return "<dt" + warn + ">" + f[1] + "</dt><dd" + warn + ">" + esc(x[f[0]]) + "</dd>";
			}).join("") + "</dl></li>";
		}).join("") + "</ol>" + (a.fazit ? "<p class=\"ausw-fazit\">" + esc(a.fazit) + "</p>" : "");
	}
	function oeffneAuswertung(sofort) {
		if (!regeln().auswertung) {
			toast("Die Dialog-Auswertung ist ausgeschaltet (Regeln → Regel-Schalter).");
			return;
		}
		var d = document.getElementById("auswertungDialog");
		var la = state.speicher && (state.speicher.auswertungen || []).slice(-1)[0];
		document.getElementById("auswertungInhalt").innerHTML = la ? auswertungHTML(la) : "<p class=\"empty\">Wähle den Bereich und klick auf „Auswerten“.</p>";
		document.getElementById("auswertungStatus").textContent = la ? "Letzte Auswertung (Abschnitt " + (la.abschnitt || 0) + ")." : "";
		if (!d.open) d.showModal();
		if (sofort) auswerten();
	}
	function auswerten() {
		if (busy) {
			document.getElementById("auswertungStatus").textContent = "Die KI schreibt gerade – gleich nochmal.";
			return;
		}
		if (API && !ki.ready) {
			document.getElementById("auswertungStatus").textContent = "Die KI ist noch nicht bereit – siehe links „KI“.";
			return;
		}
		var umfang = +document.getElementById("auswertungUmfang").value || 3;
		var st = document.getElementById("auswertungStatus"), btn = document.getElementById("auswertungStart");
		st.textContent = "Werte das Gesprochene aus …";
		btn.disabled = true;
		busy = true;
		stopIdle();
		var ctx = {
			figuren: state.figuren,
			intro: state.intro,
			welt: weltExport(W()),
			fragen: state.fragen,
			verlauf: state.verlauf,
			anwesend: state.anwesend,
			speicher: state.speicher,
			turn: state.turn,
			umfang,
			regeln: regeln()
		};
		window.LoreviaBridge.analyzeDialogue(JSON.parse(JSON.stringify(ctx)), umfang).then(function(a) {
			if (a.speicher) state.speicher = a.speicher;
			document.getElementById("auswertungInhalt").innerHTML = auswertungHTML(a);
			st.textContent = a.leer ? "" : a.quelle === "regeln" ? "Ausgewertet nach festen Regeln (KI hat nicht geantwortet)." : "Ausgewertet und im Storyspeicher gemerkt.";
			save();
			renderSide();
		}).catch(function(err) {
			st.textContent = "Auswertung ging nicht" + (err && err.message ? ": " + err.message : "") + ".";
		}).then(function() {
			busy = false;
			btn.disabled = false;
			resetIdle();
		});
	}
	document.getElementById("auswertungOeffnen").addEventListener("click", function() {
		oeffneAuswertung(false);
	});
	document.getElementById("auswertungStart").addEventListener("click", auswerten);
	function geschichteAlsText() {
		return state.verlauf.map(function(b) {
			if (b.type === "scene") return "---";
			if (b.type === "speech") return "**" + b.text + "**";
			if (b.type === "image") return "[Bild: " + (b.name || "") + (b.beschreibung ? " – " + b.beschreibung : "") + "]";
			if (b.type === "document") return "[Dokument: " + (b.name || "") + "]";
			if (b.type === "song") return "[Lied: " + (b.title || "Lied") + (b.url ? " – " + b.url : "") + (b.text ? " – " + b.text : "") + "]";
			if (b.type === "room" || b.type === "outfit") return kontextZeile(b);
			return (b.from === "eingabe" ? "Ich: " : "") + b.text;
		}).join("\n\n");
	}
	document.getElementById("textKopieren").addEventListener("click", function() {
		var t = geschichteAlsText();
		(navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function() {
			setInfo("Text kopiert. Du kannst ihn in jeden Chat einfügen.");
		}, function() {
			setInfo("Kopieren ging nicht.");
		});
	});
	document.getElementById("exportieren").addEventListener("click", function() {
		if (!API || !API.exportStory) return;
		flushSave();
		API.exportStory(settings.currentStory, state, settings.currentStory).then(function(r) {
			if (r && r.ok) setInfo("Gespeichert: " + r.path);
			else if (r && !r.canceled) setInfo("Export fehlgeschlagen: " + (r.error || ""));
		});
	});
	document.getElementById("importieren").addEventListener("click", function() {
		if (!API || !API.importStory) return;
		flushSave();
		API.importStory().then(function(r) {
			if (!r || !r.ok) {
				if (r && !r.canceled) setInfo("Import fehlgeschlagen: " + (r.error || ""));
				return;
			}
			settings.currentStory = r.id;
			API.saveSettings(settings);
			var e = emptyState(), d = r.state || {};
			for (var k in e) if (d[k] === void 0) d[k] = e[k];
			state = d;
			imgCache = {};
			intro.value = state.intro || "";
			countIntro();
			renderFiguren();
			renderFragen();
			setInfo("Importiert als „" + r.id + "“. Die alte Geschichte bleibt gespeichert.");
			if (isActive("schreiben")) {
				renderSide();
				renderStory();
				resetIdle();
			} else go("schreiben");
		});
	});
	eingabe.addEventListener("keydown", function(e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			senden();
		}
	});
	eingabe.addEventListener("input", resetIdle);
	document.querySelectorAll("[data-korr]").forEach(function(b) {
		b.addEventListener("click", function() {
			if (!busy) weiter("user", b.dataset.korr);
		});
	});
	document.getElementById("weltPause").addEventListener("click", function() {
		paused = !paused;
		renderSide();
		resetIdle();
	});
	document.getElementById("weltJetzt").addEventListener("click", function() {
		autoTicks = 0;
		weiter("idle");
	});
	document.getElementById("kiLaden").addEventListener("click", pullModel);
	document.getElementById("kiNeu").addEventListener("click", checkKI);
	function openOllamaDownload() {
		if (API) API.openExternal("https://ollama.com/download/windows");
		else window.open("https://ollama.com/download/windows", "_blank");
	}
	document.getElementById("kiDownload").addEventListener("click", openOllamaDownload);
	document.getElementById("kiStartDownload").addEventListener("click", openOllamaDownload);
	document.getElementById("kiStartLaden").addEventListener("click", function() {
		if (API && !ki.pulling) pullModel();
	});
	document.getElementById("kiStartPruefen").addEventListener("click", checkKI);
	document.getElementById("kiSetup").addEventListener("click", setupKI);
	document.getElementById("kiStartSetup").addEventListener("click", setupKI);
	document.getElementById("updateInstall").addEventListener("click", installUpdate);
	document.getElementById("updateBtn").addEventListener("click",LPDownloadUpdate);
	if (API && API.checkUpdate) {
		setTimeout(checkUpdate, 4e3);
		setInterval(checkUpdate, 18e5);
	}
	zeigeVersion(APP_VERSION);
	if (API && API.appVersion) API.appVersion().then(zeigeVersion);
	var fsBtn = document.getElementById("vollbild");
	function renderFs(on) {
		fsBtn.textContent = on ? "Vollbild verlassen" : "Vollbild";
	}
	if (API && API.toggleFullscreen) {
		fsBtn.addEventListener("click", function() {
			API.toggleFullscreen();
		});
		API.onFullscreen(renderFs);
		API.isFullscreen().then(renderFs);
	} else fsBtn.hidden = true;
	document.getElementById("ordnerOeffnen").addEventListener("click", function() {
		if (API) API.openDataDir();
	});
	document.getElementById("neueGeschichte").addEventListener("click", function() {
		var entwurf = !istGestartet(state) && (state.figuren.length || String(state.intro || "").trim() || weltHatInhalt(state.welt));
		if (!confirm(istGestartet(state) ? "Neue Geschichte anfangen? Die jetzige bleibt gespeichert (Meine Geschichten)." : entwurf ? "Neue Geschichte anfangen? Deine bisherige Auswahl ist noch nicht gestartet und wird verworfen." : "Neue Geschichte anfangen?")) return;
		flushSave();
		neuerEntwurf();
		go("intro");
	});
	function neueStoryId() {
		return "geschichte-" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/[:T]/g, "-");
	}
	function neuerEntwurf() {
		clearTimeout(saveTimer);
		saveTimer = null;
		settings.currentStory = neueStoryId();
		state = emptyState();
		imgCache = {};
		intro.value = "";
		countIntro();
		formLeeren();
		var bs = document.getElementById("bibSuche");
		if (bs) bs.value = "";
		renderFiguren();
		renderFragen();
		regeln();
		renderRegelnKurz();
		if (!bibModal.hidden) renderBib();
	}
	var toastTimer = null;
	function toast(txt, ms) {
		var t = document.getElementById("toast");
		t.textContent = txt;
		t.hidden = false;
		requestAnimationFrame(function() {
			t.classList.add("zeigen");
		});
		clearTimeout(toastTimer);
		toastTimer = setTimeout(function() {
			t.classList.remove("zeigen");
			setTimeout(function() {
				t.hidden = true;
			}, 220);
		}, ms || 5e3);
	}
	var appVersion = APP_VERSION;
	function zeigeVersion(v) {
		if (!v) return;
		appVersion = String(v);
		document.getElementById("versionLabel").textContent = appVersion;
		document.title = "Lorevia · " + appVersion;
		var el = document.getElementById("appVersion");
		if (el) el.textContent = "Lorevia " + appVersion;
	}
	function renderUpdateBtn() {
		var b = document.getElementById("updateBtn");
		b.classList.toggle("verfuegbar", !!update);
		b.lastChild.textContent = update ? " Update " + update.version + " " : " Update ";
		b.title = update ? "Lorevia " + update.version + " installieren" : "Nach Updates suchen (Desktop\\Lorevia\\Installer)";
	}
	function updateKnopf() {
		if (!API || !API.checkUpdate) {
			toast("Updates gibt es nur in der installierten App.");
			return;
		}
		if (update) {
			installUpdate();
			return;
		}
		var b = document.getElementById("updateBtn");
		b.disabled = true;
		b.classList.add("sucht");
		b.lastChild.textContent = " Suche … ";
		API.checkUpdate().then(function(u) {
			update = u && u.available ? u : null;
			b.disabled = false;
			b.classList.remove("sucht");
			renderUpdateBtn();
			zeigeUpdateBox();
			if (update) {
				installUpdate();
				return;
			}
			if (u && u.error && !/Update-Ordner/.test(u.error)) toast("Update-Suche ging nicht: " + u.error);
			else if (u && u.error) toast("Kein Update-Ordner gefunden. Lege neue Versionen nach Desktop\\Lorevia\\Installer.");
			else toast("Du hast die neueste Version (Lorevia " + appVersion + ").");
		}).catch(function(e) {
			b.disabled = false;
			b.classList.remove("sucht");
			renderUpdateBtn();
			toast("Update-Suche ging nicht: " + (e && e.message || e));
		});
	}
	function regeln() {
		state.regeln = normalizeRegeln(state.regeln);
		return state.regeln;
	}
	function renderRegelnKurz() {
		var r = regeln(), aus = REGEL_SCHALTER.filter(function(x) {
			return !r[x.key];
		}).map(function(x) {
			return x.label;
		});
		var el = document.getElementById("regelnKurz");
		if (el) el.textContent = aus.length ? "Aus: " + aus.join(", ") : "Alle Regeln an.";
		document.getElementById("auswertungTitel").hidden = !r.auswertung;
		document.getElementById("auswertungBox").hidden = !r.auswertung;
		try {
			renderFiguren();
			renderEntscheidForm();
			if (isActive("uebersicht")) renderUebersicht();
		} catch (e) {}
	}
	var SCHLOSS = "<svg viewBox=\"0 0 24 24\" width=\"15\" height=\"15\" aria-hidden=\"true\"><rect x=\"5\" y=\"11\" width=\"14\" height=\"10\" rx=\"2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"/><path d=\"M8 11V8a4 4 0 0 1 8 0v3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"/></svg>";
	function regelHTML(r) {
		var info = r.info ? "<span class=\"regel-info\">" + esc(r.info) + "</span>" : "";
		if (r.locked) return "<div class=\"regel gesperrt\"><span class=\"regel-text\"><span class=\"regel-label\">" + esc(r.label) + "</span>" + info + "</span><span class=\"schloss\" title=\"Fest eingestellt\">" + SCHLOSS + " immer an</span></div>";
		return "<label class=\"regel\"><span class=\"regel-text\"><span class=\"regel-label\">" + esc(r.label) + "</span>" + info + "</span><input type=\"checkbox\" class=\"schalter\" role=\"switch\" data-regel=\"" + esc(r.id) + "\"" + (r.enabled ? " checked" : "") + "></label>";
	}
	function renderRegeln() {
		var liste = regelListe(regeln());
		document.getElementById("regelnSchalter").innerHTML = liste.filter(function(r) {
			return !r.locked;
		}).map(regelHTML).join("");
		document.getElementById("regelnFest").innerHTML = liste.filter(function(r) {
			return r.locked;
		}).map(regelHTML).join("");
	}
	document.getElementById("regelnSchalter").addEventListener("change", function(e) {
		var id = e.target.dataset.regel;
		if (!id) return;
		var neu = setzeRegel(regeln(), id, e.target.checked);
		if (!neu) {
			e.target.checked = !e.target.checked;
			toast("Regel konnte nicht geändert werden.");
			return;
		}
		state.regeln = neu;
		save();
		renderRegelnKurz();
		var r = regelListe(neu).filter(function(x) {
			return x.id === id;
		})[0];
		toast(r.label + (e.target.checked ? " an" : " aus"), 2500);
		if (REGEL_ID[id] === "weltTakt") resetIdle();
	});
	var regelnPanel = document.getElementById("regelnPanel"), regelnOverlay = document.getElementById("regelnOverlay"), regelnBtn = document.getElementById("regelnBtn");
	function regelnZeigen(an) {
		if (an) renderRegeln();
		regelnPanel.classList.toggle("offen", an);
		regelnPanel.setAttribute("aria-hidden", String(!an));
		regelnOverlay.hidden = !an;
		regelnBtn.setAttribute("aria-expanded", String(an));
		regelnBtn.classList.toggle("aktiv", an);
	}
	regelnBtn.addEventListener("click", function() {
		regelnZeigen(!regelnPanel.classList.contains("offen"));
	});
	regelnOverlay.addEventListener("click", function() {
		regelnZeigen(false);
	});
	document.getElementById("regelnOeffnen").addEventListener("click", function() {
		regelnZeigen(true);
	});
	var fehlerModal = document.getElementById("fehlerModal"), fehlerForm = document.getElementById("fehlerForm");
	var fehlerBildOk = false;
	function letzteAbsaetze(n) {
		var v = state.verlauf || [], off = Math.max(0, v.length - n);
		return v.slice(-n).map(function(b, k) {
			if (b.type === "image") return {
				t: "[Bild: " + (b.name || "Bild") + "]",
				s: false,
				du: b.who === "du"
			};
			if (b.type === "document") return {
				t: "[Dokument: " + (b.name || "Dokument") + "]",
				s: false,
				du: b.who === "du"
			};
			if (b.type === "song") return {
				t: "[Lied: " + (b.title || "Lied") + "]",
				s: false,
				du: b.who === "du"
			};
			if (b.type === "room" || b.type === "outfit") return {
				t: kontextZeile(b),
				s: false,
				du: b.who === "du"
			};
			if (b.type === "scene") return {
				t: "—",
				s: false,
				du: false
			};
			var wer = sprecherVon(b, off + k);
			return {
				t: b.text || "",
				s: b.type === "speech",
				du: b.who === "du",
				farbe: wer ? lesbar(sprecherFarbe(wer, state.figuren), "#ffffff") : ""
			};
		});
	}
	function zeilenUmbruch(g, text, max) {
		var w = text.split(/\s+/), z = [], cur = "";
		w.forEach(function(x) {
			var n = cur ? cur + " " + x : x;
			if (g.measureText(n).width > max && cur) {
				z.push(cur);
				cur = x;
			} else cur = n;
		});
		if (cur) z.push(cur);
		return z;
	}
	function storySchnappschuss() {
		try {
			var abs = letzteAbsaetze(8), W = 900, pad = 40, lh = 26, max = W - 2 * pad;
			var c = document.createElement("canvas"), g = c.getContext("2d");
			var font = function(b) {
				return (b ? "bold " : "") + "17px Georgia, serif";
			};
			var zeilen = [];
			abs.forEach(function(a) {
				g.font = font(a.s);
				zeilenUmbruch(g, a.t, max).forEach(function(z) {
					zeilen.push({
						z,
						a
					});
				});
				zeilen.push(null);
			});
			c.width = W;
			c.height = Math.min(2400, pad * 2 + 34 + zeilen.length * lh);
			g.fillStyle = "#ffffff";
			g.fillRect(0, 0, c.width, c.height);
			g.fillStyle = "#6b7a94";
			g.font = "13px \"Segoe UI\", Arial, sans-serif";
			g.fillText("Lorevia " + appVersion + " · Ausschnitt · " + (/* @__PURE__ */ new Date()).toLocaleString("de-DE"), pad, pad);
			var y = pad + 34;
			zeilen.forEach(function(l) {
				if (!l) {
					y += lh * .4;
					return;
				}
				g.font = font(l.a.s);
				g.fillStyle = l.a.farbe || (l.a.s ? "#2a3348" : "#3d4250");
				g.fillText(l.z, pad, y);
				y += lh;
			});
			return c.toDataURL("image/png");
		} catch (e) {
			return "";
		}
	}
	function snapshotVorschau() {
		var box = document.getElementById("fehlerSnapshot"), img = document.getElementById("fehlerVorschau");
		var an = fehlerForm.mitStory.checked;
		img.hidden = !an || !fehlerBildOk;
		box.hidden = !an;
		var abs = letzteAbsaetze(4);
		box.innerHTML = abs.length ? abs.map(function(a) {
			return "<p class=\"" + (a.s ? "speech" : "action") + (a.du ? " you" : "") + "\"" + (a.farbe ? " style=\"color:" + a.farbe + "\"" : "") + ">" + esc(a.t) + "</p>";
		}).join("") : "<p class=\"leer\">Noch keine Geschichte.</p>";
	}
	function fehlerOeffnen() {
		fehlerForm.reset();
		fehlerBildOk = false;
		document.getElementById("fehlerStatus").textContent = "";
		document.getElementById("fehlerOrdner").hidden = true;
		document.getElementById("fehlerSpeichern").disabled = false;
		var img = document.getElementById("fehlerVorschau");
		img.hidden = true;
		(API && API.captureBug ? API.captureBug() : Promise.resolve({ ok: false })).then(function(r) {
			fehlerBildOk = !!(r && r.ok);
			if (fehlerBildOk && r.vorschau) img.src = r.vorschau;
		}).catch(function() {}).then(function() {
			snapshotVorschau();
			fehlerModal.hidden = false;
			requestAnimationFrame(function() {
				fehlerModal.classList.add("offen");
			});
			setTimeout(function() {
				fehlerForm.text.focus();
			}, 50);
		});
	}
	function fehlerSchliessen() {
		fehlerModal.classList.remove("offen");
		setTimeout(function() {
			fehlerModal.hidden = true;
		}, 200);
	}
	document.addEventListener("click", function(e) {
		if (e.target.closest("[data-fehler]")) {
			e.preventDefault();
			regelnZeigen(false);
			fehlerOeffnen();
			return;
		}
		var s = e.target.closest("[data-schliessen]");
		if (s) {
			e.preventDefault();
			if (s.dataset.schliessen === "fehler") fehlerSchliessen();
			else regelnZeigen(false);
		}
	});
	fehlerModal.addEventListener("click", function(e) {
		if (e.target === fehlerModal) fehlerSchliessen();
	});
	document.addEventListener("keydown", function(e) {
		if (e.key !== "Escape") return;
		if (!fehlerModal.hidden) fehlerSchliessen();
		else if (regelnPanel.classList.contains("offen")) regelnZeigen(false);
	});
	fehlerForm.mitStory.addEventListener("change", snapshotVorschau);
	fehlerForm.addEventListener("submit", function(e) {
		e.preventDefault();
		var st = document.getElementById("fehlerStatus"), btn = document.getElementById("fehlerSpeichern");
		var mit = fehlerForm.mitStory.checked, sel = fehlerForm.art;
		var daten = {
			art: sel.options[sel.selectedIndex].text,
			artId: sel.value,
			notiz: fehlerForm.text.value.trim() || "(ohne Beschreibung)",
			screenshot: mit && fehlerBildOk,
			geschichte: settings.currentStory,
			modell: settings.model,
			regeln: regeln(),
			figuren: state.figuren.map(function(f) {
				return {
					name: f.name,
					mein: !!f.mein,
					rolle: f.rolle
				};
			}),
			verlauf: mit ? state.verlauf.slice(-30) : []
		};
		if (mit && !fehlerBildOk) {
			var d = storySchnappschuss();
			if (d) daten.screenshotDataUrl = d;
		}
		if (!API || !API.saveBugReport) {
			var key = "lorevia-fehler-demo", liste = [];
			try {
				liste = JSON.parse(localStorage.getItem(key)) || [];
			} catch (err) {}
			delete daten.screenshotDataUrl;
			liste.push(Object.assign({
				zeit: (/* @__PURE__ */ new Date()).toISOString(),
				version: appVersion
			}, daten));
			try {
				localStorage.setItem(key, JSON.stringify(liste));
			} catch (err) {}
			fehlerSchliessen();
			toast("Gespeichert (Demo)");
			return;
		}
		btn.disabled = true;
		st.textContent = "Speichere …";
		API.saveBugReport(JSON.parse(JSON.stringify(daten))).then(function(r) {
			btn.disabled = false;
			if (!r || !r.ok) {
				st.textContent = "Speichern ging nicht: " + (r && r.error || "unbekannt");
				return;
			}
			st.textContent = "Gespeichert: " + r.dir;
			var o = document.getElementById("fehlerOrdner");
			o.hidden = false;
			o.dataset.dir = r.dir;
			toast("Danke! Fehler gespeichert (Lorevia " + appVersion + ").");
		}).catch(function(err) {
			btn.disabled = false;
			st.textContent = "Speichern ging nicht: " + (err && err.message || err);
		});
	});
	document.getElementById("fehlerOrdner").addEventListener("click", function(e) {
		if (API && API.openBugDir) API.openBugDir(e.target.dataset.dir);
	});
	window.LoreviaBridge.listStories = function() {
		var aktuell = geschichteKurz(settings.currentStory || "meine-geschichte", state, Date.now());
		var mitAktuell = function(liste) {
			liste = (liste || []).filter(function(g) {
				return g && g.id;
			}).map(function(g) {
				return g.title ? g : geschichteKurz(g.id, null, g.changed);
			});
			if (liste.some(function(g) {
				return g.id === aktuell.id;
			})) liste = liste.map(function(g) {
				return g.id === aktuell.id ? Object.assign({}, aktuell, {
					changed: g.changed,
					updatedAt: g.updatedAt
				}) : g;
			});
			else if (istGestartet(state)) liste.push(aktuell);
			return geschichtenSortieren(liste);
		};
		if (!API || !API.listStories) return Promise.resolve(mitAktuell([]));
		flushSave();
		return API.listStories().then(mitAktuell);
	};
	window.LoreviaBridge.openStory = function(id) {
		if (!API) return Promise.resolve({
			ok: false,
			error: "Nur in der App"
		});
		if (busy) return Promise.resolve({
			ok: false,
			error: "Die KI schreibt gerade noch."
		});
		flushSave();
		return API.loadStory(id).then(function(d) {
			if (!d) return {
				ok: false,
				error: "nicht gefunden"
			};
			var e = emptyState();
			for (var k in e) if (d[k] === void 0) d[k] = e[k];
			settings.currentStory = id;
			API.saveSettings(settings);
			state = d;
			imgCache = {};
			return {
				ok: true,
				verlauf: state.verlauf,
				figuren: state.figuren,
				intro: state.intro,
				fragen: state.fragen
			};
		});
	};
	if (API) window.LoreviaBridge.openStoriesFolder = function() {
		return API.openDataDir();
	};
	function storyDatum(ms) {
		if (!isFinite(ms) || !ms) return "";
		var d = new Date(ms), jetzt = /* @__PURE__ */ new Date(), hhmm = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
		var tag = function(x) {
			return new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
		};
		var diff = Math.round((tag(jetzt) - tag(d)) / 864e5);
		if (diff === 0) return "heute, " + hhmm;
		if (diff === 1) return "gestern, " + hhmm;
		if (diff > 1 && diff < 7) return "vor " + diff + " Tagen";
		return ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear();
	}
	function storyNorm(s) {
		s = s && typeof s === "object" ? s : {};
		var figs = Array.isArray(s.figures) ? s.figures.map(function(x) {
			return typeof x === "string" ? x : x && x.name || "";
		}).filter(Boolean) : [];
		var t = s.updatedAt != null ? s.updatedAt : s.date != null ? s.date : s.changed;
		var ms = typeof t === "number" ? t : t ? Date.parse(t) : NaN;
		return {
			id: String(s.id == null ? "" : s.id),
			title: String(s.title || s.name || "Ohne Titel"),
			ms,
			preview: typeof s.preview === "string" ? s.preview : "",
			figures: figs,
			figuresCount: typeof s.figuresCount === "number" ? s.figuresCount : figs.length,
			paragraphs: typeof s.paragraphs === "number" ? s.paragraphs : null,
			entwurf: s.gestartet === false
		};
	}
	var geschichtenDaten = [];
	function renderGeschichten() {
		var box = document.getElementById("geschichtenListe");
		document.getElementById("geschichtenOrdnerBtn").hidden = !window.LoreviaBridge.openStoriesFolder;
		box.innerHTML = "<p class=\"geschichten-laedt\">Geschichten werden geladen …</p>";
		window.LoreviaBridge.listStories().then(function(liste) {
			geschichtenDaten = (Array.isArray(liste) ? liste : []).map(storyNorm).filter(function(s) {
				return s.id;
			});
			geschichtenDaten.sort(function(a, b) {
				return (isFinite(b.ms) ? b.ms : 0) - (isFinite(a.ms) ? a.ms : 0);
			});
			if (!geschichtenDaten.length) {
				box.innerHTML = "<div class=\"geschichten-leer\"><div class=\"bib-leer-icon\" aria-hidden=\"true\">✦</div><h3>Noch keine Geschichte</h3><p>Sobald du eine Geschichte beginnst, findest du sie hier wieder und kannst sie weiterschreiben.</p><button class=\"btn primary\" type=\"button\" data-neu-geschichte>Neue Geschichte beginnen</button></div>";
				return;
			}
			box.innerHTML = geschichtenDaten.map(function(s) {
				var akt = s.id === settings.currentStory, meta = [];
				var dat = storyDatum(s.ms);
				if (dat) meta.push("zuletzt geschrieben " + dat);
				meta.push(s.figuresCount + (s.figuresCount === 1 ? " Figur" : " Figuren"));
				if (s.paragraphs != null) meta.push(s.paragraphs + (s.paragraphs === 1 ? " Absatz" : " Absätze"));
				return "<article class=\"story-karte" + (akt ? " aktuell" : "") + "\" data-story=\"" + esc(s.id) + "\" tabindex=\"0\" role=\"button\" aria-label=\"" + esc(s.title) + " weiterschreiben\" title=\"" + esc(s.id) + "\"><h3 class=\"story-titel\">" + esc(s.title) + "</h3><div class=\"story-meta\">" + (akt ? "<span class=\"story-aktuell\">gerade offen</span>" : "") + (s.entwurf ? "<span class=\"story-entwurf\">Entwurf – noch nicht gestartet</span>" : "") + meta.map(function(m) {
					return "<span>" + esc(m) + "</span>";
				}).join("") + "</div>" + (s.preview ? "<p class=\"story-vorschau\">" + esc(s.preview) + "</p>" : "") + (s.figures.length ? "<div class=\"story-figuren\">" + s.figures.slice(0, 6).map(function(n) {
					return "<span class=\"tag\">" + esc(n) + "</span>";
				}).join("") + "</div>" : "") + "<div class=\"story-aktionen\"><button class=\"btn primary\" type=\"button\" data-weiter=\"" + esc(s.id) + "\">Weiterschreiben</button></div></article>";
			}).join("");
		}).catch(function() {
			box.innerHTML = "<div class=\"geschichten-leer\"><h3>Geschichten konnten nicht geladen werden</h3><p>Bitte gleich nochmal versuchen.</p><button class=\"btn ghost\" type=\"button\" id=\"geschichtenNeuBtn\">Neu laden</button></div>";
		});
	}
	function geschichteOeffnen(id, karte) {
		if (!id) return;
		if (id === settings.currentStory) {
			go(state.verlauf.length ? "schreiben" : "figuren");
			return;
		}
		if (!istGestartet(state) && state.figuren.length && !confirm("Deine jetzige Auswahl ist noch nicht gestartet und wird nicht gespeichert. Trotzdem diese Geschichte öffnen?")) return;
		if (karte) karte.classList.add("laedt");
		window.LoreviaBridge.openStory(id).then(function(r) {
			if (!r || !r.ok) {
				toast("Geschichte konnte nicht geöffnet werden." + (r && r.error ? " (" + r.error + ")" : ""), 6e3);
				return;
			}
			if (!istGestartet(state)) entwurfDatei = settings.currentStory;
			intro.value = state.intro || "";
			countIntro();
			renderFiguren();
			renderFragen();
			if (state.verlauf.length) loadStory();
			else go("figuren");
		}).catch(function() {
			toast("Geschichte konnte nicht geöffnet werden.", 6e3);
		}).then(function() {
			if (karte) karte.classList.remove("laedt");
		});
	}
	document.getElementById("geschichtenListe").addEventListener("click", function(e) {
		if (e.target.closest("#geschichtenNeuBtn")) {
			renderGeschichten();
			return;
		}
		if (e.target.closest("[data-neu-geschichte]")) {
			document.getElementById("neueGeschichte").click();
			return;
		}
		var k = e.target.closest("[data-story]");
		if (k) geschichteOeffnen(k.dataset.story, k);
	});
	document.getElementById("geschichtenListe").addEventListener("keydown", function(e) {
		var k = e.target.closest && e.target.closest("[data-story]");
		if (k && e.target === k && (e.key === "Enter" || e.key === " ")) {
			e.preventDefault();
			geschichteOeffnen(k.dataset.story, k);
		}
	});
	document.getElementById("geschichtenOrdnerBtn").addEventListener("click", function() {
		var f = window.LoreviaBridge.openStoriesFolder;
		if (f) f();
	});
	document.getElementById("neueGeschichte2").addEventListener("click", function() {
		document.getElementById("neueGeschichte").click();
	});
	window.LoreviaUI = window.LoreviaUI || {};
	window.LoreviaUI.refreshStories = renderGeschichten;
	window.LoreviaUI.geschichteOeffnen = geschichteOeffnen;
	var liedModal = document.getElementById("liedModal"), liedForm = document.getElementById("liedForm");
	var liedFehler = document.getElementById("liedFehler");
	function liedFehlerZeigen(t, feld) {
		liedFehler.textContent = t;
		liedFehler.hidden = !t;
		[liedForm.title, liedForm.url].forEach(function(f) {
			f.classList.toggle("ungueltig", f === feld);
		});
		if (feld) feld.focus();
	}
	function liedOeffnen() {
		liedForm.reset();
		liedFehlerZeigen("", null);
		stopIdle();
		liedModal.hidden = false;
		requestAnimationFrame(function() {
			liedModal.classList.add("offen");
		});
		setTimeout(function() {
			liedForm.title.focus();
		}, 50);
	}
	function liedSchliessen() {
		liedModal.classList.remove("offen");
		setTimeout(function() {
			liedModal.hidden = true;
			resetIdle();
		}, 200);
	}
	document.getElementById("liedBtn").addEventListener("click", liedOeffnen);
	function oel(id) {
		return document.getElementById(id);
	}
	var ICON_RAUM = "<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\"><path d=\"M3 11.5 12 4l9 7.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M5.5 10v10h13V10\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/><path d=\"M10 20v-5.5h4V20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></svg>";
	function roBild(p, cls, alt) {
		if (!p) return "";
		return "<img class=\"" + cls + "\" data-ro-path=\"" + esc(p) + "\"" + (imgCache[p] ? " src=\"" + esc(imgCache[p]) + "\"" : "") + " alt=\"" + esc(alt || "") + "\">";
	}
	function raumKarte(b, cls) {
		return "<div class=\"story-raum ro-karte" + cls + "\">" + roBild(b.path, "ro-karte-bild", b.name || "Raum") + "<span class=\"ro-zeile\"><span class=\"ro-icon\" aria-hidden=\"true\">" + ICON_RAUM + "</span><span class=\"ro-info\"><span class=\"ro-meta\"><em>Von dir</em> · Raum" + (b.path ? " · Bild vorgegeben" : "") + "</span><strong class=\"ro-name\">" + esc(b.name || "Raum") + "</strong>" + (b.path ? "<span class=\"ro-ki\">KI erkennt die Details aus dem Bild</span>" : "") + (b.text ? "<p class=\"ro-notiz\">" + esc(b.text) + "</p>" : "") + "</span></span></div>";
	}
	function figurZu(b) {
		var f = b.figureId ? state.figuren.filter(function(x) {
			return x && x.id === b.figureId;
		})[0] : null;
		if (!f && b.figureName) {
			var n = String(b.figureName).trim().toLowerCase();
			f = state.figuren.filter(function(x) {
				return x && String(x.name || "").trim().toLowerCase() === n;
			})[0];
		}
		return f || null;
	}
	function outfitKarte(b, cls) {
		var f = figurZu(b), name = f && f.name || b.figureName || "Figur";
		var farbe = f && hexOk(f.color) ? f.color : sprecherFarbe(name, state.figuren) || "#1a1a1a";
		var av = f && f.photo && f.photo.path ? "<span class=\"ro-av foto\" style=\"border-color:" + esc(farbe) + "\">" + roBild(f.photo.path, "", "") + "</span>" : "<span class=\"ro-av\" style=\"background:" + esc(farbe) + "\">" + esc(name.charAt(0).toUpperCase()) + "</span>";
		return "<div class=\"story-outfit ro-karte" + cls + "\">" + roBild(b.path, "ro-outfit-bild", "Outfit " + name + (b.name ? " – " + b.name : "")) + "<span class=\"ro-zeile\">" + av + "<span class=\"ro-info\"><span class=\"ro-meta\"><em>Von dir</em> · Outfit · <b style=\"color:" + esc(lesbar(farbe, schreibHg())) + "\">" + esc(name) + "</b></span>" + (b.name ? "<strong class=\"ro-name\">" + esc(b.name) + "</strong>" : "") + (b.path ? "<span class=\"ro-ki\">KI erkennt die Kleidung aus dem Bild</span>" : "") + "</span></span></div>";
	}
	function roHydrate(root) {
		(root || storyEl).querySelectorAll("img[data-ro-path]:not([src])").forEach(function(img) {
			ladeBild(img.dataset.roPath).then(function(u) {
				if (u) {
					img.src = u;
					return;
				}
				if (img.closest(".ro-av")) return;
				img.outerHTML = "<span class=\"bild-fehlt klein\">Bild nicht mehr verfügbar</span>";
			});
		});
	}
	function kontextZeile(b) {
		if (!b || b.who !== "du") return "";
		if (b.type === "room") return "[Raum: " + (b.name || "Raum") + (b.path ? " — Bild vorgegeben, Details aus dem Bild erkennen" : "") + (b.text ? "; Hinweis: " + b.text : "") + "]";
		if (b.type === "outfit") return "[Outfit: " + (b.figureName || "Figur") + (b.name ? " – " + b.name : "") + (b.path ? " — Bild vorgegeben, Kleidung erkennen" : "") + "]";
		return "";
	}
	function raumOutfitKontext() {
		var zeilen = [], raum = null, outfits = {};
		(state.verlauf || []).forEach(function(b) {
			var z = kontextZeile(b);
			if (!z) return;
			zeilen.push(z);
			if (b.type === "room") raum = b;
			else outfits[b.figureId || b.figureName] = b;
		});
		return {
			kontext: zeilen,
			raum,
			outfits
		};
	}
	function optikZeile(x) {
		var f = state.speicher && state.speicher.figuren && state.speicher.figuren[x.name], t = [];
		if (x.outfit) t.push("<strong>Outfit:</strong> " + esc(x.outfit));
		if (x.haare) t.push("<strong>Haare:</strong> " + esc(x.haare));
		if (x.augen) t.push("<strong>Augen:</strong> " + esc(x.augen));
		if (f && f.raum) t.push("<strong>Raum:</strong> " + esc(f.raum));
		return t.length ? "<div class=\"notes outfit-zeile\">" + t.join(" · ") + "</div>" : "";
	}
	function outfitSetzen(i, w) {
		var x = state.figuren[i];
		if (!x) return false;
		w = w || {};
		var neu = normalizeFigur(Object.assign({}, x, {
			outfit: w.outfit !== void 0 ? outfitLabel(w.outfit) : x.outfit,
			haare: w.haare !== void 0 ? w.haare : x.haare,
			augen: w.augen !== void 0 ? w.augen : x.augen,
			outfitPhoto: w.outfitPhoto !== void 0 ? w.outfitPhoto ? Object.assign({}, w.outfitPhoto) : null : x.outfitPhoto
		}));
		var alt = {
			outfit: x.outfit || "",
			haare: x.haare || "",
			augen: x.augen || ""
		};
		OPTIK_FELDER.forEach(function(k) {
			if (neu[k]) x[k] = neu[k];
			else delete x[k];
		});
		var sp = state.speicher || (state.speicher = leererSpeicher());
		sp.figuren = sp.figuren || {};
		sp.verlauf = sp.verlauf || [];
		[
			["outfit", "Outfit"],
			["haare", "Haare"],
			["augen", "Augen"]
		].forEach(function(k) {
			if ((x[k[0]] || "") !== alt[k[0]]) sp.verlauf.push({
				abschnitt: state.turn,
				text: x.name + ": " + k[1] + " " + (x[k[0]] ? "→ " + x[k[0]] : "(entfernt)") + " (von dir)"
			});
		});
		sp.verlauf = sp.verlauf.slice(-40);
		save();
		renderFiguren();
		if (typeof renderSide === "function") renderSide();
		return true;
	}
	function roErkennen(b) {
		if (!API || !API.describeImage || !ki.ready || !b.path) return;
		var art = b.type === "room" ? "raum" : "outfit";
		API.describeImage(b.path, {
			model: settings.visionModel || settings.model,
			art,
			hint: b.type === "room" ? "Raum: " + b.name : "Figur: " + b.figureName + ", Outfit: " + b.name
		}).then(function(r) {
			if (!r || !r.ok || !r.text) return;
			var t = String(r.text).trim().slice(0, 600);
			speicherBild(b.id, t);
			if (b.type === "outfit") {
				var f = figurZu(b);
				if (f && f.outfitPhoto && f.outfitPhoto.path === b.path) f.outfitPhoto.beschreibung = t;
			}
			save();
		}).catch(function() {});
	}
	function roDialog(cfg) {
		var modal = oel(cfg.id + "Modal"), frm = oel(cfg.id + "Form");
		var fehler = oel(cfg.id + "Fehler"), vorschau = oel(cfg.id + "BildVorschau");
		var inp = oel(cfg.id + "BildInput"), slot = oel(cfg.id + "BildSlot");
		var wahl = oel(cfg.id + "BildWaehlen"), weg = oel(cfg.id + "BildWeg");
		var d = {
			bild: null,
			modal,
			form: frm
		};
		d.fehlerZeigen = function(t, feld) {
			fehler.textContent = t;
			fehler.hidden = !t;
			frm.querySelectorAll(".ungueltig").forEach(function(x) {
				x.classList.remove("ungueltig");
			});
			if (feld) {
				feld.classList.add("ungueltig");
				if (feld.focus) feld.focus();
			}
		};
		d.renderBild = function() {
			var p = d.bild && d.bild.path;
			vorschau.innerHTML = d.bild ? roBild(p, "", d.bild.name || "Bild") : "<span class=\"foto-leer\">Kein Bild</span>";
			if (d.bild) roHydrate(vorschau);
			vorschau.classList.toggle("hat-bild", !!d.bild);
			weg.hidden = !d.bild;
			wahl.textContent = d.bild ? "Anderes Bild" : "Bild wählen";
		};
		function uebernehmen(liste) {
			var x = liste && liste[0];
			if (!x) return;
			(x.path && typeof x.path === "string" && !(typeof File !== "undefined" && x instanceof File) ? Promise.resolve({
				files: [x],
				errors: []
			}) : API && API.addFiles ? API.addFiles(settings.currentStory, [x]) : Promise.resolve({
				files: [],
				errors: ["Bilder gehen nur in der Lorevia-App."]
			})).then(function(r) {
				if (r && r.errors && r.errors.length) {
					d.fehlerZeigen(r.errors.join(" "), slot);
					return;
				}
				var a = r && r.files && r.files[0];
				if (!a) return;
				if ((a.kind || (/^image\//.test(a.mime || "") ? "image" : "document")) !== "image" || a.mime && !/^image\//.test(a.mime)) {
					d.fehlerZeigen("Bitte ein Bild wählen (JPG, PNG, WebP …).", slot);
					return;
				}
				d.bild = {
					name: a.name,
					mime: a.mime,
					path: a.path
				};
				d.fehlerZeigen("", null);
				d.renderBild();
			}).catch(function(e) {
				d.fehlerZeigen("Bild konnte nicht übernommen werden" + (e && e.message ? ": " + e.message : "") + ".", slot);
			});
		}
		wahl.addEventListener("click", function() {
			if (API && API.pickFiles) API.pickFiles({
				accept: "image/*",
				storyId: settings.currentStory,
				withErrors: true
			}).then(function(r) {
				if (r && r.errors && r.errors.length) {
					d.fehlerZeigen(r.errors.join(" "), slot);
					return;
				}
				uebernehmen(r && r.files);
			}).catch(function() {
				d.fehlerZeigen("Bild konnte nicht geöffnet werden.", null);
			});
			else inp.click();
		});
		inp.addEventListener("change", function() {
			uebernehmen(inp.files);
			inp.value = "";
		});
		weg.addEventListener("click", function() {
			d.bild = null;
			d.renderBild();
		});
		slot.addEventListener("dragover", function(e) {
			e.preventDefault();
			e.stopPropagation();
			slot.classList.add("drop");
		});
		slot.addEventListener("dragleave", function() {
			slot.classList.remove("drop");
		});
		slot.addEventListener("drop", function(e) {
			e.preventDefault();
			e.stopPropagation();
			slot.classList.remove("drop");
			if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) uebernehmen(e.dataTransfer.files);
		});
		modal.addEventListener("dragover", function(e) {
			e.preventDefault();
		});
		modal.addEventListener("drop", function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
		d.uebernehmen = uebernehmen;
		d.oeffnen = function(vorwahl) {
			frm.reset();
			d.bild = null;
			d.renderBild();
			d.fehlerZeigen("", null);
			stopIdle();
			if (cfg.vorbereiten) cfg.vorbereiten(d, vorwahl);
			modal.hidden = false;
			requestAnimationFrame(function() {
				modal.classList.add("offen");
			});
			setTimeout(function() {
				var f = frm.querySelector("select:not([disabled]),input:not([type=file])");
				if (f) f.focus();
			}, 50);
		};
		d.schliessen = function() {
			modal.classList.remove("offen");
			setTimeout(function() {
				modal.hidden = true;
				resetIdle();
			}, 200);
		};
		oel(cfg.id + "Btn").addEventListener("click", function() {
			d.oeffnen();
		});
		modal.addEventListener("click", function(e) {
			if (e.target === modal || e.target.closest("[data-" + cfg.id + "-zu]")) {
				e.preventDefault();
				d.schliessen();
			}
		});
		document.addEventListener("keydown", function(e) {
			if (e.key === "Escape" && !modal.hidden) d.schliessen();
		});
		frm.addEventListener("submit", function(e) {
			e.preventDefault();
			var b = cfg.block(d);
			if (!b) return;
			append([b]);
			if (cfg.danach) cfg.danach(b);
			roHydrate(storyEl);
			roErkennen(b);
			d.schliessen();
			toast(cfg.toast(b));
			eingabe.focus();
		});
		return d;
	}
	function roId(art) {
		return art + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
	}
	var raumDialog = roDialog({
		id: "raum",
		block: function(d) {
			var f = d.form, name = f.elements["name"].value.trim().slice(0, 40), text = f.text.value.trim().slice(0, 300);
			if (!name) {
				d.fehlerZeigen("Bitte kurz sagen, welcher Raum (z. B. Wohnzimmer).", f.name);
				return null;
			}
			if (!d.bild) {
				d.fehlerZeigen("Bitte ein Bild vom Raum wählen.", oel("raumBildSlot"));
				return null;
			}
			var b = {
				type: "room",
				id: roId("raum"),
				name,
				who: "du",
				path: d.bild.path,
				from: "anhang"
			};
			if (d.bild.mime) b.mime = d.bild.mime;
			if (text) b.text = text;
			return b;
		},
		toast: function(b) {
			return "Raum gesetzt: " + b.name;
		}
	});
	var outfitDialog = roDialog({
		id: "outfit",
		vorbereiten: function(d, vorwahl) {
			var sel = d.form.figur, liste = (state.figuren || []).filter(function(x) {
				return x && x.name;
			});
			sel.innerHTML = liste.map(function(x) {
				return "<option value=\"" + esc(x.id || x.name) + "\">" + esc(x.name) + " · " + esc(x.mein ? "Hauptfigur" : x.rolle || "Hauptfigur") + (x.mein ? " (dein Char)" : "") + "</option>";
			}).join("");
			var leer = !liste.length;
			sel.disabled = leer;
			oel("outfitKeineFiguren").hidden = !leer;
			oel("outfitSubmit").disabled = leer;
			d.form.querySelector("label").hidden = leer;
			d.form.querySelector(".ro-bez").hidden = leer;
			var v = vorwahl != null && state.figuren[vorwahl] ? state.figuren[vorwahl] : liste.filter(function(x) {
				return x.mein;
			})[0];
			if (v) sel.value = v.id || v.name;
		},
		block: function(d) {
			var f = d.form, key = f.figur.value, name = f.elements["name"].value.trim().slice(0, 40);
			var fig = (state.figuren || []).filter(function(x) {
				return x && (x.id === key || !x.id && x.name === key);
			})[0];
			if (!fig) {
				d.fehlerZeigen("Bitte eine Figur wählen.", f.figur);
				return null;
			}
			if (!name) {
				d.fehlerZeigen("Bitte kurz sagen, was die Figur trägt (z. B. Abendkleid).", f.name);
				return null;
			}
			if (!d.bild) {
				d.fehlerZeigen("Bitte ein Outfit-Bild wählen.", oel("outfitBildSlot"));
				return null;
			}
			var b = {
				type: "outfit",
				id: roId("outfit"),
				figureId: fig.id || fig.name,
				figureName: fig.name,
				name,
				who: "du",
				path: d.bild.path,
				from: "anhang"
			};
			if (d.bild.mime) b.mime = d.bild.mime;
			return b;
		},
		danach: function(b) {
			var i = state.figuren.indexOf(figurZu(b));
			if (i >= 0) outfitSetzen(i, {
				outfit: b.name,
				outfitPhoto: {
					name: "Outfit " + b.name,
					mime: b.mime || "",
					path: b.path,
					kind: "image"
				}
			});
		},
		toast: function(b) {
			return "Outfit gesetzt: " + b.figureName + " – " + b.name;
		}
	});
	var aussehenDlg = oel("aussehenDialog");
	function aussehenLaden(i) {
		var x = state.figuren[i];
		if (!x) return;
		oel("aussehenHaare").value = x.haare || "";
		oel("aussehenAugen").value = x.augen || "";
		oel("aussehenOutfit").textContent = x.outfit ? "Aktuelles Outfit: " + x.outfit + " (ändern über „Outfit“ beim Schreiben)" : "Outfit setzt du beim Schreiben über „Outfit“ (Bezeichnung + Bild).";
	}
	function aussehenOeffnen(idx) {
		if (!state.figuren.length) {
			toast("Lege zuerst eine Figur an.");
			return;
		}
		var sel = oel("aussehenFigur");
		sel.innerHTML = state.figuren.map(function(x, i) {
			return "<option value=\"" + i + "\">" + esc(x.name) + (x.mein ? " (dein Char)" : "") + "</option>";
		}).join("");
		if (idx == null || !state.figuren[idx]) {
			idx = state.figuren.findIndex(function(x) {
				return x.mein;
			});
			if (idx < 0) idx = 0;
		}
		sel.value = String(idx);
		aussehenLaden(idx);
		aussehenDlg.returnValue = "";
		aussehenDlg.showModal();
	}
	oel("aussehenFigur").addEventListener("change", function() {
		aussehenLaden(+this.value);
	});
	aussehenDlg.addEventListener("close", function() {
		if (aussehenDlg.returnValue !== "ok") return;
		var i = +oel("aussehenFigur").value, x = state.figuren[i];
		if (!x) return;
		outfitSetzen(i, {
			haare: oel("aussehenHaare").value.trim(),
			augen: oel("aussehenAugen").value.trim()
		});
		toast("Gespeichert für " + x.name + " – gilt fest, bis du es änderst.");
	});
	function outfitOeffnen(idx) {
		outfitDialog.oeffnen(idx);
	}
	window.LoreviaUI = window.LoreviaUI || {};
	window.LoreviaUI.outfit = {
		oeffnen: outfitOeffnen,
		setzen: outfitSetzen,
		aussehen: aussehenOeffnen
	};
	window.LoreviaUI.raum = { oeffnen: function() {
		raumDialog.oeffnen();
	} };
	window.LoreviaUI.raumBild = function(liste) {
		raumDialog.uebernehmen(liste);
	};
	window.LoreviaUI.outfitBild = function(liste) {
		outfitDialog.uebernehmen(liste);
	};
	liedModal.addEventListener("click", function(e) {
		if (e.target === liedModal || e.target.closest("[data-lied-zu]")) {
			e.preventDefault();
			liedSchliessen();
		}
	});
	document.addEventListener("keydown", function(e) {
		if (e.key === "Escape" && !liedModal.hidden) liedSchliessen();
	});
	liedForm.addEventListener("submit", function(e) {
		e.preventDefault();
		var titel = liedForm.title.value.trim(), roh = liedForm.url.value.trim(), text = liedForm.text.value.trim();
		if (!titel) {
			liedFehlerZeigen("Bitte einen Titel eintragen.", liedForm.title);
			return;
		}
		if (!roh) {
			liedFehlerZeigen("Bitte den YouTube-Link einfügen.", liedForm.url);
			return;
		}
		var url = ytUrl(roh);
		if (!url) {
			liedFehlerZeigen("Das sieht nicht nach einem YouTube-Link aus (youtube.com oder youtu.be).", liedForm.url);
			toast("Nur YouTube-Links (youtube.com oder youtu.be).");
			return;
		}
		append([normalizeSong({
			type: "song",
			id: "lied-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
			title: titel,
			url,
			text,
			who: "du",
			from: "anhang"
		})]);
		liedSchliessen();
		toast("Lied eingefügt: " + titel);
		eingabe.focus();
	});
	storyEl.addEventListener("click", function(e) {
		var a = e.target.closest && e.target.closest("a.lied-titel");
		if (!a) return;
		e.preventDefault();
		var yt = ytUrl(a.getAttribute("href"));
		if (!yt) return;
		if (API && API.openExternal) API.openExternal(yt);
		else window.open(yt, "_blank", "noopener");
	});
	var tickTimer = null, remaining = IDLE_SECONDS;
	function setIdle(txt, paused) {
		var el = document.getElementById("idle");
		document.getElementById("idleText").textContent = txt;
		el.classList.toggle("paused", !!paused);
	}
	function stopIdle() {
		clearInterval(tickTimer);
		tickTimer = null;
	}
	function resetIdle() {
 if (state.wartetAufSpieler) {stopIdle();setIdle("Die Szene wartet auf deine Entscheidung. Deine Figur handelt nur durch dich.",true);return;}
		stopIdle();
		if (!isActive("schreiben") || busy) return;
		if (!ki.ready) {
			setIdle("Die KI ist noch nicht bereit (siehe links „KI“).", false);
			return;
		}
		if (!regeln().weltTakt) {
			setIdle("Welt-Takt ist aus: Die Welt wartet auf dich („Jetzt weiter“ schiebt sie an).", true);
			return;
		}
		if (paused) {
			setIdle("Pausiert. Die Welt wartet, bis du weiterschreibst oder „Weiterlaufen lassen“ drückst.", true);
			return;
		}
		if (!state.verlauf.length) {
			setIdle(state.figuren.length ? "Die Geschichte beginnt …" : "Leg zuerst deine Figuren an.", false);
			return;
		}
		if (autoTicks >= MAX_AUTO_TICKS) {
			setIdle("Die Welt wartet jetzt auf dich.", true);
			return;
		}
		var draft = eingabe.value.trim().length > 0;
		remaining = draft ? IDLE_SECONDS * 3 : IDLE_SECONDS;
		setIdle(draft ? "Du schreibst gerade. Die Welt wartet." : "Die Welt läuft in " + remaining + " Sekunden weiter, wenn du nichts tippst.", draft);
		var lastInput = Date.now();
		tickTimer = setInterval(function() {
			remaining--;
			if (remaining <= 0) {
				weiter("idle");
				return;
			}
			if (draft) {
				if (Date.now() - lastInput > 8e3) setIdle("Entwurf im Feld. Die Welt wartet noch " + remaining + " Sekunden.", true);
			} else setIdle("Die Welt läuft in " + remaining + " Sekunden weiter, wenn du nichts tippst.", false);
		}, 1e3);
	}
	try {
		if (window.LoreviaBridge && typeof window.LoreviaBridge.requestFullscreen === "function") window.LoreviaBridge.requestFullscreen();
	} catch (e) {}
	loadState().then(function(d) {
		if (d && typeof d === "object") {
			var e = emptyState();
			for (var k in e) if (d[k] === void 0) d[k] = e[k];
			state = d;
		}
		if (!Array.isArray(state.verlauf)) state.verlauf = [];
		if (!istGestartet(state) && ((state.figuren || []).length || String(state.intro || "").trim() || weltHatInhalt(state.welt)) && confirm("Deine letzte Auswahl (" + (state.figuren || []).length + " Figuren) ist noch nicht gestartet.\n\nOK = wieder öffnen (empfohlen)\nAbbrechen = neu anfangen – der Entwurf bleibt unter „Meine Geschichten“.")) entwurfDatei = settings.currentStory;
		else if (!istGestartet(state)) {
			settings.currentStory = neueStoryId();
			state = emptyState();
		}
		regeln();
		renderRegelnKurz();
		if (Array.isArray(state.figuren)) farbenAuffuellen(state.figuren);
		hgAnwenden();
		if (API) document.getElementById("ordnerOeffnen").hidden = false;
		else {
			document.getElementById("kiBox").innerHTML = "<p class=\"side-small\">Vorschau im Browser: Demo-Antworten.</p>";
			setKI("Browser-Vorschau: nur Demo-Text. Die echte App nutzt Ollama.", "");
		}
		intro.value = state.intro || "";
		countIntro();
		renderFiguren();
		renderFragen();
		briefeNachfuellen();
		var h = location.hash.slice(1);
		var first = ORDER.indexOf(h) >= 0 || h === "geschichten" ? h : "start";
		if (first === "schreiben") go("schreiben");
		else {
			showSplash(START_SPLASH_MS, "");
			go(first);
		}
		checkKI();
		checkStimmen();
	});
	window.LoreviaUI = window.LoreviaUI || {};
	window.LoreviaUI.refreshVoices = function() {
		return checkStimmen().then(stimmenListeLaden).then(function() {
			stimmAllesRendern();
			return stimmListe.length;
		});
	};
})();
