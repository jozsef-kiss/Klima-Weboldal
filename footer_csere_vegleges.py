import os
import re

# --- EZT A FOOTERT FOGJA MINDENHOVA BETENNI (Amit küldtél) ---
UJ_FOOTER_HTML = """<div class="footer_container">
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

# --- SCRIPT INDÍTÁSA ---
print("--- EGYSZERŰ FOOTER CSERE INDÍTÁSA ---")

gyoker_konyvtar = os.getcwd()
szamlalo = 0

for root, dirs, files in os.walk(gyoker_konyvtar):
    for file in files:
        if file.endswith(".html"):
            fajl_utvonal = os.path.join(root, file)
            
            try:
                # Fájl beolvasása
                with open(fajl_utvonal, 'r', encoding='utf-8') as f:
                    tartalom = f.read()
                
                # KERESÉS ÉS CSERE
                # Megkeresi a és közötti részt
                pattern = r'.*?'
                
                # Ha talál ilyet, lecseréli az újra
                if re.search(pattern, tartalom, flags=re.DOTALL):
                    uj_tartalom = re.sub(pattern, UJ_FOOTER_HTML, tartalom, flags=re.DOTALL)
                    
                    # Csak akkor írunk, ha változott
                    if uj_tartalom != tartalom:
                        with open(fajl_utvonal, 'w', encoding='utf-8') as f:
                            f.write(uj_tartalom)
                        print(f"[OK] Footer cserélve: {file}")
                        szamlalo += 1
                else:
                    print(f"[SKIP] Nem találtam footert ebben: {file}")
                    
            except Exception as e:
                print(f"[HIBA] {file}: {e}")

print("-" * 30)
print(f"KÉSZ! Összesen {szamlalo} fájlban cseréltem le a footert.")