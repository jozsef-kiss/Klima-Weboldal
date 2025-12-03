import os
import re

def main():
    print("--- KEP LAZY LOADING OPTIMALIZALO START ---")
    root_dir = '.'
    
    # Keresesi minta: <img ... >
    img_pattern = re.compile(r'<img\s+([^>]+)>', re.IGNORECASE)
    
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(subdir, file)
                
                try:
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                    
                    # Ha nincs benne kep, atugorjuk
                    if "<img" not in content:
                        continue

                    # Segedvaltozok a cserehez
                    count = 0
                    modified_file = False
                    
                    def replace_img(match):
                        nonlocal count, modified_file
                        full_tag = match.group(0)
                        attrs = match.group(1)
                        
                        count += 1
                        
                        # 1. Ha mar van benne loading="..." akkor NE nyuljunk hozza
                        if "loading=" in full_tag:
                            return full_tag
                            
                        # 2. AZ ELSO 2 KEPET (Logo, Fejlec) NE BANTSUK! 
                        # (Hogy ne lassuljon az oldal tetejenek megjelenese - LCP)
                        if count <= 2:
                            return full_tag
                        
                        # 3. Minden mas kephez adjuk hozza a loading="lazy"-t
                        modified_file = True
                        # Egyszeruen a tag vegere szurjuk be
                        return f'<img loading="lazy" {attrs}>'

                    # Vegrehajtjuk a cseret a fajl tartalman
                    new_content = img_pattern.sub(replace_img, content)
                    
                    if modified_file:
                        print(f"[FIX] Lazy loading hozzadva: {filepath}")
                        with open(filepath, "w", encoding="utf-8") as f:
                            f.write(new_content)
                            
                except Exception as e:
                    print(f"Hiba a {filepath} fajlnal: {e}")

    print("--- KESZ! A kepek mostantol hatekonyan toltenek. ---")

if __name__ == "__main__":
    main()