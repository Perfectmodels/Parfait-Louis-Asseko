import fs from 'fs';
import path from 'path';

const sourceDirs = [
  'g:/Parfait-Louis-Asseko-1/pages',
  'g:/Parfait-Louis-Asseko-1/src/pages'
];

function fixFileContent(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Regex to find import paths like '../components/'Component' and fix them
    const regex = /from '(\.\.\/[^']*)'([^']*)';/g;
    
    if (regex.test(content)) {
      const newContent = content.replace(regex, "from '$1$2';");
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed import syntax in: ${filePath}`);
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
        if (file !== 'node_modules' && !file.startsWith('.')) {
          fixedCount += processDirectory(fullPath);
        }
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        if (fixFileContent(fullPath)) {
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

console.log('Starting to fix import syntax errors...');
let totalFixed = 0;
sourceDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`\nProcessing directory: ${dir}`);
    totalFixed += processDirectory(dir);
  } else {
    console.warn(`Directory not found: ${dir}`);
  }
});

console.log(`\n✅ Fixed syntax in ${totalFixed} files.`);
