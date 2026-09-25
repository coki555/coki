// Liga 4 obci: Lastomir - Strazske - Tusice - Zaluzice
// Oficialne nazvy podla vzoru + stlpec K. Uklada sa do localStorage (v2 kluce).

const TEAMS = ["OŠK Tušice - TNV", "OFK Lastomír", "OŠK Zalužice", "ŠK Strážske"];
const TEAM_EMOJI = { "OFK Lastomír":"🟢", "ŠK Strážske":"🔴", "OŠK Tušice - TNV":"⚫", "OŠK Zalužice":"🟢" };
// K podla vzoru z obrazka (stale hodnoty, menis v kode ak treba)
const TEAM_K = { "OŠK Tušice - TNV":4, "OFK Lastomír":3, "OŠK Zalužice":2, "ŠK Strážske":1 };

const DEFAULT_MATCHES = [
  // 1. kolo - podla obrazka
  { id:1, kolo:1, domaci:"OFK Lastomír", hostia:"OŠK Zalužice", gD:3, gH:0, hrane:true },
  { id:2, kolo:1, domaci:"OŠK Tušice - TNV", hostia:"ŠK Strážske", gD:8, gH:1, hrane:true },
  // 2. kolo
  { id:3, kolo:2, domaci:"ŠK Strážske", hostia:"OŠK Tušice - TNV", gD:null, gH:null, hrane:false },
  { id:4, kolo:2, domaci:"OŠK Zalužice", hostia:"OFK Lastomír", gD:null, gH:null, hrane:false },
  // 3. kolo
  { id:5, kolo:3, domaci:"OFK Lastomír", hostia:"OŠK Tušice - TNV", gD:null, gH:null, hrane:false },
  { id:6, kolo:3, domaci:"ŠK Strážske", hostia:"OŠK Zalužice", gD:null, gH:null, hrane:false },
  // 4. kolo - odvety
  { id:7, kolo:4, domaci:"OŠK Zalužice", hostia:"OFK Lastomír", gD:null, gH:null, hrane:false },
  { id:8, kolo:4, domaci:"ŠK Strážske", hostia:"OŠK Tušice - TNV", gD:null, gH:null, hrane:false },
  // 5. kolo
  { id:9, kolo:5, domaci:"OŠK Tušice - TNV", hostia:"ŠK Strážske", gD:null, gH:null, hrane:false },
  { id:10, kolo:5, domaci:"OFK Lastomír", hostia:"OŠK Zalužice", gD:null, gH:null, hrane:false },
  // 6. kolo
  { id:11, kolo:6, domaci:"OŠK Tušice - TNV", hostia:"OFK Lastomír", gD:null, gH:null, hrane:false },
  { id:12, kolo:6, domaci:"OŠK Zalužice", hostia:"ŠK Strážske", gD:null, gH:null, hrane:false },
];

const DEFAULT_PLAYERS = [
  { name:"Hráč Tušice 1", team:"OŠK Tušice - TNV", played:1, goals:3, assists:1, yc:0, rc:0 },
  { name:"Hráč Tušice 2", team:"OŠK Tušice - TNV", played:1, goals:2, assists:2, yc:0, rc:0 },
  { name:"Hráč Tušice 3", team:"OŠK Tušice - TNV", played:1, goals:2, assists:0, yc:1, rc:0 },
  { name:"Hráč Lastomír 1", team:"OFK Lastomír", played:1, goals:2, assists:0, yc:0, rc:0 },
  { name:"Hráč Lastomír 2", team:"OFK Lastomír", played:1, goals:1, assists:1, yc:1, rc:0 },
  { name:"Hráč Strážske 1", team:"ŠK Strážske", played:1, goals:1, assists:0, yc:1, rc:0 },
  { name:"Hráč Zalužice 1", team:"OŠK Zalužice", played:1, goals:0, assists:0, yc:1, rc:0 },
];

let matches = load("liga4_zapasy_v2", DEFAULT_MATCHES);
let players = load("liga4_hraci_v2", DEFAULT_PLAYERS);
let teamFilter = "all";
let playerSearch = "";
let playerSort = { k:"goals", dir:-1 };

function load(key, fallback){
  try {
    const raw = localStorage.getItem(key);
    if(!raw) return JSON.parse(JSON.stringify(fallback));
    return JSON.parse(raw);
  } catch(e){ return JSON.parse(JSON.stringify(fallback)); }
}
function save(){
  localStorage.setItem("liga4_zapasy_v2", JSON.stringify(matches));
  localStorage.setItem("liga4_hraci_v2", JSON.stringify(players));
}

function calcTable(){
  const t = {};
  TEAMS.forEach(n => t[n] = { name:n, z:0, v:0, r:0, p:0, gf:0, ga:0, body:0, forma:[] });
  matches.filter(m=>m.hrane && m.gD!==null && m.gH!==null).forEach(m=>{
    const d = t[m.domaci], h = t[m.hostia];
    d.z++; h.z++;
    d.gf+=+m.gD; d.ga+=+m.gH; h.gf+=+m.gH; h.ga+=+m.gD;
    if(m.gD>m.gH){ d.v++; d.body+=3; h.p++; d.forma.push("W"); h.forma.push("L"); }
    else if(m.gD<m.gH){ h.v++; h.body+=3; d.p++; h.forma.push("W"); d.forma.push("L"); }
    else { d.r++; h.r++; d.body+=1; h.body+=1; d.forma.push("D"); h.forma.push("D"); }
  });
  return Object.values(t).sort((a,b)=> b.body-a.body || (b.gf-b.ga)-(a.gf-a.ga) || b.gf-a.gf);
}

function renderTable(){
  const rows = calcTable();
  const tb = document.getElementById("tableBody");
  tb.innerHTML = "";
  rows.forEach((r,i)=>{
    const skore = r.gf + ":" + r.ga;
    const last = r.forma[r.forma.length-1];
    const fLetter = !last ? "–" : last==="W" ? "V" : last==="D" ? "R" : "P";
    const fClass = !last ? "" : last==="W" ? "v" : last==="D" ? "d" : "l";
    const forma = `<span class="f-circle ${fClass}">${fLetter}</span>`;
    const tr = document.createElement("tr");
    if(r.name==="OFK Lastomír") tr.className = "hl";
    tr.innerHTML = `<td class="pos">${i+1}</td><td class="left club"><span class="crest">${TEAM_EMOJI[r.name]||"⚽"}</span> <a>${r.name}</a></td><td>${r.z}</td><td>${r.v}</td><td>${r.r}</td><td>${r.p}</td><td>${skore}</td><td><b>${r.body}</b></td><td>${TEAM_K[r.name] ?? ""}</td><td>${forma}</td>`;
    tb.appendChild(tr);
  });
  const played = matches.filter(m=>m.hrane).length;
  const goals = matches.filter(m=>m.hrane).reduce((s,m)=>s+(+m.gD||0)+(+m.gH||0),0);
  document.getElementById("statPlayed").textContent = played + "/12";
  document.getElementById("statGoals").textContent = goals;
  document.getElementById("statPlayers").textContent = players.length;
}

function renderRounds(){
  const wrap = document.getElementById("roundsWrap");
  wrap.innerHTML = "";
  const kolas = [...new Set(matches.map(m=>m.kolo))].sort((a,b)=>a-b);
  kolas.forEach(k=>{
    const div = document.createElement("div");
    div.className = "round";
    let html = `<h3>${k}. kolo</h3>`;
    matches.filter(m=>m.kolo===k).forEach(m=>{
      html += `<div class="match">
        <div class="t right">${TEAM_EMOJI[m.domaci]} ${m.domaci}</div>
        <div class="score">
          <input type="number" min="0" data-id="${m.id}" data-f="gD" value="${m.gD ?? ""}" placeholder="–">
          <b>:</b>
          <input type="number" min="0" data-id="${m.id}" data-f="gH" value="${m.gH ?? ""}" placeholder="–">
        </div>
        <div class="t">${m.hostia} ${TEAM_EMOJI[m.hostia]}</div>
        <label class="played-check"><input type="checkbox" data-id="${m.id}" data-f="hrane" ${m.hrane?"checked":""}> odohrané</label>
        <span class="${m.hrane?"badge-live":"badge-live badge-plan"}">${m.hrane?" hotovo":" plán"}</span>
      </div>`;
    });
    div.innerHTML = html;
    wrap.appendChild(div);
  });
  wrap.querySelectorAll("input").forEach(inp=>{
    inp.onchange = e=>{
      const id = +e.target.dataset.id, f = e.target.dataset.f;
      const m = matches.find(x=>x.id===id);
      if(f==="hrane"){ m.hrane = e.target.checked; if(m.hrane && (m.gD===null||m.gH===null)){ m.gD = m.gD ?? 0; m.gH = m.gH ?? 0; } }
      else { m[f] = e.target.value==="" ? null : +e.target.value; if(m.gD!==null && m.gH!==null) m.hrane = true; }
      save(); renderTable(); renderRounds();
    };
  });
}

function renderPlayers(){
  const tb = document.getElementById("playersBody");
  tb.innerHTML = "";
  let list = players.filter(p =>
    (teamFilter==="all" || p.team===teamFilter) &&
    p.name.toLowerCase().includes(playerSearch)
  );
  list.sort((a,b)=>{
    const k = playerSort.k;
    if(k==="name"||k==="team") return playerSort.dir * a[k].localeCompare(b[k]);
    if(k==="points") return playerSort.dir * ((a.goals+a.assists)-(b.goals+b.assists));
    return playerSort.dir * (a[k]-b[k]);
  });
  list.forEach(p=>{
    const idx = players.indexOf(p);
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><b>${p.name}</b></td><td>${TEAM_EMOJI[p.team]} ${p.team}</td><td>${p.played}</td>
      <td><b>${p.goals}</b></td><td>${p.assists}</td><td><b>${p.goals+p.assists}</b></td>
      <td>${p.yc}</td><td>${p.rc}</td>
      <td><button class="mini-btn" data-i="${idx}">+1</button></td>
      <td><button class="del-btn" data-i="${idx}">✕</button></td>`;
    tb.appendChild(tr);
  });
  tb.querySelectorAll(".mini-btn").forEach(b=> b.onclick = ()=>{ players[+b.dataset.i].goals++; save(); renderPlayers(); renderTop(); });
  tb.querySelectorAll(".del-btn").forEach(b=> b.onclick = ()=>{ if(confirm("Vymazať hráča?")){ players.splice(+b.dataset.i,1); save(); renderPlayers(); renderTop(); renderTable(); } });

  // top 3 strelci
  renderTop();
}

function renderTop(){
  const box = document.getElementById("topScorers");
  const top = [...players].sort((a,b)=>b.goals-a.goals || (b.goals+b.assists)-(a.goals+a.assists)).slice(0,3);
  box.innerHTML = "";
  const medals = ["🥇","🥈","🥉"];
  top.forEach((p,i)=>{
    const d = document.createElement("div");
    d.className = "card";
    d.innerHTML = `<div class="big">${medals[i]}</div><h3>${p.name}</h3><div>${TEAM_EMOJI[p.team]} ${p.team}</div><div class="goals">${p.goals} ⚽</div><div>+ ${p.assists} asistencie • ${p.played} zápasy</div>`;
    box.appendChild(d);
  });
}

document.querySelectorAll("#teamFilter .filter-btn").forEach(b=>{
  b.onclick = ()=>{
    document.querySelectorAll("#teamFilter .filter-btn").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    teamFilter = b.dataset.team;
    renderPlayers();
  };
});
document.getElementById("playerSearch").oninput = e=>{ playerSearch = e.target.value.toLowerCase(); renderPlayers(); };
document.querySelectorAll("#playersTable th[data-k]").forEach(th=>{
  th.onclick = ()=>{
    const k = th.dataset.k;
    if(playerSort.k===k) playerSort.dir *= -1;
    else playerSort = { k, dir: k==="name"||k==="team" ? 1 : -1 };
    renderPlayers();
  };
});
document.getElementById("addPlayerBtn").onclick = ()=>{
  const name = document.getElementById("newName").value.trim();
  if(!name){ alert("Zadaj meno hráča."); return; }
  players.push({ name, team:document.getElementById("newTeam").value, played:0,
    goals:+document.getElementById("newGoals").value||0, assists:+document.getElementById("newAssists").value||0, yc:0, rc:0 });
  document.getElementById("newName").value = "";
  save(); renderPlayers(); renderTable();
};
document.getElementById("resetBtn").onclick = ()=>{
  if(!confirm("Resetovať všetko na vzorové dáta?")) return;
  matches = JSON.parse(JSON.stringify(DEFAULT_MATCHES));
  players = JSON.parse(JSON.stringify(DEFAULT_PLAYERS));
  save(); renderTable(); renderRounds(); renderPlayers();
};

renderTable();
renderRounds();
renderPlayers();
