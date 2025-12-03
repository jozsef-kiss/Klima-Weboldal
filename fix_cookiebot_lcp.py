import os

TARGET_FILE = 'index.html'

# A te Cookiebot azonosítód a PDF alapján
CBID = "f5e7a63e-ca95-4ec6-94d4-9d7537afd4cb"

# Ez az új sor: Defer módban töltjük, így nem blokkol, de nem is késik 4 másodpercet
COOKIEBOT_TAG = f'<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="{CBID}" type="text/javascript" defer></script>'

def fix_cookiebot():
    print(f"Cookiebot optimalizálása a {TARGET_FILE} fájlon...")
    
    if not os.path.exists(TARGET_FILE):
        print(f"HIBA: Nincs meg a {TARGET_FILE}!")
        return

    with open(TARGET_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # 1. Ellenőrzés: Van-e már benne Cookiebot?
    if CBID in content and 'consent.cookiebot.com' in content:
        print("  [INFO] A Cookiebot script már benne van a fájlban.")
        # Opcionális: Ha nincs rajta defer, rárakhatnánk, de a beszúrás biztosabb
        if 'defer' not in content.split('consent.cookiebot.com')[1].split('>')[0]:
             print("  [!] De hiányzik róla a 'defer'. Javítom...")
             content = content.replace('src="https://consent.cookiebot.com/uc.js"', 'src="https://consent.cookiebot.com/uc.js" defer')
    else:
        # 2. Beszúrás a <head> elejére (a Preload után)
        # Így hamar elindul a letöltés, de a 'defer' miatt nem fogja meg a megjelenítést
        if '<head>' in content:
            content = content.replace('<head>', f'<head>\n  {COOKIEBOT_TAG}')
            print("  [OK] Cookiebot script beszúrva a <head> elejére (defer módban).")
        else:
            print("  [HIBA] Nem találom a <head> taget.")

    # 3. Fontos: Ha a Cookiebot a GTM-ben is benne van, az nem baj, 
    # mert a script id="Cookiebot" miatt nem fog kétszer lefutni, 
    # de a HTML-es verzió fog "nyerni" sebességben.

    if content != original_content:
        with open(TARGET_FILE, 'w', encoding='utf-8') as f:
            f.write(content)
        print("\nSIKER! Az index.html frissítve.")
    else:
        print("\nNem történt változás.")

if __name__ == "__main__":
    fix_cookiebot()