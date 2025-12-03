import os
import re

ROOT_DIR = '.'

# Ez a blokk kerül be minden oldalba, a megfelelő előtaggal (prefix)
# A {prefix} helyére a script behelyettesíti a "../"-t ahányszor kell
CSS_TEMPLATE = """    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    <noscript>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    </noscript>

    <link href="{prefix}css/font-awesome.min.css?v=2025" rel="stylesheet" />

    <link rel="stylesheet" href="{prefix}css/main.min.css?v=2025" />"""

def fix_css_paths():
    print("CSS útvonalak javítása minden szinten...")
    count = 0

    # Minták, amiket el kell távolítani (a régiek és a hibás újak is)
    patterns_to_remove = [
        r'<link[^>]*href=["\'][^"\']*bootstrap\.css[^"\']*["\'][^>]*>',
        r'<link[^>]*href=["\'][^"\']*style\.css[^"\']*["\'][^>]*>',
        r'<link[^>]*href=["\'][^"\']*responsive\.css[^"\']*["\'][^>]*>',
        r'<link[^>]*href=["\'][^"\']*font-awesome\.min\.css[^"\']*["\'][^>]*>',
        r'<link[^>]*href=["\'][^"\']*main\.min\.css[^"\']*["\'][^>]*>', # A hibásan betett újat is kivesszük
        r'<link[^>]*fonts\.googleapis\.com/css2\?family=Poppins[^"\']*["\'][^>]*>'
    ]

    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                
                # Kiszámoljuk a mélységet a gyökérhez képest
                # pl. index.html -> depth 0
                # pl. termekek/95.html -> depth 1
                rel_path = os.path.relpath(root, ROOT_DIR)
                if rel_path == ".":
                    depth = 0
                else:
                    depth = rel_path.count(os.sep) + 1
                
                # Előállítjuk a prefixet (pl. "", "../", "../../")
                prefix = "../" * depth
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content

                # 1. Takarítás: Kivesszük a régi/hibás linkeket
                for pattern in patterns_to_remove:
                    content = re.sub(pattern, '', content, flags=re.IGNORECASE)
                    # A noscript blokkokat is
                    content = re.sub(r'<noscript>\s*' + pattern + r'\s*</noscript>', '', content, flags=re.IGNORECASE | re.DOTALL)

                # 2. Üres sorok takarítása a head-ben
                content = re.sub(r'\n\s*\n', '\n', content)

                # 3. Az új, helyes blokk összeállítása
                new_block = CSS_TEMPLATE.format(prefix=prefix)

                # 4. Beszúrás a <title> után vagy a </head> elé
                if "</title>" in content:
                    content = content.replace("</title>", "</title>\n" + new_block)
                elif "</head>" in content:
                    content = content.replace("</head>", new_block + "\n</head>")

                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"  [JAVÍTVA] {filepath} (Prefix: '{prefix}')")
                    count += 1
                else:
                    # Ha már jó volt, nem bántjuk
                    pass

    print(f"\nKÉSZ! {count} fájlban javítottuk az útvonalakat.")

if __name__ == "__main__":
    fix_css_paths()