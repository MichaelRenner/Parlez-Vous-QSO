# Parlez-Vous-QSO?! – Weboberfläche

Durchsuchbare Weboberfläche für alle Sprachführer dieses Repositorys:

- **Suche** über englische Phrase, Übersetzung, IPA-Lautschrift und Referenznummer (Groß-/Kleinschreibung und Akzente egal)
- **Filter** nach Sprache (mehrere gleichzeitig zum Vergleich) und nach Abschnitt
- **Sprachausgabe** in der jeweiligen Landessprache: vorab erzeugte Neural-Stimmen
  ([Piper](https://github.com/OHF-Voice/piper1-gpl)) als MP3 in `audio/`. Wo keine Aufnahme existiert
  (Arabisch, Serbisch, eigene Angaben), kommt die beste Stimme des Browsers zum Einsatz (Web Speech API, mit
  Vorrang für Neural-/Online-Stimmen vor eSpeak). Pro Sprache wird angezeigt, welche Stimme verfügbar ist
  (Piper, Systemstimme, Ersatz-/Roboterstimme oder keine). Stimme und Sprechtempo sind einstellbar.
  Rufzeichen werden buchstabiert.
- **Rufzeichen → Sprache:** Rufzeichen eingeben (auch `EA8/DL1ABC`, `F5ABC/P`), das Land wird über den
  Präfix erkannt und die passende Sprache angezeigt
- **Eigene Angaben:** Name, QTH, Rufzeichen und Funkgerät ersetzen die Beispielwerte in Text und Sprachausgabe
- **Oberfläche Deutsch/Englisch** umschaltbar; Infos, Credits, Leseschlüssel und Hinweise jeder Fassung
- Läuft komplett statisch im Browser, ohne Server-Logik, Cookies oder externe Dienste.
  Einstellungen bleiben im `localStorage`, die Auswahl steht zusätzlich in der URL (teilbare Links).

## Auf einen Webserver hochladen

Diese Dateien aus `web/` in ein beliebiges Verzeichnis des Webservers kopieren:

```text
index.html  app.js  callsign.js  data.js  style.css  favicon.svg  audio/
```

Mehr ist nicht nötig, es gibt keine Abhängigkeiten. Die Seite funktioniert auch lokal per Doppelklick auf `index.html`.
Hinweis: Manche Browser stellen Online-Stimmen nur bei Aufruf über `https://` bereit.

## Daten aktualisieren

`data.js` wird aus den LaTeX-Dateien in `tex/` erzeugt. Nach Änderungen an einer `.tex`-Datei
oder bei einer neuen Sprache im Hauptverzeichnis ausführen:

```sh
python3 web/build_data.py
```

Benötigt wird nur Python 3. Bei einer neuen Sprache zusätzlich eintragen:

- `LANG_CODES` in `build_data.py` (Dateiname → Sprachcode)
- `LANGS` in `app.js` (Anzeigenamen und TTS-Sprachcodes)
- gegebenenfalls Länder und Präfixe in `callsign.js`

Links auf TeX/PDF zeigen standardmäßig auf das Original-Repository. Für einen Fork:
`python3 web/build_data.py --repo-url https://github.com/<user>/<repo>`.

## Sprachausgabe neu erzeugen (Piper)

Die MP3-Dateien in `audio/` werden aus `data.js` erzeugt. Nötig ist das nur, wenn sich Texte geändert haben:

```sh
python3 -m venv .venv && .venv/bin/pip install piper-tts lameenc
.venv/bin/python web/tools/build_audio.py            # alle Sprachen
.venv/bin/python web/tools/build_audio.py --only de  # einzelne Sprachen
```

Unveränderte Texte werden nicht neu erzeugt. Die Stimmenmodelle (60–115 MB je Sprache) werden beim
ersten Lauf geladen und in `~/.cache/pvq-piper` gespeichert. Welche Stimme pro Sprache genutzt wird,
steht in `VOICES` in `tools/build_audio.py`.

| Sprache | Piper-Stimme | Lizenz des Datensatzes |
| --- | --- | --- |
| Katalanisch | ca_ES-upc_ona-medium | CC BY-SA 3.0 ES |
| Tschechisch | cs_CZ-jirka-medium | CC0 |
| Deutsch | de_DE-thorsten-high | CC0 |
| Englisch | en_GB-cori-high | Public Domain |
| Spanisch | es_ES-davefx-medium | CC0 |
| Estnisch | et_EE-news-medium | CC-BY |
| Französisch | fr_FR-siwis-medium | CC-BY 4.0 |
| Ungarisch | hu_HU-anna-medium | CC0 |
| Italienisch | it_IT-serena-high | CC-BY 4.0 |
| Lettisch | lv_LV-aivars-medium | CC0 |
| Niederländisch | nl_NL-pim-medium | CC0 |
| Polnisch | pl_PL-gosia-medium | CC0 |
| Portugiesisch | pt_PT-tugão-medium | CC0 |
| Rumänisch | ro_RO-mihai-medium | CC0 |
| Schwedisch | sv_SE-nst-medium | CC0 |
| Ukrainisch | uk_UA-tetiana-high | Apache 2.0 |
| Arabisch | – (Browser-Stimme) | `ar_JO-kareem-medium` wäre möglich, Lizenz des Datensatzes ist aber ungeklärt |
| Serbisch | – (Browser-Stimme) | `sr_RS-serbski_institut` ist laut Datensatz Niedersorbisch, nicht Serbisch |

## Grenzen

- Für Arabisch, Serbisch und für Phrasen mit eigenen Angaben hängt die Sprachausgabe von den Stimmen ab,
  die auf dem jeweiligen Gerät installiert sind.
  Eine Anleitung zum Nachinstallieren steht in der Oberfläche unter „Sprachausgabe & Stimmen“.
- Die Rufzeichen-Erkennung nutzt ITU-Präfixblöcke und gängige DXCC-Präfixe, keine vollständige
  DXCC-Liste. Sonderrufzeichen können abweichen.
- Beim Einsetzen eigener Angaben werden grammatische Endungen nicht angepasst, und die IPA-Lautschrift
  bezieht sich weiterhin auf das Beispiel. Das wird in der Oberfläche markiert.
