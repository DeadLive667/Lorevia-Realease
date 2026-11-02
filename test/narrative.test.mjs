import test from 'node:test';
import assert from 'node:assert/strict';
import {loadRuntime,plain} from './narrative-runtime.mjs';
const {api}=loadRuntime();
const figuren=[{name:'Spieler',mein:true},{name:'Mara',persoenlichkeit:'Direkt und trocken.'}];

test('Neue Fließtextabsätze behalten Rede und Zuschreibung gemeinsam',()=>{
 const raw=JSON.stringify({blocks:[{type:'paragraph',text:'Mara legt die Tasse ab. **„Das war knapp.“** Sie schiebt den Stuhl zurück.'}],warteAufSpieler:true});
 const text=api.lvFormatDraft(api.lvStoryJson(raw));
 assert.match(text,/Tasse ab\. \*\*„Das war knapp\.“\*\* Sie schiebt/);
 assert.equal(text.split('\n\n').length,2); // Absatz plus internes Wartesignal
 assert.equal(api.lvDraftIssues(text.replace('[[WARTE_AUF_SPIELER]]','').trim(),{}).length,0);
});

test('Dialogtypografie schließt Rede und erhält tatsächliches Flüstern',()=>{
 assert.equal(api.lvFormatDraft('Mara sagt: **Das war knapp.**'),'Mara sagt: **„Das war knapp.“**');
 assert.equal(api.lvFormatDraft('Mara sagt: *„Das war knapp.*'),'Mara sagt: **„Das war knapp.“**');
 assert.equal(api.lvFormatDraft('Flüsternd sagt Mara: *„Leise.*'),'Flüsternd sagt Mara: *„Leise.“*');
 assert.equal(api.lvFormatDraft('Mara sagt: „Guten Morgen.“'),'Mara sagt: **„Guten Morgen.“**');
 assert.equal(api.lvFormatDraft('Mara ruft: ***„Halt!“***'),'Mara ruft: **„Halt!“**');
 assert.equal(api.lvFormatDraft('*Was soll das?* fragt Mara.'),'**„Was soll das?“** fragt Mara.');
 assert.equal(api.lvFormatDraft('*Was soll das?* denkt Mara.'),'*Was soll das?* denkt Mara.');
 assert.equal(api.lvFormatDraft('Du weicht aus. Mara sagt: **„Du geht ist falsch.“**'),'Du weichst aus. Mara sagt: **„Du geht ist falsch.“**');
});

test('Formatabweichungen und technische Felder gelangen nicht in die Geschichte',()=>{
 assert.ok(api.lvDraftIssues('Mara sagt: **„Unvollständig.**',{}).some(v=>v.code==='sprache'));
 assert.throws(()=>api.lvAssertNarrativeSpeakers(JSON.stringify({blocks:[{type:'paragraph',text:'warteAufSpieler: true'}]}),{}),/technische Feldnamen/);
});

test('Terminschutz erkennt falsche Uhrzeit, lässt Alltagsuhrzeit und neue Vereinbarung zu',()=>{
 const story={fortsetzung:{termine:[{wann:'2025-03-04 10:30',was:'Klinik',status:'vereinbart'}]}};
 assert.ok(api.lvDraftIssues('Mara sagt: **„Der Termin ist um zehn Uhr morgens.“**',story).some(v=>v.code==='termin'));
 assert.equal(api.lvDraftIssues('Mara sagt: **„Der Termin ist um 10:30 Uhr.“**',story).length,0);
 assert.equal(api.lvDraftIssues('Die Uhr zeigt 09:00 Uhr.',story).length,0);
 assert.equal(api.lvDraftIssues('Mara sagt: **„Der Termin ist um 11:00 Uhr.“**',{...story,currentPlayerInput:'Ich verschiebe den Termin auf 11:00 Uhr.'}).length,0);
 assert.equal(api.lvDraftIssues('Der Termin ist um 11:00 Uhr.',{fortsetzung:{termine:[{wann:'10:30',was:'Klinik'},{wann:'11:00',was:'Besprechung'}]}}).length,0);
});

test('Fehlerhafter kompletter Absatz wird neu erzeugt statt teilweise herausgeschnitten',async()=>{
 let count=0;api.setClient({chat:async()=>({message:{content:JSON.stringify({blocks:[{type:'paragraph',text:count++===0?'Mara legt die Tasse ab. Du gehst zum Fenster. **„Es regnet.“**':'Mara legt die Tasse ab. **„Es regnet.“**'}],warteAufSpieler:true})}})});
 const result=await api.continueStory({figuren,trigger:'user',eingabe:'Ich warte.'},'qwen3.5:35b-a3b',{extract:false});
 assert.equal(count,2);assert.equal(result.attempts,2);assert.equal(result.verworfen.length,0);
 assert.ok(result.blocks.some(b=>b.text.includes('Tasse ab. **„Es regnet.“**')));
});

test('Abgebrochene Sätze werden als Entwurf verworfen und durch vollständige Absätze ersetzt',async()=>{
 let count=0;api.setClient({chat:async()=>({message:{content:JSON.stringify({blocks:[{type:'paragraph',text:count++===0?'Mara legt die Tasse ab und':'Mara legt die Tasse ab.'}],warteAufSpieler:true})}})});
 const result=await api.continueStory({figuren,trigger:'user',eingabe:'Ich warte.'},'qwen3.5:35b-a3b',{extract:false});assert.equal(count,2);assert.ok(result.blocks.some(b=>b.text==='Mara legt die Tasse ab.'));
});

test('Terminkorrektur wird vor der Übernahme angefordert',async()=>{
 let count=0;api.setClient({chat:async()=>({message:{content:JSON.stringify({blocks:[{type:'paragraph',text:count++===0?'Mara sagt: **„Der Termin ist um 10:00 Uhr.“**':'Mara sagt: **„Der Termin ist um 10:30 Uhr.“**'}],warteAufSpieler:true})}})});
 const result=await api.continueStory({figuren,trigger:'user',eingabe:'Ich warte.',speicher:{fortsetzung:{termine:[{wann:'10:30',was:'Klinik',status:'vereinbart'}]}}},'qwen3.5:35b-a3b',{extract:false});assert.equal(count,2);assert.ok(result.blocks.some(b=>b.text.includes('10:30')));
});

test('Ausführlichkeit bleibt im Spielstand erhalten und ändert die Schreibvorgabe',()=>{
 assert.equal(api.lvContinuation({umfang:'ausfuehrlich'}).umfang,'ausfuehrlich');assert.equal(api.lvContinuation({umfang:'ungültig'}).umfang,'normal');
 const story=api.ctxToStory({figuren,speicher:{fortsetzung:{umfang:'kurz'}}});assert.match(api.buildSystemPrompt(story),/60–140/);assert.doesNotMatch(api.buildSystemPrompt(story),/Nora hält|Jona schiebt/);
});

test('Kampffreigabe erlaubt auch nachgestellte Spielerbefehle nicht',()=>{
 const story={characters:[{name:'Spieler',isPlayer:true},{name:'Mara'}],ausgestaltung:{art:'kampf'}};
 assert.ok(!api.checkOutput('**„Hände hoch!“** befiehlst du.',story,{mode:'player'}).ok);
 assert.ok(api.lvDraftIssues('Du weicht dem Schlag aus.',story).some(v=>v.code==='sprache'));
});
test('Kampf-Ausgestaltung braucht aktuelle Regie und eine aktuelle Kampfhandlung',()=>{
 assert.equal(api.lvEpicScope('Ich trinke Tee. (Beschreibe es episch.)'),null);
 assert.equal(api.lvEpicScope('(Beschreibe es episch.)'),null);
 assert.equal(api.lvEpicScope('Ich weiche dem Angriff aus. (Beschreibe es episch.)').art,'kampf');
 assert.equal(api.lvEpicScope('Ich weiche dem Angriff aus.'),null);
});
test('Ausgestaltung erlaubt körperliche Kampfhandlungen, keine Worte oder Gedanken',()=>{
 const base={characters:[{name:'Spieler',isPlayer:true},{name:'Mara'}],inputShown:true,status:{present:['Mara']}};
 assert.ok(api.checkOutput('Du duckst dich. Mara springt zurück.',base,{mode:'player'}).violations.some(v=>v.code==='spieler-erfunden'));
 const story={...base,ausgestaltung:{art:'kampf'}};
 assert.ok(!api.checkOutput('Du duckst dich. Mara springt zurück.',story,{mode:'player'}).violations.some(v=>v.code==='spieler-erfunden'));
 assert.ok(api.checkOutput('Du denkst an Zuhause. Mara springt zurück.',story,{mode:'player'}).violations.some(v=>v.code==='spieler-erfunden'));
 assert.ok(api.checkOutput('Du sagst: **Aufgeben!** Mara springt zurück.',story,{mode:'player'}).violations.some(v=>v.code==='spieler-erfunden'));
 assert.ok(api.checkOutput('Du duckst dich. Mara springt zurück.',story,{mode:'tick'}).violations.some(v=>v.code==='spieler-erfunden'));
});
test('Regie aus dem vorherigen Zug verlängert die Freigabe nicht',async()=>{
 let calls=[];api.setClient({chat:async req=>{calls.push(req);return {message:{content:'Mara springt zurück und hebt ihre Deckung.'}};}});
 const a=await api.continueStory({figuren,trigger:'user',eingabe:'Ich weiche dem Angriff aus. (Beschreibe es episch.)'},'qwen3.5:4b',{extract:false});
 assert.match(calls[0].messages[0].content,/EINMALIGE FREIGABE/);
 calls=[];await api.continueStory({figuren,trigger:'user',eingabe:'Ich warte.',speicher:a.speicher},'qwen3.5:4b',{extract:false});
 assert.doesNotMatch(calls[0].messages[0].content,/EINMALIGE FREIGABE FÜR DIESE/);
});
test('Neue Absatzblöcke verbinden Erzählung und fett zitierte Rede',()=>{
 const text=api.lvStoryJson(JSON.stringify({blocks:[{type:'paragraph',parts:[{type:'action',text:'Mara legt den Löffel ab.'},{type:'speech',who:'Mara',text:'Das war knapp.'}]}],warteAufSpieler:false}));
 assert.equal(text,'Mara legt den Löffel ab. **„Das war knapp.“**');assert.equal(api.autoFix(text),text);
 assert.ok(api.checkOutput(text,{characters:[{name:'Mara'}],status:{present:['Mara']}},{mode:'tick'}).ok);
});
test('Normale NPC-Dialogwechsel werden nicht nach der ersten Aussage abgeschnitten',()=>{
 const raw=JSON.stringify({blocks:[{type:'paragraph',parts:[{type:'speech',who:'Mara',text:'Das ist unser normaler Morgen.'}]},{type:'paragraph',parts:[{type:'speech',who:'Jona',text:'Dann brauche ich wohl noch Kaffee.'}]}],warteAufSpieler:true});
 assert.match(api.lvStoryJson(raw),/noch Kaffee/);
 const question=JSON.stringify({blocks:[{type:'paragraph',parts:[{type:'speech',who:'Mara',text:'Darf ich reinkommen?'}]},{type:'paragraph',parts:[{type:'action',text:'Mara öffnet ungefragt die Tür.'}]}],warteAufSpieler:true});assert.doesNotMatch(api.lvStoryJson(question),/öffnet/);
});
test('Strukturierte Spielerrede wird auch bei Kampffreigabe abgewiesen',()=>{
 assert.throws(()=>api.lvAssertNarrativeSpeakers(JSON.stringify({blocks:[{type:'paragraph',parts:[{type:'speech',who:'Spieler',text:'Ich gewinne.'}]}]}),{characters:[{name:'Spieler',isPlayer:true}],ausgestaltung:{art:'kampf'}}),/Spielerfigur/);
});
test('Fortsetzungsstand trennt Kanon, Aussagen, Wissen und offene Termine',()=>{
 const context={kanon:['Die Schwestern sind nicht blutsverwandt.'],behauptungen:[{quelle:'Eine Zeugin',text:'Der Unternehmer könnte der Vater sein.'}],offen:['Testergebnis unbekannt.'],wissen:[{wer:'Mara',was:'Kennt die Terminuhrzeit noch nicht.'}],termine:[{wann:'2025-03-04 10:30',was:'Untersuchung',status:'vorgemerkt'}]};
 const story=api.ctxToStory({figuren,speicher:{fortsetzung:context}});const prompt=api.buildSystemPrompt(story);
 assert.match(prompt,/AUSSAGEN, KEINE BEWIESENEN TATSACHEN/);assert.match(prompt,/Testergebnis unbekannt/);assert.match(prompt,/Kennt die Terminuhrzeit noch nicht/);
 assert.equal(story.fortsetzung.termine[0].status,'vorgemerkt');
});
test('Szenendatum bleibt erhalten und folgt nur einem vorgegebenen Tageswechsel',()=>{
 const ctx={eingabe:'Ich warte.',verlauf:[{type:'action',text:'**3. März 2025**'}]};assert.equal(api.lvStoryDate(ctx).iso,'2025-03-03');
 assert.equal(api.lvStoryDate({...ctx,eingabe:'Am nächsten Morgen komme ich zurück.'}).iso,'2025-03-04');
 assert.equal(api.lvStoryDate({...ctx,eingabe:'Am 7. März 2025 komme ich zurück.'}).iso,'2025-03-07');
 assert.equal(api.lvStoryDate({eingabe:'Am 31. Februar 2025 komme ich zurück.'}),null);
});
test('Kurze Namensform und relative Spielerhandlung bleiben geschützt',()=>{
 const story={characters:[{name:'Alex Winter',isPlayer:true},{name:'Mara'}],inputShown:true,status:{present:['Mara']}};
 assert.ok(api.checkOutput('Alex duckt sich. Mara hält Abstand.',story,{mode:'player'}).violations.some(v=>v.code==='du-form'));
 assert.ok(api.checkOutput('Mara schaut Alex an, der seine Tasse absetzt.',story,{mode:'player'}).violations.some(v=>v.code==='du-form'));
});
test('Qualitätsprüfung fordert eine belegte Korrektur vor dem Übernehmen',async()=>{
 let count=0;const replies=[JSON.stringify({blocks:[{type:'paragraph',parts:[{type:'action',text:'Mara legt einen Brief ab.'},{type:'speech',who:'Mara',text:'Der Test ist positiv.'}]}],warteAufSpieler:true}),JSON.stringify({fehler:[{art:'kanon',zitat:'Der Test ist positiv.',grund:'Das Ergebnis ist noch offen.'}]}),JSON.stringify({blocks:[{type:'paragraph',parts:[{type:'action',text:'Mara legt den ungeöffneten Umschlag ab.'},{type:'speech',who:'Mara',text:'Das Ergebnis müssen wir erst abwarten.'}]}],warteAufSpieler:true}),JSON.stringify({fehler:[]})];
 api.setClient({chat:async()=>({message:{content:replies[count++]}})});
 const result=await api.continueStory({figuren,trigger:'user',eingabe:'Ich warte.',qualitaetPruefen:true,speicher:{fortsetzung:{offen:['Das Testergebnis ist unbekannt.']}}},'qwen3.5:9b',{extract:false});
 assert.equal(count,4);assert.equal(result.attempts,2);assert.ok(result.blocks.some(b=>b.text.includes('abwarten')));assert.ok(!result.blocks.some(b=>b.text.includes('positiv')));
});
