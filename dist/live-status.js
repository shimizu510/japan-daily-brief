(function () {
  'use strict';

  const comments = document.createElement('script');
  const siteRoot = location.pathname.includes('/japan-daily-brief/') ? '/japan-daily-brief' : '/japan-unfolded';
  const assetRoot = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? '' : siteRoot;
  const searchStyles = document.createElement('link');
  searchStyles.rel = 'stylesheet';
  searchStyles.href = assetRoot + '/search.css?v=1';
  document.head.appendChild(searchStyles);
  comments.src = siteRoot + '/comments.js?v=3';
  comments.defer = true;
  document.head.appendChild(comments);

  function installSiteSearch() {
    const header = document.querySelector('header');
    if (!header) return;
    const search = document.createElement('section');
    search.className = 'site-search';
    search.setAttribute('aria-label', 'Search this site');
    search.innerHTML = '<form class="site-search-form"><label for="site-search-input">Search every story</label><div><input id="site-search-input" type="search" minlength="2" placeholder="Try: population, anime, Kyoto…" autocomplete="off"><button type="submit">Search</button></div><p>Searches titles and article text—not only exact headlines.</p></form><div class="site-search-panel" hidden><div class="site-search-status" aria-live="polite"></div><ol class="site-search-results"></ol></div>';
    header.insertAdjacentElement('afterend', search);
    const form = search.querySelector('form');
    const input = search.querySelector('input');
    const panel = search.querySelector('.site-search-panel');
    const status = search.querySelector('.site-search-status');
    const results = search.querySelector('.site-search-results');
    let pagesPromise;

    function loadPages() {
      if (pagesPromise) return pagesPromise;
      status.textContent = 'Reading the archive…';
      pagesPromise = fetch(assetRoot + '/sitemap.xml').then(r => r.text()).then(xml => {
        const urls = Array.from(new DOMParser().parseFromString(xml, 'application/xml').querySelectorAll('loc')).map(n => n.textContent).filter(url => /\.html$/.test(url) && !/(about|archive|google)/.test(url));
        return Promise.all(urls.map(url => {
          const target = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? new URL(url).pathname.split('/').pop() : url;
          return fetch(target).then(r => r.text()).then(html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          doc.querySelectorAll('nav,footer,aside,script,style,.mobile-promo-bar,.home-promo-dock').forEach(n => n.remove());
          return { url: target, title: (doc.querySelector('h1') || doc.querySelector('title')).textContent.trim(), description: (doc.querySelector('meta[name="description"]') || {}).content || '', text: (doc.querySelector('main') || doc.body).textContent.replace(/\s+/g, ' ').trim() };
        }).catch(() => null);
        }));
      }).then(items => items.filter(Boolean));
      return pagesPromise;
    }

    function snippet(text, terms) {
      const lower = text.toLowerCase();
      let at = lower.length;
      terms.forEach(term => { const found = lower.indexOf(term); if (found >= 0 && found < at) at = found; });
      if (at === lower.length) at = 0;
      return (at > 70 ? '…' : '') + text.slice(Math.max(0, at - 70), at + 190).trim() + (at + 190 < text.length ? '…' : '');
    }

    async function runSearch(query) {
      const terms = query.toLowerCase().trim().split(/\s+/).filter(t => t.length > 1);
      panel.hidden = false;
      results.innerHTML = '';
      if (!terms.length) { status.textContent = 'Enter at least two letters.'; return; }
      const pages = await loadPages();
      const ranked = pages.map(page => {
        const title = page.title.toLowerCase(), desc = page.description.toLowerCase(), body = page.text.toLowerCase();
        let score = 0;
        terms.forEach(term => { if (title.includes(term)) score += 60; if (desc.includes(term)) score += 24; score += Math.min(20, body.split(term).length - 1); });
        if (body.includes(terms.join(' '))) score += 25;
        return { page, score };
      }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);
      status.textContent = ranked.length ? ranked.length + ' likely match' + (ranked.length === 1 ? '' : 'es') : 'No matching stories found.';
      ranked.forEach(({page}) => {
        const li = document.createElement('li');
        li.innerHTML = '<a></a><p></p>';
        li.querySelector('a').href = page.url;
        li.querySelector('a').textContent = page.title;
        li.querySelector('p').textContent = snippet(page.text, terms);
        results.appendChild(li);
      });
    }
    form.addEventListener('submit', e => { e.preventDefault(); runSearch(input.value); });
  }

  function addHomepageArchiveStories() {
    if (!/(?:\/japan-daily-brief)?\/(?:index\.html)?$/.test(location.pathname)) return;
    const column = document.querySelector('.grid.wrap > div');
    if (!column) return;
    column.insertAdjacentHTML('beforeend', '<section class="home-more-stories"><div class="home-more-heading"><div><span class="label">Continue reading</span><h2>Next 4 earlier stories · October 15–20</h2></div><a href="archive.html">Choose by date or browse all 28 →</a></div><div class="home-more-grid"><a href="japan-mmx-five-years-ten-grams.html"><time>Oct. 20</time><b>At 4:41 a.m., Japan began a five-year hunt for ten grams.</b><span>Science · Space</span></a><a href="the-stage-has-no-star.html"><time>Oct. 20</time><b>The star is not the whole stage.</b><span>Culture · Noh</span></a><a href="reborn-vongola-festa-twenty-years.html"><time>Oct. 17</time><b>A baby hitman disappeared from TV. His “family” never left.</b><span>Anime · Culture</span></a><a href="the-order-rose-the-total-fell.html"><time>Oct. 15</time><b>The order rose. Japan’s machinery total still fell.</b><span>Economy</span></a></div></section>');
  }

  installSiteSearch();
  addHomepageArchiveStories();

  const dragonBallVisual = 'https://en.dragon-ball-official.com/dragonball/en/news/2026/09/02/%E8%B6%85%E9%96%8B%E5%B9%95%E3%83%88%E3%83%AC%E3%83%BC%E3%83%A9%E3%83%BCEN%E8%A8%98%E4%BA%8B_%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB%E6%A1%88.jpg';

  function showOfficialDragonBallVisual() {
    const isArticle = location.pathname.endsWith('/dragon-ball-beerus-world-japan-built.html');
    const isHome = /\/japan-unfolded\/(?:index\.html)?$/.test(location.pathname);
    if (!isArticle && !isHome) return;
    const image = document.querySelector(isArticle ? '.story-hero-figure img' : '.hero-media img');
    if (!image) return;
    const fallback = image.src;
    image.addEventListener('error', function restoreFallback() {
      image.removeEventListener('error', restoreFallback);
      image.src = fallback;
    });
    image.src = dragonBallVisual;
    image.alt = 'Official Dragon Ball Super: Beerus Super Surge visual featuring Goku, Beerus and other characters';
    image.classList.add('official-dragon-ball-visual');
    image.loading = 'eager';
    image.fetchPriority = 'high';
    if (isArticle) {
      const caption = document.querySelector('.story-hero-figure figcaption');
      if (caption) caption.innerHTML = 'Official <i>Dragon Ball Super: Beerus</i> Super Surge visual. Source: <a href="https://en.dragon-ball-official.com/news/01_4425.html" target="_blank" rel="noopener noreferrer">Dragon Ball Official Site ↗</a> · ©BIRD STUDIO/SHUEISHA, TOEI ANIMATION';
    }
  }

  showOfficialDragonBallVisual();

  const endpoint = 'https://firestore.googleapis.com/v1/projects/poketquest-3a73d/databases/(default)/documents/publicSiteStatus/tiktokLive';
  const defaultLiveURL = 'https://www.tiktok.com/@yuji.shimizu2/live';
  const liveLinks = 'a[href*="tiktok.com/@yuji.shimizu2"]';
  const visitEndpoint = 'https://us-central1-poketquest-3a73d.cloudfunctions.net/trackPublicSiteVisit';

  function recordVisit() {
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
    const payload = JSON.stringify({ site: 'japan-daily-brief' });
    if (navigator.sendBeacon) navigator.sendBeacon(visitEndpoint, new Blob([payload], { type: 'application/json' }));
    else fetch(visitEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(function () {});
  }

  function renderLive(isLive, liveURL) {
    document.documentElement.classList.toggle('yuji-is-live', isLive);
    document.querySelectorAll(liveLinks).forEach(function (link) {
      if (!link.dataset.liveOriginalHref) link.dataset.liveOriginalHref = link.href;
      if (!link.dataset.liveOriginalHtml) link.dataset.liveOriginalHtml = link.innerHTML;
      link.classList.toggle('tiktok-live-now', isLive);
      if (isLive) {
        link.href = liveURL || defaultLiveURL;
        link.setAttribute('aria-label', 'Yuji is live on TikTok now. Watch the live stream.');
        link.innerHTML = '<span class="live-dot" aria-hidden="true"></span><span>LIVE NOW</span><strong>Watch Yuji ↗</strong>';
      } else {
        link.href = link.dataset.liveOriginalHref;
        link.innerHTML = link.dataset.liveOriginalHtml;
        link.removeAttribute('aria-label');
      }
    });
  }

  function field(fields, key, type) {
    return fields && fields[key] && fields[key][type];
  }

  function addVocabularyPracticeLink() {
    const word = document.querySelector('.word');
    if (!word || word.querySelector('.word-practice')) return;
    const link = document.createElement('a');
    link.className = 'word-practice';
    link.href = 'https://shimizu510.github.io/japanese-training-lab/learn/n3/vocabulary/';
    link.textContent = 'Practice N3 Japanese vocabulary free ↗';
    link.style.cssText = 'display:block;margin-top:16px;padding:12px 14px;background:#b42b23;color:#fff;font-size:12px;font-weight:900;text-align:center;text-decoration:none';
    const note = document.createElement('small');
    note.textContent = 'No signup · Continue the same learning route in DraMap';
    note.style.cssText = 'display:block;margin-top:8px;color:#626862;font-size:10px;text-align:center';
    word.append(link, note);
  }

  async function refreshLiveStatus() {
    try {
      // Firestore's get-document REST endpoint rejects unknown query
      // parameters. Browser cache directives are sufficient here and keep the
      // request valid.
      const response = await fetch(endpoint, { cache: 'no-store' });
      if (!response.ok) throw new Error('status unavailable');
      const fields = (await response.json()).fields || {};
      const startedAt = Date.parse(field(fields, 'startedAt', 'timestampValue') || '');
      const expiresAt = Date.parse(field(fields, 'expiresAt', 'timestampValue') || '');
      const stillCurrent = Number.isFinite(expiresAt) ? expiresAt > Date.now() : Number.isFinite(startedAt) && Date.now() - startedAt < 14400000;
      renderLive(field(fields, 'isLive', 'booleanValue') === true && stillCurrent, field(fields, 'liveUrl', 'stringValue') || defaultLiveURL);
    } catch (error) {
      renderLive(false, defaultLiveURL);
    }
  }

  recordVisit();
  addVocabularyPracticeLink();
  refreshLiveStatus();
  setInterval(refreshLiveStatus, 45000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) refreshLiveStatus();
  });
})();
