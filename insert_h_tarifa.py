import os

def final_fix():
    root_dir = os.getcwd()
    
    # Ezt szúrjuk be
    # Figyelj: "/h-tarifa-igenyles.html" abszolút útvonal, minden mappából működnie kell
    NEW_LINK = '\n                  <a href="/h-tarifa-igenyles.html"> H-tarifa </a>'
    
    # Keresési kulcsszavak (Látható szövegek!)
    KEYWORD_SECTION = "Oldalak"      # A footer címsora
    KEYWORD_LINK_TEXT = "Klímaberendezések" # A menüpont neve
    
    print(f"--- INDÍTÁS: Keresés '{KEYWORD_LINK_TEXT}' szöveg alapján a footerben ---")
    
    count_ok = 0
    count_skip = 0
    count_error = 0

    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.lower().endswith(".html"):
                filepath = os.path.join(dirpath, filename)
                
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()

                    # 1. Van-e már benne H-tarifa?
                    if "h-tarifa-igenyles.html" in content or "> H-tarifa <" in content:
                        # print(f"[SKIP] Már kész: {filename}")
                        count_skip += 1
                        continue

                    # 2. Keressük meg a FOOTER "Oldalak" részét
                    # Az utolsó előfordulást keressük (rfind), mert az "Oldalak" szó lehet máshol is, 
                    # de a footer általában a fájl vége felé van.
                    section_idx = content.rfind(KEYWORD_SECTION)
                    
                    if section_idx == -1:
                        # Ha nincs "Oldalak" szó a fájlban
                        # print(f"[INFO] Nincs 'Oldalak' szekció: {filename}")
                        count_skip += 1
                        continue

                    # 3. A megtalált "Oldalak" UTÁN keressük a "Klímaberendezések" szót
                    link_text_idx = content.find(KEYWORD_LINK_TEXT, section_idx)
                    
                    if link_text_idx == -1:
                        # Megvan az Oldalak, de nincs alatta Klímaberendezések link (???)
                        print(f"[HIBA] '{filename}': Van 'Oldalak', de alatta nincs 'Klímaberendezések' szöveg.")
                        count_error += 1
                        continue

                    # 4. Megkeressük a link lezáró tag-jét (</a>) a szöveg után
                    close_tag_idx = content.find("</a>", link_text_idx)
                    
                    if close_tag_idx == -1:
                        print(f"[HIBA] '{filename}': Megvan a szöveg, de nincs lezáró </a> tag.")
                        count_error += 1
                        continue

                    # 5. BESZÚRÁS
                    # A pozíció: close_tag_idx + 4 karakter (</a>)
                    insert_pos = close_tag_idx + 4
                    
                    new_content = content[:insert_pos] + NEW_LINK + content[insert_pos:]
                    
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    
                    print(f"[SIKER] Beszúrva: {filename}")
                    count_ok += 1

                except Exception as e:
                    print(f"[CRITICAL] Fájl hiba: {filepath} -> {e}")

    print("-" * 30)
    print(f"VÉGE:")
    print(f"  - Sikerült: {count_ok}")
    print(f"  - Kihagyva (már kész/nem releváns): {count_skip}")
    print(f"  - Hiba (szerkezeti gond): {count_error}")

if __name__ == "__main__":
    confirm = input("Mehet a javítás SZÖVEG alapú kereséssel? (i/n): ")
    if confirm.lower() == 'i':
        final_fix()
    else:
        print("Megszakítva.")