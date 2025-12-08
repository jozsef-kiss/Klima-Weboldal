import os

# Ez után a sor után szúrjuk be az újat
ANCHOR_TEXT = 'href="/klimaberendezesek.html"> Klímaberendezések </a>'

# Ezt szúrjuk be (figyelünk a sortörésre és a behúzásra)
NEW_LINE_TO_INSERT = '\n                  <a href="/h-tarifa-igenyles.html"> H-tarifa </a>'

# Ezt keressük, hogy tudjuk, már benne van-e (hogy ne duplikáljuk)
CHECK_TEXT = 'href="/h-tarifa-igenyles.html"> H-tarifa </a>'

def insert_link_everywhere():
    root_dir = os.getcwd()
    updated_count = 0
    skipped_count = 0
    
    print(f"--- H-tarifa link beszúrása indítva itt: {root_dir} ---")

    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.lower().endswith(".html"):
                filepath = os.path.join(dirpath, filename)
                
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    # 1. Ellenőrizzük, hogy létezik-e a beillesztési pont (Klímaberendezések)
                    if ANCHOR_TEXT in content:
                        
                        # 2. Ellenőrizzük, hogy VAN-E MÁR H-tarifa benne
                        if CHECK_TEXT in content:
                            print(f"[kihagyva] Már tartalmazza: {filename}")
                            skipped_count += 1
                        else:
                            # 3. Nincs benne, tehát BESZÚRJUK
                            # A replace-t használjuk trükkösen: a régit lecseréljük "régi + új"-ra
                            new_content = content.replace(ANCHOR_TEXT, ANCHOR_TEXT + NEW_LINE_TO_INSERT)
                            
                            with open(filepath, "w", encoding="utf-8") as f:
                                f.write(new_content)
                                
                            print(f"[SIKER] H-tarifa beszúrva: {filename}")
                            updated_count += 1
                    else:
                        # Ha nincs "Klímaberendezések" link a fájlban (pl. nem releváns oldal vagy más a footer)
                        # print(f"[info] Nem található a hivatkozási pont: {filename}")
                        skipped_count += 1

                except Exception as e:
                    print(f"[HIBA] Fájl hiba: {filepath} -> {e}")

    print("-" * 30)
    print(f"KÉSZ! Frissítve: {updated_count} fájl. Érintetlen: {skipped_count}.")

if __name__ == "__main__":
    confirm = input("Mehet a 'H-tarifa' menüpont beszúrása a 'Klímaberendezések' alá? (i/n): ")
    if confirm.lower() == 'i':
        insert_link_everywhere()
    else:
        print("Megszakítva.")