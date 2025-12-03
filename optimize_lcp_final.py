import os
import re

TARGET_FILE = 'index.html'

# 1. A Hero kép, amit azonnal le kell tölteni
LCP_IMAGE_URL = "/images/fooldal/55861b79-8947-41e8-88a5-6ad660369282.webp"
PRELOAD_TAG = f'<link rel="preload" href="{LCP_IMAGE_URL}" as="image" fetchpriority="high">'

# 2. Azonosítók a késleltetett méréshez
GA_ID = 'G-PFEBR9S81H'
ADS_ID = 'AW-17214149386'
GTM_ID = 'GTM-N58PZGG2'

# 3. Az új, késleltetett mérőkód blokk
DELAYED_TRACKING_BLOCK = f"""
  <script>
    function loadAllTracking() {{
        if (window.tracking_loaded) return;
        window.tracking_loaded = true;
        // GTM
        (function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':
        new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        }})(window,document,'script','dataLayer','{GTM_ID}');
        
        // Ads & Analytics Config
        window.dataLayer = window.dataLayer || [];
        function gtag(){{dataLayer.push(arguments);}}
        gtag('js', new Date());
        gtag('config', '{ADS_ID}'); 
        gtag('config', '{GA_ID}');
    }}
    // Csak interakcióra vagy 3.5mp után indul el
    window.addEventListener('mousemove', loadAllTracking, {{once:true}});
    window.addEventListener('scroll', loadAllTracking, {{once:true}});
    window.addEventListener('touchstart', loadAllTracking, {{once:true}});
    setTimeout(loadAllTracking, 3500);
  </script>
"""

def optimize_index_lcp():
    print(f"LCP optimalizálás indítása a {TARGET_FILE} fájlon...")
    
    if not os.path.exists(TARGET_FILE):
        print(f"HIBA: Nincs meg a {TARGET_FILE}!")
        return

    with open(TARGET_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # --- 1. LÉPÉS: Preload beszúrása ---
    if LCP_IMAGE_URL not in content or 'rel="preload"' not in content:
        if '<meta charset="utf-8" />' in content:
            content = content.replace('<meta charset="utf-8" />', f'<meta charset="utf-8" />\n  {PRELOAD_TAG}')
        elif '<head>' in content:
            content = content.replace('<head>', f'<head>\n  {PRELOAD_TAG}')
        print("  [OK] Preload sor beszúrva.")

    # --- 2. LÉPÉS: Régi Google kódok törlése és csere ---
    # Töröljük a GTM, Gtag (Ads), Gtag (Analytics) blokkokat
    patterns_to_remove = [
        r'<script>\(function\s*\(w,\s*d,\s*s,\s*l,\s*i\).*?GTM-.*?\)\(window,\s*document,\s*\'script\',\s*\'dataLayer\',.*?/script>',
        r'.*?',
        r'<script async src=".*?googletagmanager\.com/gtag/js\?id=AW-.*?".*?></script>',
        r'<script async src=".*?googletagmanager\.com/gtag/js\?id=G-.*?".*?></script>',
        r'<script>\s*window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];\s*function\s*gtag\(\).*?gtag\(\'config\'.*?</script>'
    ]

    for p in patterns_to_remove:
        content = re.sub(p, '', content, flags=re.DOTALL | re.IGNORECASE)

    # Beszúrjuk az újat a </head> elé (ha még nincs benne)
    if "loadAllTracking" not in content:
        content = content.replace('</head>', f'{DELAYED_TRACKING_BLOCK}\n</head>')
        print("  [OK] Követőkódok cserélve késleltetett verzióra.")

    # --- 3. LÉPÉS: JS Defer hozzáadása ---
    # Minden <script src="..."> kapjon defer-t, ha nincs neki
    # Kivéve a mi tracking scriptünket (ami inline)
    script_pattern = r'(<script\s+[^>]*src=["\'][^"\']*["\'][^>]*)>'
    
    def add_defer(match):
        tag = match.group(1)
        if 'defer' not in tag and 'async' not in tag:
            return tag + ' defer>'
        return match.group(0)

    content = re.sub(script_pattern, add_defer, content, flags=re.IGNORECASE)
    print("  [OK] 'defer' attribútum hozzáadva a scriptekhez.")

    # Mentés
    content = re.sub(r'\n\s*\n\s*\n', '\n', content) # Üres sorok takarítása
    
    if content != original_content:
        with open(TARGET_FILE, 'w', encoding='utf-8') as f:
            f.write(content)
        print("\nSIKER! Az index.html frissítve. Töltsd fel a szerverre!")
    else:
        print("\nNem történt változás (már optimalizálva van?).")

if __name__ == "__main__":
    optimize_index_lcp()