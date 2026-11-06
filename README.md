# VISER – Fashion E-commerce (HTML · CSS · Vanilla JS)

A complete multi-page storefront prototype for VISER, a clothing & lifestyle store in Manipur, India.
No build step, no backend, no dependencies.

## Run it
1. Open the `VISER-ECOMMERCE` folder in VS Code.
2. Install the **Live Server** extension → right-click `index.html` → **Open with Live Server**.
   (Any static server works, e.g. `npx serve` or `python3 -m http.server`.)

Needs an internet connection for the product photos (Unsplash) and fonts (Google Fonts).

## Pages
`index` · `shop` · `men` · `women` · `footwear` · `accessories` · `product?id=N` · `cart` · `checkout` · `about` · `contact` · `wishlist`

## Structure
```
css/   style.css (base, header/footer, cards, homepage)  shop.css (filters, collection pages)
       product.css (product, cart, checkout, wishlist, contact)  responsive.css (all breakpoints)
js/    products.js  – ALL product data (41 products) + shared helpers  ← edit products here
       cart.js · wishlist.js – localStorage state + page rendering
       main.js      – header/footer, mobile menu, search, quick view, hero slider, toasts, forms
       shop.js      – filters / sorting / load more (shop + 4 collection pages)
       product.js · checkout.js
tools/ check-images.js (verifies image URLs), gen_pages.py (regenerates HTML pages)
```
Header and footer are injected by `main.js`, so a nav change is made once.

## Features
Working filters (category, gender, price, size, colour, availability), active-filter chips + Clear all, sorting, search overlay and `?q=` search, load more, mobile filter drawer, quick view, product gallery (swipeable), colour/size/quantity selection carried to cart, wishlist, cart with quantity/remove/shipping (free above ₹1,999, otherwise ₹99), checkout validation and order confirmation. Cart and wishlist persist in `localStorage`.

## Things to know / replace before launch
- **Demo only.** Checkout takes no payment and sends no order; contact and newsletter forms are not sent anywhere. Connect a backend or service when ready.
- **Brand info was not available.** Instagram blocks automated access, so no logo, colours, or product photos were taken from @viser._.manipur. VISER is a typographic wordmark. Replace the stock photos with your own product photography (edit `js/products.js` and `tools/gen_pages.py`, or the HTML directly).
- **Placeholders** (marked in the UI): store address, phone, email, opening hours, shipping/returns/privacy/terms text, size-chart numbers, delivery estimates. The star rating on product pages is a labelled demo placeholder.
- **Images:** photos load from Unsplash. If one ever fails, a neutral VISER placeholder is shown instead of a broken image. Run `node tools/check-images.js` to list any dead image IDs. Product galleries reuse other photos from the same category, and colour swatches do not change the photo.
- Prices, products and discounts are sample data.
