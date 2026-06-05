import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cvPath = path.resolve(__dirname, '../CV_carlos_ledesma_v2.md');
const outPath = path.resolve(__dirname, '../functions/api/cv.ts');

try {
  const cvContent = fs.readFileSync(cvPath, 'utf-8');
  
  // Usamos JSON.stringify para escapar correctamente las comillas y saltos de línea
  const tsContent = `// Archivo generado automáticamente por scripts/generate-cv.js. NO EDITAR.
export const CV_CONTEXT = ${JSON.stringify(cvContent)};
`;

  fs.writeFileSync(outPath, tsContent);
  console.log('✅ CV inyectado correctamente en functions/api/cv.ts');
} catch (error) {
  console.error('❌ Error inyectando el CV:', error);
  process.exit(1);
}
