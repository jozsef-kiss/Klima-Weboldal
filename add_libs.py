import os
import re

# Ezt a blokkot szúrjuk be
LIBS_TO_INSERT = """
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
"""

def fix_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Ellenőrizzük, hogy nincs-e már benne (hogy ne szúrjuk be kétszer)
    if "email.min.js" in content:
        print(f"Kihagyva (már tartalmazza): {file_path}")
        return

    # Megkeressük a custom.js-t behívó sort (bármilyen mappamélységben van)
    # A regex figyeli a src="..." részt, ami js/custom.js-re végződik
    pattern = r'(<script src=".*?js/custom\.js.*?"></script>)'
    
    # Ha megtaláljuk, elé szúrjuk a könyvtárakat
    if re.search(pattern, content):
        new_content = re.sub(pattern, f"{LIBS_TO_INSERT}\\1", content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Frissítve: {file_path}")
    else:
        print(f"Nem található custom.js hivatkozás: {file_path}")

def main():
    root_dir = os.getcwd()
    print("--- Hiányzó könyvtárak pótlása indítása ---")
    
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(subdir, file)
                fix_html_file(file_path)
                
    print("--- Kész! ---")

if __name__ == "__main__":
    main()