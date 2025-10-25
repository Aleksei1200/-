/*сокращеные комнады*/
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/*бургер и офканвас*/
const burger = $('#burger'), off = $('#offcanvas');
burger.addEventListener('click', ()=>{burger.classList.toggle('open');off.classList.toggle('open');});
// Закрытие при клике на ссылку
$$('#offcanvas nav a').forEach(a=>a.addEventListener('click', ()=>{burger.classList.remove('open');off.classList.remove('open');}));

/*тйапинг*/
const words = ['крутые интерфейсы','внимание к деталям','быстрые анимации','простые решения'];
const typed = $('#typed');let wI=0, cI=0;
function tick(){
  const word = words[wI];
  typed.textContent = word.slice(0,cI);
  cI++;
  if(cI>word.length){
    setTimeout(()=>{
      const del = setInterval(()=>{
        typed.textContent = word.slice(0,typed.textContent.length-1);
        if(typed.textContent.length===0){
          clearInterval(del);
          wI=(wI+1)%words.length;
          cI=0;
          setTimeout(tick,250);
        }
      },40)
    },900);
  } else setTimeout(tick,80);
}
tick();

/*наклон карточки*/
const card = $('#tiltCard');
card.addEventListener('mousemove', (e)=>{
  const r=card.getBoundingClientRect();
  const dx=(e.clientX - (r.left+r.width/2))/(r.width/2);
  const dy=(e.clientY - (r.top+r.height/2))/(r.height/2);
  card.style.transform = `perspective(800px) rotateX(${ -dy*6 }deg) rotateY(${ dx*6 }deg) translateZ(6px)`;
});
card.addEventListener('mouseleave', ()=>{card.style.transform='none'});

/*эффект всплеска (ripple)*/
function rippleize(btn){
  btn.addEventListener('click', (e)=>{
    const r = document.createElement('span');
    r.className='ripple';
    btn.appendChild(r);
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width,rect.height);
    r.style.width = r.style.height = size+'px';
    r.style.left = (e.clientX - rect.left - size/2)+'px';
    r.style.top = (e.clientY - rect.top - size/2)+'px';
    r.style.background = 'rgba(255,255,255,0.4)';
    r.style.transform='scale(0)';
    r.style.transition='transform .6s ease,opacity .6s ease';
    requestAnimationFrame(()=>{r.style.transform='scale(1)';r.style.opacity='0';});
    setTimeout(()=>r.remove(),700)
  })
}
rippleize($('#rippleBtn'));
rippleize($('.btn'));

/*Плавное появление элементов*/
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible')}
  });
},{threshold:0.18});
$$('.reveal').forEach(el=>io.observe(el));

/*аккордеон (FAQ)*/
(function(){
  const faq = $('#faq');
  const heads = Array.from(faq.querySelectorAll('.head'));
  heads.forEach(h=>{
    h.addEventListener('click', ()=>{
      const next = h.nextElementSibling;
      const open = next.style.height && next.style.height!=='0px';
      if(open){
        next.style.height='0';
        next.style.paddingTop='0';
        next.style.paddingBottom='0';
        h.querySelector('span').textContent='+';
      } else {
        next.style.padding='12px 16px';
        const full = next.scrollHeight;
        next.style.height = full+'px';
        h.querySelector('span').textContent='−';
      }
    })
  })
})();

/*счётчики*/
function animateCounter(el, target){
  let start=0;
  const dur=1200;
  const startTime=performance.now();
  function step(now){
    const t=Math.min(1,(now-startTime)/dur);
    const ease = t*(2-t);
    const val = Math.floor(ease*target);
    el.textContent = val;
    if(t<1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}
document.getElementById('scrollToStats').addEventListener('click', ()=>document.getElementById('stats').scrollIntoView({behavior:'smooth'}));

const counterEls = $$('#stats .counter');
const statIo = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const num = e.target.querySelector('.num');
      const target = +e.target.dataset.target;
      animateCounter(num,target);
      statIo.unobserve(e.target);
    }
  })
},{threshold:0.4});
counterEls.forEach(c=>statIo.observe(c));

/*Прогресс-бары*/
const skill = document.querySelector('.skill');
const bar = skill.querySelector('.bar');
const skillIo = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const amt = +skill.dataset.amt;
      bar.style.width = amt+'%';
      skillIo.unobserve(skill);
    }
  })
},{threshold:0.4});
skillIo.observe(skill);

/*модальное окно*/
const modal = $('#modal');
$('#openModal').addEventListener('click', ()=>{modal.classList.add('open')});
$('#closeModal').addEventListener('click', ()=>{modal.classList.remove('open')});
modal.addEventListener('click', (e)=>{if(e.target===modal) modal.classList.remove('open')});

/*параллакс фон*/
const parBg = document.querySelector('.parallax .bg');
addEventListener('scroll', ()=>{
  const rect = parBg.getBoundingClientRect();
  const winH = innerHeight;
  const pct = Math.min(1, Math.max(0, 1 - (rect.top / (winH + rect.height))));
  parBg.style.transform = `translateY(${ -20 + pct*20 }px)`;
});

/*Esc*/
addEventListener('keydown', (e)=>{
  if(e.key==='Escape'){
    off.classList.remove('open');
    burger.classList.remove('open');
    modal.classList.remove('open');
  }
});

/*отложенная инициализация тяжёлых эффектов*/
let inited=false;
function lazyInit(){
  if(inited)return;
  inited=true;

}
['scroll','mousemove','touchstart'].forEach(evt=>addEventListener(evt, lazyInit, {once:true}));

// форма курс 
const form = document.getElementById('signupForm');
const thanks = document.getElementById('thanks');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    if (!name || !email) return alert('Пожалуйста, заполните все поля.');

    form.style.display = 'none';
    thanks.style.display = 'block';
  });
}
