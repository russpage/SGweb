// Build-time content locks. Any drift in the catalog fails `astro build`.
import { z } from 'astro/zod';
import catalog from './catalog.json';
import shop from '../fragments/body-shop.html?raw';
import flavors from '../fragments/body-flavors.html?raw';
import pintsPage from '../fragments/body-pints.html?raw';
import locations from '../fragments/body-locations.html?raw';

const name = z.string().min(2);
const Catalog = z.object({
  pints: z.array(name).length(27),      // NEVER changes without an explicit request
  scoops: z.array(name).length(22),     // Fall lineup minus pints-only Peppermint
  seasonal: z.array(name).length(3),    // Fall 2026 trio
  stockists: z.array(name).length(5),
});
const cat = Catalog.parse(catalog);

function assertAll(page: string, label: string, names: string[], html: string) {
  const missing = names.filter((n) => !html.includes(n));
  if (missing.length) throw new Error(`[integrity] ${label} missing from ${page}: ${missing.join(', ')}`);
}
const count = (html: string, cls: string) => (html.match(new RegExp(`class="${cls}[" ]`, 'g')) ?? []).length;

assertAll('shop.html', 'pint', cat.pints, shop);
assertAll('flavors.html', 'scoop flavor', cat.scoops, flavors);
assertAll('flavors.html', 'seasonal flavor', cat.seasonal, flavors);
assertAll('pints.html', 'stockist', cat.stockists, pintsPage);
assertAll('locations.html', 'stockist', cat.stockists, locations);

if (count(shop, 'shop-card') !== 27) throw new Error('[integrity] shop pint card count != 27');
if (count(flavors, 'flavor-card-full') !== 22) throw new Error('[integrity] scoop card count != 22');
if (count(flavors, 'seasonal-card') !== 3) throw new Error('[integrity] seasonal card count != 3');

export default cat;
