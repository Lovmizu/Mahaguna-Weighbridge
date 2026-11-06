let allData=[];
const $=id=>document.getElementById(id);
let page=0, filtered=[];
const money=n=>Number(n||0).toLocaleString('id-ID');
const dateFmt=s=>{if(!s)return '';let [y,m,d]=s.split('-');return `${d} ${['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][+m-1]} ${y.slice(-2)}`};
const dayFmt=s=>{if(!s)return '';let d=new Date(s+'T12:00:00');return ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][d.getDay()]};
async function init(){try{allData=await (await fetch('data.json')).json();}catch(e){allData=[]}
let dates=[...new Set(allData.map(x=>x.date))].sort();$('date').value=dates[dates.length-1]||new Date().toISOString().slice(0,10);
let latest=allData.filter(x=>x.date===$('date').value);let shifts=[...new Set(latest.map(x=>x.shift))];$('shift').value=shifts.includes('MALAM')?'MALAM':(shifts[0]||'ALL');render();}
function getSettings(){return {date:$('date').value,shift:$('shift').value,weather:$('weather').value,company:$('company').value,checker:$('checker').value,staff:$('staff').value.split('\n').map(x=>x.trim()).filter(Boolean),made:$('made').value,checked:$('checked').value,note:$('note').value,perpage:+$('perpage').value};}
function render(){let s=getSettings();filtered=allData.filter(x=>x.date===s.date&&(s.shift==='ALL'||x.shift===s.shift));filtered.sort((a,b)=>(a.time||'').localeCompare(b.time||''));let pages=Math.max(1,Math.ceil(filtered.length/s.perpage));page=Math.min(page,pages-1);$('stats').innerHTML=`<b>${filtered.length}</b> transaksi ditemukan<br>Total netto: <b>${money(filtered.reduce((a,x)=>a+x.net,0))} kg</b> (${(filtered.reduce((a,x)=>a+x.net,0)/1000).toLocaleString('id-ID',{maximumFractionDigits:3})} ton)`;$('count').textContent=`${filtered.length} transaksi`;$('pageinfo').textContent=`Halaman ${page+1} dari ${pages}`;$('prev').disabled=page===0;$('next').disabled=page>=pages-1;draw(s);}
function draw(s){const c=$('report'),ctx=c.getContext('2d');let W=c.width,H=c.height;ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.fillStyle='#111';ctx.strokeStyle='#333';ctx.lineWidth=1.5;
const text=(v,x,y,size=15,bold=false,align='center')=>{ctx.font=`${bold?'bold ':''}${size}px Arial`;ctx.textAlign=align;ctx.fillStyle='#111';ctx.fillText(String(v??''),x,y);};
const line=(x1,y1,x2,y2)=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};
const rect=(x,y,w,h)=>ctx.strokeRect(x,y,w,h);
const x0=70, tableW=790, rightX=880, rightW=650;
 // Logo mark, geometric monogram
ctx.save();ctx.translate(130,95);ctx.lineWidth=5;let pts=[[0,28],[35,0],[70,28],[105,0],[140,28],[140,92],[105,120],[105,56],[70,84],[70,28],[35,56],[35,120],[0,92],[0,28]];ctx.beginPath();ctx.moveTo(...pts[0]);for(let p of pts.slice(1))ctx.lineTo(...p);ctx.stroke();line(0,92,70,28);line(35,0,35,56);line(70,84,105,56);line(105,0,105,56);ctx.restore();
text('MAHAGUNA',210,225,38,true);text('PERUSAHAAN ASAL BATU BARA',210,252,16,false);
 // personnel sign block
let sx=390,sy=38,sw=335,sh=28;rect(sx,sy,sw,sh*6);line(sx+145,sy,sx+145,sy+sh*6);line(sx+245,sy,sx+245,sy+sh*6);
text('NAMA PERSONEL',sx+72,sy+19,13,true);text('TANDA TANGAN',sx+195,sy+19,13,true);text('KETERANGAN',sx+290,sy+19,13,true);
s.staff.slice(0,5).forEach((n,i)=>{line(sx,sy+sh*(i+1),sx+sw,sy+sh*(i+1));text(n,sx+72,sy+sh*(i+1)+19,14,true);});
text(s.weather,sx+290,sy+105,15,true);
 // date / shift strip
rect(x0,268,790,32);line(x0+350,268,x0+350,300);line(x0+520,268,x0+520,300);
text('HARI',x0+175,280,12,true);text(dayFmt(s.date),x0+175,294,14,true);
text('TANGGAL',x0+435,280,12,true);text(dateFmt(s.date),x0+435,294,14,true);
text('SHIFT KERJA',x0+655,280,12,true);text(s.shift==='ALL'?'SEMUA':s.shift,x0+655,294,14,true);
 // Instructions panel
let iy=60;rect(rightX,iy,rightW,205);
['PERHATIAN ANGKA TIMBANGAN DENGAN BAIK','CATAT HASIL TIMBANGAN DENGAN RAPI','JUMLAHKAN HASIL TIMBANGAN DENGAN TELITI','KOLOM TOTAL PENIMBANGAN HARUS DIISI','DAN TIDAK BOLEH MEMBUAT CATATAN YANG TIDAK','PERLU PADA FORM PENCATATAN TIMBANGAN'].forEach((v,i)=>text(v,rightX+rightW/2,iy+22+i*25,14));
line(rightX,iy+160,rightX+rightW,iy+160);text('JIKA ADA PERMASALAHAN DILAPANGAN INFORMASIKAN KEPADA',rightX+rightW/2,iy+180,13);text('PENANGGUNG JAWAB / PENGAWAS',rightX+rightW/2,iy+198,13);
 // Main table
let ty=320, rowH=27, headH=55;let cols=[x0,x0+42,x0+195,x0+300,x0+420,x0+540,x0+690,x0+790];
rect(x0,ty,790,headH+rowH*s.perpage);for(let x of cols.slice(1,-1))line(x,ty,x,ty+headH+rowH*s.perpage);
line(x0,ty+headH,x0+790,ty+headH);line(x0+195,ty+28,x0+690,ty+28);
text('NO',x0+21,ty+34,14,true);text('NO. DUMPTRUCK',x0+118,ty+34,14,true);text('PENIMBANGAN',x0+442,ty+18,14,true);
text('BRUTO',x0+247,ty+47,13,true);text('TARRA',x0+360,ty+47,13,true);text('NETTO',x0+480,ty+47,13,true);text('KETERANGAN',x0+740,ty+34,13,true);
let start=page*s.perpage, pageRows=filtered.slice(start,start+s.perpage);
pageRows.forEach((r,i)=>{let y=ty+headH+rowH*i;line(x0,y+rowH,x0+790,y+rowH);text(start+i+1,x0+21,y+18,13);text(r.unit,x0+118,y+18,13);text(money(r.gross),x0+290,y+18,13);text(money(r.tare),x0+410,y+18,13);text(money(r.net),x0+535,y+18,13);text(s.note,x0+740,y+18,13);});
 // Right total table
let by=ty+40;rect(rightX,by,rightW,156);line(rightX,by+30,rightX+rightW,by+30);line(rightX,by+60,rightX+rightW,by+60);line(rightX,by+90,rightX+rightW,by+90);line(rightX,by+120,rightX+rightW,by+120);line(rightX+rightW/3,by+30,rightX+rightW/3,by+90);line(rightX+2*rightW/3,by+30,rightX+2*rightW/3,by+90);
text('TOTAL PENIMBANGAN',rightX+rightW/2,by+20,14,true);text('BRUTO (KG)',rightX+rightW/6,by+50,13,true);text('TARRA (KG)',rightX+rightW/2,by+50,13,true);text('NETTO (KG)',rightX+5*rightW/6,by+50,13,true);
text(money(pageRows.reduce((a,x)=>a+x.gross,0)),rightX+rightW/6,by+80,14);text(money(pageRows.reduce((a,x)=>a+x.tare,0)),rightX+rightW/2,by+80,14);text(money(pageRows.reduce((a,x)=>a+x.net,0)),rightX+5*rightW/6,by+80,14);
text('PERUSAHAAN',rightX+rightW/6,by+110,13,true);text(s.company,rightX+rightW/2+rightW/6,by+110,14,true);text('CHECKER',rightX+rightW/6,by+140,13,true);text(s.checker,rightX+rightW/2+rightW/6,by+140,14,true);
 // approval
let ay=by+260;rect(rightX,ay,rightW,150);line(rightX,ay+28,rightX+rightW,ay+28);line(rightX+rightW/2,ay+28,rightX+rightW/2,ay+150);line(rightX,ay+120,rightX+rightW,ay+120);
text('PERSETUJUAN',rightX+rightW/2,ay+19,14,true);text('DIBUAT OLEH',rightX+rightW/4,ay+48,13,true);text('DIPERIKSA OLEH',rightX+3*rightW/4,ay+48,13,true);text(s.made,rightX+rightW/4,ay+140,13,true);text(s.checked,rightX+3*rightW/4,ay+140,13,true);
text(`Halaman ${page+1}/${Math.max(1,Math.ceil(filtered.length/s.perpage))}`,W-80,H-30,12,false);
}
['date','shift','weather','company','checker','staff','made','checked','note','perpage'].forEach(id=>$(id).addEventListener('change',()=>{page=0;render()}));
$('refresh').onclick=()=>render();$('prev').onclick=()=>{page=Math.max(0,page-1);render()};$('next').onclick=()=>{page++;render()};
$('reset').onclick=()=>{if(!confirm('Kembalikan pengaturan awal?'))return;$('weather').value='CERAH';$('company').value='PT. KPB';$('checker').value='CAPLIN.E';$('staff').value='CAPLIN.E\nASRANI\nYugo P\nA Syafril';$('made').value='M.FARIZAL';$('checked').value='VIKTOR.Z.P';$('note').value='BSSR';render()};
$('export').onclick=()=>{let c=$('report');c.toBlob(blob=>{let a=document.createElement('a');let s=getSettings();a.href=URL.createObjectURL(blob);a.download=`Mahaguna_${s.date}_${s.shift}_Hal-${page+1}.jpg`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)},'image/jpeg',.95)};
$('file').addEventListener('change',async e=>{let f=e.target.files[0];if(!f)return;try{if(!window.XLSX){await new Promise((ok,no)=>{let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)})}let buf=await f.arrayBuffer(),book=XLSX.read(buf,{type:'array',cellDates:true}),sheet=book.Sheets[book.SheetNames[0]],arr=XLSX.utils.sheet_to_json(sheet,{defval:''});allData=arr.map(r=>{let d=r['TANGGAL ID'],t=r['WAKTU MASUK'];let date=d instanceof Date?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:String(d).slice(0,10);let time=t instanceof Date?`${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}:${String(t.getSeconds()).padStart(2,'0')}`:String(t);return{id:r['TRANS. ID'],unit:String(r['NO DT']),company:String(r['PERUSAHAAN']),product:String(r['PRODUK']),partner:String(r['PARTNERS']),date,time,gross:+r.GROSS||0,tare:+r.TARE||0,net:+r.NETTO||0,shift:String(r.SHIFT),scale:String(r.TIMBANGAN)}});let ds=[...new Set(allData.map(x=>x.date))].sort();if(ds.length)$('date').value=ds[ds.length-1];page=0;render();alert(`Berhasil membaca ${allData.length} transaksi.`)}catch(err){alert('Gagal membaca Excel. Pastikan kolom mengikuti template Data_Updatemki.xlsx. '+err.message)}});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
init();