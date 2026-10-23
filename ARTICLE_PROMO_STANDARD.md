# Article promotion standard

Every new article must include the existing sticky article sidebar with Yuji's portrait and these two promises:

- TikTok: **Watch LIVE Japan on TikTok**
- DraMap: **Learn Japanese while playing**

Use the production URLs already present in the site. Keep the sidebar visible while a desktop reader scrolls. On screens 850px wide or narrower, every article must include the shared `.mobile-promo-bar`: Yuji's portrait, a direct `LIVE Japan` TikTok button, and a direct `Learn Japanese` DraMap button. Both buttons must remain visible even on narrow phones. Reserve bottom space with the safe-area inset so the bar never covers article text, links, video controls, or the iPhone home indicator. Do not create an article without Yuji's face, the TikTok LIVE Japan promise, and the DraMap Japanese-learning promise.

Every daily homepage must also include:

- A prominent `.primary-story-cta` immediately after the hero standfirst, before the byline. It must link directly to that day's main article and read **Read the full story**.
- The shared `.home-promo-dock` on desktop, containing Yuji's face, a direct **Watch LIVE Japan with Yuji** TikTok link, and a direct **Learn Japanese while playing** DraMap link.
- The shared `.mobile-promo-bar` on the homepage at 850px and narrower.

The desktop article sidebar must fit both the TikTok and DraMap calls to action inside a typical 768px-tall content viewport. Keep its portrait compact and ensure `.article-aside .button` remains fully visible without requiring the reader to reach the bottom of the article.

The homepage desktop promotion must remain fixed at the browser edge while scrolling. When there is not enough width to keep it away from editorial copy, switch to the shared mobile promotion bar early; promotional UI must never cover article or homepage text.

For safety, weather, disaster, health, crime, and other public-interest stories, place confirmed hazards, official guidance, and the reporting cutoff before narrative suspense. Use `.safety-note` near the top of the article and link to the live official source. Editorial curiosity must never delay actionable information.

Every new `NewsArticle` must include canonical, Open Graph title/description/image/URL, `datePublished`, `dateModified`, author, publisher, image, and `mainEntityOfPage`. Add the production URL and JST `lastmod` to `dist/sitemap.xml`. Images lower in the article use lazy loading; all images have explicit dimensions, alt text, a subject/time distinction, credit, source, license, and any modification note.

Required visual QA remains 1366×768, at least 1440×900, and 390×844 for both the homepage and main article. Verify the final desktop-sidebar width and first mobile-bar width around the 850px and 1200px breakpoints. The report must name only sizes actually rendered.

Daily editions should preserve at least four earlier-edition links on the homepage and add contextual links from each new long-form article to at least one existing article. Historical or general reference images must say explicitly in the visible caption that they do not depict the current event. A large month-on-month percentage from a volatile or small industry base must be labeled as such rather than presented as a national trend.

The homepage navigation and earlier-editions strip must also link to `archive.html`. The archive is the complete public index of every story, grouped by publication month and ordered newest first. Every new article must be added to the archive with its visible publication date and category, and the displayed total and monthly count must be updated. Keep all stories visible within their month; introduce numbered pagination only when a month becomes unwieldy, and never remove older pages from navigation or the sitemap.

For official scientific or government media used in daily reporting, verify the source's current media-use policy before copying any asset. State whether a photograph shows the current event, an earlier unveiling, a test, or a planned-route diagram. For copyrighted entertainment coverage, prefer an official video embed; if a stable share image is needed, use an original editorial data graphic rather than copying character art.
