// Shared project data
function saveProject(data) {
  localStorage.setItem('constructionProject', JSON.stringify(data));
}

function loadProject() {
  const saved = localStorage.getItem('constructionProject');
  return saved ? JSON.parse(saved) : null;
}

// ================= PLAN FORM =================
const planForm = document.getElementById('planForm');
if (planForm) {
  planForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = planForm.querySelector('input[type="text"]').value || "My Project";
    const areaSqYd = Number(document.getElementById('areaInput').value);
    const budget = Number(document.getElementById('budgetInput').value);

    // 2026 Hyderabad realistic rates (per sq yard)
    const ratePerSqYd = 21500;
    const smallRatePerSqYd = 25500;   // small plots higher rate
    const minTotalCost = 850000;

    let totalCost = areaSqYd < 120 
      ? Math.max(minTotalCost, areaSqYd * smallRatePerSqYd)
      : areaSqYd * ratePerSqYd;

    // Workforce
    let masons = Math.max(1, Math.ceil(areaSqYd / 28));
    let helpers = masons * 3;
    let engineer = areaSqYd >= 120;

    // Realistic duration (fixed as per your request)
    let months;
    if (areaSqYd < 80) months = 7;
    else if (areaSqYd < 150) months = 10;
    else if (areaSqYd < 250) months = 13;
    else if (areaSqYd < 400) months = 16;
    else months = 18 + Math.floor((areaSqYd - 400) / 80);

    const project = {
      name,
      area: areaSqYd,        // now in sq yards
      budget,
      totalCost: Math.round(totalCost),
      masons,
      helpers,
      engineer,
      months
    };

    saveProject(project);

    const budgetMsg = budget < totalCost 
      ? `<strong style="color:#ff6b6b">Warning:</strong> Budget insufficient. Minimum required ₹${totalCost.toLocaleString()}`
      : `<strong style="color:#4ade80">Budget sufficient ✓</strong> (₹${(budget - totalCost).toLocaleString()} extra)`;

    document.getElementById('result').innerHTML = `
      <h3>${name}</h3>
      Area: <strong>${areaSqYd} sq yards</strong><br><br>
      Estimated Cost: <strong>₹${totalCost.toLocaleString()}</strong><br>
      ${budgetMsg}<br><br>
      Masons: ${masons} | Helpers: ${helpers}<br>
      Engineer: ${engineer ? "Yes" : "Optional"}<br><br>
      Duration: <strong>${months} months</strong>
    `;
  });
}

// ================= MATERIAL QUANTITY (NEW) =================
function calculateMaterials() {
  const p = loadProject();
  if (!p) return alert("Please create a project plan first!");

  const a = p.area; // sq yards

  const cementBags = Math.round(a * 3.7);
  const steelKg = Math.round(a * 36);
  const sandCft = Math.round(a * 16.5);
  const aggregateCft = Math.round(a * 12.5);
  const bricks = Math.round(a * 72);

  document.getElementById('materialsResult').innerHTML = `
    <h3>📦 Material Quantity for ${a} sq yards</h3>
    <strong>Cement:</strong> ${cementBags} bags (50kg)<br>
    <strong>TMT Steel:</strong> ${steelKg} kg<br>
    <strong>Sand:</strong> ${sandCft} cft<br>
    <strong>Aggregate (20mm):</strong> ${aggregateCft} cft<br>
    <strong>Bricks (9"):</strong> ${bricks.toLocaleString()} nos<br><br>
    <small>* Thumb rule based on 2026 Hyderabad standard RCC + Brick construction (G+1/G+2). Actual may vary ±10%.</small>
  `;
}

// ================= OTHER FUNCTIONS (updated) =================
function generateAnalysis() {
  const p = loadProject();
  if (!p) return alert("Create plan first");
  const costPerYd = Math.round(p.totalCost / p.area);
  const grade = costPerYd > 26000 ? "Premium" : costPerYd > 21000 ? "Standard" : "Economy";

  document.getElementById('analysisResult').innerHTML = `
    <h3>AI Project Analysis</h3>
    Grade: <strong>${grade}</strong><br><br>
    Cost per sq yard: <strong>₹${costPerYd}</strong><br><br>
    Recommendation: ${costPerYd > 24000 ? "Excellent quality. You can consider value engineering if needed." : "Very good value for money in Hyderabad market."}
  `;
}

function calculateWorkers() {
  const p = loadProject();
  if (!p) return alert("Create plan first");
  document.getElementById('workersResult').innerHTML = `
    <h3>Workforce Plan</h3>
    Masons: <strong>${p.masons}</strong><br>
    Helpers: <strong>${p.helpers}</strong><br>
    Engineer/Supervisor: <strong>${p.engineer ? "1" : "Optional"}</strong><br>
    Electrician: 2 | Plumber: 2
  `;
}

function calculateCost() {
  const p = loadProject();
  if (!p) return alert("Create plan first");
  const t = p.totalCost;
  document.getElementById('costResult').innerHTML = `
    <h3>Cost Breakdown</h3>
    Materials: ₹${Math.round(t*0.57).toLocaleString()}<br>
    Labor: ₹${Math.round(t*0.28).toLocaleString()}<br>
    Finishing: ₹${Math.round(t*0.10).toLocaleString()}<br>
    Contingency: ₹${Math.round(t*0.05).toLocaleString()}<br><br>
    <strong>Total: ₹${t.toLocaleString()}</strong>
  `;
}

function generateBlueprint() {
  const p = loadProject();
  if (!p) return alert("Create plan first");
  const bedrooms = Math.max(1, Math.floor(p.area / 35));
  document.getElementById('blueprintResult').innerHTML = `
    <h3>Suggested Layout (${p.area} sq yards)</h3>
    Bedrooms: <strong>${bedrooms}</strong><br>
    Hall: 1 | Kitchen: 1<br>
    Bathrooms: ${Math.ceil(bedrooms * 0.7)}<br>
    <small>* Rough suggestion for rectangular plot</small>
  `;
}

function generateSchedule() {
  const p = loadProject();
  if (!p) return alert("Create plan first");
  let html = `<h3>Construction Schedule (${p.months} months)</h3>`;
  for(let m=1; m<=p.months; m++) {
    let phase = m<=2 ? "Approvals & Foundation" :
                m<=5 ? "Structure (Columns & Slab)" :
                m<=p.months-4 ? "Brickwork + Plumbing/Electrical" : "Finishing & Handover";
    html += `Month ${m}: ${phase}<br>`;
  }
  document.getElementById('scheduleResult').innerHTML = html;
}
