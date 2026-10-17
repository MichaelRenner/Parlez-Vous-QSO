/*
 * Rufzeichen -> Land -> Sprache
 *
 * Grundlage sind die ITU-Rufzeichenblöcke sowie die gebräuchlichen
 * Amateurfunk-Präfixe für DXCC-Gebiete (z. B. EA8, CT3, TK, GM).
 * Es gilt der längste passende Präfix. Die Tabelle ist bewusst kompakt
 * gehalten und erhebt keinen Anspruch auf Vollständigkeit für
 * Sonderrufzeichen oder Gastlizenzen.
 *
 * Länder-Eintrag: [Name deutsch, Name englisch, Sprachen, Präfixe]
 *  - Sprachen: ISO-Codes; "en" = Englisch; ein vorangestelltes "~" heißt
 *    „verwandte/verständliche Sprache“ (z. B. Tschechisch für die Slowakei).
 *  - Präfixe: durch Leerzeichen getrennt; "DA-DR" steht für DA, DB, …, DR.
 */
(function () {
  "use strict";

  const COUNTRIES = {
    // --- Sprachen des Sprachführers ---------------------------------------
    DE: ["Deutschland", "Germany", "de", "DA-DR Y2-Y9"],
    AT: ["Österreich", "Austria", "de", "OE"],
    CH: ["Schweiz", "Switzerland", "de fr it", "HB HE"],
    LI: ["Liechtenstein", "Liechtenstein", "de", "HB0 HE0"],
    LU: ["Luxemburg", "Luxembourg", "fr de", "LX"],
    BE: ["Belgien", "Belgium", "nl fr de", "ON-OT"],
    NL: ["Niederlande", "Netherlands", "nl", "PA-PI"],
    CW: ["Curaçao", "Curaçao", "nl en", "PJ2"],
    BQ: ["Bonaire", "Bonaire", "nl", "PJ4"],
    BQS: ["Saba & St. Eustatius", "Saba & St Eustatius", "nl en", "PJ5 PJ6"],
    SX: ["Sint Maarten", "Sint Maarten", "nl en", "PJ7"],
    AW: ["Aruba", "Aruba", "nl", "P4"],
    SR: ["Suriname", "Suriname", "nl", "PZ"],
    FR: ["Frankreich", "France", "fr", "F HW-HY TH TM TO-TQ TV-TX"],
    FRC: ["Korsika", "Corsica", "fr", "TK"],
    MC: ["Monaco", "Monaco", "fr", "3A"],
    GP: ["Guadeloupe", "Guadeloupe", "fr", "FG"],
    MQ: ["Martinique", "Martinique", "fr", "FM"],
    GF: ["Französisch-Guayana", "French Guiana", "fr", "FY"],
    RE: ["Réunion", "Reunion", "fr", "FR"],
    YT: ["Mayotte", "Mayotte", "fr", "FH"],
    PM: ["St. Pierre & Miquelon", "St Pierre & Miquelon", "fr", "FP"],
    NC: ["Neukaledonien", "New Caledonia", "fr", "FK"],
    PF: ["Französisch-Polynesien", "French Polynesia", "fr", "FO"],
    WF: ["Wallis & Futuna", "Wallis & Futuna", "fr", "FW"],
    BL: ["St. Barthélemy", "St Barthelemy", "fr", "FJ"],
    MF: ["St. Martin", "St Martin", "fr", "FS"],
    TF: ["Französische Süd- und Antarktisgebiete", "French Southern & Antarctic Lands", "fr", "FT"],
    QC: ["Kanada (Québec)", "Canada (Quebec)", "fr en", "VA2 VE2"],
    HT: ["Haiti", "Haiti", "fr", "HH 4V"],
    CI: ["Elfenbeinküste", "Côte d'Ivoire", "fr", "TU"],
    SN: ["Senegal", "Senegal", "fr", "6V 6W"],
    ML: ["Mali", "Mali", "fr", "TZ"],
    BJ: ["Benin", "Benin", "fr", "TY"],
    TG: ["Togo", "Togo", "fr", "5V"],
    GA: ["Gabun", "Gabon", "fr", "TR"],
    CG: ["Republik Kongo", "Republic of the Congo", "fr", "TN"],
    CD: ["DR Kongo", "DR Congo", "fr", "9O-9T"],
    TD: ["Tschad", "Chad", "fr ar", "TT"],
    CM: ["Kamerun", "Cameroon", "fr en", "TJ"],
    CF: ["Zentralafrikanische Republik", "Central African Republic", "fr", "TL"],
    BF: ["Burkina Faso", "Burkina Faso", "fr", "XT"],
    NE: ["Niger", "Niger", "fr", "5U"],
    GN: ["Guinea", "Guinea", "fr", "3X"],
    MG: ["Madagaskar", "Madagascar", "fr", "5R 5S 6X"],
    BI: ["Burundi", "Burundi", "fr", "9U"],
    RW: ["Ruanda", "Rwanda", "fr en", "9X"],
    DJ: ["Dschibuti", "Djibouti", "fr ar", "J2"],
    KM: ["Komoren", "Comoros", "fr ar", "D6"],
    ES: ["Spanien", "Spain", "es", "EA-EH AM-AO"],
    ESC: ["Spanien (Katalonien)", "Spain (Catalonia)", "ca es", "EA3 EB3 EC3 ED3 EE3 EF3 EG3 EH3 AM3 AN3 AO3"],
    ESV: ["Spanien (Region Valencia/Murcia)", "Spain (Valencia/Murcia region)", "es ca", "EA5 EB5 EC5 ED5 EE5 EF5 EG5 EH5 AM5 AN5 AO5"],
    IB: ["Balearen", "Balearic Islands", "ca es", "EA6 EB6 EC6 ED6 EE6 EF6 EG6 EH6 AM6 AN6 AO6"],
    IC: ["Kanarische Inseln", "Canary Islands", "es", "EA8 EB8 EC8 ED8 EE8 EF8 EG8 EH8 AM8 AN8 AO8"],
    EAC: ["Ceuta & Melilla", "Ceuta & Melilla", "es", "EA9 EB9 EC9 ED9 EE9 EF9 EG9 EH9 AM9 AN9 AO9"],
    AD: ["Andorra", "Andorra", "ca", "C3"],
    AR: ["Argentinien", "Argentina", "es", "AY AZ LO-LW L2-L9"],
    CL: ["Chile", "Chile", "es", "CA-CE XQ XR 3G"],
    UY: ["Uruguay", "Uruguay", "es", "CV-CX"],
    PY: ["Paraguay", "Paraguay", "es", "ZP"],
    BO: ["Bolivien", "Bolivia", "es", "CP"],
    PE: ["Peru", "Peru", "es", "OA-OC 4T"],
    EC: ["Ecuador", "Ecuador", "es", "HC HD"],
    CO: ["Kolumbien", "Colombia", "es", "HJ HK 5J 5K"],
    VE: ["Venezuela", "Venezuela", "es", "YV-YY 4M"],
    MX: ["Mexiko", "Mexico", "es", "XA-XI 4A-4C 6D-6J"],
    CR: ["Costa Rica", "Costa Rica", "es", "TE TI"],
    NI: ["Nicaragua", "Nicaragua", "es", "YN H6 H7 HT"],
    HN: ["Honduras", "Honduras", "es", "HQ HR"],
    SV: ["El Salvador", "El Salvador", "es", "YS HU"],
    GT: ["Guatemala", "Guatemala", "es", "TD TG"],
    PA: ["Panama", "Panama", "es", "HO HP H3 H8 H9 3E 3F"],
    DO: ["Dominikanische Republik", "Dominican Republic", "es", "HI"],
    CU: ["Kuba", "Cuba", "es", "CL CM CO T4"],
    PR: ["Puerto Rico", "Puerto Rico", "es en", "KP3 KP4 NP3 NP4 WP3 WP4"],
    GQ: ["Äquatorialguinea", "Equatorial Guinea", "es", "3C"],
    PT: ["Portugal", "Portugal", "pt", "CQ-CT"],
    PTM: ["Madeira", "Madeira", "pt", "CT3 CQ3 CR3 CS3"],
    PTA: ["Azoren", "Azores", "pt", "CU CQ8 CR8 CS8 CT8"],
    BR: ["Brasilien", "Brazil", "pt", "PP-PY ZV-ZZ"],
    AO: ["Angola", "Angola", "pt", "D2 D3"],
    MZ: ["Mosambik", "Mozambique", "pt", "C8 C9"],
    CV: ["Kap Verde", "Cape Verde", "pt", "D4"],
    GW: ["Guinea-Bissau", "Guinea-Bissau", "pt", "J5"],
    ST: ["São Tomé und Príncipe", "Sao Tome & Principe", "pt", "S9"],
    TL: ["Osttimor", "Timor-Leste", "pt", "4W"],
    MO: ["Macau", "Macao", "pt", "XX9"],
    IT: ["Italien", "Italy", "it", "I"],
    ITS: ["Sardinien", "Sardinia", "it", "IS0 IM0"],
    SM: ["San Marino", "San Marino", "it", "T7"],
    VA: ["Vatikanstadt", "Vatican City", "it", "HV"],
    PL: ["Polen", "Poland", "pl", "SN-SR HF 3Z"],
    CZ: ["Tschechien", "Czech Republic", "cs", "OK OL"],
    SK: ["Slowakei", "Slovakia", "~cs", "OM"],
    HU: ["Ungarn", "Hungary", "hu", "HA HG"],
    RO: ["Rumänien", "Romania", "ro", "YO-YR"],
    MD: ["Moldau", "Moldova", "ro", "ER"],
    RS: ["Serbien", "Serbia", "sr", "YT YU YZ"],
    ME: ["Montenegro", "Montenegro", "sr", "4O"],
    BA: ["Bosnien und Herzegowina", "Bosnia & Herzegovina", "sr", "E7 T9"],
    HR: ["Kroatien", "Croatia", "~sr", "9A"],
    XK: ["Kosovo", "Kosovo", "sr", "Z6"],
    MK: ["Nordmazedonien", "North Macedonia", "~sr", "Z3"],
    SE: ["Schweden", "Sweden", "sv", "SA-SM 7S 8S"],
    AX: ["Åland", "Aland Islands", "sv", "OH0 OF0 OG0 OI0"],
    FI: ["Finnland", "Finland", "sv", "OF-OI OJ"],
    EE: ["Estland", "Estonia", "et", "ES"],
    LV: ["Lettland", "Latvia", "lv", "YL"],
    UA: ["Ukraine", "Ukraine", "uk", "EM-EO UR-UZ"],
    SA: ["Saudi-Arabien", "Saudi Arabia", "ar", "HZ 7Z 8Z"],
    EG: ["Ägypten", "Egypt", "ar", "SU SSA-SSM 6A 6B"],
    AE: ["Vereinigte Arabische Emirate", "United Arab Emirates", "ar", "A6"],
    QA: ["Katar", "Qatar", "ar", "A7"],
    BH: ["Bahrain", "Bahrain", "ar", "A9"],
    KW: ["Kuwait", "Kuwait", "ar", "9K"],
    OM: ["Oman", "Oman", "ar", "A4"],
    YE: ["Jemen", "Yemen", "ar", "7O"],
    JO: ["Jordanien", "Jordan", "ar", "JY"],
    LB: ["Libanon", "Lebanon", "ar", "OD"],
    SY: ["Syrien", "Syria", "ar", "YK 6C"],
    IQ: ["Irak", "Iraq", "ar", "YI HN"],
    LY: ["Libyen", "Libya", "ar", "5A"],
    TN: ["Tunesien", "Tunisia", "ar fr", "3V TS"],
    DZ: ["Algerien", "Algeria", "ar fr", "7R 7T-7Y"],
    MA: ["Marokko", "Morocco", "ar fr", "CN 5C-5G"],
    MR: ["Mauretanien", "Mauritania", "ar fr", "5T"],
    SD: ["Sudan", "Sudan", "ar en", "SSN-SSZ ST 6T 6U"],
    PS: ["Palästina", "Palestine", "ar", "E4"],

    // --- Englischsprachige Länder (Ausgangssprache aller Sprachführer) -----
    US: ["USA", "United States", "en", "K N W AA-AL"],
    CA: ["Kanada", "Canada", "en fr", "CF-CK CY CZ VA-VG VO VX VY XJ-XO"],
    ENG: ["England", "England", "en", "G M 2E"],
    SCT: ["Schottland", "Scotland", "en", "GM MM GS MS 2M"],
    WLS: ["Wales", "Wales", "en", "GW MW GC MC 2W"],
    NIR: ["Nordirland", "Northern Ireland", "en", "GI MI GN MN 2I"],
    IM: ["Isle of Man", "Isle of Man", "en", "GD MD GT MT 2D"],
    JE: ["Jersey", "Jersey", "en", "GJ MJ GH MH 2J"],
    GG: ["Guernsey", "Guernsey", "en", "GU MU GP MP 2U"],
    GBX: ["Vereinigtes Königreich", "United Kingdom", "en", "2 VP-VQ VS ZB-ZJ ZN ZO ZQ"],
    GI: ["Gibraltar", "Gibraltar", "en es", "ZB2 ZG2"],
    IE: ["Irland", "Ireland", "en", "EI EJ"],
    AU: ["Australien", "Australia", "en", "AX VH-VN VZ"],
    NZ: ["Neuseeland", "New Zealand", "en", "ZK-ZM"],
    ZA: ["Südafrika", "South Africa", "en", "ZR-ZU S8"],
    MT: ["Malta", "Malta", "en", "9H"],
    IN: ["Indien", "India", "en", "AT-AW VT-VW 8T-8Y"],
    JM: ["Jamaika", "Jamaica", "en", "6Y"],
    TT: ["Trinidad und Tobago", "Trinidad & Tobago", "en", "9Y 9Z"],
    BB: ["Barbados", "Barbados", "en", "8P"],
    BS: ["Bahamas", "Bahamas", "en", "C6"],
    GH: ["Ghana", "Ghana", "en", "9G"],
    NG: ["Nigeria", "Nigeria", "en", "5N 5O"],
    KE: ["Kenia", "Kenya", "en", "5Y 5Z"],
    UG: ["Uganda", "Uganda", "en", "5X"],
    TZ: ["Tansania", "Tanzania", "en", "5H 5I"],
    ZW: ["Simbabwe", "Zimbabwe", "en", "Z2"],
    ZM: ["Sambia", "Zambia", "en", "9I 9J"],
    NA: ["Namibia", "Namibia", "en", "V5"],
    BW: ["Botswana", "Botswana", "en", "A2 8O"],
    SG: ["Singapur", "Singapore", "en", "9V S6"],
    PH: ["Philippinen", "Philippines", "en", "DU-DZ 4D-4I"],
    HK: ["Hongkong", "Hong Kong", "en", "VR"],
    GY: ["Guyana", "Guyana", "en", "8R"],
    BZ: ["Belize", "Belize", "en es", "V3"],
    LR: ["Liberia", "Liberia", "en", "A8 D5 EL 5L 5M 6Z"],
    SL: ["Sierra Leone", "Sierra Leone", "en", "9L"],
    HAW: ["Hawaii", "Hawaii", "en", "KH6 NH6 WH6 AH6 KH7 NH7 WH7 AH7"],
    AK: ["Alaska", "Alaska", "en", "KL NL WL AL"],
    VI: ["Amerikanische Jungferninseln", "US Virgin Islands", "en", "KP2 NP2 WP2"],
    GU: ["Guam", "Guam", "en", "KH2 NH2 WH2 AH2"],

    // --- Weitere Länder ohne eigenen Sprachführer -------------------------
    RU: ["Russland", "Russia", "", "R UA-UI"],
    BY: ["Belarus", "Belarus", "", "EU-EW"],
    LT: ["Litauen", "Lithuania", "", "LY"],
    NO: ["Norwegen", "Norway", "", "LA-LN 3Y"],
    SJ: ["Svalbard", "Svalbard", "", "JW"],
    JMY: ["Jan Mayen", "Jan Mayen", "", "JX"],
    DK: ["Dänemark", "Denmark", "", "OU-OZ 5P 5Q"],
    FO: ["Färöer", "Faroe Islands", "", "OY"],
    GL: ["Grönland", "Greenland", "", "OX XP"],
    IS: ["Island", "Iceland", "", "TF"],
    SI: ["Slowenien", "Slovenia", "", "S5"],
    BG: ["Bulgarien", "Bulgaria", "", "LZ"],
    GR: ["Griechenland", "Greece", "", "SV-SZ J4"],
    CY: ["Zypern", "Cyprus", "en", "5B C4 H2 P3"],
    TR: ["Türkei", "Turkey", "", "TA-TC YM"],
    AL: ["Albanien", "Albania", "", "ZA"],
    IL: ["Israel", "Israel", "", "4X 4Z"],
    AM: ["Armenien", "Armenia", "", "EK"],
    GE: ["Georgien", "Georgia", "", "4L"],
    AZ: ["Aserbaidschan", "Azerbaijan", "", "4J 4K"],
    KZ: ["Kasachstan", "Kazakhstan", "", "UN-UQ"],
    UZ: ["Usbekistan", "Uzbekistan", "", "UJ-UM"],
    KG: ["Kirgisistan", "Kyrgyzstan", "", "EX"],
    TJ: ["Tadschikistan", "Tajikistan", "", "EY"],
    TM: ["Turkmenistan", "Turkmenistan", "", "EZ"],
    IR: ["Iran", "Iran", "", "EP EQ 9B-9D"],
    AF: ["Afghanistan", "Afghanistan", "", "YA T6"],
    PK: ["Pakistan", "Pakistan", "en", "AP-AS 6P-6S"],
    BD: ["Bangladesch", "Bangladesh", "", "S2 S3"],
    LK: ["Sri Lanka", "Sri Lanka", "en", "4P-4S"],
    NP: ["Nepal", "Nepal", "", "9N"],
    CN: ["China", "China", "", "B XS 3H-3U"],
    TW: ["Taiwan", "Taiwan", "", "BU-BX"],
    JP: ["Japan", "Japan", "", "JA-JS 7J-7N 8J-8N"],
    KR: ["Südkorea", "South Korea", "", "DS DT HL 6K-6N D7-D9"],
    KP: ["Nordkorea", "North Korea", "", "HM P5-P9"],
    MN: ["Mongolei", "Mongolia", "", "JT-JV"],
    TH: ["Thailand", "Thailand", "", "HS E2"],
    VN: ["Vietnam", "Vietnam", "", "XV 3W"],
    KH: ["Kambodscha", "Cambodia", "", "XU"],
    LA: ["Laos", "Laos", "", "XW"],
    MM: ["Myanmar", "Myanmar", "", "XY XZ"],
    MY: ["Malaysia", "Malaysia", "en", "9M 9W"],
    ID: ["Indonesien", "Indonesia", "", "JZ PK-PO YB-YH 7A-7I 8A-8I"],
    ET: ["Äthiopien", "Ethiopia", "", "ET 9E 9F"],
    ER: ["Eritrea", "Eritrea", "ar", "E3"],
    SO: ["Somalia", "Somalia", "ar", "T5 6O"],
    UN: ["Vereinte Nationen (Genf/New York)", "United Nations", "fr en", "4U"],
  };

  function expand(spec) {
    const m = /^(.*)(.)-\1(.)$/.exec(spec);
    if (!m) return [spec];
    const out = [];
    for (let c = m[2].charCodeAt(0); c <= m[3].charCodeAt(0); c++) {
      const ch = String.fromCharCode(c);
      if (/[A-Z0-9]/.test(ch)) out.push(m[1] + ch);
    }
    return out;
  }

  const TABLE = new Map();
  for (const [code, [, , , prefixes]] of Object.entries(COUNTRIES)) {
    for (const spec of prefixes.split(/\s+/)) {
      for (const p of expand(spec)) TABLE.set(p, code);
    }
  }
  const MAX_LEN = Math.max(...[...TABLE.keys()].map((k) => k.length));

  // Zusätze, die keinen Standort angeben (portabel, mobil, QRP …)
  const IGNORED_SUFFIXES = new Set(["P", "M", "MM", "AM", "QRP", "A", "LH", "R", "B", "J", "T"]);

  function locationPart(call) {
    const parts = call.split("/").filter((p) => p && !IGNORED_SUFFIXES.has(p) && !/^\d$/.test(p));
    if (parts.length <= 1) return parts[0] || "";
    // Bei DL/F5ABC oder F5ABC/EA8 bestimmt der kürzere Teil das Land.
    return parts.reduce((a, b) => (b.length < a.length ? b : a));
  }

  /**
   * Liefert {call, prefix, code, de, en, langs: [{code, related}]}
   * oder null, wenn kein Präfix passt.
   */
  function lookup(input) {
    const call = String(input || "").toUpperCase().replace(/[^A-Z0-9/]/g, "");
    const part = locationPart(call);
    for (let len = Math.min(MAX_LEN, part.length); len > 0; len--) {
      const prefix = part.slice(0, len);
      const code = TABLE.get(prefix);
      if (!code) continue;
      const [de, en, langs] = COUNTRIES[code];
      return {
        call, prefix, code, de, en,
        langs: langs.split(/\s+/).filter(Boolean).map((l) => ({
          code: l.replace("~", ""), related: l.startsWith("~"),
        })),
      };
    }
    return null;
  }

  window.PVQ_CALLSIGN = { lookup };
})();
