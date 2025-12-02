import os
import re

# A mappa, ahol a weboldal fájljai vannak
ROOT_DIR = '.'
CSS_DIR = os.path.join(ROOT_DIR, 'css')

# A fájlok, amiket egyesítünk (fontos a sorrend!)
CSS_FILES_TO_MERGE = ['bootstrap.css', 'style.css', 'responsive.css']
OUTPUT_CSS_FILENAME = 'main.min.css'

# Google Fonts optimalizált blokk (ez minden oldalba bekerül)
GOOGLE_FONTS_BLOCK = """<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
</noscript>"""

def minify_css(content):
    """Egyszerű CSS tömörítés: kommentek és felesleges szóközök törlése"""
    # Kommentek törlése /* ... */
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)
    # Sortörések és tabulátorok cseréje szóközre
    content = re.sub(r'\s+', ' ', content)
    # Felesleges szóközök törlése szimbólumok körül
    content = re.sub(r'\s?([{:;,])\s?', r'\1', content)
    # Záró pontosvessző elhagyása a blokk végén (opcionális, de spórol helyet)
    content = content.replace(';}', '}')
    return content.strip()

def create_combined_css():
    """Létrehozza a main.min.css fájlt a CSS mappában"""
    print("CSS fájlok egyesítése és tömörítése...")
    full_content = ""
    
    for filename in CSS_FILES_TO_MERGE:
        filepath = os.path.join(CSS_DIR, filename)
        if os.path.exists(filepath):
            print(f"  - Hozzáadás: {filename}")
            with open(filepath, 'r', encoding='utf-8') as f:
                # Eltávolítjuk a @import Google Fonts sorokat, ha vannak a style.css-ben
                file_content = f.read()
                file_content = re.sub(r'@import url.*fonts\.googleapis\.com.*;', '', file_content)
                full_content += minify_css(file_content)
        else:
            print(f"  ! HIBA: Nem található a {filename} fájl!")

    output_path = os.path.join(CSS_DIR, OUTPUT_CSS_FILENAME)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_content)
    print(f"KÉSZ: {output_path} létrehozva.")

def update_html_files():
    """Végigmegy a HTML fájlokon és frissíti a <head> részt"""
    print("\nHTML fájlok frissítése...")
    
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                process_html_file(filepath)

def process_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # 1. Meghatározzuk a relatív útvonalat a css mappához
    # Ha a fájl a gyökérben van, a prefix "css/", ha mappában, akkor "../css/" stb.
    # Ezt a legegyszerűbben úgy találjuk ki, hogy megnézzük, hogyan hivatkozott eddig a bootstrap.css-re.
    prefix_match = re.search(r'href=["\']([^"\']*)/?bootstrap\.css', content)
    
    if prefix_match:
        # Pl. "css" vagy "../css"
        css_prefix_path = prefix_match.group(1)
        
        # Ha a perjel benne maradt a csoportban, vagy hiányzik, korrigáljuk
        if not css_prefix_path.endswith('/'):
             css_path_prefix = css_prefix_path + '/' if css_prefix_path else ''
        else:
             css_path_prefix = css_prefix_path
    else:
        # Ha nem találjuk a bootstrapet, akkor valószínűleg nem kell módosítani, vagy "css/" az alap
        # De inkább kihagyjuk a kockázatot.
        if "bootstrap.css" not in content:
            return 
        css_path_prefix = "css/" # Fallback

    # Az új CSS blokk, amit beillesztünk
    # Font Awesome marad külön (de megtartjuk a relatív útvonalat), a többi megy a main.min.css-be
    # Verziószámot teszünk mögé a cache miatt (?v=1.0)
    new_css_block = f"""
    {GOOGLE_FONTS_BLOCK}

    <link href="{css_path_prefix}font-awesome.min.css?v=2025" rel="stylesheet" />

    <link rel="stylesheet" href="{css_path_prefix}{OUTPUT_CSS_FILENAME}?v=2025" />
    """

    # 2. Töröljük a régi CSS hivatkozásokat és a Google Fonts behívást
    
    # Eltávolítandó fájlok listája (regex pattern részek)
    files_to_remove = [
        r'bootstrap\.css[^"\']*',
        r'style\.css[^"\']*',
        r'responsive\.css[^"\']*',
        r'font-awesome\.min\.css[^"\']*',
        r'fonts\.googleapis\.com/css2\?family=Poppins[^"\']*' # Ha már benne volt
    ]

    # Kitöröljük az összes régi <link> sort, ami ezekre hivatkozik
    for pattern in files_to_remove:
        # <link ... href="...pattern..." ...> sorok törlése
        # Figyelünk a többsoros írásmódra is és a noscript blokkokra is
        content = re.sub(r'\s*<link[^>]*href=["\'][^"\']*' + pattern + r'["\'][^>]*>\s*', '', content, flags=re.IGNORECASE)
        # Esetleges noscript blokkok törlése (ha az előző scriptből maradtak)
        content = re.sub(r'\s*<noscript><link[^>]*' + pattern + r'[^>]*></noscript>\s*', '', content, flags=re.IGNORECASE)
        # Preload linkek törlése (előző scriptből)
        content = re.sub(r'\s*<link[^>]*preload[^>]*' + pattern + r'[^>]*>\s*', '', content, flags=re.IGNORECASE)


    # 3. Beszúrjuk az új blokkot a <title> tag után (vagy a head végére, ha nincs title)
    if "</title>" in content:
        content = content.replace("</title>", "</title>\n" + new_css_block)
    else:
        content = content.replace("</head>", new_css_block + "\n</head>")

    # Felesleges üres sorok takarítása
    content = re.sub(r'\n\s*\n', '\n', content)

    # Mentés
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  [OK] Frissítve: {filepath}")
    else:
        print(f"  [-] Nem változott: {filepath}")

if __name__ == "__main__":
    create_combined_css()
    update_html_files()
    print("\nKÉSZ! Töltsd fel a fájlokat a szerverre (beleértve az új css/main.min.css-t is)!")