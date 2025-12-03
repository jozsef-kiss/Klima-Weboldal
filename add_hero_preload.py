import os

TARGET_FILE = 'index.html'
IMAGE_URL = "/images/fooldal/55861b79-8947-41e8-88a5-6ad660369282.webp"

# A preload sor, amit beszúrunk
# 'fetchpriority="high"': jelzi a böngészőnek, hogy ez a legfontosabb fájl
PRELOAD_TAG = f'<link rel="preload" href="{IMAGE_URL}" as="image" fetchpriority="high">'

def add_preload():
    print(f"Preload hozzáadása a {TARGET_FILE} fájlhoz...")
    
    if not os.path.exists(TARGET_FILE):
        print(f"HIBA: Nem találom a {TARGET_FILE} fájlt!")
        return

    with open(TARGET_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # 1. Ellenőrzés: Van-e már benne ilyen preload?
    if IMAGE_URL in content and 'rel="preload"' in content:
        print("  [INFO] Ez a kép már elő van töltve (preload), nem rakom bele újra.")
        return

    # 2. Beszúrás a <head> részbe
    # A legjobb helye rögtön a karakterkódolás vagy a viewport után van, hogy hamar megtalálja a böngésző.
    if '<meta name="viewport"' in content:
        # Megkeressük a viewport meta taget és utána szúrjuk be
        content = content.replace('/>', f'/>\n  {PRELOAD_TAG}', 1) # Csak az első találatnál (ami remélhetőleg a viewport vagy charset)
        # De ez kicsit kockázatos, ha sok /> van. Biztonságosabb a <head> után.
    
    # BIZTONSÁGOSABB MÓDSZER: Keressük meg a <head> nyitó taget
    if "<head>" in content:
        content = content.replace("<head>", f"<head>\n  {PRELOAD_TAG}")
        print("  [SIKER] A preload sort beszúrtam közvetlenül a <head> alá.")
    else:
        print("  [HIBA] Nem találom a <head> taget a fájlban.")
        return

    if content != original_content:
        with open(TARGET_FILE, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  A fájl frissítve lett.")
    else:
        print("  Nem történt változás.")

if __name__ == "__main__":
    add_preload()