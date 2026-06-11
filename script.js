// scoreboard count-up
const counter = document.querySelector('[data-count]');
let counted = false;
function countUp(){
  if(counted) return; counted = true;
  const target = parseInt(counter.dataset.count,10);
  let cur = 0;
  const t = setInterval(()=>{
    cur++; counter.textContent = cur;
    if(cur >= target) clearInterval(t);
  }, 260);
}
// scroll reveals
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      if(e.target.querySelector && e.target.querySelector('[data-count]')) countUp();
      if(e.target.hasAttribute('data-count')) countUp();
      io.unobserve(e.target);
    }
  });
},{threshold:.25});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
if(matchMedia('(prefers-reduced-motion: reduce)').matches){
  counter.textContent = counter.dataset.count; counted = true;
}
// form source field
const form = document.getElementById('leadForm');
form.addEventListener('submit', ()=> {
  // platform webhook handler intercepts; source noted via hidden field
});
const src = document.createElement('input');
src.type='hidden'; src.name='source'; src.value='winvotes.ai website';
form.appendChild(src);