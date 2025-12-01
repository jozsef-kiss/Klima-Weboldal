import os
import re

# --- BEÁLLÍTÁSOK ---
ROOT_DIR = '.'

# Ezt szúrjuk be a HTML <head> részébe
FONT_HTML = """
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
"""

def fix_html_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        modified = False

        # 1. Google Fonts potlasa
        # Csak akkor tesszuk be, ha nincs meg benne, de van </head> lezaras
        if "family=Poppins" not in content and "</head>" in content:
            # Ha van style.css link, ele szurjuk
            if '<link rel="stylesheet"' in content:
                content = content.replace('<link rel="stylesheet"', FONT_HTML + '\n  <link rel="stylesheet"', 1)
            else:
                # Ha nincs, a head vegebe
                content = content.replace('</head>', FONT_HTML + '\n</head>')
            modified = True

        # 2. Dupla meresek kikapcsolasa (Analytics)
        # Ezeket a mintakat keressuk
        p1 = r'(<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-PFEBR9S81H".*?</script>.*?<script>.*?gtag\(\'config\', \'G-PFEBR9S81H\'\);.*?</script>)'
        p2 = r'(<script async src="https://www\.googletagmanager\.com/gtag/js\?id=AW-17214149386".*?</script>.*?<script>.*?gtag\(\'config\', \'AW-17214149386\'\);.*?</script>)'
        
        patterns = [p1, p2]

        for p in patterns:
            # Megkeressuk az osszes elofordulast
            matches = re.findall(p, content, re.DOTALL | re.IGNORECASE)
            for m in matches:
                # Ha meg nincs kikommentelve, megtesszuk
                if "":
                    content = content.replace(m, replacement)
                    modified = True

        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"OK: {file_path}")

    except Exception as e:
        print(f"HIBA: {file_path} -> {e}")

def fix_css_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()

        new_lines = []
        modified = False

        for line in lines:
            # Ha megtalaljuk a lassito sort, kihagyjuk
            if "@import url" in line and "family=Poppins" in line:
                print(f"  [FIX] CSS import torolve: {file_path}")
                modified = True
                continue
            new_lines.append(line)

        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
            print(f"OK CSS: {file_path}")

    except Exception as e:
        print(f"HIBA CSS: {file_path} -> {e}")

# --- FOPROGRAM ---
print("--- START ---")

for root, dirs, files in os.walk(ROOT_DIR):
    for file in files:
        full_path = os.path.join(root, file)
        
        if file.lower().endswith(".html"):
            fix_html_file(full_path)
        
        elif file.lower() == "style.css":
            fix_css_file(full_path)

print("--- KESZ ---")