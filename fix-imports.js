import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Liste des dossiers à traiter
const directories = [
  'pages',
  'components',
  'src/pages',
  'src/components',
  'pages/admin',
  'src/pages/admin'
];

// Composants qui doivent pointer vers le dossier components racine
const rootComponents = [
  'SEO',
  'ModelCard',
  'ServiceCard',
  'CountdownTimer',
  'BookingForm',
  'BackToTopButton',
  'BeginnerQuiz',
  'TestimonialCarousel',
  'ModelForm',
  'Pagination',
  'ScoreInput',
  'QuizComponent',
  'AIAssistant',
  'ArticleGenerator',
  'SocialIcons'
];

// Fonction pour déterminer le bon chemin d'importation
function getImportBasePath(filePath) {
  const normalizedPath = path.normalize(filePath);
  const isAdminFile = normalizedPath.includes('admin');
  return isAdminFile ? '../../../' : '../../';
}

// Fonction pour traiter un fichier
async function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Remplacer les imports de composants
    content = content.replace(
      /from ['"](?:\.\.\/)*components\/([^'"\/]+)['"]/g, 
      (match, p1) => {
        const basePath = getImportBasePath(filePath);
        if (rootComponents.includes(p1)) {
          return `from '${basePath}components/${p1}'`;
        }
        return match;
      }
    );
    
    // Remplacer les imports de contextes
    content = content.replace(
      /from ['"](?:\.\.\/)*contexts\/([^'"\/]+)['"]/g,
      (match, p1) => {
        const basePath = getImportBasePath(filePath);
        return `from '${basePath}contexts/${p1}'`;
      }
    );
    
    // Remplacer les imports de types
    content = content.replace(
      /from ['"](?:\.\.\/)*types['"]/g,
      (match) => {
        const basePath = getImportBasePath(filePath);
        return `from '${basePath}types'`;
      }
    );
    
    // Vérifier si le contenu a été modifié
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Fonction pour parcourir récursivement les dossiers
async function processDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    // Utiliser une boucle for...of pour gérer correctement les promesses
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        await processDirectory(fullPath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        await processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
}

// Fonction principale
async function main() {
  console.log('Starting to fix import paths...');

  for (const dir of directories) {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
      console.log(`Processing directory: ${dir}`);
      await processDirectory(fullPath);
    } else {
      console.log(`Directory not found: ${dir}`);
    }
  }

  console.log('Import path fixing complete!');
}

// Exécuter le script
main().catch(console.error);
