# Parlez-Vous-QSO?!

![Eine Person am Amateurfunkgerät, umgeben von Begrüßungen in verschiedenen Sprachen](images/parlez-vous-qso.png)

**Amateurfunk verbindet Menschen. Dieser Sprachführer hilft dabei, auch über Sprachgrenzen hinweg ins Gespräch zu kommen.**

Für ein persönliches QSO braucht es nicht immer perfekte Sprachkenntnisse. Eine Begrüßung, eine kurze Vorstellung, Angaben zur Station und ein freundlicher Abschied machen oft schon den Unterschied. **Parlez-Vous-QSO?!** bietet dafür gebräuchliche Wendungen in verschiedenen Sprachen - ergänzt um Lautschrift, damit die Aussprache leichter fällt.

## Was enthält das Projekt?

Die Sprachführer enthalten jeweils 142 Phrasen und Ländernamen in einer einheitlichen Tabelle:

- eine Referenznummer zur Orientierung zwischen den Sprachversionen;
- die englische Ausgangsphrase;
- die Übersetzung in die jeweilige Sprache;
- eine Aussprachehilfe im Internationalen Phonetischen Alphabet (**IPA**).

Die Themen reichen von Begrüßung und Vorstellung über Funkgerät, Antennen, Ausbreitungsbedingungen und Wetter bis zu QSL-Karten und Abschiedswünschen. Namen, Rufzeichen, Ortsangaben und Zahlen sind Beispiele und können durch die eigenen Angaben ersetzt werden.

Die historischen Word-Vorlagen werden in bearbeitbare **LaTeX-Dateien** übertragen. Die fertigen **PDFs** eignen sich zum Nachschlagen am Funkplatz oder zum Ausdrucken. Erkannte Fehler, sprachliche Anpassungen und Aussprachekonventionen werden im Anhang der jeweiligen Fassung erläutert. Die ursprünglichen Referenznummern bleiben erhalten, einschließlich der Nummernsprünge.

## Sprachen

| Sprache | LaTeX | PDF |
| --- | --- | --- |
| Arabisch | [TeX](tex/Arabic_QSO_IPA.tex) | [PDF](pdf/Arabic_QSO_IPA.pdf) |
| Deutsch | [TeX](tex/German_QSO_IPA.tex) | [PDF](pdf/German_QSO_IPA.pdf) |
| Estnisch | [TeX](tex/Estonian_QSO_IPA.tex) | [PDF](pdf/Estonian_QSO_IPA.pdf) |
| Französisch | [TeX](tex/French_QSO_IPA.tex) | [PDF](pdf/French_QSO_IPA.pdf) |
| Italienisch | [TeX](tex/Italian_QSO_IPA.tex) | [PDF](pdf/Italian_QSO_IPA.pdf) |
| Katalanisch | [TeX](tex/Catalan_QSO_IPA.tex) | [PDF](pdf/Catalan_QSO_IPA.pdf) |
| Lettisch | [TeX](tex/Latvian_QSO_IPA.tex) | [PDF](pdf/Latvian_QSO_IPA.pdf) |
| Niederländisch | [TeX](tex/Dutch_QSO_IPA.tex) | [PDF](pdf/Dutch_QSO_IPA.pdf) |
| Polnisch | [TeX](tex/Polish_QSO_IPA.tex) | [PDF](pdf/Polish_QSO_IPA.pdf) |
| Portugiesisch | [TeX](tex/Portuguese_QSO_IPA.tex) | [PDF](pdf/Portuguese_QSO_IPA.pdf) |
| Rumänisch | [TeX](tex/Romanian_QSO_IPA.tex) | [PDF](pdf/Romanian_QSO_IPA.pdf) |
| Schwedisch | [TeX](tex/Swedish_QSO_IPA.tex) | [PDF](pdf/Swedish_QSO_IPA.pdf) |
| Serbisch | [TeX](tex/Serbian_QSO_IPA.tex) | [PDF](pdf/Serbian_QSO_IPA.pdf) |
| Spanisch | [TeX](tex/Spanish_QSO_IPA.tex) | [PDF](pdf/Spanish_QSO_IPA.pdf) |
| Tschechisch | [TeX](tex/Czech_QSO_IPA.tex) | [PDF](pdf/Czech_QSO_IPA.pdf) |
| Ungarisch | [TeX](tex/Hungarian_QSO_IPA.tex) | [PDF](pdf/Hungarian_QSO_IPA.pdf) |

Englisch dient allen Fassungen als gemeinsame Ausgangssprache. Die portugiesische Fassung wurde auf Grundlage der Gliederung der spanischen Version neu entworfen. Ihre Aussprachehilfe bezieht sich auf europäisches Portugiesisch. Arabischer Text wird von rechts nach links gesetzt; Rufzeichen, Zahlen und Webadressen bleiben entsprechend ihrer Schreibweise lesbar.

## Dateien und Nutzung

```text
doc/       Historische Ausgangsdokumente
tex/       Bearbeitbare LaTeX-Sprachführer mit IPA
pdf/       Fertige Sprachführer zum Lesen und Drucken
images/    Bilder für die Projektbeschreibung
```

Zum Lesen genügt ein PDF-Betrachter. Wer eine Fassung ändern möchte, bearbeitet die entsprechende `.tex`-Datei und erstellt anschließend das PDF neu. Die LaTeX-Dateien verwenden UTF-8 und die Schrift **DejaVu Sans**. Die IPA-Zeichen sind direkt als Unicode enthalten.

Beispiel für die portugiesische Version, im Hauptverzeichnis des Repositorys:

```bash
xelatex -interaction=nonstopmode -halt-on-error -output-directory=pdf tex/Portuguese_QSO_IPA.tex
xelatex -interaction=nonstopmode -halt-on-error -output-directory=pdf tex/Portuguese_QSO_IPA.tex
```

Die zwei Durchläufe sorgen dafür, dass die mehrseitigen Tabellen korrekt gesetzt werden. Benötigt werden XeLaTeX, DejaVu Sans und die in der Präambel genannten LaTeX-Pakete. Erzeugte Zwischendateien wie `.aux` und `.log` sind für die Nutzung der Sprachführer nicht erforderlich.

## Mach mit!

**Muttersprachlerinnen und Muttersprachler, Funkamateure und Menschen mit Interesse an Sprachen sind herzlich zur Mitarbeit eingeladen.** Besonders hilfreich sind:

- **Sprachliche Prüfung:** Sind die Wendungen natürlich, freundlich und beim Funkbetrieb gebräuchlich?
- **Aussprache und IPA:** Stimmen die Lautschrift, Betonung und gewählte regionale Variante?
- **Fachbegriffe:** Passen die Bezeichnungen für Antennen, Betriebsarten, Signalrapporte und QSL-Versand?
- **Neue Sprachen und Varianten:** Weitere Sprachführer oder ergänzende Fassungen, etwa für brasilianisches Portugiesisch.
- **Praxis und Gestaltung:** Rückmeldungen vom Funkplatz, Verbesserungen der Lesbarkeit und barriereärmere Ausgaben.

Du hast einen Fehler gefunden oder eine Idee? [Eröffne ein Issue](https://github.com/MichaelRenner/Parlez-Vous-QSO/issues) und nenne möglichst die **Sprache, die Referenznummer und deinen Verbesserungsvorschlag**. Für Aussprachekorrekturen hilft auch eine Angabe zur Region oder Sprachvariante.

Wenn du die Änderung direkt einarbeiten möchtest, erstelle einen Fork und reiche einen Pull Request ein. Behalte bestehende Referenznummern bei, passe die IPA-Spalte an die korrigierte Phrase an und dokumentiere wesentliche Änderungen im Anhang. Bei Änderungen an der LaTeX-Datei bitte auch das PDF neu erzeugen und das Layout prüfen.

Die Übersetzungen und die IPA-Spalten wurden mit KI-Unterstützung aufbereitet beziehungsweise erstellt. Eine Prüfung durch sprachkundige Menschen ist ausdrücklich erwünscht. Die Lautschrift ist eine breite Aussprachehilfe; sie bildet nicht jede regionale Besonderheit oder jede Lautverbindung im flüssigen Gespräch ab.

## Herkunft und Dank

Das Projekt baut auf den historischen Sprachlisten **„Parlez Vous QSO?!“** auf. Die in den Vorlagen genannten Autorinnen, Autoren und Rufzeichen werden in den jeweiligen Sprachführern gewürdigt. Danke an alle, die diese Sammlung begonnen haben und durch Übersetzungen, Korrekturen oder Erfahrungen aus dem Funkbetrieb weiterentwickeln.

**Viele Sprachen, ein gemeinsames Hobby. 73!**
