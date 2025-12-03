import os
import json

# A mappa, ahol az index.html található
ROOT_DIR = '.'
TARGET_FILE = os.path.join(ROOT_DIR, 'index.html')

# 1. A Schema Markup adatstruktúra (JSON-LD)
schema_data = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "HVACBusiness",
            "name": "Klímapajzs - Terra Forte Bau Kft.",
            "image": "https://www.klimapajzs.hu/images/logo.jpg",
            "@id": "https://www.klimapajzs.hu/#organization",
            "url": "https://www.klimapajzs.hu",
            "telephone": "+36704108284",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Somsályfő telep 1.",
                "addressLocality": "Ózd",
                "postalCode": "3662",
                "addressCountry": "HU"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": 48.2167, 
                "longitude": 20.3000
            },
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday"
                ],
                "opens": "08:00",
                "closes": "17:00"
            },
            "priceRange": "$$",
            "sameAs": [
                "https://www.facebook.com/profile.php?id=61577604076573"
            ]
        },
        {
            "@type": "Service",
            "serviceType": "Klímaszerelés és Karbantartás",
            "provider": {
                "@id": "https://www.klimapajzs.hu/#organization"
            },
            "areaServed": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                    "@type": "GeoCoordinates",
                    "latitude": 48.2167,
                    "longitude": 20.3000
                },
                "geoRadius": "30000"
            },
            "description": "Professzionális klímaszerelés, karbantartás és tisztítás Ózdon és vonzáskörzetében. Hivatalos márkaszerviz."
        },
        {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Vállalnak hétvégi kiszállást klímaszerelésre?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Igen, előzetes egyeztetés alapján vállalunk hétvégi munkavégzést is, hogy Önnek ne kelljen szabadságot kivennie."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Mennyibe kerül egy klíma telepítése Ózdon?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Az alapszerelés ára nálunk 85.000 Ft-tól kezdődik, amely tartalmazza a konzolt, a fúrást és 3 méter csövezést."
                    }
                }
            ]
        }
    ]
}

# JSON-LD script blokk előállítása
schema_script = f"""
  <script type="application/ld+json">
  {json.dumps(schema_data, indent=4, ensure_ascii=False)}
  </script>
"""

def add_schema_to_index():
    print("Schema Markup hozzáadása az index.html-hez...")
    
    if not os.path.exists(TARGET_FILE):
        print(f"  [HIBA] Nem található az index.html fájl!")
        return

    with open(TARGET_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Ellenőrzés: Van-e már benne schema?
    if 'application/ld+json' in content and 'HVACBusiness' in content:
        print("  [INFO] A Schema Markup már szerepel a fájlban. Frissítem...")
        # Régi schema törlése (egyszerű regex helyett tartalom alapú csere, ha a blokk egyben van)
        # De mivel most írjuk bele először profin, inkább a </head> elé szúrjuk be.
        # Ha már van, akkor feltételezzük, hogy cserélni akarjuk.
        content = re.sub(r'<script type="application/ld\+json">.*?</script>', '', content, flags=re.DOTALL)
        
    # Beszúrás a </head> záró tag elé
    if '</head>' in content:
        content = content.replace('</head>', f'{schema_script}\n</head>')
        print("  [OK] Schema script beillesztve a fejlécbe.")
    else:
        print("  [HIBA] Nem találom a </head> taget a fájlban.")
        return

    # Mentés
    if content != original_content:
        with open(TARGET_FILE, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  [SIKER] {TARGET_FILE} frissítve a strukturált adatokkal.")
    else:
        print("  [INFO] Nem történt változás.")

import re # Importáljuk a re modult a regexhez

if __name__ == "__main__":
    add_schema_to_index()