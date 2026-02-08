import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


/* ================================
        AUTH + SESSION
================================ */

const auth = getAuth();

const USER_KEY = "username";
const UID_KEY = "uid";

let username = localStorage.getItem(USER_KEY);
let uid = localStorage.getItem(UID_KEY);

if(!uid){
  window.location.href = "login.html";
}


/* ================================
        NAV USER
================================ */

document.getElementById("navUser").textContent = username;


/* ================================
        TITLE SYSTEM
================================ */

function getTitle(seconds){
  const hours = seconds / 3600;

  if(hours >= 250) return "👑 Mythic";
  if(hours >= 100) return "🔥 Warlord";
  if(hours >= 50) return "⚡ Elite";
  if(hours >= 25) return "🧠 Veteran";
  if(hours >= 10) return "💪 Grinder";
  if(hours >= 5) return "🎯 Dedicated";
  if(hours >= 1) return "🎮 Gamer";
  return "🌱 Rookie";
}

function formatTime(sec){
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if(d > 0) return `${d}d ${h}h`;
  if(h > 0) return `${h}h ${m}m`;
  if(m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}


/* ================================
            TIMER
================================ */

let seconds = 0;
const timerEl = document.getElementById("timer");

async function loadTime(){

  const ref = doc(db,"leaderboard",uid);
  const snap = await getDoc(ref);

  if(snap.exists()){
    seconds = snap.data().time || 0;
  }else{
    await setDoc(ref,{
      name: username,
      time: 0
    });
    seconds = 0;
  }

  updateTimerUI();
}

function updateTimerUI(){
  timerEl.textContent =
    `${formatTime(seconds)} • ${getTitle(seconds)}`;
}


/* ================================
        AUTH STATE CHECK
================================ */

onAuthStateChanged(auth, async (user)=>{

  if(!user){
    localStorage.clear();
    window.location.href = "login.html";
    return;
  }

  // Load once authenticated
  await loadTime();
});


/* ================================
    LOCAL TICK + FIRESTORE SAVE
================================ */

// Local UI tick
setInterval(()=>{
  seconds++;
  updateTimerUI();
},1000);

// Firestore sync every 15s
setInterval(async ()=>{

  if(!uid) return;

  await updateDoc(
    doc(db,"leaderboard",uid),
    { time: increment(15) }
  );

},15000);


/* ================================
        ADMIN SYSTEM
================================ */

let isAdmin = false;

async function checkAdmin(){
  const ref = doc(db,"users",uid);
  const snap = await getDoc(ref);

  if(snap.exists()){
    isAdmin = snap.data().admin === true;
  }
}

checkAdmin();


// SECRET KEY COMBO
document.addEventListener("keydown", async (e)=>{

  if(e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a"){

    if(!isAdmin){
      alert("You should not be here 🙂");
      return;
    }

    const code = prompt("Enter admin code:");

    if(code !== "hyper7x"){
      alert("Wrong code.");
      return;
    }

    openAdminPanel();
  }
});


/* ================================
        ADMIN PANEL
================================ */

function openAdminPanel(){

  if(document.getElementById("adminPanel")) return;

  const panel = document.createElement("div");
  panel.id = "adminPanel";

  panel.style.cssText = `
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    padding:30px;
    width:420px;
    background:rgba(20,20,30,.95);
    backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,.15);
    border-radius:18px;
    box-shadow:0 0 60px rgba(155,89,182,.6);
    z-index:9999;
    color:white;
    font-family:Space Grotesk;
  `;

  panel.innerHTML = `
    <h2 style="margin-bottom:15px;">⚡ Admin Panel</h2>

    <input id="addTime"
      placeholder="Seconds to add"
      style="width:100%;padding:10px;margin-bottom:10px;border-radius:10px;border:none;"
    />

    <button id="giveTime"
      style="width:100%;padding:10px;border:none;border-radius:10px;background:#9b59b6;color:white;font-weight:600;cursor:pointer;">
      Give Time
    </button>

    <br><br>

    <button id="closeAdmin"
      style="width:100%;padding:8px;border:none;border-radius:10px;background:#222;color:white;cursor:pointer;">
      Close
    </button>
  `;

  document.body.appendChild(panel);

  document.getElementById("giveTime").onclick = async ()=>{
    const amount = parseInt(document.getElementById("addTime").value);

    if(!amount || amount <= 0){
      alert("Enter a valid number.");
      return;
    }

    seconds += amount;
    updateTimerUI();

    await updateDoc(
      doc(db,"leaderboard",uid),
      { time: increment(amount) }
    );

    alert("Time granted ⚡");
  };

  document.getElementById("closeAdmin").onclick = ()=>{
    panel.remove();
  };
}


/* ================================
            LOGOUT
================================ */

window.logout = function(){
  localStorage.clear();
  auth.signOut();
  window.location.href = "login.html";
};
