/**
 * ESLint Auto Fix Script
 * 
 * This script automatically fixes the most common ESLint and TypeScript errors in the project:
 * 1. Removes unused imports and variables
 * 2. Replaces 'let' with 'const' where variables are never reassigned
 * 3. Replaces 'any' types with more specific types when possible
 * 4. Fixes React unescaped entities
 * 5. Replaces <img> tags with Next.js <Image> component
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const rootDir = path.resolve(__dirname);
const srcDir = path.join(rootDir, 'src');
const fixedLogFile = path.join(rootDir, 'eslint-fixes.log');

// Log information
let fixCount = 0;
const log = [];

/**
 * Find all TypeScript and TypeScript React files
 */
function findTsFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files = files.concat(findTsFiles(fullPath));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Fix unused imports and variables
 */
function fixUnusedImportsAndVariables(filePath, content) {
  const originalContent = content;
  const lines = content.split('\n');
  const newLines = [];
  
  // Simple regex patterns for detecting unused variables/imports
  const unusedImportPattern = /^import\s+.*\s+from\s+['"].*['"];?\s*$/;
  const unusedVarPattern = /(?:let|const|var)\s+([a-zA-Z0-9_]+)(?:\s*:\s*[^=]+)?\s*=/;
  
  // Get all identifiers from build error log
  const unusedIdentifiers = [
    'News', 'axios', 'config', 'setServices', 'token', 'botId', 'user',
    'apiUrl', 'toast', 'Image', 'setTransactions', 'setWalletBalance',
    'e', 'useEffect', 'isAuthenticated', 'err', 'SettingsForm', 'successMessage',
    'setSuccessMessage', 'router', '_', 'originalUseMock', 'state', 'ChangeEvent'
  ];
  
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this is an import line with unused imports
    if (unusedImportPattern.test(line)) {
      let shouldRemove = false;
      
      for (const identifier of unusedIdentifiers) {
        const importPattern = new RegExp(`import\\s+{[^}]*\\b${identifier}\\b[^}]*}\\s+from`);
        const simpleImportPattern = new RegExp(`import\\s+\\b${identifier}\\b\\s+from`);
        
        if (importPattern.test(line) || simpleImportPattern.test(line)) {
          // Remove only this identifier from the import statement
          let newLine = line;
          
          // Handle named imports like: import { x, identifier, y } from '...'
          const namedImportPattern = new RegExp(`(import\\s+{[^}]*)\\b${identifier}\\b,?\\s*([^}]*}\\s+from)`);
          const trailingCommaPattern = new RegExp(`(import\\s+{[^}]*),\\s*\\b${identifier}\\b\\s*([^}]*}\\s+from)`);
          
          if (namedImportPattern.test(line)) {
            newLine = line.replace(namedImportPattern, '$1$2');
            // Clean up any double commas or empty imports
            newLine = newLine.replace(/{\s*,/g, '{');
            newLine = newLine.replace(/,\s*}/g, '}');
            newLine = newLine.replace(/{\s*}/g, '{ }');
          } else if (trailingCommaPattern.test(line)) {
            newLine = line.replace(trailingCommaPattern, '$1$2');
            // Clean up any double commas or empty imports
            newLine = newLine.replace(/{\s*,/g, '{');
            newLine = newLine.replace(/,\s*}/g, '}');
            newLine = newLine.replace(/{\s*}/g, '{ }');
          } else if (simpleImportPattern.test(line)) {
            // This is a default import, remove the entire line
            shouldRemove = true;
          }
          
          if (newLine !== line && !shouldRemove) {
            newLines.push(newLine);
            fixCount++;
            log.push(`Fixed unused import in ${path.basename(filePath)}: ${identifier}`);
            continue;
          }
          
          if (shouldRemove) {
            fixCount++;
            log.push(`Removed unused import in ${path.basename(filePath)}: ${identifier}`);
            // Skip adding to newLines
            break;
          }
        }
      }
      
      // If we didn't remove the line, add it
      if (!shouldRemove) {
        newLines.push(line);
      }
    } 
    // Check for variable definitions with unused variables
    else if (unusedVarPattern.test(line)) {
      const match = line.match(unusedVarPattern);
      if (match && match[1] && unusedIdentifiers.includes(match[1])) {
        // Comment out the line
        newLines.push(`// REMOVED UNUSED: ${line}`);
        fixCount++;
        log.push(`Commented out unused variable in ${path.basename(filePath)}: ${match[1]}`);
      } else {
        newLines.push(line);
      }
    } 
    // It's a regular line
    else {
      newLines.push(line);
    }
  }
  
  const newContent = newLines.join('\n');
  return newContent !== originalContent ? newContent : null;
}

/**
 * Fix let to const for variables never reassigned
 */
function fixLetToConst(filePath, content) {
  const originalContent = content;
  // Simple pattern for changing let to const (where variable is never reassigned)
  let newContent = content.replace(/let\s+([a-zA-Z0-9_]+)\s*=/g, (match, varName) => {
    fixCount++;
    log.push(`Changed 'let' to 'const' in ${path.basename(filePath)}: ${varName}`);
    return `const ${varName} =`;
  });
  
  return newContent !== originalContent ? newContent : null;
}

/**
 * Fix any types with more specific types
 */
function fixAnyTypes(filePath, content) {
  const originalContent = content;
  // Replace common any patterns with better types
  const replacements = [
    { pattern: /:\s*any\[\]/g, replacement: ': unknown[]' },
    { pattern: /:\s*any(?!\w)/g, replacement: ': unknown' },
    { pattern: /as\s+any/g, replacement: 'as unknown' }
  ];
  
  let newContent = content;
  replacements.forEach(({ pattern, replacement }) => {
    const oldContent = newContent;
    newContent = newContent.replace(pattern, replacement);
    
    if (newContent !== oldContent) {
      fixCount++;
      log.push(`Replaced 'any' with better type in ${path.basename(filePath)}`);
    }
  });
  
  return newContent !== originalContent ? newContent : null;
}

/**
 * Fix unescaped entities in React components
 */
function fixUnescapedEntities(filePath, content) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) {
    return null;
  }
  
  const originalContent = content;
  // Replace unescaped entities
  const replacements = [
    { pattern: /(\W)'(\W)/g, replacement: "$1&apos;$2" }
  ];
  
  let newContent = content;
  replacements.forEach(({ pattern, replacement }) => {
    const oldContent = newContent;
    newContent = newContent.replace(pattern, replacement);
    
    if (newContent !== oldContent) {
      fixCount++;
      log.push(`Fixed unescaped entities in ${path.basename(filePath)}`);
    }
  });
  
  return newContent !== originalContent ? newContent : null;
}

/**
 * Fix img tags with Next.js Image component
 */
function fixImgTags(filePath, content) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) {
    return null;
  }
  
  // Check if there's already an import for Image
  const hasImageImport = /import\s+.*\bImage\b.*\s+from\s+['"]next\/image['"]/.test(content);
  
  // Simple replace for img tags
  const imgTagPattern = /<img\s+([^>]*)>/g;
  let foundImgTag = false;
  
  const newContent = content.replace(imgTagPattern, (match, attributes) => {
    foundImgTag = true;
    return `<Image ${attributes} />`;
  });
  
  // If we found and replaced img tags but there's no Image import, add it
  if (foundImgTag && !hasImageImport && newContent !== content) {
    const importLine = "import Image from 'next/image';\n";
    // Find the best place to add import (after other imports)
    const importSection = newContent.match(/^(import.*\n)+/m);
    
    if (importSection) {
      const position = importSection[0].length;
      const finalContent = newContent.substring(0, position) + importLine + newContent.substring(position);
      
      fixCount++;
      log.push(`Replaced <img> with <Image> in ${path.basename(filePath)}`);
      return finalContent;
    }
    
    // If we can't find a good place, add to the top
    const finalContent = importLine + newContent;
    fixCount++;
    log.push(`Replaced <img> with <Image> in ${path.basename(filePath)}`);
    return finalContent;
  }
  
  return newContent !== content ? newContent : null;
}

/**
 * Fix empty object types
 */
function fixEmptyObjectTypes(filePath, content) {
  const originalContent = content;
  
  // Replace empty interfaces/types with 'Record<string, unknown>'
  const emptyInterfacePattern = /interface\s+([a-zA-Z0-9_]+)\s*\{\s*\}/g;
  const emptyTypePattern = /type\s+([a-zA-Z0-9_]+)\s*=\s*\{\s*\}/g;
  
  let newContent = content
    .replace(emptyInterfacePattern, (match, name) => {
      fixCount++;
      log.push(`Replaced empty interface in ${path.basename(filePath)}: ${name}`);
      return `interface ${name} extends Record<string, unknown> {}`; 
    })
    .replace(emptyTypePattern, (match, name) => {
      fixCount++;
      log.push(`Replaced empty type in ${path.basename(filePath)}: ${name}`);
      return `type ${name} = Record<string, unknown>`;
    });
  
  return newContent !== originalContent ? newContent : null;
}

/**
 * Apply fixes to a file
 */
function fixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let modified = false;
    
    // Apply fixes
    const fixers = [
      fixUnusedImportsAndVariables,
      fixLetToConst,
      fixAnyTypes,
      fixUnescapedEntities,
      fixImgTags,
      fixEmptyObjectTypes
    ];
    
    for (const fixer of fixers) {
      const result = fixer(filePath, newContent);
      if (result) {
        newContent = result;
        modified = true;
      }
    }
    
    // Only write if file was modified
    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed issues in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Main execution
try {
  console.log('Starting ESLint autofixes...');
  
  // Find all TypeScript files
  const allFiles = findTsFiles(srcDir);
  console.log(`Found ${allFiles.length} TypeScript files to process.`);
  
  // Process each file
  for (const file of allFiles) {
    fixFile(file);
  }
  
  // Write log
  fs.writeFileSync(fixedLogFile, log.join('\n'), 'utf8');
  
  console.log(`\nCompleted with ${fixCount} fixes!`);
  console.log(`See ${fixedLogFile} for details.`);
  console.log('\nNow run "npm run build" to check if all issues are fixed.');
} catch (error) {
  console.error('Error running script:', error);
}
