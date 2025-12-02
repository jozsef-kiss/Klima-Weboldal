import os
import re

# A mappa, ahol a weboldal fájljai vannak
ROOT_DIR = '.'

def revert_css_optimization(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    modified = False

    # Minták, amiket vissza kell állítani (a layoutért felelős fájlok)
    # Csak a bootstrap, style és responsive fájlokat állítjuk vissza, a fontokat NEM.
    files_to_revert = ['bootstrap', 'style', 'responsive']

    for name in files_to_revert:
        # Megkeressük az előző script által generált aszinkron blokkot
        # Példa: <link rel="preload" href="../css/style.css" as="style" onload="..."> ... <noscript>...</noscript>
        
        # Ez a regex megkeresi a preload-os sort és a hozzá tartozó noscript sort is
        pattern = r'(<link rel="preload" href="([^"]*'+ name + r'\.css[^"]*)" as="style" onload="this\.onload=null;this\.rel=\'stylesheet\'">\s*<noscript><link rel="stylesheet" href="\2"></noscript>)'
        
        matches = list(re.finditer(pattern, content))
        
        for match in matches:
            full_block = match.group(1) # A teljes többsoros blokk
            href_url = match.group(2)   # A fájl elérési útja (pl. css/style.css)
            
            # Visszaállítás a hagyományos, stabil formátumra
            original_tag = f'<link rel="stylesheet" type="text/css" href="{href_url}" />'
            
            # Ha responsive.css vagy style.css, a type attribútum nem mindig kell, de a biztonság kedvéért egyszerűsítünk:
            if "responsive" in name or "style" in name:
                 original_tag = f'<link href="{href_url}" rel="stylesheet" />'
            else:
                 original_tag = f'<link rel="stylesheet" type="text/css" href="{href_url}" />'

            content = content.replace(full_block, original_tag)
            modified = True

    if modified:
        print(f"JAVÍTVA (Stabilitás visszaállítva): {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
    else:
        pass # Nem volt mit javítani

def main():
    print("Layout ugrálás javítása (CSS visszaállítás)...")
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                try:
                    revert_css_optimization(filepath)
                except Exception as e:
                    print(f"HIBA a {filepath} fájlnál: {e}")
    print("KÉSZ! A menü és a képek mostantól stabilak lesznek.")

if __name__ == "__main__":
    main()