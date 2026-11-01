import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,readdirSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join,dirname} from 'node:path';
import {createRequire} from 'node:module';
import {generateKeyPairSync,sign,createHash} from 'node:crypto';
import vm from 'node:vm';
const require=createRequire(resolve('app/package.json'));
const appPath=resolve('app');
function runtime(){
 const dir=mkdtempSync(join(tmpdir(),'lorevia-public-')),handlers=new Map(),paths={appData:dir,home:dir,userData:dir};
 const app={getPath:k=>paths[k]||dir,setPath:(k,v)=>paths[k]=v,setName(){},getAppPath:()=>appPath,getVersion:()=> '0.5.0',on(){},whenReady:()=>new Promise(()=>{}),requestSingleInstanceLock:()=>true,quit(){},setAppUserModelId(){}};
 const electron={app,ipcMain:{handle:(k,v)=>{if(handlers.has(k))throw Error('Doppeltes IPC '+k);handlers.set(k,v);}},clipboard:{writeText(){}}};
 const context=vm.createContext({require:n=>n==='electron'?electron:require(n),process,console,Buffer,URL,setTimeout,clearTimeout,setInterval,clearInterval,__dirname:join(appPath,'out/main'),performance,fetch,AbortController,AbortSignal});
 vm.runInContext(readFileSync(join(appPath,'out/main/index.js'),'utf8'),context);
 const run=code=>vm.runInContext(code,context);const call=(k,...args)=>handlers.get(k)({},...args);
 return {dir,context,run,call,paths};
}
const plain=x=>JSON.parse(JSON.stringify(x));
test('Erweiterte Akte bleibt bei Normalisierung und Storyspeicherung erhalten',()=>{
 const r=runtime();r.context.input={name:'Selina',akte:{fields:{spezies:'Elfe',ziel:'Das Studium abschließen',widersprueche:'Selbstbewusst, aber Angst vor Ablehnung'},traits:{mut:130,geduld:0},locked:['spezies','ungueltig'],relations:[{name:'Mara',sicht:'Beste Freundin',vertrauen:'80',ursache:'Gemeinsame Schulzeit'}],profile:'aktiv'}};
 const f=r.run('normalizeFigur(input)');assert.equal(f.akte.fields.ziel,'Das Studium abschließen');assert.equal(f.akte.traits.mut,100);assert.equal(f.akte.traits.geduld,0);assert.deepEqual(plain(f.akte.locked),['spezies']);
 const story=r.run('ctxToStory({figuren:[input],verlauf:[]})');assert.match(story.characters[0].profile,/Studium abschließen/);assert.match(story.characters[0].profile,/gilt nicht automatisch umgekehrt/);
 r.context.f=f;r.run('saveStory("test",{figuren:[f]})');assert.equal(r.run('loadStory("test").figuren[0].akte.fields.spezies'),'Elfe');
});
test('KI-Vorschläge überschreiben weder gesetzte noch gesperrte leere Felder',()=>{
 const r=runtime();r.context.f={name:'Selina',alter:'24',akte:{fields:{spezies:'Elfe'},locked:['angst']}};r.context.s={base:{name:'Falsch',alter:'90',aussehen:'Schwarze Haare'},fields:{spezies:'Mensch',angst:'Dunkelheit',ziel:'Studium'}};
 const f=r.run('lpApplySuggestions(f,s)');assert.equal(f.name,'Selina');assert.equal(f.alter,'24');assert.equal(f.akte.fields.spezies,'Elfe');assert.equal(f.akte.fields.angst,undefined);assert.equal(f.akte.fields.ziel,'Studium');
});
test('Bildprompt nutzt feste Merkmale, keine Geheimnisse oder erfundenen Körpermerkmale',()=>{
 const r=runtime();r.context.f={name:'Selina',aussehen:'Rote Haare',akte:{fields:{geheimnis:'Geheime Spionin'},imageFixed:{haare:'Schwarz',augen:'Grün'},image:{style:'Anime',view:'Ganzkörper',clothing:'Rüstung'}}};
 const p=r.run('lpImagePrompt(f)');assert.match(p.prompt,/Schwarz/);assert.match(p.prompt,/Rüstung/);assert.doesNotMatch(p.prompt,/Spionin|Rote Haare/);
});
test('Ohne Nutzungsschlüssel sind auch Einrichtungs- und Charakter-IPC gesperrt',async()=>{
 const r=runtime();for(const channel of ['settings:load','story:list','setup:resolve','charakter:assistent','bibliothek:scan','bibliothek:speichern','community:download']){const result=await r.call(channel);assert.equal(result.ok,false,channel);assert.match(result.error,/Nutzungsschlüssel/,channel);}
 assert.equal((await r.call('nutzung:status')).active,false);assert.equal((await r.call('nutzung:aktivieren','falsch')).ok,false);
});
test('Signierte Nutzungsschlüssel werden geprüft, Manipulation wird abgewiesen',()=>{
 const r=runtime(),pair=generateKeyPairSync('ed25519');const data=Buffer.from(JSON.stringify({app:'lorevia-community',id:'0123456789abcdef',label:'Test'}));const key=pair.publicKey.export({type:'spki',format:'pem'});r.context.key=key;r.context.code='LV1.'+data.toString('base64url')+'.'+sign(null,data,pair.privateKey).toString('base64url');
 assert.equal(r.run('lpLicenseVerify(code,key)').label,'Test');r.context.code=r.context.code.replace('LV1.','LV2.');assert.equal(r.run('lpLicenseVerify(code,key)'),null);
});
test('Freischaltung wird gespeichert und beim nächsten Start wieder erkannt',async()=>{
 const r=runtime(),pair=generateKeyPairSync('ed25519');const data=Buffer.from(JSON.stringify({app:'lorevia-community',id:'0123456789abcdef',label:'Test'}));r.context.key=pair.publicKey.export({type:'spki',format:'pem'});const code='LV1.'+data.toString('base64url')+'.'+sign(null,data,pair.privateKey).toString('base64url');
 r.run('lpLicensePublic=()=>key');assert.equal((await r.call('nutzung:aktivieren',code)).active,true);
 r.run('lpLicenseLoaded=false;lpUsageKey=null');assert.equal((await r.call('nutzung:status')).active,true);assert.equal((await r.call('bibliothek:scan',{art:'mein'})).ok,true);
 writeFileSync(r.run('lpLicensePath()'),JSON.stringify({code:code.replace('LV1.','LV2.')}));r.run('lpLicenseLoaded=false;lpUsageKey=null');assert.equal((await r.call('nutzung:status')).active,false);
});
test('Lokale Vorlagen werden mit Namen und vollständiger Akte wieder eingelesen',async()=>{
 const r=runtime();r.run('lpUsageKey={id:"test",label:"Test"};lpLicenseLoaded=true');
 const result=await r.call('bibliothek:speichern',{storyId:'test',figur:{name:'Selina',akte:{fields:{ziel:'Anerkennung',spezies:'Elfe'}}}});assert.equal(result.ok,true,result.error);
 const scan=await r.call('bibliothek:scan',{art:'mein'});assert.equal(scan.eintraege.length,1);assert.equal(scan.eintraege[0].name,'Selina');assert.equal(scan.eintraege[0].vorlage.akte.fields.ziel,'Anerkennung');
 const outside=join(r.dir,'fremd.png');writeFileSync(outside,'x');const invalid=await r.call('bibliothek:speichern',{storyId:'test',figur:{name:'Falsch',photo:{path:outside,name:'fremd.png',kind:'image',id:'a1',mime:'image/png'}}});assert.equal(invalid.ok,false);assert.equal((await r.call('bibliothek:scan',{art:'mein'})).eintraege.length,1);
});
test('Assistent filtert überschriebene und unbekannte KI-Felder serverseitig',async()=>{
 const r=runtime();r.run('lpUsageKey={id:"test",label:"Test"};lpLicenseLoaded=true;client={chat:async()=>({message:{content:JSON.stringify({base:{name:"Falsch",alter:"24"},fields:{spezies:"Mensch",ziel:"Studium",evil:"x"}})}})}');
 const result=await r.call('charakter:assistent',{task:'complete',figure:{name:'Selina',akte:{fields:{spezies:'Elfe'}}}});assert.equal(result.ok,true,result.error);assert.equal(result.suggestion.base.name,undefined);assert.equal(result.suggestion.fields.spezies,undefined);assert.equal(result.suggestion.fields.evil,undefined);assert.equal(result.suggestion.fields.ziel,'Studium');
});
test('Platzhalter werden nicht als KI-Ergänzung angeboten',async()=>{
 const r=runtime();r.run('lpUsageKey={id:"test",label:"Test"};lpLicenseLoaded=true;client={chat:async()=>({message:{content:JSON.stringify({base:{aussehen:"Gesamterscheinung"},fields:{spezies:"Spezies",ziel:"Das Studium abschließen",angst:"Wovor hat sie Angst?"}})}})}');
 const result=await r.call('charakter:assistent',{task:'complete',figure:{name:'Selina'}});assert.equal(result.suggestion.base.aussehen,undefined);assert.equal(result.suggestion.fields.spezies,undefined);assert.equal(result.suggestion.fields.angst,undefined);assert.equal(result.suggestion.fields.ziel,'Das Studium abschließen');
});
function fakeRelease(r,{badChecksum=false,badHost=false}={}){
 const bytes=Buffer.from('Testpaket'),name='Lorevia-Community-Setup-0.6.0.exe',base='https://github.com/DeadLive667/Lorevia-Realease/releases/download/v0.6.0/';
 r.context.fetch=async url=>{
  if(String(url).includes('api.github.com'))return new Response(JSON.stringify({tag_name:'v0.6.0',draft:false,prerelease:false,assets:[{name,size:bytes.length,browser_download_url:badHost?'https://example.com/fremd.exe':base+name},{name:'SHA256SUMS.txt',size:150,browser_download_url:base+'SHA256SUMS.txt'}]}));
  if(String(url).endsWith('SHA256SUMS.txt'))return new Response((badChecksum?'0'.repeat(64):createHash('sha256').update(bytes).digest('hex'))+'  '+name+'\n');
  return new Response(bytes,{headers:{'content-length':String(bytes.length)}});
 };
 return {bytes,name};
}
test('Update lädt das neueste Setup und prüft dessen SHA256 vor dem Speichern',async()=>{
 const r=runtime(),expected=fakeRelease(r);const result=await r.run('lpDownloadCommunity()');assert.equal(result.version,'0.6.0');assert.ok(result.file.endsWith(expected.name));assert.deepEqual(readFileSync(result.file),expected.bytes);
});
test('Update verwirft falsche Prüfsummen und fremde Downloadquellen',async()=>{
 const r=runtime();fakeRelease(r,{badChecksum:true});await assert.rejects(r.run('lpDownloadCommunity()'),/Prüfsumme stimmt nicht/);
 const folder=join(r.dir,'Lorevia Community Updates');assert.equal(readdirSync(folder).length,0);
 fakeRelease(r,{badHost:true});await assert.rejects(r.run('lpDownloadCommunity()'),/Ungültige Downloadquelle/);
});
