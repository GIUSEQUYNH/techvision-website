
(()=>{
 const root=document.documentElement;
 const header=document.querySelector('header');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const sections=[...document.querySelectorAll('.section,.full-light,.full-dark,.project,.eco,.contact,.footer')];
 sections.forEach((el,i)=>{el.classList.add('reveal');if(i%3===1)el.classList.add('reveal-left');if(i%3===2)el.classList.add('reveal-right')});
 document.querySelectorAll('.cards,.industries,.steps,.news,.layers,.footergrid,.legal-links').forEach(el=>el.classList.add('reveal-stagger'));
 const targets=[...document.querySelectorAll('.reveal,.reveal-stagger')];
 if(reduce){targets.forEach(el=>el.classList.add('is-visible'))}
 else{
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  targets.forEach(el=>io.observe(el));
 }
 const setHeader=()=>header&&header.classList.toggle('is-scrolled',window.scrollY>24);
 setHeader();window.addEventListener('scroll',setHeader,{passive:true});
})();


(()=>{
 const hero=document.querySelector('.hero');
 if(!hero||hero.dataset.autoplayReady)return;
 hero.dataset.autoplayReady='1';
 const slides=[...hero.querySelectorAll('.slide')];
 const dots=[...hero.querySelectorAll('.dot')];
 const prev=hero.querySelector('.prev');
 const next=hero.querySelector('.next');
 const pause=hero.querySelector('.hero-pause');
 const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
 const duration=6500;
 let index=Math.max(0,slides.findIndex(s=>s.classList.contains('active')));
 let timer=null;
 let paused=motionPreference.matches;
 let hovered=false;
 let focused=false;
 function render(n){
   index=(n+slides.length)%slides.length;
   slides.forEach((s,i)=>s.classList.toggle('active',i===index));
   dots.forEach((d,i)=>{d.classList.toggle('active',i===index);d.setAttribute('aria-current',i===index?'true':'false')});
   hero.style.setProperty('--slide-duration',duration+'ms');
 }
 function stop(){if(timer){clearTimeout(timer);timer=null}}
 function schedule(){stop();if(!paused&&!hovered&&!focused&&!document.hidden&&slides.length>1)timer=setTimeout(()=>{render(index+1);schedule()},duration)}
 function setPaused(value){paused=value;hero.classList.toggle('is-paused',paused);if(pause){pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Tiếp tục Slider':'Tạm dừng Slider')}paused?stop():schedule()}
 function go(n){render(n);schedule()}
 if(prev)prev.addEventListener('click',()=>go(index-1));
 if(next)next.addEventListener('click',()=>go(index+1));
 dots.forEach((d,i)=>d.addEventListener('click',()=>go(i)));
 if(pause)pause.addEventListener('click',()=>setPaused(!paused));
 hero.addEventListener('mouseenter',()=>{hovered=true;schedule()});
 hero.addEventListener('mouseleave',()=>{hovered=false;schedule()});
 hero.addEventListener('focusin',()=>{focused=true;schedule()});
 hero.addEventListener('focusout',e=>{focused=hero.contains(e.relatedTarget);schedule()});
 motionPreference.addEventListener('change',e=>setPaused(e.matches));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else schedule()});
 let touchX=0;
 hero.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});
 hero.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>55)go(index+(dx<0?1:-1))},{passive:true});
 render(index);setPaused(paused);
})();
