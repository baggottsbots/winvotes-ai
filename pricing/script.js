document.addEventListener('DOMContentLoaded',function(){
  const PRICES={websiteBase:699,websiteAdd:199,video:450,fbads:100,social:1999};
  const state={websiteQty:0,videoQty:0,fbadsQty:0,socialQty:0};
  const $=id=>document.getElementById(id);
  const els={websiteQty:$('websiteQty'),videoQty:$('videoQty'),fbadsQty:$('fbadsQty'),socialQty:$('socialQty'),websiteTotal:$('websiteTotal'),videoTotal:$('videoTotal'),fbadsTotal:$('fbadsTotal'),socialTotal:$('socialTotal'),breakdown:$('totalsBreakdown'),total:$('totalDisplay'),btn:$('checkoutBtn'),note:$('checkoutNote'),email:$('email'),fbAdsLine:$('fbAdsLine'),fbAdsWarning:$('fbAdsWarning')};
  const money=n=>'$'+n.toLocaleString();

  function lineTotals(){
    return {
      website: state.websiteQty>=1 ? PRICES.websiteBase + Math.max(0,state.websiteQty-1)*PRICES.websiteAdd : 0,
      video: state.videoQty*PRICES.video,
      fbads: state.fbadsQty*PRICES.fbads,
      social: state.socialQty*PRICES.social
    };
  }

  function render(){
    els.websiteQty.textContent=state.websiteQty;
    els.videoQty.textContent=state.videoQty;
    els.fbadsQty.textContent=state.fbadsQty;
    els.socialQty.textContent=state.socialQty;
    const lt=lineTotals();
    els.websiteTotal.textContent=money(lt.website);
    els.videoTotal.textContent=money(lt.video);
    els.fbadsTotal.textContent=money(lt.fbads);
    els.socialTotal.textContent=money(lt.social);

    // Show/hide Facebook ads line based on video selection
    if(state.videoQty>0){
      els.fbAdsLine.classList.add('active');
      els.fbAdsWarning.classList.add('show');
      // If videos selected but no ad spend, show warning and disable checkout
      if(state.fbadsQty===0){
        els.fbAdsWarning.textContent='Required when videos are selected (minimum $100)';
      }else{
        els.fbAdsWarning.classList.remove('show');
      }
    }else{
      els.fbAdsLine.classList.remove('active');
      els.fbAdsWarning.classList.remove('show');
      state.fbadsQty=0;
      els.fbadsQty.textContent='0';
      els.fbadsTotal.textContent='$0';
    }

    const rows=[];
    if(state.websiteQty>0)rows.push(`<div class="totals-row"><span>Campaign Website \xd7 ${state.websiteQty}</span><span>${money(lt.website)}</span></div>`);
    if(state.videoQty>0)rows.push(`<div class="totals-row"><span>Video Production \xd7 ${state.videoQty}</span><span>${money(lt.video)}</span></div>`);
    if(state.fbadsQty>0)rows.push(`<div class="totals-row"><span>Facebook Video Ads</span><span>${money(lt.fbads)}</span></div>`);
    if(state.socialQty>0)rows.push(`<div class="totals-row"><span>Social Media \xd7 ${state.socialQty} mo</span><span>${money(lt.social)}</span></div>`);
    els.breakdown.innerHTML=rows.join('');

    const total=lt.website+lt.video+lt.fbads+lt.social;
    els.total.textContent=money(total);

    // Check validity: email required, total > 0, and if videos selected, fbads must be > 0
    const videosSelected=state.videoQty>0;
    const adsAllocated=state.fbadsQty>0;
    const hasEmail=els.email.value.trim().length>0;
    const ok=hasEmail && total>0 && (!videosSelected || adsAllocated);
    
    els.btn.disabled=!ok;
    
    if(total<=0){
      els.note.textContent='Add at least one service to continue.';
    }else if(!hasEmail){
      els.note.textContent='Enter your email to proceed to secure checkout.';
    }else if(videosSelected && !adsAllocated){
      els.note.textContent='Videos require Facebook ad spend allocation (minimum $100).';
    }else{
      els.note.textContent='Ready to proceed to secure checkout.';
    }
  }

  function update(m,d){
    const lim={website:{min:0,max:10},video:{min:0,max:10},fbads:{min:0,max:50},social:{min:0,max:12}};
    const key={website:'websiteQty',video:'videoQty',fbads:'fbadsQty',social:'socialQty'}[m];
    state[key]=Math.min(lim[m].max,Math.max(lim[m].min,state[key]+d));
    render();
  }

  function checkout(){
    const email=els.email.value.trim();
    if(!email)return;
    const lt=lineTotals();
    const total=lt.website+lt.video+lt.fbads+lt.social;
    if(total<=0)return;
    // Validate: if videos, fbads must be > 0
    if(state.videoQty>0 && state.fbadsQty===0)return;
    const sel=[];
    if(state.websiteQty>0)sel.push(`Website x${state.websiteQty}`);
    if(state.videoQty>0)sel.push(`Videos x${state.videoQty}`);
    if(state.fbadsQty>0)sel.push(`Facebook Ads $${state.fbadsQty*100}`);
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