import os
import re

ROOT_DIR = '.'

def add_defer_to_scripts():
    print("JavaScript 'defer' attribútum hozzáadása...")
    count = 0
    
    # Ezekhez a scriptekhez adjuk hozzá a defer-t
    scripts_to_defer = [
        'jquery',
        'bootstrap',
        'custom',
        'quote',
        'filter',
        'contact',
        'cloudinary',
        'axios',
        'email'
    ]

    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # Végigmegyünk a script tag-eken
                # <script src="..."> -> <script src="..." defer>
                
                # Regex magyarázat: Megkeresi a <script src="..."> taget, amiben nincs még 'defer'
                # és a fenti listában lévő fájlnevek valamelyike szerepel benne.
                
                for script_name in scripts_to_defer:
                    pattern = r'(<script\s+[^>]*src=["\'][^"\']*' + script_name + r'[^"\']*["\'])(?![^>]*\sdefer)([^>]*>)'
                    
                    # Csere: hozzáadjuk a 'defer' szót
                    # \1 = a tag eleje és az src rész
                    # \2 = a tag vége
                    content = re.sub(pattern, r'\1 defer\2', content, flags=re.IGNORECASE)

                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"  [Frissítve] {file}")
                    count += 1
    
    print(f"\nKÉSZ! {count} fájlban módosítva a JavaScript betöltés.")

if __name__ == "__main__":
    add_defer_to_scripts()