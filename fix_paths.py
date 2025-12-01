import os
import re

# A mappák, amikre a hivatkozásokat javítani kell
TARGET_FOLDERS = ['css', 'js', 'images']

def get_correct_prefix(file_path, root_dir):
    """Kiszámolja, hány mappát kell visszalépni a gyökérhez."""
    rel_path = os.path.relpath(file_path, root_dir)
    depth = rel_path.count(os.sep)
    return "../" * depth

def fix_html_file(file_path, root_dir):
    """Kijavítja a linkeket egy HTML fájlban."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    correct_prefix = get_correct_prefix(file_path, root_dir)
    
    # Ez a regex megkeresi a href="..." vagy src="..." részeket, 
    # amik ../../-el, ../-el vagy simán a mappanevekkel kezdődnek.
    # Csak a css, js és images mappákra vonatkozik.
    pattern = r'(href|src)=["\'](?:\.\./)*(css|js|images)/'
    
    # A csere logika: beilleszti a helyes prefixet (pl. "../" vagy semmi)
    replacement = r'\1="{} \2/'.format(correct_prefix).replace(' ', '')
    
    new_content = re.sub(pattern, replacement, content)

    # Ha változott a fájl, elmentjük
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Javítva: {file_path} -> Prefix: '{correct_prefix}'")

def main():
    root_dir = os.getcwd() # A jelenlegi mappa a gyökér
    
    print("--- Linkek javítása indítása ---")
    
    # Végigmegyünk az összes mappán és fájlon
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(subdir, file)
                fix_html_file(file_path, root_dir)
                
    print("--- Kész! Minden fájl frissítve. ---")

if __name__ == "__main__":
    main()