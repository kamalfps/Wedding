/* MOVINCAM.ART — QUOTATION BUILDER */

const STUDIO = {
  name: "MOVINCAM.ART",
  tagline: "PHOTOGRAPHY · FILMS · STORIES",
  phone: "919876543210",
  email: "hello@movincam.art",
  city: "Surat, Gujarat",
  currency: "INR"
};

// DEFAULT PRICE LIST
// Change these prices whenever your standard rates change.
// Individual quotations have their own separate prices.

const PRICE_LIST = [
  ["Wedding photography coverage", 25000],
  ["Wedding cinematography", 30000],
  ["Candid photographer", 18000],
  ["Pre-wedding shoot", 20000],
  ["Engagement coverage", 15000],
  ["Baby shower coverage", 12000],
  ["Maternity photoshoot", 10000],
  ["Birthday event coverage", 10000],
  ["Drone coverage", 8000],
  ["Premium photo album", 12000],
  ["Cinematic highlight film", 15000],
  ["Social media reels (3)", 5000],
  ["Additional photographer", 9000],
  ["Additional coverage hour", 4000],
  ["Travel / accommodation", 0]
];

const $ = id => document.getElementById(id);

const fmt = n =>
  "₹" + Number(n || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2
  });

let rows = [];
let editingId = null;

function uid() {
  return "q" + Date.now().toString(36) +
    Math.random().toString(36).slice(2, 6);
}

// ADD A NEW QUOTATION ITEM

function addRow(
  desc = "Custom photography service",
  qty = 1,
  price = 0
) {
  rows.push({
    id: uid(),
    desc,
    qty,
    price
  });

  renderRows();
}

// DISPLAY QUOTATION ITEMS

function renderRows() {
  $("items").innerHTML = "";

  rows.forEach(r => {
    const el = document.createElement("div");

    el.className = "itemrow";

    el.innerHTML = `
      <input aria-label="Description"
        class="desc" value="${esc(r.desc)}">

      <input aria-label="Quantity"
        class="qty" type="number"
        min="0" step="0.1" value="${r.qty}">

      <input aria-label="Unit price"
        class="price" type="number"
        min="0" step="0.01" value="${r.price}">

      <span class="amount">
        ${fmt(r.qty * r.price)}
      </span>

      <button class="remove" title="Remove item">×</button>
    `;

    const [d, q, p] = el.querySelectorAll("input");

    d.addEventListener("input", () => {
      r.desc = d.value;
    });

    [q, p].forEach(inp => {
      inp.addEventListener("input", () => {

        r.qty = Math.max(0, Number(q.value) || 0);
        r.price = Math.max(0, Number(p.value) || 0);

        el.querySelector(".amount").textContent =
          fmt(r.qty * r.price);

        calc();
      });
    });

    el.querySelector(".remove").onclick = () => {
      rows = rows.filter(x => x.id !== r.id);
      renderRows();
    };

    $("items").appendChild(el);
  });

  calc();
}

// SAFELY DISPLAY CLIENT TEXT

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

// CALCULATE QUOTATION

function calc() {

  const subtotal = rows.reduce(
    (s, r) => s + r.qty * r.price, 0
  );

  const discount = Math.max(
    0, Number($("discount").value) || 0
  );

  const taxRate = Math.max(
    0, Number($("tax").value) || 0
  );

  const base = Math.max(0, subtotal - discount);

  const tax = base * taxRate / 100;

  const total = base + tax;

  const advance = Math.max(
    0, Number($("advance").value) || 0
  );

  const balance = Math.max(0, total - advance);

  $("subtotal").textContent = fmt(subtotal);

  $("discountView").textContent = "− " + fmt(discount);

  $("taxView").textContent = fmt(tax);

  $("grand").textContent = fmt(total);

  $("balance").textContent = fmt(balance);

  return {
    subtotal,
    discount,
    taxRate,
    tax,
    total,
    advance,
    balance
  };
}

// COLLECT CLIENT INFORMATION

function details() {

  return {
    client: $("client").value.trim(),
    phone: $("phone").value.trim(),
    email: $("email").value.trim(),

    event: $("event").value,
    date: $("date").value,
    venue: $("venue").value.trim(),

    notes: $("notes").value.trim(),

    discount: Number($("discount").value) || 0,
    tax: Number($("tax").value) || 0,
    advance: Number($("advance").value) || 0,

    rows: rows.map(r => ({ ...r })),

    id: editingId || uid(),

    updated: new Date().toISOString()
  };
}

// LOAD AN EXISTING QUOTATION

function setDetails(d) {

  $("client").value = d.client || "";
  $("phone").value = d.phone || "";
  $("email").value = d.email || "";

  $("event").value = d.event || "Wedding";
  $("date").value = d.date || "";
  $("venue").value = d.venue || "";

  $("notes").value = d.notes || "";

  $("discount").value = d.discount || 0;
  $("tax").value = d.tax || 0;
  $("advance").value = d.advance || 0;

  rows = (d.rows || []).map(r => ({
    ...r,
    id: r.id || uid()
  }));

  editingId = d.id || null;

  renderRows();
}

// READ SAVED QUOTATIONS

function drafts() {

  try {
    return JSON.parse(
      localStorage.getItem("movincam_quotes") || "[]"
    );
  } catch {
    return [];
  }
}

// SAVE OR UPDATE A QUOTATION

function storeDraft(d) {

  let all = drafts();

  const i = all.findIndex(x => x.id === d.id);

  if (i >= 0) {
    all[i] = d;
  } else {
    all.unshift(d);
  }

  localStorage.setItem(
    "movincam_quotes",
    JSON.stringify(all)
  );

  renderSaved();
}

// DISPLAY SAVED QUOTATIONS

function renderSaved() {

  $("savedList").innerHTML = "";

  const all = drafts();

  if (!all.length) {
    $("savedList").innerHTML =
      '<p class="hint">No saved quotations yet.</p>';
    return;
  }

  all.forEach(d => {

    const el = document.createElement("div");

    el.className = "saveditem";

    const sum = (d.rows || []).reduce(
      (s, r) => s + r.qty * r.price, 0
    );

    el.innerHTML = `
      <div>
        <b>${esc(d.client || "Unnamed client")}</b>
        <br>
        <span>
          ${esc(d.event || "Event")} ·
          ${new Date(d.updated).toLocaleDateString("en-IN")} ·
          ${fmt(sum)}
        </span>
      </div>

      <div>
        <button class="smallbtn load">Open</button>
        <button class="smallbtn del">Delete</button>
      </div>
    `;

    el.querySelector(".load").onclick = () => {
      setDetails(d);
    };

    el.querySelector(".del").onclick = () => {

      if (confirm("Delete this saved quotation?")) {

        localStorage.setItem(
          "movincam_quotes",
          JSON.stringify(
            drafts().filter(x => x.id !== d.id)
          )
        );

        renderSaved();
      }
    };

    $("savedList").appendChild(el);
  });
}

// LOAD DEFAULT PRICE LIST

PRICE_LIST.forEach((x, i) => {

  const o = document.createElement("option");

  o.value = i;

  o.textContent = `${x[0]} — ${fmt(x[1])}`;

  $("catalog").appendChild(o);
});

// ADD SELECTED PRICE LIST ITEM

function addCatalog() {

  const idx = Number($("catalog").value);

  if (!$("catalog").value) return;

  const [name, price] = PRICE_LIST[idx];

  addRow(name, 1, price);

  $("catalog").value = "";
}

$("addLine").onclick = () => addRow();

$("addCatalog").onclick = addCatalog;

// UPDATE TOTALS WHEN DISCOUNT OR TAX CHANGES

["discount", "tax", "advance"].forEach(id => {

  $(id).addEventListener("input", calc);

});

// SAVE CURRENT QUOTATION

$("saveDraft").onclick = () => {

  if (!$("client").value.trim()) {

    alert("Please enter the client name before saving.");

    $("client").focus();

    return;
  }

  const d = details();

  storeDraft(d);

  editingId = d.id;

  alert("Quotation saved in this browser.");
};

// START NEW QUOTATION

$("newQuote").onclick = () => {

  if (confirm(
    "Start a new quotation? Save your current changes first if needed."
  )) {

    setDetails({
      rows: [{
        desc: "Wedding photography coverage",
        qty: 1,
        price: 25000
      }]
    });
  }
};

// EXPORT SAVED QUOTATIONS

function download(blob, name) {

  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);

  a.download = name;

  a.click();

  URL.revokeObjectURL(a.href);
}

$("exportData").onclick = () => {

  const blob = new Blob(
    [JSON.stringify(drafts(), null, 2)],
    { type: "application/json" }
  );

  download(blob, "movincam-saved-quotations.json");
};

// IMPORT SAVED QUOTATIONS

$("importData").onchange = async e => {

  const f = e.target.files[0];

  if (!f) return;

  try {

    const incoming = JSON.parse(await f.text());

    if (!Array.isArray(incoming)) throw Error();

    const merged = [...incoming, ...drafts()];

    const unique = [
      ...new Map(merged.map(x => [x.id, x])).values()
    ];

    localStorage.setItem(
      "movincam_quotes",
      JSON.stringify(unique)
    );

    renderSaved();

    alert("Drafts imported.");

  } catch {

    alert("That JSON file is not a valid quotation backup.");

  }

  e.target.value = "";
};

// GENERATE PDF QUOTATION

$("makePdf").onclick = () => {

  const d = details();

  if (!d.client) {

    alert("Please enter the client's name.");

    $("client").focus();

    return;
  }

  if (!window.jspdf) {

    alert("PDF generator did not load. Check internet and reload.");

    return;
  }

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  const t = calc();

  const gold = [155, 120, 73];

  const ink = [38, 39, 34];

  const muted = [112, 110, 103];

  const line = [224, 219, 209];

  // HEADER

  doc.setFillColor(...ink);

  doc.rect(0, 0, 210, 47, "F");

  doc.setTextColor(255, 255, 255);

  doc.setFont("times", "bold");

  doc.setFontSize(24);

  doc.text(STUDIO.name, 18, 21);

  doc.setFont("helvetica", "normal");

  doc.setFontSize(8);

  doc.text(STUDIO.tagline, 18, 29);

  doc.setTextColor(220, 202, 174);

  doc.text(
    "PHOTOGRAPHY PROPOSAL",
    192,
    21,
    { align: "right" }
  );

  // CLIENT INFORMATION

  doc.setTextColor(...gold);

  doc.setFontSize(8);

  doc.text("PREPARED FOR", 18, 61);

  doc.setTextColor(...ink);

  doc.setFont("times", "bold");

  doc.setFontSize(20);

  doc.text(d.client, 18, 71);

  doc.setFont("helvetica", "normal");

  doc.setFontSize(9);

  const meta = [
    ["EVENT", d.event],
    ["DATE", d.date || "To be confirmed"],
    ["VENUE", d.venue || "To be confirmed"],
    ["PHONE", d.phone || "—"],
    ["EMAIL", d.email || "—"]
  ];

  meta.forEach((m, i) => {

    let x = i % 2 ? 110 : 18;

    let y = 84 + Math.floor(i / 2) * 15;

    doc.setTextColor(...gold);

    doc.text(m[0], x, y);

    doc.setTextColor(...muted);

    doc.text(String(m[1]).slice(0, 45), x, y + 6);

  });

  // SERVICE TABLE

  let y = 132;

  doc.setDrawColor(...line);

  doc.line(18, y, 192, y);

  y += 10;

  doc.setTextColor(...gold);

  doc.text("CUSTOMISED SERVICES & DELIVERABLES", 18, y);

  y += 9;

  doc.setFont("helvetica", "bold");

  doc.setFontSize(8);

  doc.setTextColor(...muted);

  doc.text("DESCRIPTION", 18, y);

  doc.text("QTY", 132, y, { align: "right" });

  doc.text("UNIT PRICE", 160, y, { align: "right" });

  doc.text("AMOUNT", 192, y, { align: "right" });

  y += 5;

  doc.setFont("helvetica", "normal");

  doc.setFontSize(8.5);

  d.rows.forEach(r => {

    if (y > 245) {

      doc.addPage();

      y = 25;
    }

    doc.setDrawColor(...line);

    doc.line(18, y, 192, y);

    y += 7;

    doc.setTextColor(...ink);

    const desc = doc.splitTextToSize(
      r.desc || "Service",
      88
    );

    doc.text(desc, 18, y);

    doc.text(String(r.qty), 132, y, { align: "right" });

    doc.text(fmt(r.price), 160, y, { align: "right" });

    doc.text(
      fmt(r.qty * r.price),
      192,
      y,
      { align: "right" }
    );

    y += Math.max(8, desc.length * 4.5);

  });

  // TOTALS

  y += 4;

  const totals = [
    ["Subtotal", t.subtotal],
    ["Discount", -t.discount],
    [`Tax (${t.taxRate}%)`, t.tax],
    ["GRAND TOTAL", t.total],
    ["Advance requested", -t.advance],
    ["BALANCE DUE", t.balance]
  ];

  totals.forEach((r, i) => {

    if (y > 258) {

      doc.addPage();

      y = 25;
    }

    doc.setDrawColor(...line);

    doc.line(110, y - 4, 192, y - 4);

    doc.setTextColor(
      i === 3 || i === 5 ? gold[0] : muted[0],
      i === 3 || i === 5 ? gold[1] : muted[1],
      i === 3 || i === 5 ? gold[2] : muted[2]
    );

    doc.setFont(
      "helvetica",
      i === 3 || i === 5 ? "bold" : "normal"
    );

    doc.setFontSize(i === 3 || i === 5 ? 10 : 8.5);

    doc.text(r[0], 112, y + 2);

    doc.setTextColor(...ink);

    doc.text(fmt(r[1]), 192, y + 2, {
      align: "right"
    });

    y += 9;

  });

  // NOTES AND TERMS

  if (d.notes) {

    y += 5;

    if (y > 250) {

      doc.addPage();

      y = 25;
    }

    doc.setTextColor(...gold);

    doc.setFont("helvetica", "bold");

    doc.setFontSize(8);

    doc.text("NOTES & TERMS", 18, y);

    y += 6;

    doc.setTextColor(...muted);

    doc.setFont("helvetica", "normal");

    doc.text(
      doc.splitTextToSize(d.notes, 174),
      18,
      y
    );
  }

  // FOOTER ON ALL PAGES

  const pages = doc.getNumberOfPages();

  for (let i = 1; i <= pages; i++) {

    doc.setPage(i);

    doc.setDrawColor(...line);

    doc.line(18, 282, 192, 282);

    doc.setTextColor(...muted);

    doc.setFontSize(7);

    doc.text(
      `${STUDIO.name} · ${STUDIO.city} · ${STUDIO.email}`,
      18,
      288
    );

    doc.text(
      `Page ${i} of ${pages}`,
      192,
      288,
      { align: "right" }
    );
  }

  // SAVE PDF

  doc.save(
    `MOVINCAM-ART-${d.client.replace(/[^a-z0-9]+/gi, "-")}-quotation.pdf`
  );
};

// MOBILE NAVIGATION

$("hamb").onclick = () => {
  $("nav").classList.toggle("show");
};

document.querySelectorAll("nav a").forEach(a => {

  a.onclick = () => {
    $("nav").classList.remove("show");
  };

});

// COMPANY CONTACT DETAILS

$("whatsapp").href = `https://wa.me/${STUDIO.phone}`;

$("year").textContent = new Date().getFullYear();

// INITIALIZE

addRow("Wedding photography coverage", 1, 25000);

renderSaved();
