import os
import re

ROOT_DIR = '.'

# Azonosítók (a HTML-ből)
GA_ID = 'G-PFEBR9S81H'
ADS_ID = 'AW-17214149386'
GTM_ID = 'GTM-N58PZGG2'

# Az új "Super-Loader" blokk (Késleltetett)
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

        // 2. Google Ads & Analytics Config
        window.dataLayer = window.dataLayer || [];
        function gtag(){{dataLayer.push(arguments);}}
        gtag('js', new Date());
        gtag('config', '{ADS_ID}'); 
        gtag('config', '{GA_ID}');
    }}

    // Késleltetett betöltés (3.5 mp vagy interakció)
    window.addEventListener('mousemove', loadAllTracking, {{once:true}});
    window.addEventListener('scroll', loadAllTracking, {{once:true}});
    window.addEventListener('touchstart', loadAllTracking, {{once:true}});
    setTimeout(loadAllTracking, 3500); 
</script>
"""

def clean_and_optimize_js():
    print("Google scriptek takarítása...")
    
    # 1. Regex minták a törlendő kódokhoz (GTM, Ads, Analytics)
    patterns_to_remove = [
        r'<script>\s*\(function\(w,d,s,l,i\).*?GTM-.*?\)\(window,\s*document,\s*\'script\',\s*\'dataLayer\',.*?/script>',
        r'<script[^>]*src="[^"]*googletagmanager\.com/gtag/js\?id=AW-[^"]*"[^>]*>\s*</script>',
        r'<script[^>]*src="[^"]*googletagmanager\.com/gtag/js\?id=G-[^"]*"[^>]*>\s*</script>',
        r'<script>\s*window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];\s*function\s*gtag\(\).*?gtag\(\'config\',\s*[\'"](AW-|G-).*?/script>'
    ]

    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content

                # Törlés
                for pattern in patterns_to_remove:
                    content = re.sub(pattern, '', content, flags=re.DOTALL | re.IGNORECASE)

                # Beszúrás a head elejére
                if "loadAllTracking" not in content:
                    if '<meta charset="utf-8" />' in content:
                        content = content.replace('<meta charset="utf-8" />', '<meta charset="utf-8" />\n' + SUPER_LOADER_BLOCK)
                    elif '<head>' in content:
                        content = content.replace('<head>', '<head>\n' + SUPER_LOADER_BLOCK)

                content = re.sub(r'\n\s*\n\s*\n', '\n', content)

                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"  [JAVÍTVA] {file}")

if __name__ == "__main__":
    clean_and_optimize_js()