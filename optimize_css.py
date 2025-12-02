import os
import re

ROOT_DIR = '.'

# Azonosítók (a HTML fájljaidból kinyerve)
GA_ID = 'G-PFEBR9S81H'    # Google Analytics
ADS_ID = 'AW-17214149386' # Google Ads
GTM_ID = 'GTM-N58PZGG2'   # Google Tag Manager

# Ez az új "Super-Loader" blokk
# Egy helyen kezeli a GTM-et, az Analytics-et és az Ads-et, mindet késleltetve.
SUPER_LOADER_BLOCK = f"""
<script>
    function loadAllTracking() {{
        if (window.tracking_loaded) return;
        window.tracking_loaded = true;
        console.log("Tracking scripts loaded (Delayed)");

        // 1. Google Tag Manager (GTM)
        (function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':
        new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        }})(window,document,'script','dataLayer','{GTM_ID}');

        // 2. Google Ads & Analytics Config (adatok beküldése a dataLayer-be)
        window.dataLayer = window.dataLayer || [];
        function gtag(){{dataLayer.push(arguments);}}
        gtag('js', new Date());
        gtag('config', '{ADS_ID}'); 
        gtag('config', '{GA_ID}');

        // 3. Opcionális: Ha a GTM nem tölti be a gtag.js-t, itt betölthetjük, 
        // de általában a GTM kezeli. Ha hiányozna a mérés, ezt a sort kell aktiválni:
        // var script = document.createElement('script'); script.src = 'https://www.googletagmanager.com/gtag/js?id={ADS_ID}'; document.head.appendChild(script);
    }}

    // Eseményfigyelők a betöltéshez (interakció vagy 3.5 mp késleltetés)
    window.addEventListener('mousemove', loadAllTracking, {{once:true}});
    window.addEventListener('scroll', loadAllTracking, {{once:true}});
    window.addEventListener('touchstart', loadAllTracking, {{once:true}});
    setTimeout(loadAllTracking, 3500); 
</script>
"""

def clean_and_optimize_js():
    print("Felesleges JS kódok tisztítása és összevonása...")
    
    # 1. Regex minták a törlendő kódokhoz
    patterns_to_remove = [
        # Régi GTM script (bármilyen verzió)
        r'<script>\s*\(function\(w,d,s,l,i\).*?GTM-.*?\)\(window,document,\'script\',\'dataLayer\',.*?/script>',
        # A mi előző "Optimized" GTM blokkunk (ezt cseréljük le az újra)
        r'.*?',
        # Standalone Google Ads script (<script async src="...gtag/js?id=AW..."></script>)
        r'<script[^>]*src="[^"]*googletagmanager\.com/gtag/js\?id=AW-[^"]*"[^>]*>\s*</script>',
        # Standalone Google Analytics script
        r'<script[^>]*src="[^"]*googletagmanager\.com/gtag/js\?id=G-[^"]*"[^>]*>\s*</script>',
        # A hozzájuk tartozó inline config scriptek (window.dataLayer = ... gtag('config' ...))
        r'<script>\s*window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];\s*function\s*gtag\(\).*?gtag\(\'config\',\s*[\'"](AW-|G-).*?/script>'
    ]

    count_files = 0
    
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content

                # 2. Töröljük a régi/felesleges kódokat
                for pattern in patterns_to_remove:
                    content = re.sub(pattern, '', content, flags=re.DOTALL | re.IGNORECASE)

                # 3. Beszúrjuk az ÚJ Super-Loadert a <head>-be (ha még nincs benne)
                if "loadAllTracking" not in content:
                    if '<meta charset="utf-8" />' in content:
                        content = content.replace('<meta charset="utf-8" />', '<meta charset="utf-8" />\n' + SUPER_LOADER_BLOCK)
                    elif '<head>' in content:
                        content = content.replace('<head>', '<head>\n' + SUPER_LOADER_BLOCK)

                # 4. Cookiebot DEFER hozzáadása (ha van Cookiebot script)
                # Megkeressük a Cookiebot scriptet és hozzáadjuk a defer-t, ha nincs ott
                if 'cookiebot.com' in content and 'defer' not in content:
                     content = re.sub(r'(<script[^>]*src="[^"]*cookiebot\.com[^"]*")(?![^>]*defer)', r'\1 defer', content)

                # Takarítás: üres sorok törlése, ami a törlés után maradt
                content = re.sub(r'\n\s*\n\s*\n', '\n', content)

                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"  [JAVÍTVA] {file}")
                    count_files += 1

    print(f"\nKÉSZ! {count_files} fájlban tisztítottuk ki a követőkódokat.")
    print("Mostantól csak EGYETLEN, késleltetett script kezeli a GTM-et, Ads-et és Analytics-et.")

if __name__ == "__main__":
    clean_and_optimize_js()