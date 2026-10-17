/* Original, synthetic illustrations. See docs/asset-manifest-v2.md. */
(function (root) {
  'use strict';

  const C = Object.freeze({
    ink: '#24454b', teal: '#2b7774', mint: '#b9d5be', leaf: '#5f896b',
    cream: '#fff4d9', paper: '#fffaf0', sand: '#ead6ae', ochre: '#dca955',
    red: '#bc624a', rose: '#d98a70', blue: '#7ba9b7', river: '#9cc9c6',
    dark: '#365b59', white: '#ffffff'
  });
  const g = (body, attrs = '') => `<g ${attrs}>${body}</g>`;
  const rect = (x, y, w, h, fill, radius = 0, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" ${extra}/>`;
  const path = (d, fill = 'none', extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
  const circle = (x, y, r, fill, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
  const ellipse = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
  const transformed = (body, x, y, scale = 1, extra = '') => g(body, `transform="translate(${x} ${y}) scale(${scale})" ${extra}`);

  const ICONS = {
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v6m0-10v.2"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    back: '<path d="M20 12H5m6-6-6 6 6 6"/>',
    sound: '<path d="M4 9h4l5-4v14l-5-4H4zm12-1a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    'sound-off': '<path d="M4 9h4l5-4v14l-5-4H4zm13 0 5 6m0-6-5 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    review: '<path d="M9 4h10v16H5V8m4-4v4H5m4-4L5 8m4 5h6m-6 3h6"/>',
    reset: '<path d="M4 10a8 8 0 1 1 2 8M4 4v6h6"/>',
    book: '<path d="M12 6C9 3 5 3 3 4v15c3-1 6-1 9 1m0-14c3-3 7-3 9-2v15c-3-1-6-1-9 1zm-6 3 3 1m-3 3 3 1m6-4 3-1m-3 5 3-1"/>',
    hand: '<path d="M8 12V5a2 2 0 0 1 4 0v6-2a2 2 0 0 1 4 0v2a2 2 0 0 1 4 0v5c0 4-3 6-6 6-2 0-3-1-5-3l-5-5a2 2 0 0 1 3-3l1 1Z"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
    play: '<path d="m9 5 10 7-10 7Z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    home: '<path d="m3 11 9-8 9 8M6 9v12h12V9m-8 12v-7h4v7"/>',
    trophy: '<path d="M8 3h8v5c0 4-2 6-4 6s-4-2-4-6zm0 2H4v3c0 3 2 4 5 4m7-7h4v3c0 3-2 4-5 4m-3 2v5m-4 2h8"/>',
    chevron: '<path d="m8 5 7 7-7 7"/>',
    expand: '<path d="m6 9 6 6 6-6"/>',
    minus: '<path d="M5 12h14"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>'
  };

  function icon(name, size = 24) {
    const n = Number(size);
    const dimension = Number.isFinite(n) ? Math.max(12, Math.min(n, 96)) : 24;
    const drawing = Object.prototype.hasOwnProperty.call(ICONS, name) ? ICONS[name] : ICONS.info;
    return `<svg class="v2-icon" viewBox="0 0 24 24" width="${dimension}" height="${dimension}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${drawing}</svg>`;
  }

  function person(x, y, scale = 1, color = C.teal, hat = false) {
    return transformed(
      ellipse(0, 25, 10, 3, C.ink, 'opacity=".1"') +
      path('M-7 13Q-7 5 0 5Q7 5 7 13L9 20H-9Z', color) +
      path('M-4 20v6m8-6v6', 'none', `stroke="${C.ink}" stroke-width="3.4" stroke-linecap="round"`) +
      circle(0, 0, 6, C.sand) +
      (hat ? path('M-12 0 0-9 12 0Z', C.ochre) : path('M-6-2Q-6-9 1-7Q7-7 6-1L1-4Z', C.ink)),
      x, y, scale
    );
  }

  function people(x, y, scale = 1, count = 5) {
    const bodies = [];
    for (let i = 0; i < count; i += 1) {
      const offset = (i - (count - 1) / 2) * 23;
      bodies.push(person(offset, i % 2 ? -6 : 2, 1, [C.teal, C.red, C.blue, C.leaf][i % 4], i % 3 === 2));
    }
    return transformed(bodies.join(''), x, y, scale);
  }

  function tree(x, y, scale = 1) {
    return transformed(path('M0-2v27', 'none', `stroke="${C.dark}" stroke-width="4" stroke-linecap="round"`) +
      path('M0-31C-20-22-26-8-19 3c6 10 32 12 39-1C27-11 17-25 0-31Z', C.leaf) +
      path('M-1-22C-14-13-16-4-10 1', 'none', 'stroke="#8eaf86" stroke-width="4" stroke-linecap="round"'), x, y, scale);
  }

  function house(x, y, scale = 1, color = C.red) {
    return transformed(ellipse(0, 37, 64, 12, C.ink, 'opacity=".08"') +
      path('M-47-14 10-27 53-7V31L-5 43-47 25Z', C.cream) +
      path('M-5-4 53-7V31L-5 43Z', C.sand) +
      path('M-60-12-16-49 9-42 60-9 2 4-16-23-43-1Z', color) +
      path('M-16-49 30-58 73-24 60-9 9-42Z', C.rose) +
      path('M-31 7-17 10V31l-14-5Z', C.teal) +
      path('m12 9 15-3v12l-15 3Z', C.teal) +
      path('M-44 25-5 43l57-12', 'none', `stroke="${C.ink}" stroke-opacity=".2" stroke-width="2"`), x, y, scale);
  }

  function factory(x, y, scale = 1) {
    return transformed(ellipse(0, 37, 80, 13, C.ink, 'opacity=".08"') +
      rect(-64, -47, 14, 72, C.red, 2) + rect(-67, -49, 20, 7, C.rose, 2) +
      path('M-70-5-37-22v18L-6-21v18L24-20 66-7v39L-70 41Z', C.sand) +
      path('m24-20 42 13v39l-42-5Z', C.ochre) +
      path('M-70-5-37-22v18L-6-21v18L24-20', 'none', `stroke="${C.ink}" stroke-width="2.5"`) +
      rect(-52, 9, 16, 13, C.teal, 2) + rect(-22, 8, 16, 13, C.teal, 2) +
      rect(9, 6, 15, 14, C.teal, 2) + path('m41 7 12 3v12l-12-3Z', C.teal), x, y, scale);
  }

  function book(x, y, scale = 1, cover = C.teal) {
    return transformed(ellipse(1, 25, 44, 7, C.ink, 'opacity=".09"') +
      path('M-43-18Q-21-30 0-16Q21-30 43-18V21Q20 10 0 25Q-21 10-43 21Z', cover) +
      path('M-38-23Q-18-31 0-18Q18-31 38-23V14Q19 7 0 20Q-19 7-38 14Z', C.paper) +
      path('M0-18v38m-29-32 20 4m-20 5 20 4m-20 5 15 3m43-21-20 4m20 5-20 4m20 5-15 3', 'none', `stroke="${C.ink}" stroke-width="2" stroke-linecap="round" opacity=".5"`), x, y, scale);
  }

  function paper(x, y, scale = 1, variant = 'news') {
    return transformed(ellipse(0, 31, 35, 6, C.ink, 'opacity=".08"') +
      rect(-29, -35, 58, 69, C.paper, 4, `stroke="${C.sand}" stroke-width="2"`) +
      (variant === 'news' ? rect(-21, -26, 42, 9, C.red, 1) + rect(-21, -10, 18, 20, C.mint, 1) +
        path('M3-8h17M3-1h17M3 6h12M-21 18h42M-21 25H9', 'none', `stroke="${C.ink}" stroke-width="2" stroke-linecap="round" opacity=".55"`) :
        path('M-19-23h38M-19-13h33M-19-3h38M-19 7h28M-13 23q8-11 16-2 7-8 13-1', 'none', `stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round" opacity=".6"`)), x, y, scale);
  }

  function rice(x, y, scale = 1) {
    return transformed(ellipse(0, 29, 33, 7, C.ink, 'opacity=".08"') +
      path('M-19-16Q-34 0-28 23Q0 38 28 23Q34 0 19-16Z', C.ochre) +
      path('m-22-27 11 13H11l11-13-18 4Z', C.sand) +
      path('M-19-14Q0-7 19-14M0-4v24m0-14-8-7m8 14 8-8', 'none', `stroke="${C.paper}" stroke-width="2.5" stroke-linecap="round"`), x, y, scale);
  }

  function coin(x, y, scale = 1) {
    return transformed(ellipse(0, 4, 17, 7, C.ochre) + rect(-17, -3, 34, 8, C.ochre) +
      ellipse(0, -3, 17, 7, '#f2ca77', `stroke="${C.ochre}" stroke-width="1.5"`) +
      rect(-3, -6, 6, 5, C.ochre, 1), x, y, scale);
  }

  function clock(x, y, scale = 1) {
    return transformed(circle(0, 0, 24, C.teal) + circle(0, 0, 19, C.cream) +
      path('M0-12V0l9 5M0-16v2m16 2h-2M0 16v-2m-16-2h2', 'none', `stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"`), x, y, scale);
  }

  function network(x, y, scale = 1, kind = 'plain') {
    const nodes = [[-44, 0], [0, -25], [44, 2], [10, 28]];
    return transformed(path('M-44 0 0-25 44 2 10 28-44 0M0-25 10 28', 'none', `stroke="${C.teal}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`) +
      nodes.map(([nx, ny], i) => kind === 'houses' ? house(nx, ny, .27, i % 2 ? C.teal : C.red) : circle(nx, ny, 8, i % 2 ? C.red : C.teal, `stroke="${C.cream}" stroke-width="3"`)).join(''), x, y, scale);
  }

  function mountain(x, y, scale = 1) {
    return transformed(path('M-85 32-30-39 9 7 33-20 86 32Z', C.mint) +
      path('M-54 32-6-26 41 32Z', C.leaf) + house(17, 24, .4) + tree(-51, 23, .45), x, y, scale);
  }

  function megaphone(x, y, scale = 1) {
    return transformed(path('M-26-8H-4L28-25V25L-4 8H-26Z', C.red) +
      path('M-26-8h14V8h-14Z', C.teal) + path('M-10 8-4 28H6L2 11Z', C.ink) +
      path('M36-14 47-20M38 0h14m-16 14 11 6', 'none', `stroke="${C.ochre}" stroke-width="3" stroke-linecap="round"`), x, y, scale);
  }

  function handover(x, y, scale = 1) {
    return transformed(path('M-57 8-27-8l20 9 16-8 28 12 20 14-16 18-27-11-16 3-27-13-16 5Z', C.sand) +
      path('M-56 8-40 1l17 29-13 8Zm112 11-13-9-18 27 16 8Z', C.teal) +
      path('M-13 6 0-1l17 13-8 9-18-8m-8 9 12 7', 'none', `stroke="${C.ochre}" stroke-width="2.5" stroke-linecap="round"`), x, y, scale);
  }

  function printer(x, y, scale = 1) {
    return transformed(ellipse(0, 37, 51, 8, C.ink, 'opacity=".08"') +
      rect(-27, -40, 47, 49, C.paper, 3, `stroke="${C.sand}" stroke-width="1.5"`) +
      path('M-18-31H11M-18-23H11M-18-15H4', 'none', `stroke="${C.ink}" stroke-width="2" opacity=".5"`) +
      rect(-44, -9, 88, 42, C.teal, 6) + rect(-32, 8, 64, 13, C.ink, 3) +
      path('M-26 15h47l8 29h-58Z', C.paper) +
      path('M-18 25H15M-18 32H9', 'none', `stroke="${C.ink}" stroke-width="2" opacity=".5"`) +
      circle(30, 1, 3, C.ochre), x, y, scale);
  }

  function ballot(x, y, scale = 1) {
    return transformed(path('M-35-3 0-14 35-3V30L0 41-35 30Z', C.ochre) +
      path('M0 8 35-3V30L0 41Z', C.red) + path('m-15-6 29 0', 'none', `stroke="${C.ink}" stroke-width="4" stroke-linecap="round"`) +
      rect(-13, -39, 27, 33, C.paper, 2, 'transform="rotate(-12)"') +
      path('M-7-28h12m-12 7h12', 'none', `stroke="${C.ink}" stroke-width="2" opacity=".5"`), x, y, scale);
  }

  const CARD_DRAWINGS = {
    's01-wages': () => factory(56, 56, .48) + coin(111, 70, 1) + coin(122, 58, 1) + person(140, 54, .8, C.teal),
    's01-hours': () => factory(64, 62, .54) + clock(119, 45, 1) + person(151, 65, .65, C.red),
    's01-levies': () => rice(65, 62, .8) + person(106, 45, 1.2, C.teal, true) + paper(139, 65, .48, 'petition'),
    's01-taxes': () => rice(48, 64, .65) + paper(92, 49, .85, 'petition') + coin(131, 77, .7) + coin(137, 69, .7),
    's02-secret-network': () => network(90, 51, 1.1, 'houses'),
    's02-study': () => book(96, 63, 1.05) + paper(46, 40, .44, 'petition'),
    's02-mobilize': () => people(90, 49, 1.12, 5),
    's02-antiwar': () => megaphone(88, 49, 1) + paper(39, 63, .45),
    's03-petitions': () => paper(67, 53, .8, 'petition') + paper(103, 47, .8, 'petition') + path('m122 72 22-27 5 4-22 27-7 2Z', C.teal),
    's03-public-press': () => printer(93, 49, .94) + paper(40, 64, .42),
    's03-action-committees': () => people(90, 32, .85, 4) + rect(41, 62, 99, 10, C.ochre, 3) + path('M48 72v17m84-17v17', 'none', `stroke="${C.ink}" stroke-width="3"`) + paper(93, 60, .35, 'petition'),
    's03-secret-base': () => house(78, 58, .72, C.teal) + tree(136, 51, .85),
    's04-friendship-societies': () => people(90, 38, .8, 4) + handover(89, 71, .7),
    's04-mutual-aid-societies': () => person(49, 45, .9, C.teal) + person(131, 45, .9, C.red) + rice(90, 66, .8),
    's04-literacy-work': () => book(96, 66, 1.06) + rect(42, 16, 95, 26, C.teal, 4) + path('M58 24h28m-28 9h57', 'none', `stroke="${C.paper}" stroke-width="2" opacity=".8"`),
    's04-representative-elections': () => ballot(90, 49, 1.04),
    's05-coalition': () => people(90, 45, 1.05, 5) + path('M34 84Q90 96 146 84', 'none', `stroke="${C.teal}" stroke-width="3" stroke-linecap="round"`),
    's05-secret': () => house(82, 56, .7, C.teal) + tree(39, 46, .85) + tree(143, 52, .9),
    's05-rent': () => rice(65, 64, .85) + paper(116, 50, .8, 'petition') + coin(136, 80, .5),
    's05-guerrilla': () => mountain(93, 58, .9) + people(87, 65, .65, 3),
    's06-associations': () => people(89, 47, 1.1, 5),
    's06-bases': () => mountain(90, 50, .75) + network(91, 70, .8, 'houses'),
    's06-defense': () => house(88, 47, .5) + person(49, 60, .9, C.teal) + person(130, 60, .9, C.leaf) + path('M31 86Q90 106 148 86', 'none', `stroke="${C.teal}" stroke-width="3" stroke-linecap="round"`),
    's06-press': () => paper(67, 45, .9) + megaphone(122, 67, .55),
    's07-rice': () => house(73, 48, .62, C.ochre) + rice(102, 72, .78) + person(143, 58, .75, C.teal, true),
    's07-local-uprising': () => house(87, 39, .54) + people(91, 65, .88, 4),
    's07-self-defense': () => person(60, 48, 1.15, C.leaf) + person(115, 48, 1.15, C.teal) + path('M43 84h90', 'none', `stroke="${C.ochre}" stroke-width="4" stroke-linecap="round"`),
    's07-national-now': () => network(88, 47, .95, 'houses') + people(88, 72, .55, 5),
    's08-japan-surrender': () => paper(93, 46, 1, 'petition') + path('M31 76Q88 98 147 76', 'none', `stroke="${C.blue}" stroke-width="3" stroke-linecap="round"`) + paper(136, 66, .45),
    's08-regime-crisis': () => house(90, 47, .72, C.ochre) + path('m72 91 7-9 7 4 8-12 8 3 10-15', 'none', `stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"`),
    's08-ready-forces': () => people(90, 48, 1.05, 5) + book(136, 77, .44),
    's08-trained-masses': () => people(91, 31, .7, 4) + book(90, 76, .8),
    's09-communicate': () => network(83, 46, .8, 'houses') + paper(139, 60, .58, 'petition'),
    's09-masses': () => people(91, 45, 1.04, 6),
    's09-armed-support': () => person(53, 50, .95, C.leaf) + people(111, 54, .85, 3),
    's09-base': () => mountain(88, 48, .85) + tree(140, 63, .6)
  };

  function card(cardId) {
    const drawing = Object.prototype.hasOwnProperty.call(CARD_DRAWINGS, cardId) ? CARD_DRAWINGS[cardId] : (() => book(90, 57, 1));
    return `<svg class="v2-card-art" viewBox="0 0 180 108" fill="none" aria-hidden="true" focusable="false">` +
      path('M19 82Q7 47 35 25Q59 8 89 17Q139 1 161 39Q184 79 143 94Q66 108 19 82Z', C.cream) +
      drawing() + '</svg>';
  }

  function island(x, y, scale = 1) {
    return transformed(ellipse(0, 22, 157, 45, C.ink, 'opacity=".055"') +
      path('M-153 5Q-171-25-108-42Q-36-73 51-52Q155-54 162-9Q175 24 101 40Q-19 63-125 34Z', C.sand) +
      path('M-153-2Q-171-32-108-49Q-36-80 51-59Q155-61 162-16Q175 17 101 33Q-19 56-125 27Z', '#e3e4bd'), x, y, scale);
  }

  function reveal(body, semantic) {
    return g(body, `class="art-reveal ${semantic || ''}"`);
  }

  function community(x, y, scale = 1, options = {}) {
    return transformed(house(-48, 3, .72, options.roof || C.red) + house(43, 18, .5, C.teal) +
      tree(-110, -10, .77) + tree(108, 6, .67) +
      (options.crowd ? people(9, 45, .72, options.crowd) : person(18, 40, .75, C.teal)), x, y, scale);
  }

  function field(x, y, scale = 1) {
    return transformed(path('M-112 4-32-29 112 5 24 45Z', '#c6cc8e') +
      path('m-87 7 105 25m-83-36 108 26m-83-36 106 26m-80-35 102 24', 'none', 'stroke="#a5af72" stroke-width="3" stroke-linecap="round"') +
      rice(65, 21, .53) + person(-19, 1, .85, C.teal, true), x, y, scale);
  }

  function studyHouse(x, y, scale = 1, isPrison = false) {
    return transformed(house(0, -10, .9, isPrison ? C.dark : C.red) +
      (isPrison ? path('M-29-2v15m5-14v15m5-14v15m38-7v12m6-13v12', 'none', `stroke="${C.paper}" stroke-width="1.5" opacity=".65"`) : '') +
      person(-31, 41, .75, C.red) + person(28, 43, .75, C.teal) +
      book(0, 56, .57), x, y, scale);
  }

  function meeting(x, y, scale = 1) {
    return transformed(house(0, -24, .75, C.teal) + people(0, 44, .84, 5) +
      rect(-45, 49, 90, 8, C.ochre, 2) + paper(0, 41, .3, 'petition'), x, y, scale);
  }

  function messagePath(x, y, scale = 1) {
    return transformed(path('M-95 22Q-46-16 0 6T95-15', 'none', `stroke="${C.teal}" stroke-width="4" stroke-linecap="round"`) +
      paper(-41, 2, .3, 'petition') + paper(47, 3, .3, 'petition'), x, y, scale);
  }

  function area(body, side, semantic) {
    return g(body, `class="art-target-${side} semantic-${semantic}"`);
  }

  const SCENE_DRAWINGS = {
    s01: () => area(factory(255, 213, 1.32) + person(194, 251, 1.15, C.teal) + person(312, 249, 1.1, C.red) +
      reveal(people(258, 277, .85, 4), 'art-crowd'), 'a', 'workers') +
      area(field(751, 231, 1.3) + house(804, 170, .61) +
      reveal(people(713, 264, .75, 3), 'art-crowd'), 'b', 'farmers'),
    s02: () => area(community(258, 215, 1.05) +
      reveal(messagePath(259, 223, 1.05) + people(282, 271, .7, 3), 'art-connection'), 'a', 'network') +
      area(studyHouse(741, 212, 1.06, true) +
      reveal(book(743, 265, .85) + path('M706 230 699 220m45 2v-14m36 22 9-10', 'none', `stroke="${C.ochre}" stroke-width="3" stroke-linecap="round"`), 'art-learning'), 'b', 'learning'),
    s03: () => area(meeting(258, 218, 1.04) + paper(302, 268, .5, 'petition') +
      reveal(paper(212, 269, .42, 'petition') + paper(253, 277, .45, 'petition') + people(260, 251, .71, 5), 'art-crowd'), 'a', 'petitions') +
      area(house(738, 193, 1.05) + printer(742, 252, .8) +
      reveal(paper(685, 274, .38) + paper(792, 274, .4) + person(833, 258, .85, C.teal), 'art-learning'), 'b', 'press'),
    s04: () => area(community(258, 207, 1.04, { crowd: 3 }) + rice(255, 265, .68) +
      reveal(people(242, 262, .8, 5), 'art-crowd'), 'a', 'mutual-aid') +
      area(studyHouse(742, 213, 1.03) +
      reveal(book(743, 264, .85) + people(734, 255, .65, 4), 'art-learning'), 'b', 'literacy'),
    s05: () => area(meeting(258, 214, 1.05) +
      reveal(people(259, 269, .9, 6), 'art-crowd'), 'a', 'coalition') +
      area(community(739, 214, 1.05, { roof: C.teal }) + tree(659, 191, 1.1) +
      reveal(messagePath(739, 226, .85), 'art-connection'), 'b', 'secret-network'),
    s06: () => area(meeting(257, 209, 1.03) + paper(185, 261, .46) +
      reveal(people(251, 269, .86, 6), 'art-crowd'), 'a', 'associations') +
      area(mountain(746, 190, 1.65) + house(704, 248, .55) +
      reveal(messagePath(751, 255, 1.06) + person(795, 245, .75, C.teal), 'art-connection'), 'b', 'bases'),
    s07: () => area(house(246, 201, 1.05, C.ochre) + rice(291, 266, .95) + person(197, 259, .95, C.teal, true) +
      reveal(rice(245, 275, .7) + people(318, 256, .7, 3), 'art-crowd'), 'a', 'food-and-action') +
      area(community(743, 213, 1.03, { crowd: 3 }) +
      reveal(people(747, 266, .86, 6), 'art-crowd'), 'b', 'local-action'),
    s08: () => area(house(255, 205, .95, C.ochre) + paper(218, 268, .56, 'petition') + paper(295, 260, .45, 'petition') +
      reveal(messagePath(256, 268, .88), 'art-connection'), 'a', 'external-conditions') +
      area(meeting(745, 214, 1.03) + book(675, 263, .5) +
      reveal(people(751, 271, .9, 6), 'art-crowd'), 'b', 'preparation'),
    s09: () => area(community(256, 212, 1.03) + paper(251, 260, .5, 'petition') +
      reveal(messagePath(256, 226, 1.1) + person(295, 264, .8, C.teal), 'art-connection'), 'a', 'coordination') +
      area(house(748, 188, .96) + people(750, 253, .87, 5) +
      reveal(people(752, 279, .85, 7), 'art-crowd'), 'b', 'mobilization')
  };

  function scene(sceneId) {
    const safeScene = Object.prototype.hasOwnProperty.call(SCENE_DRAWINGS, sceneId) ? sceneId : 's02';
    const chapter = Number(safeScene.slice(1)) < 3 ? 1 : Number(safeScene.slice(1)) < 5 ? 2 : 3;
    const id = `v2-art-${safeScene}`;
    return `<svg class="v2-scene-art chapter-art-${chapter}" viewBox="0 0 1000 380" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">` +
      `<defs><linearGradient id="${id}-sky" x1="500" y1="0" x2="500" y2="380" gradientUnits="userSpaceOnUse"><stop stop-color="#eaf2df"/><stop offset=".58" stop-color="#fff3d7"/><stop offset="1" stop-color="#f1e7c9"/></linearGradient></defs>` +
      g(rect(0, 0, 1000, 380, `url(#${id}-sky)`, 22) +
        circle(847, 59, 30, '#efcb80', 'opacity=".8"') +
        path('M0 124Q96 58 190 106Q256 60 362 110Q451 65 529 111Q634 51 729 112Q864 63 1000 111V269H0Z', '#d3dfbd') +
        path('M0 165Q126 108 249 160Q372 118 477 163Q595 109 732 158Q871 112 1000 162V380H0Z', '#bfceb0') +
        path('M453 118Q484 161 451 201Q421 243 474 287Q520 326 464 380H580Q630 322 572 275Q518 232 551 199Q582 167 543 118Z', C.river) +
        path('M475 146Q493 172 478 194M478 216q-9 19 9 34m55 36q20 19 10 40', 'none', 'stroke="#d7e9d6" stroke-width="5" stroke-linecap="round"') +
        island(255, 244, 1.08) + island(747, 244, 1.08) +
        tree(68, 259, 1.04) + tree(929, 272, 1.08) + tree(107, 305, .68) + tree(891, 313, .58), 'class="scene-base"') +
      SCENE_DRAWINGS[safeScene]() +
      '</svg>';
  }

  root.V2Art = Object.freeze({ icon, card, scene });
  if (typeof module === 'object' && module.exports) module.exports = root.V2Art;
})(typeof window !== 'undefined' ? window : globalThis);
