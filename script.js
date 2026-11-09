// EDIT THESE DETAILS BEFORE PUBLISHING
const STUDIO = {
  name: "Everlight Studio",
  tagline: "Photography & Films",
  phone: "919876543210", // country code + number, digits only
  email: "hello@everlightstudio.in",
  city: "Surat, Gujarat",
  currency: "INR"
};
// Sample starting prices only. Replace with your friend's actual rates.
const PACKAGES = [
 {id:"essential",name:"Essential Moments",desc:"One photographer · up to 4 hours · edited digital photos",price:18000},
 {id:"signature",name:"Signature Story",desc:"Photo + video team · up to 8 hours · highlight film",price:42000},
 {id:"premium",name:"The Heirloom",desc:"Two photographers · cinematography · teaser + feature film",price:75000},
 {id:"custom",name:"Custom Coverage",desc:"Build a tailored scope after discussing requirements",price:0}
];
const ADDONS = [
 {id:"drone",name:"Drone coverage",price:8000},{id:"album",name:"Premium photo album",price:12000},
 {id:"reels",name:"Social media reels (3)",price:5000},{id:"extra",name:"Additional coverage hour",price:4000},
 {id:"second",name:"Additional photographer",price:9000},{id:"raw",name:"Raw footage delivery",price:6000}
];
const money=n=>"₹ "+Number(n).toLocaleString("en-IN");
let selectedPackage = PACKAGES[0].id;
const selectedAddons = new Set();
const packageList=document.getElementById("packageList"), addonList=document.getElementById("addonList");
document.getElementById("brandName").textContent=STUDIO.name.toUpperCase();
document.querySelectorAll(".brand b").forEach(x=>x.textContent=STUDIO.name.toUpperCase());
document.querySelectorAll(".brand small").forEach(x=>x.textContent=STUDIO.tagline.toUpperCase());
document.getElementById("whatsappLink").href=`https://wa.me/${STUDIO.phone}`;
document.getElementById("year").textContent=new Date().getFullYear();
PACKAGES.forEach(p=>{const el=document.createElement("label");el.className="package-option"+(p.id===selectedPackage?" active":"");el.innerHTML=`<span><strong>${p.name}</strong><small>${p.desc}</small></span><span style="display:flex;align-items:center;gap:10px"><b class="price">${p.price?money(p.price):"Discuss"}</b><input type="radio" name="package" value="${p.id}" ${p.id===selectedPackage?"checked":""}></span>`;el.addEventListener("click",()=>{selectedPackage=p.id;renderPackages();updateTotal()});packageList.appendChild(el)});
function renderPackages(){[...packageList.children].forEach((el,i)=>{el.classList.toggle("active",PACKAGES[i].id===selectedPackage);el.querySelector("input").checked=PACKAGES[i].id===selectedPackage})}
ADDONS.forEach(a=>{const el=document.createElement("div");el.className="addon";el.innerHTML=`<label><input type="checkbox" value="${a.id}"><span>${a.name}</span></label><b>${money(a.price)}</b>`;el.querySelector("input").addEventListener("change",e=>{e.target.checked?selectedAddons.add(a.id):selectedAddons.delete(a.id);updateTotal()});addonList.appendChild(el)});
function updateTotal(){const p=PACKAGES.find(x=>x.id===selectedPackage);const add=ADDONS.filter(x=>selectedAddons.has(x.id)).reduce((s,x)=>s+x.price,0);const total=p.price+add;document.getElementById("total").textContent=money(total);document.getElementById("summary").textContent=`${p.name} + ${selectedAddons.size} add-on(s)`;return {p,add,total}}
function val(id){return document.getElementById(id).value.trim()}
document.getElementById("pdfBtn").addEventListener("click",()=>{
 const client=val("client");if(!client){alert("Please enter the client name first.");document.getElementById("client").focus();return}
 if(!window.jspdf){alert("PDF library could not load. Check your internet connection and try again.");return}
 const {jsPDF}=window.jspdf,doc=new jsPDF(),{p,add,total}=updateTotal();
 const gold=[158,125,79],ink=[38,39,34],muted=[112,110,103],line=[224,219,209];
 doc.setFillColor(...ink);doc.rect(0,0,210,48,"F");doc.setTextColor(255,255,255);doc.setFont("times","bold");doc.setFontSize(25);doc.text(STUDIO.name,18,22);doc.setFont("helvetica","normal");doc.setFontSize(9);doc.text(STUDIO.tagline.toUpperCase(),18,30);doc.setTextColor(220,202,174);doc.text("PHOTOGRAPHY PROPOSAL",192,22,{align:"right"});
 doc.setTextColor(...gold);doc.setFontSize(9);doc.text("PREPARED FOR",18,63);doc.setTextColor(...ink);doc.setFont("times","bold");doc.setFontSize(20);doc.text(client,18,73);
 doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor(...muted);let y=83;
 const meta=[["EVENT",val("event")],["DATE",val("date")||"To be confirmed"],["VENUE",val("venue")||"To be confirmed"],["PHONE",val("phone")||"—"],["EMAIL",val("email")||"—"]];
 meta.forEach((m,i)=>{let x=i%2===0?18:110, yy=y+Math.floor(i/2)*17;doc.setTextColor(...gold);doc.text(m[0],x,yy);doc.setTextColor(...ink);doc.text(String(m[1]).slice(0,42),x,yy+6)});
 y=132;doc.setDrawColor(...line);doc.line(18,y,192,y);y+=12;doc.setTextColor(...gold);doc.setFontSize(9);doc.text("YOUR SELECTED COVERAGE",18,y);y+=10;
 doc.setTextColor(...ink);doc.setFont("times","bold");doc.setFontSize(15);doc.text(p.name,18,y);y+=7;doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor(...muted);let desc=doc.splitTextToSize(p.desc,170);doc.text(desc,18,y);y+=desc.length*5+10;
 const rows=[["Coverage package",p.price?money(p.price):"To be discussed"],...ADDONS.filter(a=>selectedAddons.has(a.id)).map(a=>[a.name,money(a.price)])];
 rows.forEach(r=>{doc.setDrawColor(...line);doc.line(18,y,192,y);y+=8;doc.setTextColor(...ink);doc.text(r[0],18,y);doc.text(r[1],192,y,{align:"right"});y+=8});
 doc.setFillColor(242,238,230);doc.rect(18,y,174,20,"F");doc.setTextColor(...gold);doc.setFontSize(9);doc.text("ESTIMATED TOTAL",24,y+8);doc.setTextColor(...ink);doc.setFont("times","bold");doc.setFontSize(18);doc.text(total?money(total):"To be discussed",186,y+13,{align:"right"});y+=31;
 if(val("notes")){doc.setTextColor(...gold);doc.setFont("helvetica","bold");doc.setFontSize(9);doc.text("SPECIAL NOTES",18,y);y+=6;doc.setTextColor(...muted);doc.setFont("helvetica","normal");doc.text(doc.splitTextToSize(val("notes"),170),18,y);y+=18}
 y=Math.min(y,250);doc.setDrawColor(...line);doc.line(18,270,192,270);doc.setTextColor(...muted);doc.setFontSize(8);doc.text("This proposal is an estimate and is subject to date availability and final written agreement.",18,278);doc.text(`${STUDIO.name} · ${STUDIO.city} · ${STUDIO.email}`,18,284);
 doc.save(`${STUDIO.name.replace(/\s+/g,"-")}-quotation-${client.replace(/\s+/g,"-")}.pdf`);
});
document.getElementById("menuBtn").addEventListener("click",()=>document.querySelector(".topbar").classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".topbar").classList.remove("open")));
