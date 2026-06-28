/* ══════════════════════════════════════
   Lettuce Growth Predictor — JS Logic
   ══════════════════════════════════════ */

"use strict";

// ── Feature defaults (mirrors Python config) ──
const FEATURES = [
  { id: "temperature",    label: "Température",        default: 22,   min: 10,  max: 35,   optimal: [18, 26] },
  { id: "humidity",       label: "Humidité",            default: 65,   min: 30,  max: 100,  optimal: [55, 80] },
  { id: "light_intensity",label: "Lumière",             default: 4000, min: 0,   max: 10000,optimal: [2000, 6000] },
  { id: "co2_level",      label: "CO₂",                 default: 800,  min: 200, max: 2000, optimal: [600, 1200] },
  { id: "soil_moisture",  label: "Humidité Sol",        default: 70,   min: 0,   max: 100,  optimal: [60, 85] },
  { id: "ph_level",       label: "pH",                  default: 6.2,  min: 4.0, max: 9.0,  optimal: [5.5, 7.0] },
  { id: "nutrient_level", label: "Nutriments (EC)",     default: 1.8,  min: 0.0, max: 5.0,  optimal: [1.2, 2.5] },
];

let radarChart = null;

// ─────────────────────────────────────────────
//  Slider live update
// ─────────────────────────────────────────────
function updateValue(id, value) {
  const display = document.getElementById("val-" + id);
  const feat    = FEATURES.find(f => f.id === id);
  if (!feat || !display) return;

  // Round for display
  const num = parseFloat(value);
  display.textContent = (id === "ph_level" || id === "nutrient_level")
    ? num.toFixed(1)
    : (id === "light_intensity" ? num.toFixed(0) : num.toFixed(1));

  // Color the card based on position relative to optimal
  const card = document.getElementById("card-" + id);
  if (card) {
    card.classList.remove("optimal", "warning", "danger");
    const [oMin, oMax] = feat.optimal;
    if (num >= oMin && num <= oMax) {
      card.classList.add("optimal");
    } else {
      const ratio = Math.min(
        Math.abs(num - oMin) / (feat.max - feat.min),
        Math.abs(num - oMax) / (feat.max - feat.min)
      );
      card.classList.add(ratio < 0.2 ? "warning" : "danger");
    }
  }

  // Compute a quick client-side score for the mini bar
  const score = scoreFeature(num, feat.optimal[0], feat.optimal[1], feat.min, feat.max);
  const bar   = document.getElementById("fscore-" + id);
  if (bar) {
    bar.style.width = (score * 100).toFixed(1) + "%";
    bar.style.background = score >= 0.85 ? "#22C55E"
                         : score >= 0.55 ? "#F59E0B"
                         : "#EF4444";
  }
}

function scoreFeature(val, oMin, oMax, fMin, fMax) {
  if (val >= oMin && val <= oMax) return 1.0;
  if (val < oMin) {
    return Math.max(0, 1 - Math.pow((oMin - val) / (oMin - fMin), 1.3));
  }
  return Math.max(0, 1 - Math.pow((val - oMax) / (fMax - oMax), 1.3));
}

// ─────────────────────────────────────────────
//  Collect form values
// ─────────────────────────────────────────────
function collectInputs() {
  const data = {};
  FEATURES.forEach(f => {
    const el = document.getElementById(f.id);
    data[f.id] = el ? parseFloat(el.value) : f.default;
  });
  return data;
}

// ─────────────────────────────────────────────
//  Run prediction
// ─────────────────────────────────────────────
async function runPrediction() {
  const btn = document.getElementById("btn-predict");

  // Loading state
  btn.classList.add("loading");
  btn.innerHTML = `
    <span class="btn-icon"><div class="spinner"></div></span>
    <span class="btn-text">Analyse en cours…</span>
  `;

  const inputs = collectInputs();

  try {
    const resp = await fetch("/predict", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(inputs),
    });
    const json = await resp.json();

    if (!json.success) throw new Error(json.error || "Erreur serveur");
    displayResult(json.result);
  } catch (err) {
    alert("Erreur : " + err.message);
  } finally {
    btn.classList.remove("loading");
    btn.innerHTML = `
      <span class="btn-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      </span>
      <span class="btn-text">Predict Growth</span>
    `;
  }
}

// ─────────────────────────────────────────────
//  Display result
// ─────────────────────────────────────────────
function displayResult(r) {
  // Show result section
  document.getElementById("result-placeholder").style.display = "none";
  const content = document.getElementById("result-content");
  content.style.display = "flex";

  // Quality banner
  const banner = document.getElementById("result-quality-banner");
  banner.textContent = r.quality_label;
  banner.style.background = r.quality_color + "18";
  banner.style.color       = r.quality_color;

  // KPI
  animateNumber("kpi-days", r.growth_days, " jours", 1);
  document.getElementById("kpi-margin").textContent = `± ${r.error_margin} jours (marge d'erreur)`;

  animateNumber("sec-mass", r.mass_g, " g", 0);
  animateNumber("sec-confidence", r.confidence, "%", 1);
  animateNumber("sec-composite", r.composite, "%", 0);

  // Confidence bar
  document.getElementById("conf-pct").textContent = r.confidence + "%";
  setTimeout(() => {
    document.getElementById("conf-fill").style.width = r.confidence + "%";
  }, 100);

  // Radar chart
  drawRadar(r.feature_scores);

  // Advice
  document.getElementById("advice-text").textContent = r.advice;

  // Limiting factors
  const limSection = document.getElementById("limiting-section");
  const limTags    = document.getElementById("limiting-tags");
  if (r.limiting && r.limiting.length > 0) {
    limSection.style.display = "block";
    limTags.innerHTML = r.limiting
      .map(l => `<span class="limiting-tag">⚠️ ${l}</span>`)
      .join("");
  } else {
    limSection.style.display = "none";
  }
}

// ─────────────────────────────────────────────
//  Number animation
// ─────────────────────────────────────────────
function animateNumber(elId, target, suffix, decimals) {
  const el   = document.getElementById(elId);
  if (!el) return;
  const start    = 0;
  const duration = 700;
  const t0       = performance.now();

  function step(now) {
    const p = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    const val = start + (target - start) * eased;
    el.textContent = val.toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ─────────────────────────────────────────────
//  Radar chart
// ─────────────────────────────────────────────
function drawRadar(scores) {
  const labels = FEATURES.map(f => f.label);
  const data   = FEATURES.map(f => scores[f.id] || 0);

  const ctx = document.getElementById("radarChart").getContext("2d");

  if (radarChart) radarChart.destroy();

  radarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels,
      datasets: [{
        label: "Score (%)",
        data,
        backgroundColor: "rgba(34,197,94,0.15)",
        borderColor:     "#22C55E",
        borderWidth:     2,
        pointBackgroundColor: "#16A34A",
        pointBorderColor:     "#fff",
        pointRadius:          4,
        pointHoverRadius:     6,
      }],
    },
    options: {
      responsive: true,
      animation: { duration: 700 },
      scales: {
        r: {
          beginAtZero: true,
          min: 0, max: 100,
          ticks: {
            stepSize: 25,
            font: { size: 9 },
            color: "#94A3B8",
            backdropColor: "transparent",
          },
          grid:        { color: "#E2E8F0" },
          angleLines:  { color: "#E2E8F0" },
          pointLabels: { font: { size: 10, weight: "600" }, color: "#475569" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.raw.toFixed(1)}%`,
          },
        },
      },
    },
  });
}

// ─────────────────────────────────────────────
//  Reset
// ─────────────────────────────────────────────
function resetForm() {
  FEATURES.forEach(f => {
    const el = document.getElementById(f.id);
    if (el) {
      el.value = f.default;
      updateValue(f.id, f.default);
    }
  });

  // Hide results
  document.getElementById("result-placeholder").style.display = "flex";
  document.getElementById("result-content").style.display     = "none";
  if (radarChart) { radarChart.destroy(); radarChart = null; }
}

// ─────────────────────────────────────────────
//  Model info modal
// ─────────────────────────────────────────────
async function openModelInfo(e) {
  e.preventDefault();
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.add("open");

  try {
    const resp = await fetch("/model-info");
    const info = await resp.json();
    document.getElementById("modal-body").innerHTML = `
      <div class="metric-row"><span class="mk">Modèle</span>        <span class="mv">${info.model}</span></div>
      <div class="metric-row"><span class="mk">Features</span>      <span class="mv">${info.features}</span></div>
      <div class="metric-row"><span class="mk">MAE</span>           <span class="mv good">${info.mae}</span></div>
      <div class="metric-row"><span class="mk">RMSE</span>          <span class="mv good">${info.rmse}</span></div>
      <div class="metric-row"><span class="mk">R² Score</span>      <span class="mv good">${info.r2}</span></div>
      <div class="metric-row"><span class="mk">Version</span>       <span class="mv">${info.version}</span></div>
    `;
  } catch (err) {
    document.getElementById("modal-body").innerHTML = "<p>Impossible de charger les informations.</p>";
  }
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
}

// ─────────────────────────────────────────────
//  Init: trigger slider coloring on load
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  FEATURES.forEach(f => updateValue(f.id, f.default));
});
