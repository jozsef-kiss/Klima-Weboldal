import os
import re

# --- AZ ÚJ FOOTER (A City Page linkekkel) ---
UJ_FOOTER = """<div class="footer_container">
      <section class="info_section">
        <div class="container">
          <div class="row">
            <div class="col-md-6 col-lg-3 mb-0 ml-auto">
              <div class="info_contact">
                <h4>Cím</h4>
                <div class="contact_link_box">
                  <a href="">
                    <span> Terra Forte Bau Kft. </span>
                  </a>
                  <a href="">
                    <span> 3662 Ózd-Somsályfő Telep 1. </span>
                  </a>
                  <a href="">
                    <span> Magyarország </span>
                  </a>
                  <a href="">
                    <span> Adószám: 23954780-2-05 </span>
                  </a>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 mb-0 ml-auto">
              <div class="info_contact">
                <h4>Elérhetőség</h4>
                <div class="contact_link_box">
                  <a href="tel:+36704108284">
                    <span> +36 70 410 8284 </span>
                  </a>
                  <a href="tel:+3648786590">
                    <span> +36 48 786 590 </span>
                  </a>
                  <a href="mailto:info@klimapajzs.hu">
                    <span> info@klimapajzs.hu </span>
                  </a>
                </div>
              </div>
              <div class="info_social">
                <a href="https://www.facebook.com/profile.php?id=61577604076573">
                  <i class="fa fa-facebook" aria-hidden="true"></i>
                </a>
              </div>
            </div>
            <div class="col-md-6 col-lg-2 mx-auto">
              <div class="info_link_box">
                <h4>Oldalak</h4>
                <div class="info_links">
                  <a class="" href="/rolunk.html"> Rólunk </a>
                  <a class="" href="/klima-szolgaltatasok-ozd.html">Szolgáltatásaink</a>
                  <a class="" href="/klimaberendezesek.html">Klímaberendezések</a>
                  <a class="" href="/tippekestanacsok.html">Tippek és tanácsok</a>
                  <a class="" href="/contact.html"> Kapcsolat </a>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-2 mx-auto">
              <div class="info_link_box">
                <h4>Kiemelt Területek</h4>
                <div class="info_links">
                  <a href="/klimaszereles-arlo.html">Klímaszerelés Arló</a>
                  <a href="/klimaszereles-putnok.html">Klímaszerelés Putnok</a>
                  <a href="/klimaszereles-borsodnadasd.html">Klíma Borsodnádasd</a>
                  <a href="/klimaszereles-banreve.html">Klímaszerelés Bánréve</a>
                </div>
              </div>
            </div>
            </div>
        </div>
      </section>
      <footer class="footer_section">
        <div class="container text-center">
          <p class="mt-3">&copy; KLÍMAPAJZS 2025</p>
        </div>
      </footer>
      </div>
    """

def safe_replace(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_len = len(content)

        # 1. LÉPÉS: Takarítás (Régi footerek törlése)
        # Megkeressük az összes létező blokkot és töröljük őket
        # A regex non-greedy (.*?), hogy egyesével szedje ki őket, ha több van
        clean_pattern = r'.*?'
        content_cleaned = re.sub(clean_pattern, '', content, flags=re.DOTALL | re.IGNORECASE)

        # 2. LÉPÉS: Beillesztés
        # Megkeressük a </body> taget, és elé szúrjuk be az ÚJ footert
        if '</body>' in content_cleaned:
            final_content = content_cleaned.replace('</body>', UJ_FOOTER + '\n</body>')
            status = "SIKER"
        else:
            # Ha nincs body tag (furcsa), a végére rakjuk
            final_content = content_cleaned + '\n' + UJ_FOOTER
            status = "SIKER (Body tag nélkül)"

        # Csak akkor írunk, ha nem nulláztuk le véletlenül a fájlt
        if len(final_content) > 500: # Biztonsági ellenőrzés: ne legyen túl rövid
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(final_content)
            print(f"[{status}] {os.path.basename(file_path)}")
        else:
            print(f"[HIBA - TÚL RÖVID] {os.path.basename(file_path)} - Nem írtam felül biztonsági okból!")

    except Exception as e:
        print(f"[KRITIKUS HIBA] {file_path}: {e}")

# --- INDÍTÁS ---
print("--- BIZTONSÁGOS FOOTER CSERE INDÍTÁSA ---")
gyoker = os.getcwd()

for root, dirs, files in os.walk(gyoker):
    for file in files:
        if file.endswith(".html"):
            safe_replace(os.path.join(root, file))

print("--- KÉSZ! Ellenőrizd az oldalakat! ---")