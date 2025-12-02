import os
import re

TARGET_FILE = 'index.html'

# A kép elérési útja (amit korábban megtaláltunk)
IMAGE_URL = "/images/fooldal/55861b79-8947-41e8-88a5-6ad660369282.webp"

# Az új HTML szerkezet, amit beépítünk:
# 1. A div-ről levesszük a hátteret (inline style override).
# 2. Beszúrunk egy valódi képet, ami abszolút pozícióval a szöveg mögé megy.
# 3. Rátesszük a fetchpriority="high"-t.

def fix_lcp_structure():
    print(f"LCP szerkezet átalakítása a {TARGET_FILE} fájlon...")
    
    if not os.path.exists(TARGET_FILE):
        print(f"HIBA: Nem találom a {TARGET_FILE} fájlt!")
        return

    with open(TARGET_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # 1. Megkeressük a <div class="hero_area"> sort
    if '<div class="hero_area">' in content:
        print("  Megtaláltam a hero_area div-et.")
        
        # Lecseréljük egy olyan verzióra, ami:
        # - Relatív pozíciót kap (hogy a kép ehhez igazodjon)
        # - Kikapcsolja a CSS háttérképet (background-image: none)
        # - És tartalmazza a VALÓDI képet a fetchpriority attribútummal
        
        new_block = f'''<div class="hero_area" style="position: relative; background-image: none !important;">
    <img src="{IMAGE_URL}" 
         alt="Klímapajzs háttér" 
         fetchpriority="high"
         style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;" 
    >
    '''
        
        content = content.replace('<div class="hero_area">', new_block)
        
    else:
        print("  [!] HIBA: Nem találom a <div class=\"hero_area\"> sort pontosan ebben a formában.")
        # Ha esetleg már vannak ott classok vagy style-ok, a regex biztonságosabb lenne, 
        # de a te fájlodban ez tisztán szerepelt.

    # 2. Opcionális: Kivesszük a korábbi 'preload' sort, ha benne van (már nem szükséges, mert az img tag gyorsabb)
    if 'rel="preload"' in content and IMAGE_URL in content:
        print("  Régi preload link eltávolítása (már nem kell)...")
        # Egyszerű string alapú törlés, mert tudjuk mit szúrtunk be legutóbb
        content = re.sub(r'<link rel="preload"[^>]*' + re.escape(IMAGE_URL) + r'[^>]*>', '', content)

    if content != original_content:
        with open(TARGET_FILE, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  [SIKER] Az index.html frissítve! A háttérkép most már valódi LCP kép.")
    else:
        print("  [!] Nem történt változás (lehet, hogy már át van írva?)")

if __name__ == "__main__":
    fix_lcp_structure()