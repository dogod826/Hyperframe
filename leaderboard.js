import { db } from "./firebase.js";

import {
collection,
query,
orderBy,
limit,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// login check
const username = localStorage.getItem("username");

if(!username){
window.location.href="login.html";
}



function formatTime(sec){

sec = Number(sec) || 0;

const d=Math.floor(sec/86400);
const h=Math.floor((sec%86400)/3600);
const m=Math.floor((sec%3600)/60);
const s=sec%60;

if(d>0) return `${d}d ${h}h`;
if(h>0) return `${h}h ${m}m`;
if(m>0) return `${m}m ${s}s`;
return `${s}s`;
}



// 🔥 Realtime query
const leaderboardQuery = query(
collection(db,"leaderboard"),
orderBy("time","desc"),
limit(5)
);



// ⭐ LIVE LISTENER
onSnapshot(leaderboardQuery,(snapshot)=>{

const board = document.getElementById("board");

board.innerHTML="";

let rank = 1;

snapshot.forEach((doc)=>{

const data = doc.data();

const div = document.createElement("div");

div.className =
"player glass" + (data.name === username ? " you": "");


div.innerHTML=`
<span>#${rank} ${data.name}</span>
<span>${formatTime(data.time)}</span>
`;

board.appendChild(div);

rank++;

});

});
