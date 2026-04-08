# Script d'organisation de la documentation
# Ce script organise tous les fichiers .md dans une structure docs/

$ErrorActionPreference = "Stop"

# Définition des catégories et leurs patterns associés
$categories = @{
    "mobile" = @(
        "*MOBILE*",
        "*ANDROID*", 
        "*IOS*",
        "*QUICKSTART*",
        "*CAPACITOR*"
    )
    "notifications" = @(
        "*NOTIFICATION*",
        "*FCM*",
        "*PUSH*"
    )
    "miss5eme" = @(
        "*MISS_5EME*",
        "*MISS5EME*",
        "*MISS ONE*",
        "*JURY*",
        "*NOTATION*",
        "*FICHES*"
    )
    "firebase" = @(
        "*FIREBASE*"
    )
    "guides" = @(
        "*GUIDE*",
        "*SETUP*",
        "*CHECKLIST*",
        "*COMMANDS*",
        "*SUMMARY*",
        "*RESUME*"
    )
    "technical" = @(
        "*ROBUSTESSE*",
        "*CONCURRENCE*",
        "*ICONS*",
        "*TEST*",
        "*CHANGELOG*"
    )
}

# Créer le dossier docs s'il n'existe pas
$docsPath = "docs"
if (!(Test-Path $docsPath)) {
    New-Item -ItemType Directory -Path $docsPath -Force | Out-Null
    Write-Host "✓ Dossier docs/ créé" -ForegroundColor Green
}

# Créer les sous-dossiers
foreach ($category in $categories.Keys) {
    $categoryPath = Join-Path $docsPath $category
    if (!(Test-Path $categoryPath)) {
        New-Item -ItemType Directory -Path $categoryPath -Force | Out-Null
        Write-Host "✓ Dossier docs/$category/ créé" -ForegroundColor Green
    }
}

# Créer le dossier "archive" pour les fichiers non classés
$archivePath = Join-Path $docsPath "archive"
if (!(Test-Path $archivePath)) {
    New-Item -ItemType Directory -Path $archivePath -Force | Out-Null
    Write-Host "✓ Dossier docs/archive/ créé" -ForegroundColor Green
}

# Récupérer tous les fichiers .md à la racine (sauf README.md principal)
$mdFiles = Get-ChildItem -Path "." -Filter "*.md" -File | Where-Object { 
    $_.Name -ne "README.md" -and 
    $_.Name -ne "organize-docs.ps1"
}

Write-Host "`n📄 Fichiers trouvés: $($mdFiles.Count)" -ForegroundColor Cyan

# Fonction pour déterminer la catégorie d'un fichier
function Get-FileCategory($filename) {
    foreach ($category in $categories.GetEnumerator() | Sort-Object Key) {
        foreach ($pattern in $category.Value) {
            if ($filename -like $pattern) {
                return $category.Key
            }
        }
    }
    return $null
}

# Déplacer les fichiers
$movedCount = 0
$archiveCount = 0

foreach ($file in $mdFiles) {
    $category = Get-FileCategory $file.Name
    
    if ($category) {
        $destPath = Join-Path $docsPath $category
        $destFile = Join-Path $destPath $file.Name
        
        # Gérer les doublons
        if (Test-Path $destFile) {
            $newName = "{0}_{1:yyyyMMdd_HHmmss}{2}" -f $file.BaseName, (Get-Date), $file.Extension
            $destFile = Join-Path $destPath $newName
            Write-Host "⚠️  $($file.Name) renommé en $newName (doublon)" -ForegroundColor Yellow
        }
        
        Move-Item -Path $file.FullName -Destination $destFile -Force
        Write-Host "→ $($file.Name) → docs/$category/" -ForegroundColor Green
        $movedCount++
    }
    else {
        $destFile = Join-Path $archivePath $file.Name
        if (Test-Path $destFile) {
            $newName = "{0}_{1:yyyyMMdd_HHmmss}{2}" -f $file.BaseName, (Get-Date), $file.Extension
            $destFile = Join-Path $archivePath $newName
        }
        Move-Item -Path $file.FullName -Destination $destFile -Force
        Write-Host "→ $($file.Name) → docs/archive/" -ForegroundColor Gray
        $archiveCount++
    }
}

# Générer un README pour la documentation
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("# Documentation")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("Cette documentation est organisée par catégories.")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("## Structure")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("| Dossier | Description |")
[void]$sb.AppendLine("|---------|-------------|")

foreach ($category in ($categories.Keys | Sort-Object)) {
    $count = (Get-ChildItem -Path (Join-Path $docsPath $category) -Filter "*.md" -File).Count
    [void]$sb.AppendLine("| $category/ | $count fichiers |")
}

$archiveCountFinal = (Get-ChildItem -Path $archivePath -Filter "*.md" -File).Count
[void]$sb.AppendLine("| archive/ | $archiveCountFinal fichiers non classés |")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("## Index des Documents")
[void]$sb.AppendLine("")

foreach ($category in ($categories.Keys | Sort-Object)) {
    $catPath = Join-Path $docsPath $category
    $files = Get-ChildItem -Path $catPath -Filter "*.md" -File
    
    if ($files.Count -gt 0) {
        $catUpper = $category.ToUpper()
        [void]$sb.AppendLine("### $catUpper")
        [void]$sb.AppendLine("")
        foreach ($file in ($files | Sort-Object Name)) {
            [void]$sb.AppendLine("- [$($file.BaseName)]($category/$($file.Name))")
        }
        [void]$sb.AppendLine("")
    }
}

if ($archiveCountFinal -gt 0) {
    [void]$sb.AppendLine("### AUTRES")
    [void]$sb.AppendLine("")
    $archiveFiles = Get-ChildItem -Path $archivePath -Filter "*.md" -File
    foreach ($file in ($archiveFiles | Sort-Object Name)) {
        [void]$sb.AppendLine("- [$($file.BaseName)](archive/$($file.Name))")
    }
}

$sb.ToString() | Out-File -FilePath (Join-Path $docsPath "README.md") -Encoding UTF8
Write-Host "`n✓ README.md de documentation généré" -ForegroundColor Green

# Résumé
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  ORGANISATION TERMINÉE" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📁 Organisés: $movedCount" -ForegroundColor Green
Write-Host "📁 Archivés: $archiveCount" -ForegroundColor Gray
Write-Host "`nNouvelle structure dans: ./docs/" -ForegroundColor Cyan
