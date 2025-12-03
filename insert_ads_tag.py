import os

# A beillesztendő Google Ads kód
google_ads_code = """
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17214149386"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-17214149386');
</script>
"""

# A projekt gyökérmappájának elérési útja
root_folder = "C:\Users\Vona\Desktop\KlimaPajzs\Klima Weboldal"  # <-- ezt írd át!

# Végigmegy minden fájlon a mappastruktúrában
for subdir, dirs, files in os.walk(root_folder):
    for file in files:
        if file.endswith(".html"):
            file_path = os.path.join(subdir, file)

            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            if "gtag/js?id=AW-17214149386" not in content:
                # Beilleszti a </head> elé a kódot
                new_content = content.replace(
                    "</head>", google_ads_code + "\n</head>"
                )

                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)

print("✅ Minden HTML fájl frissítve lett.")
