document.addEventListener('DOMContentLoaded',function(){
  const PRICES={websiteBase:699,websiteAdd:199,video:450,social:1999};
  const state={websiteQty:1,videoQty:0,socialQty:0};
  const $=id=>document.getElementById(id);
  const els={websiteQty:$('websiteQty'),videoQty:$('videoQty'),socialQty:$('socialQty'),websiteTotal:$('websiteTotal'),videoTotal:$('videoTotal'),socialTotal:$('socialTotal'),breakdown:$('totalsBreakdown'),total:$('totalDisplay'),btn:$('checkoutBtn'),note:$('checkoutNote'),email:$('email')};
  const money=n=>'$'+n.toLocaleString();

  function lineTotals(){
    return {
      website: state.websiteQty>=1 ? PRICES.websiteBase + Math.max(0,state.websiteQty-1)*PRICES.websiteAdd : 0,
      video: state.videoQty*PRICES.video,
      social: state.socialQty*PRICES.social
    };
  }

  function render(){
    els.websiteQty.textContent=state.websiteQty;
    els.videoQty.textContent=state.videoQty;
    els.socialQty.textContent=state.socialQty;
    const lt=lineTotals();
    els.websiteTotal.textContent=money(lt.website);
    els.videoTotal.textContent=money(lt.video);
    els.socialTotal.textContent=money(lt.social);

    const rows=[];
    if(state.websiteQty>0)rows.push(`<div class="totals-row"><span>Campaign Website \xd7 ${state.websiteQty}</span><span>${money(lt.website)}</span></div>`);
    if(state.videoQty>0)rows.push(`<div class="totals-row"><span>Video Production \xd7 ${state.videoQty}</span><span>${money(lt.video)}</span></div>`);
    if(state.socialQty>0)rows.push(`<div class="totals-row"><span>Social Media \xd7 ${state.socialQty} mo</span><span>${money(lt.social)}</span></div>`);
    els.breakdown.innerHTML=rows.join('');

    const total=lt.website+lt.video+lt.social;
    els.total.textContent=money(total);

    const ok=els.email.value.trim().length>0 && total>0;
    els.btn.disabled=!ok;
    els.note.textContent = total<=0 ? 'Add at least one service to continue.' : (els.email.value.trim().length>0 ? 'Ready to proceed to secure checkout.' : 'Enter your email to proceed to secure checkout.');
  }

  function update(m,d){
    const lim={website:{min:1,max:10},video:{min:0,max:10},social:{min:0,max:12}};
    const key={website:'websiteQty',video:'videoQty',social:'socialQty'}[m];
    state[key]=Math.min(lim[m].max,Math.max(lim[m].min,state[key]+d));
    render();
  }

  function checkout(){
    const email=els.email.value.trim();
    if(!email)return;
    const lt=lineTotals();
    const total=lt.website+lt.video+lt.social;
    if(total<=0)return;
    const sel=[];
    if(state.websiteQty>0)sel.push(`Website x${state.websiteQty}`);
    if(state.videoQty>0)sel.push(`Videos x${state.videoQty}`);
    if(state.socialQty>0)sel.push(`Social x${state.socialQty}mo`);
    if(typeof window.__processDonation==='function'){
      window.__processDonation({amount:total,email:email,label:sel.join(' + ')});
    }
  }

  document.querySelectorAll('[data-increment]').forEach(b=>b.addEventListener('click',()=>update(b.getAttribute('data-increment'),1)));
  document.querySelectorAll('[data-decrement]').forEach(b=>b.addEventListener('click',()=>update(b.getAttribute('data-decrement'),-1)));
  els.email.addEventListener('input',render);
  els.btn.addEventListener('click',checkout);
  render();
});