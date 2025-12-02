import os

# Csak az index.html-t módosítjuk, mert a hero kép ott van
TARGET_FILE = 'index.html'

# Ezt a sort szúrjuk be: Preload + High Priority
# Így a böngésző azonnal elkezdi tölteni, nem vár a CSS-re
PRELOAD_TAG = '<link rel="preload" href="/images/fooldal/55861b79-8947-41e8-88a5-6ad660369282.webp" as="image" fetchpriority="high">'

def add_lcp_preload():
    print(f"LCP optimalizálás indítása a {TARGET_FILE} fájlon...")
    
    if not os.path.exists(TARGET_FILE):
        print(f"HIBA: Nem találom a {TARGET_FILE} fájlt! A scriptet a főkönyvtárban futtasd.")
        return

    with open(TARGET_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # Ellenőrzés: Nehogy kétszer rakjuk bele
    if "55861b79-8947-41e8-88a5-6ad660369282.webp" in content and 'rel="preload"' in content:
        print(f"  [!] A preload sor már benne van. Nem módosítom újra.")
        return

    # Beszúrás rögtön a <head> nyitó tag után
    # Így ez lesz az egyik legelső utasítás, amit a böngésző meglát
    if "<head>" in content:
        new_content = content.replace("<head>", f"<head>\n    {PRELOAD_TAG}")
        
        with open(TARGET_FILE, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  [OK] SIKER! A preload sort hozzáadtam a <head> elejére.")
        print("  Most a böngésző azonnal tudni fogja, hogy le kell tölteni a nagy képet.")
    else:
        print("  [!] HIBA: Nem találom a <head> taget a fájlban. Ellenőrizd a HTML szerkezetet.")

if __name__ == "__main__":
    add_lcp_preload()