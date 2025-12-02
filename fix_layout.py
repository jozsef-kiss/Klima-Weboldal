import os

def main():
    print("--- SOS LAYOUT JAVITAS START ---")
    
    # Ez a CSS kod helyreteszi a kepeket:
    # 1. max-width: 100% -> Nem loghat ki a kepernyorol
    # 2. height: auto -> Megtartja az aranyokat (nem lesz torz)
    # 3. !important -> Felulir mindent, ami elrontana
    css_patch = """
/* --- SOS JAVITAS: KEP UGRALAS ES TORZULAS ELLEN --- */
img {
    max-width: 100% !important;
    height: auto !important;
}
/* Biztonsagi margo javitas, ha szukseges */
.img-box img {
    width: 100% !important; 
    object-fit: contain;
}
"""
    
    # Ezeket a fajlokat javitjuk
    target_files = ["css/style.css", "css/responsive.css"]
    
    for file_path in target_files:
        if os.path.exists(file_path):
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                
                # Csak akkor irjuk bele, ha meg nincs benne
                if "SOS JAVITAS" not in content:
                    with open(file_path, "a", encoding="utf-8") as f:
                        f.write(css_patch)
                    print(f"✅ SIKERESEN JAVITVA: {file_path}")
                else:
                    print(f"ℹ️ A javitas mar benne van: {file_path}")
                    
            except Exception as e:
                print(f"⚠️ Hiba a fajlnal: {e}")
        else:
            print(f"❌ Nem talalhato: {file_path}")

    print("\n--- KESZ! Most frissitsd az oldalt a bongeszoben (CTRL+F5)! ---")

if __name__ == "__main__":
    main()