/* Parlez-Vous-QSO?! – Weboberfläche */
(function () {
  "use strict";

  const DATA = window.PVQ_DATA;
  const CALLSIGN = window.PVQ_CALLSIGN;
  const STORE_KEY = "pvq-settings-v1";

  // ---------------------------------------------------------------------------
  // Sprachen: Anzeigenamen und TTS-Zuordnung
  // bcp: bevorzugte Stimme; fallback: verwandte Sprachen, falls keine Stimme da ist
  // ---------------------------------------------------------------------------
  const LANGS = {
    ar: { native: "العربية", de: "Arabisch", en: "Arabic", bcp: ["ar-SA", "ar"], dir: "rtl" },
    ca: { native: "Català", de: "Katalanisch", en: "Catalan", bcp: ["ca-ES", "ca"] },
    cs: { native: "Čeština", de: "Tschechisch", en: "Czech", bcp: ["cs-CZ", "cs"], fallback: ["sk"] },
    de: { native: "Deutsch", de: "Deutsch", en: "German", bcp: ["de-DE", "de"] },
    es: { native: "Español", de: "Spanisch", en: "Spanish", bcp: ["es-ES", "es"] },
    et: { native: "Eesti", de: "Estnisch", en: "Estonian", bcp: ["et-EE", "et"] },
    fr: { native: "Français", de: "Französisch", en: "French", bcp: ["fr-FR", "fr"] },
    hu: { native: "Magyar", de: "Ungarisch", en: "Hungarian", bcp: ["hu-HU", "hu"] },
    it: { native: "Italiano", de: "Italienisch", en: "Italian", bcp: ["it-IT", "it"] },
    lv: { native: "Latviešu", de: "Lettisch", en: "Latvian", bcp: ["lv-LV", "lv"] },
    nl: { native: "Nederlands", de: "Niederländisch", en: "Dutch", bcp: ["nl-NL", "nl"] },
    pl: { native: "Polski", de: "Polnisch", en: "Polish", bcp: ["pl-PL", "pl"] },
    pt: { native: "Português", de: "Portugiesisch", en: "Portuguese", bcp: ["pt-PT", "pt"] },
    ro: { native: "Română", de: "Rumänisch", en: "Romanian", bcp: ["ro-RO", "ro"] },
    sr: { native: "Srpski", de: "Serbisch", en: "Serbian", bcp: ["sr-Latn-RS", "sr-RS", "sr"], fallback: ["hr", "bs"] },
    sv: { native: "Svenska", de: "Schwedisch", en: "Swedish", bcp: ["sv-SE", "sv"] },
    uk: { native: "Українська", de: "Ukrainisch", en: "Ukrainian", bcp: ["uk-UA", "uk"] },
    en: { native: "English", de: "Englisch", en: "English", bcp: ["en-GB", "en"] },
  };
  const GUIDE_CODES = Object.keys(DATA.languages).sort((a, b) =>
    LANGS[a].native.localeCompare(LANGS[b].native, "de"));

  // ---------------------------------------------------------------------------
  // Texte der Oberfläche
  // ---------------------------------------------------------------------------
  const I18N = {
    de: {
      tagline: "QSO-Sprachführer für Funkamateure – 17 Sprachen mit Lautschrift und Sprachausgabe",
      callTitle: "Rufzeichen → Sprache",
      callPlaceholder: "Rufzeichen eingeben, z. B. F5OQO oder EA8/DL1ABC",
      callApply: "Sprache anzeigen",
      callUnknown: "Kein bekannter Präfix für „{call}“.",
      callCountry: "<strong>{call}</strong> → Präfix <code>{prefix}</code> → <strong>{country}</strong>",
      callLangs: "Passende Sprache: {langs}",
      callRelated: "verwandt",
      callEnglish: "Englisch ist die Ausgangssprache aller Sprachführer – die englische Spalte steht in jeder Phrase.",
      callNoGuide: "Für dieses Land gibt es (noch) keinen Sprachführer. Englisch ist meist eine gute Wahl.",
      langTitle: "Sprachen",
      all: "alle", none: "keine",
      ttsPiper: "Neural-Stimme (Piper)", ttsOk: "Systemstimme", ttsFallback: "Ersatz- oder Roboterstimme", ttsNone: "keine Stimme auf diesem Gerät",
      ttsNoneShort: "keine Stimme",
      ttsFallbackShort: "Ersatzstimme",
      ttsUnsupported: "Dieser Browser unterstützt keine Sprachausgabe (Web Speech API). Texte und Lautschrift sind trotzdem verfügbar.",
      ttsLoading: "Stimmen werden geladen …",
      search: "Suche", searchPlaceholder: "Englisch, Übersetzung, Lautschrift oder Nr. – z. B. antenna, Wetter, 8.1",
      section: "Abschnitt", allSections: "Alle Abschnitte",
      showIpa: "Lautschrift (IPA)", showEn: "Englisch",
      personalTitle: "Eigene Angaben einsetzen",
      personalHint: "Ersetzt die Beispielwerte (Name, Ort, Rufzeichen, Gerät) in den Phrasen und in der Sprachausgabe. Grammatische Endungen (z. B. Fälle) werden nicht angepasst, die Lautschrift bleibt die des Beispiels. Angepasste Phrasen werden mit der Browser-Stimme vorgelesen. Die Angaben bleiben nur in diesem Browser gespeichert.",
      pName: "Vorname", pQth: "Wohnort (QTH)", pCall: "Rufzeichen", pRig: "Funkgerät", pClear: "Angaben löschen",
      personalized: "angepasst – Lautschrift gilt für das Beispiel",
      voiceTitle: "Sprachausgabe & Stimmen",
      rate: "Sprechtempo",
      autoVoice: "automatisch (beste Browser-Stimme)", license: "Lizenz", source: "Quelle",
      voiceHelp: "<p>Standard sind vorab erzeugte Neural-Stimmen (Piper). Wo keine vorhanden sind (Arabisch, Serbisch, eigene Angaben) oder wenn du oben eine andere Stimme wählst, werden die Stimmen deines Betriebssystems bzw. Browsers genutzt. Diese lassen sich meist nachinstallieren:</p><ul><li><strong>Windows:</strong> Einstellungen → Zeit und Sprache → Sprache → Sprache hinzufügen (mit Sprachausgabe)</li><li><strong>macOS/iOS:</strong> Bedienungshilfen → Gesprochene Inhalte → Stimmen</li><li><strong>Android:</strong> Einstellungen → Text-in-Sprache → Sprachdaten von Google installieren</li><li><strong>Linux:</strong> speech-dispatcher mit espeak-ng (Firefox) – Chrome/Edge bringen teils Online-Stimmen mit</li></ul><p>Nach der Installation die Seite neu laden.</p>",
      count: "{n} Phrasen",
      countNone: "Keine Phrasen gefunden.",
      selectLang: "Bitte mindestens eine Sprache auswählen.",
      play: "Vorlesen", stop: "Stopp",
      info: "Infos zur Fassung",
      notes: "Hinweise zur Übertragung und Aussprache",
      readingKey: "Leseschlüssel",
      notesLangNote: "Die Hinweise liegen in den Quelldateien auf Deutsch vor.",
      links: "Quellen",
      footer: "Inhalte: <a href=\"https://github.com/MichaelRenner/Parlez-Vous-QSO\">Parlez-Vous-QSO?!</a> (GPL-3.0) mit den in den Sprachfassungen genannten Credits. Sprachausgabe: vorab erzeugt mit <a href=\"https://github.com/OHF-Voice/piper1-gpl\">Piper</a> (Stimmen und Lizenzen unter „i“ je Sprache) bzw. lokal im Browser; es werden keine Daten übertragen.",
    },
    en: {
      tagline: "QSO phrase book for radio amateurs – 17 languages with phonetic transcription and speech output",
      callTitle: "Call sign → language",
      callPlaceholder: "Enter a call sign, e.g. F5OQO or EA8/DL1ABC",
      callApply: "Show language",
      callUnknown: "No known prefix for “{call}”.",
      callCountry: "<strong>{call}</strong> → prefix <code>{prefix}</code> → <strong>{country}</strong>",
      callLangs: "Matching language: {langs}",
      callRelated: "related",
      callEnglish: "English is the source language of all phrase books – every phrase includes the English text.",
      callNoGuide: "There is no phrase book for this country (yet). English is usually a good choice.",
      langTitle: "Languages",
      all: "all", none: "none",
      ttsPiper: "Neural voice (Piper)", ttsOk: "system voice", ttsFallback: "substitute or robotic voice", ttsNone: "no voice on this device",
      ttsNoneShort: "no voice",
      ttsFallbackShort: "substitute voice",
      ttsUnsupported: "This browser does not support speech output (Web Speech API). Texts and transcriptions are still available.",
      ttsLoading: "Loading voices …",
      search: "Search", searchPlaceholder: "English, translation, IPA or no. – e.g. antenna, weather, 8.1",
      section: "Section", allSections: "All sections",
      showIpa: "Transcription (IPA)", showEn: "English",
      personalTitle: "Insert your own details",
      personalHint: "Replaces the example values (name, town, call sign, radio) in the phrases and in speech output. Grammatical endings (e.g. cases) are not adapted; the IPA still refers to the example. Customised phrases are read with the browser voice. Your details are stored in this browser only.",
      pName: "First name", pQth: "Town (QTH)", pCall: "Call sign", pRig: "Radio", pClear: "Clear details",
      personalized: "customised – IPA refers to the example",
      voiceTitle: "Speech output & voices",
      rate: "Speaking rate",
      autoVoice: "automatic (best browser voice)", license: "License", source: "source",
      voiceHelp: "<p>By default, pre-generated neural voices (Piper) are used. Where none exist (Arabic, Serbian, your own details) or if you select another voice above, the voices of your operating system or browser are used. These can usually be installed:</p><ul><li><strong>Windows:</strong> Settings → Time & language → Language → Add a language (with text-to-speech)</li><li><strong>macOS/iOS:</strong> Accessibility → Spoken content → Voices</li><li><strong>Android:</strong> Settings → Text-to-speech → install voice data from Google</li><li><strong>Linux:</strong> speech-dispatcher with espeak-ng (Firefox) – Chrome/Edge partly provide online voices</li></ul><p>Reload the page after installing.</p>",
      count: "{n} phrases",
      countNone: "No phrases found.",
      selectLang: "Please select at least one language.",
      play: "Read aloud", stop: "Stop",
      info: "About this version",
      notes: "Notes on transcription and pronunciation",
      readingKey: "Reading key",
      notesLangNote: "The notes are available in German only (as in the source files).",
      links: "Sources",
      footer: "Content: <a href=\"https://github.com/MichaelRenner/Parlez-Vous-QSO\">Parlez-Vous-QSO?!</a> (GPL-3.0) with the credits given in each language version. Speech: pre-generated with <a href=\"https://github.com/OHF-Voice/piper1-gpl\">Piper</a> (voices and licences under “i” per language) or locally in your browser; no data is transmitted.",
    },
  };

  // ---------------------------------------------------------------------------
  // Beispielwerte, die durch eigene Angaben ersetzt werden können
  // (Standard + sprachspezifische Schreibweisen aus den Vorlagen)
  // ---------------------------------------------------------------------------
  const SAMPLES = {
    name: { "*": ["Peter"], fr: ["Pierre"], ca: ["Pere"], hu: ["Péter"], lv: ["Pēteris"], pl: ["Piotr"],
      sr: ["Marko"], ar: ["بيتر"], uk: ["Пітер"] },
    qth: { "*": ["Sittingbourne"], sr: ["Sitingburn"], ar: ["سيتنغبورن"], uk: ["Сіттінгборн"] },
    call: { "*": ["M0ECS"] },
    rig: { "*": ["Icom 706", "Icom siebenhundertsechs", "ICOM sjuhundrasex"] },
  };

  // ---------------------------------------------------------------------------
  // Zustand
  // ---------------------------------------------------------------------------
  const defaults = {
    ui: (navigator.language || "de").toLowerCase().startsWith("de") ? "de" : "en",
    langs: ["fr"], q: "", sec: "all", showIpa: true, showEn: true,
    personal: { name: "", qth: "", call: "", rig: "" }, voices: {}, rate: 0.9,
  };
  const state = Object.assign({}, defaults, load());
  state.langs = state.langs.filter((l) => DATA.languages[l]);
  applyHash();

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* privater Modus */ }
    const h = new URLSearchParams();
    h.set("lang", state.langs.join(","));
    if (state.q) h.set("q", state.q);
    if (state.sec !== "all") h.set("sec", state.sec);
    history.replaceState(null, "", "#" + h.toString());
  }
  function applyHash() {
    const h = new URLSearchParams(location.hash.slice(1));
    if (h.has("lang")) state.langs = h.get("lang").split(",").filter((l) => DATA.languages[l]);
    if (h.has("q")) state.q = h.get("q");
    if (h.has("sec")) state.sec = h.get("sec");
  }

  const $ = (sel) => document.querySelector(sel);
  const t = (key, vars) => (I18N[state.ui][key] || key).replace(/\{(\w+)\}/g, (_, k) => (vars && k in vars ? vars[k] : ""));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const langName = (code) => LANGS[code][state.ui];
  const norm = (s) => String(s).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

  // ---------------------------------------------------------------------------
  // Phrasen sprachübergreifend zusammenführen
  // Abschnitte 1–9 über die Referenznummer, Länder (10) über den englischen Namen,
  // da die Nummerierung dort je Fassung abweicht.
  // ---------------------------------------------------------------------------
  const concepts = new Map();
  const sectionNames = {};
  for (const code of GUIDE_CODES) {
    const lang = DATA.languages[code];
    for (const s of lang.sections) {
      sectionNames[s.id] = sectionNames[s.id] || { en: s.en };
      sectionNames[s.id][code] = s.tr;
    }
    for (const p of lang.phrases) {
      const key = p.sec === 10 ? "c:" + p.en.toLowerCase() : p.ref;
      if (!concepts.has(key)) concepts.set(key, { key, sec: p.sec, ref: p.ref, byLang: {} });
      concepts.get(key).byLang[code] = p;
    }
  }
  const conceptList = [...concepts.values()].sort((a, b) => {
    if (a.sec !== b.sec) return a.sec - b.sec;
    if (a.sec === 10) return a.key.localeCompare(b.key, "en");
    return a.ref.split(".")[1].localeCompare(b.ref.split(".")[1]);
  });

  // ---------------------------------------------------------------------------
  // Eigene Angaben
  // ---------------------------------------------------------------------------
  function personalize(text, code) {
    let changed = false;
    for (const field of Object.keys(SAMPLES)) {
      const value = state.personal[field].trim();
      if (!value) continue;
      const samples = [...(SAMPLES[field][code] || []), ...SAMPLES[field]["*"]];
      for (const sample of samples) {
        if (text.includes(sample)) {
          text = text.split(sample).join(field === "call" ? value.toUpperCase() : value);
          changed = true;
        }
      }
    }
    return { text, changed };
  }

  // ---------------------------------------------------------------------------
  // Sprachausgabe
  // 1. vorgerenderte Piper-Aufnahmen (audio/manifest.js, siehe tools/build_audio.py)
  // 2. sonst Stimmen des Browsers/Betriebssystems (Web Speech API)
  // ---------------------------------------------------------------------------
  const AUDIO = window.PVQ_AUDIO || { voices: {}, files: {} };
  const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
  const player = new Audio();
  let voices = [];
  let voicesLoaded = false;

  function loadVoices() {
    voices = synth ? synth.getVoices() : [];
    if (voices.length) voicesLoaded = true;
  }

  // Piper wird genutzt, solange keine bestimmte Browser-Stimme gewählt ist
  const usePiper = (code) => !!AUDIO.voices[code] && !state.voices[code];
  const clipFor = (text, code) =>
    usePiper(code) && AUDIO.files[code] && AUDIO.files[code][text] ? `audio/${code}/${AUDIO.files[code][text]}` : null;

  const voiceLang = (v) => v.lang.replace("_", "-").toLowerCase();
  const isRobotic = (v) => /espeak|mbrola|festival|pico/i.test(v.name + " " + v.voiceURI);

  function voicesFor(code) {
    const cfg = LANGS[code];
    const base = cfg.bcp[cfg.bcp.length - 1];
    const own = voices.filter((v) => voiceLang(v).split("-")[0] === base);
    const fb = (cfg.fallback || []).flatMap((f) => voices.filter((v) => voiceLang(v).split("-")[0] === f));
    return { own, fallback: fb };
  }

  // Hochwertige Stimmen (neural/online/premium) vor einfachen Systemstimmen wie eSpeak
  function voiceScore(v, code) {
    let score = 0;
    if (/natural|neural|online|premium|enhanced|wavenet/i.test(v.name)) score += 4;
    if (/google|microsoft|siri|apple/i.test(v.name)) score += 2;
    if (LANGS[code].bcp.some((tag) => voiceLang(v) === tag.toLowerCase())) score += 1;
    if (isRobotic(v)) score -= 10;
    return score;
  }
  const best = (list, code) => list.slice().sort((a, b) => voiceScore(b, code) - voiceScore(a, code))[0];

  /** Browser-Stimme: {voice, status: ok|fallback|none}; fallback = verwandte Sprache oder Roboterstimme */
  function pickVoice(code) {
    if (!synth) return { voice: null, status: "none" };
    const { own, fallback } = voicesFor(code);
    const chosen = state.voices[code] && [...own, ...fallback].find((v) => v.voiceURI === state.voices[code]);
    const voice = chosen || best(own, code) || best(fallback, code);
    if (!voice) return { voice: null, status: "none" };
    return { voice, status: own.includes(voice) && !isRobotic(voice) ? "ok" : "fallback" };
  }

  /** Status für die Sprachliste: piper|ok|fallback|none|loading */
  function langStatus(code) {
    if (usePiper(code)) return "piper";
    if (synth && !voicesLoaded) return "loading";
    return pickVoice(code).status;
  }
  function statusText(status) {
    return t({ piper: "ttsPiper", ok: "ttsOk", fallback: "ttsFallback", none: "ttsNone", loading: "ttsLoading" }[status]);
  }

  // Rufzeichen und Kürzel mit Ziffern buchstabieren lassen, Platzhalter weglassen
  // (gleiche Regeln wie speech_text() in tools/build_audio.py)
  function speechText(text) {
    return text
      .replace(/<#+>/g, " … ")
      .replace(/\.{2,}|…/g, " … ")
      .replace(/\s\/\s/g, ", ")
      .replace(/\b(?=[A-Z0-9/]*\d)(?=[A-Z0-9/]*[A-Z])[A-Z0-9]{2,}(?:\/[A-Z0-9]+)*\b/g, (m) => m.split("").join(" "));
  }

  let speakingBtn = null;
  function stopSpeaking() {
    if (synth) synth.cancel();
    player.pause();
    if (speakingBtn) {
      speakingBtn.classList.remove("speaking");
      speakingBtn.setAttribute("aria-label", t("play"));
    }
    speakingBtn = null;
  }

  function speak(btn) {
    const wasSame = speakingBtn === btn;
    stopSpeaking();
    if (wasSame) return;
    const done = () => { if (speakingBtn === btn) stopSpeaking(); };
    speakingBtn = btn;
    btn.classList.add("speaking");
    btn.setAttribute("aria-label", t("stop"));

    if (btn.dataset.src) {
      player.src = btn.dataset.src;
      player.playbackRate = state.rate;
      player.preservesPitch = true;
      player.onended = player.onerror = done;
      player.play().catch(done);
      return;
    }
    const { voice } = pickVoice(btn.dataset.code);
    if (!voice) { done(); return; }
    const u = new SpeechSynthesisUtterance(speechText(btn.dataset.say));
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = state.rate;
    u.onend = u.onerror = done;
    synth.speak(u);
  }

  function speakButton(text, code) {
    const clip = clipFor(text, code);
    if (clip) {
      return `<button type="button" class="speak ok" data-src="${esc(clip)}"
        aria-label="${esc(t("play"))}" title="${esc(t("ttsPiper"))}: ${esc(AUDIO.voices[code].id)}">🔊</button>`;
    }
    if (synth && !voicesLoaded) return "";
    const { status, voice } = pickVoice(code);
    if (status === "none") {
      return `<span class="tts-missing" title="${esc(t("ttsNone"))}">🔇 ${esc(t("ttsNoneShort"))}</span>`;
    }
    const title = status === "fallback"
      ? `${t("ttsFallbackShort")}: ${voice.name} (${voice.lang})` : `${voice.name} (${voice.lang})`;
    return `<button type="button" class="speak ${status}" data-say="${esc(text)}" data-code="${code}"
      aria-label="${esc(t("play"))}" title="${esc(title)}">🔊</button>`;
  }

  // ---------------------------------------------------------------------------
  // Darstellung
  // ---------------------------------------------------------------------------
  function renderStatic() {
    document.documentElement.lang = state.ui;
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.querySelectorAll("[data-ui-lang]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.uiLang === state.ui));

    const sel = $("#section");
    const secTitle = (id) => (state.ui === "de" && sectionNames[id].de ? sectionNames[id].de : sectionNames[id].en);
    sel.innerHTML = `<option value="all">${esc(t("allSections"))}</option>` +
      Object.keys(sectionNames).map((id) => `<option value="${id}">${id}. ${esc(secTitle(id))}</option>`).join("");
    sel.value = state.sec;

    const banner = $("#tts-banner");
    banner.hidden = !!synth;
    banner.textContent = synth ? "" : t("ttsUnsupported");
  }

  function renderLangs() {
    $("#lang-list").innerHTML = GUIDE_CODES.map((code) => {
      const status = langStatus(code);
      return `<span class="lang-chip">
        <label title="${esc(statusText(status))}">
          <input type="checkbox" value="${code}" ${state.langs.includes(code) ? "checked" : ""}>
          <span class="tts-dot ${status}"></span>
          <span lang="${code}">${esc(LANGS[code].native)}</span>
          ${LANGS[code].native !== langName(code) ? `<small>${esc(langName(code))}</small>` : ""}
        </label>
        <button type="button" class="info-btn" data-info="${code}" title="${esc(t("info"))}" aria-label="${esc(t("info"))}: ${esc(langName(code))}">i</button>
      </span>`;
    }).join("");
  }

  function renderVoices() {
    $("#rate").value = state.rate;
    $("#rate-out").textContent = Number(state.rate).toFixed(2) + "×";
    const codes = ["en", ...GUIDE_CODES];
    $("#voice-list").innerHTML = codes.map((code) => {
      const { own, fallback } = voicesFor(code);
      const piper = AUDIO.voices[code];
      const auto = piper ? `${t("ttsPiper")}: ${piper.id}` : t("autoVoice");
      const opts = [...own, ...fallback].map((v) =>
        `<option value="${esc(v.voiceURI)}" ${state.voices[code] === v.voiceURI ? "selected" : ""}>${esc(v.name)} (${esc(v.lang)})${own.includes(v) && !isRobotic(v) ? "" : " – " + esc(t("ttsFallbackShort"))}</option>`).join("");
      const status = langStatus(code);
      return `<div class="voice-row">
        <span title="${esc(statusText(status))}"><span class="tts-dot ${status}"></span> ${esc(langName(code))}</span>
        ${piper || opts ? `<select data-voice="${code}"><option value="">${esc(auto)}</option>${opts}</select>`
          : `<em>${esc(statusText(status))}</em>`}
      </div>`;
    }).join("");
  }

  function renderResults() {
    const out = $("#results");
    const langs = GUIDE_CODES.filter((c) => state.langs.includes(c));
    if (!langs.length) {
      out.innerHTML = `<p class="empty">${esc(t("selectLang"))}</p>`;
      $("#count").textContent = "";
      return;
    }
    const needles = norm(state.q).split(/\s+/).filter(Boolean);
    const html = [];
    let count = 0;
    let currentSec = null;

    for (const c of conceptList) {
      if (state.sec !== "all" && String(c.sec) !== state.sec) continue;
      const present = langs.filter((l) => c.byLang[l]);
      if (!present.length) continue;

      const first = c.byLang[present[0]];
      const en = personalize(first.en, present[0]);
      const rows = present.map((code) => {
        const p = c.byLang[code];
        const alts = p.tr.map((tr) => personalize(tr, code));
        return { code, p, alts, changed: alts.some((a) => a.changed) };
      });

      if (needles.length) {
        const hay = norm([c.ref, en.text, sectionNames[c.sec].en, ...rows.flatMap((r) =>
          [r.p.ref, r.p.en, sectionNames[c.sec][r.code], r.p.ipa, ...r.alts.map((a) => a.text)])].join(" "));
        if (!needles.every((n) => hay.includes(n))) continue;
      }

      if (c.sec !== currentSec) {
        currentSec = c.sec;
        const titles = [sectionNames[c.sec].en, ...langs.map((l) => sectionNames[c.sec][l]).filter(Boolean)];
        const unique = [...new Set(titles)].slice(0, 4);
        html.push(`<h2 class="sec-title"><span>${c.sec}.</span> ${unique.map(esc).join(" · ")}</h2>`);
      }
      count++;

      const refs = [...new Set(rows.map((r) => r.p.ref))].join(" / ");
      html.push(`<article class="phrase">
        <header class="phrase-head">
          <span class="ref">${esc(refs)}</span>
          ${state.showEn ? `<span class="en" lang="en">${esc(en.text)}</span> ${speakButton(en.text, "en")}` : ""}
        </header>
        ${rows.map((r) => `<div class="tr-row">
          <span class="tr-lang" title="${esc(langName(r.code))}">${esc(r.code.toUpperCase())}</span>
          <div class="tr-body">
            ${r.alts.map((a) => `<div class="alt"><span class="tr" lang="${r.code}" ${LANGS[r.code].dir ? `dir="${LANGS[r.code].dir}"` : ""}>${esc(a.text)}</span> ${speakButton(a.text, r.code)}</div>`).join("")}
            ${state.showIpa && r.p.ipa ? `<div class="ipa ${r.changed ? "stale" : ""}" lang="${r.code}-fonipa">[${esc(r.p.ipa)}]${r.changed ? ` <small>${esc(t("personalized"))}</small>` : ""}</div>` : ""}
          </div>
        </div>`).join("")}
      </article>`);
    }

    out.innerHTML = count ? html.join("") : `<p class="empty">${esc(t("countNone"))}</p>`;
    $("#count").textContent = count ? t("count", { n: count }) : "";
  }

  function renderCall() {
    const input = $("#call-input").value.trim();
    const box = $("#call-result");
    if (!input) { box.innerHTML = ""; return null; }
    const r = CALLSIGN.lookup(input);
    if (!r) { box.innerHTML = `<p>${esc(t("callUnknown", { call: input.toUpperCase() }))}</p>`; return null; }
    const country = state.ui === "de" ? r.de : r.en;
    const guide = r.langs.filter((l) => DATA.languages[l.code]);
    const parts = [`<p>${t("callCountry", { call: esc(r.call), prefix: esc(r.prefix), country: esc(country) })}</p>`];
    if (guide.length) {
      const list = guide.map((l) => `<strong>${esc(langName(l.code))}</strong>${l.related ? ` (${esc(t("callRelated"))})` : ""}`).join(", ");
      parts.push(`<p>${t("callLangs", { langs: list })}</p>`);
    }
    if (r.langs.some((l) => l.code === "en")) parts.push(`<p class="hint">${esc(t("callEnglish"))}</p>`);
    else if (!guide.length) parts.push(`<p class="hint">${esc(t("callNoGuide"))}</p>`);
    box.innerHTML = parts.join("");
    return guide.map((l) => l.code);
  }

  function showInfo(code) {
    const L = DATA.languages[code];
    const links = [`<a href="${esc(L.tex)}" rel="noopener">LaTeX</a>`];
    if (L.pdf) links.push(`<a href="${esc(L.pdf)}" rel="noopener">PDF</a>`);
    $("#info-body").innerHTML = `
      <h2>${esc(LANGS[code].native)} <small>${esc(langName(code))}</small></h2>
      <p>${esc(L.intro)}</p>
      <p class="hint">${esc(L.credits)}</p>
      <p>${esc(t("links"))}: ${links.join(" · ")}</p>
      ${AUDIO.voices[code] ? `<p class="hint">${esc(t("ttsPiper"))}: ${esc(AUDIO.voices[code].id)} – ${esc(t("license"))}: ${esc(AUDIO.voices[code].license)} (<a href="${esc(AUDIO.voices[code].source)}" rel="noopener">${esc(t("source"))}</a>)</p>` : ""}
      ${L.readingKey ? `<div class="notes">${L.readingKey}</div>` : ""}
      <h3>${esc(L.notesTitle || t("notes"))}</h3>
      ${state.ui !== "de" ? `<p class="hint">${esc(t("notesLangNote"))}</p>` : ""}
      <div class="notes" lang="de">${L.notes}</div>`;
    const dlg = $("#info-dialog");
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }

  function renderAll() {
    renderStatic();
    renderLangs();
    renderVoices();
    renderCall();
    renderResults();
  }

  // ---------------------------------------------------------------------------
  // Ereignisse
  // ---------------------------------------------------------------------------
  let searchTimer;
  function update(fn) { fn(); save(); renderResults(); }

  document.querySelectorAll("[data-ui-lang]").forEach((b) =>
    b.addEventListener("click", () => { state.ui = b.dataset.uiLang; save(); renderAll(); }));

  $("#lang-list").addEventListener("change", (e) => {
    if (e.target.type !== "checkbox") return;
    update(() => {
      state.langs = GUIDE_CODES.filter((c) => c === e.target.value ? e.target.checked : state.langs.includes(c));
    });
  });
  $("#lang-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-info]");
    if (b) showInfo(b.dataset.info);
  });
  $("#lang-all").addEventListener("click", () => { update(() => { state.langs = [...GUIDE_CODES]; }); renderLangs(); });
  $("#lang-none").addEventListener("click", () => { update(() => { state.langs = []; }); renderLangs(); });

  $("#search").value = state.q;
  $("#search").addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => update(() => { state.q = e.target.value; }), 150);
  });
  $("#section").addEventListener("change", (e) => update(() => { state.sec = e.target.value; }));
  $("#show-ipa").checked = state.showIpa;
  $("#show-ipa").addEventListener("change", (e) => update(() => { state.showIpa = e.target.checked; }));
  $("#show-en").checked = state.showEn;
  $("#show-en").addEventListener("change", (e) => update(() => { state.showEn = e.target.checked; }));

  document.querySelectorAll("[data-field]").forEach((inp) => {
    inp.value = state.personal[inp.dataset.field] || "";
    inp.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => update(() => { state.personal[inp.dataset.field] = inp.value; }), 200);
    });
  });
  if (Object.values(state.personal).some(Boolean)) $("#personal").open = true;
  $("#p-clear").addEventListener("click", () => {
    document.querySelectorAll("[data-field]").forEach((inp) => { inp.value = ""; });
    update(() => { state.personal = { name: "", qth: "", call: "", rig: "" }; });
  });

  $("#call-input").addEventListener("input", renderCall);
  $("#call-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const codes = renderCall();
    if (codes && codes.length) {
      update(() => { state.langs = codes; state.sec = "all"; });
      renderLangs();
      $("#section").value = "all";
      $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  $("#rate").addEventListener("input", (e) => {
    state.rate = Number(e.target.value);
    $("#rate-out").textContent = state.rate.toFixed(2) + "×";
    save();
  });
  $("#voice-list").addEventListener("change", (e) => {
    const code = e.target.dataset.voice;
    if (!code) return;
    if (e.target.value) state.voices[code] = e.target.value; else delete state.voices[code];
    save();
    renderLangs();
    renderVoices();
    renderResults();
  });

  $("#results").addEventListener("click", (e) => {
    const b = e.target.closest("button.speak");
    if (b) speak(b);
  });

  if (synth) {
    loadVoices();
    synth.addEventListener
      ? synth.addEventListener("voiceschanged", () => { loadVoices(); renderLangs(); renderVoices(); renderResults(); })
      : (synth.onvoiceschanged = () => { loadVoices(); renderLangs(); renderVoices(); renderResults(); });
    // Manche Browser melden nie „voiceschanged“, wenn keine Stimmen installiert sind.
    setTimeout(() => { if (!voicesLoaded) { voicesLoaded = true; renderLangs(); renderVoices(); renderResults(); } }, 2500);
  }

  renderAll();
  save();
})();
