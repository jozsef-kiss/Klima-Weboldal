import os
import shutil
from bs4 import BeautifulSoup

# Ebben a mappában keresi a fájlokat (jelenlegi mappa)
directory = "."

def swap_footer_columns():
    print("--- Footer Oszlop Csere Script Indítása ---")
    
    # Végigmegyünk az összes fájlon a mappában
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            filepath = os.path.join(directory, filename)
            print(f"Feldolgozás: {filename}...")

            try:
                # 1. Biztonsági mentés készítése (.bak kiterjesztéssel)
                shutil.copy(filepath, filepath + ".bak")

                # 2. Fájl beolvasása
                with open(filepath, "r", encoding="utf-8") as f:
                    soup = BeautifulSoup(f, "html.parser")

                # 3. Megkeressük a releváns oszlopokat a h4 címek alapján
                # Megkeressük az "Oldalak" oszlopot (ami most a 3.)
                col_oldalak = None
                h4_oldalak = soup.find("h4", string=lambda t: t and "Oldalak" in t)
                if h4_oldalak:
                    # Megkeressük a szülő col-md-6 elemet (három szinttel feljebb szokott lenni: h4 -> info_link_box -> col)
                    col_oldalak = h4_oldalak.find_parent("div", class_="col-md-6")

                # Megkeressük a "Kiemelt Területek" oszlopot (ami most a 4.)
                col_kiemelt = None
                h4_kiemelt = soup.find("h4", string=lambda t: t and "Kiemelt Területek" in t)
                if h4_kiemelt:
                    col_kiemelt = h4_kiemelt.find_parent("div", class_="col-md-6")

                # 4. Ha mindkettő megvan, megcseréljük őket
                if col_oldalak and col_kiemelt:
                    # A logika: A "Kiemelt" oszlopot beszúrjuk az "Oldalak" elé.
                    # Mivel a DOM-ban mozgatjuk, ez effektíve kiveszi a helyéről és átrakja.
                    col_oldalak.insert_before(col_kiemelt)
                    
                    # 5. Módosítások mentése az eredeti fájlba
                    # A formatter="minimal" segít, hogy ne rontsa el nagyon a formázást
                    with open(filepath, "w", encoding="utf-8") as f_out:
                        f_out.write(str(soup.prettify()))
                    
                    print(f" -> SIKER: Oszlopok felcserélve ebben: {filename}")
                else:
                    print(f" -> Kihagyva: Nem található meg mindkét oszlop a footerben.")

            except Exception as e:
                print(f" -> HIBA történt a {filename} fájlnál: {e}")

    print("--- Kész! ---")

if __name__ == "__main__":
    swap_footer_columns()