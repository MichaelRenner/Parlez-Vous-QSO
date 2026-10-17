#!/usr/bin/env python3
"""Erzeugt web/data.js aus den LaTeX-Sprachführern in tex/.

Aufruf (im Hauptverzeichnis des Repositorys):

    python3 web/build_data.py

Nur Python-Standardbibliothek. Die Ausgabe ist eine JavaScript-Datei,
damit die Seite auch ohne Webserver direkt aus dem Dateisystem läuft.
"""

import argparse
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEX_DIR = ROOT / "tex"
PDF_DIR = ROOT / "pdf"
OUT_FILE = Path(__file__).resolve().parent / "data.js"
DEFAULT_REPO_URL = "https://github.com/MichaelRenner/Parlez-Vous-QSO"

# Dateiname-Präfix -> ISO-639-1-Code
LANG_CODES = {
    "Arabic": "ar", "Catalan": "ca", "Czech": "cs", "Dutch": "nl",
    "Estonian": "et", "French": "fr", "German": "de", "Hungarian": "hu",
    "Italian": "it", "Latvian": "lv", "Polish": "pl", "Portuguese": "pt",
    "Romanian": "ro", "Serbian": "sr", "Spanish": "es", "Swedish": "sv",
    "Ukrainian": "uk",
}

ROW_RE = re.compile(r"^(\d+\.\d+) & (.*)\\\\\s*$")
SECTION_RE = re.compile(r"^\\rowcolor\{band\} (\d+)\.0 & (.*)\\\\\*?\s*$")
CELL_SPLIT_RE = re.compile(r"(?<!\\)&")


def unwrap(text, cmd, before="", after=""):
    """Ersetzt \\cmd{...} (mit verschachtelten Klammern) durch before+Inhalt+after."""
    token = "\\" + cmd + "{"
    while True:
        start = text.find(token)
        if start < 0:
            return text
        depth, i = 1, start + len(token)
        while i < len(text) and depth:
            if text[i] == "{" and text[i - 1] != "\\":
                depth += 1
            elif text[i] == "}" and text[i - 1] != "\\":
                depth -= 1
            i += 1
        inner = text[start + len(token):i - 1]
        text = text[:start] + before + inner + after + text[i:]


def plain(cell):
    """LaTeX-Zelle -> reiner Text."""
    for cmd in ("multicolumn{2}{l}", "multicolumn{2}{r}", "textbf", "AR", "LR", "ipa", "texttt"):
        cell = unwrap(cell, cmd)
    cell = cell.replace("\\#", "#").replace("\\&", "&").replace("\\_", "_")
    cell = cell.replace("~", "\u00a0").replace("--", "–")
    return re.sub(r"[ \t]+", " ", cell).strip()


def split_cells(line):
    return [c.strip() for c in CELL_SPLIT_RE.split(line)]


def to_html(tex):
    """Freitext (Hinweise im Anhang) -> einfaches HTML."""
    tex = tex.replace("\\&", "\x00AMP\x00").replace("\\#", "#").replace("\\_", "_")
    tex = html.escape(tex, quote=False).replace("\x00AMP\x00", "&amp;")
    tex = unwrap(tex, "textbf", "<strong>", "</strong>")
    tex = unwrap(tex, "ipa", '<span class="ipa">[', "]</span>")
    tex = unwrap(tex, "texttt", "<code>", "</code>")
    tex = unwrap(tex, "LR", "", "")
    tex = unwrap(tex, "AR", '<span lang="ar" dir="rtl">', "</span>")
    tex = re.sub(r"\\url\{([^}]*)\}", r'<a href="\1" rel="noopener">\1</a>', tex)
    tex = re.sub(r"\\(medskip|smallskip|bigskip|clearpage|newpage)\b", "\n\n", tex)
    tex = re.sub(r"\\fontsize\{[^}]*\}\{[^}]*\}\\selectfont", "", tex)
    tex = re.sub(r"\\(small|normalsize|footnotesize|scriptsize|raggedright|par)\b\s*", "", tex)
    tex = tex.replace("---", "—").replace("--", "–").replace("~", "\u00a0").replace("\\,", "\u202f")
    leftover = re.findall(r"\\[a-zA-Z]+", tex)
    if leftover:
        raise SystemExit(f"Unbekannte LaTeX-Befehle in Hinweisen: {sorted(set(leftover))}")
    paragraphs = [re.sub(r"\s+", " ", p).strip() for p in re.split(r"\n\s*\n", tex)]
    return "".join(f"<p>{p}</p>" for p in paragraphs if p)


def parse_file(path, repo_url):
    stem = path.name.split("_")[0]
    code = LANG_CODES.get(stem)
    if not code:
        raise SystemExit(f"Unbekannte Sprache für {path.name}; bitte LANG_CODES ergänzen.")
    src = path.read_text(encoding="utf-8")

    header = re.search(r"\\fancyhead\[L\]\{.*?· (.*?)\}\s*$", src, re.M).group(1)
    credits = re.search(r"\\fancyfoot\[L\]\{\\scriptsize (.*?)\}\s*$", src, re.M).group(1)
    intro = re.search(r"\\vspace\{2mm\}\s*\{\\small (.*?)\}\s*\n", src, re.S)
    key = re.search(r"\{\\footnotesize (\\textbf\{Leseschl.*?)\}\s*\n\s*\n", src, re.S)
    notes = re.search(r"\\section\*\{(.*?)\}(.*?)\\end\{document\}", src, re.S)

    sections, phrases, section = [], [], None
    for line in src.splitlines():
        m = SECTION_RE.match(line)
        if m:
            cells = split_cells(m.group(2))
            section = int(m.group(1))
            sections.append({"id": section, "en": plain(cells[0]), "tr": plain(cells[1])})
            continue
        m = ROW_RE.match(line)
        if m:
            cells = split_cells(m.group(2))
            if len(cells) != 3:
                raise SystemExit(f"{path.name}: Zeile {m.group(1)} hat {len(cells)} statt 3 Spalten")
            en, tr, ipa = cells
            phrases.append({
                "ref": m.group(1),
                "sec": section,
                "en": plain(en.replace("\\newline", " / ")),
                "tr": [plain(t) for t in tr.split("\\newline") if plain(t)],
                "ipa": plain(ipa.replace("\\newline", " / ")),
            })

    pdf = PDF_DIR / path.with_suffix(".pdf").name
    return code, {
        "code": code,
        "title": plain(header),
        "credits": plain(credits),
        "intro": plain(intro.group(1)) if intro else "",
        "readingKey": to_html(key.group(1)) if key else "",
        "notesTitle": plain(notes.group(1)) if notes else "",
        "notes": to_html(notes.group(2).replace("\\end{document}", "")) if notes else "",
        "tex": f"{repo_url}/blob/main/tex/{path.name}",
        "pdf": f"{repo_url}/blob/main/pdf/{pdf.name}" if pdf.exists() else None,
        "sections": sections,
        "phrases": phrases,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--repo-url", default=DEFAULT_REPO_URL,
                        help="GitHub-URL für Links auf TeX/PDF (Standard: %(default)s)")
    args = parser.parse_args()

    languages = {}
    for path in sorted(TEX_DIR.glob("*_QSO_IPA.tex")):
        code, data = parse_file(path, args.repo_url.rstrip("/"))
        languages[code] = data
        print(f"{code}: {len(data['phrases'])} Phrasen, {len(data['sections'])} Abschnitte")

    payload = json.dumps({"repo": args.repo_url, "languages": languages},
                         ensure_ascii=False, separators=(",", ":"))
    OUT_FILE.write_text(
        "// Automatisch erzeugt von web/build_data.py – nicht von Hand bearbeiten.\n"
        f"window.PVQ_DATA = {payload};\n",
        encoding="utf-8",
    )
    print(f"-> {OUT_FILE.relative_to(ROOT)} ({OUT_FILE.stat().st_size // 1024} KiB)")


if __name__ == "__main__":
    main()
