import os
import re

# A frissített JOGI INFORMÁCIÓK blokk
uj_jogi_blokk = """<!-- JOGI INFORMÁCIÓK -->
      <div class="col-md-6 col-lg-2 mx-auto">
        <div class="info_link_box">
          <h4>Jogi információk</h4>
          <div class="info_links">
            <a class="" href="/aszf.html">ÁSZF</a>
          </div>
        </div>
      </div>
      <!-- JOGI INFORMÁCIÓK VÉGE -->"""

# Függvény a HTML tartalom frissítésére
def frissit_jogi_blokk(html):
    pattern = r"<!-- JOGI INFORMÁCIÓK -->(.*?)<!-- JOGI INFORMÁCIÓK VÉGE -->"
    if re.search(pattern, html, re.DOTALL):
        return re.sub(pattern, uj_jogi_blokk, html, flags=re.DOTALL)
    else:
        return html  # nincs mit frissíteni

# Rekurzív bejárás
for root, _, files in os.walk("./"):
    for file in files:
        if file.endswith(".html"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()

            updated_content = frissit_jogi_blokk(content)

            if updated_content != content:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(updated_content)
                print(f"✅ Frissítve: {path}")
            else:
                print(f"ℹ️ Nem kellett frissíteni: {path}")
