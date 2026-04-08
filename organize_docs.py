#!/usr/bin/env python3
"""Script d'organisation de la documentation - organise tous les fichiers .md dans docs/"""

import os
import shutil
from pathlib import Path
from collections import defaultdict

# Catégories et patterns associés
CATEGORIES = {
    "mobile": ["MOBILE", "ANDROID", "IOS", "QUICKSTART", "CAPACITOR"],
    "notifications": ["NOTIFICATION", "FCM", "PUSH"],
    "miss5eme": ["MISS_5EME", "MISS5EME", "MISS ONE", "JURY", "NOTATION", "FICHES"],
    "firebase": ["FIREBASE"],
    "guides": ["GUIDE", "SETUP", "CHECKLIST", "COMMANDS", "SUMMARY", "RESUME"],
    "technical": ["ROBUSTESSE", "CONCURRENCE", "ICONS", "TEST", "CHANGELOG"],
}

def get_category(filename):
    """Détermine la catégorie d'un fichier selon son nom."""
    upper_name = filename.upper()
    for category, patterns in CATEGORIES.items():
        for pattern in patterns:
            if pattern in upper_name:
                return category
    return None

def main():
    root = Path(".")
    docs_path = root / "docs"
    
    # Créer la structure
    print("Creation de la structure docs/...")
    docs_path.mkdir(exist_ok=True)
    
    for category in CATEGORIES.keys():
        (docs_path / category).mkdir(exist_ok=True)
        print(f"  docs/{category}/")
    
    (docs_path / "archive").mkdir(exist_ok=True)
    print("  docs/archive/")
    
    # Trouver les fichiers .md
    md_files = [f for f in root.glob("*.md") if f.name not in ["README.md", "organize_docs.py"]]
    print(f"\nFichiers trouves: {len(md_files)}")
    
    # Déplacer les fichiers
    moved = defaultdict(list)
    archived = []
    
    for file in md_files:
        category = get_category(file.name)
        
        if category:
            dest = docs_path / category / file.name
            # Gérer les doublons
            if dest.exists():
                from datetime import datetime
                new_name = f"{file.stem}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{file.suffix}"
                dest = docs_path / category / new_name
                print(f"  ! {file.name} renomme en {new_name}")
            
            shutil.move(str(file), str(dest))
            moved[category].append(file.name)
            print(f"  -> {file.name} -> docs/{category}/")
        else:
            dest = docs_path / "archive" / file.name
            if dest.exists():
                from datetime import datetime
                new_name = f"{file.stem}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{file.suffix}"
                dest = docs_path / "archive" / new_name
            
            shutil.move(str(file), str(dest))
            archived.append(file.name)
            print(f"  -> {file.name} -> docs/archive/")
    
    # Générer le README
    readme_lines = [
        "# Documentation",
        "",
        "Cette documentation est organisee par categories.",
        "",
        "## Structure",
        "",
        "| Dossier | Fichiers |",
        "|---------|----------|",
    ]
    
    for category in sorted(CATEGORIES.keys()):
        count = len(list((docs_path / category).glob("*.md")))
        readme_lines.append(f"| {category}/ | {count} |")
    
    archive_count = len(list((docs_path / "archive").glob("*.md")))
    readme_lines.append(f"| archive/ | {archive_count} |")
    readme_lines.extend(["", "## Index", ""])
    
    for category in sorted(CATEGORIES.keys()):
        files = sorted((docs_path / category).glob("*.md"))
        if files:
            readme_lines.append(f"### {category.upper()}")
            readme_lines.append("")
            for f in files:
                readme_lines.append(f"- [{f.stem}]({category}/{f.name})")
            readme_lines.append("")
    
    if archived:
        readme_lines.append("### AUTRES")
        readme_lines.append("")
        archive_files = sorted((docs_path / "archive").glob("*.md"))
        for f in archive_files:
            readme_lines.append(f"- [{f.stem}](archive/{f.name})")
    
    readme_content = "\n".join(readme_lines)
    (docs_path / "README.md").write_text(readme_content, encoding="utf-8")
    print("\n✓ docs/README.md genere")
    
    # Résumé
    print("\n" + "=" * 40)
    print("ORGANISATION TERMINEE")
    print("=" * 40)
    total_moved = sum(len(v) for v in moved.values())
    print(f"Organises: {total_moved}")
    print(f"Archives: {len(archived)}")
    print(f"\nNouvelle structure: ./docs/")

if __name__ == "__main__":
    main()
