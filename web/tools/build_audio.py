#!/usr/bin/env python3
"""Erzeugt vorgerenderte Sprachausgabe (MP3) mit Piper für alle Phrasen.

Voraussetzungen (z. B. in einer virtuellen Umgebung):

    python3 -m venv .venv && .venv/bin/pip install piper-tts lameenc

Aufruf im Hauptverzeichnis des Repositorys, nach web/build_data.py:

    .venv/bin/python web/tools/build_audio.py

Ergebnis: web/audio/<sprache>/*.mp3 und web/audio/manifest.js.
Bereits vorhandene Dateien werden wiederverwendet; nur geänderte Texte
werden neu erzeugt, nicht mehr benötigte Dateien gelöscht.
Die Stimmenmodelle (je 60–115 MB) werden beim ersten Lauf von Hugging Face
geladen und in --models-dir zwischengespeichert.
"""

import argparse
import hashlib
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
DATA_FILE = WEB / "data.js"
AUDIO_DIR = WEB / "audio"
VOICE_BASE = "https://huggingface.co/rhasspy/piper-voices/resolve/main/"

# Sprache -> Piper-Stimme, Lizenz des Trainingsdatensatzes, Quelle.
# Serbisch fehlt bewusst: „sr_RS-serbski_institut“ ist laut Datensatz
# Niedersorbisch (dsb), nicht Serbisch. Dort bleibt die Browser-Stimme.
# Arabisch („ar_JO-kareem-medium“) ist technisch möglich, die Lizenz des
# Datensatzes (https://github.com/AliMokhammad/arabicttstrain/) ist aber
# ungeklärt; daher vorerst nicht enthalten.
VOICES = {
    "ca": ("ca_ES-upc_ona-medium", "CC BY-SA 3.0 ES", "https://collectivat.cat/asr#upc-festcat-tts-corpora"),
    "cs": ("cs_CZ-jirka-medium", "CC0", "https://github.com/OHF-Voice/voice-datasets"),
    "de": ("de_DE-thorsten-high", "CC0", "https://github.com/thorstenMueller/Thorsten-Voice"),
    "en": ("en_GB-cori-high", "Public Domain (LibriVox)", "https://librivox.org"),
    "es": ("es_ES-davefx-medium", "CC0", "https://github.com/OHF-Voice/voice-datasets"),
    "et": ("et_EE-news-medium", "CC-BY", "https://metashare.ut.ee/repository/browse/speech-corpus-of-estonian-news-sentences/37b7c5d6a0d411eebb4773db10791bcfb0c0cf788d2d4030bfaf2f2e6e55dd8d/"),
    "fr": ("fr_FR-siwis-medium", "CC-BY 4.0", "https://datashare.is.ed.ac.uk/handle/10283/2353"),
    "hu": ("hu_HU-anna-medium", "CC0", "https://github.com/OHF-Voice/voice-datasets"),
    "it": ("it_IT-serena-high", "CC-BY 4.0", "https://huggingface.co/datasets/committa/serena-synthetic-it-27h"),
    "lv": ("lv_LV-aivars-medium", "CC0", "https://huggingface.co/RaivisDejus/Piper-lv_LV-Aivars-medium"),
    "nl": ("nl_NL-pim-medium", "CC0", "https://github.com/OHF-Voice/voice-datasets"),
    "pl": ("pl_PL-gosia-medium", "CC0", "https://github.com/OHF-Voice/voice-datasets"),
    "pt": ("pt_PT-tugão-medium", "CC0", "https://github.com/OHF-Voice/voice-datasets"),
    "ro": ("ro_RO-mihai-medium", "CC0", "https://github.com/OHF-Voice/voice-datasets"),
    "sv": ("sv_SE-nst-medium", "CC0", "https://www.nb.no/sprakbanken/en/resource-catalogue/oai-nb-no-sbr-17/"),
    "uk": ("uk_UA-tetiana-high", "Apache 2.0", "https://github.com/egorsmkv/ukrainian-tts-datasets"),
}


def speech_text(text):
    """Entspricht speechText() in app.js: Platzhalter weg, Rufzeichen buchstabieren."""
    text = re.sub(r"<#+>", " … ", text)
    text = re.sub(r"\.{2,}|…", " … ", text)
    text = re.sub(r"\s/\s", ", ", text)
    text = re.sub(r"\b(?=[A-Z0-9/]*\d)(?=[A-Z0-9/]*[A-Z])[A-Z0-9]{2,}(?:/[A-Z0-9]+)*\b",
                  lambda m: " ".join(m.group(0)), text)
    return re.sub(r"\s+", " ", text).strip()


def load_data():
    src = DATA_FILE.read_text(encoding="utf-8")
    return json.loads(src[src.index("{"):src.rindex("}") + 1])


def texts_by_lang(data):
    out = {code: set() for code in VOICES}
    for code, lang in data["languages"].items():
        for p in lang["phrases"]:
            out["en"].add(p["en"])
            if code in out:
                out[code].update(p["tr"])
    return out


def ensure_model(voice_id, models_dir):
    lang = voice_id.split("-")[0]
    family = lang.split("_")[0]
    name, quality = voice_id.split("-")[1], voice_id.split("-")[2]
    onnx = models_dir / f"{voice_id}.onnx"
    for path in (onnx, Path(str(onnx) + ".json")):
        if path.exists():
            continue
        rel = f"{family}/{lang}/{name}/{quality}/{path.name}"
        print(f"  lade {path.name} …", flush=True)
        tmp = path.with_suffix(path.suffix + ".part")
        urllib.request.urlretrieve(VOICE_BASE + urllib.parse.quote(rel), tmp)
        tmp.rename(path)
    return onnx


def synthesize_mp3(voice, text, encoder_factory):
    from piper import SynthesisConfig
    pcm, rate = bytearray(), voice.config.sample_rate
    cfg = SynthesisConfig(speaker_id=0 if voice.config.num_speakers > 1 else None)
    for chunk in voice.synthesize(text, syn_config=cfg):
        pcm += chunk.audio_int16_bytes
        rate = chunk.sample_rate
    enc = encoder_factory(rate)
    return enc.encode(bytes(pcm)) + enc.flush()


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--models-dir", type=Path, default=Path.home() / ".cache" / "pvq-piper")
    parser.add_argument("--only", help="nur diese Sprachen, z. B. de,fr")
    parser.add_argument("--bitrate", type=int, default=48, help="MP3-Bitrate in kbit/s (Standard: 48)")
    args = parser.parse_args()

    try:
        import lameenc
        from piper import PiperVoice
    except ImportError:
        sys.exit("Bitte zuerst installieren: pip install piper-tts lameenc")

    def encoder_factory(rate):
        enc = lameenc.Encoder()
        enc.set_bit_rate(args.bitrate)
        enc.set_in_sample_rate(rate)
        enc.set_channels(1)
        enc.set_quality(2)
        return enc

    args.models_dir.mkdir(parents=True, exist_ok=True)
    data = load_data()
    wanted = set(args.only.split(",")) if args.only else set(VOICES)
    manifest_file = AUDIO_DIR / "manifest.js"
    manifest = {"voices": {}, "files": {}}
    if manifest_file.exists():
        src = manifest_file.read_text(encoding="utf-8")
        manifest = json.loads(src[src.index("{"):src.rindex("}") + 1])

    for code, texts in sorted(texts_by_lang(data).items()):
        if code not in wanted:
            continue
        voice_id, license_, source = VOICES[code]
        print(f"{code}: {voice_id}, {len(texts)} Texte", flush=True)
        voice = PiperVoice.load(ensure_model(voice_id, args.models_dir))
        out_dir = AUDIO_DIR / code
        out_dir.mkdir(parents=True, exist_ok=True)
        files, new = {}, 0
        for text in sorted(texts):
            spoken = speech_text(text)
            name = hashlib.sha1(f"{voice_id}\n{spoken}".encode()).hexdigest()[:16] + ".mp3"
            if not (out_dir / name).exists():
                (out_dir / name).write_bytes(synthesize_mp3(voice, spoken, encoder_factory))
                new += 1
            files[text] = name
        for old in out_dir.glob("*.mp3"):
            if old.name not in set(files.values()):
                old.unlink()
        manifest["voices"][code] = {"id": voice_id, "license": license_, "source": source}
        manifest["files"][code] = files
        size = sum(f.stat().st_size for f in out_dir.glob("*.mp3")) // 1024
        print(f"  {new} neu, {len(files)} gesamt, {size} KiB", flush=True)

    AUDIO_DIR.mkdir(exist_ok=True)
    manifest_file.write_text(
        "// Automatisch erzeugt von web/tools/build_audio.py – nicht von Hand bearbeiten.\n"
        f"window.PVQ_AUDIO = {json.dumps(manifest, ensure_ascii=False, separators=(',', ':'))};\n",
        encoding="utf-8",
    )
    print(f"-> {manifest_file.relative_to(WEB.parent)}")


if __name__ == "__main__":
    main()
