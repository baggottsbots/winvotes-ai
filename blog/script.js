function setNav() {
    var w = window.innerWidth;
    var links = document.getElementById('nav-links');
    var cta = document.getElementById('nav-cta');
    var btn = document.getElementById('mobile-btn');
    if (w >= 768) { links.style.display='flex'; cta.style.display='inline-block'; btn.style.display='none'; }
    else { links.style.display='none'; cta.style.display='none'; btn.style.display='block'; }
  }
  window.addEventListener('resize', setNav);
  setNav();
  document.addEventListener('keydown', function(e) {
    if (e.key==='Escape') document.getElementById('mobile-menu').classList.remove('open');
  });