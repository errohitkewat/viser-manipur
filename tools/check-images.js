// Run:  node tools/check-images.js   (Node 18+, needs internet)
// Checks every Unsplash image used by the site and lists any that fail to load.
const fs = require('fs'), path = require('path'), root = path.join(__dirname, '..');
const files = ['js/products.js', ...fs.readdirSync(root).filter(f => f.endsWith('.html')), 'tools/gen_pages.py'];
const ids = new Set();
for (const f of files) { const t = fs.readFileSync(path.join(root, f), 'utf8'); for (const m of t.matchAll(/photo-([0-9]{10,}-[0-9a-f]{12})|'([0-9]{10,}-[0-9a-f]{12})'/g)) ids.add(m[1] || m[2]); }
(async () => {
  let bad = 0;
  for (const id of ids) {
    try { const r = await fetch(`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=200&q=60`, { method: 'HEAD' }); if (!r.ok) { bad++; console.log('BROKEN', r.status, id); } }
    catch (e) { bad++; console.log('ERROR ', id, e.message); }
  }
  console.log(`${ids.size} images checked, ${bad} broken.`);
  if (bad) console.log('Replace broken ids in js/products.js (and tools/gen_pages.py → run it) with working Unsplash photo ids.');
})();
