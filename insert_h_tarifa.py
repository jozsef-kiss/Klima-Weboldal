import os

def insert_gyik_menu():
    root_dir = os.getcwd()
    
    # Ezt szúrjuk be (GYIK menüpont)
    # A fájlnév: gyik.html (feltételezve, hogy így mentetted el az előzőt)
    NEW_LINK = '\n                  <a href="/gyik.html"> GYIK </a>'
    
    # Keresési kulcsszavak
    KEYWORD_SECTION = "Oldalak"           # A footer címsora, hogy biztos jó helyen járjunk
    KEYWORD_LINK_TEXT = "Tippek és tanácsok" # Ez után fogjuk beszúrni
    
    # Ellenőrzéshez: ha ez már benne van, nem csinálunk semmit
    CHECK_EXISTING_1 = "gyik.html"
    CHECK_EXISTING_2 = "> GYIK <"

    print(f"--- INDÍTÁS: GYIK menüpont beszúrása a '{KEYWORD_LINK_TEXT}' alá ---")
    
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

                    # 1. Van-e már benne GYIK?
                    if CHECK_EXISTING_1 in content or CHECK_EXISTING_2 in content:
                        # print(f"[SKIP] Már van benne GYIK: {filename}")
                        count_skip += 1
                        continue

                    # 2. Keressük meg a FOOTER "Oldalak" részét (hátulról keresve)
                    section_idx = content.rfind(KEYWORD_SECTION)
                    
                    if section_idx == -1:
                        # print(f"[INFO] Nincs 'Oldalak' szekció a fájlban: {filename}")
                        count_skip += 1
                        continue

                    # 3. A megtalált "Oldalak" UTÁN keressük a "Tippek és tanácsok" szöveget
                    link_text_idx = content.find(KEYWORD_LINK_TEXT, section_idx)
                    
                    if link_text_idx == -1:
                        print(f"[HIBA] '{filename}': Van 'Oldalak', de nincs alatta '{KEYWORD_LINK_TEXT}'.")
                        count_error += 1
                        continue

                    # 4. Megkeressük a link lezáró tag-jét (</a>) a szöveg után
                    close_tag_idx = content.find("</a>", link_text_idx)
                    
                    if close_tag_idx == -1:
                        print(f"[HIBA] '{filename}': Megvan a szöveg, de nincs lezáró </a> tag.")
                        count_error += 1
                        continue

                    # 5. BESZÚRÁS
                    # A pozíció: close_tag_idx + 4 karakter (</a> hossza)
                    insert_pos = close_tag_idx + 4
                    
                    # Beillesztés: Fájl eleje + Új link + Fájl vége
                    new_content = content[:insert_pos] + NEW_LINK + content[insert_pos:]
                    
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    
                    print(f"[SIKER] GYIK beszúrva: {filename}")
                    count_ok += 1

                except Exception as e:
                    print(f"[CRITICAL] Fájl hiba: {filepath} -> {e}")

    print("-" * 30)
    print(f"VÉGE:")
    print(f"  - Sikerült beszúrni: {count_ok} fájlban")
    print(f"  - Kihagyva (már kész/nem releváns): {count_skip} fájl")
    print(f"  - Hiba (nem találta a horgonyt): {count_error} fájl")

if __name__ == "__main__":
    confirm = input("Mehet a GYIK menüpont beszúrása minden footerbe? (i/n): ")
    if confirm.lower() == 'i':
        insert_gyik_menu()
    else:
        print("Megszakítva.")