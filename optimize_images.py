import os
import requests
import re

# Beállítások
ROOT_DIR = '.'
JS_DIR = 'js'
LIBS_TO_DOWNLOAD = {
    'axios.min.js': 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
    'email.min.js': 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
}

def download_files():
    print("--- 1. Külső könyvtárak letöltése ---")
    if not os.path.exists(JS_DIR):
        os.makedirs(JS_DIR)
        
    for filename, url in LIBS_TO_DOWNLOAD.items():
        filepath = os.path.join(JS_DIR, filename)
        print(f"Letöltés: {url} -> {filepath}")
        try:
            response = requests.get(url)
            if response.status_code == 200:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(response.text)
            else:
                print(f"HIBA: Nem sikerült letölteni: {url}")
        except Exception as e:
            print(f"HIBA: {e}")

def get_relative_js_path(html_path):
    """Kiszámolja, hogyan érjük el a js mappát az adott html fájlból"""
    # Megszámoljuk, milyen mélyen vagyunk a gyökérhez képest
    # pl. ./index.html -> 0 szint -> js/
    # pl. ./termekek/95.html -> 1 szint -> ../js/
    
    rel_path = os.path.relpath(html_path, ROOT_DIR)
    depth = rel_path.count(os.sep)
    
    if depth == 0:
        return "js/"
    else:
        return "../" * depth + "js/"

def update_html_files():
    print("\n--- 2. HTML fájlok frissítése ---")
    
    # Keresési minták a CDN linkekhez
    patterns = {
        'axios': r'<script[^>]*src=["\'].*axios\.min\.js["\'][^>]*></script>',
        'emailjs': r'<script[^>]*src=["\'].*email\.min\.js["\'][^>]*></script>'
    }

    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                js_prefix = get_relative_js_path(filepath)
                
                # Axios cseréje
                if "cdn.jsdelivr.net" in content and "axios" in content:
                    content = re.sub(
                        patterns['axios'], 
                        f'<script src="{js_prefix}axios.min.js"></script>', 
                        content
                    )

                # EmailJS cseréje
                if "cdn.jsdelivr.net" in content and "email.min.js" in content:
                    content = re.sub(
                        patterns['emailjs'], 
                        f'<script type="text/javascript" src="{js_prefix}email.min.js"></script>', 
                        content
                    )

                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"  [Frissítve] {file}")

if __name__ == "__main__":
    download_files()
    update_html_files()
    print("\nKÉSZ! Ne felejtsd el feltölteni a 'js' mappát (az új fájlokkal) és a HTML fájlokat!")