import os

# A script az aktuális könyvtárból indul
root_directory = os.getcwd()

# Cserélendő szöveg
old_link = '<a class="" href="/aszf.html">ÁSZF</a>'
new_link = '<a class="" href="/aszf.html">ÁSZF / Adatvédelem</a>'

# Végigmegy az összes HTML fájlon
for foldername, subfolders, filenames in os.walk(root_directory):
    for filename in filenames:
        if filename.endswith(".html"):
            file_path = os.path.join(foldername, filename)

            with open(file_path, "r", encoding="utf-8") as file:
                content = file.read()

            if old_link in content:
                content = content.replace(old_link, new_link)

                with open(file_path, "w", encoding="utf-8") as file:
                    file.write(content)

                print(f"Módosítva: {file_path}")

print("Kész! Minden HTML fájl frissítve.")
