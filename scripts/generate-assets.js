#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = dirname(__dirname);
const assetsDir = join(rootDir, 'assets');
const publicDir = join(rootDir, 'public');

// Ensure public directory exists
if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
}

console.log('🎨 Generating favicon images...');

// Generate favicon PNGs
try {
    // 32x32 favicon - transparent background
    execSync(`magick -background transparent -density 144 "${join(assetsDir, 'favicon.svg')}" -resize 32x32 "${join(publicDir, 'favicon-32.png')}"`, { stdio: 'inherit' });
    console.log('✓ favicon-32.png');
    
    // 180x180 Apple touch icon - transparent background
    execSync(`magick -background transparent -density 144 "${join(assetsDir, 'favicon.svg')}" -resize 180x180 "${join(publicDir, 'apple-touch-icon.png')}"`, { stdio: 'inherit' });
    console.log('✓ apple-touch-icon.png');
    
    // Generate favicon.ico (multi-size) - transparent background
    execSync(`magick -background transparent -density 144 "${join(assetsDir, 'favicon.svg')}" -resize 16x16 "${join(publicDir, 'favicon-16.png')}"`, { stdio: 'inherit' });
    execSync(`magick "${join(publicDir, 'favicon-16.png')}" "${join(publicDir, 'favicon-32.png')}" "${join(publicDir, 'favicon.ico')}"`, { stdio: 'inherit' });
    console.log('✓ favicon.ico');
    
} catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
}

console.log('\n🖼️  Generating Open Graph image...');

try {
    // 1200x630 OG image
    execSync(`magick "${join(assetsDir, 'og-image.svg')}" "${join(publicDir, 'og-image.png')}"`, { stdio: 'inherit' });
    console.log('✓ og-image.png');
} catch (error) {
    console.error('❌ Error generating OG image:', error.message);
    process.exit(1);
}

console.log('\n✅ All assets generated successfully!');