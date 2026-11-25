// Zachowanie długich artykułów (frontmatter `warstwy: true`) i przycisku „Wyjdź szybko”.
// Wszystko działa bez bibliotek; bez JavaScriptu treść jest nadal dostępna (sekcje rozwija się ręcznie).

const SZEROKI = '(min-width: 1240px)';

export function uruchomArtykul() {
  szybkieWyjscie();
  const art = document.querySelector<HTMLElement>('article.art-warstwy');
  if (!art) return;
  art.classList.add('js-art');
  const prose = art.querySelector<HTMLElement>('.prose')!;

  wysokoscNaglowka();
  spisTresci(prose);
  pasekPostepu(prose);
  trybCzytania(art);
  otwieranieZKotwicy();
  drukowanie();
  slowniczekWDymkach(prose);
  gotoweZdania(prose);
  quiz(prose);
  otwarteTeraz(prose);
  udostepnianie(prose);
}

/* ---------- drobne pomocnicze ---------- */

function komunikat(tekst: string) {
  let t = document.querySelector<HTMLElement>('.art-toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'art-toast';
    t.setAttribute('role', 'status');
    document.body.append(t);
  }
  t.textContent = tekst;
  t.classList.add('widoczny');
  clearTimeout((t as any)._timer);
  (t as any)._timer = setTimeout(() => t!.classList.remove('widoczny'), 2200);
}

async function kopiuj(tekst: string, opis = 'Skopiowano') {
  try {
    await navigator.clipboard.writeText(tekst);
    komunikat(opis);
  } catch {
    komunikat('Nie udało się skopiować. Zaznacz tekst ręcznie.');
  }
}

function wysokoscNaglowka() {
  const h = document.querySelector<HTMLElement>('header.site');
  const ustaw = () => document.documentElement.style.setProperty('--hdr', `${h?.offsetHeight ?? 0}px`);
  ustaw();
  addEventListener('resize', ustaw);
}

/* ---------- spis treści: otwarty na szerokim ekranie, bieżąca sekcja ---------- */

function spisTresci(prose: HTMLElement) {
  const toc = document.querySelector<HTMLDetailsElement>('.art-toc');
  if (!toc) return;
  const mq = matchMedia(SZEROKI);
  const ustawOtwarcie = () => { toc.open = mq.matches; };
  ustawOtwarcie();
  mq.addEventListener('change', ustawOtwarcie);

  toc.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => { if (!mq.matches) toc.open = false; }),
  );

  const naglowki = [...prose.querySelectorAll<HTMLElement>('h2[id]')].filter((h) => toc.querySelector(`a[href="#${h.id}"]`));
  const teraz = toc.querySelector<HTMLElement>('.toc-now')!;
  let ostatni = '';
  const odswiez = () => {
    const prog = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hdr')) || 0) + 90;
    let biezacy: HTMLElement | undefined;
    for (const h of naglowki) {
      if (h.getBoundingClientRect().top < prog) biezacy = h; else break;
    }
    const id = biezacy?.id ?? '';
    if (id === ostatni) return;
    ostatni = id;
    toc.querySelectorAll('[aria-current]').forEach((x) => x.removeAttribute('aria-current'));
    if (!biezacy) { teraz.textContent = ''; return; }
    const link = toc.querySelector<HTMLElement>(`a[href="#${id}"]`)!;
    link.setAttribute('aria-current', 'true');
    link.closest('.toc-parts > li')?.querySelector('.toc-part')?.setAttribute('aria-current', 'step');
    teraz.textContent = (link.firstChild?.textContent ?? '').trim();
  };
  let ramka = 0;
  addEventListener('scroll', () => { cancelAnimationFrame(ramka); ramka = requestAnimationFrame(odswiez); }, { passive: true });
  odswiez();
}

/* ---------- pasek postępu ---------- */

function pasekPostepu(prose: HTMLElement) {
  const pasek = document.querySelector<HTMLElement>('.art-progress span');
  if (!pasek) return;
  let ramka = 0;
  const licz = () => {
    const r = prose.getBoundingClientRect();
    const calosc = r.height - innerHeight;
    const p = calosc > 0 ? Math.min(1, Math.max(0, -r.top / calosc)) : 1;
    pasek.style.transform = `scaleX(${p})`;
  };
  addEventListener('scroll', () => { cancelAnimationFrame(ramka); ramka = requestAnimationFrame(licz); }, { passive: true });
  addEventListener('resize', licz);
  licz();
}

/* ---------- tryb: Skrót / Całość ---------- */

function trybCzytania(art: HTMLElement) {
  const narzedzia = art.querySelector<HTMLElement>('.art-tools');
  if (!narzedzia) return;
  narzedzia.hidden = false;
  const przyciski = [...narzedzia.querySelectorAll<HTMLButtonElement>('[data-tryb]')];
  const rozwiniecia = () => [...art.querySelectorAll<HTMLDetailsElement>('details.rozwin')];
  const opis = narzedzia.querySelector<HTMLElement>('.tryb-opis')!;
  przyciski.forEach((b) =>
    b.addEventListener('click', () => {
      const calosc = b.dataset.tryb === 'calosc';
      rozwiniecia().forEach((d) => { d.open = calosc; });
      przyciski.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      opis.textContent = calosc
        ? 'Wszystkie sekcje są rozwinięte. Możesz je zwijać pojedynczo.'
        : 'W skrócie widzisz najważniejsze wnioski. Szczegóły rozwiniesz w każdej sekcji.';
      komunikat(calosc ? 'Rozwinięto wszystkie sekcje' : 'Zwinięto szczegóły');
    }),
  );
}

/* ---------- link z kotwicą (#pomoc-krakow) otwiera zwinięte sekcje ---------- */

function otworzDo(el: Element | null) {
  let d = el?.closest('details');
  while (d) {
    (d as HTMLDetailsElement).open = true;
    d = d.parentElement?.closest('details') ?? null;
  }
}

function otwieranieZKotwicy() {
  const idz = () => {
    if (!location.hash) return;
    const cel = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!cel) return;
    if (cel.closest('details:not([open])')) {
      otworzDo(cel);
      requestAnimationFrame(() => cel.scrollIntoView());
    }
  };
  idz();
  addEventListener('hashchange', idz);
}

/* ---------- druk: wszystko rozwinięte; „Zapisz listę” drukuje tylko listę kroków ---------- */

function drukowanie() {
  let zamkniete: HTMLDetailsElement[] = [];
  addEventListener('beforeprint', () => {
    zamkniete = [...document.querySelectorAll<HTMLDetailsElement>('article details:not([open])')].filter((d) => !d.classList.contains('art-toc'));
    zamkniete.forEach((d) => { d.open = true; });
  });
  addEventListener('afterprint', () => {
    zamkniete.forEach((d) => { d.open = false; });
    document.body.classList.remove('druk-lista');
  });
  document.querySelectorAll<HTMLButtonElement>('[data-drukuj]').forEach((b) =>
    b.addEventListener('click', () => {
      document.body.classList.add('druk-lista');
      print();
    }),
  );
}

/* ---------- słowniczek w dymkach ---------- */

function wzorzec(termin: string): RegExp {
  let t = termin.replace(/\s*\(.*?\)\s*/g, ' ').trim();
  if (t.includes(' / ')) t = t.split(' / ')[0];
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const skrot = /^[A-Z0-9/]+$/.test(t) || /[A-Z].*[A-Z]/.test(t);
  if (skrot) return new RegExp(`(?<![\\p{L}\\p{N}])${esc(t)}(?![\\p{L}\\p{N}])`, 'u');
  const czesci = t.split(/\s+/).map((w) => (w.length <= 4 ? esc(w) : esc(w.slice(0, Math.max(4, w.length - 2))) + '\\p{L}*'));
  return new RegExp(`(?<![\\p{L}])${czesci.join('\\s+')}`, 'iu');
}

function slowniczekWDymkach(prose: HTMLElement) {
  const tabela = prose.querySelector('#slowniczek table');
  const dymek = document.getElementById('term-pop');
  if (!tabela || !dymek) return;
  const terminy = [...tabela.querySelectorAll('tbody tr')].map((tr) => {
    const [a, b] = tr.querySelectorAll('td');
    const nazwa = a.textContent!.trim();
    return { nazwa, def: b.textContent!.trim(), re: wzorzec(nazwa), strefy: new Set<Element | null>() };
  });

  const POMIN = 'h1,h2,h3,h4,a,summary,th,button,.claim,#slowniczek,.term,figure,.jak-powstal,.art-dalej,.art-tools,.quiz-item,.legenda';
  const walker = document.createTreeWalker(prose, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement?.closest(POMIN) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const wezly: Text[] = [];
  while (walker.nextNode()) wezly.push(walker.currentNode as Text);

  for (let wezel of wezly) {
    const strefa = wezel.parentElement!.closest('details');
    for (;;) {
      let najblizszy: { t: (typeof terminy)[number]; m: RegExpExecArray } | null = null;
      for (const t of terminy) {
        if (t.strefy.has(strefa)) continue;
        const m = t.re.exec(wezel.data);
        if (m && (!najblizszy || m.index < najblizszy.m.index)) najblizszy = { t, m };
      }
      if (!najblizszy) break;
      const { t, m } = najblizszy;
      t.strefy.add(strefa);
      const reszta = wezel.splitText(m.index);
      const po = reszta.splitText(m[0].length);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'term';
      b.dataset.nazwa = t.nazwa;
      b.dataset.def = t.def;
      b.setAttribute('aria-describedby', 'term-pop');
      b.textContent = reszta.data;
      reszta.replaceWith(b);
      wezel = po;
    }
  }

  let aktywny: HTMLElement | null = null;
  const pokaz = (el: HTMLElement) => {
    aktywny = el;
    dymek.innerHTML = '';
    const s = document.createElement('strong');
    s.textContent = el.dataset.nazwa!;
    dymek.append(s, ' ', el.dataset.def!);
    dymek.hidden = false;
    const r = el.getBoundingClientRect();
    const w = Math.min(320, innerWidth - 24);
    dymek.style.width = `${w}px`;
    dymek.style.left = `${Math.min(Math.max(12, r.left + r.width / 2 - w / 2), innerWidth - w - 12)}px`;
    const nad = r.bottom + dymek.offsetHeight + 12 > innerHeight;
    dymek.style.top = `${nad ? r.top - dymek.offsetHeight - 8 : r.bottom + 8}px`;
  };
  const ukryj = () => { dymek.hidden = true; aktywny = null; };
  prose.addEventListener('mouseover', (e) => { const t = (e.target as Element).closest<HTMLElement>('.term'); if (t) pokaz(t); });
  prose.addEventListener('mouseout', (e) => { if ((e.target as Element).closest('.term')) ukryj(); });
  prose.addEventListener('focusin', (e) => { const t = (e.target as Element).closest<HTMLElement>('.term'); if (t) pokaz(t); });
  prose.addEventListener('focusout', (e) => { if ((e.target as Element).closest('.term')) ukryj(); });
  prose.addEventListener('click', (e) => {
    const t = (e.target as Element).closest<HTMLElement>('.term');
    if (!t) return;
    if (aktywny === t && !dymek.hidden) ukryj(); else pokaz(t);
  });
  addEventListener('scroll', ukryj, { passive: true });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') ukryj(); });
}

/* ---------- gotowe zdania: przycisk „Kopiuj” ---------- */

function gotoweZdania(prose: HTMLElement) {
  prose.querySelectorAll<HTMLElement>('.say').forEach((say) => {
    const tekst = (say.querySelector('.say-tekst') ?? say.querySelector('p'))?.textContent?.replace(/^„|”$/g, '').trim();
    if (!tekst) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'kopiuj';
    b.textContent = 'Kopiuj zdanie';
    b.addEventListener('click', () => kopiuj(tekst, 'Skopiowano zdanie'));
    say.append(b);
  });
}

/* ---------- quiz „Mit czy fakt?” ---------- */

function quiz(prose: HTMLElement) {
  prose.querySelectorAll<HTMLElement>('.quiz-item').forEach((item) => {
    const odp = item.dataset.odp;
    const werdykt = item.querySelector<HTMLElement>('.quiz-werdykt')!;
    item.querySelectorAll<HTMLButtonElement>('[data-wybor]').forEach((b) =>
      b.addEventListener('click', () => {
        const dobrze = b.dataset.wybor === odp;
        item.classList.add('odpowiedziane', dobrze ? 'dobrze' : 'zle');
        b.setAttribute('aria-pressed', 'true');
        item.querySelectorAll<HTMLButtonElement>('[data-wybor]').forEach((x) => { x.disabled = true; });
        werdykt.textContent = `${dobrze ? 'Zgadza się' : 'Nie tym razem'}: to ${odp === 'mit' ? 'mit' : 'fakt'}.`;
        item.querySelector('.quiz-a')!.classList.add('pokaz');
      }),
    );
  });
}

/* ---------- karty pomocy: „teraz otwarte” (czas w Polsce, bez świąt) ---------- */

function otwarteTeraz(prose: HTMLElement) {
  const pl = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }));
  const dzien = pl.getDay() || 7; // 1 = poniedziałek … 7 = niedziela
  const minuta = pl.getHours() * 60 + pl.getMinutes();
  const naMin = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + (m || 0); };
  prose.querySelectorAll<HTMLElement>('.hcard[data-godziny]').forEach((k) => {
    const otwarte = k.dataset.godziny!.split(';').some((zakres) => {
      const [dni, godz] = zakres.trim().split(' ');
      const [d1, d2] = dni.split('-').map(Number);
      const [g1, g2] = godz.split('-').map(naMin);
      return dzien >= d1 && dzien <= (d2 ?? d1) && minuta >= g1 && minuta < g2;
    });
    const p = document.createElement('p');
    p.className = `hteraz ${otwarte ? 'otwarte' : 'zamkniete'}`;
    p.title = 'Według godzin ze strony placówki, bez uwzględnienia świąt.';
    p.textContent = otwarte ? (k.dataset.otwarteTekst ?? 'Teraz otwarte') : (k.dataset.zamknieteTekst ?? 'Teraz zamknięte');
    k.querySelector('.hneed')?.after(p);
  });
}

/* ---------- udostępnianie sekcji ---------- */

function udostepnianie(prose: HTMLElement) {
  prose.querySelectorAll<HTMLElement>('h2[id]').forEach((h) => {
    if (h.previousElementSibling?.tagName === 'H3') return; // tytuł części: wystarczy jeden przycisk w sekcji
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'udostepnij';
    b.setAttribute('aria-label', `Udostępnij sekcję: ${h.textContent}`);
    b.innerHTML = '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M8 12l4-4M7 9.5l-1.6 1.6a2.5 2.5 0 003.5 3.5L10.5 13M13 10.5l1.6-1.6a2.5 2.5 0 00-3.5-3.5L9.5 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    b.addEventListener('click', async () => {
      const url = `${location.origin}${location.pathname}#${h.id}`;
      const dane = { title: `${h.textContent} · Psyche Waves`, url };
      if (navigator.share && matchMedia('(pointer: coarse)').matches) {
        try { await navigator.share(dane); } catch { /* anulowano */ }
      } else {
        kopiuj(url, 'Skopiowano link do sekcji');
      }
    });
    h.append(b);
  });
}

/* ---------- szybkie wyjście ---------- */

function szybkieWyjscie() {
  const link = document.querySelector<HTMLAnchorElement>('[data-wyjdz]');
  if (!link) return;
  const wyjdz = () => {
    document.body.style.visibility = 'hidden';
    location.replace(link.href);
  };
  link.addEventListener('click', (e) => { e.preventDefault(); wyjdz(); });
  let ostatniEsc = 0;
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const teraz = Date.now();
    if (teraz - ostatniEsc < 800) wyjdz();
    ostatniEsc = teraz;
  });
}
