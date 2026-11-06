/* VISER – central product data + tiny shared utilities.
   Every page reads products from here (grids, search, product page, cart). */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const money = n => '₹' + Number(n).toLocaleString('en-IN');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const IMG = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const COLORS = {
  Black: '#191919', White: '#F4F3EF', Cream: '#EDE6D6', Sand: '#D6C7A9', Olive: '#5B6140', Navy: '#1F2A44',
  Charcoal: '#3F3F3F', Grey: '#9A9A98', Brown: '#7A5640', Tan: '#B58B5E', Maroon: '#6E2A2A', Blue: '#4A6FA5',
  Indigo: '#2C3B5E', Pink: '#E3B8B4', Green: '#3F6B4F', Silver: '#C4C6C8', Gold: '#B79B5A'
};

const GRP = { 'Casual Shoes': 'Shoes', 'Sports Shoes': 'Shoes', Bags: 'Accessories', Caps: 'Accessories', Watches: 'Accessories', Belts: 'Accessories', Sunglasses: 'Accessories' };

function sizesFor(cat) {
  if (['T-shirts', 'Shirts', 'Hoodies'].includes(cat)) return ['S', 'M', 'L', 'XL', 'XXL'];
  if (cat === 'Dresses') return ['XS', 'S', 'M', 'L'];
  if (['Jeans', 'Trousers'].includes(cat)) return ['28', '30', '32', '34', '36'];
  if (['Sneakers', 'Casual Shoes', 'Sports Shoes'].includes(cat)) return ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
  if (cat === 'Belts') return ['30', '32', '34', '36'];
  return ['One Size'];
}

const COPY = {
  'T-shirts': ['A softly structured tee cut for everyday wear. Clean neckline, easy drape, and a fabric that keeps its shape wash after wash.', '100% combed cotton, 220 GSM', 'Machine wash cold, inside out. Tumble dry low. Do not bleach.'],
  'Shirts': ['A shirt that works as hard as you do. Relaxed through the body with a collar that sits right, worn buttoned up or loose over a tee.', 'Cotton blend, breathable weave', 'Machine wash gentle. Warm iron on reverse. Do not tumble dry.'],
  'Hoodies': ['Heavy, warm and made to be lived in. A roomy fit with a brushed inside, ribbed cuffs and a hood that holds its shape.', 'Cotton-poly fleece, 380 GSM', 'Wash cold with similar colours. Hang dry for best results.'],
  'Jeans': ['Denim with a proper weight and an easy, modern cut. Sits comfortably, breaks in beautifully and goes with almost everything.', 'Cotton denim with light stretch', 'Wash inside out in cold water. Avoid frequent washing to keep the colour.'],
  'Trousers': ['Clean lines with room to move. Built for long days, with a fit that works with sneakers and shoes alike.', 'Cotton twill, mid-weight', 'Machine wash cold. Medium iron if needed.'],
  'Dresses': ['An easy dress that goes from daytime plans to evening without a second thought. Light, fluid and comfortable to move in.', 'Viscose blend, lightweight', 'Hand wash or gentle cycle. Dry in shade. Steam to refresh.'],
  'Sneakers': ['Sneakers made for daily mileage. Cushioned footbed, grippy outsole and a silhouette that sits with any outfit.', 'Upper: leather/canvas blend. Sole: rubber', 'Wipe clean with a damp cloth. Air dry away from direct heat.'],
  'Casual Shoes': ['A smart, comfortable pair that dresses up or down. Flexible sole and a lined interior for all-day wear.', 'Upper: faux leather. Sole: TPR', 'Wipe with a soft cloth. Use shoe cream occasionally.'],
  'Sports Shoes': ['Lightweight and responsive for workouts, walks and long days on your feet. Breathable upper with a cushioned midsole.', 'Upper: engineered mesh. Sole: EVA + rubber', 'Spot clean with mild soap. Air dry only.'],
  'Bags': ['Practical space, clean design. Sturdy straps, tidy compartments and a shape that carries well from campus to weekend.', 'Water-resistant canvas / PU trim', 'Spot clean with a damp cloth. Do not machine wash.'],
  'Caps': ['The easy finishing touch. Soft-structured crown with an adjustable strap so it fits the way you want.', '100% cotton twill', 'Spot clean. Air dry. Do not wring.'],
  'Watches': ['Understated and dependable. A clean dial and comfortable strap that works with casual and smart looks.', 'Stainless steel case, mineral glass', 'Keep dry. Wipe with a soft cloth. Not for swimming.'],
  'Belts': ['A well-made belt that quietly finishes the outfit. Sturdy buckle and a strap that softens with wear.', 'Genuine leather / woven fabric', 'Wipe with a dry cloth. Avoid prolonged moisture.'],
  'Sunglasses': ['Light frames with UV-protective lenses. A simple shape that suits most faces and most days.', 'Acetate / metal frame, UV400 lenses', 'Clean with the pouch cloth. Store in the case.']
};

// name, category, gender, price, original, unsplash photo id, colours, featured, new, inStock
const RAW = [
  ['Heavyweight Boxy Tee', 'T-shirts', 'men', 1299, 1799, '1521572163474-6864f9cf17ab', ['White', 'Black', 'Sand'], 1, 1, 1],
  ['Essential Crew Tee', 'T-shirts', 'men', 899, 0, '1583743814966-8936f5b7be1a', ['Black', 'Olive', 'Grey'], 1, 0, 1],
  ['Washed Oversized Tee', 'T-shirts', 'men', 1499, 1999, '1576566588028-4147f3842f27', ['Charcoal', 'Cream'], 0, 1, 1],
  ['Oxford Button-Down Shirt', 'Shirts', 'men', 1999, 2499, '1596755094514-f87e34085b2c', ['Blue', 'White'], 1, 0, 1],
  ['Linen Camp Collar Shirt', 'Shirts', 'men', 1799, 0, '1602810318383-e386cc2a3ccf', ['Sand', 'Olive', 'White'], 0, 1, 1],
  ['Street Heavy Hoodie', 'Hoodies', 'men', 2499, 3299, '1556821840-3a63f95609a7', ['Black', 'Grey', 'Brown'], 1, 1, 1],
  ['Classic Zip Hoodie', 'Hoodies', 'men', 2299, 0, '1556905055-8f358a7a47b2', ['Charcoal', 'Navy'], 0, 0, 1],
  ['Fleece Crewneck Sweatshirt', 'Hoodies', 'men', 1899, 2399, '1578768079052-aa76e52ff62e', ['Cream', 'Green'], 0, 0, 0],
  ['Straight Fit Indigo Jeans', 'Jeans', 'men', 2299, 2999, '1542272604-787c3835535d', ['Indigo', 'Black'], 1, 0, 1],
  ['Relaxed Black Jeans', 'Jeans', 'men', 2199, 0, '1541099649105-f69ad21f3246', ['Black', 'Charcoal'], 0, 1, 1],
  ['Pleated Chino Trousers', 'Trousers', 'men', 1899, 0, '1624378439575-d8705ad7ae80', ['Sand', 'Olive', 'Navy'], 0, 0, 1],
  ['Cargo Utility Trousers', 'Trousers', 'men', 2099, 2699, '1517438476312-10d79c077509', ['Olive', 'Black'], 1, 1, 1],
  ['Court Low Sneakers', 'Sneakers', 'men', 3499, 4299, '1549298916-b41d501d3772', ['White', 'Black'], 1, 1, 1],
  ['Runner Mesh Sneakers', 'Sneakers', 'men', 3199, 0, '1542291026-7eec264c27ff', ['Grey', 'Navy'], 1, 0, 1],
  ['High-Top Canvas Sneakers', 'Sneakers', 'men', 2799, 3299, '1525966222134-fcfa99b8ae77', ['Black', 'White'], 0, 0, 1],
  ['Leather Derby Shoes', 'Casual Shoes', 'men', 3999, 0, '1614252369475-531eba835eb1', ['Brown', 'Black'], 0, 0, 1],
  ['Trail Sports Shoes', 'Sports Shoes', 'men', 3699, 4499, '1460353581641-37baddab0fa2', ['Grey', 'Green'], 0, 1, 1],
  ['Ribbed Cropped Tee', 'T-shirts', 'women', 999, 1299, '1503342217505-b0a15ec3261c', ['White', 'Black', 'Pink'], 1, 1, 1],
  ['Satin Slip Dress', 'Dresses', 'women', 2799, 3499, '1572804013309-59a88b7e92f1', ['Maroon', 'Black', 'Cream'], 1, 1, 1],
  ['Floral Wrap Dress', 'Dresses', 'women', 2599, 0, '1595777457583-95e059d581b8', ['Pink', 'Green'], 0, 1, 1],
  ['Poplin Relaxed Shirt', 'Shirts', 'women', 1699, 2199, '1598554747436-c9293d6a588f', ['White', 'Blue'], 1, 0, 1],
  ['Cloud Oversized Hoodie', 'Hoodies', 'women', 2399, 0, '1620799140188-3b2a02fd9a77', ['Cream', 'Grey', 'Pink'], 1, 0, 1],
  ['High-Rise Wide Jeans', 'Jeans', 'women', 2399, 2999, '1604176354204-9268737828e4', ['Blue', 'Indigo'], 1, 1, 1],
  ['Pleated Wide Trousers', 'Trousers', 'women', 2099, 0, '1594633312681-425c7b97ccd1', ['Black', 'Sand'], 0, 0, 1],
  ['Platform Sneakers', 'Sneakers', 'women', 3399, 3999, '1600185365926-3a2ce3cdb9eb', ['White', 'Pink'], 1, 1, 1],
  ['Minimal Ballet Flats', 'Casual Shoes', 'women', 1999, 0, '1543163521-1bf539c55dd2', ['Black', 'Tan'], 0, 0, 1],
  ['Cloud Runner Sports Shoes', 'Sports Shoes', 'unisex', 3899, 4799, '1595950653106-6c9ebd614d3a', ['White', 'Grey'], 1, 0, 1],
  ['Retro Skate Sneakers', 'Sneakers', 'unisex', 2999, 0, '1608231387042-66d1773070a5', ['Cream', 'Navy'], 0, 1, 1],
  ['Everyday White Sneakers', 'Sneakers', 'unisex', 2699, 3299, '1491553895911-0055eca6402d', ['White'], 1, 0, 1],
  ['Canvas Tote Bag', 'Bags', 'unisex', 899, 1199, '1590874103328-eac38a683ce7', ['Cream', 'Black'], 0, 0, 1],
  ['Urban Backpack', 'Bags', 'unisex', 2299, 0, '1553062407-98eeb64c6a62', ['Black', 'Olive'], 1, 1, 1],
  ['Crossbody Sling Bag', 'Bags', 'unisex', 1499, 1899, '1548036328-c9fa89d128fa', ['Black', 'Tan'], 0, 0, 1],
  ['Mini Leather Handbag', 'Bags', 'women', 2799, 0, '1584917865442-de89df76afd3', ['Tan', 'Black'], 1, 1, 1],
  ['Six-Panel Cap', 'Caps', 'unisex', 699, 0, '1588850561407-ed78c282e89b', ['Black', 'Sand', 'Navy'], 0, 1, 1],
  ['Washed Dad Cap', 'Caps', 'unisex', 799, 999, '1521369909029-2afed882baee', ['Olive', 'Cream'], 0, 0, 1],
  ['Minimal Steel Watch', 'Watches', 'unisex', 3299, 3999, '1523275335684-37898b6baf30', ['Silver', 'Black'], 1, 0, 1],
  ['Leather Strap Watch', 'Watches', 'men', 2899, 0, '1524592094714-0f0654e20314', ['Brown', 'Black'], 0, 1, 1],
  ['Reversible Leather Belt', 'Belts', 'men', 1299, 1699, '1624222247344-550fb60583dc', ['Black', 'Brown'], 0, 0, 1],
  ['Woven Canvas Belt', 'Belts', 'unisex', 799, 0, '1553704571-c32d20e6ed6f', ['Olive', 'Navy'], 0, 0, 1],
  ['Aviator Sunglasses', 'Sunglasses', 'unisex', 1599, 1999, '1511499767150-a48a237f0083', ['Gold', 'Black'], 1, 0, 1],
  ['Round Frame Sunglasses', 'Sunglasses', 'unisex', 1399, 0, '1572635196237-14b3f281503f', ['Black', 'Tan'], 0, 1, 1]
];

const PRODUCTS = RAW.map((r, i) => ({
  id: i + 1, name: r[0], cat: r[1], grp: GRP[r[1]] || r[1], gender: r[2], price: r[3], original: r[4] || null,
  photo: r[5], image: IMG(r[5]), colors: r[6], sizes: sizesFor(r[1]),
  description: COPY[r[1]][0], material: COPY[r[1]][1], care: COPY[r[1]][2],
  featured: !!r[7], isNew: !!r[8], inStock: !!r[9]
}));
// gallery: own photo first, then two other photos from the same category
PRODUCTS.forEach(p => {
  const pool = PRODUCTS.filter(q => q.id !== p.id && q.cat === p.cat).concat(PRODUCTS.filter(q => q.id !== p.id && q.grp === p.grp && q.cat !== p.cat));
  p.images = [p.photo, ...pool.slice(0, 2).map(q => q.photo)].map(x => IMG(x, 1100));
});

const getProduct = id => PRODUCTS.find(p => p.id === Number(id));
const discountPct = p => (p.original ? Math.round((1 - p.price / p.original) * 100) : 0);
const inScope = (p, scope) => scope === 'men' ? p.gender !== 'women' && p.grp !== 'Dresses'
  : scope === 'women' ? p.gender !== 'men'
  : scope === 'footwear' ? ['Sneakers', 'Shoes'].includes(p.grp)
  : scope === 'accessories' ? p.grp === 'Accessories' : true;
