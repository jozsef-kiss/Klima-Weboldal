import os

# --- KONFIGURÁCIÓ ---
# Mit keresünk? (A hibás szöveg)
HIBAS_SZOVEG = 'Szolgáltatásink'
# Mire cseréljük? (A helyes szöveg)
HELYES_SZOVEG = 'Szolgáltatásaink'

# Hol vagyunk? (A script könyvtára)
gyoker_konyvtar = os.getcwd()

print(f"--- INDUL A JAVÍTÁS ---")
print(f"Keresett kifejezés: '{HIBAS_SZOVEG}'")
print(f"Csere erre: '{HELYES_SZOVEG}'")
print("-" * 30)

javitott_fajlok_szama = 0

# Végigsétálunk az összes mappán és fájlon
for root, dirs, files in os.walk(gyoker_konyvtar):
    for file in files:
        # Csak a HTML fájlokkal foglalkozunk
        if file.endswith(".html"):
            fajl_utvonal = os.path.join(root, file)
            
            try:
                # 1. Fájl beolvasása
                with open(fajl_utvonal, 'r', encoding='utf-8') as f:
                    tartalom = f.read()
                
                # 2. Ellenőrzés: benne van-e a hiba?
                if HIBAS_SZOVEG in tartalom:
                    # 3. Csere
                    uj_tartalom = tartalom.replace(HIBAS_SZOVEG, HELYES_SZOVEG)
                    
                    # 4. Mentés
                    with open(fajl_utvonal, 'w', encoding='utf-8') as f:
                        f.write(uj_tartalom)
                        
                    print(f"[JAVÍTVA] {file}")
                    javitott_fajlok_szama += 1
                else:
                    # Ha nincs benne hiba, nem nyúlunk hozzá
                    pass
                    
            except Exception as e:
                print(f"[HIBA] Nem sikerült feldolgozni: {file} - {e}")

print("-" * 30)
print(f"KÉSZ! Összesen {javitott_fajlok_szama} fájlban javítottam a menüt.")