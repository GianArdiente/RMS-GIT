
const mainCard = document.getElementById('mainCard');
    const content = document.getElementById('content');
    const selPill = document.querySelectorAll('.selPill');
    const hint = document.getElementById('hint');
    const scene = document.getElementById('scene');
    let exploded = false;

    mainCard.addEventListener('mouseenter', () => {
      if (exploded) return;
      exploded = true;

      // Hide hint
      hint.classList.add('hidden');

      // Expand scene first, then animate
      scene.classList.add('expanded');

      // Explode main card
      mainCard.classList.add('exploded');

      // Show grid container
      cardsGrid.classList.add('visible');

      // Stagger mini cards in
      miniCards.forEach(card => {
        const delay = parseInt(card.dataset.delay) || 0;
        setTimeout(() => card.classList.add('show'), delay + 80);
      });

    });



let cur = 1;
let svcName='', svcPrice=0, selTime='';
const fills = ['0%','33.3%','66.6%','100%'];

function updateStepper(){
  for(let i=1;i<=4;i++){
    const c=document.getElementById('sc'+i), l=document.getElementById('sl'+i);
    c.className='st-circle'+(i===cur?' active':i<cur?' done':'');
    if(i<cur) c.textContent='✓'; else c.textContent='0'+i;
    l.className='st-lbl'+(i<=cur?' active':'');
  }
  document.getElementById('stFill').style.width = fills[cur-1];
}

function showStep(n){
  document.getElementById('s'+cur).classList.remove('active');
  cur=n;
  const el=document.getElementById('s'+n);
  el.classList.remove('active');
  void el.offsetWidth;
  el.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  if(n<=4) updateStepper();
}

function next(){
  if(cur===1){
    if(!svcName){alert('Please select a service to continue.');return;}
  }
  if(cur===2){
    const n=document.getElementById('fullName').value.trim();
    const e=document.getElementById('email').value.trim();
    const p=document.getElementById('phone').value.trim();
    const v=document.getElementById('vehicle').value.trim();
    if(!n||!e||!p||!v){alert('Please fill in all required fields.');return;}
  }
  if(cur===3){
    const d=document.getElementById('appointmentDate').value;
    if(!d){alert('Please pick a date.');return;}
    if(!selTime){alert('Please select a time slot.');return;}
    populateSummary();
  }
  if(cur<4) showStep(cur+1);
}

function prev(){ if(cur>1) showStep(cur-1); }

function selectService(el,name,price){
  document.querySelectorAll('.svc-card').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');
  svcName=name; svcPrice=price;
  const pill=document.getElementById('selPill');
  document.getElementById('selPillTxt').textContent=name;
  document.getElementById('selPillPrice').textContent='₱'+price.toLocaleString('en',{minimumFractionDigits:2});
  pill.classList.add('show');
}

function selectTime(el,time){
  document.querySelectorAll('.ts').forEach(b=>b.classList.remove('selected'));
  el.classList.add('selected');
  selTime=time;
}

function populateSummary(){
  document.getElementById('sumSvc').textContent=svcName;
  document.getElementById('sumName').textContent=document.getElementById('fullName').value;
  document.getElementById('sumEmail').textContent=document.getElementById('email').value;
  document.getElementById('sumPhone').textContent=document.getElementById('phone').value;
  document.getElementById('sumVehicle').textContent=document.getElementById('vehicle').value;
  document.getElementById('sumPlate').textContent=document.getElementById('plate').value||'—';
  document.getElementById('sumDate').textContent=document.getElementById('appointmentDate').value;
  document.getElementById('sumTime').textContent=selTime;
  document.getElementById('sumPrice').textContent='₱'+Number(svcPrice).toLocaleString('en',{minimumFractionDigits:2});
}

function downloadReceipt(){
  const pay=parseFloat(document.getElementById('paymentAmount').value)||0;
  const errEl=document.getElementById('payErr');
  if(pay<svcPrice*0.5){errEl.style.display='block';return;}
  errEl.style.display='none';
  const ref='AF-'+Math.floor(100000+Math.random()*900000);
  document.getElementById('cRef').textContent=ref;
  showStep(5);
  // hide stepper buttons for confirmed state
  document.getElementById('stFill').style.width='100%';
  for(let i=1;i<=4;i++){
    const c=document.getElementById('sc'+i);
    c.className='st-circle done';c.textContent='✓';
    document.getElementById('sl'+i).className='st-lbl active';
  }
}

function resetAll(){
  svcName='';svcPrice=0;selTime='';
  document.querySelectorAll('.svc-card').forEach(c=>c.classList.remove('selected'));
  document.querySelectorAll('.ts').forEach(b=>b.classList.remove('selected'));
  document.getElementById('selPill').classList.remove('show');
  ['fullName','email','phone','vehicle','plate','notes','appointmentDate','paymentAmount'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.value='';
  });
  document.getElementById('payErr').style.display='none';
  cur=1; showStep(1);
}

// Set today's date as default
const today=new Date().toISOString().split('T')[0];
document.getElementById('appointmentDate').value=today;
updateStepper();