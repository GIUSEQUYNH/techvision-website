(() => {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navigation = document.querySelector('#mobile-navigation');
  const mobile = matchMedia('(max-width:900px)');
  function close(returnFocus = false) {
    navigation.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Mở menu');
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    navigation.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  });
  navigation.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !navigation.hidden) close(true); });
  document.addEventListener('click', e => { if (!e.target.closest('header')) close(); });
  mobile.addEventListener('change', () => close());
  // Mobile landing-page links lead to content available on this page.
  const targets = new Map([
    ['giai-phap.html', '#giai-phap'], ['so-hoa-san-xuat.html', '#giai-phap'],
    ['ai-san-xuat.html', '#giai-phap'], ['doi-tac.html', '#he-sinh-thai'],
    ['du-an-tieu-bieu.html', '#du-an'],
    ['lien-he.html', 'mailto:huongquynhgrvn@huongquynhgroupvn.com']
  ]);
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    const target = link && targets.get(link.getAttribute('href'));
    if (mobile.matches && target) {
      e.preventDefault();
      if (target.startsWith('#')) location.hash = target;
      else location.href = target;
    }
  });
})();
