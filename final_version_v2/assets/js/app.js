const KEY="rubaSriV2";
const seed={orders:[],customers:[],measurements:[],portfolio:[
 {id:1,title:"Designer Blouse",caption:"Portfolio sample — replace with real photo."},
 {id:2,title:"Bridal Blouse",caption:"Portfolio sample — replace with real photo."},
 {id:3,title:"Custom Stitching",caption:"Portfolio sample — replace with real photo."},
 {id:4,title:"Aari / Embroidery",caption:"Portfolio sample — replace with real photo."},
 {id:5,title:"Festive Wear",caption:"Portfolio sample — replace with real photo."},
 {id:6,title:"Alteration",caption:"Portfolio sample — replace with real photo."}
]};
let db=JSON.parse(localStorage.getItem(KEY)||"null")||seed;
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
const services=[
["✦","Designer Blouses","Custom necks, sleeves, fitting and finishing."],
["♢","Bridal Blouses","Bridal stitching with detailed design discussion."],
["✂","Ladies Tailoring","Kurtis, chudidars, gowns, dresses and ethnic wear."],
["✧","Aari & Embroidery","Custom embellishment and decorative work."],
["↔","Alterations","Fitting adjustments for existing outfits."],
["♡","Custom Design","Bring a reference image and customise it."]
];
function renderServices(){
 const g=document.querySelector("#servicesGrid"),s=document.querySelector("#serviceSelect");
 g.innerHTML="";s.innerHTML="";
 services.forEach((x,i)=>{g.innerHTML+=`<article class="card"><div class="icon">${x[0]}</div><h3>${x[1]}</h3><p>${x[2]}</p><button class="linkbtn" onclick="chooseService(${i})">Enquire →</button></article>`;s.innerHTML+=`<option>${x[1]}</option>`});
}
function renderPortfolio(){
 const g=document.querySelector("#galleryGrid");g.innerHTML="";
 db.portfolio.forEach((x,i)=>g.innerHTML+=`<article class="work"><div class="workart"><span>RS</span></div><div><b>${x.title}</b><small>${x.caption}</small></div></article>`);
}
function chooseService(i){document.querySelector("#serviceSelect").value=services[i][1];location.hash="booking"}
function wa(message){return "https://wa.me/"+RUBA_CONFIG.whatsapp+"?text="+encodeURIComponent(message)}
function generalWA(){return wa(`Hi ${RUBA_CONFIG.businessName}, I would like to enquire about custom tailoring.`)}
document.querySelector("#waHero").href=generalWA();document.querySelector("#waCta").href=generalWA();
document.querySelector("#year").textContent=new Date().getFullYear();

document.querySelector("#bookingForm").addEventListener("submit",e=>{
 e.preventDefault();const f=new FormData(e.target);
 const phone=f.get("phone").replace(/\D/g,"");
 const id="RS"+(1001+db.orders.length);
 const order={id,name:f.get("name"),phone,service:f.get("service"),date:f.get("date"),details:f.get("details"),status:"Enquiry",created:new Date().toISOString(),advance:0,total:0};
 db.orders.unshift(order);
 if(!db.customers.some(c=>c.phone===phone))db.customers.push({id:"C"+Date.now(),name:order.name,phone,created:order.created});
 save();toast("Enquiry saved • opening WhatsApp");
 const msg=`Hi ${RUBA_CONFIG.businessName}, I have a tailoring enquiry.\n\nOrder ID: ${id}\nName: ${order.name}\nPhone: ${order.phone}\nService: ${order.service}\nNeeded by: ${order.date||"Not specified"}\nDetails: ${order.details}\n\nI will send the reference image here if needed.`;
 window.open(wa(msg),"_blank");e.target.reset();
});
function toast(t){const x=document.querySelector("#toast");x.textContent=t;x.className="show";setTimeout(()=>x.className="",2500)}
function trackOrder(){
 const id=document.querySelector("#trackId").value.trim().toUpperCase(),o=db.orders.find(x=>x.id===id),r=document.querySelector("#trackResult");
 if(!o){r.innerHTML='<div class="notice">Order not found. Please check the ID.</div>';return}
 const steps=["Enquiry","Confirmed","In Stitching","Ready","Completed"],n=steps.indexOf(o.status);
 r.innerHTML=`<div class="ordercard"><div><b>${o.id}</b><span>${o.service}</span></div><h3>${o.name}</h3><div class="progress">${steps.map((s,i)=>`<div class="${i<=n?'done':''}"><i>${i<=n?'✓':i+1}</i><small>${s}</small></div>`).join("")}</div><p>${o.date?"Needed by: "+o.date:"Date to be confirmed"} ${o.total?" • Total: ₹"+o.total:""}</p></div>`;
}
function openAdmin(){document.querySelector("#adminModal").classList.remove("hidden");renderAdmin("dashboard")}
function closeAdmin(){document.querySelector("#adminModal").classList.add("hidden")}
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderAdmin(b.dataset.tab)})
function renderAdmin(tab){
 const c=document.querySelector("#adminContent");
 if(tab==="dashboard"){const pending=db.orders.filter(o=>o.status!=="Completed").length,rev=db.orders.reduce((a,o)=>a+Number(o.total||0),0);c.innerHTML=`<div class="stats"><div><b>${db.orders.length}</b><span>Total orders</span></div><div><b>${pending}</b><span>Active orders</span></div><div><b>${db.customers.length}</b><span>Customers</span></div><div><b>₹${rev}</b><span>Recorded sales</span></div></div><div class="adminhint">Tip: use Orders to update status, total and advance. Use Backup to export your browser data.</div>`}
 if(tab==="orders")renderOrders(c);
 if(tab==="customers")c.innerHTML=`<div class="table"><div class="tr th"><span>Name</span><span>Phone</span><span>Orders</span></div>${db.customers.map(x=>`<div class="tr"><span>${x.name}</span><span>${x.phone}</span><span>${db.orders.filter(o=>o.phone===x.phone).length}</span></div>`).join("")||"<p>No customers yet.</p>"}</div>`;
 if(tab==="measurements")renderMeasurements(c);
 if(tab==="backup")c.innerHTML=`<div class="backup"><p>Export your current browser data before changing devices.</p><button class="btn primary" onclick="exportData()">Export JSON</button><label class="uploadbtn">Import JSON<input type="file" accept=".json" onchange="importData(event)"></label><button class="btn danger" onclick="resetDemo()">Reset demo data</button></div>`;
}
function renderOrders(c){
 c.innerHTML=`<div class="table"><div class="tr th"><span>Order</span><span>Customer</span><span>Status</span><span>Total</span><span>Action</span></div>${db.orders.map(o=>`<div class="tr"><span><b>${o.id}</b><small>${o.service}</small></span><span>${o.name}<small>${o.phone}</small></span><span><select onchange="updateOrder('${o.id}','status',this.value)">${["Enquiry","Confirmed","In Stitching","Ready","Completed"].map(s=>`<option ${s===o.status?"selected":""}>${s}</option>`).join("")}</select></span><span><input class="money" value="${o.total||""}" placeholder="₹" onchange="updateOrder('${o.id}','total',this.value)"></span><span><button class="tiny" onclick="messageCustomer('${o.id}')">WA</button><button class="tiny danger" onclick="deleteOrder('${o.id}')">Delete</button></span></div>`).join("")||"<p>No orders yet.</p>"}</div>`;
}
function updateOrder(id,k,v){const o=db.orders.find(x=>x.id===id);if(o){o[k]=k==="total"?Number(v)||0:v;save();toast("Order updated")}}
function deleteOrder(id){db.orders=db.orders.filter(x=>x.id!==id);save();renderAdmin("orders");toast("Order deleted")}
function messageCustomer(id){const o=db.orders.find(x=>x.id===id);window.open(wa(`Hi ${o.name}, update from ${RUBA_CONFIG.businessName}. Your order ${o.id} is currently: ${o.status}.`),"_blank")}
function renderMeasurements(c){c.innerHTML=`<div class="measure"><p>Store customer measurements here in the production version.</p><form onsubmit="addMeasurement(event)"><div class="row"><input name="customer" required placeholder="Customer name"><input name="phone" required placeholder="Phone"></div><div class="row"><input name="bust" placeholder="Bust"><input name="waist" placeholder="Waist"></div><div class="row"><input name="shoulder" placeholder="Shoulder"><input name="sleeve" placeholder="Sleeve"></div><button class="btn primary">Save measurement</button></form><div class="table">${db.measurements.map(m=>`<div class="tr"><span><b>${m.customer}</b><small>${m.phone}</small></span><span>Bust ${m.bust||"-"} • Waist ${m.waist||"-"} • Shoulder ${m.shoulder||"-"} • Sleeve ${m.sleeve||"-"}</span></div>`).join("")}</div></div>`}
function addMeasurement(e){e.preventDefault();const f=new FormData(e.target);db.measurements.unshift(Object.fromEntries(f));save();renderAdmin("measurements");toast("Measurement saved")}
function exportData(){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(db,null,2)],{type:"application/json"}));a.download="ruba-sri-backup.json";a.click()}
function importData(e){const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{db=JSON.parse(r.result);save();renderPortfolio();renderAdmin("dashboard");toast("Backup imported")}catch{toast("Invalid JSON")}};r.readAsText(file)}
function resetDemo(){if(confirm("Reset all browser data?")){db=seed;save();renderPortfolio();renderAdmin("dashboard");toast("Reset complete")}}
renderServices();renderPortfolio();
document.querySelector("#hamb").onclick=()=>document.querySelector("#nav").classList.toggle("open");
