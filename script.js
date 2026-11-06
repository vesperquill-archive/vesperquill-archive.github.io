
const nav = document.getElementById('nav');
const menu = document.getElementById('menu');

if (nav && menu) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    });
  });
}

const chaptersScript = document.createElement('script');
chaptersScript.src = 'chapters.js';

chaptersScript.onload = () => {
  const grid = document.getElementById('chapter-grid');
  const search = document.getElementById('search');
  const count = document.getElementById('count');
  const empty = document.getElementById('empty');

  if (!grid || !search || !count || !empty ||
      !Array.isArray(window.CHAPTERS)) return;

  const ranges = [
    { label: 'Chapters 1–100', min: 1, max: 100 },
    { label: 'Chapters 101–200', min: 101, max: 200 },
    { label: 'Chapters 201–300', min: 201, max: 300 },
    { label: 'Chapters 301–Current', min: 301, max: Infinity }
  ];

  let selected = 0;

  const tabs = document.createElement('div');
  tabs.className = 'chapter-tabs';
  tabs.setAttribute('role', 'group');
  tabs.setAttribute('aria-label', 'Choose chapter range');

  const buttons = ranges.map((range, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chapter-tab';
    button.textContent = range.label;

    button.addEventListener('click', () => {
      selected = index;
      render();
    });

    tabs.append(button);
    return button;
  });

  const controls = search.closest('.controls');

  if (controls) {
    controls.insertAdjacentElement('afterend', tabs);
  } else {
    grid.parentNode.insertBefore(tabs, grid);
  }

  function render() {
    const q = search.value.trim().toLowerCase();
    const range = ranges[selected];

    buttons.forEach((button, i) => {
      button.classList.toggle('active', i === selected);
      button.setAttribute('aria-pressed', String(i === selected));
    });

    const items = window.CHAPTERS.filter(c => {
      const number = Number(c.number);
      const matchesRange =
        number >= range.min && number <= range.max;

      const matchesSearch = [
        c.number,
        c.title,
        c.description,
        ...(c.tags || [])
      ].join(' ').toLowerCase().includes(q);

      return matchesRange && matchesSearch;
    });

    grid.replaceChildren();

    items.forEach(c => {
      const card = document.createElement('a');
      card.className = 'chapter-card';
      card.href = c.href;

      const kicker = document.createElement('div');
      kicker.className = 'chapter-kicker';
      kicker.textContent =
        `✦ CHAPTER ${String(c.number).padStart(2, '0')}`;

      const h = document.createElement('h3');
      h.textContent = c.title;

      const p = document.createElement('p');
      p.textContent = c.description;

      const link = document.createElement('span');
      link.className = 'chapter-link';
      link.textContent = `${c.status} →`;

      card.append(kicker, h, p, link);
      grid.append(card);
    });

    count.textContent =
      `${items.length} ${items.length === 1 ? 'chapter' : 'chapters'}`;

    empty.hidden = items.length > 0;

    if (!items.length) {
      empty.textContent = q
        ? 'No chapters in this range match your search. Try another word ♡'
        : 'No chapters have been uploaded in this range yet ♡';
    }
  }

  search.addEventListener('input', render);
  render();
};

document.body.append(chaptersScript);
