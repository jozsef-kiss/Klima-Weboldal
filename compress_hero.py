from PIL import Image
import os

# A pontos útvonal a Google hibaüzenete alapján
IMAGE_PATH = 'images/fooldal/55861b79-8947-41e8-88a5-6ad660369282.webp'

def compress_hero_image():
    print("--- LCP Háttérkép Extrém Tömörítése ---")
    
    if not os.path.exists(IMAGE_PATH):
        print(f"HIBA: Nem találom a fájlt: {IMAGE_PATH}")
        # Megpróbáljuk megkeresni, hátha máshol van (biztonsági keresés)
        for root, dirs, files in os.walk('.'):
            for file in files:
                if file == "55861b79-8947-41e8-88a5-6ad660369282.webp":
                    print(f"  Megtaláltam itt: {os.path.join(root, file)}")
        return

    # 1. Eredeti méret ellenőrzése
    original_size = os.path.getsize(IMAGE_PATH)
    print(f"Jelenlegi méret: {original_size / 1024:.2f} KiB")

    try:
        with Image.open(IMAGE_PATH) as img:
            # 2. Tömörítés
            # A 'quality=60' általában a legjobb kompromisszum háttérképeknél (szemre jó, de kicsi)
            # A 'method=6' a leglassabb, de leghatékonyabb tömörítési algoritmust használja
            img.save(IMAGE_PATH, 'WEBP', quality=60, method=6)
            
        # 3. Eredmény ellenőrzése
        new_size = os.path.getsize(IMAGE_PATH)
        saved = original_size - new_size
        print(f"Új méret:       {new_size / 1024:.2f} KiB")
        print(f"MEGTAKARÍTÁS:   {saved / 1024:.2f} KiB (-{(saved/original_size)*100:.1f}%)")
        
        if new_size < 55 * 1024:
            print("\n[SIKER] A kép mérete 55 KiB alá csökkent! A Google elégedett lesz.")
        else:
            print("\n[INFO] Még mindig kicsit nagy, de sokkal jobb.")

    except Exception as e:
        print(f"HIBA a tömörítés közben: {e}")

if __name__ == "__main__":
    compress_hero_image()