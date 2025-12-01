import os
import re
from urllib.parse import unquote

def check_images(root_dir):
    print("--- 🔍 Képhivatkozások ellenőrzése... ---")
    missing_count = 0
    found_count = 0
    
    # Kiterjesztések, amiket képnek tekintünk
    img_extensions = ('.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif')

    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(subdir, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Megkeressük az összes <img ... src="..."> részt
                images = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
                
                for img_src in images:
                    # Kihagyjuk az online képeket (pl. http://...)
                    if img_src.startswith(('http', '//', 'data:')):
                        continue
                    
                    # Levágjuk a verziószámot (?v=...)
                    clean_src = img_src.split('?')[0]
                    clean_src = unquote(clean_src) # %20 -> szóköz átalakítás
                    
                    # Összerakjuk a teljes elérési utat
                    if clean_src.startswith('/'):
                        # Ha /-el kezdődik, akkor a gyökértől nézzük
                        abs_path = os.path.join(root_dir, clean_src.lstrip('/'))
                    else:
                        # Ha nem, akkor a HTML fájlhoz képest relatív
                        abs_path = os.path.join(subdir, clean_src)
                    
                    # Normalizáljuk az útvonalat (pl. ../ feloldása)
                    abs_path = os.path.normpath(abs_path)
                    
                    # Ellenőrzés: létezik-e a fájl?
                    if not os.path.exists(abs_path):
                        # Ha nem létezik, megnézzük, hátha csak kisbetű/nagybetű hiba
                        if os.path.exists(abs_path.lower()): # (Windows-on ez csalóka lehet, de Linuxon fontos)
                            print(f"⚠️  [KISBETŰ/NAGYBETŰ HIBA] Fájl: {file}")
                            print(f"    Kód ban: {img_src}")
                            print(f"    Valóságban: {clean_src.lower()} (Javítsd át a kódban!)")
                        else:
                            print(f"❌ [HIÁNYZIK] Fájl: {file}")
                            print(f"    Keresett kép: {img_src}")
                            print(f"    Itt kerestem: {abs_path}")
                        missing_count += 1
                    else:
                        found_count += 1

    print("-" * 40)
    print(f"Összes ellenőrzött kép: {found_count + missing_count}")
    if missing_count == 0:
        print("✅ Minden képfájl megtalálható!")
    else:
        print(f"❌ Összesen {missing_count} db hiányzó képet találtam.")

if __name__ == "__main__":
    check_images(os.getcwd())