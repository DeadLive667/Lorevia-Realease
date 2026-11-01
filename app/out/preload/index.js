let electron = require("electron");
// src/preload/index.js
electron.contextBridge.exposeInMainWorld("lorevia", {
	resolveSetup: (ctx, scope, question, model) => electron.ipcRenderer.invoke("setup:resolve", {ctx,scope,question,model}),
	saveTemplate: (storyId,figur) => electron.ipcRenderer.invoke("bibliothek:speichern",{storyId,figur}),
	characterAssist: (data) => electron.ipcRenderer.invoke("charakter:assistent",data),
	copyCharacterText: (text) => electron.ipcRenderer.invoke("charakter:kopieren",text),
	usageKeyStatus: () => electron.ipcRenderer.invoke("nutzung:status"),
	activateUsageKey: (code) => electron.ipcRenderer.invoke("nutzung:aktivieren",code),
	downloadCommunity: () => electron.ipcRenderer.invoke("community:download"),
	onCommunityProgress: (cb) => {const h=(_e,p)=>cb(p);electron.ipcRenderer.on("community:update-progress",h);return ()=>electron.ipcRenderer.removeListener("community:update-progress",h);},
	loadSettings: () => electron.ipcRenderer.invoke("settings:load"),
	saveSettings: (s) => electron.ipcRenderer.invoke("settings:save", s),
	loadStory: (id) => electron.ipcRenderer.invoke("story:load", id),
	saveStory: (id, data) => electron.ipcRenderer.invoke("story:save", {
		id,
		data
	}),
	listStories: () => electron.ipcRenderer.invoke("story:list"),
	dataDir: () => electron.ipcRenderer.invoke("state:dir"),
	openDataDir: () => electron.ipcRenderer.invoke("open:dir"),
	openExternal: (url) => electron.ipcRenderer.invoke("open:external", url),
	ollamaStatus: (model) => electron.ipcRenderer.invoke("ollama:status", model),
	pullModel: (model) => electron.ipcRenderer.invoke("ollama:pull", model),
	onPullProgress: (cb) => {
		const h = (_e, p) => cb(p);
		electron.ipcRenderer.on("ollama:pull-progress", h);
		return () => electron.ipcRenderer.removeListener("ollama:pull-progress", h);
	},
	setupKI: (model) => electron.ipcRenderer.invoke("ollama:setup", model),
	onSetupProgress: (cb) => {
		const h = (_e, p) => cb(p);
		electron.ipcRenderer.on("ollama:setup-progress", h);
		return () => electron.ipcRenderer.removeListener("ollama:setup-progress", h);
	},
	appVersion: () => electron.ipcRenderer.invoke("app:version"),
	stimmenStatus: () => electron.ipcRenderer.invoke("stimmen:status"),
	setupStimmen: () => electron.ipcRenderer.invoke("stimmen:setup"),
	onStimmenProgress: (cb) => {
		const h = (_e, p) => cb(p);
		electron.ipcRenderer.on("stimmen:setup-progress", h);
		return () => electron.ipcRenderer.removeListener("stimmen:setup-progress", h);
	},
	sprechen: (text, stimme, tempo) => electron.ipcRenderer.invoke("stimmen:sprechen", {
		text,
		stimme,
		tempo
	}),
	sprechenStimme: (text, voiceId) => electron.ipcRenderer.invoke("stimmen:sprechen", {
		text,
		voiceId
	}),
	stimmenListe: () => electron.ipcRenderer.invoke("stimmen:liste"),
	stimmeProbe: (voiceId) => electron.ipcRenderer.invoke("stimmen:probe", { voiceId }),
	stimmeLaden: (voiceId) => electron.ipcRenderer.invoke("stimmen:laden", { voiceId }),
	scanBibliothek: () => electron.ipcRenderer.invoke("bibliothek:scan"),
	scanMeinChar: () => electron.ipcRenderer.invoke("bibliothek:scan", { art: "mein" }),
	briefFoto: (storyId, path) => electron.ipcRenderer.invoke("brief:foto", {
		storyId,
		path
	}),
	briefText: (path) => electron.ipcRenderer.invoke("brief:text", { path }),
	bibliothekBild: (path) => electron.ipcRenderer.invoke("bibliothek:thumb", path),
	importCharakter: (storyId, foto, brief) => electron.ipcRenderer.invoke("bibliothek:import", {
		storyId,
		foto,
		brief
	}),
	checkUpdate: () => electron.ipcRenderer.invoke("update:check"),
	installUpdate: () => electron.ipcRenderer.invoke("update:install"),
	onUpdateProgress: (cb) => {
		const h = (_e, p) => cb(p);
		electron.ipcRenderer.on("update:progress", h);
		return () => electron.ipcRenderer.removeListener("update:progress", h);
	},
	pickFiles: (opts = {}) => electron.ipcRenderer.invoke("attach:pick", opts).then((r) => {
		if (opts.withErrors) return r;
		if (r.errors?.length && !r.files.length) throw new Error(r.errors.join("\n"));
		return r.files;
	}),
	addFiles: async (storyId, files) => {
		const paths = [], data = [];
		for (const f of [...files]) {
			if (typeof f === "string") {
				paths.push(f);
				continue;
			}
			const p = electron.webUtils.getPathForFile(f);
			if (p) paths.push(p);
			else if (f.size <= 52428800) data.push({
				name: f.name || "eingefuegt.png",
				bytes: new Uint8Array(await f.arrayBuffer())
			});
		}
		return electron.ipcRenderer.invoke("attach:add", {
			storyId,
			paths,
			data
		});
	},
	readAttachment: (path) => electron.ipcRenderer.invoke("attach:read", path),
	openAttachment: (path) => electron.ipcRenderer.invoke("attach:open", path),
	describeImage: (path, opts = {}) => electron.ipcRenderer.invoke("vision:describe", {
		path,
		...opts
	}),
	exportStory: (storyId, state, title) => electron.ipcRenderer.invoke("story:export", {
		storyId,
		state,
		title
	}),
	importStory: () => electron.ipcRenderer.invoke("story:import"),
	ausBildFuellen: (path, model) => electron.ipcRenderer.invoke("figur:aus-bild", {
		path,
		model
	}),
	kiFuellen: (daten, model) => electron.ipcRenderer.invoke("figur:ki-fuellen", {
		daten,
		model
	}),
	continueStory: (ctx, model) => electron.ipcRenderer.invoke("story:continue", {
		ctx,
		model
	}),
	analyzeWorld: (text, welt, model) => electron.ipcRenderer.invoke("welt:analyze", {
		text,
		welt,
		model
	}),
	analyzeDialogue: (ctx, model, umfang) => electron.ipcRenderer.invoke("story:analyze", {
		ctx,
		model,
		umfang
	}),
	captureBug: () => electron.ipcRenderer.invoke("bug:capture"),
	saveBugReport: (daten) => electron.ipcRenderer.invoke("bug:save", daten),
	openBugDir: (dir) => electron.ipcRenderer.invoke("bug:open", dir),
	requestFullscreen: () => electron.ipcRenderer.invoke("win:request-fullscreen"),
	toggleFullscreen: () => electron.ipcRenderer.invoke("win:toggle-fullscreen"),
	isFullscreen: () => electron.ipcRenderer.invoke("win:is-fullscreen"),
	onFullscreen: (cb) => {
		const h = (_e, on) => cb(on);
		electron.ipcRenderer.on("win:fullscreen", h);
		return () => electron.ipcRenderer.removeListener("win:fullscreen", h);
	}
});
