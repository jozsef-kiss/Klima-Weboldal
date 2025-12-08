import os
from bs4 import BeautifulSoup

# --- A HELYES HTML TARTALMAK ---

# 1. Top Bar tartalma (Felső sáv)
# A stílusokat az index.html alapján állítottam be (color: white)
new_top_bar_html = """
<a href="tel:+3648786590" style="color: white; text-decoration: none">
  <i class="fa fa-phone"> </i>
  +36 48 786 590
</a>
<a href="tel:+36308374346" style="color: white; text-decoration: none">
  <i class="fa fa-phone"> </i>
  +36 30 837 4346
</a>
<span>
  <i class="fa fa-clock-o"> </i>
  Hétfő–Péntek 8:00 – 17:00
</span>
<span>
  <i class="fa fa-envelope"> </i>
  <a href="mailto:info@klimapajzs.hu"> info@klimapajzs.hu </a>
</span>
<span class="top-socials">
  <a href="https://www.facebook.com/profile.php?id=61577604076573">
    <i class="fa fa-facebook"> </i>
  </a>
</span>
"""

# 2. Footer tartalma (Lábléc - Elérhetőség doboz)
# ITT JAVÍTOTTAM A LINKET: A második szám href-je most már a helyes 30-as számra mutat!
new_footer_contact_html = """
<a href="tel:+3648786590">
  <span> +36 48 786 590 </span>
</a>
<a href="tel:+36308374346">
  <span> +36 30 837 4346 </span>
</a>
<a href="mailto:info@klimapajzs.hu">
  <span> info@klimapajzs.hu </span>
</a>
"""

def update_html_files():
    # Végigmegyünk az aktuális mappa összes fájlján
    for filename in os.listdir('.'):
        if filename.endswith('.html'):
            print(f"Feldolgozás: {filename}...")
            
            try:
                with open(filename, 'r', encoding='utf-8') as file:
                    soup = BeautifulSoup(file, 'html.parser')
                
                # --- 1. TOP BAR FRISSÍTÉSE ---
                top_info_div = soup.find('div', class_='top-info-text')
                if top_info_div:
                    # Töröljük a régi tartalmat
                    top_info_div.clear()
                    # Beillesztjük az újat
                    top_nav_soup = BeautifulSoup(new_top_bar_html, 'html.parser')
                    top_info_div.append(top_nav_soup)
                    print(f"  - Top bar frissítve.")
                else:
                    print(f"  - NEM TALÁLHATÓ: top-info-text div")

                # --- 2. FOOTER FRISSÍTÉSE (Elérhetőség) ---
                # Megkeressük a 'h4' elemeket, és kiválasztjuk azt, amiben 'Elérhetőség' van
                headers = soup.find_all('h4')
                footer_updated = False
                for h4 in headers:
                    if "Elérhetőség" in h4.text:
                        # Megkeressük a h4 után következő div-et (contact_link_box)
                        contact_box = h4.find_next_sibling('div', class_='contact_link_box')
                        if contact_box:
                            contact_box.clear()
                            footer_soup = BeautifulSoup(new_footer_contact_html, 'html.parser')
                            contact_box.append(footer_soup)
                            footer_updated = True
                            print(f"  - Footer elérhetőség frissítve.")
                            break # Megtaláltuk, kilépünk a ciklusból
                
                if not footer_updated:
                    print(f"  - NEM TALÁLHATÓ: Footer 'Elérhetőség' szekció")

                # --- MENTÉS ---
                with open(filename, 'w', encoding='utf-8') as file:
                    file.write(str(soup.prettify()))
                
            except Exception as e:
                print(f"HIBA a {filename} fájlnál: {e}")

if __name__ == "__main__":
    update_html_files()
    print("\nKÉSZ! Minden fájl frissítve.")