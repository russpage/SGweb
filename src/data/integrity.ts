// Build-time content locks. Catalog drift fails `astro build`.
import { z } from 'astro/zod';
import catalog from './catalog.json';
import flavorData from './flavors.json';
import shop from '../fragments/body-shop.html?raw';
import pintsPage from '../fragments/body-pints.html?raw';
import locations from '../fragments/body-locations.html?raw';

const name = z.string().min(2);

// Pints and stockists are still hand-maintained in HTML, so they stay locked.
const Catalog = z.object({
  pints: z.array(name).length(27),      // NEVER changes without an explicit request
  stockists: z.array(name).length(5),
});
const cat = Catalog.parse(catalog);

// Flavors are CMS-edited (src/data/flavors.json): validate shape, not counts.
const Badge = z.object({ style: z.string().min(2), label: z.string().min(1) });
const Scoop = z.object({
  name,
  description: z.string().min(10),
  image: z.string().min(5),
  alt: z.string().optional(),
  categories: z.string(),
  badges: z.array(Badge),
  anchor: z.string().optional(),
  menuName: z.string().optional(),
});
const Flavors = z.object({
  home: z.object({ subtitle: z.string().min(10) }),
  seasonal: z.object({
    label: z.string().min(3),
    flavors: z.array(z.object({ name, description: z.string().min(10), image: z.string().min(5), tag: z.string().min(2) })).min(1),
  }),
  scoops: z.array(Scoop).min(1),
  featured: z.array(z.object({
    name,
    description: z.string().min(10),
    image: z.string().min(5),
    alt: z.string().optional(),
    initials: z.string().min(1),
    badgeStyle: z.string().min(2),
    badgeLabel: z.string().min(2),
  })).min(1),
});
const flavors = Flavors.parse(flavorData);

const dupes = (names: string[]) => names.filter((n, i) => names.indexOf(n) !== i);
const scoopDupes = dupes(flavors.scoops.map((s) => s.name));
if (scoopDupes.length) throw new Error(`[integrity] duplicate flavor names: ${scoopDupes.join(', ')}`);

// Every featured flavor on the home page must exist on the flavors page.
const scoopNames = new Set(flavors.scoops.flatMap((s) => (s.menuName ? [s.name, s.menuName] : [s.name])));
const ghosts = flavors.featured.filter((f) => !scoopNames.has(f.name)).map((f) => f.name);
if (ghosts.length) throw new Error(`[integrity] featured flavors missing from scoops list: ${ghosts.join(', ')}`);

function assertAll(page: string, label: string, names: string[], html: string) {
  const missing = names.filter((n) => !html.includes(n));
  if (missing.length) throw new Error(`[integrity] ${label} missing from ${page}: ${missing.join(', ')}`);
}
const count = (html: string, cls: string) => (html.match(new RegExp(`class="${cls}[" ]`, 'g')) ?? []).length;

assertAll('shop.html', 'pint', cat.pints, shop);
assertAll('pints.html', 'stockist', cat.stockists, pintsPage);
assertAll('locations.html', 'stockist', cat.stockists, locations);
if (count(shop, 'shop-card') !== 27) throw new Error('[integrity] shop pint card count != 27');

export default cat;
