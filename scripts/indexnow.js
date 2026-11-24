// IndexNow: tell Bing, Yandex, Naver, Seznam and Yep which pages were added or changed.
// Runs in the deploy workflow after the FTP upload (continue-on-error, never blocks a deploy).
//   node scripts/indexnow.js <fromSha> <toSha>   -> submits html files added/modified between the two commits
//   node scripts/indexnow.js --sitemap           -> submits every URL in sitemap.xml (one-time or occasional)
//   add --dry to only print the URLs
// The key is public by design: the same value is hosted at https://trickysofttech.com/<key>.txt
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const HOST = 'trickysofttech.com';
const KEY = 'c61ac0cad84b55dd2672357d33e04a73';
const dry = process.argv.includes('--dry');
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));

function fileToUrl(f) {
  if (!f.endsWith('.html') || f === '404.html' || f.startsWith('.') || /^(\.secrets|scripts|seo-audit|node_modules)\//.test(f)) return null;
  if (f === 'index.html') return 'https://' + HOST + '/';
  if (f.endsWith('/index.html')) return 'https://' + HOST + '/' + f.slice(0, -'index.html'.length);
  return 'https://' + HOST + '/' + f.slice(0, -'.html'.length);
}
function changedUrls(from, to) {
  const zero = !from || /^0+$/.test(from);
  let out;
  try {
    out = cp.execSync(zero ? 'git diff --name-only --diff-filter=AM HEAD~1 HEAD' : 'git diff --name-only --diff-filter=AM ' + from + ' ' + to, { cwd: ROOT, encoding: 'utf8' });
  } catch (e) {
    out = cp.execSync('git diff --name-only --diff-filter=AM HEAD~1 HEAD', { cwd: ROOT, encoding: 'utf8' });
  }
  const files = out.split(/\r?\n/).filter(Boolean);
  const urls = files.map(fileToUrl).filter(Boolean);
  // the home page lists the newest posts, so it changes whenever a blog post does
  if (files.some(f => /^blog\/.+\.html$/.test(f)) && !urls.includes('https://' + HOST + '/')) urls.push('https://' + HOST + '/');
  return urls;
}
function sitemapUrls() {
  const x = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return [...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim()).filter(u => u.startsWith('https://' + HOST + '/'));
}

(async () => {
  const urls = [...new Set(process.argv.includes('--sitemap') ? sitemapUrls() : changedUrls(args[0], args[1]))];
  console.log('IndexNow: ' + urls.length + ' URL(s)');
  if (!urls.length) return;
  urls.slice(0, 15).forEach(u => console.log('  ' + u));
  if (urls.length > 15) console.log('  ... and ' + (urls.length - 15) + ' more');
  if (dry) return;
  if (urls.length > 10000) throw new Error('too many URLs for one IndexNow request');
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: 'https://' + HOST + '/' + KEY + '.txt', urlList: urls })
  });
  console.log('IndexNow response: ' + res.status + ' ' + res.statusText);
  if (res.status !== 200 && res.status !== 202) { console.log(await res.text()); process.exit(1); }
})().catch(e => { console.error('IndexNow failed:', e.message); process.exit(1); });
