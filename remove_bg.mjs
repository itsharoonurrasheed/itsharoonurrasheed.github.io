import { removeBackground } from '@imgly/background-removal-node';
import { readFileSync, writeFileSync } from 'fs';

const inputPath  = 'D:/Profolio/haroon.png';
const outputPath = 'D:/Profolio/haroon_nobg.png';

console.log('Reading image…');
const imageData  = readFileSync(inputPath);
const blob       = new Blob([imageData], { type: 'image/png' });

console.log('Removing background (downloading models on first run)…');
const resultBlob = await removeBackground(blob, {
  model: 'medium',
  output: { format: 'image/png', quality: 1 }
});

const buffer = Buffer.from(await resultBlob.arrayBuffer());
writeFileSync(outputPath, buffer);
console.log('Done → haroon_nobg.png');
