# Regenerates the HTML pages (optional dev helper). Run: python3 tools/gen_pages.py
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
U = lambda i, w=1600: f"https://images.unsplash.com/photo-{i}?auto=format&fit=crop&w={w}&q=80"
BASE_JS = ['products', 'cart', 'wishlist', 'main']

def page(fn, title, key, body, js=(), css=(), scope=None, desc=''):
    links = ''.join(f'<link rel="stylesheet" href="css/{c}.css">\n' for c in ['style'] + list(css) + ['responsive'])
    scripts = ''.join(f'<script src="js/{j}.js"></script>\n' for j in BASE_JS + list(js))
    sc = f' data-scope="{scope}"' if scope else ''
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc or 'VISER – everyday essentials, streetwear and footwear from Manipur.'}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://images.unsplash.com">
{links}</head>
<body data-page="{key}"{sc}>
<div id="site-header"></div>
<main id="main">
{body}
</main>
<div id="site-footer"></div>
{scripts}</body>
</html>
'''
    open(os.path.join(ROOT, fn), 'w', encoding='utf-8').write(html)

SORT = '<option value="featured">Featured</option><option value="newest">Newest</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option>'
SHOP = f'''<div class="wrap shop-wrap" id="shop-root"><span id="grid-top"></span>
<div class="shop-layout"><aside class="filters" id="filters" aria-label="Filters"></aside>
<div class="shop-main"><div class="toolbar"><p id="count" aria-live="polite"></p><div class="tb-r"><button id="filterBtn" type="button">Filters</button><label class="sort-sel">Sort by <select id="sort">{SORT}</select></label></div></div>
<div class="chips" id="chips" hidden></div><div class="pgrid" id="grid"></div>
<div class="more"><button class="btn ghost" id="loadMore" type="button">Load more</button></div></div></div></div>'''

def promo(img, h, p, cta, href):
    return f'''<section class="promo" data-dark><img src="{U(img)}" alt="{h.title()}" loading="lazy"><div class="promo-in reveal"><h2>{h}</h2><p>{p}</p><a class="btn light" href="{href}">{cta}</a></div></section>'''

def collection(fn, key, title, scope, himg, pos, h1, hp, ih, ip, tiles, pimg, ph, pp, pcta, phref, n=4):
    t = ''.join(f'<a class="ctile" href="#grid-top" data-set-cat="{c}"><img src="{U(i,800)}" alt="{c}" loading="lazy"><span>{c}<small>{s}</small></span></a>' for c, s, i in tiles)
    body = f'''<section class="phero" data-dark style="--pos:{pos}"><img src="{U(himg)}" alt="{h1}"><div class="phero-in"><h1>{h1}</h1><p>{hp}</p></div></section>
<div class="wrap"><div class="intro"><h2>{ih}</h2><p>{ip}</p></div>
<div class="ctiles" style="--n:{n}">{t}</div></div>
<section class="section tight arrivals-sec"><div class="wrap"><div class="sec-head"><h2 class="sec-title">New arrivals</h2></div><div class="pgrid" id="arrivals"></div></div></section>
<div class="wrap"><div class="sec-head" style="margin-top:20px"><h2 class="sec-title">The full collection</h2></div></div>
{SHOP}
{promo(pimg, ph, pp, pcta, phref)}'''
    page(fn, title, key, body, ['shop'], ['shop'], scope)

# ---------------- HOME ----------------
slides = [
 ('1489987707025-afc232f7ea0f', '50% 25%', '50% 20%', 'New season · Menswear', 'Wear your<br>own story.', 'Everyday essentials. Distinctive style. Made for the way you move.', 'Explore collection', 'shop.html'),
 ('1469334031218-e382a71b716b', '50% 25%', '55% 20%', 'The women’s edit', 'Easy.<br>Confident.<br>Yours.', 'Soft layers, clean lines and pieces that go from morning to midnight.', 'Shop women', 'women.html'),
 ('1542291026-7eec264c27ff', '50% 60%', '40% 50%', 'Footwear', 'Step out<br>in style.', 'Sneakers and shoes built for long days, short commutes and everything in between.', 'Shop footwear', 'footwear.html'),
]
sl = ''.join(f'''<div class="slide{' on' if i==0 else ''}" style="--pos:{p};--pos-m:{m}"><img src="{U(im)}" alt="{lab}"{'' if i==0 else ' loading="lazy"'}><div class="slide-in"><span class="label">{lab}</span>{'<h1>' if i==0 else '<h2>'}{h}{'</h1>' if i==0 else '</h2>'}<p>{d}</p><a class="btn light" href="{href}">{cta}</a></div></div>''' for i, (im, p, m, lab, h, d, cta, href) in enumerate(slides))
arrow = lambda d: f'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="{d}"/></svg>'
cats = [('Men’s Collection', 'Tees, shirts, hoodies and denim built to be worn on repeat.', '1488161628813-04466f872be2', 'men.html'),
        ('Women’s Collection', 'Easy dresses, relaxed shirts and layers with attitude.', '1485968579580-b6d095142e6e', 'women.html'),
        ('Sneakers &amp; Footwear', 'From court classics to everyday runners.', '1595950653106-6c9ebd614d3a', 'footwear.html'),
        ('Accessories', 'Bags, caps, watches and the small details.', '1584917865442-de89df76afd3', 'accessories.html')]
ct = ''.join(f'<a class="cat" href="{h}" data-dark><img src="{U(i,1000)}" alt="{n}" loading="lazy"><div class="cat-t"><h3>{n}</h3><p>{d}</p><span class="arrow-link">Explore</span></div></a>' for n, d, i, h in cats)
rows = [('Everyday Essentials', 'The pieces you reach for first. Soft tees, clean shirts and easy trousers that make getting dressed simple.', '1521572163474-6864f9cf17ab', 'shop.html?cat=T-shirts', 'Shop essentials'),
        ('Streetwear', 'Heavyweight hoodies, relaxed denim and utility cuts with a little more attitude.', '1556821840-3a63f95609a7', 'shop.html?cat=Hoodies', 'Shop streetwear'),
        ('Footwear', 'Sneakers and shoes that go the distance, cushioned, grippy and good-looking.', '1460353581641-37baddab0fa2', 'footwear.html', 'Shop footwear'),
        ('Latest Picks', 'Fresh in and worth a look. The newest additions to the VISER lineup.', '1515886657613-9f3515b0c78f', 'shop.html?sort=newest', 'See what’s new')]
rw = ''.join(f'<div class="crow reveal"><div class="crow-img" data-dark><img src="{U(i,1200)}" alt="{n}" loading="lazy"></div><div><h3>{n}</h3><p>{d}</p><a class="btn ghost" href="{h}">{c}</a></div></div>' for n, d, i, h, c in rows)
ig = ''.join(f'<a href="https://www.instagram.com/viser._.manipur/" target="_blank" rel="noopener" aria-label="View VISER on Instagram"><img src="{U(i,600)}" alt="Fashion inspiration {k+1}" loading="lazy"></a>' for k, i in enumerate(['1529139574466-a303027c1d8b', '1515886657613-9f3515b0c78f', '1496747611176-843222e1e57c', '1483985988355-763728e1935b', '1509631179647-0177331693ae', '1523381210434-271e8be1f52b']))
home = f'''<section class="hero" data-dark aria-label="Featured collections">{sl}
<div class="hero-dots" aria-label="Slides"></div><div class="hero-ctl"><button data-prev aria-label="Previous slide">{arrow('M15 5l-7 7 7 7')}</button><button data-next aria-label="Next slide">{arrow('M9 5l7 7-7 7')}</button></div></section>
<div class="strip"><div class="wrap strip-in"><div><b>Free shipping</b>On orders above ₹1,999</div><div><b>Easy exchanges</b>Policy details to be confirmed</div><div><b>Made for everyday</b>Fits, fabrics and finishes we trust</div></div></div>
<section class="section"><div class="wrap"><div class="sec-head"><div><h2 class="sec-title">Shop by category</h2><p class="sec-sub">Four ways into VISER.</p></div></div><div class="cats">{ct}</div></div></section>
<section class="section tight"><div class="wrap"><div class="sec-head"><div><h2 class="sec-title">New arrivals</h2><p class="sec-sub">Just landed. Limited sizes move fast.</p></div><a class="arrow-link" href="shop.html?sort=newest">View all</a></div><div class="pgrid" data-grid="new" data-n="8"></div></div></section>
<section class="story"><div class="story-img" data-dark><img src="{U('1441986300917-64674bd600d8',1600)}" alt="VISER store rail" loading="lazy"></div><div class="story-t reveal"><h2>More than<br>what you wear.</h2><p>Style isn’t about following every trend. It’s about finding what feels right, expressing who you are, and making everyday moments your own.</p><a class="btn" href="about.html">Discover VISER</a></div></section>
<section class="section"><div class="wrap"><div class="sec-head"><div><h2 class="sec-title">Shop by collection</h2></div></div>{rw}</div></section>
<section class="section tight"><div class="wrap"><div class="sec-head"><div><h2 class="sec-title">Best sellers</h2><p class="sec-sub">The pieces people keep coming back for.</p></div><a class="arrow-link" href="shop.html">Shop all</a></div><div class="pgrid" data-grid="best" data-n="8"></div></div></section>
{promo('1523381210434-271e8be1f52b', 'Your next everyday favorite is here.', 'Fresh pieces, easy fits and a wardrobe that works harder.', 'Shop now', 'shop.html')}
<section class="section"><div class="wrap"><div class="sec-head"><div><h2 class="sec-title">Follow @viser._.manipur</h2><p class="sec-sub">See what’s new on Instagram.</p></div><a class="arrow-link" href="https://www.instagram.com/viser._.manipur/" target="_blank" rel="noopener">Open Instagram</a></div><div class="ig-grid">{ig}</div><p class="ig-note">Style inspiration images shown for layout. Tap any tile to visit VISER on Instagram.</p></div></section>
<section class="section news"><div class="wrap"><h2>Join the list</h2><p class="sub">New drops and offers, straight to your inbox. No spam.</p><div><form class="nl-form" novalidate><input type="email" placeholder="Your email address" aria-label="Email address"><button type="submit">Subscribe</button></form><p class="nl-msg" role="status"></p></div></div></section>'''
page('index.html', 'VISER – Wear your own story', 'home', home, desc='VISER – everyday essentials, streetwear and footwear from Manipur.')

# ---------------- SHOP ----------------
page('shop.html', 'Shop – VISER', 'shop', f'''<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <span>Shop</span></nav>
<div class="page-title"><h1>Shop</h1><p class="sec-sub" style="max-width:60ch">Everything VISER, in one place. Filter by category, size, colour and price, or sort by what’s new.</p></div></div>
{SHOP}''', ['shop'], ['shop'], 'all')

collection('men.html', 'men', 'Men – VISER', 'men', '1507679799987-c73779587ccf', '50% 20%', 'Men', 'Clean cuts, heavyweight fabrics and everyday pieces with an edge.', 'Dressed for the day, not the dress code.', 'Our menswear starts with the basics done right: tees with weight, shirts that sit properly, denim that breaks in and hoodies you’ll live in. Build a wardrobe that works from campus to the weekend.', [('T-shirts', 'Everyday basics', '1521572163474-6864f9cf17ab'), ('Hoodies', 'Heavyweight layers', '1556821840-3a63f95609a7'), ('Jeans', 'Straight & relaxed', '1542272604-787c3835535d'), ('Sneakers', 'Court to street', '1549298916-b41d501d3772')], '1556821840-3a63f95609a7', 'Layer up. Keep it easy.', 'Heavyweight hoodies and relaxed denim, ready for the season.', 'Shop hoodies', 'shop.html?cat=Hoodies')
collection('women.html', 'women', 'Women – VISER', 'women', '1483985988355-763728e1935b', '50% 25%', 'Women', 'Easy silhouettes, soft layers and pieces that move with you.', 'Effortless, with a point of view.', 'From fluid dresses to relaxed shirts and wide-leg denim, the women’s edit is about comfort that still turns heads. Mix, layer and make it yours.', [('Dresses', 'Day to night', '1572804013309-59a88b7e92f1'), ('Shirts', 'Relaxed & crisp', '1598554747436-c9293d6a588f'), ('Jeans', 'High-rise & wide', '1604176354204-9268737828e4'), ('Sneakers', 'Platforms & classics', '1600185365926-3a2ce3cdb9eb')], '1572804013309-59a88b7e92f1', 'A dress for every plan.', 'Fluid, light and easy to style from morning to midnight.', 'Shop dresses', 'shop.html?cat=Dresses')
collection('footwear.html', 'footwear', 'Footwear – VISER', 'footwear', '1542291026-7eec264c27ff', '50% 55%', 'Footwear', 'Sneakers and shoes for long days and busy streets.', 'Start from the ground up.', 'The right pair changes everything. Explore sneakers for daily wear, casual shoes that dress up easily, and sports shoes with the cushioning to keep up.', [('Sneakers', 'Everyday classics', '1491553895911-0055eca6402d'), ('Casual Shoes', 'Smart & comfortable', '1614252369475-531eba835eb1'), ('Sports Shoes', 'Built to move', '1460353581641-37baddab0fa2')], '1608231387042-66d1773070a5', 'Find your daily pair.', 'Cushioned, grippy and good-looking.', 'Shop sneakers', 'footwear.html', 3)
collection('accessories.html', 'accessories', 'Accessories – VISER', 'accessories', '1584917865442-de89df76afd3', '50% 40%', 'Accessories', 'The details that finish the look.', 'Small things, big difference.', 'Bags that carry everything, caps that finish the fit, watches and belts that quietly do their job. Pick the details that feel like you.', [('Bags', 'Totes, packs & slings', '1553062407-98eeb64c6a62'), ('Caps', 'Easy finishing touch', '1588850561407-ed78c282e89b'), ('Watches', 'Understated time', '1523275335684-37898b6baf30'), ('Belts', 'Leather & woven', '1624222247344-550fb60583dc'), ('Sunglasses', 'UV-protected', '1511499767150-a48a237f0083')], '1590874103328-eac38a683ce7', 'Carry it with confidence.', 'Bags built for real days.', 'Shop bags', 'accessories.html', 5)

# ---------------- PRODUCT / CART / CHECKOUT / WISHLIST ----------------
page('product.html', 'Product – VISER', 'shop', '<div id="pd-root"></div>', ['product'], ['product'])
page('cart.html', 'Your bag – VISER', 'cart', '<div class="wrap"><div class="page-title"><h1>Your bag</h1></div><div style="padding:24px 0 80px" id="cart-root"></div></div>', [], ['product'])
page('checkout.html', 'Checkout – VISER', 'cart', '<div class="wrap"><nav class="crumbs"><a href="cart.html">Bag</a> / <span>Checkout</span></nav><div class="page-title"><h1>Checkout</h1><p class="note" style="margin-top:8px">Demo checkout. No payment is processed and no order is sent to the store.</p></div><div style="padding:24px 0 80px" id="checkout-root"></div></div>', ['checkout'], ['product'])
page('wishlist.html', 'Wishlist – VISER', 'wishlist', '<div class="wrap"><div class="page-title"><h1>Wishlist</h1></div><div style="padding:24px 0 80px" id="wish-root"></div></div>', [], ['product'])

# ---------------- ABOUT ----------------
about = f'''<section class="phero" data-dark style="--pos:50% 30%"><img src="{U('1441986300917-64674bd600d8')}" alt="VISER store"><div class="phero-in"><h1>About VISER</h1><p>A clothing and lifestyle store from Manipur, built around everyday style.</p></div></section>
<section class="section"><div class="wrap two-col"><div class="reveal"><h2 class="sec-title" style="margin-bottom:24px">Style that feels like you.</h2><div class="prose"><p>VISER started with a simple idea: getting dressed should feel good and shouldn’t be complicated. We bring together clothing, footwear and accessories that look sharp, wear comfortably and fit into real life.</p><p>We’re rooted in Manipur, and we care about a fashion culture that is young, confident and expressive. Our pieces are chosen to work together, so you can build outfits that feel like your own rather than copying someone else’s.</p></div></div><img src="{U('1515886657613-9f3515b0c78f',1000)}" alt="Style at VISER" loading="lazy"></div></section>
<section class="section tight" style="background:#fff"><div class="wrap"><h2 class="sec-title" style="margin-bottom:40px">What we believe</h2><div class="values"><div class="reveal"><h3>Wear it your way</h3><p>Trends come and go. We’d rather give you good basics and bold options, then let you decide what works.</p></div><div class="reveal"><h3>Comfort comes first</h3><p>If it doesn’t feel good all day, it doesn’t make the cut. Fabrics, fits and finishes matter.</p></div><div class="reveal"><h3>Honest and simple</h3><p>Clear prices, clear photos, clear sizing. A straightforward shopping experience from start to finish.</p></div></div></div></section>
<section class="section"><div class="wrap two-col"><img src="{U('1489987707025-afc232f7ea0f',1000)}" alt="Menswear lifestyle" loading="lazy"><div class="reveal"><h2 class="sec-title" style="margin-bottom:24px">Why VISER</h2><div class="prose"><p>One place for the whole look: tees and hoodies, denim and trousers, sneakers and shoes, bags and the little extras. Everything sits in the same visual world, so it works together.</p><p>We keep our range focused and update it often. When you find something you love, you’ll find it in your size.</p></div><p style="margin-top:28px"><a class="btn" href="shop.html">Explore collections</a></p></div></div></section>
{promo('1523381210434-271e8be1f52b', 'Wear your own story.', 'Find the pieces that feel right.', 'Shop VISER', 'shop.html')}'''
page('about.html', 'About – VISER', 'about', about)

# ---------------- CONTACT ----------------
contact = f'''<section class="phero" data-dark style="min-height:clamp(260px,32vw,380px);--pos:50% 40%"><img src="{U('1441986300917-64674bd600d8')}" alt="VISER"><div class="phero-in"><h1>Contact</h1><p>Questions about an order, a size or a style? Say hello.</p></div></section>
<section class="section tight"><div class="wrap contact-grid"><div><h2 class="sec-title" style="margin-bottom:24px">Send a message</h2>
<form id="contactForm" novalidate><div class="two"><div class="field"><label for="cn">Name</label><input id="cn" name="name" autocomplete="name"><small>Please enter your name</small></div><div class="field"><label for="ce">Email</label><input id="ce" name="email" type="email" autocomplete="email"><small>Please enter a valid email</small></div></div>
<div class="field"><label for="cp">Phone (optional)</label><input id="cp" name="phone" type="tel" inputmode="numeric" autocomplete="tel"><small>Enter a valid 10-digit mobile number</small></div>
<div class="field"><label for="cm">Message</label><textarea id="cm" name="message"></textarea><small>Please write at least 10 characters</small></div>
<button class="btn" type="submit">Send message</button><p id="contactOut" role="status" hidden></p></form></div>
<div class="info-list"><div><h3>Store</h3><p>Imphal, Manipur, India<br><span class="ph-tag">[Store address – to be added]</span></p></div><div><h3>Phone</h3><p><span class="ph-tag">[Phone number – to be added]</span></p></div><div><h3>Email</h3><p><span class="ph-tag">[Email address – to be added]</span></p></div><div><h3>Hours</h3><p><span class="ph-tag">[Opening hours – to be added]</span></p></div><div><h3>Instagram</h3><p><a class="link-btn" href="https://www.instagram.com/viser._.manipur/" target="_blank" rel="noopener">@viser._.manipur</a></p></div></div></div>
<div class="wrap"><div class="map-box"><div><b>Find us in Manipur</b>Map and exact location to be added once the store address is confirmed.</div></div></div></section>
<section class="wrap"><div class="policy" id="shipping"><h2>Shipping information</h2><p>Orders above ₹1,999 ship free; otherwise a flat ₹99 applies. Delivery estimates: 4–7 working days. <span class="ph-tag">[Final shipping policy – to be confirmed by VISER]</span></p></div>
<div class="policy" id="returns"><h2>Returns &amp; exchange</h2><p><span class="ph-tag">[Return and exchange window and conditions – to be confirmed by VISER]</span></p></div>
<div class="policy" id="privacy"><h2>Privacy policy</h2><p><span class="ph-tag">[Privacy policy text – to be added before launch]</span></p></div>
<div class="policy" id="terms"><h2>Terms &amp; conditions</h2><p><span class="ph-tag">[Terms and conditions – to be added before launch]</span></p></div></section>'''
page('contact.html', 'Contact – VISER', 'contact', contact)
print('pages generated')
