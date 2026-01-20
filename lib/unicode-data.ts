export interface UnicodeCategory {
  id: string
  name: string
  range: [number, number]
}

export const UNICODE_CATEGORIES: UnicodeCategory[] = [
  { id: "basic-latin", name: "Basic Latin", range: [0x0020, 0x007f] },
  { id: "latin-1", name: "Latin-1 Supplement", range: [0x0080, 0x00ff] },
  { id: "latin-extended-a", name: "Latin Extended-A", range: [0x0100, 0x017f] },
  { id: "latin-extended-b", name: "Latin Extended-B", range: [0x0180, 0x024f] },
  { id: "greek", name: "Greek and Coptic", range: [0x0370, 0x03ff] },
  { id: "cyrillic", name: "Cyrillic", range: [0x0400, 0x04ff] },
  { id: "armenian", name: "Armenian", range: [0x0530, 0x058f] },
  { id: "hebrew", name: "Hebrew", range: [0x0590, 0x05ff] },
  { id: "arabic", name: "Arabic", range: [0x0600, 0x06ff] },
  { id: "thai", name: "Thai", range: [0x0e00, 0x0e7f] },
  { id: "cjk-symbols", name: "CJK Symbols", range: [0x3000, 0x303f] },
  { id: "hiragana", name: "Hiragana", range: [0x3040, 0x309f] },
  { id: "katakana", name: "Katakana", range: [0x30a0, 0x30ff] },
  { id: "punctuation", name: "General Punctuation", range: [0x2000, 0x206f] },
  { id: "currency", name: "Currency Symbols", range: [0x20a0, 0x20cf] },
  { id: "letterlike", name: "Letterlike Symbols", range: [0x2100, 0x214f] },
  { id: "number-forms", name: "Number Forms", range: [0x2150, 0x218f] },
  { id: "arrows", name: "Arrows", range: [0x2190, 0x21ff] },
  { id: "math-operators", name: "Mathematical Operators", range: [0x2200, 0x22ff] },
  { id: "misc-technical", name: "Miscellaneous Technical", range: [0x2300, 0x23ff] },
  { id: "box-drawing", name: "Box Drawing", range: [0x2500, 0x257f] },
  { id: "block-elements", name: "Block Elements", range: [0x2580, 0x259f] },
  { id: "geometric-shapes", name: "Geometric Shapes", range: [0x25a0, 0x25ff] },
  { id: "misc-symbols", name: "Miscellaneous Symbols", range: [0x2600, 0x26ff] },
  { id: "dingbats", name: "Dingbats", range: [0x2700, 0x27bf] },
  { id: "braille", name: "Braille Patterns", range: [0x2800, 0x28ff] },
  { id: "supplemental-arrows", name: "Supplemental Arrows-B", range: [0x2900, 0x297f] },
  { id: "misc-math-a", name: "Misc Mathematical Symbols-A", range: [0x27c0, 0x27ef] },
  { id: "misc-math-b", name: "Misc Mathematical Symbols-B", range: [0x2980, 0x29ff] },
  { id: "emoticons", name: "Emoticons", range: [0x1f600, 0x1f64f] },
  { id: "misc-symbols-pictographs", name: "Misc Symbols and Pictographs", range: [0x1f300, 0x1f5ff] },
  { id: "transport-map", name: "Transport and Map", range: [0x1f680, 0x1f6ff] },
  { id: "supplemental-symbols", name: "Supplemental Symbols", range: [0x1f900, 0x1f9ff] },
]

export interface UnicodeCharacter {
  char: string
  codePoint: number
  name: string
  commonName?: string
  category: string
  htmlEntity: string
  cssCode: string
}

// Common names for frequently used Unicode characters
const COMMON_NAMES: Record<number, string> = {
  // Control characters
  0x0009: "TAB",
  0x000A: "LINE FEED",
  0x000D: "CARRIAGE RETURN",
  0x0020: "SPACE",
  0x00A0: "NO-BREAK SPACE",
  0x00AD: "SOFT HYPHEN",
  
  // Common punctuation
  0x0021: "EXCLAMATION MARK",
  0x0022: "QUOTATION MARK",
  0x0023: "NUMBER SIGN",
  0x0024: "DOLLAR SIGN",
  0x0025: "PERCENT SIGN",
  0x0026: "AMPERSAND",
  0x0027: "APOSTROPHE",
  0x0028: "LEFT PARENTHESIS",
  0x0029: "RIGHT PARENTHESIS",
  0x002A: "ASTERISK",
  0x002B: "PLUS SIGN",
  0x002C: "COMMA",
  0x002D: "HYPHEN-MINUS",
  0x002E: "FULL STOP",
  0x002F: "SOLIDUS",
  0x003A: "COLON",
  0x003B: "SEMICOLON",
  0x003C: "LESS-THAN SIGN",
  0x003D: "EQUALS SIGN",
  0x003E: "GREATER-THAN SIGN",
  0x003F: "QUESTION MARK",
  0x0040: "COMMERCIAL AT",
  0x005B: "LEFT SQUARE BRACKET",
  0x005C: "REVERSE SOLIDUS",
  0x005D: "RIGHT SQUARE BRACKET",
  0x005E: "CIRCUMFLEX ACCENT",
  0x005F: "LOW LINE",
  0x0060: "GRAVE ACCENT",
  0x007B: "LEFT CURLY BRACKET",
  0x007C: "VERTICAL LINE",
  0x007D: "RIGHT CURLY BRACKET",
  0x007E: "TILDE",
  
  // Currency symbols
  0x00A2: "CENT SIGN",
  0x00A3: "POUND SIGN",
  0x00A4: "CURRENCY SIGN",
  0x00A5: "YEN SIGN",
  0x20AC: "EURO SIGN",
  0x00A9: "COPYRIGHT SIGN",
  0x00AE: "REGISTERED SIGN",
  0x2122: "TRADE MARK SIGN",
  
  // Common symbols
  0x00B0: "DEGREE SIGN",
  0x00B1: "PLUS-MINUS SIGN",
  0x00B2: "SUPERSCRIPT TWO",
  0x00B3: "SUPERSCRIPT THREE",
  0x00B5: "MICRO SIGN",
  0x00B6: "PILCROW SIGN",
  0x00B7: "MIDDLE DOT",
  0x00B9: "SUPERSCRIPT ONE",
  0x00BC: "VULGAR FRACTION ONE QUARTER",
  0x00BD: "VULGAR FRACTION ONE HALF",
  0x00BE: "VULGAR FRACTION THREE QUARTERS",
  
  // Arrows
  0x2190: "LEFTWARDS ARROW",
  0x2191: "UPWARDS ARROW",
  0x2192: "RIGHTWARDS ARROW",
  0x2193: "DOWNWARDS ARROW",
  0x2194: "LEFT RIGHT ARROW",
  0x2195: "UP DOWN ARROW",
  0x21A9: "LEFTWARDS ARROW WITH HOOK",
  0x21AA: "RIGHTWARDS ARROW WITH HOOK",
  
  // Mathematical operators
  0x2200: "FOR ALL",
  0x2202: "PARTIAL DIFFERENTIAL",
  0x2203: "THERE EXISTS",
  0x2205: "EMPTY SET",
  0x2206: "INCREMENT",
  0x2207: "NABLA",
  0x2208: "ELEMENT OF",
  0x2209: "NOT AN ELEMENT OF",
  0x220B: "CONTAINS AS MEMBER",
  0x220F: "N-ARY PRODUCT",
  0x2211: "N-ARY SUMMATION",
  0x2212: "MINUS SIGN",
  0x2215: "DIVISION SLASH",
  0x2216: "SET MINUS",
  0x2217: "ASTERISK OPERATOR",
  0x2218: "RING OPERATOR",
  0x2219: "BULLET OPERATOR",
  0x221A: "SQUARE ROOT",
  0x221D: "PROPORTIONAL TO",
  0x221E: "INFINITY",
  0x221F: "RIGHT ANGLE",
  0x2220: "ANGLE",
  0x2227: "LOGICAL AND",
  0x2228: "LOGICAL OR",
  0x2229: "INTERSECTION",
  0x222A: "UNION",
  0x222B: "INTEGRAL",
  0x2234: "THEREFORE",
  0x2235: "BECAUSE",
  0x223C: "TILDE OPERATOR",
  0x223D: "REVERSED TILDE",
  0x2245: "APPROXIMATELY EQUAL TO",
  0x2248: "ALMOST EQUAL TO",
  0x2260: "NOT EQUAL TO",
  0x2261: "IDENTICAL TO",
  0x2264: "LESS-THAN OR EQUAL TO",
  0x2265: "GREATER-THAN OR EQUAL TO",
  0x2282: "SUBSET OF",
  0x2283: "SUPERSET OF",
  0x2284: "NOT A SUBSET OF",
  0x2286: "SUBSET OF OR EQUAL TO",
  0x2287: "SUPERSET OF OR EQUAL TO",
  0x2295: "CIRCLED PLUS",
  0x2297: "CIRCLED TIMES",
  0x2299: "CIRCLED DOT OPERATOR",
  0x22A5: "UP TACK",
  0x22C5: "DOT OPERATOR",
  
  // General punctuation
  0x2013: "EN DASH",
  0x2014: "EM DASH",
  0x2018: "LEFT SINGLE QUOTATION MARK",
  0x2019: "RIGHT SINGLE QUOTATION MARK",
  0x201C: "LEFT DOUBLE QUOTATION MARK",
  0x201D: "RIGHT DOUBLE QUOTATION MARK",
  0x2020: "DAGGER",
  0x2021: "DOUBLE DAGGER",
  0x2022: "BULLET",
  0x2026: "HORIZONTAL ELLIPSIS",
  0x2030: "PER MILLE SIGN",
  0x2032: "PRIME",
  0x2033: "DOUBLE PRIME",
  0x2039: "SINGLE LEFT-POINTING ANGLE QUOTATION MARK",
  0x203A: "SINGLE RIGHT-POINTING ANGLE QUOTATION MARK",
  0x2044: "FRACTION SLASH",
  
  // Letterlike symbols
  0x2102: "DOUBLE-STRUCK CAPITAL C",
  0x2105: "CARE OF",
  0x2109: "DEGREE FAHRENHEIT",
  0x2116: "NUMERO SIGN",
  0x2117: "SOUND RECORDING COPYRIGHT",
  0x2118: "SCRIPT CAPITAL P",
  0x211E: "PRESCRIPTION TAKE",
  0x2120: "SERVICE MARK",
  0x2121: "TELEPHONE SIGN",
  0x2126: "OHM SIGN",
  0x212E: "ESTIMATED SYMBOL",
  0x2135: "ALEF SYMBOL",
  0x2139: "INFORMATION SOURCE",
  0x2140: "DOUBLE-STRUCK N-ARY SUMMATION",
  
  // Geometric shapes
  0x25A0: "BLACK SQUARE",
  0x25A1: "WHITE SQUARE",
  0x25B2: "BLACK UP-POINTING TRIANGLE",
  0x25B3: "WHITE UP-POINTING TRIANGLE",
  0x25B6: "BLACK RIGHT-POINTING TRIANGLE",
  0x25B7: "WHITE RIGHT-POINTING TRIANGLE",
  0x25BC: "BLACK DOWN-POINTING TRIANGLE",
  0x25BD: "WHITE DOWN-POINTING TRIANGLE",
  0x25C0: "BLACK LEFT-POINTING TRIANGLE",
  0x25C1: "WHITE LEFT-POINTING TRIANGLE",
  0x25CA: "LOZENGE",
  0x25CF: "BLACK CIRCLE",
  0x25CB: "WHITE CIRCLE",
  0x25D9: "FISHEYE",
  
  // Miscellaneous symbols
  0x2600: "BLACK SUN WITH RAYS",
  0x2601: "CLOUD",
  0x2602: "UMBRELLA",
  0x2603: "SNOWMAN",
  0x260E: "BLACK TELEPHONE",
  0x2611: "BALLOT BOX WITH CHECK",
  0x2614: "UMBRELLA WITH RAIN DROPS",
  0x2615: "HOT BEVERAGE",
  0x2620: "SKULL AND CROSSBONES",
  0x2622: "RADIOACTIVE SIGN",
  0x2623: "BIOHAZARD SIGN",
  0x262E: "PEACE SYMBOL",
  0x262F: "YIN YANG",
  0x2638: "WHEEL OF DHARMA",
  0x2639: "WHITE FROWNING FACE",
  0x263A: "WHITE SMILING FACE",
  0x2640: "FEMALE SIGN",
  0x2642: "MALE SIGN",
  0x2660: "BLACK SPADE SUIT",
  0x2663: "BLACK CLUB SUIT",
  0x2665: "BLACK HEART SUIT",
  0x2666: "BLACK DIAMOND SUIT",
  0x2669: "QUARTER NOTE",
  0x266A: "EIGHTH NOTE",
  0x266B: "BEAMED EIGHTH NOTES",
  0x266C: "BEAMED SIXTEENTH NOTES",
  0x266D: "MUSIC FLAT SIGN",
  0x266E: "MUSIC NATURAL SIGN",
  0x266F: "MUSIC SHARP SIGN",
  
  // Box drawing
  0x2500: "BOX DRAWINGS LIGHT HORIZONTAL",
  0x2502: "BOX DRAWINGS LIGHT VERTICAL",
  0x250C: "BOX DRAWINGS LIGHT DOWN AND RIGHT",
  0x2510: "BOX DRAWINGS LIGHT DOWN AND LEFT",
  0x2514: "BOX DRAWINGS LIGHT UP AND RIGHT",
  0x2518: "BOX DRAWINGS LIGHT UP AND LEFT",
  0x251C: "BOX DRAWINGS LIGHT VERTICAL AND RIGHT",
  0x2524: "BOX DRAWINGS LIGHT VERTICAL AND LEFT",
  0x252C: "BOX DRAWINGS LIGHT DOWN AND HORIZONTAL",
  0x2534: "BOX DRAWINGS LIGHT UP AND HORIZONTAL",
  0x253C: "BOX DRAWINGS LIGHT VERTICAL AND HORIZONTAL",
  0x2550: "BOX DRAWINGS DOUBLE HORIZONTAL",
  0x2551: "BOX DRAWINGS DOUBLE VERTICAL",
  0x2554: "BOX DRAWINGS DOUBLE DOWN AND RIGHT",
  0x2557: "BOX DRAWINGS DOUBLE DOWN AND LEFT",
  0x255A: "BOX DRAWINGS DOUBLE UP AND RIGHT",
  0x255D: "BOX DRAWINGS DOUBLE UP AND LEFT",
  0x2560: "BOX DRAWINGS VERTICAL DOUBLE AND RIGHT SINGLE",
  0x2563: "BOX DRAWINGS VERTICAL DOUBLE AND LEFT SINGLE",
  0x2566: "BOX DRAWINGS DOWN DOUBLE AND HORIZONTAL SINGLE",
  0x2569: "BOX DRAWINGS UP DOUBLE AND HORIZONTAL SINGLE",
  0x256C: "BOX DRAWINGS DOUBLE VERTICAL AND HORIZONTAL",
}

export function getCharacterName(codePoint: number): string {
  try {
    // Basic name generation based on code point
    const category = UNICODE_CATEGORIES.find(
      (c) => codePoint >= c.range[0] && codePoint <= c.range[1]
    )
    if (category) {
      return `${category.name} Character U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`
    }
    return `Unicode Character U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`
  } catch {
    return "Unknown Character"
  }
}

export function getCommonName(codePoint: number): string | undefined {
  return COMMON_NAMES[codePoint]
}

export function generateCharactersForCategory(category: UnicodeCategory): UnicodeCharacter[] {
  const characters: UnicodeCharacter[] = []
  for (let codePoint = category.range[0]; codePoint <= category.range[1]; codePoint++) {
    try {
      const char = String.fromCodePoint(codePoint)
      // Skip control characters and unassigned code points
      if (char.trim() === "" && codePoint < 0x20) continue
      
      characters.push({
        char,
        codePoint,
        name: getCharacterName(codePoint),
        commonName: getCommonName(codePoint),
        category: category.name,
        htmlEntity: `&#${codePoint};`,
        cssCode: `\\${codePoint.toString(16).toUpperCase()}`,
      })
    } catch {
      // Skip invalid code points
    }
  }
  return characters
}

export function searchCharacters(query: string, categoryIds: string[] | null): UnicodeCharacter[] {
  const lowerQuery = query.toLowerCase()
  const results: UnicodeCharacter[] = []
  
  const categoriesToSearch = categoryIds && categoryIds.length > 0
    ? UNICODE_CATEGORIES.filter(c => categoryIds.includes(c.id))
    : UNICODE_CATEGORIES
  
  for (const category of categoriesToSearch) {
    const chars = generateCharactersForCategory(category)
    for (const char of chars) {
      if (
        char.char.includes(query) ||
        char.name.toLowerCase().includes(lowerQuery) ||
        (char.commonName && char.commonName.toLowerCase().includes(lowerQuery)) ||
        char.htmlEntity.toLowerCase().includes(lowerQuery) ||
        char.codePoint.toString(16).toLowerCase().includes(lowerQuery.replace("u+", "").replace("0x", ""))
      ) {
        results.push(char)
      }
    }
    // Limit results for performance
    if (results.length >= 500) break
  }
  
  return results.slice(0, 500)
}
