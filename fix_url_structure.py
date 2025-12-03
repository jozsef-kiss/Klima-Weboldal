import os
import re

ROOT_DIR = '.'

# Mit mire cserélünk
OLD_FILENAME = 'szolgaltatasink.html'
NEW_FILENAME = 'klima-szolgaltatasok-ozd.html'

def fix_url_structure():
    print(f"URL struktúra javítása: {OLD_FILENAME} -> {NEW_FILENAME}...")
    
    # 1. Fájl átnevezése
    old_path = os.path.join(ROOT_DIR, OLD_FILENAME)
    new_path = os.path.join(ROOT_DIR, NEW_FILENAME)
    
    if os.path.exists(old_path):
        try:
            os.rename(old_path, new_path)
            print(f"  [SIKER] Fájl átnevezve: {NEW_FILENAME}")
        except Exception as e:
            print(f"  [HIBA] Nem sikerült átnevezni: {e}")
    elif os.path.exists(new_path):
        print(f"  [INFO] A fájl már át van nevezve ({NEW_FILENAME}).")
    else:
        print(f"  [HIBA] Nem találom a {OLD_FILENAME} fájlt!")

    # 2. Linkek frissítése az összes HTML fájlban
    print("\nLinkek frissítése a HTML fájlokban...")
    updated_count = 0
    
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # Csere a tartalomban (figyelembe véve a / jelet és anélkül is)
                # Ez cseréli a href="szolgaltatasink.html"-t href="klima-szolgaltatasok-ozd.html"-re
                content = content.replace(OLD_FILENAME, NEW_FILENAME)
                
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"  [JAVÍTVA] {file} - Linkek frissítve.")
                    updated_count += 1
    
    print(f"\nKÉSZ! {updated_count} fájlban javítottuk a hivatkozásokat.")

if __name__ == "__main__":
    fix_url_structure()