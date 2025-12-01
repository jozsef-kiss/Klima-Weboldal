import os
import re
from PIL import Image # Ehhez kell a 'pip install Pillow'

# Ezekre a szavakra figyelünk a fájlnevekben (ezeket NE lazy loadolja)
EXCLUDE_LAZY = ['logo', 'icon', 'hero', 'slider']

def get_image_dimesions(img_path):
    """Megnyitja a képet és visszaadja a szélességet/magasságot."""
    try:
        with Image.open(img_path) as img:
            return img.size
    except Exception:
        return None, None

def process_img_tag(match, root_dir, file_dir):
    """Ez a függvény rakja össze az új <img ...> taget."""
    full_tag = match.group(0)
    attrs = match.group(1)
    
    # Kikeressük az src="..." tartalmát
    src_match = re.search(r'src=["\']([^"^\']+)["\']', attrs)
    if not src_match:
        return full_tag # Ha nincs src, nem nyúlunk hozzá

    src_val = src_match.group(1)
    # Leszedjük a ?v=... verziószámot a fájlkereséshez
    clean_src = src_val.split('?')[0] 
    
    # Megpróbáljuk megtalálni a képet a gépen
    # 1. Próbálkozás: A HTML fájlhoz képest relatívan
    local_path = os.path.join(file_dir, clean_src.replace('/', os.sep))
    
    # 2. Próbálkozás: Ha abszolút útvonal (/images/...), akkor a gyökértől nézzük
    if not os.path.exists(local_path) and clean_src.startswith('/'):
        local_path = os.path.join(root_dir, clean_src.lstrip('/').replace('/', os.sep))
    
    # Ha még mindig nincs meg, próbáljuk meg a gyökérből indítva (ha a path fixer kivette a / jelet)
    if not os.path.exists(local_path):
         local_path = os.path.join(root_dir, clean_src.replace('/', os.sep))

    width, height = None, None
    if os.path.exists(local_path):
        width, height = get_image_dimesions(local_path)
    else:
        print(f"  [!] Nem található képfájl: {clean_src}")

    # --- Új attribútumok hozzáadása ---
    new_attrs = attrs

    # Width és Height hozzáadása (ha sikerült lemérni)
    if width and height:
        # Csak akkor írjuk felül, ha nincs még megadva, vagy ha %-os (azt hagyjuk)
        if 'width=' not in new_attrs:
            new_attrs += f' width="{width}"'
        if 'height=' not in new_attrs:
            new_attrs += f' height="{height}"'

    # Lazy loading logika
    # Ha a fájlnévben nincs tiltott szó (pl. logo), akkor mehet a lazy
    is_excluded = any(x in clean_src.lower() for x in EXCLUDE_LAZY)
    if not is_excluded and 'loading=' not in new_attrs:
        new_attrs += ' loading="lazy"'
    
    return f'<img {new_attrs}>'

def process_html_file(file_path, root_dir):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    file_dir = os.path.dirname(file_path)
    
    # Megkeressük az összes <img ... > taget
    # A regex (.*?) a tag belsejét jelenti
    pattern = r'<img\s+(.*?)>'
    
    # A re.sub minden találatra lefuttatja a process_img_tag függvényt
    new_content = re.sub(pattern, lambda m: process_img_tag(m, root_dir, file_dir), content, flags=re.DOTALL)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Optimalizálva: {file_path}")

def main():
    root_dir = os.getcwd()
    print("--- Képoptimalizálás indítása (Width/Height + Lazy Load) ---")
    
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html'):
                process_html_file(os.path.join(subdir, file), root_dir)
                
    print("--- Kész! ---")

if __name__ == "__main__":
    main()