# Parlez-Vous-QSO?!

**English** | [Deutsch](README.de.md)

![An amateur radio operator surrounded by greetings in several languages](images/parlez-vous-qso.png)

**Amateur radio brings people together. This phrasebook helps you start a conversation across language barriers.**

You do not need perfect language skills to make a QSO more personal. A greeting, a brief introduction, a few details about your station and a friendly goodbye can go a long way. **Parlez-Vous-QSO?!** provides useful phrases in several languages, with phonetic transcriptions to help you pronounce them.

## What is included?

Each phrasebook contains 142 phrases and country names in a consistent table:

- a reference number to match entries across language versions;
- the original English phrase;
- its translation into the target language;
- a pronunciation guide using the International Phonetic Alphabet (**IPA**).

Topics range from greetings and introductions to radio equipment, antennas, propagation conditions, weather, QSL cards and farewell wishes. Names, call signs, locations and numbers are examples that you can replace with your own details.

The historical Word documents are being converted into editable **LaTeX files**. The finished **PDFs** are suitable for use at the radio desk or for printing. Identified errors, language adaptations and pronunciation conventions are explained in the appendix of each version. The original reference numbers are retained, including gaps in the numbering.

## Languages

| Language | LaTeX | PDF |
| --- | --- | --- |
| Arabic | [TeX](tex/Arabic_QSO_IPA.tex) | [PDF](pdf/Arabic_QSO_IPA.pdf) |
| Catalan | [TeX](tex/Catalan_QSO_IPA.tex) | [PDF](pdf/Catalan_QSO_IPA.pdf) |
| Czech | [TeX](tex/Czech_QSO_IPA.tex) | [PDF](pdf/Czech_QSO_IPA.pdf) |
| Dutch | [TeX](tex/Dutch_QSO_IPA.tex) | [PDF](pdf/Dutch_QSO_IPA.pdf) |
| Estonian | [TeX](tex/Estonian_QSO_IPA.tex) | [PDF](pdf/Estonian_QSO_IPA.pdf) |
| French | [TeX](tex/French_QSO_IPA.tex) | [PDF](pdf/French_QSO_IPA.pdf) |
| German | [TeX](tex/German_QSO_IPA.tex) | [PDF](pdf/German_QSO_IPA.pdf) |
| Hungarian | [TeX](tex/Hungarian_QSO_IPA.tex) | [PDF](pdf/Hungarian_QSO_IPA.pdf) |
| Italian | [TeX](tex/Italian_QSO_IPA.tex) | [PDF](pdf/Italian_QSO_IPA.pdf) |
| Latvian | [TeX](tex/Latvian_QSO_IPA.tex) | [PDF](pdf/Latvian_QSO_IPA.pdf) |
| Polish | [TeX](tex/Polish_QSO_IPA.tex) | [PDF](pdf/Polish_QSO_IPA.pdf) |
| Portuguese | [TeX](tex/Portuguese_QSO_IPA.tex) | [PDF](pdf/Portuguese_QSO_IPA.pdf) |
| Romanian | [TeX](tex/Romanian_QSO_IPA.tex) | [PDF](pdf/Romanian_QSO_IPA.pdf) |
| Serbian | [TeX](tex/Serbian_QSO_IPA.tex) | [PDF](pdf/Serbian_QSO_IPA.pdf) |
| Spanish | [TeX](tex/Spanish_QSO_IPA.tex) | [PDF](pdf/Spanish_QSO_IPA.pdf) |
| Swedish | [TeX](tex/Swedish_QSO_IPA.tex) | [PDF](pdf/Swedish_QSO_IPA.pdf) |
| Ukrainian | [TeX](tex/Ukrainian_QSO_IPA.tex) | [PDF](pdf/Ukrainian_QSO_IPA.pdf) |

English is the common source language for all versions. The Portuguese and Ukrainian versions were newly drafted using the structure of the Spanish version. The Portuguese pronunciation guide describes European Portuguese; the Ukrainian version uses Cyrillic script and an IPA guide to standard Ukrainian. Arabic text is set from right to left, while call signs, numbers and web addresses remain readable in their appropriate direction.

## Files and usage

```text
doc/       Historical source documents
tex/       Editable LaTeX phrasebooks with IPA
pdf/       Finished phrasebooks for reading and printing
images/    Images for the project description
web/       Searchable web interface with speech output (see web/README.md)
```

A PDF viewer is all you need to read the phrasebooks. To make changes, edit the relevant `.tex` file and regenerate the PDF. The LaTeX files use UTF-8 and the **DejaVu Sans** font. IPA symbols are included directly as Unicode characters.

For example, to build the Portuguese version from the repository's root directory:

```bash
xelatex -interaction=nonstopmode -halt-on-error -output-directory=pdf tex/Portuguese_QSO_IPA.tex
xelatex -interaction=nonstopmode -halt-on-error -output-directory=pdf tex/Portuguese_QSO_IPA.tex
```

Two runs allow the multipage tables to settle into their correct layout. You will need XeLaTeX, DejaVu Sans and the LaTeX packages listed in the preamble. Generated intermediate files such as `.aux` and `.log` are not needed to use the phrasebooks.

## Get involved!

**Native speakers, radio amateurs and anyone interested in languages are warmly invited to contribute.** Particularly useful contributions include:

- **Language review:** Are the phrases natural, friendly and commonly used on the air?
- **Pronunciation and IPA:** Are the transcriptions, stress marks and chosen regional variety accurate?
- **Technical terminology:** Are the terms for antennas, operating modes, signal reports and QSL delivery appropriate?
- **New languages and varieties:** Additional phrasebooks or versions for other varieties, such as Brazilian Portuguese.
- **Practical feedback and design:** Experiences from the radio desk, readability improvements and more accessible editions.

Found an error or have an idea? [Open an issue](https://github.com/MichaelRenner/Parlez-Vous-QSO/issues) and, where possible, include the **language, reference number and suggested improvement**. For pronunciation corrections, please also mention the region or language variety.

To contribute a change directly, fork the repository and submit a pull request. Keep the existing reference numbers, update the IPA transcription to match the corrected phrase and document significant changes in the appendix. When editing a LaTeX file, please regenerate its PDF and check the layout as well.

The translations and IPA columns were prepared or created with AI assistance. Review by people familiar with the languages is expressly encouraged. The phonetic transcriptions are broad pronunciation guides; they do not represent every regional feature or every sound change in connected speech.

## Origins and acknowledgements

**Steve, M0ECS, had the original idea for “Parlez Vous QSO” and developed all the essential source documents - the historical files in Word `.doc` format that form the foundation of this collection.**

I, Michael Renner, have taken over the project from Steve and am continuing and developing it **with his agreement**. The conversion to LaTeX and PDF, the addition of IPA pronunciation guides and further language versions build on his work.

**A heartfelt thank you to Steve for his idea, the work he put into the original documents and his trust in allowing me to carry the project forward.**

The other authors and call signs credited in the source documents are acknowledged in the corresponding phrasebooks. Thank you also to everyone who helps improve the collection through translations, corrections and experience on the air.

**Many languages, one shared hobby. 73!**
