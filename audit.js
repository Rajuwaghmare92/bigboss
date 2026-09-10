const fs = require('fs');
const path = require('path');

const files = ['index.html', 'customizer.html', 'gallery.html', 'fabrics.html', 'craft.html', 'booking.html'];

console.log('=== RUNNING DETAILED BIG BOSS ATELIER AUDIT ===\n');

let totalErrors = 0;
let totalWarnings = 0;

files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  console.log(`=== Checking: ${f} ===`);
  
  // 1. Check Images
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
  let match;
  let imgCount = 0;
  while ((match = imgRegex.exec(html)) !== null) {
    imgCount++;
    const src = match[1];
    if (!fs.existsSync(src)) {
      console.log(`  ❌ [MISSING IMAGE] ${src}`);
      totalErrors++;
    }
  }
  console.log(`  ✓ Images found and verified: ${imgCount}`);

  // 2. Check File Links
  const linkRegex = /href=["']([^"'#:]+)(?:#([^"']*))?["']/g;
  let linkCount = 0;
  while ((match = linkRegex.exec(html)) !== null) {
    linkCount++;
    const targetFile = match[1];
    if (targetFile.endsWith('.html') && !fs.existsSync(targetFile)) {
      console.log(`  ❌ [BROKEN LINK] ${targetFile}`);
      totalErrors++;
    }
  }
  console.log(`  ✓ Internal links checked: ${linkCount}`);

  // 3. Check Anchor links on this page
  const hashRegex = /href=["']#([^"']+)["']/g;
  let hashCount = 0;
  while ((match = hashRegex.exec(html)) !== null) {
    hashCount++;
    const targetId = match[1];
    if (!html.includes(`id="${targetId}"`) && !html.includes(`id='${targetId}'`)) {
      console.log(`  ⚠️  [WARN ANCHOR NOT FOUND] #${targetId} not in ${f}`);
      totalWarnings++;
    }
  }
  console.log(`  ✓ Anchor targets verified: ${hashCount}`);

  // 4. Check Open Graph, Meta & Accessibility
  const hasOgTitle = html.includes('property="og:title"');
  const hasOgDesc = html.includes('property="og:description"');
  const hasOgImage = html.includes('property="og:image"');
  const hasTwitter = html.includes('name="twitter:card"');
  const hasCanonical = html.includes('rel="canonical"');
  const hasAppleIcon = html.includes('rel="apple-touch-icon"');
  const hasSchema = html.includes('application/ld+json');
  const hasSkipLink = html.includes('class="skip-to-content"');
  const hasActivityToast = html.includes('id="activityToast"');

  console.log(`  ✓ Meta: OG Title: ${hasOgTitle} | OG Image: ${hasOgImage} | Twitter: ${hasTwitter} | Schema: ${hasSchema}`);
  console.log(`  ✓ Core Hooks: Skip Link: ${hasSkipLink} | Activity Toast: ${hasActivityToast}`);

  if (!hasSkipLink) {
    console.log(`  ❌ Missing skip link in ${f}`);
    totalErrors++;
  }
  if (!hasActivityToast) {
    console.log(`  ❌ Missing activity toast in ${f}`);
    totalErrors++;
  }
  console.log('');
});

// Specific checks on key interactive features
console.log('=== Specific Feature Verification ===');
const bookingHtml = fs.readFileSync('booking.html', 'utf8');
const hasCalendarBtn = bookingHtml.includes('id="addGoogleCalendarBtn"');
const hasCopyBtn = bookingHtml.includes('id="copyRefBtn"');
const hasSpecBanner = bookingHtml.includes('id="attachedSpecBanner"');
console.log(`Booking Page: Calendar Button: ${hasCalendarBtn} | Copy Ref Button: ${hasCopyBtn} | Attached Spec Banner: ${hasSpecBanner}`);

const customizerHtml = fs.readFileSync('customizer.html', 'utf8');
const hasBookWithSpec = customizerHtml.includes('id="bookWithSpecBtn"');
const hasMonogramBadge = customizerHtml.includes('id="visualizerMonogramBadge"');
console.log(`Customizer Page: Book With Spec Button: ${hasBookWithSpec} | Monogram Badge: ${hasMonogramBadge}`);

const css = fs.readFileSync('styles.css', 'utf8');
const hasPrintMedia = css.includes('@media print');
const hasToastStyle = css.includes('.activity-toast');
console.log(`Styles.css: @media print defined: ${hasPrintMedia} | .activity-toast styled: ${hasToastStyle}`);

console.log(`\n--- AUDIT COMPLETE: ${totalErrors} Errors, ${totalWarnings} Warnings ---`);
process.exit(totalErrors > 0 ? 1 : 0);
