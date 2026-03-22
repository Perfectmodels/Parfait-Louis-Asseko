import fs from 'fs';

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace('via-pm-gold-light', 'via-pm-gold');
fs.writeFileSync('index.html', indexHtml);
