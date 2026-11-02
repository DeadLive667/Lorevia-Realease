import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
import vm from 'node:vm';
const require = createRequire(resolve('app/package.json'));
export function loadRuntime(file = 'app/out/main/index.js') {
  const source = readFileSync(file, 'utf8');
  const beforeApp = source.slice(0, source.indexOf('// src/main/index.js'));
  if (!beforeApp) throw new Error('Programmstart-Grenze fehlt');
  const dir = mkdtempSync(resolve(tmpdir(), 'lorevia-pruefung-'));
  const handlers = new Map();
  const context = vm.createContext({
    require(name) {
      if (name === 'electron') return { app:{getPath:()=>dir,setName(){},setPath(){},getAppPath:()=>resolve('app'),getVersion:()=> '0.5.2'}, ipcMain:{handle:(key,fn)=>handlers.set(key,fn)} };
      return require(name);
    },
    process, console, Buffer, URL, setTimeout, clearTimeout, setInterval, clearInterval,
    __dirname:dirname(resolve(file)), performance, fetch, AbortController
  });
  vm.runInContext(beforeApp, context, { filename: file });
  const api = vm.runInContext(`({ generate,continueStory,checkOutput,ctxToStory,buildMessages,buildSystemPrompt,
    freeStoryId,saveStory,loadStory,normalizeMemory,checkContinuity,
    setClient(value){client=value;},setOptions(value){Object.assign(MODEL_OPTIONS,value);},
    ...(typeof lvResolveSetup === 'function' ? {lvResolveSetup,lvIncoming,lvWithRelations,lvInverse,lvCleanSetup,lvAbsentViolations,lvSetupMessages,lvGroundAnswers,lvStoryJson,lvIsEntryInput,lvSplitInput,lvMergeDirections,lvStylePrompt,lvOwnedNames,lvToDuNarration,lvOwnInputBlocks}: {}),
    ...(typeof lvContinuation==='function'?{lvContinuation,lvContinuationPrompt,lvEpicScope,lvStoryDate,autoFix,lvAssertNarrativeSpeakers,buildPackage,importFile,readZip,writeZip,normalizeFigur}: {}),
    ...(typeof lvDraftIssues==='function'?{lvDraftIssues,lvFormatDraft,lvLengthPrompt}: {})
  })`,context);
  return { api, context, dir, handlers };
}
export const plain = (value) => JSON.parse(JSON.stringify(value));
