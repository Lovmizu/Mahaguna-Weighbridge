let allData=[];
const $=id=>document.getElementById(id);
let page=0, filtered=[];
const money=n=>Number(n||0).toLocaleString('id-ID');
const dateFmt=s=>{if(!s)return '';let [y,m,d]=s.split('-');return `${d} ${['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][+m-1]} ${y.slice(-2)}`};
const dayFmt=s=>{if(!s)return '';let d=new Date(s+'T12:00:00');return ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][d.getDay()]};
function excelDate(v){
 if(v instanceof Date&&!isNaN(v))return `${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,'0')}-${String(v.getDate()).padStart(2,'0')}`;
 if(typeof v==='number'){let d=new Date(Date.UTC(1899,11,30)+Math.floor(v)*86400000);return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;}
 let s=String(v??'').trim();if(/^\d{4}-\d{1,2}-\d{1,2}/.test(s))return s.slice(0,10);
 let m=s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);if(m)return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;
 return '';
}
function excelTime(v){
 if(v instanceof Date&&!isNaN(v))return `${String(v.getHours()).padStart(2,'0')}:${String(v.getMinutes()).padStart(2,'0')}:${String(v.getSeconds()).padStart(2,'0')}`;
 if(v instanceof Date===false&&typeof v==='number'){let sec=Math.round((v%1)*86400)%86400;return `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor(sec%3600/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;}
 if(v&&typeof v==='object'&&'days'in v){let sec=Math.round(v.days*86400+v.seconds)%86400;return `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor(sec%3600/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;}
 let s=String(v??'').trim();let m=s.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);return m?`${m[1].padStart(2,'0')}:${m[2]}:${(m[3]||'00')}`:s;
}
function getSettings(){return {date:$('date').value,shift:$('shift').value,weather:$('weather').value,company:$('company').value,checker:$('checker').value,staff:$('staff').value.split('\n').map(x=>x.trim()).filter(Boolean),made:$('made').value,checked:$('checked').value,note:$('note').value,perpage:+$('perpage').value};}
function setDefaultFromData(){
 let dates=[...new Set(allData.map(x=>x.date).filter(Boolean))].sort();
 $('date').value=dates[dates.length-1]||new Date().toISOString().slice(0,10);
 let today=allData.filter(x=>x.date===$('date').value);
 let shifts=[...new Set(today.map(x=>x.shift).filter(Boolean))];
 $('shift').value=shifts.includes('SIANG')?'SIANG':(shifts[0]||'ALL');
}
async function init(){try{allData=await (await fetch('data.json')).json();}catch(e){allData=[]}setDefaultFromData();render();}
function render(){
 let s=getSettings();
 filtered=allData.filter(x=>x.date===s.date&&(s.shift==='ALL'||x.shift===s.shift));
 filtered.sort((a,b)=>(a.time||'').localeCompare(b.time||''));
 let pages=Math.max(1,Math.ceil(filtered.length/s.perpage));page=Math.min(page,pages-1);
 let total=filtered.reduce((a,x)=>a+x.net,0);
 $('stats').innerHTML=`<b>${filtered.length}</b> transaksi ditemukan<br>Total netto: <b>${money(total)} kg</b> (${(total/1000).toLocaleString('id-ID',{maximumFractionDigits:3})} ton)`;
 $('count').textContent=`${filtered.length} transaksi`;$('pageinfo').textContent=`Halaman ${page+1} dari ${pages}`;
 $('prev').disabled=page===0;$('next').disabled=page>=pages-1;draw(s);
}
function draw(s){
 const c=$('report'),ctx=c.getContext('2d'),W=c.width,H=c.height;
 ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#333';ctx.lineWidth=1.5;
 const text=(v,x,y,size=15,bold=false,align='center')=>{ctx.font=`${bold?'bold ':''}${size}px Arial`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle='#111';ctx.fillText(String(v??''),x,y);};
 const line=(x1,y1,x2,y2)=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};
 const rect=(x,y,w,h)=>ctx.strokeRect(x,y,w,h);
 const x0=70,tableW=790,rightX=880,rightW=650;
 // Logo mark
 ctx.save();ctx.translate(130,65);ctx.lineWidth=5;
 let pts=[[0,28],[35,0],[70,28],[105,0],[140,28],[140,92],[105,120],[105,56],[70,84],[70,28],[35,56],[35,120],[0,92],[0,28]];
 ctx.beginPath();ctx.moveTo(...pts[0]);for(let p of pts.slice(1))ctx.lineTo(...p);ctx.stroke();
 line(0,92,70,28);line(35,0,35,56);line(70,84,105,56);line(105,0,105,56);ctx.restore();
 text('MAHAGUNA',205,210,36,true);text('PERUSAHAAN ASAL BATU BARA',205,238,15);
 // Personnel block
 let sx=390,sy=38,sw=335,sh=28,staffRows=5;
 rect(sx,sy,sw,sh*(staffRows+1));
 line(sx+145,sy,sx+145,sy+sh*(staffRows+1));
 line(sx+245,sy,sx+245,sy+sh*(staffRows+1));
 text('NAMA PERSONEL',sx+72,sy+14,12,true);
 text('TANDA TANGAN',sx+195,sy+14,12,true);
 text('KETERANGAN',sx+290,sy+14,12,true);
 for(let i=0;i<staffRows;i++){
  let y=sy+sh*(i+1);
  line(sx,y,sx+sw,y);
  let name=s.staff[i]||'';
  ctx.save();
  ctx.font='bold 13px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#111';
  ctx.fillText(name,sx+72,y+sh/2,132);
  ctx.restore();
 }
 text(s.weather,sx+290,sy+sh*3.5,14,true);
 // Date / shift
 rect(x0,268,tableW,32);line(x0+350,268,x0+350,300);line(x0+520,268,x0+520,300);
 text('HARI',x0+175,278,12,true);text(dayFmt(s.date),x0+175,293,14,true);
 text('TANGGAL',x0+435,278,12,true);text(dateFmt(s.date),x0+435,293,14,true);
 text('SHIFT KERJA',x0+655,278,12,true);text(s.shift==='ALL'?'SEMUA':s.shift,x0+655,293,14,true);
 // Instructions panel
 let iy=60;rect(rightX,iy,rightW,205);
 ['PERHATIAN ANGKA TIMBANGAN DENGAN BAIK','CATAT HASIL TIMBANGAN DENGAN RAPI','JUMLAHKAN HASIL TIMBANGAN DENGAN TELITI','KOLOM TOTAL PENIMBANGAN HARUS DIISI','DAN TIDAK BOLEH MEMBUAT CORETAN YANG TIDAK','PERLU PADA FORM PENCATATAN TIMBANGAN'].forEach((v,i)=>text(v,rightX+rightW/2,iy+22+i*25,14));
 line(rightX,iy+160,rightX+rightW,iy+160);text('JIKA ADA PERMASALAHAN DILAPANGAN INFORMASIKAN KEPADA',rightX+rightW/2,iy+180,13);text('VICTORI ZETH P : 0852 1050 0448',rightX+rightW/2,iy+198,13);
 // Main table. Column widths follow DATA TES.xlsx HASIL sheet proportions.
 let ty=320,rowH=27,headH=55;
 let b=[x0,x0+44,x0+204,x0+340,x0+502,x0+658,x0+790];
 rect(x0,ty,tableW,headH+rowH*s.perpage);
 for(let x of b.slice(1,-1))line(x,ty,x,ty+headH+rowH*s.perpage);
 line(x0,ty+headH,x0+tableW,ty+headH);
 line(b[2],ty+28,b[5],ty+28);
 text('NO', (b[0]+b[1])/2,ty+34,14,true);
 text('NO. DUMPTRUCK',(b[1]+b[2])/2,ty+34,14,true);
 text('PENIMBANGAN',(b[2]+b[5])/2,ty+17,14,true);
 text('BRUTO',(b[2]+b[3])/2,ty+45,13,true);
 text('TARRA',(b[3]+b[4])/2,ty+45,13,true);
 text('NETTO',(b[4]+b[5])/2,ty+45,13,true);
 text('KETERANGAN',(b[5]+b[6])/2,ty+34,13,true);
 let start=page*s.perpage,pageRows=filtered.slice(start,start+s.perpage);
 pageRows.forEach((r,i)=>{
  let y=ty+headH+rowH*i;line(x0,y+rowH,x0+tableW,y+rowH);
  text(start+i+1,(b[0]+b[1])/2,y+14,13);
  text(r.unit,(b[1]+b[2])/2,y+14,13);
  text(money(r.gross),(b[2]+b[3])/2,y+14,13);
  text(money(r.tare),(b[3]+b[4])/2,y+14,13);
  text(money(r.net),(b[4]+b[5])/2,y+14,13);
  text(r.company||r.partner||s.note,(b[5]+b[6])/2,y+14,13);
 });
 // Summary table
 let by=ty+40;rect(rightX,by,rightW,156);
 [30,60,90,120].forEach(v=>line(rightX,by+v,rightX+rightW,by+v));
 [rightX+rightW/3,rightX+2*rightW/3].forEach(x=>line(x,by+30,x,by+90));
 text('TOTAL PENIMBANGAN',rightX+rightW/2,by+15,14,true);
 text('BRUTO (KG)',rightX+rightW/6,by+45,13,true);text('TARRA (KG)',rightX+rightW/2,by+45,13,true);text('NETTO (KG)',rightX+5*rightW/6,by+45,13,true);
 text(money(pageRows.reduce((a,x)=>a+x.gross,0)),rightX+rightW/6,by+75,14);
 text(money(pageRows.reduce((a,x)=>a+x.tare,0)),rightX+rightW/2,by+75,14);
 text(money(pageRows.reduce((a,x)=>a+x.net,0)),rightX+5*rightW/6,by+75,14);
 text('PERUSAHAAN',rightX+rightW/6,by+105,13,true);text(s.company,rightX+rightW/2+rightW/6,by+105,14,true);
 text('CHECKER',rightX+rightW/6,by+135,13,true);text(s.checker,rightX+rightW/2+rightW/6,by+135,14,true);
 // Approval
 let ay=by+260;rect(rightX,ay,rightW,150);line(rightX,ay+28,rightX+rightW,ay+28);line(rightX+rightW/2,ay+28,rightX+rightW/2,ay+150);line(rightX,ay+120,rightX+rightW,ay+120);
 text('PERSETUJUAN',rightX+rightW/2,ay+14,14,true);text('DIBUAT OLEH',rightX+rightW/4,ay+38,13,true);text('DIPERIKSA OLEH',rightX+3*rightW/4,ay+38,13,true);
 text(s.made,rightX+rightW/4,ay+135,13,true);text(s.checked,rightX+3*rightW/4,ay+135,13,true);
 text(`Halaman ${page+1}/${Math.max(1,Math.ceil(filtered.length/s.perpage))}`,W-80,H-30,12,false);
}
['date','shift','weather','company','checker','staff','made','checked','note','perpage'].forEach(id=>$(id).addEventListener('change',()=>{page=0;render();}));
$('refresh').onclick=()=>render();$('prev').onclick=()=>{page=Math.max(0,page-1);render();};$('next').onclick=()=>{page++;render();};
$('reset').onclick=()=>{if(!confirm('Kembalikan pengaturan awal?'))return;$('weather').value='CERAH';$('company').value='BSSR';$('checker').value='JUMANTO';$('staff').value='CAPLIN.E\nASRANI\nYugo P\nA Syafril';$('made').value='M.FARIZAL';$('checked').value='VIKTOR.Z.P';$('note').value='BSSR';render();};
$('export').onclick=()=>{let c=$('report');c.toBlob(blob=>{let a=document.createElement('a'),s=getSettings();a.href=URL.createObjectURL(blob);a.download=`Mahaguna_${s.date}_${s.shift}_Hal-${page+1}.jpg`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500);},'image/jpeg',.96);};
$('file').addEventListener('change',async e=>{
 let f=e.target.files[0];if(!f)return;
 try{
  if(!window.XLSX)await new Promise((ok,no)=>{let sc=document.createElement('script');sc.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';sc.onload=ok;sc.onerror=no;document.head.appendChild(sc);});
  let book=XLSX.read(await f.arrayBuffer(),{type:'array',cellDates:true});
  let dataSheet=book.Sheets['DATA']||book.Sheets[book.SheetNames[0]];
  let arr=XLSX.utils.sheet_to_json(dataSheet,{defval:'',raw:true});
  const norm=o=>{let z={};for(let k in o)z[String(k).trim().toUpperCase()]=o[k];return z;};
  allData=arr.map(raw=>{
   let r=norm(raw);
   return {id:String(r['TRANS. ID']||''),unit:String(r['NO DT']||''),company:String(r['PERUSAHAAN']||''),product:String(r['PRODUK']||''),partner:String(r['PARTNERS']||''),date:excelDate(r['TANGGAL ID']),time:excelTime(r['WAKTU MASUK']),gross:Number(r.GROSS)||0,tare:Number(r.TARE)||0,net:Number(r.NETTO)||0,shift:String(r.SHIFT||'').trim().toUpperCase(),scale:String(r.TIMBANGAN||''),note:String(r.KETERANGAN||'')};
  }).filter(x=>x.date&&x.unit);
  // Read report defaults from the existing HASIL template, without changing its layout.
  let hs=book.Sheets['HASIL'];
  if(hs){
   const val=cell=>hs[cell]?.v;
   if(val('F2'))$('weather').value=String(val('F2'));
   if(val('I15'))$('company').value=String(val('I15'));
   if(val('I16'))$('checker').value=String(val('I16'));
   if(val('H26'))$('made').value=String(val('H26'));
   if(val('I26'))$('checked').value=String(val('I26'));
  }
  setDefaultFromData();page=0;render();
  alert(`Berhasil membaca sheet DATA: ${allData.length} transaksi. Format laporan mengikuti susunan sheet HASIL.`);
 }catch(err){alert('Gagal membaca Excel. Pastikan file memiliki sheet DATA dan HASIL. '+err.message);}
});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
init();
