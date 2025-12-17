function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return [...root.querySelectorAll(sel)]; }

function setActiveNav(){
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  qsa(".nav a").forEach(a=>{
    a.classList.toggle("active", (a.getAttribute("href")||"").toLowerCase() === path);
  });
}
function formatDate(iso){
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" });
}
function getPosts(){ return (window.HC_POSTS || []).slice(); }
function byDateDesc(a,b){ return (b.date > a.date ? 1 : -1); }

function renderCards(posts, mountSel){
  const mount = qs(mountSel);
  if(!mount) return;

  mount.innerHTML = posts.map(p => `
    <article class="card review">
      <div class="review-top">
        <span class="tag ${p.type}">${p.type.toUpperCase()}</span>
        ${typeof p.score === "number" ? `<span class="score">${p.score.toFixed(1)}</span>` : `<span class="tag">${p.bucket}</span>`}
      </div>

      <h3>${p.title}</h3>

      <div class="meta">
        <span><b>${formatDate(p.date)}</b></span>
        <span>by ${p.author}</span>
      </div>

      <div class="pills">
        ${(p.tags||[]).slice(0,3).map(t=>`<span class="pill"><strong>#</strong>${t}</span>`).join("")}
      </div>

      <p class="excerpt">${p.excerpt || ""}</p>

      <div class="spacer"></div>
      <a class="btn primary" href="${p.url}">Read</a>
    </article>
  `).join("");
}

function wireHome(){
  const latestEl = qs("#latestGrid");
  const mustEl = qs("#mustGrid");
  if(!latestEl && !mustEl) return;

  const posts = getPosts().sort(byDateDesc);

  if(latestEl){
    renderCards(posts.filter(p => (p.bucket||"").toLowerCase()==="latest").slice(0,6), "#latestGrid");
  }
  if(mustEl){
    renderCards(posts.filter(p => (p.bucket||"").toLowerCase()==="must watch").slice(0,6), "#mustGrid");
  }
}

function wireListPage(){
  const grid = qs("#postGrid");
  if(!grid) return;

  const onlyType = grid.getAttribute("data-only-type"); // movie | tv | article
  const posts = getPosts().sort(byDateDesc).filter(p => !onlyType || p.type === onlyType);

  renderCards(posts, "#postGrid");

  const count = qs("#resultCount");
  if(count) count.textContent = `${posts.length} post(s)`;
}

document.addEventListener("DOMContentLoaded", ()=>{
  setActiveNav();
  wireHome();
  wireListPage();
});
