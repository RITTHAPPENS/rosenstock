// Sticky header
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  // Mobile menu
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  const toggle = (open) => {
    burger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggle(!menu.classList.contains('open')));
  overlay.addEventListener('click', () => toggle(false));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));

  // Scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));

// Kontaktformular: Validierung + Versand (nur auf der Kontaktseite aktiv)
(function(){
  const cf = document.getElementById('contactForm');
  if (!cf) return;
  const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const validate = (el) => {
    if (el.type === 'checkbox') return el.checked;
    if (el.type === 'email') return emailRe.test(el.value.trim());
    return el.value.trim().length > 0;
  };
  cf.querySelectorAll('input,textarea').forEach(el => {
    const clear = () => { el.classList.remove('invalid'); const w = el.closest('.consent'); if (w) w.classList.remove('invalid'); };
    el.addEventListener('input', clear);
    el.addEventListener('change', clear);
  });
  cf.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true, first = null;
    cf.querySelectorAll('[required]').forEach(el => {
      const good = validate(el);
      if (!good) {
        ok = false;
        if (el.type === 'checkbox') { const w = el.closest('.consent'); if (w) w.classList.add('invalid'); }
        else el.classList.add('invalid');
        if (!first) first = el;
      }
    });
    document.getElementById('formError').style.display = 'none';
    if (!ok) { if (first) first.focus(); return; }
    const btn = cf.querySelector('button[type="submit"]');
    const label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Wird gesendet …';
    try {
      const res = await fetch(cf.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(cf) });
      if (!res.ok) throw new Error('Antwort nicht ok');
      cf.classList.add('hidden');
      document.getElementById('formSuccess').style.display = 'block';
      document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      btn.disabled = false; btn.textContent = label;
      document.getElementById('formError').style.display = 'block';
    }
  });
})();
