// ═══════════════════════════════════════════════════
// USER DATABASE
// ═══════════════════════════════════════════════════
var USERS = [
  {
    email:'boss@xborder.com', pass:'123456',
    name:'张总', role:'boss', roleLabel:'老板',
    shops:['shopee_my','shopee_id','lazada_my','lazada_id','tiktok_my','tiktok_id'],
    canUpload:true, canAdmin:true,
    pages:['overview','finance','pl','ads','inventory','orders','history','admin']
  },
  {
    email:'finance@xborder.com', pass:'123456',
    name:'李财务', role:'finance', roleLabel:'财务主管',
    shops:['shopee_my','shopee_id','lazada_my','lazada_id','tiktok_my','tiktok_id'],
    canUpload:false, canAdmin:false,
    pages:['finance','pl','history']
  },
  {
    email:'data@xborder.com', pass:'123456',
    name:'王专员', role:'data', roleLabel:'数据专员',
    shops:['shopee_my','shopee_id','lazada_my','lazada_id','tiktok_my','tiktok_id'],
    canUpload:true, canAdmin:false,
    pages:['upload_only']
  },
  {
    email:'ops_shopee_my@xborder.com', pass:'123456',
    name:'陈运营', role:'ops', roleLabel:'运营',
    shops:['shopee_my'],
    canUpload:false, canAdmin:false,
    pages:['overview','inventory','orders','ads']
  },
  {
    email:'ops_lazada_id@xborder.com', pass:'123456',
    name:'林运营', role:'ops', roleLabel:'运营',
    shops:['lazada_id'],
    canUpload:false, canAdmin:false,
    pages:['overview','inventory','orders','ads']
  },
  {
    email:'ops_tiktok@xborder.com', pass:'123456',
    name:'吴运营', role:'ops', roleLabel:'运营',
    shops:['tiktok_my','tiktok_id'],
    canUpload:false, canAdmin:false,
    pages:['overview','inventory','orders','ads']
  }
];

var PLAT = {
  shopee_my:{name:'Shopee',flag:'🇲🇾',color:'#ee4d2d',currency:'MYR',rate:1,short:'SP-MY'},
  shopee_id:{name:'Shopee',flag:'🇮🇩',color:'#ee4d2d',currency:'IDR',rate:0.00029,short:'SP-ID'},
  lazada_my:{name:'Lazada',flag:'🇲🇾',color:'#0066cc',currency:'MYR',rate:1,short:'LZ-MY'},
  lazada_id:{name:'Lazada',flag:'🇮🇩',color:'#0066cc',currency:'IDR',rate:0.00029,short:'LZ-ID'},
  tiktok_my:{name:'TikTok',flag:'🇲🇾',color:'#ff2d55',currency:'MYR',rate:1,short:'TK-MY'},
  tiktok_id:{name:'TikTok',flag:'🇮🇩',color:'#ff2d55',currency:'IDR',rate:0.00029,short:'TK-ID'}
};

var PAGE_LABELS = {
  overview:'经营总览', finance:'财务核算', pl:'利润表', ads:'广告分析',
  inventory:'库存监控', orders:'订单明细', history:'历史对比', admin:'用户管理', upload_only:'上传报表'
};
var PAGE_ICONS = {
  overview:'◎', finance:'₿', pl:'📊', ads:'📣',
  inventory:'▦', orders:'≡', history:'📅', admin:'⚙', upload_only:'⬆'
};

// ═══════════════════════════════════════════════════
// DEMO DATA — multi-month, multi-shop
// ═══════════════════════════════════════════════════
var MONTHS = ['2025-01','2025-02','2025-03','2025-04','2025-05','2025-06'];

function genOrders(plat, month, seed){
  var r=seed||1, items=[
    {sku:'SKU-BT01',product:'无线蓝牙耳机 Pro'},
    {sku:'SKU-PB02',product:'便携充电宝 20000mAh'},
    {sku:'SKU-SC03',product:'手机支架 折叠款'},
    {sku:'SKU-WB04',product:'智能手环 X3'},
    {sku:'SKU-TC05',product:'Type-C 数据线'},
    {sku:'SKU-HS06',product:'游戏耳机 7.1声道'}
  ];
  var rate=PLAT[plat].rate;
  var monthIdx=MONTHS.indexOf(month);
  var growth=1+monthIdx*0.06;
  var orders=[];
  items.forEach(function(item,i){
    var base=[2250,1920,1170,2240,1440,2700][i]*growth*(0.8+r*0.4);
    var rev=Math.round(base/rate)*rate;
    var fee=rev*0.09; var ship=rev*0.04; var ad=rev*0.07; var ref=i===3?rev*0.07:0;
    orders.push({
      id:PLAT[plat].short+'-'+month+'-'+(i+1).toString().padStart(3,'0'),
      sku:item.sku, product:item.product,
      qty:Math.round([45,32,78,28,120,18][i]*growth),
      revenue:rev*rate, fee:fee*rate, ship:ship*rate, ad:ad*rate, refund:ref*rate,
      net:(rev-fee-ship-ad-ref)*rate, plat:plat, month:month
    });
  });
  return orders;
}

// Build full dataset
var ALL_DATA = { orders:[], inventory:[], ads:[] };

var seeds={shopee_my:1.0,shopee_id:0.85,lazada_my:0.9,lazada_id:0.75,tiktok_my:1.1,tiktok_id:0.8};
Object.keys(PLAT).forEach(function(plat){
  MONTHS.forEach(function(month){
    genOrders(plat,month,seeds[plat]).forEach(function(o){ ALL_DATA.orders.push(o); });
  });
});

ALL_DATA.inventory=[
  {sku:'SKU-BT01',product:'无线蓝牙耳机 Pro',   stock:142,sold:825,plat:'shopee_my'},
  {sku:'SKU-PB02',product:'便携充电宝 20000mAh',stock:8,  sold:432,plat:'shopee_my'},
  {sku:'SKU-SC03',product:'手机支架 折叠款',     stock:0,  sold:593,plat:'tiktok_my'},
  {sku:'SKU-WB04',product:'智能手环 X3',         stock:35, sold:280,plat:'lazada_my'},
  {sku:'SKU-TC05',product:'Type-C 数据线',       stock:320,sold:120,plat:'lazada_my'},
  {sku:'SKU-HS06',product:'游戏耳机 7.1声道',    stock:12, sold:98, plat:'tiktok_my'},
  {sku:'SKU-KB07',product:'机械键盘 青轴',       stock:0,  sold:45, plat:'shopee_my'},
  {sku:'SKU-MS08',product:'无线鼠标 静音款',     stock:56, sold:210,plat:'lazada_my'}
];

ALL_DATA.ads=[
  {campaign:'耳机-广泛匹配',sku:'SKU-BT01',spend:1200,clicks:3200,imp:48000,roas:3.8,plat:'shopee_my'},
  {campaign:'充电宝-精准词',sku:'SKU-PB02',spend:680, clicks:1800,imp:32000,roas:2.9,plat:'shopee_my'},
  {campaign:'支架-引流',    sku:'SKU-SC03',spend:420, clicks:5600,imp:89000,roas:1.8,plat:'tiktok_my'},
  {campaign:'耳机-竞品词',  sku:'SKU-BT01',spend:950, clicks:2100,imp:38000,roas:4.2,plat:'lazada_my'},
  {campaign:'手环-场景词',  sku:'SKU-WB04',spend:780, clicks:1400,imp:25000,roas:2.1,plat:'tiktok_my'},
  {campaign:'游戏耳机-品牌',sku:'SKU-HS06',spend:560, clicks:980, imp:15000,roas:1.4,plat:'tiktok_my'},
  {campaign:'数据线-印尼',  sku:'SKU-TC05',spend:340, clicks:4200,imp:65000,roas:2.3,plat:'shopee_id'},
  {campaign:'耳机-印尼',    sku:'SKU-BT01',spend:890, clicks:2800,imp:42000,roas:3.5,plat:'tiktok_id'}
];

var COGS={'SKU-BT01':18.5,'SKU-PB02':12,'SKU-SC03':3.8,'SKU-WB04':22,'SKU-TC05':1.5,'SKU-HS06':35};

// ═══════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════
var currentUser=null, currentPage='overview', currentMonth='2025-06', currentShop='all';
var selectedType='order', selectedPlat='shopee_my', pendingFiles=[];
var uploadedThisSession=[];

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════
function escapeHTML(value){
  return String(value).replace(/[&<>"']/g,function(character){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
  });
}

function myr(v,compact){
  var val=v||0;
  if(compact&&Math.abs(val)>=1000) return 'RM '+(Math.abs(val)/1000).toFixed(1)+'k';
  return 'RM '+val.toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2});
}
function pct(v){ return (v||0).toFixed(1)+'%'; }
function num(v){ return (v||0).toLocaleString(); }
function trendIcon(curr,prev){ return curr>=prev?'<span style="color:#10b981">▲</span>':'<span style="color:#ef4444">▼</span>'; }
function trendPct(curr,prev){ var d=prev>0?(curr-prev)/prev*100:0; return (d>=0?'+':'')+d.toFixed(1)+'%'; }

function tag(text,color){ return '<span class="tag" style="background:'+color+'22;color:'+color+';border:1px solid '+color+'44">'+text+'</span>'; }
function pill(text,color){ return '<span class="pill" style="background:'+color+'22;color:'+color+'">'+text+'</span>'; }
function bar(val,max,color){
  var w=Math.min(100,max>0?val/max*100:0);
  return '<div class="bar-track"><div class="bar-fill" style="width:'+w+'%;background:'+color+'"></div></div>';
}
function kpi(label,value,sub,accent,icon,trend){
  return '<div class="kpi" style="border-top:2px solid '+accent+'">'+
    '<div class="kpi-label">'+label+(icon?'<span>'+icon+'</span>':'')+'</div>'+
    '<div class="kpi-value">'+value+'</div>'+
    (sub?'<div class="kpi-sub">'+sub+(trend?'&nbsp;'+trend:'')+'</div>':'')+
    '</div>';
}

// Get filtered orders
function getOrders(month, shops){
  return ALL_DATA.orders.filter(function(o){
    var mOk = month==='all' || o.month===month;
    var sOk = !shops || shops.indexOf(o.plat)>-1;
    return mOk && sOk;
  });
}

function getPrevMonth(m){
  if(m==='all') return null;
  var idx=MONTHS.indexOf(m);
  return idx>0?MONTHS[idx-1]:null;
}

function agg(orders){
  var r={rev:0,net:0,fees:0,refund:0,ad:0,orders:orders.length};
  orders.forEach(function(o){ r.rev+=o.revenue; r.net+=o.net; r.fees+=o.fee+o.ship; r.refund+=o.refund; r.ad+=o.ad; });
  var skuMap={}, platMap={};
  orders.forEach(function(o){
    if(!skuMap[o.sku]) skuMap[o.sku]={sku:o.sku,product:o.product,qty:0,rev:0,net:0};
    skuMap[o.sku].qty+=o.qty; skuMap[o.sku].rev+=o.revenue; skuMap[o.sku].net+=o.net;
    if(!platMap[o.plat]) platMap[o.plat]={rev:0,net:0,fees:0,orders:0,refund:0,ad:0};
    platMap[o.plat].rev+=o.revenue; platMap[o.plat].net+=o.net;
    platMap[o.plat].fees+=o.fee+o.ship; platMap[o.plat].orders++;
    platMap[o.plat].refund+=o.refund; platMap[o.plat].ad+=o.ad;
  });
  r.skuList=Object.values(skuMap).sort(function(a,b){return b.rev-a.rev;});
  r.platMap=platMap;
  r.totalCogs=r.skuList.reduce(function(s,sk){return s+(COGS[sk.sku]||0)*sk.qty;},0);
  r.grossProfit=r.net-r.totalCogs;
  r.gm=r.net>0?r.grossProfit/r.net*100:0;
  return r;
}

// ═══════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════
function fillUser(u,p){ document.getElementById('loginUser').value=u; document.getElementById('loginPass').value=p; }

function doLogin(){
  var u=document.getElementById('loginUser').value.trim();
  var p=document.getElementById('loginPass').value.trim();
  var user=USERS.find(function(x){return x.email===u&&x.pass===p;});
  if(!user){ document.getElementById('loginErr').style.display='block'; return; }
  currentUser=user;
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('mainApp').style.display='flex';
  initApp();
}

function doLogout(){
  currentUser=null; currentPage='overview';
  document.getElementById('mainApp').style.display='none';
  document.getElementById('loginScreen').style.display='block';
}

// ═══════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════
function initApp(){
  var u=currentUser;
  document.getElementById('sideUserName').textContent=u.name;
  document.getElementById('sideUserRole').textContent=u.roleLabel;
  document.getElementById('sideUserShops').textContent='负责 '+u.shops.length+' 个店铺';
  document.getElementById('topbarUser').textContent=u.name;
  if(u.canUpload) document.getElementById('uploadBtn').style.display='flex';

  // Shop filter
  var sf=document.getElementById('shopFilter');
  sf.innerHTML='<option value="all">全部店铺</option>';
  u.shops.forEach(function(s){
    var p=PLAT[s];
    sf.innerHTML+='<option value="'+s+'">'+p.flag+' '+p.name+'</option>';
  });

  // Role badge color
  var rc={boss:'#f59e0b',finance:'#10b981',data:'#3b82f6',ops:'#8b5cf6'}[u.role]||'#64748b';
  document.getElementById('sideUserRole').style.color=rc;

  renderNav();

  // For data specialist, only show upload page
  if(u.role==='data'){
    currentPage='upload_only';
    renderPage();
    return;
  }
  currentPage=u.pages[0];
  renderPage();
}

function renderNav(){
  var u=currentUser;
  var html='';
  var sections=[
    {label:'数据看板', pages:['overview','finance','pl','ads','inventory','orders']},
    {label:'分析工具', pages:['history']},
    {label:'系统管理', pages:['admin','upload_only']}
  ];
  sections.forEach(function(sec){
    var visible=sec.pages.filter(function(p){return u.pages.indexOf(p)>-1;});
    if(!visible.length) return;
    html+='<div class="nav-section">'+sec.label+'</div>';
    visible.forEach(function(p){
      var active=currentPage===p;
      var rc={boss:'#f59e0b',finance:'#10b981',data:'#3b82f6',ops:'#8b5cf6'}[u.role]||'#64748b';
      html+='<button class="nav-btn'+(active?' active':'')+'" style="'+(active?'color:'+rc:'')+'" onclick="goPage(\''+p+'\')">'+
        '<span style="width:18px;text-align:center;font-size:13px;">'+PAGE_ICONS[p]+'</span>'+
        '<span>'+PAGE_LABELS[p]+'</span></button>';
    });
  });
  document.getElementById('navArea').innerHTML=html;
}

function goPage(id){
  currentPage=id;
  document.getElementById('topbarTitle').textContent=PAGE_LABELS[id]||id;
  renderNav(); renderPage();
}

function onMonthChange(){ currentMonth=document.getElementById('monthSelect').value; renderPage(); }
function onShopFilter(){ currentShop=document.getElementById('shopFilter').value; renderPage(); }

// ═══════════════════════════════════════════════════
// PAGE ROUTER
// ═══════════════════════════════════════════════════
function renderPage(){
  var pages={overview:pgOverview,finance:pgFinance,pl:pgPL,ads:pgAds,
             inventory:pgInventory,orders:pgOrders,history:pgHistory,
             admin:pgAdmin,upload_only:pgUploadOnly};
  var fn=pages[currentPage]||pgOverview;
  document.getElementById('mainContent').innerHTML='<div class="page">'+fn()+'</div>';
}

// ── OVERVIEW ──────────────────────────────────────
function pgOverview(){
  var u=currentUser;
  var shops=currentShop==='all'?u.shops:[currentShop];
  var orders=getOrders(currentMonth,shops);
  var d=agg(orders);
  var prev=getPrevMonth(currentMonth);
  var prevOrders=prev?getOrders(prev,shops):[];
  var pd=prev?agg(prevOrders):null;

  var maxRev=Math.max.apply(null,Object.values(d.platMap).map(function(x){return x.rev;})||[1]);

  var platRows='';
  Object.entries(d.platMap).sort(function(a,b){return b[1].rev-a[1].rev;}).forEach(function(e){
    var k=e[0],v=e[1],p=PLAT[k],m=v.rev>0?v.net/v.rev*100:0;
    var mc=m>25?'#10b981':m>10?'#f97316':'#ef4444';
    platRows+='<div style="margin-bottom:16px">'+
      '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">'+
      '<span style="font-weight:600">'+p.flag+' '+p.name+'</span>'+
      '<span style="color:#10b981;font-weight:600">'+myr(v.rev,true)+'</span></div>'+
      bar(v.rev,maxRev,p.color)+
      '<div style="display:flex;gap:14px;font-size:11px;color:var(--muted);margin-top:4px">'+
      '<span>净 '+myr(v.net,true)+'</span><span>'+v.orders+' 单</span>'+
      '<span style="color:'+mc+'">净收率 '+pct(m)+'</span></div></div>';
  });

  var topSkus=d.skuList.slice(0,8).map(function(s,i){
    return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">'+
      '<span style="font-size:11px;color:'+(i<3?'#f59e0b':'#374151')+';width:18px;font-weight:700;flex-shrink:0">'+(i+1)+'</span>'+
      '<div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+s.product+'</div>'+
      '<div style="font-size:10px;color:var(--muted);font-family:monospace">'+s.sku+'</div></div>'+
      '<span style="font-size:12px;color:#10b981;font-weight:600;flex-shrink:0">'+myr(s.rev,true)+'</span></div>';
  }).join('');

  var revTrend=pd?trendPct(d.rev,pd.rev):'';
  var netTrend=pd?trendPct(d.net,pd.net):'';

  var outStock=ALL_DATA.inventory.filter(function(r){return shops.indexOf(r.plat)>-1&&r.stock===0;});
  var lowStock=ALL_DATA.inventory.filter(function(r){return shops.indexOf(r.plat)>-1&&r.stock>0&&r.stock<20;});
  var alertHtml='';
  if(outStock.length>0||lowStock.length>0){
    alertHtml='<div class="alert-box" style="background:#ef444418;border-color:#ef4444">'+
      '<div style="font-weight:700;color:#ef4444;font-size:13px;margin-bottom:8px">⚠ 库存预警</div>'+
      '<div style="display:flex;gap:24px;font-size:13px;color:var(--muted);align-items:center">'+
      '<span>缺货：<strong style="color:#ef4444">'+outStock.length+'</strong> 个SKU</span>'+
      '<span>低库存：<strong style="color:#f97316">'+lowStock.length+'</strong> 个SKU</span>'+
      '<button onclick="goPage(\'inventory\')" style="margin-left:auto;font-size:12px;color:#3b82f6;background:none;border:none;cursor:pointer;font-family:inherit">查看详情 →</button>'+
      '</div></div>';
  }

  return '<div class="page-title" style="font-size:20px;font-weight:800;margin-bottom:5px;">经营总览</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-bottom:20px;">'+
    (currentMonth==='all'?'全部月份':'当前月份：'+currentMonth)+' · '+shops.length+' 个店铺 · 金额换算为 MYR</div>'+
    '<div class="kpi-grid g4">'+
      kpi('总营收',myr(d.rev,true),d.orders+' 笔订单'+(pd?' '+trendIcon(d.rev,pd.rev)+' 较上月 '+revTrend:''),'#10b981','💰')+
      kpi('净收入',myr(d.net,true),'净收率 '+pct(d.rev>0?d.net/d.rev*100:0)+(pd?' '+trendIcon(d.net,pd.net)+' '+netTrend:''),'#3b82f6','✅')+
      kpi('平台扣费',myr(d.fees,true),'退款 '+myr(d.refund,true),'#f97316','📤')+
      kpi('广告支出',myr(d.ad,true),'占营收 '+pct(d.rev>0?d.ad/d.rev*100:0),'#8b5cf6','📣')+
    '</div>'+
    '<div class="grid2">'+
      '<div class="card"><div class="card-title">平台营收分布</div>'+platRows+'</div>'+
      '<div class="card"><div class="card-title">TOP 8 畅销商品</div>'+topSkus+'</div>'+
    '</div>'+alertHtml;
}

// ── FINANCE ───────────────────────────────────────
function pgFinance(){
  var u=currentUser, shops=currentShop==='all'?u.shops:[currentShop];
  var orders=getOrders(currentMonth,shops);
  var d=agg(orders);
  var prev=getPrevMonth(currentMonth);
  var pd=prev?agg(getOrders(prev,shops)):null;

  var sumCards=[
    {l:'总营收',v:d.rev,c:'#10b981'},{l:'平台佣金运费',v:-d.fees,c:'#f97316'},
    {l:'退款退货',v:-d.refund,c:'#ef4444'},{l:'广告费',v:-d.ad,c:'#8b5cf6'},
    {l:'净收入',v:d.net,c:d.net>=0?'#3b82f6':'#ef4444'}
  ].map(function(x){
    return '<div class="kpi" style="border-top:2px solid '+x.c+'">'+
      '<div class="kpi-label">'+x.l+'</div>'+
      '<div class="kpi-value" style="font-size:16px;color:'+x.c+'">'+(x.v>=0?'':'-')+myr(Math.abs(x.v),true)+'</div></div>';
  }).join('');

  var platCards=Object.entries(d.platMap).sort(function(a,b){return b[1].rev-a[1].rev;}).map(function(e){
    var k=e[0],v=e[1],p=PLAT[k],m=v.rev>0?v.net/v.rev*100:0;
    var mc=m>25?'#10b981':m>10?'#f97316':'#ef4444';
    var pPrev=pd&&pd.platMap[k];
    return '<div class="card" style="border-left:3px solid '+p.color+'">'+
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">'+
      '<span style="font-size:22px">'+p.flag+'</span>'+
      '<div><div style="font-weight:700;font-size:15px">'+p.name+' '+p.flag+'</div>'+
      '<div style="font-size:11px;color:var(--muted)">'+v.orders+' 笔 · '+p.currency+'</div></div>'+
      '<div style="margin-left:auto;display:flex;gap:6px;align-items:center">'+
      tag(pct(m)+' 净收率',mc)+
      (pPrev?'<span style="font-size:11px;color:var(--muted)">'+trendIcon(v.net,pPrev.net)+trendPct(v.net,pPrev.net)+'</span>':'')+
      '</div></div>'+
      '<div style="font-size:13px;color:var(--muted);display:flex;gap:6px;flex-wrap:wrap;align-items:center">'+
      '<span style="color:var(--ink);font-weight:700">'+myr(v.rev)+'</span>'+
      '<span>− 扣费</span><span style="color:#f97316">'+myr(v.fees)+'</span>'+
      '<span>− 退款</span><span style="color:#ef4444">'+myr(v.refund)+'</span>'+
      '<span>=</span><span style="font-weight:800;font-size:16px;color:'+(v.net>=0?'#3b82f6':'#ef4444')+'">'+myr(v.net)+'</span>'+
      '</div></div>';
  }).join('');

  var tableRows=Object.entries(d.platMap).map(function(e){
    var k=e[0],v=e[1],p=PLAT[k],m=v.rev>0?v.net/v.rev*100:0;
    return '<tr>'+
      '<td>'+pill(p.flag+' '+p.name,p.color)+'</td>'+
      '<td class="right mono">'+v.orders+'</td>'+
      '<td class="right mono" style="color:#10b981">'+myr(v.rev)+'</td>'+
      '<td class="right mono" style="color:#f97316">'+myr(v.fees)+'</td>'+
      '<td class="right mono" style="color:#ef4444">'+(v.refund>0?myr(v.refund):'—')+'</td>'+
      '<td class="right mono" style="color:'+(v.net>=0?'#3b82f6':'#ef4444')+';font-weight:700">'+myr(v.net)+'</td>'+
      '<td class="right mono" style="color:'+(m>25?'#10b981':m>10?'#f97316':'#ef4444')+'">'+pct(m)+'</td></tr>';
  }).join('');

  return '<div class="page-title" style="font-size:20px;font-weight:800;margin-bottom:5px;">财务核算</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-bottom:20px;">每一分钱透明拆解 · 支持月度环比</div>'+
    '<div class="kpi-grid g5" style="margin-bottom:18px;">'+sumCards+'</div>'+
    platCards+
    '<div class="card"><div class="card-title">平台财务对比表</div>'+
    '<div class="tbl-wrap"><table>'+
    '<tr><th>平台</th><th>订单数</th><th>总营收</th><th>平台扣费</th><th>退款</th><th>净收入</th><th>净收率</th></tr>'+
    tableRows+'</table></div></div>';
}

// ── P&L ───────────────────────────────────────────
function pgPL(){
  var u=currentUser, shops=currentShop==='all'?u.shops:[currentShop];
  var orders=getOrders(currentMonth,shops), d=agg(orders);
  var gmColor=d.gm>30?'#10b981':d.gm>15?'#f97316':'#ef4444';

  var plRows=[
    {l:'销售总营收',           v:d.rev,         c:'#e2e8f0',bold:true},
    {l:'&nbsp;&nbsp;减：平台佣金及运费',v:-d.fees,      c:'#f97316'},
    {l:'&nbsp;&nbsp;减：退款退货',      v:-d.refund,    c:'#ef4444'},
    {l:'&nbsp;&nbsp;减：广告费',        v:-d.ad,        c:'#8b5cf6'},
    {l:'平台净收入',           v:d.net,         c:'#3b82f6',bold:true,div:true},
    {l:'&nbsp;&nbsp;减：商品成本 COGS', v:-d.totalCogs, c:'#64748b',note:d.totalCogs===0?'← 可在下方修改成本':''},
    {l:'毛利润',               v:d.grossProfit, c:d.grossProfit>=0?'#10b981':'#ef4444',bold:true,div:true},
    {l:'毛利率（基于净收入）', display:pct(d.gm),c:gmColor,bold:true}
  ].map(function(row){
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:11px 8px;border-bottom:1px solid '+(row.div?'var(--border)':'#1e293b55')+';">'+
      '<div style="display:flex;gap:8px;align-items:center">'+
      '<span style="font-size:'+(row.bold?14:13)+'px;font-weight:'+(row.bold?700:400)+';color:'+(row.bold?'var(--ink)':'var(--muted)')+'">'+row.l+'</span>'+
      (row.note?'<span style="font-size:11px;color:#f97316">'+row.note+'</span>':'')+
      '</div>'+
      '<span style="font-weight:'+(row.bold?800:400)+';font-size:'+(row.bold?16:14)+'px;color:'+row.c+';font-family:monospace">'+
      (row.display||(row.v>=0?'':'-')+myr(Math.abs(row.v||0)))+'</span></div>';
  }).join('');

  var skuRows=d.skuList.map(function(s){
    var cost=(COGS[s.sku]||0)*s.qty, profit=s.net-cost, m=s.net>0?profit/s.net*100:0;
    return '<tr><td class="mono" style="color:var(--muted)">'+s.sku+'</td>'+
      '<td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+s.product+'</td>'+
      '<td class="right mono">'+num(s.qty)+'</td>'+
      '<td class="right mono" style="color:#3b82f6">'+myr(s.net)+'</td>'+
      '<td class="right mono" style="color:var(--muted)">'+(cost>0?myr(cost):'未录入')+'</td>'+
      '<td class="right mono" style="color:'+(profit>=0?'#10b981':'#ef4444')+';font-weight:700">'+(cost>0?myr(profit):'—')+'</td>'+
      '<td class="right mono" style="color:'+(m>30?'#10b981':m>0?'#f97316':'#ef4444')+'">'+(cost>0?pct(m):'—')+'</td>'+
      '<td>'+(cost>0?pill(profit>=0?'盈利':'亏损',profit>=0?'#10b981':'#ef4444'):pill('待录入','#374151'))+'</td></tr>';
  }).join('');

  return '<div class="page-title" style="font-size:20px;font-weight:800;margin-bottom:5px;">利润表（P&L）</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-bottom:20px;">精准核算每个SKU真实毛利润</div>'+
    '<div class="grid2">'+
      '<div class="card"><div class="card-title">利润表汇总</div>'+plRows+'</div>'+
      '<div class="card"><div class="card-title">修改商品成本（MYR/件）</div>'+
      '<div style="font-size:12px;color:var(--muted);margin-bottom:10px;">每行：SKU代码,成本金额</div>'+
      '<textarea id="cogsInput" rows="8" style="width:100%;padding:10px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--ink);font-size:12px;font-family:monospace;resize:vertical;">'+
      Object.entries(COGS).map(function(e){return escapeHTML(e[0])+','+escapeHTML(e[1]);}).join('\n')+
      '</textarea>'+
      '<button class="btn-primary" style="margin-top:8px;" onclick="saveCogs()">✓ 保存成本，立即更新</button></div>'+
    '</div>'+
    '<div class="card"><div class="card-title">SKU 盈亏明细</div>'+
    '<div class="tbl-wrap"><table>'+
    '<tr><th>SKU</th><th>商品名</th><th>销量</th><th>净收入</th><th>成本</th><th>毛利润</th><th>毛利率</th><th>状态</th></tr>'+
    skuRows+'</table></div></div>';
}

function saveCogs(){
  var raw=document.getElementById('cogsInput').value;
  raw.split('\n').filter(Boolean).forEach(function(l){
    var p=l.split(','); if(p[0]&&p[1]) COGS[p[0].trim()]=parseFloat(p[1])||0;
  });
  renderPage(); alert('✓ 成本已更新！');
}

// ── ADS ───────────────────────────────────────────
function pgAds(){
  var u=currentUser, shops=currentShop==='all'?u.shops:[currentShop];
  var adsData=ALL_DATA.ads.filter(function(r){return shops.indexOf(r.plat)>-1;});
  var orders=getOrders(currentMonth,shops), d=agg(orders);
  var totalSpend=adsData.reduce(function(s,r){return s+r.spend;},0);
  var avgRoas=adsData.length>0?adsData.reduce(function(s,r){return s+r.roas;},0)/adsData.length:0;

  var rows=[...adsData].sort(function(a,b){return b.roas-a.roas;}).map(function(r){
    var p=PLAT[r.plat], ctr=r.imp>0?r.clicks/r.imp*100:0, cpc=r.clicks>0?r.spend/r.clicks:0;
    var rc=r.roas>=3?'#10b981':r.roas>=2?'#3b82f6':r.roas>=1?'#f97316':'#ef4444';
    var grade=r.roas>=3?'🔥 优秀':r.roas>=2?'✅ 良好':r.roas>=1?'⚠ 一般':'🔴 亏损';
    return '<tr><td>'+pill(p.flag+' '+p.name,p.color)+'</td>'+
      '<td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+r.campaign+'</td>'+
      '<td class="mono" style="color:var(--muted)">'+r.sku+'</td>'+
      '<td class="right mono" style="color:#8b5cf6">'+myr(r.spend)+'</td>'+
      '<td class="right mono">'+num(r.clicks)+'</td>'+
      '<td class="right mono" style="color:var(--muted)">'+num(r.imp)+'</td>'+
      '<td class="right mono">'+pct(ctr)+'</td>'+
      '<td class="right mono" style="color:#f97316">'+myr(cpc)+'</td>'+
      '<td class="right mono" style="color:'+rc+';font-weight:700">'+r.roas.toFixed(2)+'x</td>'+
      '<td>'+grade+'</td></tr>';
  }).join('');

  return '<div class="page-title" style="font-size:20px;font-weight:800;margin-bottom:5px;">广告分析</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-bottom:20px;">跨平台 ROAS / CTR / CPC 全对比</div>'+
    '<div class="kpi-grid g4">'+
      kpi('广告总花费',myr(totalSpend,true),'所有平台合计','#8b5cf6','📣')+
      kpi('平均 ROAS',avgRoas.toFixed(2)+'x','广告回报率','#f59e0b','📈')+
      kpi('广告占营收',pct(d.rev>0?totalSpend/d.rev*100:0),'建议保持 < 15%',d.rev>0&&totalSpend/d.rev<0.15?'#10b981':'#f97316','%')+
      kpi('优质广告',adsData.filter(function(r){return r.roas>=2;}).length+' / '+adsData.length,'ROAS ≥ 2 的广告组','#3b82f6','⭐')+
    '</div>'+
    '<div class="card"><div class="card-title">广告投放明细（按 ROAS 排序）</div>'+
    '<div class="tbl-wrap"><table>'+
    '<tr><th>平台</th><th>广告组</th><th>SKU</th><th>花费</th><th>点击</th><th>曝光</th><th>CTR</th><th>CPC</th><th>ROAS</th><th>效果</th></tr>'+
    rows+'</table></div></div>';
}

// ── INVENTORY ─────────────────────────────────────
function pgInventory(){
  var u=currentUser, shops=currentShop==='all'?u.shops:[currentShop];
  var rows=ALL_DATA.inventory.filter(function(r){return shops.indexOf(r.plat)>-1;});
  var outStock=rows.filter(function(r){return r.stock===0;});
  var low=rows.filter(function(r){return r.stock>0&&r.stock<20;});

  var alertHtml=outStock.length>0?
    '<div class="alert-box" style="background:#ef444418;border-color:#ef4444">'+
    '<div style="font-weight:700;color:#ef4444;font-size:13px;margin-bottom:8px">🚫 缺货商品 — 需立即补货</div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap">'+
    outStock.map(function(r){return tag(r.sku+' · '+r.product,'#ef4444');}).join('')+
    '</div></div>':'';

  var tableRows=[...rows].sort(function(a,b){return a.stock-b.stock;}).map(function(r){
    var t=(r.sold+r.stock)>0?r.sold/(r.sold+r.stock)*100:0;
    var p=PLAT[r.plat||'shopee_my'];
    var st=r.stock===0?'缺货':r.stock<20?'预警':'正常';
    var stc={缺货:'#ef4444',预警:'#f97316',正常:'#10b981'}[st];
    var tip=r.stock===0?'立即补货 🚨':r.stock<20?'尽快备货 ⚠':t>70?'畅销保量 🔥':'正常 ✅';
    return '<tr><td class="mono" style="color:var(--muted)">'+r.sku+'</td>'+
      '<td style="font-weight:'+(r.stock<20?700:400)+'">'+r.product+'</td>'+
      '<td>'+p.flag+' '+p.name+'</td>'+
      '<td class="right mono" style="color:'+(r.stock===0?'#ef4444':r.stock<20?'#f97316':'var(--ink)')+';font-weight:'+(r.stock<20?700:400)+'">'+r.stock+'</td>'+
      '<td class="right mono" style="color:#10b981">'+r.sold+'</td>'+
      '<td style="min-width:130px"><div style="display:flex;align-items:center;gap:8px">'+
      '<div style="flex:1">'+bar(t,100,t>60?'#10b981':'#f97316')+'</div>'+
      '<span style="font-size:11px;color:var(--muted);flex-shrink:0;font-family:monospace">'+pct(t)+'</span></div></td>'+
      '<td>'+pill(st,stc)+'</td><td style="color:var(--muted);font-size:12px">'+tip+'</td></tr>';
  }).join('');

  return '<div class="page-title" style="font-size:20px;font-weight:800;margin-bottom:5px;">库存监控</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-bottom:20px;">实时识别缺货 / 低库存 / 滞销商品</div>'+
    '<div class="kpi-grid g4">'+
      kpi('总SKU数',rows.length,'在售商品','#3b82f6','📦')+
      kpi('缺货',outStock.length,'需立即补货','#ef4444','🚫')+
      kpi('低库存预警',low.length,'库存 < 20','#f97316','⚠')+
      kpi('库存正常',rows.filter(function(r){return r.stock>=20;}).length,'暂无需处理','#10b981','✅')+
    '</div>'+alertHtml+
    '<div class="card"><div class="tbl-wrap"><table>'+
    '<tr><th>SKU</th><th>商品名</th><th>平台</th><th>在库</th><th>已销</th><th>周转率</th><th>状态</th><th>建议</th></tr>'+
    tableRows+'</table></div></div>';
}

// ── ORDERS ────────────────────────────────────────
function pgOrders(){
  var u=currentUser, shops=currentShop==='all'?u.shops:[currentShop];
  var orders=getOrders(currentMonth,shops);
  var rows=orders.slice(0,200).map(function(r){
    var p=PLAT[r.plat];
    return '<tr><td>'+pill(p.flag+' '+p.name,p.color)+'</td>'+
      '<td class="mono" style="color:var(--dim);font-size:11px">'+r.id+'</td>'+
      '<td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+r.product+'</td>'+
      '<td class="mono" style="color:var(--muted)">'+r.sku+'</td>'+
      '<td class="right mono">'+r.qty+'</td>'+
      '<td class="right mono" style="color:#10b981">'+myr(r.revenue)+'</td>'+
      '<td class="right mono" style="color:#f97316">'+myr(r.fee+r.ship)+'</td>'+
      '<td class="right mono" style="color:#ef4444">'+(r.refund>0?myr(r.refund):'—')+'</td>'+
      '<td class="right mono" style="color:'+(r.net>=0?'#3b82f6':'#ef4444')+';font-weight:700">'+myr(r.net)+'</td>'+
      '<td class="right" style="font-size:11px;color:var(--muted)">'+r.month+'</td></tr>';
  }).join('');

  return '<div class="page-title" style="font-size:20px;font-weight:800;margin-bottom:5px;">订单明细</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-bottom:20px;">'+orders.length+' 条订单 · 金额已换算为 MYR</div>'+
    '<div class="card"><div class="tbl-wrap"><table>'+
    '<tr><th>平台</th><th>订单号</th><th>商品</th><th>SKU</th><th>数量</th><th>营收</th><th>扣费</th><th>退款</th><th>净收入</th><th>月份</th></tr>'+
    rows+'</table></div>'+
    (orders.length>200?'<div style="text-align:center;padding:12px;font-size:12px;color:var(--muted)">显示前200条，共 '+orders.length+' 条</div>':'')+
    '</div>';
}

// ── HISTORY ───────────────────────────────────────
function pgHistory(){
  var u=currentUser, shops=u.shops;
  var monthData=MONTHS.map(function(m){
    var o=getOrders(m,shops), d=agg(o);
    return {month:m,rev:d.rev,net:d.net,orders:d.orders,gm:d.gm};
  });
  var maxRev=Math.max.apply(null,monthData.map(function(x){return x.rev;}));
  var maxNet=Math.max.apply(null,monthData.map(function(x){return x.net;}));

  var barCols=monthData.map(function(m){
    var revH=Math.round(m.rev/maxRev*100);
    var netH=Math.round(m.net/maxNet*100);
    return '<div class="chart-bar-col">'+
      '<div class="chart-val">'+myr(m.rev,true)+'</div>'+
      '<div style="display:flex;gap:3px;align-items:flex-end;height:80px;">'+
      '<div class="chart-bar" style="flex:1;height:'+revH+'%;background:#10b981;opacity:0.8;"></div>'+
      '<div class="chart-bar" style="flex:1;height:'+netH+'%;background:#3b82f6;opacity:0.8;"></div>'+
      '</div>'+
      '<div class="chart-label">'+m.month.slice(5)+'月</div>'+
      '</div>';
  }).join('');

  var tableRows=monthData.map(function(m,i){
    var prev=i>0?monthData[i-1]:null;
    return '<tr style="'+(m.month===currentMonth?'background:#10b98108;':'')+'" >'+
      '<td style="font-weight:600;color:'+(m.month===currentMonth?'#10b981':'var(--ink)')+'">'+m.month+(m.month===currentMonth?' <span style="font-size:10px;color:#10b981">当前</span>':'')+'</td>'+
      '<td class="right mono" style="color:#10b981">'+myr(m.rev)+'</td>'+
      '<td class="right mono" style="color:#3b82f6">'+myr(m.net)+'</td>'+
      '<td class="right">'+m.orders+'</td>'+
      '<td class="right mono" style="color:'+(m.gm>30?'#10b981':m.gm>15?'#f97316':'#ef4444')+'">'+pct(m.gm)+'</td>'+
      (prev?'<td class="right" style="color:'+(m.rev>=prev.rev?'#10b981':'#ef4444')+'">'+trendIcon(m.rev,prev.rev)+' '+trendPct(m.rev,prev.rev)+'</td>':'<td class="right" style="color:var(--muted)">—</td>')+
      '</tr>';
  }).join('');

  // Platform monthly comparison
  var platMonthRows=Object.keys(PLAT).filter(function(k){return shops.indexOf(k)>-1;}).map(function(pk){
    var p=PLAT[pk];
    var cells=MONTHS.map(function(m){
      var o=getOrders(m,[pk]), d=agg(o);
      return '<td class="right mono" style="color:#10b981;font-size:12px">'+myr(d.rev,true)+'</td>';
    }).join('');
    return '<tr><td>'+pill(p.flag+' '+p.name,p.color)+'</td>'+cells+'</tr>';
  }).join('');

  return '<div class="page-title" style="font-size:20px;font-weight:800;margin-bottom:5px;">历史数据对比</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-bottom:20px;">月度营收趋势 · 环比增长分析</div>'+

    '<div class="card">'+
      '<div class="card-title">月度营收趋势'+
        '<div style="display:flex;gap:12px;font-size:11px;">'+
          '<span><span style="display:inline-block;width:10px;height:10px;background:#10b981;border-radius:2px;margin-right:4px;"></span>总营收</span>'+
          '<span><span style="display:inline-block;width:10px;height:10px;background:#3b82f6;border-radius:2px;margin-right:4px;"></span>净收入</span>'+
        '</div></div>'+
      '<div class="chart-bar-wrap">'+barCols+'</div>'+
    '</div>'+

    '<div class="card"><div class="card-title">月度数据明细</div>'+
    '<div class="tbl-wrap"><table>'+
    '<tr><th>月份</th><th>总营收</th><th>净收入</th><th>订单数</th><th>毛利率</th><th>环比</th></tr>'+
    tableRows+'</table></div></div>'+

    '<div class="card"><div class="card-title">各平台月度营收（MYR）</div>'+
    '<div class="tbl-wrap"><table>'+
    '<tr><th>平台</th>'+MONTHS.map(function(m){return '<th>'+m.slice(5)+'月</th>';}).join('')+'</tr>'+
    platMonthRows+'</table></div></div>';
}

// ── ADMIN ─────────────────────────────────────────
function pgAdmin(){
  var rows=USERS.map(function(u){
    var rc={boss:'#f59e0b',finance:'#10b981',data:'#3b82f6',ops:'#8b5cf6'}[u.role]||'#64748b';
    var shopPills=u.shops.map(function(s){return pill(PLAT[s].flag+' '+PLAT[s].name.slice(0,4),PLAT[s].color);}).join(' ');
    return '<tr>'+
      '<td style="font-weight:600">'+u.name+'</td>'+
      '<td style="color:var(--muted);font-size:12px">'+u.email+'</td>'+
      '<td>'+pill(u.roleLabel,rc)+'</td>'+
      '<td>'+shopPills+'</td>'+
      '<td class="center">'+(u.canUpload?'<span style="color:#10b981">✓</span>':'—')+'</td>'+
      '<td class="center">'+(u.canAdmin?'<span style="color:#10b981">✓</span>':'—')+'</td>'+
      '<td><button onclick="alert(\'编辑用户功能\\n\\n实际部署后可在 Supabase 后台直接管理用户和权限\')" style="font-size:11px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;font-family:inherit;">编辑</button></td>'+
      '</tr>';
  }).join('');

  return '<div class="page-title" style="font-size:20px;font-weight:800;margin-bottom:5px;">用户管理</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-bottom:20px;">管理团队成员账号和店铺权限</div>'+

    '<div style="display:flex;gap:10px;margin-bottom:16px;">'+
      '<button onclick="alert(\'新增用户\\n\\n部署后在 Supabase Dashboard → Authentication → Users 新增用户\\n然后在数据库 user_profiles 表设置权限和店铺\')" '+
      'style="padding:9px 18px;border-radius:8px;border:none;background:var(--green);color:#000;font-weight:700;font-family:inherit;cursor:pointer;font-size:13px;">+ 新增用户</button>'+
      '<div style="padding:9px 14px;border-radius:8px;background:var(--raised);border:1px solid var(--border);font-size:12px;color:var(--muted);">共 '+USERS.length+' 个账号 · '+USERS.filter(function(u){return u.role==='ops';}).length+' 个运营</div>'+
    '</div>'+

    '<div class="user-table-card">'+
    '<table><tr><th>姓名</th><th>账号</th><th>角色</th><th>负责店铺</th><th>可上传</th><th>管理员</th><th>操作</th></tr>'+
    rows+'</table></div>'+

    '<div class="card" style="margin-top:14px;border:1px solid var(--green)44;background:var(--green)08;">'+
    '<div class="card-title" style="color:var(--green);">💡 真实部署后的用户管理</div>'+
    '<div style="font-size:13px;color:var(--muted);line-height:1.9;">'+
    '① 部署到 Vercel + Supabase 后，用户数据存在数据库中<br>'+
    '② 在 Supabase Dashboard 创建账号，设置邮箱和密码<br>'+
    '③ 在 user_profiles 表配置 role（角色）和 shops（负责店铺）<br>'+
    '④ 运营人员登录后自动只看到自己负责店铺的数据<br>'+
    '⑤ 老板和财务自动看到所有店铺数据'+
    '</div></div>';
}

// ── UPLOAD ONLY (data specialist) ────────────────
function pgUploadOnly(){
  return '<div class="page-title" style="font-size:20px;font-weight:800;margin-bottom:5px;">上传报表</div>'+
    '<div style="font-size:12px;color:var(--muted);margin-bottom:20px;">数据专员专属上传入口 · 支持全平台报表</div>'+
    '<div class="card" style="border:1px dashed var(--border);cursor:pointer;" onclick="openUpload()">'+
    '<div style="text-align:center;padding:40px;">'+
    '<div style="font-size:48px;margin-bottom:12px;opacity:0.4;">⬆</div>'+
    '<div style="font-weight:700;font-size:16px;margin-bottom:6px;">点击上传报表文件</div>'+
    '<div style="font-size:13px;color:var(--muted);">支持 Shopee · Lazada · TikTok · CSV · Excel</div>'+
    '</div></div>'+
    pgGuide();
}

function pgGuide(){
  var sections=[
    {n:'Shopee 报表导出',c:'#ee4d2d',i:'🛍',s:['订单：卖家中心 → 订单管理 → 全部订单 → 导出','财务：我的收入 → 收入明细 → 导出报告','库存：商品 → 我的商品 → 批量管理 → 导出','广告：广告中心 → 报告 → 自定义报告 → 下载']},
    {n:'Lazada 报表导出',c:'#0066cc',i:'🛒',s:['订单：Orders → Manage Orders → Export','财务：Finance → Revenue Report → Export','库存：Products → Manage Products → Export','广告：Sponsored Solutions → Report → Download']},
    {n:'TikTok Shop 报表导出',c:'#ff2d55',i:'🎵',s:['订单：订单管理 → 全部订单 → 批量导出','财务：财务 → 收入详情 → 导出数据','库存：商品 → 商品管理 → 批量导出','广告：广告 → 数据报告 → 导出CSV']},
  ];
  return '<div style="margin-top:20px;">'+
    sections.map(function(g){
      return '<div class="card" style="border-left:3px solid '+g.c+';">'+
        '<div style="display:flex;gap:10px;align-items:center;margin-bottom:12px;"><span style="font-size:20px;">'+g.i+'</span>'+
        '<span style="font-weight:700;color:'+g.c+';">'+g.n+'</span></div>'+
        g.s.map(function(s,j){return '<div style="display:flex;gap:10px;margin-bottom:8px;">'+
          '<div style="width:20px;height:20px;border-radius:50%;background:'+g.c+'20;color:'+g.c+';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;">'+(j+1)+'</div>'+
          '<div style="font-size:12px;color:var(--muted);">'+s+'</div></div>';}).join('')+
        '</div>';
    }).join('')+'</div>';
}

// ═══════════════════════════════════════════════════
// UPLOAD MODAL
// ═══════════════════════════════════════════════════
function openUpload(){
  // Build platform buttons based on user's shops
  var platHtml=currentUser.shops.map(function(s){
    var p=PLAT[s];
    return '<button class="plat-btn'+(s===selectedPlat?' sel':'')+'" onclick="selPlat(this,\''+s+'\')" style="'+(s===selectedPlat?'border-color:'+p.color+';color:'+p.color+';background:'+p.color+'12':'')+'">'+p.flag+' '+p.name+'</button>';
  }).join('');
  document.getElementById('platBtns').innerHTML=platHtml;
  document.getElementById('fileListArea').innerHTML='';
  document.getElementById('uploadResult').style.display='none';
  pendingFiles=[];
  document.getElementById('uploadModal').style.display='flex';
}

function closeUpload(){ document.getElementById('uploadModal').style.display='none'; }

function selType(btn,type){
  selectedType=type;
  document.querySelectorAll('.type-btn').forEach(function(b){b.classList.remove('sel');});
  btn.classList.add('sel');
}

function selPlat(btn,plat){
  selectedPlat=plat;
  var p=PLAT[plat];
  document.querySelectorAll('.plat-btn').forEach(function(b){
    b.classList.remove('sel');
    b.style.borderColor=''; b.style.color=''; b.style.background='';
  });
  btn.classList.add('sel');
  btn.style.borderColor=p.color; btn.style.color=p.color; btn.style.background=p.color+'12';
}

function handleDrop(e){ handleFiles(e.dataTransfer.files); }

function handleFiles(files){
  pendingFiles=Array.from(files);
  var html=pendingFiles.map(function(f){
    return '<div class="file-item">'+
      '<span style="font-size:18px;">📄</span>'+
      '<div style="flex:1"><div style="font-weight:600;">'+escapeHTML(f.name)+'</div>'+
      '<div style="font-size:11px;color:var(--muted);">'+(f.size/1024).toFixed(1)+' KB</div></div>'+
      '<span style="color:#10b981;">✓</span></div>';
  }).join('');
  document.getElementById('fileListArea').innerHTML=html;
}

function doUpload(){
  if(!pendingFiles.length){ alert('请先选择文件'); return; }
  document.getElementById('uploadProgress').style.display='block';
  document.getElementById('doUploadBtn').disabled=true;
  setTimeout(function(){
    document.getElementById('uploadProgress').style.display='none';
    var year=document.getElementById('upYear').value;
    var month=document.getElementById('upMonth').value;
    var mKey=year+'-'+month;
    var typeLabel={order:'订单报表',finance:'财务报表',inventory:'库存报表',ads:'广告报表'}[selectedType];
    var p=PLAT[selectedPlat];
    document.getElementById('uploadResult').style.display='block';
    document.getElementById('uploadResult').innerHTML=
      '<div style="padding:14px;background:#10b98118;border:1px solid #10b98144;border-radius:8px;font-size:13px;color:#10b981;">'+
      '✓ 上传成功！<br>'+
      '<span style="color:var(--muted);">平台：'+escapeHTML(p.flag)+' '+escapeHTML(p.name)+' · 类型：'+escapeHTML(typeLabel)+' · 月份：'+escapeHTML(mKey)+'<br>'+
      '文件数：'+pendingFiles.length+'份 · 数据已合并到报表系统</span></div>';
    document.getElementById('doUploadBtn').disabled=false;
    uploadedThisSession.push({plat:selectedPlat,type:selectedType,month:mKey,files:pendingFiles.map(function(f){return f.name;})});
    pendingFiles=[];
    document.getElementById('fileListArea').innerHTML='';
  },1500);
}

// ═══════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════
document.addEventListener('keydown',function(e){
  if(e.key==='Enter'&&document.getElementById('loginScreen').style.display!=='none') doLogin();
});
