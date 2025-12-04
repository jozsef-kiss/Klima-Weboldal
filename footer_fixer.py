import os
import re

# --- 1. AZ ÚJ FOOTER TARTALMA (Relatív linkekre előkészítve - nincs "/" az elején!) ---
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
                  <a class="" href="rolunk.html"> Rólunk </a>
                  <a class="" href="klima-szolgaltatasok-ozd.html">Szolgáltatásaink</a>
                  <a class="" href="klimaberendezesek.html">Klímaberendezések</a>
                  <a class="" href="tippekestanacsok.html">Tippek és tanácsok</a>
                  <a class="" href="contact.html"> Kapcsolat </a>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-2 mx-auto">
              <div class="info_link_box">
                <h4>Kiemelt Területek</h4>
                <div class="info_links">
                  <a href="klimaszereles-arlo.html">Klímaszerelés Arló</a>
                  <a href="klimaszereles-putnok.html">Klímaszerelés Putnok</a>
                  <a href="klimaszereles-borsodnadasd.html">Klíma Borsodnádasd</a>
                  <a href="klimaszereles-banreve.html">Klímaszerelés Bánréve</a>
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

# --- BEÁLLÍTÁSOK ---
gyoker_konyvtar = os.getcwd()
cel_mappak = ['js', 'css', 'images', 'fonts'] 

def javit_utvonal(fajl_melyseg, eredeti_utvonal):
    # 1. Abszolút linkeket békén hagyjuk
    if eredeti_utvonal.startswith(('http', '//', 'tel:', 'mailto:', '#')):
        return eredeti_utvonal

    tiszta_utvonal = eredeti_utvonal
    # Leszedjük a meglévő ../ és ./ és / részeket az elejéről
    while tiszta_utvonal.startswith('../') or tiszta_utvonal.startswith('./') or tiszta_utvonal.startswith('/'):
        if tiszta_utvonal.startswith('../'): tiszta_utvonal = tiszta_utvonal[3:]
        elif tiszta_utvonal.startswith('./'): tiszta_utvonal = tiszta_utvonal[2:]
        elif tiszta_utvonal.startswith('/'): tiszta_utvonal = tiszta_utvonal[1:]
    
    # 2. Ha ez egy technikai fájl (js, css) VAGY HTML fájl (amit linkelünk a footerben)
    is_resource = any(tiszta_utvonal.startswith(mappa + '/') for mappa in cel_mappak)
    is_html_link = tiszta_utvonal.endswith('.html')

    if is_resource or is_html_link:
        # Generáljuk az új prefixet a mélység alapján
        # Ha a fájl a gyökérben van (index.html), a mélység 0 -> prefix ""
        # Ha a fájl mélyen van, a prefix pl. "../../"
        uj_prefix = "../" * fajl_melyseg
        return uj_prefix + tiszta_utvonal
    
    return eredeti_utvonal

def feldolgoz_fajl(fajl_utvonal, fajl_nev, melyseg):
    try:
        with open(fajl_utvonal, 'r', encoding='utf-8') as f:
            tartalom = f.read()
        eredeti_tartalom = tartalom

        # --- 1. FOOTER CSERE ---
        pattern_footer = r'.*?'
        if re.search(pattern_footer, tartalom, flags=re.DOTALL):
            tartalom = re.sub(pattern_footer, UJ_FOOTER, tartalom, flags=re.DOTALL)
            print(f"[FOOTER OK] {fajl_nev}")

        # --- 2. ÚTVONAL JAVÍTÁS ---
        # Itt a javított regex, ami NEM tartalmaz bengáli nyelvet :)
        pattern_path = r'(src|href)=(["\'])(.*?)\2'
        
        def path_replacer(match):
            attrib = match.group(1) 
            quote = match.group(2)
            link = match.group(3)
            uj_link = javit_utvonal(melyseg, link)
            return f'{attrib}={quote}{uj_link}{quote}'

        tartalom = re.sub(pattern_path, path_replacer, tartalom)

        if tartalom != eredeti_tartalom:
            with open(fajl_utvonal, 'w', encoding='utf-8') as f:
                f.write(tartalom)
        
    except Exception as e:
        print(f"[HIBA] {fajl_nev}: {e}")

# --- INDÍTÁS ---
print("--- Script indítása: Footer és Útvonal javítás (V2.0 - Bugmentes) ---")
for root, dirs, files in os.walk(gyoker_konyvtar):
    for file in files:
        if file.endswith(".html"):
            rel_path = os.path.relpath(root, gyoker_konyvtar)
            melyseg = 0 if rel_path == "." else rel_path.count(os.sep) + 1
            feldolgoz_fajl(os.path.join(root, file), file, melyseg)
print("--- KÉSZ! ---")