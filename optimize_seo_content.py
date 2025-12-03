import os
import re

# A mappa, ahol a fájlok vannak
ROOT_DIR = '.'

# A SEO Audit alapján összeállított új adatok
SEO_DATA = {
    'index.html': {
        'title': 'Klímaszerelés és Karbantartás Ózd | Klímapajzs',
        'description': 'Professzionális klímaszerelés Ózdon 85.000 Ft-tól. Ingyenes felmérés, tiszta munka, garancia. Hivatalos márkaszerviz: Gree, Fisher, Fujitsu. Hívjon: +36 70 410 8284.',
        'h1': 'Professzionális Klímaszerelés és Karbantartás Ózdon'
    },
    'szolgaltatasink.html': {
        'title': 'Klíma Telepítés, Javítás és Tisztítás | Szolgáltatásaink',
        'description': 'Teljeskörű klímatechnikai szolgáltatások Ózd és vonzáskörzetében. Telepítés, karbantartás, tisztítás és javítás rejtett költségek nélkül.',
        'h1': 'Szolgáltatásaink - Klímaszerelés és Karbantartás'
    },
    'klimaberendezesek.html': {
        'title': 'Eladó Klímák és Hőszivattyúk | Klímaberendezések',
        'description': 'Minőségi hűtő-fűtő klímák széles választéka. Gree, Syen, Fisher, Fujitsu és más márkák hivatalos forgalmazása garanciával.',
        'h1': 'Minőségi Klímaberendezések és Hőszivattyúk'
    },
    'arakesinformaciok.html': {
        'title': 'Klímaszerelés Árak 2025 | Árak és Információk',
        'description': 'Átlátható klímaszerelés árak Ózdon. Alapszerelés 85.000 Ft-tól. Tájékozódjon a telepítési és karbantartási díjainkról.',
        'h1': 'Klímaszerelés Árak és Fontos Információk'
    },
    'contact.html': {
        'title': 'Kapcsolat és Ajánlatkérés | Klímapajzs Ózd',
        'description': 'Lépjen kapcsolatba velünk! Ingyenes helyszíni felmérés kérése, időpontfoglalás klímaszerelésre. Telefon: +36 70 410 8284.',
        'h1': 'Lépjen Kapcsolatba Velünk'
    },
    'rolunk.html': {
        'title': 'Bemutatkozás - Terra Forte Bau Kft. | Rólunk',
        'description': 'Ismerje meg a Klímapajzs csapatát. Helyi szakemberek, megbízható munkavégzés, elégedett ügyfelek Ózdon és környékén.',
        'h1': 'Rólunk - A Klímapajzs Csapata'
    },
    'tippekestanacsok.html': {
        'title': 'Klíma Tippek és Tanácsok | Szakértői Blog',
        'description': 'Hasznos tippek klímavásárláshoz, karbantartáshoz és használathoz. Spóroljon energiát és növelje klímája élettartamát tanácsainkkal.',
        'h1': 'Hasznos Tippek és Tanácsok Klímatulajdonosoknak'
    },
    'onlinefelmeres.html': {
        'title': 'Online Klíma Felmérés | Gyors Ajánlatkérés',
        'description': 'Kérjen gyors árajánlatot online! Töltse ki űrlapunkat, és mi felvesszük Önnel a kapcsolatot a legmegfelelőbb klíma ajánlattal.',
        'h1': 'Online Helyszíni Felmérés'
    },
    'felmeres.html': {
        'title': 'Ingyenes Helyszíni Felmérés | Klímapajzs',
        'description': 'Kérjen ingyenes helyszíni felmérést klímaszerelés előtt Ózdon! Szakértői tanácsadás a helyszínen, rejtett költségek nélkül.',
        'h1': 'Ingyenes Helyszíni Felmérés Kérése'
    }
}

def optimize_seo_content():
    print("SEO tartalmi optimalizálás indítása...")
    updated_files = 0

    for filename, data in SEO_DATA.items():
        filepath = os.path.join(ROOT_DIR, filename)
        
        if not os.path.exists(filepath):
            print(f"  [HIBA] Nem található: {filename}")
            continue

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content

        # 1. Title csere
        # Megkeressük a <title>...</title> részt és kicseréljük
        if '<title>' in content:
            content = re.sub(r'<title>.*?</title>', f'<title>{data["title"]}</title>', content, flags=re.DOTALL)
        else:
            # Ha nincs title, beszúrjuk a head elejére
            content = content.replace('<head>', f'<head>\n  <title>{data["title"]}</title>')

        # 2. Meta Description csere
        # Két eset lehet: vagy van már description, vagy nincs
        if 'meta name="description"' in content:
            # Ha van, kicseréljük a content tartalmát
            content = re.sub(r'<meta name="description"\s+content="[^"]*"', f'<meta name="description" content="{data["description"]}"', content)
            # Ha esetleg fordított a sorrend (content előbb), arra is figyelünk (egyszerűsített regex)
        else:
            # Ha nincs, beszúrjuk a <head>-be vagy a title után
            if '</title>' in content:
                content = content.replace('</title>', f'</title>\n  <meta name="description" content="{data["description"]}" />')
            elif '<head>' in content:
                content = content.replace('<head>', f'<head>\n  <meta name="description" content="{data["description"]}" />')

        # 3. H1 csere
        # A H1-nek lehetnek osztályai (pl. class="h1-box-center"), ezért a regexnek rugalmasnak kell lennie
        # Megkeressük a > és < közötti szöveget a h1 tagben
        if '<h1' in content:
            content = re.sub(r'(<h1[^>]*>)(.*?)(</h1>)', f'\\1{data["h1"]}\\3', content, flags=re.DOTALL)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  [OK] Frissítve: {filename}")
            updated_files += 1
        else:
            print(f"  [INFO] Nem változott (már friss?): {filename}")

    print(f"\nKÉSZ! {updated_files} fájl SEO adatai frissítve a PDF audit alapján.")

if __name__ == "__main__":
    optimize_seo_content()