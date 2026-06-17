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
