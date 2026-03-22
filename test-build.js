import fs from 'fs';

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace('<style type="text/tailwindcss">', '<style type="text/tailwindcss">\n        @tailwind base;\n        @tailwind components;\n        @tailwind utilities;');
fs.writeFileSync('index.html', indexHtml);
