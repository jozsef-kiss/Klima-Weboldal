import os
import re

ROOT_DIR = '.'
CSS_DIR = os.path.join(ROOT_DIR, 'css')

def merge_font_awesome():
    print("--- 1. FontAwesome beolvasztása a main.min.css-be ---")
    fa_path = os.path.join(CSS_DIR, 'font-awesome.min.css')
    main_path = os.path.join(CSS_DIR, 'main.min.css')
    
    if os.path.exists(fa_path) and os.path.exists(main_path):
        with open(fa_path, 'r', encoding='utf-8') as f:
            fa_content = f.read()
        with open(main_path, 'r', encoding='utf-8') as f:
            main_content = f.read()
            
        # Ha már benne van, nem rakjuk bele újra
        if "fa-inverse" not in main_content:
            # Összefűzzük: FontAwesome + Eredeti Main
            new_content = fa_content + "\n" + main_content
            with open(main_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("  [OK] FontAwesome sikeresen beolvasztva.")
        else:
            print("  [INFO] Már tartalmazza a FontAwesome-ot.")
    else:
        print("  [HIBA] Nem találom a CSS fájlokat.")

def minify_html_files():
    print("\n--- 2. HTML fájlok tömörítése és tisztítása ---")
    count = 0
    
    # Minta a FontAwesome link eltávolítására (mivel már beolvasztottuk)
    fa_pattern = r'<link[^>]*href=["\'][^"\']*font-awesome\.min\.css[^"\']*["\'][^>]*>'
    
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_len = len(content)
                
                # 1. FontAwesome link törlése
                content = re.sub(fa_pattern, '', content)
                
                # 2. Kommentek törlése (kivéve a kondicionális kommenteket, ha lennének)
                # Vigyázunk, hogy a scriptben lévő dolgokat ne bántsuk
                content = re.sub(r'', '', content, flags=re.DOTALL)
                
                # 3. Felesleges szóközök és sortörések törlése (Minifikálás)
                # Ez egy óvatos regex, ami a tag-ek közötti whitespace-t szedi ki
                content = re.sub(r'>\s+<', '><', content)
                
                # 4. Több üres sor cseréje egyre
                content = re.sub(r'\n\s*\n', '\n', content)
                
                new_len = len(content)
                
                if new_len < original_len:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"  [Tömörítve] {file} ({original_len} -> {new_len} bájt)")
                    count += 1
                else:
                    print(f"  [Skipped] {file} (Nem változott)")

    print(f"\nKÉSZ! {count} fájl mérete csökkent.")

if __name__ == "__main__":
    merge_font_awesome()
    minify_html_files()