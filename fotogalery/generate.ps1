# Nastavení cesty ke kořenové složce, kterou chceme procházet
$folderPath = "C:\Users\VojtechMykiska\OneDrive - Security Avengers s.r.o\Dokumenty\MykiskaWeb\fotogalery"  # upravte tuto cestu dle potřeby

# Definice platných přípon souborů (všechna budou převedena na malá písmena)
$validExtensions = @(".jpg", ".jpeg", ".png", ".gif", ".bmp")

# Inicializace prázdného hashtable pro uložení výsledků
$result = @{}

# Pro každou okamžitou podsložku v zadané kořenové složce
Get-ChildItem -Path $folderPath -Directory | ForEach-Object {
    # Uložení názvu složky (použije se jako klíč v JSON)
    $folderName = $_.Name
    # Získání plné cesty dané podsložky
    $subFolderPath = $_.FullName

    # Vyhledání souborů v této složce (včetně jejích podadresářů) se specifikovanými platnými příponami
    $images = Get-ChildItem -Path $subFolderPath -File -Recurse | Where-Object {
        # Porovnáme příponu souboru (v malých písmenech) s platnými příponami
        $validExtensions -contains $_.Extension.ToLower()
    } | Select-Object -ExpandProperty Name

    # Uložení seznamu nalezených obrázků do hashtable s názvem složky jako klíčem
    $result[$folderName] = $images
}

# Konverze výsledného hashtable do JSON formátu.
# Parametr -Depth určuje maximální hloubku objektů v JSON (pro složitější struktury může být potřeba zvýšit)
$json = $result | ConvertTo-Json -Depth 10

# Uložení JSON textu do souboru (cestu dle potřeby upravte)
$outputFilePath = "C:\Users\VojtechMykiska\OneDrive - Security Avengers s.r.o\Dokumenty\MykiskaWeb\gallery.json"
$json | Out-File -FilePath $outputFilePath -Encoding utf8

Write-Host "JSON soubor byl úspěšně vytvořen: $outputFilePath"
