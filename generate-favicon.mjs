import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="24" fill="#0f1d2e"/>
  <rect x="15" y="15" width="85" height="62" rx="10" fill="white"/>
  <polygon points="28,77 15,102 58,77" fill="white"/>
  <rect x="20" y="57" width="72" height="3" rx="1.5" fill="#0f1d2e"/>
  <rect x="20" y="67" width="55" height="3" rx="1.5" fill="#0f1d2e"/>
  <rect x="76" y="60" width="3" height="14" rx="1.5" fill="#f9a825"/>
</svg>`;

await sharp(Buffer.from(svg))
  .resize(180, 180)
  .png()
  .toFile('public/favicon.png');

console.log('favicon.png skapad!');