import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('Fetching license data from pnpm...');
const rawData = execSync('pnpm licenses list --json --prod').toString();
const licensesGrouped = JSON.parse(rawData);

const result = [];

for (const licenseName in licensesGrouped) {
  for (const pkg of licensesGrouped[licenseName]) {
    
    let licenseText = 'No license file found.';
    
    const licenseFiles = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'COPYING', 'README.md'];
    
    if (pkg.path) {
      for (const fileName of licenseFiles) {
        const fullPath = path.join(pkg.path, fileName);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (fileName === 'README.md' && !content.toLowerCase().includes('license')) continue;
          
          licenseText = content;
          break; 
        }
      }
    }

    result.push({
      name: pkg.name,
      version: pkg.version,
      license: pkg.license,
      author: pkg.author,
      homepage: pkg.homepage,
      repository: pkg.repository,
      licenseText: licenseText
    });
  }
}

const outputPath = './src/data/license-list.json';
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log(`Done! Saved ${result.length} licenses to ${outputPath}`);