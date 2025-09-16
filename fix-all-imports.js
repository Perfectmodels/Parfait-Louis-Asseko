import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of directories to process
const sourceDirs = [
  'g:/Parfait-Louis-Asseko-1/pages',
  'g:/Parfait-Louis-Asseko-1/src/pages'
];

// Map of old import paths to new ones
const pathMappings = {
  "from '../../components/": "from '../components/'",
  "from '../../contexts/": "from '../contexts/'",
  "from '../../types'": "from '../types'",
  "from '../../hooks'": "from '../hooks'"
};

function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Apply each path mapping
    for (const [oldPath, newPath] of Object.entries(pathMappings)) {
      const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (regex.test(content)) {
        content = content.replace(regex, newPath);
        modified = true;
      }
    }

    // Save the file if it was modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed imports in: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

function processDirectory(directory) {
  try {
    const files = fs.readdirSync(directory);
    let fixedCount = 0;

    files.forEach(file => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and other non-source directories
        if (file !== 'node_modules' && !file.startsWith('.')) {
          fixedCount += processDirectory(fullPath);
        }
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        if (fixImportsInFile(fullPath)) {
          fixedCount++;
        }
      }
    });

    return fixedCount;
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return 0;
  }
}

// Run the script
console.log('Starting to fix import paths...');
let totalFixed = 0;

sourceDirs.forEach(dir => {
  console.log(`\nProcessing directory: ${dir}`);
  totalFixed += processDirectory(dir);
});

console.log(`\n✅ Fixed imports in ${totalFixed} files.`);
