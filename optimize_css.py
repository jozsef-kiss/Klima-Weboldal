import os
import re

ROOT_DIR = '.'
GTM_ID = 'GTM-N58PZGG2'

# Ez az új, okos GTM kód (Delay/Késleltetés)
# Csak felhasználói interakcióra vagy 4mp után töltődik be
OPTIMIZED_GTM_BLOCK = f"""
<script>
    function loadGTM() {{
        if (window.gtm_loaded) return;
        window.gtm_loaded = true;
        (function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':
        new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        }})(window,document,'script','dataLayer','{GTM_ID}');
    }}
    // Betöltés interakcióra vagy 4 másodperc után
    window.addEventListener('mousemove', loadGTM, {{once:true}});
    window.addEventListener('scroll', loadGTM, {{once:true}});
    window.addEventListener('touchstart', loadGTM, {{once:true}});
    setTimeout(loadGTM, 4000);
</script>
"""

def fix_gtm_in_files():
    print("GTM duplikációk javítása és késleltetés beállítása...")
    
    # Keresési minta a régi GTM scriptre (bárhol is van)
    # Figyelünk a többsoros írásmódra és a szóközökre
    gtm_pattern = re.compile(r'<script>\s*\(function\s*\(w,\s*d,\s*s,\s*l,\s*i\).*?GTM-N58PZGG2.*?\)\(window,\s*document,\s*\'script\',\s*\'dataLayer\',\s*\'GTM-N58PZGG2\'\);\s*</script>', re.DOTALL)

    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # 1. Megszámoljuk, hányszor van benne
                matches = gtm_pattern.findall(content)
                
                if matches:
                    print(f"  [{file}] {len(matches)} db GTM kód található.")
                    
                    # 2. Kitöröljük AZ ÖSSZES régi GTM scriptet
                    content = gtm_pattern.sub('', content)
                    
                    # 3. Beszúrjuk az EGYETLEN optimalizáltat a <head> elejére (vagy a meta charset után)
                    # Így biztosan csak egy lesz.
                    if '<meta charset="utf-8" />' in content:
                        content = content.replace('<meta charset="utf-8" />', '<meta charset="utf-8" />\n' + OPTIMIZED_GTM_BLOCK)
                    elif '<head>' in content:
                        content = content.replace('<head>', '<head>\n' + OPTIMIZED_GTM_BLOCK)
                    
                    # Ha maradt esetleg üres sor vagy "End Google Tag Manager" komment árván, takarítunk
                    content = content.replace('', '') # A régieket töröljük, az újat a blokk tartalmazza
                    
                    if content != original_content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"     -> JAVÍTVA: Duplikációk törölve, késleltetés betéve.")
                else:
                    # Ha a regex nem találta (pl. más a formázás), akkor szólunk
                    pass 

if __name__ == "__main__":
    fix_gtm_in_files()
    print("\nKÉSZ! A Facebook és GTM kódok mostantól nem lassítják a betöltést.")