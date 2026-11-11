# Mariya Builders — Website

**Turning your dreams into reality** — *every brick we lay holds a promise to your family.*

A static multi-page website for Mariya Builders, Market Road, Rajakkad, Idukki. It's plain HTML, CSS and JS with no build step: open `index.html` in a browser, or host the folder on any static host (GitHub Pages, Netlify, etc.).

## Pages
| Page | File |
|------|------|
| Home | `index.html` |
| About | `about.html` |
| Services (plan, estimate, full material work, house, buildings, sub work, renovation, interior) | `services.html` |
| Projects gallery (with lightbox) | `projects.html` |
| Ratings & reviews + write-a-review form | `reviews.html` |
| Contact (call, WhatsApp, enquiry form, map) | `contact.html` |

## Contact behaviour
- Every **Contact Now** button is a `tel:+917034353114` link. On a phone, tapping it opens the dialler with the number ready to call.
- On a laptop or desktop (which usually can't place calls), the button opens a call box instead. It shows the number, a QR code (`images/call-qr.svg`) that dials when scanned with a phone, a copy button, and a "call from this device" option.
- Phones get a fixed **Call Now / WhatsApp** bar at the bottom of the screen; larger screens get floating call and WhatsApp buttons.
- The enquiry form and the review form open WhatsApp with the message already filled in, so no server is needed.

## Updating content
- **Reviews:** edit `js/reviews.js`. The three starter entries are *samples* (they show a "Sample" tag). Replace them with real customer reviews and remove `sample: true`. The average rating and star breakdown are calculated automatically.
- **Photos:** images live in `images/`. The Projects page also has spots for
  `images/stone-cladding-home.jpg` and `images/modern-two-storey.jpg`. Add photos with those names and they appear automatically; until then those spots stay hidden.
- Header and footer are repeated in each HTML file, so change the phone number or address in every page (search for `7034353114`).
