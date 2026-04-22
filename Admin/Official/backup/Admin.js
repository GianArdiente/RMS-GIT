const D={
  featured:[
    {name:'Premium Oil Change',price:'9999.99',type:'Service',status:'active',desc:'Full synthetic oil change with 21-point inspection.',imgSrc:'',stock:50},
    {name:'Brake Pad Replacement',price:'4500.00',type:'Service',status:'active',desc:'OEM-grade brake pads for all vehicle types.',imgSrc:'',stock:30},
    {name:'Engine Tune-Up',price:'7800.00',type:'Service',status:'active',desc:'Complete engine diagnostic and tune-up service.',imgSrc:'',stock:20},
    {name:'Battery Replacement',price:'3200.00',type:'Service',status:'inactive',desc:'Battery testing, cleaning, and full replacement.',imgSrc:'',stock:15},
  ],
  promos:[
    {name:'Summer Oil Change Deal',price:'7999.00',type:'Promo',status:'active',desc:'20% off on oil change this summer season only!',imgSrc:'',stock:100},
    {name:'Free AC Check',price:'0.00',type:'Promo',status:'active',desc:'Free AC system inspection with any engine service.',imgSrc:'',stock:50},
  ],
  shop:[
    {name:'Engine Oil 5W-30',price:'350',cat:'Fluid',status:'active',stock:45,desc:'High-performance synthetic engine oil 1L.',imgSrc:''},
    {name:'Brake Pads Front',price:'1200',cat:'Part',status:'active',stock:8,desc:'OEM-spec front brake pads set.',imgSrc:''},
    {name:'Air Filter Premium',price:'450',cat:'Part',status:'sold-out',stock:0,desc:'High-flow cabin air filter.',imgSrc:''},
    {name:'Spark Plugs x4',price:'800',cat:'Part',status:'active',stock:22,desc:'Iridium spark plugs set of 4.',imgSrc:''},
    {name:'Coolant 1L',price:'220',cat:'Fluid',status:'active',stock:30,desc:'Anti-freeze coolant concentrate.',imgSrc:''},
    {name:'Car Wax Kit',price:'650',cat:'Accessory',status:'active',stock:18,desc:'Complete car wax and polish kit.',imgSrc:''},
  ],
  news:[
    {title:'REV Now Open on Sundays!',body:'We are now open every Sunday from 8AM to 5PM to serve you better.',category:'Announcement',status:'published',imgSrc:'',date:'Dec 1, 2024'},
    {title:'Oil Change Promo — Save 20%',body:'This December, avail of our premium oil change service at 20% off. Limited slots only.',category:'Promo',status:'published',imgSrc:'',date:'Nov 28, 2024'},
  ],
  bookings:[
    {id:'BK-001',customer:'Maria Santos',service:'Oil Change',date:'2024-12-01',time:'10:00 AM',status:'confirmed'},
    {id:'BK-002',customer:'Jose Reyes',service:'Brake Repair',date:'2024-12-01',time:'11:30 AM',status:'pending'},
    {id:'BK-003',customer:'Ana Cruz',service:'Engine Tune-Up',date:'2024-12-02',time:'9:00 AM',status:'confirmed'},
    {id:'BK-004',customer:'Carlos Lim',service:'Tire Rotation',date:'2024-12-02',time:'2:00 PM',status:'completed'},
    {id:'BK-005',customer:'Eva Mendoza',service:'Battery Check',date:'2024-12-03',time:'10:30 AM',status:'cancelled'},
    {id:'BK-006',customer:'Ramon Torres',service:'AC Service',date:'2024-12-03',time:'1:00 PM',status:'pending'},
  ],
  customers:[
    {id:'CU-001',name:'Maria Santos',email:'maria@gmail.com',phone:'09171234567',visits:8,status:'active'},
    {id:'CU-002',name:'Jose Reyes',email:'jose@gmail.com',phone:'09181234567',visits:3,status:'active'},
    {id:'CU-003',name:'Ana Cruz',email:'ana@gmail.com',phone:'09191234567',visits:12,status:'active'},
    {id:'CU-004',name:'Carlos Lim',email:'carlos@gmail.com',phone:'09201234567',visits:1,status:'inactive'},
  ],
  joborders:[
    {id:'JO-001',vehicle:'Toyota Camry 2020',customer:'Maria Santos',tech:'Ricky Dela Rosa',service:'Oil Change',progress:100,status:'completed'},
    {id:'JO-002',vehicle:'Honda Civic 2019',customer:'Jose Reyes',tech:'Carlo Bautista',service:'Brake Repair',progress:65,status:'in-progress'},
    {id:'JO-003',vehicle:'Ford Ranger 2022',customer:'Ana Cruz',tech:'Manny Pascual',service:'Engine Tune-Up',progress:30,status:'in-progress'},
    {id:'JO-004',vehicle:'Mitsubishi Montero',customer:'Carlos Lim',tech:'Ricky Dela Rosa',service:'Tire Rotation',progress:0,status:'pending'},
  ],
  techs:[
    {name:'Ricky Dela Rosa',role:'Senior Mechanic',jobs:24,rating:4.9,status:'available',icon:'🔧',exp:8},
    {name:'Carlo Bautista',role:'Engine Specialist',jobs:18,rating:4.8,status:'busy',icon:'⚙️',exp:5},
    {name:'Manny Pascual',role:'Electrician',jobs:15,rating:4.7,status:'available',icon:'⚡',exp:4},
    {name:'Jun Soriano',role:'Body Works',jobs:11,rating:4.6,status:'on-leave',icon:'🚗',exp:3},
  ],
  staffs:[
    {name:'Jm Gupit',role:'Admin Manager',dept:'Management',status:'active',icon:'👔'},
    {name:'Cedric Ramos',role:'Service Advisor',dept:'Front Desk',status:'active',icon:'📋'},
    {name:'Anna Reyes',role:'Cashier',dept:'Finance',status:'active',icon:'💰'},
    {name:'Ben Santos',role:'Parts Manager',dept:'Inventory',status:'inactive',icon:'📦'},
  ],
  accounts:[
    {fname:'Ricky',lname:'Dela Rosa',username:'ricky.delarosa',role:'technician',dept:'Workshop',access:'standard',status:'active',icon:'🔧',created:'2024-10-01'},
    {fname:'Anna',lname:'Reyes',username:'anna.reyes',role:'cashier',dept:'Finance',access:'basic',status:'active',icon:'💰',created:'2024-10-05'},
    {fname:'Cedric',lname:'Ramos',username:'cedric.ramos',role:'advisor',dept:'Front Desk',access:'standard',status:'active',icon:'📋',created:'2024-10-10'},
    {fname:'Carlo',lname:'Bautista',username:'carlo.bautista',role:'technician',dept:'Workshop',access:'standard',status:'active',icon:'⚙️',created:'2024-11-01'},
  ],
  receipts:[
    {id:'RC-001',customer:'Maria Santos',service:'Oil Change',amount:'9,999.99',date:'2024-11-28',method:'Cash',status:'paid'},
    {id:'RC-002',customer:'Jose Reyes',service:'Brake Repair',amount:'4,500.00',date:'2024-11-29',method:'GCash',status:'paid'},
    {id:'RC-003',customer:'Ana Cruz',service:'Engine Tune',amount:'7,800.00',date:'2024-11-30',method:'Card',status:'pending'},
  ],
  records:[
    {id:'SR-001',customer:'Maria Santos',vehicle:'Toyota Camry',service:'Oil Change',date:'2024-11-25',cost:'₱9,999',status:'completed'},
    {id:'SR-002',customer:'Jose Reyes',vehicle:'Honda Civic',service:'Brake Repair',date:'2024-11-26',cost:'₱4,500',status:'completed'},
  ],
  notifs:[
    {id:1,icon:'fa-calendar-check',color:'#A67F38',bg:'rgba(166,127,56,.15)',text:'New booking from Maria Santos — Oil Change',time:'Just now',tag:'Booking',read:false},
    {id:2,icon:'fa-exclamation-triangle',color:'#ef4444',bg:'rgba(239,68,68,.12)',text:'Low stock: Brake Pads — only 8 units left',time:'15 min ago',tag:'Inventory',read:false},
    {id:3,icon:'fa-check-circle',color:'#10b981',bg:'rgba(16,185,129,.12)',text:'Job Order JO-001 completed by Ricky Dela Rosa',time:'1 hour ago',tag:'Job Order',read:false},
    {id:4,icon:'fa-newspaper',color:'#F2DB94',bg:'rgba(242,219,148,.1)',text:'Oil Change Promo — save 20% this week!',time:'2 hours ago',tag:'News',read:false},
    {id:5,icon:'fa-users',color:'#60a5fa',bg:'rgba(59,130,246,.12)',text:'5 new customers registered this week',time:'3 hours ago',tag:'Customers',read:true},
  ],
  live:[
    {label:'Toyota Camry',status:'In Service',color:'#10b981'},
    {label:'Honda Civic',status:'Diagnosing',color:'#A67F38'},
    {label:'Ford Ranger',status:'Completed',color:'#F2DB94'},
    {label:'Mitsubishi Montero',status:'Waiting',color:'#8b5cf6'},
    {label:'Kia Sportage',status:'Invoiced',color:'#60a5fa'},
  ],
  revenue:{2024:[45,60,38,72,55,88,65,79,92,68,84,95],2025:[52,48,70,85,63,74,90,55,80,100,76,88],2026:[60,72,55,90,48,95,70,85,65,78,88,102]}
};

let pendingDel={type:'',idx:-1};

function badge(s){
  const m={active:'bg',inactive:'br',pending:'bd',confirmed:'bb',completed:'bg',cancelled:'br','in-progress':'bb',paid:'bg','in-stock':'bg',low:'bd',out:'br','sold-out':'br',available:'bg',busy:'bd','on-leave':'bp',published:'bg',draft:'bd',basic:'bd',standard:'bb',full:'bg'};
  return `<span class="b ${m[s]||'bd'}">${s.charAt(0).toUpperCase()+s.slice(1).replace(/-/g,' ')}</span>`;
}
function fmt(p){return parseFloat(p).toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2});}

const pNames={dashboard:'Dashboard',booking:'Booking',records:'Reports & Analytics',joborders:'Job Orders',shop:'Shop',posts:'Posts & News',customers:'Customers',technicians:'Technicians',staffs:'Staffs',accounts:'Staff Accounts',receipts:'Receipts',settings:'Settings'};
function nav(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.ni').forEach(n=>n.classList.remove('active'));
  const pg=document.getElementById('page-'+page);
  if(pg)pg.classList.add('active');
  const m=document.querySelector(`.ni[data-page="${page}"]`);
  if(m)m.classList.add('active');
  document.getElementById('bc').textContent=pNames[page]||page;
  closeSb();closeDD();
  renderPage(page);
}
function renderPage(p){
  if(p==='booking')renderTb('bkTb',D.bookings,['id','customer','service','date','time','status'],true);
  if(p==='records')renderTb('recTb',D.records,['id','customer','vehicle','service','date','cost','status']);
  if(p==='customers')renderTb('cusTb',D.customers,['id','name','email','phone','visits','status']);
  if(p==='receipts')renderTb('rcTb',D.receipts,['id','customer','service','amount','date','method','status']);
  if(p==='joborders')renderJO();
  if(p==='technicians')renderTechs();
  if(p==='staffs')renderStaffs();
  if(p==='shop')renderShopPage();
  if(p==='posts')renderPosts();
  if(p==='accounts')renderAccounts();
  if(p==='records')buildHistoryRows(allRecords);
  if(p==='services')svcRender();   // ← ADD THIS LINE
  if(p==='inventory')renderInventory(); // ← AND THIS LINE
}

function renderTb(id,rows,cols,act=false){
  const tb=document.getElementById(id);if(!tb)return;tb.innerHTML='';
  rows.forEach(r=>{
    const tr=document.createElement('tr');
    cols.forEach(c=>{
      const td=document.createElement('td');const v=r[c]??'';
      if(c==='status')td.innerHTML=badge(v);
      else if(c==='id'){td.style.cssText='font-family:Rajdhani,sans-serif;font-weight:700;font-size:11px;color:#A67F38;';td.textContent=v;}
      else if(c==='amount'||c==='cost'){td.style.cssText='font-family:"Barlow Condensed",sans-serif;font-weight:700;font-size:15px;color:#F2DB94;';td.textContent=c==='amount'?'₱'+v:v;}
      else{td.style.color='#888';td.style.fontSize='13px';td.textContent=v;}
      tr.appendChild(td);
    });
    if(act){const td=document.createElement('td');td.innerHTML=`<button onclick='showBk(${JSON.stringify(r)})' class="btn-g" style="font-size:10px;padding:4px 11px;">View</button>`;tr.appendChild(td);}
    tb.appendChild(tr);
  });
}
function renderJO(){
  const tb=document.getElementById('joTb');if(!tb)return;tb.innerHTML='';
  D.joborders.forEach(j=>{const tr=document.createElement('tr');tr.innerHTML=`<td style="font-family:Rajdhani,sans-serif;font-weight:700;font-size:11px;color:#A67F38;">${j.id}</td><td style="color:#999;font-size:12px;">${j.vehicle}</td><td style="color:#777;font-size:12px;">${j.customer}</td><td style="color:#777;font-size:12px;">${j.tech}</td><td style="color:#666;font-size:12px;">${j.service}</td><td style="min-width:90px;"><div style="display:flex;align-items:center;gap:7px;"><div class="prog-t" style="flex:1;"><div class="prog-f" style="width:${j.progress}%;"></div></div><span style="font-family:Rajdhani,sans-serif;font-weight:700;font-size:9px;color:#A67F38;">${j.progress}%</span></div></td><td>${badge(j.status)}</td>`;tb.appendChild(tr);});
}

function renderTechs(){
  const g=document.getElementById('techGrid');if(!g)return;g.innerHTML='';
  D.techs.forEach((t,i)=>{
    const d=document.createElement('div');d.className='pc';
    d.innerHTML=`<div style="width:48px;height:48px;border-radius:50%;background:rgba(166,127,56,.1);border:1px solid rgba(166,127,56,.18);display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 9px;">${t.icon}</div><div class="gt" style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;margin-bottom:1px;">${t.name}</div><div style="font-size:11px;color:#333;margin-bottom:1px;">${t.role}</div><div style="font-size:10px;color:#222;margin-bottom:7px;">${t.exp} yrs · ★${t.rating}</div><div style="margin-bottom:8px;">${badge(t.status)}</div><div style="display:flex;gap:4px;"><button onclick="openEditPeople('tech',${i})" class="btn-e" style="flex:1;padding:5px;font-size:10px;"><i class="fas fa-pen"></i></button><button onclick="openStatusEdit('tech',${i},'${t.name}')" class="btn-s" style="flex:1;padding:5px;font-size:10px;">Status</button><button onclick="confirmDel('tech',${i})" class="btn-d" style="flex:1;padding:5px;font-size:10px;"><i class="fas fa-trash"></i></button></div>`;
    g.appendChild(d);
  });
}
function renderStaffs(){
  const g=document.getElementById('staffGrid');if(!g)return;g.innerHTML='';
  D.staffs.forEach((s,i)=>{
    const d=document.createElement('div');d.className='pc';
    d.innerHTML=`<div style="width:48px;height:48px;border-radius:50%;background:rgba(166,127,56,.1);border:1px solid rgba(166,127,56,.18);display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 9px;">${s.icon}</div><div class="gt" style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;margin-bottom:1px;">${s.name}</div><div style="font-size:11px;color:#333;margin-bottom:1px;">${s.role}</div><div style="font-size:10px;color:#222;margin-bottom:7px;">${s.dept}</div><div style="margin-bottom:8px;">${badge(s.status)}</div><div style="display:flex;gap:4px;"><button onclick="openEditPeople('staff',${i})" class="btn-e" style="flex:1;padding:5px;font-size:10px;"><i class="fas fa-pen"></i></button><button onclick="openStatusEdit('staff',${i},'${s.name}')" class="btn-s" style="flex:1;padding:5px;font-size:10px;">Status</button><button onclick="confirmDel('staff',${i})" class="btn-d" style="flex:1;padding:5px;font-size:10px;"><i class="fas fa-trash"></i></button></div>`;
    g.appendChild(d);
  });
}

let peopleEditType='',peopleEditIdx=-1;
function openEditPeople(type,i){
  const isT=type==='tech';const arr=isT?D.techs:D.staffs;const item=arr[i];
  peopleEditType=type;peopleEditIdx=i;
  document.getElementById('postModalTitle').textContent=isT?'Edit Technician':'Edit Staff';
  document.getElementById('postTypeTabs').style.display='none';
  document.getElementById('postType').value=type;
  document.getElementById('postEditIdx').value=i;
  document.getElementById('postName').value=item.name;
  document.getElementById('postDesc').value=item.role+(isT?' — '+item.exp+' yrs exp':'');
  document.getElementById('postPrice').value=isT?item.rating:'';
  document.getElementById('postStock').value=isT?item.jobs:'';
  document.getElementById('postStockLbl').textContent=isT?'Jobs Done':'';
  document.getElementById('postCatRow').style.display='none';
  document.getElementById('postSaveBtn').textContent='Save Changes';
  document.getElementById('postImgPrev').style.display='none';
  document.getElementById('postImgPh').style.display='block';
  openModal('postModal');
}
function openAddPost(type){
  document.getElementById('postModalTitle').textContent=type==='shop'?'Add Shop Item':type==='promo'?'Add Promo':type==='tech'?'Add Technician':type==='staff'?'Add Staff':'Add Featured Service';
  document.getElementById('postTypeTabs').style.display=(!['tech','staff'].includes(type))?'flex':'none';
  document.getElementById('postType').value=type;
  document.getElementById('postEditIdx').value='-1';
  document.getElementById('postName').value='';
  document.getElementById('postDesc').value='';
  document.getElementById('postPrice').value='';
  document.getElementById('postStock').value='';
  document.getElementById('postStockLbl').textContent=type==='shop'?'Stock':'Slots Available';
  document.getElementById('postCatRow').style.display=(['shop','featured','promo'].includes(type))?'grid':'none';
  document.getElementById('postSaveBtn').textContent=type==='shop'?'Add Item':'Publish Post';
  document.getElementById('postImgPrev').style.display='none';
  document.getElementById('postImgPh').style.display='block';
  openModal('postModal');
}
function setPostType(t,btn){
  document.querySelectorAll('#postTypeTabs .tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('postType').value=t;
  document.getElementById('postStockLbl').textContent=t==='shop'?'Stock':'Slots Available';
  document.getElementById('postCatRow').style.display='grid';
}
function prevPostImg(inp){if(!inp.files[0])return;const r=new FileReader();r.onload=e=>{document.getElementById('postImgEl').src=e.target.result;document.getElementById('postImgPrev').style.display='block';document.getElementById('postImgPh').style.display='none';};r.readAsDataURL(inp.files[0]);}
function clearPostImg(){document.getElementById('postImgPrev').style.display='none';document.getElementById('postImgPh').style.display='block';document.getElementById('postImgInp').value='';}
function savePost(){
  const type=document.getElementById('postType').value;
  const idx=parseInt(document.getElementById('postEditIdx').value);
  const nm=document.getElementById('postName').value.trim();
  if(!nm)return alert('Please enter a name/title.');
  const imgEl=document.getElementById('postImgEl');
  const imgSrc=document.getElementById('postImgPrev').style.display!=='none'?imgEl.src:'';
  if(type==='tech'||type==='staff'){
    const arr=type==='tech'?D.techs:D.staffs;
    if(idx>=0){arr[idx].name=nm;}
    closeModal('postModal');
    if(type==='tech')renderTechs();else renderStaffs();
    return;
  }
  const obj={name:nm,desc:document.getElementById('postDesc').value.trim(),price:document.getElementById('postPrice').value||'0',stock:parseInt(document.getElementById('postStock').value||0),cat:document.getElementById('postCat').value,type:document.getElementById('postCat').value,status:document.getElementById('postStatus').value,imgSrc,date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})};
  const arr=type==='shop'?D.shop:type==='promo'?D.promos:D.featured;
  if(idx>=0)arr[idx]=Object.assign(arr[idx],obj);else arr.push(obj);
  closeModal('postModal');
  if(type==='shop'){renderShopPage();renderShopDash();}
  else if(type==='promo'||type==='featured'){renderPosts();renderFeatGrid();}
}

function openAddNews(){
  document.getElementById('newsModalTitle').textContent='Publish News';
  document.getElementById('newsSaveBtn').textContent='Publish';
  document.getElementById('newsEditIdx').value='-1';
  ['newsTitle','newsBody'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('newsImgPrev').style.display='none';
  document.getElementById('newsImgPh').style.display='block';
  document.getElementById('newsStatus').value='published';
  openModal('newsModal');
}
function openEditNews(i){
  const n=D.news[i];
  document.getElementById('newsModalTitle').textContent='Edit News';
  document.getElementById('newsSaveBtn').textContent='Save Changes';
  document.getElementById('newsEditIdx').value=i;
  document.getElementById('newsTitle').value=n.title;
  document.getElementById('newsBody').value=n.body;
  document.getElementById('newsCat').value=n.category;
  document.getElementById('newsStatus').value=n.status;
  if(n.imgSrc){document.getElementById('newsImgEl').src=n.imgSrc;document.getElementById('newsImgPrev').style.display='block';document.getElementById('newsImgPh').style.display='none';}
  else{document.getElementById('newsImgPrev').style.display='none';document.getElementById('newsImgPh').style.display='block';}
  openModal('newsModal');
}
function prevNewsImg(inp){if(!inp.files[0])return;const r=new FileReader();r.onload=e=>{document.getElementById('newsImgEl').src=e.target.result;document.getElementById('newsImgPrev').style.display='block';document.getElementById('newsImgPh').style.display='none';};r.readAsDataURL(inp.files[0]);}
function saveNews(){
  const nm=document.getElementById('newsTitle').value.trim();
  if(!nm)return alert('Please enter a headline.');
  const idx=parseInt(document.getElementById('newsEditIdx').value);
  const imgEl=document.getElementById('newsImgEl');
  const imgSrc=document.getElementById('newsImgPrev').style.display!=='none'?imgEl.src:'';
  const obj={title:nm,body:document.getElementById('newsBody').value.trim(),category:document.getElementById('newsCat').value,status:document.getElementById('newsStatus').value,imgSrc,date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})};
  if(idx>=0)D.news[idx]=obj;else D.news.push(obj);
  closeModal('newsModal');renderPosts();
}

let shopFilter='All',shopSearch='';
function renderShopPage(){
  const g=document.getElementById('shopGrid');if(!g)return;g.innerHTML='';
  let items=D.shop.filter(s=>(shopFilter==='All'||s.cat===shopFilter)&&(s.name.toLowerCase().includes(shopSearch.toLowerCase())));
  if(!items.length){g.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:40px;color:#333;"><i class="fas fa-box-open" style="font-size:32px;margin-bottom:10px;display:block;"></i>No items found</div>`;return;}
  items.forEach((s)=>{
    const i=D.shop.indexOf(s);
    const d=document.createElement('div');d.className='post-card';
    d.innerHTML=`${s.imgSrc?`<img src="${s.imgSrc}" class="post-img" alt="">`:`<div class="post-img-ph"><i class="fas fa-box" style="font-size:28px;color:#2a2a2a;"></i></div>`}
    <div class="post-body">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;"><span class="b bd" style="font-size:8px;">${s.cat}</span>${badge(s.status)}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;color:#ddd;margin-bottom:3px;">${s.name}</div>
      <div style="font-size:11px;color:#3a3a3a;margin-bottom:6px;line-height:1.4;flex:1;">${s.desc||''}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <div class="gt" style="font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:900;">₱${fmt(s.price)}</div>
        <span style="font-size:10px;color:${s.stock===0?'#f87171':s.stock<10?'#F2DB94':'#10b981'};">${s.stock===0?'Out of stock':s.stock+' in stock'}</span>
      </div>
    </div>
    <div class="post-actions">
      <button onclick="editPost('shop',${i})" class="btn-e" style="flex:1;padding:7px;font-size:11px;"><i class="fas fa-pen" style="margin-right:3px;"></i>Edit</button>
      <button onclick="confirmDel('shop',${i})" class="btn-d" style="flex:1;padding:7px;font-size:11px;"><i class="fas fa-trash" style="margin-right:3px;"></i>Remove</button>
    </div>`;
    g.appendChild(d);
  });
}
function filterShop(v){shopSearch=v;renderShopPage();}
function filterShopCat(cat,btn){shopFilter=cat;document.querySelectorAll('#shopFilterBtns .tab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderShopPage();}

function renderShopDash(){
  const g=document.getElementById('shopGridDash');if(!g)return;g.innerHTML='';
  D.shop.slice(0,4).forEach((s,i)=>{
    const d=document.createElement('div');d.className='post-card';
    d.innerHTML=`${s.imgSrc?`<img src="${s.imgSrc}" style="width:100%;height:80px;object-fit:cover;display:block;" alt="">`:`<div style="width:100%;height:80px;background:linear-gradient(135deg,#1e1e1e,#141414);display:flex;align-items:center;justify-content:center;"><i class="fas fa-box" style="font-size:18px;color:#2a2a2a;"></i></div>`}
    <div style="padding:9px;"><div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;color:#ddd;margin-bottom:1px;">${s.name}</div><div class="gt" style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:900;">₱${fmt(s.price)}</div><div style="font-size:9px;color:#3a3a3a;margin-top:2px;">${s.stock} in stock</div></div>`;
    g.appendChild(d);
  });
}

function renderPosts(){renderFeatList();renderPromoList();renderNewsList();}
function renderFeatList(){
  const g=document.getElementById('featList');if(!g)return;g.innerHTML='';
  D.featured.forEach((s,i)=>renderPostCard(g,s,i,'featured'));
}
function renderPromoList(){
  const g=document.getElementById('promoList');if(!g)return;g.innerHTML='';
  if(!D.promos.length){g.innerHTML=`<div style="color:#333;font-size:12px;padding:10px 0;">No promos yet. <button onclick="openAddPost('promo')" class="btn-g" style="font-size:10px;padding:3px 10px;margin-left:5px;">Add Promo</button></div>`;return;}
  D.promos.forEach((s,i)=>renderPostCard(g,s,i,'promo'));
}
function renderNewsList(){
  const g=document.getElementById('newsList');if(!g)return;g.innerHTML='';
  if(!D.news.length){g.innerHTML=`<div style="color:#333;font-size:12px;padding:10px 0;">No news yet. <button onclick="openAddNews()" style="font-size:10px;padding:3px 10px;background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);color:#60a5fa;border-radius:6px;cursor:pointer;margin-left:5px;">Add News</button></div>`;return;}
  D.news.forEach((n,i)=>{
    const d=document.createElement('div');d.className='news-card';
    d.innerHTML=`${n.imgSrc?`<img src="${n.imgSrc}" class="news-img" alt="">`:`<div class="news-img-ph"><i class="fas fa-newspaper" style="font-size:28px;color:#1a1a3e;"></i></div>`}
    <div style="padding:13px;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:7px;"><span class="b bb" style="font-size:8px;">${n.category}</span>${badge(n.status)}<span style="font-size:9px;color:#2a2a2a;margin-left:auto;">${n.date||''}</span></div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;color:#ddd;margin-bottom:4px;">${n.title}</div>
      <p style="font-size:11px;color:#3a3a3a;line-height:1.5;margin-bottom:10px;">${n.body}</p>
      <div style="display:flex;gap:5px;"><button onclick="openEditNews(${i})" class="btn-e" style="flex:1;padding:7px;font-size:11px;"><i class="fas fa-pen" style="margin-right:3px;"></i>Edit</button><button onclick="confirmDel('news',${i})" class="btn-d" style="flex:1;padding:7px;font-size:11px;"><i class="fas fa-trash" style="margin-right:3px;"></i>Remove</button></div>
    </div>`;
    g.appendChild(d);
  });
}
function renderPostCard(container,s,i,type){
  const d=document.createElement('div');d.className='post-card';
  d.innerHTML=`${s.imgSrc?`<img src="${s.imgSrc}" class="post-img" alt="">`:`<div class="post-img-ph"><i class="fas ${type==='promo'?'fa-tag':'fa-star'}" style="font-size:26px;color:#2a2a2a;"></i></div>`}
  <div class="post-body">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">${badge(s.status)}<span style="font-size:9px;color:#2a2a2a;">${s.stock||0} slots</span></div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;color:#ddd;margin-bottom:3px;">${s.name}</div>
    <div style="font-size:10px;color:#3a3a3a;line-height:1.4;flex:1;">${s.desc||''}</div>
    <div class="gt" style="font-family:'Barlow Condensed',sans-serif;font-size:19px;font-weight:900;margin-top:6px;">₱${fmt(s.price)}</div>
  </div>
  <div class="post-actions">
    <button onclick="editPost('${type}',${i})" class="btn-e" style="flex:1;padding:7px;font-size:11px;"><i class="fas fa-pen" style="margin-right:3px;"></i>Edit</button>
    <button onclick="confirmDel('${type}',${i})" class="btn-d" style="flex:1;padding:7px;font-size:11px;"><i class="fas fa-trash" style="margin-right:3px;"></i>Remove</button>
  </div>`;
  container.appendChild(d);
}
function editPost(type,i){
  const arr=type==='shop'?D.shop:type==='promo'?D.promos:D.featured;
  const s=arr[i];
  openAddPost(type);
  document.getElementById('postEditIdx').value=i;
  document.getElementById('postName').value=s.name;
  document.getElementById('postDesc').value=s.desc||'';
  document.getElementById('postPrice').value=s.price;
  document.getElementById('postStock').value=s.stock||0;
  document.getElementById('postCat').value=s.cat||s.type||'Service';
  document.getElementById('postStatus').value=s.status;
  document.getElementById('postSaveBtn').textContent='Save Changes';
  document.getElementById('postModalTitle').textContent=type==='shop'?'Edit Shop Item':type==='promo'?'Edit Promo':'Edit Featured Service';
  if(s.imgSrc){document.getElementById('postImgEl').src=s.imgSrc;document.getElementById('postImgPrev').style.display='block';document.getElementById('postImgPh').style.display='none';}
}

function renderFeatGrid(){
  const g=document.getElementById('featGrid');if(!g)return;g.innerHTML='';
  D.featured.slice(0,4).forEach((s,i)=>{
    const d=document.createElement('div');d.className='post-card';
    d.innerHTML=`${s.imgSrc?`<img src="${s.imgSrc}" style="width:100%;height:75px;object-fit:cover;display:block;" alt="">`:`<div style="width:100%;height:75px;background:linear-gradient(135deg,#1e1e1e,#141414);display:flex;align-items:center;justify-content:center;"><i class="fas fa-star" style="font-size:18px;color:#2a2a2a;"></i></div>`}
    <div style="padding:9px;"><div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;color:#ddd;margin-bottom:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${s.name}</div><div class="gt" style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:900;">₱${fmt(s.price)}</div></div>`;
    g.appendChild(d);
  });
}

function renderAccounts(){
  const g=document.getElementById('accGrid');if(!g)return;g.innerHTML='';
  const total=D.accounts.length,active=D.accounts.filter(a=>a.status==='active').length;
  const tech=D.accounts.filter(a=>a.role==='technician').length,staff=total-tech;
  document.getElementById('accTotal').textContent=total;
  document.getElementById('accActive').textContent=active;
  document.getElementById('accTech').textContent=tech;
  document.getElementById('accStaff').textContent=staff;
  D.accounts.forEach((a,i)=>{
    const roleColors={technician:'#F2DB94',cashier:'#10b981',advisor:'#60a5fa',staff:'#a78bfa',manager:'#f87171'};
    const rc=roleColors[a.role]||'#888';
    const d=document.createElement('div');d.className='acc-card';
    d.innerHTML=`<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <div class="acc-avatar">${a.icon||'👤'}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;color:#ddd;">${a.fname} ${a.lname}</div>
        <div style="font-size:11px;color:#333;margin-top:1px;">${a.dept}</div>
      </div>
      ${badge(a.status)}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:12px;">
      <div style="padding:8px;border-radius:8px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);">
        <div style="font-size:9px;color:#2a2a2a;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:3px;">Username</div>
        <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:12px;color:#A67F38;">@${a.username}</div>
      </div>
      <div style="padding:8px;border-radius:8px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);">
        <div style="font-size:9px;color:#2a2a2a;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:3px;">Role</div>
        <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:12px;color:${rc};">${a.role.charAt(0).toUpperCase()+a.role.slice(1)}</div>
      </div>
      <div style="padding:8px;border-radius:8px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);">
        <div style="font-size:9px;color:#2a2a2a;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:3px;">Access</div>
        <div style="font-size:11px;color:#555;">${a.access.charAt(0).toUpperCase()+a.access.slice(1)}</div>
      </div>
      <div style="padding:8px;border-radius:8px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);">
        <div style="font-size:9px;color:#2a2a2a;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:3px;">Created</div>
        <div style="font-size:11px;color:#555;">${a.created}</div>
      </div>
    </div>
    <div style="display:flex;gap:5px;">
      <button onclick="openEditAccount(${i})" class="btn-e" style="flex:1;padding:7px;font-size:11px;"><i class="fas fa-pen" style="margin-right:3px;"></i>Edit</button>
      <button onclick="openStatusEdit('acc',${i},'${a.fname+' '+a.lname}')" class="btn-s" style="flex:1;padding:7px;font-size:11px;">Status</button>
      <button onclick="confirmDel('acc',${i})" class="btn-d" style="flex:1;padding:7px;font-size:11px;"><i class="fas fa-trash" style="margin-right:3px;"></i>Remove</button>
    </div>`;
    g.appendChild(d);
  });
}
function openAddAccount(){
  document.getElementById('accModalTitle').textContent='Create Account';
  document.getElementById('accSaveBtn').textContent='Create Account';
  document.getElementById('accEditIdx').value='-1';
  ['accFname','accLname','accUser','accPass','accPass2','accDept'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('accRole').value='staff';
  document.getElementById('accAccess').value='basic';
  document.getElementById('accErrMsg').style.display='none';
  openModal('accModal');
}
function openEditAccount(i){
  const a=D.accounts[i];
  document.getElementById('accModalTitle').textContent='Edit Account';
  document.getElementById('accSaveBtn').textContent='Save Changes';
  document.getElementById('accEditIdx').value=i;
  document.getElementById('accFname').value=a.fname;
  document.getElementById('accLname').value=a.lname;
  document.getElementById('accUser').value=a.username;
  document.getElementById('accPass').value='';
  document.getElementById('accPass2').value='';
  document.getElementById('accRole').value=a.role;
  document.getElementById('accDept').value=a.dept;
  document.getElementById('accAccess').value=a.access;
  document.getElementById('accErrMsg').style.display='none';
  openModal('accModal');
}
function saveAccount(){
  const fn=document.getElementById('accFname').value.trim(),ln=document.getElementById('accLname').value.trim();
  const user=document.getElementById('accUser').value.trim(),pass=document.getElementById('accPass').value,pass2=document.getElementById('accPass2').value;
  const errEl=document.getElementById('accErrMsg');
  errEl.style.display='none';
  if(!fn||!ln)return showAccErr('Please enter first and last name.');
  if(!user)return showAccErr('Username is required.');
  const idx=parseInt(document.getElementById('accEditIdx').value);
  if(idx<0&&!pass)return showAccErr('Password is required for new accounts.');
  if(pass&&pass.length<6)return showAccErr('Password must be at least 6 characters.');
  if(pass&&pass!==pass2)return showAccErr('Passwords do not match.');
  const roleIconMap={technician:'🔧',cashier:'💰',advisor:'📋',manager:'👔',staff:'👤'};
  const role=document.getElementById('accRole').value;
  const obj={fname:fn,lname:ln,username:user,role,dept:document.getElementById('accDept').value.trim()||'General',access:document.getElementById('accAccess').value,status:'active',icon:roleIconMap[role]||'👤',created:new Date().toLocaleDateString('en-US',{year:'numeric',month:'2-digit',day:'2-digit'})};
  if(pass)obj._pass=pass;
  if(idx>=0)D.accounts[idx]=Object.assign(D.accounts[idx],obj);else D.accounts.push(obj);
  closeModal('accModal');renderAccounts();
  showToast(`Account @${user} ${idx>=0?'updated':'created'} successfully!`);
}
function showAccErr(msg){const el=document.getElementById('accErrMsg');el.textContent=msg;el.style.display='block';}
function togglePw(id,btn){const inp=document.getElementById(id);const show=inp.type==='password';inp.type=show?'text':'password';btn.innerHTML=`<i class="fas fa-${show?'eye-slash':'eye'}"></i>`;}
function showToast(msg){
  const t=document.createElement('div');
  t.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#A67F38,#D9B573);color:#080808;padding:10px 20px;border-radius:10px;font-family:Rajdhani,sans-serif;font-weight:700;font-size:13px;z-index:9999;box-shadow:0 8px 30px rgba(0,0,0,.5);animation:fadeUp .3s ease both;';
  t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),3000);
}

function openStatusEdit(type,idx,name){
  document.getElementById('stMName').textContent='Editing: '+name;
  document.getElementById('stType').value=type;
  document.getElementById('stIdx').value=idx;
  const sel=document.getElementById('stSel');sel.innerHTML='';
  const opts={tech:['available','busy','on-leave'],staff:['active','inactive'],acc:['active','inactive','suspended']};
  (opts[type]||['active','inactive']).forEach(o=>{const op=document.createElement('option');op.value=o;op.textContent=o.charAt(0).toUpperCase()+o.slice(1).replace('-',' ');sel.appendChild(op);});
  const curArr={tech:D.techs,staff:D.staffs,acc:D.accounts}[type];
  if(curArr)sel.value=curArr[idx].status;
  openModal('statusModal');
}
function saveStatus(){
  const type=document.getElementById('stType').value,idx=parseInt(document.getElementById('stIdx').value),val=document.getElementById('stSel').value;
  const arr={tech:D.techs,staff:D.staffs,acc:D.accounts}[type];
  if(arr)arr[idx].status=val;
  closeModal('statusModal');
  if(type==='tech')renderTechs();else if(type==='staff')renderStaffs();else renderAccounts();
}

function confirmDel(type,idx){
  pendingDel={type,idx};
  const msgs={tech:'Remove this technician from the team?',staff:'Remove this staff member?',shop:'Remove this shop item?',featured:'Remove this featured service?',promo:'Remove this promo?',news:'Delete this news article?',acc:'Delete this account? The user will lose access.'};
  document.getElementById('delMsg').textContent=msgs[type]||'Are you sure?';
  openModal('delModal');
}
function doDelete(){
  const{type,idx}=pendingDel;
  const arrMap={tech:D.techs,staff:D.staffs,shop:D.shop,featured:D.featured,promo:D.promos,news:D.news,acc:D.accounts};
  if(arrMap[type]){arrMap[type].splice(idx,1);}
  closeModal('delModal');
  const reMap={tech:renderTechs,staff:renderStaffs,shop:()=>{renderShopPage();renderShopDash();},featured:()=>{renderFeatGrid();renderPosts();},promo:renderPosts,news:renderPosts,acc:renderAccounts};
  if(reMap[type])reMap[type]();
}

function showBk(b){
  document.getElementById('bkTitle').textContent=b.id;
  document.getElementById('bkBody').innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">${[['Customer',b.customer],['Service',b.service],['Date',b.date],['Time',b.time],['Status',b.status]].map(([k,v])=>`<div style="padding:10px;border-radius:9px;background:rgba(166,127,56,.04);border:1px solid rgba(166,127,56,.08);"><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#282828;margin-bottom:4px;">${k}</div><div style="font-size:13px;color:#ccc;">${k==='Status'?badge(v):v}</div></div>`).join('')}</div>`;
  openModal('bkModal');
}

function renderRecent(){
  const el=document.getElementById('recentEl');if(!el)return;el.innerHTML='';
  const icons={confirmed:'fa-check',pending:'fa-clock',completed:'fa-check-double',cancelled:'fa-times'};
  const rgb={confirmed:'59,130,246',pending:'166,127,56',completed:'16,185,129',cancelled:'239,68,68'};
  D.bookings.slice(0,5).forEach(b=>{
    const c=rgb[b.status]||'166,127,56';
    const d=document.createElement('div');
    d.style.cssText='display:flex;align-items:center;gap:8px;padding:6px 7px;border-radius:8px;cursor:pointer;border:1px solid rgba(255,255,255,.03);transition:background .15s;';
    d.onmouseover=()=>d.style.background='rgba(166,127,56,.04)';d.onmouseout=()=>d.style.background='transparent';
    d.innerHTML=`<div style="width:26px;height:26px;border-radius:6px;background:rgba(${c},.1);border:1px solid rgba(${c},.18);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas ${icons[b.status]||'fa-circle'}" style="font-size:9px;color:rgb(${c});"></i></div><div style="flex:1;min-width:0;"><div style="font-size:11px;font-weight:600;color:#ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.customer}</div><div style="font-size:9px;color:#2a2a2a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.service}</div></div>${badge(b.status)}`;
    d.onclick=()=>showBk(b);
    el.appendChild(d);
  });
}

let activeYr=2024;
function switchYr(yr,btn){activeYr=yr;document.querySelectorAll('.yr-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderChart();}
function renderChart(){
  const el=document.getElementById('chartEl');if(!el)return;el.innerHTML='';
  const data=D.revenue[activeYr]||D.revenue[2024];const max=Math.max(...data);
  data.forEach((v,i)=>{
    const col=document.createElement('div');col.className='chcol';
    const lbl=document.createElement('div');lbl.style.cssText='font-size:8px;font-family:Rajdhani,sans-serif;font-weight:700;color:#3a3a3a;';lbl.textContent=v+'k';
    const bar=document.createElement('div');bar.className='chbar';bar.title=v+'k — Click to view';
    bar.style.cssText=`width:100%;height:0;transition:height .65s cubic-bezier(.25,.46,.45,.94) ${i*.04}s;`;
    col.appendChild(lbl);col.appendChild(bar);el.appendChild(col);
    setTimeout(()=>{bar.style.height=(v/max*100)+'%';},60);
  });
}

let livePtr=0;
function renderLive(){
  const el=document.getElementById('liveEl');if(!el)return;el.innerHTML='';
  const items=[...D.live.slice(livePtr),...D.live.slice(0,livePtr)].slice(0,5);
  items.forEach((it,i)=>{
    const d=document.createElement('div');
    d.style.cssText=`display:flex;align-items:center;justify-content:space-between;padding:5px 7px;border-radius:7px;background:rgba(255,255,255,.016);border:1px solid rgba(255,255,255,.03);opacity:0;transition:opacity .28s ${i*.06}s;`;
    d.innerHTML=`<div style="display:flex;align-items:center;gap:7px;"><div style="width:6px;height:6px;border-radius:50%;background:${it.color};flex-shrink:0;"></div><span style="font-size:12px;color:#888;">${it.label}</span></div><span style="font-family:Rajdhani,sans-serif;font-weight:700;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:${it.color};">${it.status}</span>`;
    el.appendChild(d);
    requestAnimationFrame(()=>{d.style.opacity='1';});
  });
}
setInterval(()=>{livePtr=(livePtr+1)%D.live.length;renderLive();},3500);

function renderNotifs(){
  const list=document.getElementById('nfList'),b=document.getElementById('nBadge');if(!list)return;
  const unr=D.notifs.filter(n=>!n.read).length;b.textContent=unr;b.style.display=unr?'flex':'none';
  list.innerHTML='';
  D.notifs.forEach(n=>{
    const d=document.createElement('div');d.className='nfi '+(n.read?'rd':'unr');
    d.innerHTML=`<div style="width:37px;height:37px;border-radius:50%;background:${n.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas ${n.icon}" style="color:${n.color};font-size:14px;"></i></div><div style="flex:1;"><div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;"><span style="font-family:Rajdhani,sans-serif;font-weight:800;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:${n.read?'#333':'#A67F38'};">${n.tag}</span>${!n.read?'<span style="width:5px;height:5px;border-radius:50%;background:#F2DB94;display:inline-block;flex-shrink:0;"></span>':''}</div><p style="font-size:12px;color:${n.read?'#333':'#ccc'};line-height:1.5;margin-bottom:3px;">${n.text}</p><span style="font-size:9.5px;color:#222;">${n.time}</span></div>`;
    d.onclick=()=>{n.read=true;renderNotifs();};
    list.appendChild(d);
  });
}

// ── BELL: slide off-screen right when panel opens, slide back when closed ──
function openNotif(){
  document.getElementById('nfPan').classList.add('open');
  document.getElementById('nfOv').classList.add('show');
  // slide bell off the right edge
  document.getElementById('bellBtn').classList.add('hidden');
}
function closeNotif(){
  document.getElementById('nfPan').classList.remove('open');
  document.getElementById('nfOv').classList.remove('show');
  // slide bell back in
  document.getElementById('bellBtn').classList.remove('hidden');
}
function markAllRead(){D.notifs.forEach(n=>n.read=true);renderNotifs();}
function clearNotifs(){D.notifs.length=0;renderNotifs();}

let ddOpen=false;
function toggleDD(){ddOpen=!ddOpen;document.getElementById('profDD').classList.toggle('open',ddOpen);document.getElementById('pChev').style.transform=ddOpen?'rotate(180deg)':'';}
function closeDD(){ddOpen=false;document.getElementById('profDD').classList.remove('open');document.getElementById('pChev').style.transform='';}
document.addEventListener('click',e=>{if(!document.getElementById('profWrap').contains(e.target))closeDD();});

function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}

function toggleSb(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('sbOv').classList.toggle('show');}
function closeSb(){document.getElementById('sidebar').classList.remove('open');document.getElementById('sbOv').classList.remove('show');}

const mBtn=document.getElementById('menuBtn');
function onResize(){
  const mob=window.innerWidth<1024;mBtn.style.display=mob?'flex':'none';document.getElementById('sbClose').style.display=mob?'block':'none';
  if(!mob)closeSb();
  document.getElementById('clkWrap').style.display=window.innerWidth>=768?'block':'none';
}
window.addEventListener('resize',onResize);onResize();

function tick(){const now=new Date();const ct=document.getElementById('clkTime'),cd=document.getElementById('clkDate');if(ct)ct.textContent=now.toLocaleTimeString('en-US',{hour12:false});if(cd)cd.textContent=now.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}
setInterval(tick,1000);tick();

document.querySelector('.ni[data-page="dashboard"]').classList.add('active');
renderFeatGrid();
renderShopDash();
renderRecent();
renderChart();
renderLive();
renderNotifs();

/* ══ REPORTS JS ══ */

/* ===========================================================
   REV AUTO SHOP — REPORTS JS
   Features: rich sample data (Jan+Feb+beyond), working
   Compare modal, animated charts (weekly+monthly)
=========================================================== */
const NOW=new Date(), CUR_YEAR=NOW.getFullYear(), CUR_MONTH=NOW.getMonth();
function rnd(a,b){return Math.floor(a+(b-a)*Math.random());}
const PHP=v=>v==null?'--':'₱'+Number(v).toLocaleString('en-PH');

/* ─── SEEDED DATA GENERATOR ───
   Uses a simple seeded random so Feb always has good distinct data.
   Regular months use Math.random, Feb uses seeded values to ensure
   visible data when user navigates there to compare. */
function seededRnd(seed,a,b){
  const x=Math.sin(seed)*10000;
  return Math.floor(a+(x-Math.floor(x))*(b-a));
}

function generateShopRecords(){
  const recs=[];
  const END=new Date();
  const STATUSES=['Completed','Completed','Completed','Walk-in','Online','Pending','Cancelled'];

  for(let d=new Date(CUR_YEAR,0,1); d<=END; d.setDate(d.getDate()+1)){
    const mo=d.getMonth();
    // February: Valentine's promo — spike in online sales & bookings, fewer cancellations
    const isFeb=(mo===1);
    // January: solid baseline
    const isJan=(mo===0);
    // March onwards: normal with slight seasonal dip
    const revMult = isFeb?1.9 : isJan?1.1 : 0.85+Math.random()*0.5;
    const bkMult  = isFeb?1.7 : isJan?1.0 : 1.0;

    const snaps=rnd(2,5);
    for(let s=0;s<snaps;s++){
      const hr=[8,11,14,17][s%4]+rnd(0,2);
      const ts=new Date(d.getFullYear(),d.getMonth(),d.getDate(),hr,rnd(0,59),rnd(0,59)).getTime();
      recs.push({
        ts,
        bookings:     Math.min(20, Math.round(rnd(2,9)*bkMult)),
        jobOrders:    Math.min(25, Math.round(rnd(3,14)*revMult)),
        walkIns:      rnd(0, isFeb?10:7),
        onlineSales:  Math.round(rnd(isFeb?12:1, isFeb?40:20)*revMult),
        revenue:      Math.round(rnd(3000,40000)*revMult),
        cancellations:rnd(0, isFeb?1:4),
        status:       STATUSES[rnd(0,STATUSES.length)],
        type:'record'
      });
    }
  }
  return recs.sort((a,b)=>b.ts-a.ts);
}

const EV_DEFS=[
  {emoji:'📅',label:'Peak Booking Day'},    {emoji:'🚐',label:'Fleet Service Day'},
  {emoji:'🛒',label:'Valentine Promo Live'},{emoji:'🚶',label:'Walk-in Rush'},
  {emoji:'💰',label:'Top Revenue Day'},     {emoji:'📋',label:'Job Order Backlog'},
  {emoji:'⚠️',label:'Parts Shortage'},      {emoji:'❌',label:'Batch Cancellations'},
  {emoji:'⭐',label:'VIP Customer Visit'},  {emoji:'🎓',label:'Staff Training'},
  {emoji:'👷',label:'New Technician'},      {emoji:'🔍',label:'Monthly Audit'},
  {emoji:'🛠️',label:'Fleet Maintenance'},   {emoji:'💸',label:'Online Flash Sale'},
  {emoji:'🎉',label:'Shop Anniversary'},
];
function generateShopEvents(){
  const evs=[];
  // Scatter events across Jan–current month with some guaranteed in Feb
  EV_DEFS.forEach((def,i)=>{
    // Force first 5 events into February for visibility
    const month=i<5?1:rnd(0,Math.max(1,CUR_MONTH+1));
    const day=rnd(1,27);
    const ts=new Date(CUR_YEAR,month,day,rnd(8,18),rnd(0,59)).getTime();
    const isFeb=month===1;
    evs.push({
      ts,...def,
      bookings:    rnd(isFeb?15:5,isFeb?40:30),
      jobOrders:   rnd(isFeb?20:10,isFeb?60:50),
      walkIns:     rnd(3,20),
      onlineSales: rnd(isFeb?20:5,isFeb?80:60),
      revenue:     rnd(isFeb?30000:10000,isFeb?180000:120000),
      cancellations:rnd(0,8),type:'event'
    });
  });
  return evs.sort((a,b)=>b.ts-a.ts);
}

let allRecords=generateShopRecords();
let allEvents=generateShopEvents();
let weeklyChart=null,monthlyChart=null,weeklyDataGlobal=null,monthlyDataGlobal=null;
let weeklySelectedYear=CUR_YEAR,monthlySelectedYear=CUR_YEAR;
let activeCompare=null; // {weekNum, monthSel, data, metric}
const wcs={showTrendLines:false,annotations:[]};

const fmtDate=ms=>new Date(ms).toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'});
const fmtTime=ms=>new Date(ms).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});

function toast(msg,type='ok'){
  const t=document.createElement('div');
  t.style.cssText='position:fixed;bottom:22px;left:50%;transform:translateX(-50%);padding:9px 20px;border-radius:10px;font-family:Rajdhani,sans-serif;font-weight:700;font-size:.85rem;z-index:99999;pointer-events:none;box-shadow:0 6px 20px rgba(0,0,0,.4);transition:opacity .3s';
  t.style.background=type==='err'?'#ef4444':'linear-gradient(135deg,#A67F38,#D9B573)';
  t.style.color=type==='err'?'#fff':'#080808';
  t.textContent=msg;document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),350);},2500);
}
function sBadge(s){
  const m={'Completed':'completed','Walk-in':'walkin','Online':'online','Pending':'pending','Cancelled':'cancelled'};
  return`<span class="sbadge sb-${m[s]||'pending'}">${s}</span>`;
}

/* ── HISTORY TABLE ── */
const PS=20; let hFilt=[],hPage=1;
function buildHistoryRows(rows){
  hFilt=[...rows].sort((a,b)=>b.ts-a.ts);hPage=1;
  document.getElementById('historyCountLabel').textContent=hFilt.length+' records';
  renderHPage();renderHPag();
}
function renderHPage(){
  const tb=document.getElementById('historyTableBody');
  if(!hFilt.length){tb.innerHTML=`<tr><td colspan="9" class="px-3 py-12 text-center text-white/20 text-sm font-raj">No data found</td></tr>`;return;}
  tb.innerHTML=hFilt.slice((hPage-1)*PS,hPage*PS).map(r=>`<tr class="tr-hover border-b border-white/[.025]">
    <td class="px-3 py-2 text-xs text-white/40 font-raj whitespace-nowrap">${fmtDate(r.ts)}</td>
    <td class="px-3 py-2 text-xs text-white/40 font-raj">${fmtTime(r.ts)}</td>
    <td class="px-3 py-2 text-xs font-raj font-bold text-center text-white/70">${r.bookings}</td>
    <td class="px-3 py-2 text-xs font-raj font-bold text-center text-white/70">${r.jobOrders}</td>
    <td class="px-3 py-2 text-xs font-raj font-bold text-center text-white/70">${r.walkIns}</td>
    <td class="px-3 py-2 text-xs font-raj font-bold text-center text-white/70">${r.onlineSales}</td>
    <td class="px-3 py-2 text-xs font-raj font-bold text-center" style="color:#F2DB94">${PHP(r.revenue)}</td>
    <td class="px-3 py-2 text-xs font-raj text-center text-white/50">${r.cancellations}</td>
    <td class="px-3 py-2 text-center">${sBadge(r.status)}</td>
  </tr>`).join('');
}
function renderHPag(){
  const c=document.getElementById('historyPagination');
  const total=Math.max(1,Math.ceil(hFilt.length/PS));
  if(total<=1){c.innerHTML='';return;}
  const s=(hPage-1)*PS+1,e=Math.min(hFilt.length,hPage*PS);
  let h=`<span class="text-xs text-white/25 font-raj mr-auto">Showing ${s}–${e} of ${hFilt.length}</span><div class="flex gap-1.5 items-center flex-wrap">`;
  h+=`<button class="page-btn" ${hPage===1?'disabled':''} onclick="_gP(${hPage-1})">Prev</button>`;
  let lo=Math.max(1,hPage-3),hi=Math.min(total,hPage+3);
  if(lo>1){h+=`<button class="page-btn" onclick="_gP(1)">1</button>`;if(lo>2)h+=`<span class="text-white/25 text-xs px-1">…</span>`;}
  for(let p=lo;p<=hi;p++)h+=`<button class="page-btn${p===hPage?' curr':''}" onclick="_gP(${p})">${p}</button>`;
  if(hi<total){if(hi<total-1)h+=`<span class="text-white/25 text-xs px-1">…</span>`;h+=`<button class="page-btn" onclick="_gP(${total})">${total}</button>`;}
  h+=`<button class="page-btn" ${hPage===total?'disabled':''} onclick="_gP(${hPage+1})">Next</button></div>`;
  c.innerHTML=h;
}
function _gP(p){hPage=p;renderHPage();renderHPag();document.getElementById('historyTableWrapper').scrollTop=0;}
function applyDateFilter(){
  const dt=new Date(document.getElementById('dateInput').value);
  if(isNaN(dt.getTime())){toast('Invalid date','err');return;}
  const t=document.getElementById('dateFilterType').value;let s,e;
  if(t==='day'){s=new Date(dt).setHours(0,0,0,0);e=new Date(dt).setHours(23,59,59,999);}
  else if(t==='week'){const dy=dt.getDay();const sw=new Date(dt);sw.setDate(dt.getDate()-dy);sw.setHours(0,0,0,0);const ew=new Date(sw);ew.setDate(sw.getDate()+6);ew.setHours(23,59,59,999);s=sw.getTime();e=ew.getTime();}
  else{s=new Date(dt.getFullYear(),dt.getMonth(),1).getTime();e=new Date(dt.getFullYear(),dt.getMonth()+1,0,23,59,59,999).getTime();}
  buildHistoryRows(allRecords.filter(r=>r.ts>=s&&r.ts<=e));toast('Filter applied');
}
function clearDateFilter(){document.getElementById('dateInput').value='';buildHistoryRows(allRecords);toast('Filter cleared');}

/* ── EVENTS MODAL ── */
function buildEventsTable(evs){
  const tb=document.getElementById('eventsTableBody');
  if(!evs?.length){tb.innerHTML=`<tr><td colspan="9" class="px-4 py-8 text-center text-white/30 font-raj text-sm">No events</td></tr>`;return;}
  tb.innerHTML=[...evs].sort((a,b)=>b.ts-a.ts).map(ev=>`<tr class="tr-hover border-b border-white/[.04]">
    <td class="px-3 py-2.5 text-center text-lg">${ev.emoji}</td>
    <td class="px-3 py-2.5 text-xs font-medium text-left" style="color:#F2DB94">${ev.label}</td>
    <td class="px-3 py-2.5 text-xs text-white/40 font-raj text-center whitespace-nowrap">${fmtDate(ev.ts)}</td>
    <td class="px-3 py-2.5 text-xs text-white/65 font-raj font-bold text-center">${ev.bookings}</td>
    <td class="px-3 py-2.5 text-xs text-white/65 font-raj font-bold text-center">${ev.jobOrders}</td>
    <td class="px-3 py-2.5 text-xs text-white/65 font-raj font-bold text-center">${ev.walkIns}</td>
    <td class="px-3 py-2.5 text-xs text-white/65 font-raj font-bold text-center">${ev.onlineSales}</td>
    <td class="px-3 py-2.5 text-xs font-raj font-bold text-center" style="color:#F2DB94">${PHP(ev.revenue)}</td>
    <td class="px-3 py-2.5 text-xs text-white/50 font-raj text-center">${ev.cancellations}</td>
  </tr>`).join('');
}
function toggleEventsModal(){document.getElementById('showEventsCheckbox').checked?openEventsModal():closeEventsModal();}
function openEventsModal(){buildEventsTable(allEvents);document.getElementById('eventsOverlay').style.display='block';document.getElementById('eventsModal').style.display='block';}
function closeEventsModal(){document.getElementById('eventsOverlay').style.display='none';document.getElementById('eventsModal').style.display='none';document.getElementById('showEventsCheckbox').checked=false;}

/* ── AGGREGATES ── */
function buildWeekly(readings){
  const wk=Array.from({length:7},()=>({b:0,j:0,w:0,o:0,r:0,c:0,n:0}));
  readings.forEach(r=>{const i=new Date(r.ts).getDay();wk[i].b+=r.bookings||0;wk[i].j+=r.jobOrders||0;wk[i].w+=r.walkIns||0;wk[i].o+=r.onlineSales||0;wk[i].r+=r.revenue||0;wk[i].c+=r.cancellations||0;wk[i].n++;});
  const labels=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const dd=wk.map(x=>x.n?{bookings:Math.round(x.b/x.n),jobOrders:Math.round(x.j/x.n),walkIns:Math.round(x.w/x.n),onlineSales:Math.round(x.o/x.n),revenue:Math.round(x.r/x.n),cancellations:Math.round(x.c/x.n)}:{bookings:'--',jobOrders:'--',walkIns:'--',onlineSales:'--',revenue:'--',cancellations:'--'});
  return{labels,dayDetail:dd,hasData:readings.length>0};
}
function buildMonthly(readings){
  const mo=Array.from({length:12},()=>({b:0,j:0,w:0,o:0,r:0,c:0,n:0}));
  readings.forEach(r=>{const m=new Date(r.ts).getMonth();mo[m].b+=r.bookings||0;mo[m].j+=r.jobOrders||0;mo[m].w+=r.walkIns||0;mo[m].o+=r.onlineSales||0;mo[m].r+=r.revenue||0;mo[m].c+=r.cancellations||0;mo[m].n++;});
  const labels=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const md=mo.map(m=>m.n?{bookings:Math.round(m.b/m.n),jobOrders:Math.round(m.j/m.n),walkIns:Math.round(m.w/m.n),onlineSales:Math.round(m.o/m.n),revenue:Math.round(m.r/m.n),cancellations:Math.round(m.c/m.n)}:{bookings:'--',jobOrders:'--',walkIns:'--',onlineSales:'--',revenue:'--',cancellations:'--'});
  return{labels,monthlyDetail:md,revBars:mo.map(m=>m.n?Math.round(m.r/m.n):0),jobBars:mo.map(m=>m.n?Math.round(m.j/m.n):0),bookBars:mo.map(m=>m.n?Math.round(m.b/m.n):0),onlineBars:mo.map(m=>m.n?Math.round(m.o/m.n):0),hasData:readings.length>0};
}
function setWBoxes(d){
  const M={bookings:'wBox_bookings',jobOrders:'wBox_jobOrders',walkIns:'wBox_walkIns',onlineSales:'wBox_onlineSales',revenue:'wBox_revenue',cancellations:'wBox_cancellations'};
  Object.entries(M).forEach(([k,id])=>{const el=document.getElementById(id);if(!el)return;const v=d[k];el.textContent=v==='--'?'N/A':(k==='revenue'?PHP(v):v);});
}
function setMBoxes(d){
  const M={bookings:'mBox_bookings',jobOrders:'mBox_jobOrders',walkIns:'mBox_walkIns',onlineSales:'mBox_onlineSales',revenue:'mBox_revenue',cancellations:'mBox_cancellations'};
  Object.entries(M).forEach(([k,id])=>{const el=document.getElementById(id);if(!el)return;const v=d[k];el.textContent=v==='--'?'N/A':(k==='revenue'?PHP(v):v);});
}
function calcTrend(data){
  const pts=data.map((y,x)=>({x,y})).filter(p=>p.y!==null&&!isNaN(p.y));
  if(pts.length<2)return data.map(()=>null);
  const n=pts.length,sx=pts.reduce((s,p)=>s+p.x,0),sy=pts.reduce((s,p)=>s+p.y,0),sxy=pts.reduce((s,p)=>s+p.x*p.y,0),sx2=pts.reduce((s,p)=>s+p.x*p.x,0);
  const slope=(n*sxy-sx*sy)/(n*sx2-sx*sx),int=(sy-slope*sx)/n;
  return data.map((_,x)=>+(slope*x+int).toFixed(1));
}

/* ── YEAR STEPPERS ── */
function stepWeeklyYear(d){weeklySelectedYear+=d;document.getElementById('weeklyYearLabel').textContent=weeklySelectedYear;buildMonthSelForYear(weeklySelectedYear);populateWeeksForMonth();loadWeeklyData();}
function stepMonthlyYear(d){monthlySelectedYear+=d;document.getElementById('monthlyYearLabel').textContent=monthlySelectedYear;loadMonthlyData();}

/* ── WEEKLY CHART (with entry animation) ── */
function renderWeeklyChart(data){
  weeklyDataGlobal=data;
  if(weeklyChart){weeklyChart.destroy();weeklyChart=null;}
  const c=document.getElementById('weeklyChart');
  const nd=document.getElementById('weeklyNoData');
  if(!data?.hasData){nd.style.display='flex';return;}
  nd.style.display='none';
  const labels=data.labels,dd=data.dayDetail;
  const sB=document.getElementById('togBookings')?.checked??true;
  const sJ=document.getElementById('togJobOrders')?.checked??true;
  const sW=document.getElementById('togWalkIns')?.checked??true;
  const sO=document.getElementById('togOnlineSales')?.checked??true;
  const sR=document.getElementById('togRevenue')?.checked??true;
  const sC=document.getElementById('togCancellations')?.checked??true;
  const bkD=dd.map(d=>d.bookings==='--'?null:d.bookings);
  const joD=dd.map(d=>d.jobOrders==='--'?null:d.jobOrders);
  const wiD=dd.map(d=>d.walkIns==='--'?null:d.walkIns);
  const osD=dd.map(d=>d.onlineSales==='--'?null:d.onlineSales);
  const rvD=dd.map(d=>d.revenue==='--'?null:d.revenue);
  const cnD=dd.map(d=>d.cancellations==='--'?null:d.cancellations);

  const datasets=[];
  if(sB)datasets.push({label:'Bookings',data:bkD,borderColor:'#F2DB94',backgroundColor:'rgba(242,219,148,.1)',tension:.4,spanGaps:true,pointRadius:7,pointHoverRadius:9,fill:false,yAxisID:'y'});
  if(sB&&wcs.showTrendLines)datasets.push({label:'Bookings Trend',data:calcTrend(bkD),borderColor:'#F2DB94',borderDash:[5,5],borderWidth:1.5,pointRadius:0,fill:false,tension:0,yAxisID:'y'});
  if(sJ)datasets.push({label:'Job Orders',data:joD,borderColor:'#00d4ff',backgroundColor:'rgba(0,212,255,.08)',tension:.4,spanGaps:true,pointRadius:6,fill:false,yAxisID:'y'});
  if(sJ&&wcs.showTrendLines)datasets.push({label:'Job Orders Trend',data:calcTrend(joD),borderColor:'#00d4ff',borderDash:[5,5],borderWidth:1.5,pointRadius:0,fill:false,tension:0,yAxisID:'y'});
  if(sW)datasets.push({label:'Walk-ins',data:wiD,borderColor:'#8bc34a',backgroundColor:'rgba(139,195,74,.08)',tension:.4,spanGaps:true,pointRadius:6,fill:false,yAxisID:'y'});
  if(sO)datasets.push({label:'Online Sales',data:osD,borderColor:'#ff9800',backgroundColor:'rgba(255,152,0,.08)',tension:.4,spanGaps:true,pointRadius:6,fill:false,yAxisID:'y'});
  if(sR)datasets.push({label:'Revenue (₱)',data:rvD,borderColor:'#e91e63',backgroundColor:'rgba(233,30,99,.07)',tension:.4,spanGaps:true,pointRadius:6,fill:false,yAxisID:'y1'});
  if(sC)datasets.push({label:'Cancels',data:cnD,borderColor:'#9c27b0',backgroundColor:'rgba(156,39,176,.08)',tension:.4,spanGaps:true,pointRadius:6,fill:false,yAxisID:'y'});
  wcs.annotations.forEach(ann=>datasets.push({label:ann.label,data:labels.map((_,i)=>i===ann.dayIndex?9999:null),borderColor:'#ff6b6b',borderDash:[3,3],borderWidth:2,pointRadius:0,fill:false,yAxisID:'y'}));

  // ── Add comparison dataset if active ──
  if(activeCompare?.data){
    const metric=activeCompare.metric;
    const isRevenue=(metric==='revenue');
    const cD=activeCompare.data.dayDetail.map(d=>d[metric]==='--'?null:d[metric]);
    const metricColors={bookings:'#F2DB94',jobOrders:'#00d4ff',walkIns:'#8bc34a',onlineSales:'#ff9800',revenue:'#e91e63',cancellations:'#9c27b0'};
    const col=metricColors[metric]||'#aaa';
    datasets.push({
      label:`${METRIC_LABELS[metric]} ◀ ${activeCompare.label}`,
      data:cD,
      borderColor:col,
      backgroundColor:'transparent',
      borderDash:[7,4],
      borderWidth:2.5,
      tension:.4,
      spanGaps:true,
      pointRadius:5,
      pointStyle:'triangle',
      fill:false,
      yAxisID:isRevenue?'y1':'y'
    });
  }

  /* ANIMATION: lines draw in from left, points pop in */
  weeklyChart=new Chart(c,{type:'line',data:{labels,datasets},options:{
    responsive:true,maintainAspectRatio:false,
    animation:{duration:900,easing:'easeInOutQuart',
      onProgress(anim){/* natural chart.js line animation */}},
    transitions:{active:{animation:{duration:250}}},
    interaction:{mode:'index',intersect:false},
    onClick:(evt,els)=>{if(!els?.length)return;const idx=els[0].index;setWBoxes(weeklyDataGlobal.dayDetail[idx]);selectDay(idx);},
    plugins:{
      legend:{display:true,position:'top',labels:{color:'#F2DB94',padding:12,usePointStyle:true,font:{size:10,family:'Rajdhani',weight:'700'}}},
      tooltip:{backgroundColor:'rgba(8,8,8,.92)',titleColor:'#F2DB94',bodyColor:'#bbb',padding:10,borderColor:'rgba(166,127,56,.22)',borderWidth:1,
        callbacks:{label:ctx=>ctx.dataset.label.includes('Revenue')?` ₱${Number(ctx.parsed.y).toLocaleString('en-PH')}`:` ${ctx.dataset.label}: ${ctx.parsed.y}`}}
    },
    scales:{
      y:{type:'linear',display:sB||sJ||sW||sO||sC,position:'left',beginAtZero:true,title:{display:true,text:'Count',color:'#666'},ticks:{color:'#555'},grid:{color:'rgba(255,255,255,.07)'}},
      y1:{type:'linear',display:sR,position:'right',beginAtZero:true,title:{display:true,text:'Revenue (₱)',color:'#e91e63'},ticks:{color:'#555',callback:v=>'₱'+Number(v).toLocaleString('en-PH')},grid:{drawOnChartArea:false}},
      x:{ticks:{color:'#555'},grid:{color:'rgba(255,255,255,.05)'}}
    }
  }});

  const todayDay=new Date().getDay();
  const first=dd.findIndex(d=>d.bookings!=='--');
  const idx=dd[todayDay]?.bookings!=='--'?todayDay:(first>=0?first:0);
  setWBoxes(dd[idx]||{bookings:'--',jobOrders:'--',walkIns:'--',onlineSales:'--',revenue:'--',cancellations:'--'});
  selectDay(idx);
}
function rebuildWeeklyChart(){renderWeeklyChart(weeklyDataGlobal);}

/* ── MONTHLY CHART (staggered bar entry animation) ── */
function renderMonthlyChart(data){
  monthlyDataGlobal=data;
  if(monthlyChart){monthlyChart.destroy();monthlyChart=null;}
  const c=document.getElementById('monthlyChart');
  const nd=document.getElementById('monthlyNoData');
  if(!data?.hasData){nd.style.display='flex';return;}
  nd.style.display='none';

  const DATASETS=[
    {label:'Avg Revenue (₱)',data:data.revBars,  backgroundColor:'rgba(233,30,99,.55)', borderColor:'#e91e63',yAxisID:'y1'},
    {label:'Job Orders',     data:data.jobBars,  backgroundColor:'rgba(0,212,255,.45)',  borderColor:'#00d4ff',yAxisID:'y'},
    {label:'Bookings',       data:data.bookBars, backgroundColor:'rgba(166,127,56,.5)',  borderColor:'#A67F38',yAxisID:'y'},
    {label:'Online Sales',   data:data.onlineBars,backgroundColor:'rgba(255,152,0,.4)', borderColor:'#ff9800',yAxisID:'y'},
  ].map((ds,i)=>({...ds,borderWidth:1.5,borderRadius:6,borderSkipped:false,
    // stagger: each dataset bar grows in with a delay
    animation:{delay:ctx=>ctx.dataIndex*30+i*90}
  }));

  monthlyChart=new Chart(c,{
    type:'bar',
    data:{labels:data.labels,datasets:DATASETS},
    options:{
      responsive:true,maintainAspectRatio:false,
      animation:{duration:700,easing:'easeOutQuart'},
      transitions:{active:{animation:{duration:180}}},
      onClick:(evt,els)=>{if(els?.length)setMBoxes(monthlyDataGlobal.monthlyDetail[els[0].index]);},
      plugins:{
        legend:{display:true,position:'top',labels:{color:'#F2DB94',padding:12,usePointStyle:true,font:{size:10,family:'Rajdhani',weight:'700'}}},
        tooltip:{backgroundColor:'rgba(8,8,8,.92)',titleColor:'#F2DB94',bodyColor:'#bbb',borderColor:'rgba(166,127,56,.22)',borderWidth:1,
          callbacks:{label:ctx=>ctx.dataset.label.includes('Revenue')?` ₱${Number(ctx.parsed.y).toLocaleString('en-PH')}`:` ${ctx.dataset.label}: ${ctx.parsed.y}`}}
      },
      scales:{
        y:{beginAtZero:true,title:{display:true,text:'Avg Count',color:'#666'},ticks:{color:'#555'},grid:{color:'rgba(255,255,255,.08)'}},
        y1:{beginAtZero:true,position:'right',title:{display:true,text:'Revenue (₱)',color:'#e91e63'},ticks:{color:'#555',callback:v=>'₱'+Number(v).toLocaleString('en-PH')},grid:{drawOnChartArea:false}},
        x:{ticks:{color:'#555'},grid:{color:'rgba(255,255,255,.05)'}}
      }
    }
  });

  const md=data.monthlyDetail;
  setMBoxes(md[CUR_MONTH]?.bookings!=='--'?md[CUR_MONTH]:md.find(d=>d.bookings!=='--')||{bookings:'--',jobOrders:'--',walkIns:'--',onlineSales:'--',revenue:'--',cancellations:'--'});
}

/* ── LOAD DATA ── */
function loadWeeklyData(){
  const ms=document.getElementById('monthlyMonthSelector')?.value;
  const wk=parseInt(document.getElementById('weeklyWeekSelector')?.value||'1');
  if(!ms)return;
  const[y,m]=ms.split('-').map(Number);
  if(y!==CUR_YEAR){
    renderWeeklyChart({hasData:false});
    updateWeeklyDatesRow(getWeekRange(y,m-1,wk).startDate);
    ['bookings','jobOrders','walkIns','onlineSales','revenue','cancellations'].forEach(k=>{const el=document.getElementById('wBox_'+k);if(el)el.textContent='N/A';});
    return;
  }
  const{startTs,endTs,startDate}=getWeekRange(y,m-1,wk);
  renderWeeklyChart(buildWeekly(allRecords.filter(r=>r.ts>=startTs&&r.ts<=endTs)));
  updateWeeklyDatesRow(startDate);
}
function loadMonthlyData(){
  if(monthlySelectedYear!==CUR_YEAR){renderMonthlyChart({hasData:false});['bookings','jobOrders','walkIns','onlineSales','revenue','cancellations'].forEach(k=>{const el=document.getElementById('mBox_'+k);if(el)el.textContent='N/A';});return;}
  renderMonthlyChart(buildMonthly(allRecords));
}

/* ── WEEK/MONTH HELPERS ── */
function getWeekRange(year,mi,wn){
  const fom=new Date(year,mi,1);
  const sow=new Date(fom);sow.setDate(fom.getDate()-fom.getDay());sow.setHours(0,0,0,0);
  const st=new Date(sow);st.setDate(sow.getDate()+(wn-1)*7);st.setHours(0,0,0,0);
  const en=new Date(st);en.setDate(st.getDate()+6);en.setHours(23,59,59,999);
  return{startTs:st.getTime(),endTs:en.getTime(),startDate:st};
}
function weeksInMonth(y,mi){const f=new Date(y,mi,1);return Math.ceil((f.getDay()+new Date(y,mi+1,0).getDate())/7);}
function getWeekLabel(y,mi,wn){
  const{startDate}=getWeekRange(y,mi,wn);
  const end=new Date(startDate);end.setDate(startDate.getDate()+6);
  const fmt=d=>d.toLocaleDateString('en-PH',{month:'short',day:'numeric'});
  return`${fmt(startDate)} – ${fmt(end)}`;
}

function updateWeeklyDatesRow(startDate){
  const row=document.getElementById('weeklyDatesRow');
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today=new Date();today.setHours(0,0,0,0);
  row.innerHTML=days.map((d,i)=>{
    const dt=new Date(startDate);dt.setDate(startDate.getDate()+i);
    const isT=dt.getTime()===today.getTime();
    return`<div class="day-slot${isT?' active-day':''} flex flex-col items-center py-2 rounded-lg text-center" style="background:rgba(255,255,255,.02);border:1px solid rgba(166,127,56,.07)" onclick="selectDay(${i})">
      <div class="text-[9px] font-raj font-black uppercase tracking-widest text-gold-dark">${d}</div>
      <div class="text-xs font-bold text-white/50 mt-0.5">${String(dt.getDate()).padStart(2,'0')}</div>
      ${isT?'<div class="w-1 h-1 rounded-full bg-gold mt-0.5"></div>':''}
    </div>`;
  }).join('');
}
function selectDay(idx){
  document.querySelectorAll('#weeklyDatesRow .day-slot').forEach((el,i)=>el.classList.toggle('active-day',i===idx));
  if(weeklyDataGlobal?.dayDetail?.[idx])setWBoxes(weeklyDataGlobal.dayDetail[idx]);
}

function buildMonthSelForYear(year){
  const sel=document.getElementById('monthlyMonthSelector');sel.innerHTML='';
  for(let m=0;m<12;m++){const o=document.createElement('option');o.value=`${year}-${String(m+1).padStart(2,'0')}`;o.textContent=new Date(year,m,1).toLocaleString(undefined,{month:'long'});sel.appendChild(o);}
  sel.value=year===CUR_YEAR?`${CUR_YEAR}-${String(CUR_MONTH+1).padStart(2,'0')}`:`${year}-01`;
}
function initMonthSelector(){buildMonthSelForYear(weeklySelectedYear);}
function populateWeeksForMonth(){
  const ms=document.getElementById('monthlyMonthSelector')?.value;if(!ms)return;
  const[y,m]=ms.split('-').map(Number);
  const wks=weeksInMonth(y,m-1);
  const sel=document.getElementById('weeklyWeekSelector');
  const cur=parseInt(sel.value)||1;sel.innerHTML='';
  for(let i=1;i<=Math.min(wks,5);i++){const o=document.createElement('option');o.value=String(i);o.textContent=i===5?'Extra days':`Week ${i}`;sel.appendChild(o);}
  sel.value=String(Math.min(cur,wks));
}
function onMonthChange(){populateWeeksForMonth();clearCompare();loadWeeklyData();}
function onWeekChange(){clearCompare();loadWeeklyData();}

function switchSection(){
  const v=document.getElementById('recordType').value;
  ['history','weekly','monthly'].forEach(s=>document.getElementById('sec-'+s).classList.toggle('hidden',s!==v));
  document.getElementById('dateFilterWrap').classList.toggle('hidden',v!=='history');
  if(v==='weekly'){weeklySelectedYear=CUR_YEAR;document.getElementById('weeklyYearLabel').textContent=CUR_YEAR;initMonthSelector();populateWeeksForMonth();clearCompare();loadWeeklyData();}
  if(v==='monthly'){monthlySelectedYear=CUR_YEAR;document.getElementById('monthlyYearLabel').textContent=CUR_YEAR;loadMonthlyData();}
}

/* ── CHART CONTROLS ── */
function toggleTrends(){wcs.showTrendLines=!wcs.showTrendLines;document.getElementById('btnTrend').classList.toggle('active',wcs.showTrendLines);rebuildWeeklyChart();toast(wcs.showTrendLines?'Trend lines on':'Trend lines off');}
function addAnnotation(){
  const di=prompt('Day to annotate (Sun, Mon, Tue, Wed, Thu, Fri, Sat):');if(!di)return;
  const ddays=['sun','mon','tue','wed','thu','fri','sat'];
  const dayIdx=ddays.findIndex(d=>d===di.toLowerCase().substring(0,3));
  if(dayIdx===-1){toast('Invalid day name','err');return;}
  const lbl=prompt('Annotation label:');if(!lbl)return;
  wcs.annotations.push({dayIndex:dayIdx,label:lbl});
  rebuildWeeklyChart();toast('Annotation added');
}

/* ── COMPARE MODAL ── */
const METRIC_LABELS={bookings:'Bookings',jobOrders:'Job Orders',walkIns:'Walk-ins',onlineSales:'Online Sales',revenue:'Revenue (₱)',cancellations:'Cancels'};
let compareSelectedWeek=null;

function setCmpMetric(el,val){
  document.querySelectorAll('.cmp-metric-btn').forEach(b=>b.classList.remove('sel'));
  el.classList.add('sel');
  el.querySelector('input').checked=true;
}

function openCompareModal(){
  if(weeklySelectedYear!==CUR_YEAR){toast('No data for other years to compare','err');return;}
  const ms=document.getElementById('monthlyMonthSelector')?.value;if(!ms)return;
  const[y,m]=ms.split('-').map(Number);
  const curWk=parseInt(document.getElementById('weeklyWeekSelector')?.value||'1');
  const monthName=new Date(y,m-1,1).toLocaleString(undefined,{month:'long'});

  // Update current label
  document.getElementById('cmpCurrentLabel').textContent=`${monthName} — Week ${curWk} (${getWeekLabel(y,m-1,curWk)})`;

  // Build week cards
  const wks=weeksInMonth(y,m-1);
  const grid=document.getElementById('cmpWeekGrid');
  grid.innerHTML='';
  compareSelectedWeek=null;
  for(let i=1;i<=Math.min(wks,5);i++){
    if(i===curWk)continue; // skip current week
    const lbl=getWeekLabel(y,m-1,i);
    const card=document.createElement('div');
    card.className='cmp-card';
    card.innerHTML=`<div class="wk-num">W${i}</div><div class="wk-dates">${lbl}</div>`;
    card.onclick=()=>{
      document.querySelectorAll('.cmp-card').forEach(c=>c.classList.remove('selected'));
      card.classList.add('selected');
      compareSelectedWeek=i;
    };
    grid.appendChild(card);
  }

  // Also offer previous month's same week
  if(m>1){
    const pm=m-2; // 0-indexed prev month
    const prevMonthName=new Date(y,pm,1).toLocaleString(undefined,{month:'short'});
    const wksPrev=weeksInMonth(y,pm);
    for(let i=1;i<=Math.min(wksPrev,4);i++){
      const lbl=getWeekLabel(y,pm,i);
      const card=document.createElement('div');
      card.className='cmp-card';
      card.innerHTML=`<div class="wk-num" style="font-size:1.1rem">${prevMonthName} W${i}</div><div class="wk-dates">${lbl}</div>`;
      card.dataset.month=String(pm+1); // 1-indexed
      card.onclick=()=>{
        document.querySelectorAll('.cmp-card').forEach(c=>c.classList.remove('selected'));
        card.classList.add('selected');
        compareSelectedWeek={week:i,month:pm+1,year:y};
      };
      grid.appendChild(card);
    }
  }

  document.getElementById('compareOverlay').style.display='block';
  document.getElementById('compareModal').style.display='block';
  // pre-highlight first metric button
  const btns=document.querySelectorAll('.cmp-metric-btn');
  btns.forEach(b=>b.classList.remove('sel'));
  if(btns[0])btns[0].classList.add('sel');
}

function closeCompareModal(){
  document.getElementById('compareOverlay').style.display='none';
  document.getElementById('compareModal').style.display='none';
}

function applyCompare(){
  if(!compareSelectedWeek){toast('Please select a week first','err');return;}
  const ms=document.getElementById('monthlyMonthSelector')?.value;if(!ms)return;
  const[y,curM]=ms.split('-').map(Number);
  const metric=document.querySelector('input[name="cmpMetric"]:checked')?.value||'bookings';

  let cmpY=y,cmpM,cmpWk;
  if(typeof compareSelectedWeek==='number'){
    cmpM=curM-1;cmpWk=compareSelectedWeek; // same month, diff week (0-indexed month)
  } else {
    cmpM=compareSelectedWeek.month-1;cmpWk=compareSelectedWeek.week;cmpY=compareSelectedWeek.year;
  }

  const{startTs,endTs}=getWeekRange(cmpY,cmpM,cmpWk);
  const cmpRecords=allRecords.filter(r=>r.ts>=startTs&&r.ts<=endTs);
  const cmpData=buildWeekly(cmpRecords);

  if(!cmpData.hasData){toast('No data for that week','err');closeCompareModal();return;}

  const wkLabel=typeof compareSelectedWeek==='number'
    ?`Wk ${compareSelectedWeek} (${getWeekLabel(y,curM-1,compareSelectedWeek)})`
    :`${new Date(cmpY,cmpM,1).toLocaleString(undefined,{month:'short'})} Wk ${cmpWk}`;

  activeCompare={weekNum:typeof compareSelectedWeek==='number'?compareSelectedWeek:cmpWk,data:cmpData,metric,label:wkLabel};
  document.getElementById('btnCompare').classList.add('active');

  // Show info bar
  const bar=document.getElementById('compareInfoBar');
  bar.classList.remove('hidden');
  document.getElementById('compareInfoText').textContent=`Comparing: ${METRIC_LABELS[metric]} — ${wkLabel} (dashed line)`;

  closeCompareModal();
  rebuildWeeklyChart();
  toast(`Comparing ${METRIC_LABELS[metric]} with ${wkLabel}`);
}

function clearCompare(){
  activeCompare=null;
  document.getElementById('btnCompare').classList.remove('active');
  document.getElementById('compareInfoBar').classList.add('hidden');
  if(weeklyDataGlobal)rebuildWeeklyChart();
}

/* ── LEGEND ── */
function openLegend(ctx){
  document.getElementById('revLegendTitle').textContent=ctx+' Metrics';
  const entries=[
    {c:'#F2DB94',t:'Bookings — Confirmed scheduled appointments'},
    {c:'#00d4ff',t:'Job Orders — Active repair / maintenance orders'},
    {c:'#8bc34a',t:'Walk-ins — Unscheduled customer arrivals'},
    {c:'#ff9800',t:'Online Sales — E-commerce / shop orders'},
    {c:'#e91e63',t:'Revenue (₱) — Total daily revenue (right axis)'},
    {c:'#9c27b0',t:'Cancellations — Cancelled bookings or orders'},
  ];
  document.getElementById('revLegendContent').innerHTML=entries.map(e=>`
    <div class="flex items-center gap-3 px-2 py-2 rounded-lg" style="background:rgba(255,255,255,.02)">
      <div style="width:14px;height:14px;border-radius:4px;background:${e.c};flex-shrink:0"></div>
      <span class="text-sm text-white/75 font-raj">${e.t}</span>
    </div>`).join('');
  document.getElementById('revLegendModal').classList.add('open');
}
function closeLegend(){document.getElementById('revLegendModal').classList.remove('open');}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeLegend();closeEventsModal();closeCompareModal();}});

/* ── EXPORT ── */
function openExportPanel(){const p=document.getElementById('exportPanel');p.classList.remove('closing');void p.offsetWidth;p.classList.add('open');}
function closeExportPanel(){const p=document.getElementById('exportPanel');p.classList.remove('open');p.classList.add('closing');setTimeout(()=>p.classList.remove('closing'),400);}
document.addEventListener('click',e=>{const p=document.getElementById('exportPanel');if(p.classList.contains('open')&&!p.contains(e.target)&&!e.target.closest('[onclick="openExportPanel()"]'))closeExportPanel();});
function setExpProg(pct,msg){document.getElementById('expProgFill').style.width=pct+'%';document.getElementById('expStatus').textContent=msg;}
async function startExport(){
  const type=document.querySelector('input[name="exp_type"]:checked')?.value||'pdf';
  setExpProg(20,'Preparing…');await new Promise(r=>setTimeout(r,100));
  setExpProg(60,'Composing…');await new Promise(r=>setTimeout(r,100));
  if(type==='excel')exportExcel();else exportPDF();
  setExpProg(100,'Done ✓');toast(type.toUpperCase()+' ready');setTimeout(()=>setExpProg(0,'Ready'),1800);
}
function exportExcel(){
  const wb=XLSX.utils.book_new();
  const ws=XLSX.utils.json_to_sheet(allRecords.map(r=>({Date:fmtDate(r.ts),Time:fmtTime(r.ts),Status:r.status,Bookings:r.bookings,'Job Orders':r.jobOrders,'Walk-ins':r.walkIns,'Online Sales':r.onlineSales,'Revenue (PHP)':r.revenue,Cancellations:r.cancellations})));
  XLSX.utils.book_append_sheet(wb,ws,'Daily_Records');
  if(document.getElementById('exp_inc_events').checked){
    const ws2=XLSX.utils.json_to_sheet(allEvents.map(ev=>({Date:fmtDate(ev.ts),Event:ev.label,Bookings:ev.bookings,'Job Orders':ev.jobOrders,'Walk-ins':ev.walkIns,'Online Sales':ev.onlineSales,'Revenue (PHP)':ev.revenue,Cancellations:ev.cancellations})));
    XLSX.utils.book_append_sheet(wb,ws2,'Notable_Events');
  }
  const mD=buildMonthly(allRecords);
  const ws3=XLSX.utils.json_to_sheet(mD.labels.map((l,i)=>{const d=mD.monthlyDetail[i];return{Month:l,Bookings:d.bookings,'Job Orders':d.jobOrders,'Walk-ins':d.walkIns,'Online Sales':d.onlineSales,'Avg Revenue':d.revenue,Cancellations:d.cancellations};}));
  XLSX.utils.book_append_sheet(wb,ws3,'Monthly_Summary');
  const out=XLSX.write(wb,{bookType:'xlsx',type:'array'});
  const fn=document.getElementById('exp_filename').value||'REV_AutoShop';
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([out],{type:'application/octet-stream'}));a.download=`${fn}_${new Date().toISOString().slice(0,10)}.xlsx`;document.body.appendChild(a);a.click();a.remove();
}
function exportPDF(){
  const{jsPDF}=window.jspdf||{};if(!jsPDF){toast('jsPDF not available','err');return;}
  const doc=new jsPDF('p','mm','a4');const mg=14;let y=mg;const gold=[166,127,56];
  doc.setFontSize(18);doc.text('REV Auto Repair — Operations Report',mg,y);y+=8;
  doc.setFontSize(9);doc.setTextColor(80,80,80);doc.text('Generated: '+new Date().toLocaleString(),mg,y);y+=9;
  const mD=buildMonthly(allRecords);
  doc.setFontSize(12);doc.setTextColor(0,0,0);doc.text('Monthly Summary (Current Year)',mg,y);y+=5;
  doc.autoTable({startY:y,head:[['Month','Bookings','Job Orders','Walk-ins','Online Sales','Avg Revenue (PHP)','Cancels']],body:mD.labels.map((l,i)=>{const d=mD.monthlyDetail[i];return[l,d.bookings,d.jobOrders,d.walkIns,d.onlineSales,d.revenue==='--'?'—':PHP(d.revenue),d.cancellations];}),theme:'grid',headStyles:{fillColor:gold},styles:{fontSize:8},margin:{left:mg,right:mg}});
  if(document.getElementById('exp_inc_events').checked&&allEvents.length){
    let y2=doc.lastAutoTable.finalY+10;if(y2>235){doc.addPage();y2=mg;}
    doc.setFontSize(12);doc.setTextColor(0,0,0);doc.text('Notable Shop Events',mg,y2);y2+=5;
    doc.autoTable({startY:y2,head:[['Date','Event','Bookings','Job Orders','Online Sales','Revenue (PHP)']],body:allEvents.map(ev=>[fmtDate(ev.ts),ev.label,ev.bookings,ev.jobOrders,ev.onlineSales,PHP(ev.revenue)]),theme:'striped',headStyles:{fillColor:gold},styles:{fontSize:8},margin:{left:mg,right:mg}});
  }
  doc.save(`${document.getElementById('exp_filename').value||'REV_AutoShop'}_${new Date().toISOString().slice(0,10)}.pdf`);
}

/* ── INIT ── */
buildHistoryRows(allRecords);


    const SVC_EMOJIS = ['🔧','🛞','🛻','🔩','🪛','🚗','🏎️','🔌','🧰','🪝'];
    let svcData = [
      {id:'#SKU005',name:'Oil Change Standard', price:34.99, status:'active',   emoji:'🔧'},
      {id:'#SKU002',name:'Engine Tune-Up',       price:89.99, status:'active',   emoji:'🛞'},
      {id:'#SKU003',name:'Tire Rotation',         price:24.99, status:'active',   emoji:'🛻'},
      {id:'#SKU007',name:'Brake Inspection',      price:49.99, status:'inactive', emoji:'🔩'},
      {id:'#SKU011',name:'A/C Recharge',          price:79.00, status:'active',   emoji:'🪛'},
      {id:'#SKU014',name:'Transmission Flush',    price:119.99,status:'active',   emoji:'🚗'},
      {id:'#SKU019',name:'Wheel Alignment',       price:59.95, status:'inactive', emoji:'🏎️'},
      {id:'#SKU022',name:'Battery Replacement',   price:44.00, status:'active',   emoji:'🔌'},
      {id:'#SKU025',name:'Coolant Flush',          price:39.50, status:'active',   emoji:'🧰'},
      {id:'#SKU030',name:'Fuel System Clean',      price:67.00, status:'inactive', emoji:'🪝'},
    ];
    let svcFil=[...svcData],svcPg=1,svcPp=5,svcSortKey=null,svcSortDir='asc';
    let svcPendId=null,svcPendImgA=null,svcPendImgE=null;
    let svcSelectMode=false,svcSelectedIds=new Set();

    function svcGenerateSKU(){ const nums=svcData.map(s=>{const m=s.id.match(/(\d+)$/);return m?parseInt(m[1]):0;}); const next=(nums.length?Math.max(...nums):0)+1; return '#SKU'+String(next).padStart(3,'0'); }
    function svcHandleImg(p,e){ const file=e.target.files[0]; if(!file) return; if(file.size>5*1024*1024){svcToast('Image must be under 5 MB','error');return;} const r=new FileReader(); r.onload=ev=>{const b64=ev.target.result;if(p==='a')svcPendImgA=b64;else svcPendImgE=b64;svcSetImgPreview(p,b64);}; r.readAsDataURL(file); }
    function svcSetImgPreview(p,src){ const zone=document.getElementById('svc'+p.toUpperCase()+'ImgZone'); if(!zone) return; zone.classList.add('has-preview'); zone.innerHTML=`<img class="svc-img-preview" src="${src}" alt="preview"/><button class="svc-img-clear-btn" onclick="svcClearImg('${p}')" title="Remove"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>`; }
    function svcClearImg(p){ if(p==='a')svcPendImgA=null;else svcPendImgE=null; svcResetImgZone(p); }
    function svcResetImgZone(p){ const zone=document.getElementById('svc'+p.toUpperCase()+'ImgZone'); if(!zone) return; zone.classList.remove('has-preview'); zone.innerHTML=`<input type="file" id="svc${p.toUpperCase()}ImgInput" accept="image/*" onchange="svcHandleImg('${p}',event)"/><span class="svc-img-upload-icon">📷</span><span class="svc-img-upload-label">Click to upload</span><span class="svc-img-upload-sub">PNG, JPG, WEBP – max 5 MB</span>`; }
    function svcShowModal(id){ document.getElementById(id)?.classList.add('open'); }
    function svcHideModal(id){ document.getElementById(id)?.classList.remove('open'); }
    function svcBgClose(e,id){ if(e.target===document.getElementById(id)) svcHideModal(id); }
    function svcShowAddModal(){ const p=document.getElementById('svcASkuPreview'); if(p) p.textContent=svcGenerateSKU(); svcPendImgA=null; svcResetImgZone('a'); ['svcAName','svcAPrice'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';}); document.getElementById('svcAStatus').value='active'; svcShowModal('svcAddOverlay'); }

    function svcRender(){
      const tbody=document.getElementById('svcTbody'); if(!tbody) return;
      const start=(svcPg-1)*svcPp, slice=svcFil.slice(start,start+svcPp);
      tbody.innerHTML=slice.map(s=>{ const isSel=svcSelectMode&&svcSelectedIds.has(s.id); const imgHtml=s.image?`<img src="${s.image}" style="width:100%;height:100%;object-fit:cover;border-radius:7px;" alt="${s.name}"/>`:s.emoji; const chkCell=svcSelectMode?`<td style="width:38px;padding:11px 6px 11px 16px;vertical-align:middle"><input type="checkbox" class="row-check"${isSel?' checked':''} onchange="svcToggleRowSelect('${s.id}',this)" onclick="event.stopPropagation()"/></td>`:'';
        return `<tr class="${isSel?'selected':''}">${chkCell}<td><span class="svc-sku-badge">${s.id}</span></td><td><div class="svc-img-cell">${imgHtml}</div></td><td style="font-weight:500">${s.name}</td><td><span class="svc-price-tag">$${s.price.toFixed(2)}</span></td><td><span class="svc-status-pill ${s.status}"><span class="svc-status-dot"></span>${s.status}</span></td><td><div class="svc-actions"><button class="svc-action-btn view" title="View" onclick="svcView('${s.id}')"><svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg></button><button class="svc-action-btn edit" title="Edit" onclick="svcEdit('${s.id}')"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button><button class="svc-action-btn delete" title="Delete" onclick="svcDelete('${s.id}')"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button></div></td></tr>`; }).join('');
      const end=Math.min(start+svcPp,svcFil.length); const showEl=document.getElementById('svcShowingText'); if(showEl) showEl.textContent=`Showing ${start+1}–${end} of ${svcFil.length} items`;
      const thCheck=document.getElementById('svcThCheck'); if(thCheck) thCheck.style.display=svcSelectMode?'table-cell':'none';
      if(svcSelectMode) svcSyncHeaderCheck();
      svcRenderPag(); svcUpdateStats();
    }
    function svcRenderPag(){ const pagEl=document.getElementById('svcPag'); if(!pagEl) return; const pages=Math.max(1,Math.ceil(svcFil.length/svcPp)); let h=`<button class="svc-page-btn" onclick="svcGoPage(${svcPg-1})" ${svcPg===1?'disabled':''}>‹</button>`; for(let i=1;i<=Math.min(pages,5);i++) h+=`<button class="svc-page-btn ${i===svcPg?'active':''}" onclick="svcGoPage(${i})">${i}</button>`; h+=`<button class="svc-page-btn" onclick="svcGoPage(${svcPg+1})" ${svcPg>=pages?'disabled':''}>›</button>`; pagEl.innerHTML=h; }
    function svcUpdateStats(){ const act=svcData.filter(s=>s.status==='active').length; const avg=svcData.length?Math.round(svcData.reduce((a,s)=>a+s.price,0)/svcData.length):0; const t=document.getElementById('svcStatTotal'); if(t) t.textContent=svcData.length; const a=document.getElementById('svcStatActive'); if(a) a.textContent=act; const av=document.getElementById('svcStatAvg'); if(av) av.textContent=avg; const p=document.getElementById('svcStatPop'); if(p) p.textContent=Math.max(1,Math.floor(svcData.length/5)); }
    function svcGoPage(p){ const mx=Math.ceil(svcFil.length/svcPp); if(p<1||p>mx) return; svcPg=p; svcRender(); }
    function svcFilter(){ const q=(document.getElementById('svcSearchInput')?.value||'').toLowerCase(); svcFil=svcData.filter(s=>s.name.toLowerCase().includes(q)||s.id.toLowerCase().includes(q)||s.status.includes(q)); svcPg=1; svcRender(); }
    function svcChangePerPage(v){ svcPp=parseInt(v); svcPg=1; svcRender(); }
    function svcSortBy(key){ if(svcSortKey===key) svcSortDir=svcSortDir==='asc'?'desc':'asc'; else{svcSortKey=key;svcSortDir='asc';} document.querySelectorAll('.sort-arrow').forEach(e=>e.className='sort-arrow'); const el=document.getElementById('svc-s-'+key); if(el) el.className='sort-arrow '+svcSortDir; svcFil.sort((a,b)=>{let va=a[key],vb=b[key];if(typeof va==='string'){va=va.toLowerCase();vb=vb.toLowerCase();}return svcSortDir==='asc'?(va>vb?1:-1):(va<vb?1:-1);}); svcRender(); }

    function svcConfirmAdd(){ const name=document.getElementById('svcAName')?.value.trim(); const price=parseFloat(document.getElementById('svcAPrice')?.value); const status=document.getElementById('svcAStatus')?.value||'active'; if(!name||isNaN(price)||price<0){svcToast('Please fill all fields correctly','error');return;} const id=svcGenerateSKU(); svcData.unshift({id,name,price,status,emoji:SVC_EMOJIS[Math.floor(Math.random()*SVC_EMOJIS.length)],image:svcPendImgA||null}); svcFil=[...svcData]; svcHideModal('svcAddOverlay'); svcPendImgA=null; svcRender(); svcToast(`"${name}" added as ${id}`,'success'); }

    function svcView(id){ const s=svcData.find(x=>x.id===id); if(!s) return; const hero=document.getElementById('svcVHero'),emojiEl=document.getElementById('svcVEmoji'); if(s.image){hero.className='svc-view-hero has-img';hero.style.background='none';emojiEl.innerHTML=`<img src="${s.image}" alt="${s.name}" class="svc-view-hero-img"/><div class="svc-view-hero-zoom"><svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>VIEW FULL</div>`;hero.onclick=()=>svcOpenLightbox(s.image,s.name);}else{hero.className='svc-view-hero';hero.onclick=null;emojiEl.innerHTML=s.emoji;hero.style.background=s.status==='active'?'linear-gradient(135deg,#10b981,#059669)':'linear-gradient(135deg,#ef4444,#b91c1c)';} document.getElementById('svcVId').textContent=s.id; document.getElementById('svcVName').textContent=s.name; document.getElementById('svcVPrice').textContent='$'+s.price.toFixed(2); document.getElementById('svcVStatus').innerHTML=`<span class="svc-status-pill ${s.status}"><span class="svc-status-dot"></span>${s.status}</span>`; svcShowModal('svcViewOverlay'); }
    function svcViewToEdit(){ const id=document.getElementById('svcVId').textContent; svcHideModal('svcViewOverlay'); setTimeout(()=>svcEdit(id),200); }

    function svcOpenLightbox(src,caption){ document.getElementById('svcLightboxImg').src=src; document.getElementById('svcLightboxCaption').textContent=caption||''; document.getElementById('svcLightbox').classList.add('open'); }
    function svcCloseLightbox(){ document.getElementById('svcLightbox').classList.remove('open'); }

    function svcEdit(id){ const s=svcData.find(x=>x.id===id); if(!s) return; document.getElementById('svcEId').value=s.id; document.getElementById('svcESku').value=s.id; document.getElementById('svcEName').value=s.name; document.getElementById('svcEPrice').value=s.price; document.getElementById('svcEStatus').value=s.status; document.getElementById('svcEEmoji').textContent=s.emoji; svcPendImgE=s.image||null; if(s.image) svcSetImgPreview('e',s.image); else svcResetImgZone('e'); svcShowModal('svcEditOverlay'); }
    function svcSaveEdit(){ const id=document.getElementById('svcEId').value; const name=document.getElementById('svcEName').value.trim(); const price=parseFloat(document.getElementById('svcEPrice').value); const status=document.getElementById('svcEStatus').value; if(!name||isNaN(price)||price<0){svcToast('Please fill all fields correctly','error');return;} const i=svcData.findIndex(x=>x.id===id); if(i===-1) return; svcData[i]={...svcData[i],name,price,status,image:svcPendImgE!==undefined?svcPendImgE:svcData[i].image}; svcFil=svcFil.map(x=>x.id===id?svcData[i]:x); svcHideModal('svcEditOverlay'); svcPendImgE=null; svcRender(); svcToast(`"${name}" updated`,'success'); }

    function svcDelete(id){ const s=svcData.find(x=>x.id===id); if(!s) return; svcPendId=id; document.getElementById('svcDName').textContent=`"${s.name}"`; document.getElementById('svcDEmoji').textContent=s.emoji; document.getElementById('svcDNameCard').textContent=s.name; document.getElementById('svcDIdCard').textContent=s.id; document.getElementById('svcDPriceCard').textContent='$'+s.price.toFixed(2); svcShowModal('svcDelOverlay'); }
    function svcConfirmDelete(){ if(!svcPendId) return; const s=svcData.find(x=>x.id===svcPendId); svcData=svcData.filter(x=>x.id!==svcPendId); svcFil=svcFil.filter(x=>x.id!==svcPendId); const mx=Math.ceil(svcFil.length/svcPp); if(svcPg>mx&&svcPg>1) svcPg=mx; svcPendId=null; svcHideModal('svcDelOverlay'); svcRender(); svcToast(`"${s?s.name:''}" deleted`,'error'); }

    function svcQuickAction(){ svcSelectMode?svcExitSelectMode():svcEnterSelectMode(); }
    function svcEnterSelectMode(){ svcSelectMode=true; svcSelectedIds.clear(); document.getElementById('svcSelectBar')?.classList.add('visible'); document.getElementById('svcQaBtn')?.classList.add('selecting'); svcRender(); svcUpdateSelectBar(); svcToast('Select rows to bulk edit or delete','info'); }
    function svcExitSelectMode(){ svcSelectMode=false; svcSelectedIds.clear(); document.getElementById('svcSelectBar')?.classList.remove('visible'); document.getElementById('svcQaBtn')?.classList.remove('selecting'); svcRender(); }
    function svcToggleRowSelect(id,cb){ if(cb.checked) svcSelectedIds.add(id); else svcSelectedIds.delete(id); const row=cb.closest('tr'); if(row) row.classList.toggle('selected',cb.checked); svcUpdateSelectBar(); svcSyncHeaderCheck(); }
    function svcHeaderCheckToggle(){ const hc=document.getElementById('svcHeaderCheck'); if(!hc) return; svcGetCurrentPageIds().forEach(id=>{if(hc.checked)svcSelectedIds.add(id);else svcSelectedIds.delete(id);}); svcUpdateSelectBar(); svcRender(); }
    function svcToggleSelectAll(){ const allIds=svcFil.map(s=>s.id); const allSel=allIds.length>0&&allIds.every(id=>svcSelectedIds.has(id)); if(allSel)svcSelectedIds.clear();else allIds.forEach(id=>svcSelectedIds.add(id)); svcUpdateSelectBar(); svcRender(); }
    function svcSyncHeaderCheck(){ const hc=document.getElementById('svcHeaderCheck'); if(!hc) return; const pIds=svcGetCurrentPageIds(); const allC=pIds.length>0&&pIds.every(id=>svcSelectedIds.has(id)); const someC=pIds.some(id=>svcSelectedIds.has(id)); hc.checked=allC; hc.indeterminate=!allC&&someC; }
    function svcGetCurrentPageIds(){ const s=(svcPg-1)*svcPp; return svcFil.slice(s,s+svcPp).map(s=>s.id); }
    function svcUpdateSelectBar(){ const count=svcSelectedIds.size,hasAny=count>0; const countEl=document.getElementById('svcSelectCount'); if(countEl) countEl.textContent=count===0?'None selected':`${count} service${count===1?'':'s'} selected`; const eBtn=document.getElementById('svcBulkEditBtn'),dBtn=document.getElementById('svcBulkDelBtn'); if(eBtn)eBtn.disabled=!hasAny; if(dBtn)dBtn.disabled=!hasAny; const labelEl=document.getElementById('svcSelAllLabel'); if(labelEl){const allSel=svcFil.length>0&&svcFil.every(s=>svcSelectedIds.has(s.id));labelEl.textContent=allSel?'Deselect All':'Select All';} }

    function svcOpenBulkEdit(){ if(!svcSelectedIds.size) return; const items=svcData.filter(s=>svcSelectedIds.has(s.id)); document.getElementById('svcBulkEditList').innerHTML=items.map(s=>`<div class="svc-bulk-list-item"><span style="font-size:16px">${s.emoji}</span><span class="svc-sku-badge">${s.id}</span><span style="flex:1;font-weight:500">${s.name}</span><span class="svc-price-tag" style="font-size:12px">$${s.price.toFixed(2)}</span><span class="svc-status-pill ${s.status}" style="font-size:9px"><span class="svc-status-dot"></span>${s.status}</span></div>`).join(''); document.getElementById('svcBulkPrice').value=''; document.getElementById('svcBulkStatus').value=''; svcShowModal('svcBulkEditOverlay'); }
    function svcConfirmBulkEdit(){ const rawP=document.getElementById('svcBulkPrice').value,newSt=document.getElementById('svcBulkStatus').value; const newP=rawP!==''?parseFloat(rawP):null; if(newP!==null&&(isNaN(newP)||newP<0)){svcToast('Enter a valid price or leave blank','error');return;} if(newP===null&&newSt===''){svcToast('Set at least one field to apply','error');return;} let changed=0; svcSelectedIds.forEach(id=>{const i=svcData.findIndex(x=>x.id===id);if(i===-1)return;if(newP!==null)svcData[i].price=newP;if(newSt!=='')svcData[i].status=newSt;svcFil=svcFil.map(x=>x.id===id?svcData[i]:x);changed++;}); svcHideModal('svcBulkEditOverlay'); svcRender(); svcToast(`Updated ${changed} service${changed===1?'':'s'}`,'success'); }
    function svcOpenBulkDelete(){ if(!svcSelectedIds.size) return; const items=svcData.filter(s=>svcSelectedIds.has(s.id)); document.getElementById('svcBulkDelCount').textContent=items.length; document.getElementById('svcBulkDelList').innerHTML=items.map(s=>`<div class="svc-bulk-del-item"><span style="font-size:16px">${s.emoji}</span><span class="svc-sku-badge">${s.id}</span><span style="flex:1;font-weight:500">${s.name}</span><span class="svc-price-tag" style="font-size:12px">$${s.price.toFixed(2)}</span></div>`).join(''); svcShowModal('svcBulkDelOverlay'); }
    function svcConfirmBulkDelete(){ const count=svcSelectedIds.size; svcData=svcData.filter(s=>!svcSelectedIds.has(s.id)); svcFil=svcFil.filter(s=>!svcSelectedIds.has(s.id)); const mx=Math.ceil(svcFil.length/svcPp);if(svcPg>mx&&svcPg>1)svcPg=mx; svcHideModal('svcBulkDelOverlay'); svcExitSelectMode(); svcToast(`Deleted ${count} service${count===1?'':'s'}`,'error'); }

    function svcToggleExport(e){ e.stopPropagation(); const menu=document.getElementById('svcExportMenu'); const isOpen=menu.classList.contains('open'); document.querySelectorAll('.svc-export-menu').forEach(m=>m.classList.remove('open')); if(!isOpen)menu.classList.add('open'); }
    document.addEventListener('click',()=>{document.querySelectorAll('.svc-export-menu').forEach(m=>m.classList.remove('open'));});
    function svcFormatDate(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }

    function svcExportExcel(){ if(typeof XLSX==='undefined'){svcToast('Excel library loading…','error');return;} const data=svcFil;if(!data.length){svcToast('No data to export','error');return;} const rows=[['SKU ID','Service Name','Price ($)','Status']]; data.forEach(s=>rows.push([s.id,s.name,s.price.toFixed(2),s.status])); const ws=XLSX.utils.aoa_to_sheet(rows); ws['!cols']=[{wch:12},{wch:32},{wch:12},{wch:12}]; const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Services'); XLSX.writeFile(wb,'RevMotors_Services_'+svcFormatDate()+'.xlsx'); svcToast('Excel exported – '+data.length+' services','success'); }

    function svcExportPDF(){ if(typeof window.jspdf==='undefined'&&typeof jsPDF==='undefined'){svcToast('PDF library loading…','error');return;} const data=svcFil;if(!data.length){svcToast('No data to export','error');return;} const JsPDF=(window.jspdf&&window.jspdf.jsPDF)?window.jspdf.jsPDF:jsPDF; const doc=new JsPDF({orientation:'landscape',unit:'mm',format:'a4'}); const pageW=doc.internal.pageSize.getWidth(),margin=14;let y=0; doc.setFillColor(8,8,8);doc.rect(0,0,pageW,24,'F'); doc.setFillColor(242,219,148);doc.rect(0,22,pageW,2,'F'); doc.setTextColor(242,219,148);doc.setFontSize(18);doc.setFont('helvetica','bold');doc.text('REV / MOTORS',margin,15); doc.setTextColor(180,180,180);doc.setFontSize(9);doc.setFont('helvetica','normal');doc.text('Services Report',margin,20);doc.text('Exported: '+svcFormatDate(),pageW-margin,15,{align:'right'});doc.text('Total records: '+data.length,pageW-margin,20,{align:'right'}); y=34; const act=data.filter(s=>s.status==='active').length,total=data.reduce((a,s)=>a+s.price,0); const boxes=[{label:'Total Services',value:String(data.length)},{label:'Active',value:String(act)},{label:'Inactive',value:String(data.length-act)},{label:'Avg. Price',value:'$'+(data.length?total/data.length:0).toFixed(2)},{label:'Total Value',value:'$'+total.toFixed(2)}]; const bw=(pageW-margin*2-8*4)/5; boxes.forEach((box,idx)=>{const bx=margin+idx*(bw+8);doc.setFillColor(20,20,20);doc.roundedRect(bx,y,bw,16,2,2,'F');doc.setFillColor(166,127,56);doc.rect(bx,y,bw,1,'F');doc.setTextColor(242,219,148);doc.setFontSize(13);doc.setFont('helvetica','bold');doc.text(box.value,bx+bw/2,y+8,{align:'center'});doc.setTextColor(150,150,150);doc.setFontSize(7);doc.setFont('helvetica','normal');doc.text(box.label.toUpperCase(),bx+bw/2,y+13,{align:'center'});}); y+=24; const cols=[{header:'SKU ID',key:'id',w:28},{header:'SERVICE NAME',key:'name',w:90},{header:'PRICE',key:'price',w:28},{header:'STATUS',key:'status',w:28}]; doc.setFillColor(26,26,26);doc.rect(margin,y,pageW-margin*2,9,'F');doc.setFillColor(166,127,56);doc.rect(margin,y+8.5,pageW-margin*2,0.5,'F');let cx=margin+3; cols.forEach(col=>{doc.setTextColor(166,127,56);doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.text(col.header,cx,y+6);cx+=col.w;});y+=9; data.forEach((s,idx)=>{if(y>doc.internal.pageSize.getHeight()-20){doc.addPage();y=14;} doc.setFillColor(idx%2===0?17:14,idx%2===0?17:14,idx%2===0?17:14);doc.rect(margin,y,pageW-margin*2,8,'F');let rx=margin+3; doc.setTextColor(242,219,148);doc.setFontSize(8);doc.setFont('helvetica','bold');doc.text(s.id,rx,y+5.5);rx+=cols[0].w; doc.setTextColor(240,240,240);doc.setFont('helvetica','normal');doc.text(s.name,rx,y+5.5);rx+=cols[1].w; doc.setTextColor(242,219,148);doc.setFont('helvetica','bold');doc.text('$'+s.price.toFixed(2),rx,y+5.5);rx+=cols[2].w; if(s.status==='active'){doc.setFillColor(16,70,50);doc.setTextColor(52,211,153);}else{doc.setFillColor(70,20,20);doc.setTextColor(248,113,113);} doc.roundedRect(rx,y+1.5,22,5,1,1,'F');doc.setFontSize(7);doc.setFont('helvetica','bold');doc.text(s.status.toUpperCase(),rx+11,y+5.5,{align:'center'}); doc.setDrawColor(30,30,30);doc.setLineWidth(0.2);doc.line(margin,y+8,pageW-margin,y+8);y+=8;}); const pageCount=doc.internal.getNumberOfPages(); for(let p=1;p<=pageCount;p++){doc.setPage(p);const fh=doc.internal.pageSize.getHeight();doc.setFillColor(8,8,8);doc.rect(0,fh-10,pageW,10,'F');doc.setFillColor(166,127,56);doc.rect(0,fh-10,pageW,0.5,'F');doc.setTextColor(100,100,100);doc.setFontSize(7.5);doc.setFont('helvetica','normal');doc.text('Rev Motors – Confidential',margin,fh-4);doc.text('Page '+p+' of '+pageCount,pageW-margin,fh-4,{align:'right'});} doc.save('RevMotors_Services_'+svcFormatDate()+'.pdf'); svcToast('PDF exported – '+data.length+' services','success'); }

    function svcToast(msg,type){ type=type||'info'; const c=document.getElementById('svcToasts'); if(!c) return; const t=document.createElement('div'); t.className='svc-toast '+(type==='success'?'success':type==='error'?'error':''); t.innerHTML=`<span>${type==='success'?'✅':type==='error'?'❌':'ℹ️'}</span> ${msg}`; c.appendChild(t); setTimeout(()=>t.remove(),3100); }

    document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(svcSelectMode)svcExitSelectMode();else svcCloseLightbox();}});
    svcRender();

/*  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
    /*  data and logic for inventory management */
    const FALLBACK_IMG = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80';
    let products = [
      {id:1,name:'Performance Brake Kit',cat:'Brakes',stock:23,sku:'BRK-001',img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80'},
      {id:2,name:'Cold Air Intake',cat:'Engine',stock:41,sku:'ENG-002',img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80'},
      {id:3,name:'Coilover Suspension Kit',cat:'Suspension',stock:8,sku:'SUS-003',img:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&q=80'},
      {id:4,name:'LED Headlight Upgrade',cat:'Electrical',stock:55,sku:'ELE-004',img:'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=200&q=80'},
      {id:5,name:'Cat-Back Exhaust System',cat:'Exhaust',stock:4,sku:'EXH-005',img:'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=200&q=80'},
      {id:6,name:'Short Throw Shifter',cat:'Accessories',stock:30,sku:'ACC-006',img:'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&q=80'},
      {id:7,name:'Sport Air Filter',cat:'Engine',stock:2,sku:'ENG-007',img:'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&q=80'},
    ];

    function stockBadge(stock) {
      if (stock === 0) return '<span class="st-badge st-out">Out of Stock</span>';
      if (stock <= 5)  return '<span class="st-badge st-low">Low Stock</span>';
      return '<span class="st-badge st-in">In Stock</span>';
    }

    function rowClass(stock) {
      if (stock === 0) return 'row-out';
      if (stock <= 5)  return 'row-low';
      return '';
    }

    function adjustStock(id, delta) {
      const p = products.find(x => x.id === id);
      if (!p) return;
      const before = p.stock;
      p.stock = Math.max(0, p.stock + delta);
      if (p.stock !== before) {
        toast(delta > 0 ? 'ok' : 'err', `${p.name}: ${before} → ${p.stock} units`);
      }
      render();
    }

    function render() {
      document.getElementById('inv-tbody').innerHTML = products.map(p => `
        <tr class="${rowClass(p.stock)}">
          <td><img class="td-img" src="${p.img}" alt="" onerror="this.src='${FALLBACK_IMG}'"></td>
          <td><strong style="font-family:var(--font-display)">${p.name}</strong><br><span style="font-size:11px;color:var(--muted)">${p.cat}</span></td>
          <td style="font-family:var(--font-mono);font-size:.72rem;color:var(--muted)">${p.sku}</td>
          <td><strong style="font-size:15px;font-family:var(--font-display)">${p.stock}</strong></td>
          <td>${stockBadge(p.stock)}</td>
          <td>
            <div class="inv-grp">
              <button class="inv-b"            onclick="adjustStock(${p.id}, -1)" title="−1">−</button>
              <button class="inv-b inv-b-plus" onclick="adjustStock(${p.id},  1)" title="+1">+</button>
              <button class="inv-b-ten"        onclick="adjustStock(${p.id}, 10)" title="+10">+10</button>
              <button class="inv-b-zero"       onclick="adjustStock(${p.id}, -p.stock)" title="Zero out" onclick="adjustStock(${p.id}, -${p.stock})">⬇ 0</button>
            </div>
          </td>
        </tr>`).join('');

      document.getElementById('sum-total').textContent = products.length;
      document.getElementById('sum-low').textContent   = products.filter(p => p.stock <= 5).length;
      document.getElementById('sum-units').textContent = products.reduce((a, p) => a + p.stock, 0);
    }

    let _toastTimer;
    function toast(type, message) {
      const el = document.getElementById('toast');
      document.getElementById('t-ico').textContent = type === 'err' ? '✕' : type === 'ok' ? '✔' : '→';
      document.getElementById('t-msg').textContent = message;
      el.className = `toast ${type} show`;
      clearTimeout(_toastTimer);
      _toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
    }

    // Fix the zero-out button (dynamic value)
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-zero]');
      if (btn) { const id = parseInt(btn.dataset.zero); const p = products.find(x => x.id === id); if (p) adjustStock(id, -p.stock); }
    });

    render();

    // DASHBOARD

    // PROFILE CARD
    const PROFILE_USER = {
      name:     'John Jasper',
      email:    'john.doe@revmotors.com',
      email2:   'john.doe.personal@gmail.com',
      role:     'Admin',
      phone:    '09312345678',
      birthday: 'April 20, 1999',
      address:  'Makati City, Metro Manila',
      gender:   'Male',
      photo:    '../../Assets (1)/image.png',
    };

    let pcEditMode = false;

    function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
    function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }
    function getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
    function fmtTime(d) { return d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:true }); }

    function openProfileCard() {
      const overlay = document.getElementById('profileCardOverlay');
      const card = document.getElementById('pcFlipCard');
      if (overlay) overlay.classList.add('open');
      if (card) { setTimeout(() => card.classList.add('visible'), 50); }
      populateProfileCard();
    }

    function closeProfileCard() {
      const overlay = document.getElementById('profileCardOverlay');
      const card = document.getElementById('pcFlipCard');
      if (card) card.classList.remove('visible');
      setTimeout(() => {
        if (overlay) overlay.classList.remove('open');
        resetFlip();
      }, 300);
    }

    function resetFlip() {
      const card = document.getElementById('pcFlipCard');
      if (card) card.classList.remove('flipped');
      pcEditMode = false;
    }

    function pcFlipToBack() {
      const card = document.getElementById('pcFlipCard');
      if (card) card.classList.add('flipped');
    }

    function pcFlipToFront() {
      const card = document.getElementById('pcFlipCard');
      if (card) card.classList.remove('flipped');
      cancelEdit();
    }

    function populateProfileCard() {
      setText('pcFrontName', PROFILE_USER.name);
      setText('pcFrontRole', PROFILE_USER.role);
      setText('pcPhone', PROFILE_USER.phone);
      setText('pcEmail', PROFILE_USER.email);
      setText('pcTimeIn', fmtTime(new Date()));
      setText('pcMetaTimeIn', new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:true }));
      setText('pcMetaStatus', 'Online');
      setText('pcMetaShift', 'Today');
      setText('pcBackName', PROFILE_USER.name);
      setText('pcBackRole', PROFILE_USER.role);
      setVal('pcFieldEmail', PROFILE_USER.email);
      setVal('pcFieldEmail2', PROFILE_USER.email2);
      setVal('pcFieldPhone', PROFILE_USER.phone);
      setVal('pcFieldBday', PROFILE_USER.birthday);
      setVal('pcFieldAddr', PROFILE_USER.address);
      setVal('pcFieldGender', PROFILE_USER.gender);
      document.getElementById('pcFrontImg').src = PROFILE_USER.photo;
      document.getElementById('pcBackImg').src = PROFILE_USER.photo;
    }

    function toggleEdit() {
      pcEditMode = !pcEditMode;
      const fields = document.querySelectorAll('.pc-input');
      const btnTxt = document.getElementById('editBtnTxt');
      const actionBtns = document.getElementById('pcActionBtns');
      fields.forEach(f => f.disabled = !pcEditMode);
      if (btnTxt) btnTxt.textContent = pcEditMode ? 'Cancel' : 'Edit';
      if (actionBtns) actionBtns.classList.toggle('hidden', !pcEditMode);
    }

    function saveProfileChanges() {
      PROFILE_USER.email = getVal('pcFieldEmail');
      PROFILE_USER.email2 = getVal('pcFieldEmail2');
      PROFILE_USER.phone = getVal('pcFieldPhone');
      PROFILE_USER.birthday = getVal('pcFieldBday');
      PROFILE_USER.address = getVal('pcFieldAddr');
      PROFILE_USER.gender = getVal('pcFieldGender');
      pcEditMode = false;
      const fields = document.querySelectorAll('.pc-input');
      fields.forEach(f => f.disabled = true);
      const actionBtns = document.getElementById('pcActionBtns');
      if (actionBtns) actionBtns.classList.add('hidden');
      const btnTxt = document.getElementById('editBtnTxt');
      if (btnTxt) btnTxt.textContent = 'Edit';
      toast('ok', 'Profile updated successfully!');
    }

    function cancelEdit() {
      if (!pcEditMode) return;
      pcEditMode = false;
      const fields = document.querySelectorAll('.pc-input');
      fields.forEach(f => f.disabled = true);
      const actionBtns = document.getElementById('pcActionBtns');
      if (actionBtns) actionBtns.classList.add('hidden');
      const btnTxt = document.getElementById('editBtnTxt');
      if (btnTxt) btnTxt.textContent = 'Edit';
      populateProfileCard();
    }

    // Expose profile card functions globally
    window.openProfileCard = openProfileCard;
    window.closeProfileCard = closeProfileCard;
    window.pcFlipToBack = pcFlipToBack;
    window.pcFlipToFront = pcFlipToFront;
    window.toggleEdit = toggleEdit;
    window.saveProfileChanges = saveProfileChanges;
    window.cancelEdit = cancelEdit;

    function pcFlipToBack() {
      const card = document.getElementById('pcFlipCard');
      if (card) card.classList.add('flipped');
    }

    function pcFlipToFront() {
      const card = document.getElementById('pcFlipCard');
      if (card) card.classList.remove('flipped');
      cancelEdit();
    }

    function populateProfileCard() {
      setText('pcFrontName', PROFILE_USER.name);
      setText('pcFrontRole', PROFILE_USER.role);
      setText('pcPhone', PROFILE_USER.phone);
      setText('pcEmail', PROFILE_USER.email);
      setText('pcTimeIn', fmtTime(new Date()));
      setText('pcMetaTimeIn', new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:true }));
      setText('pcMetaStatus', 'Online');
      setText('pcMetaShift', 'Today');
      setText('pcBackName', PROFILE_USER.name);
      setText('pcBackRole', PROFILE_USER.role);
      setVal('pcFieldEmail', PROFILE_USER.email);
      setVal('pcFieldEmail2', PROFILE_USER.email2);
      setVal('pcFieldPhone', PROFILE_USER.phone);
      setVal('pcFieldBday', PROFILE_USER.birthday);
      setVal('pcFieldAddr', PROFILE_USER.address);
      setVal('pcFieldGender', PROFILE_USER.gender);
      document.getElementById('pcFrontImg').src = PROFILE_USER.photo;
      document.getElementById('pcBackImg').src = PROFILE_USER.photo;
    }

    function toggleEdit() {
      const btn = document.getElementById('editBtn');
      const txt = document.getElementById('editBtnTxt');
      const inputs = document.querySelectorAll('.pc-input');
      const actions = document.getElementById('pcActionBtns');
      
      if (btn.classList.contains('editing')) {
        // Cancel edit
        btn.classList.remove('editing');
        txt.textContent = 'Edit';
        inputs.forEach(input => input.disabled = true);
        actions.classList.add('hidden');
      } else {
        // Start edit
        btn.classList.add('editing');
        txt.textContent = 'Cancel';
        inputs.forEach(input => input.disabled = false);
        actions.classList.remove('hidden');
      }
    }

    function saveProfileChanges() {
      // Implement save logic here
      toast('ok', 'Profile updated successfully!');
      toggleEdit();
    }

    function cancelEdit() {
      // Reset values if needed
      toggleEdit();
    }

    // Expose profile card functions globally
    window.openProfileCard = openProfileCard;
    window.closeProfileCard = closeProfileCard;
    window.handlePCOverlayClick = handlePCOverlayClick;
    window.pcFlipToBack = pcFlipToBack;
    window.pcFlipToFront = pcFlipToFront;
    window.toggleEdit = toggleEdit;
    window.saveProfileChanges = saveProfileChanges;
    window.cancelEdit = cancelEdit;
  };

    
 