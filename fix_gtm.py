import os
import re

def remove_duplicate_gtm(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Ez a minta keresi a GTM script blokkot
    # A re.DOTALL jelzi, hogy a sortöréseket is vegye bele
    pattern = r'\s*<script>.*?GTM-N58PZGG2.*?</script>\s*'
    
    # Megkeressük az összes előfordulást a fájlban
    matches = list(re.finditer(pattern, content, flags=re.DOTALL))
    
    if len(matches) > 1:
        print(f"  [!] Duplikáció találva ({len(matches)} db): {file_path}")
        
        # Az elsőt (matches[0]) békén hagyjuk, mert az a jó (a head-ben).
        # A többit (matches[1:]) töröljük.
        # Fontos: Hátulról visszafelé törlünk, hogy ne csússzanak el a pozíciók.
        new_content = content
        for match in reversed(matches[1:]):
            start, end = match.span()
            # Kivágjuk a szövegből az adott részt
            new_content = new_content[:start] + new_content[end:]
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"      -> Felesleges kódok törölve.")
    else:
        # Ha 0 vagy 1 van benne, akkor nem kell bántani
        pass

def main():
    root_dir = os.getcwd()
    print("--- GTM Duplikációk Javítása Indul ---")
    
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html'):
                remove_duplicate_gtm(os.path.join(subdir, file))
                
    print("--- Kész! ---")

if __name__ == "__main__":
    main()