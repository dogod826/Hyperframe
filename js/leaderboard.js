import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

//Ranks

function getRank(score){

  if(score >= 15000) return "👑";
  if(score >= 10000) return "🔥";
  if(score >= 7500)  return "🔷";
  if(score >= 5000)  return "💠";
  if(score >= 3000)  return "🥇";
  if(score >= 1500)  return "🥈";
  if(score >= 500)   return "🥉";

  return "🟢";
}

const leaderboardBody = document.getElementById("leaderboard-body");

async function loadLeaderboard() {

  leaderboardBody.innerHTML =
    "<tr><td colspan='3'>Loading leaderboard...</td></tr>";

  try {

    const q = query(
      collection(db, "users"),
      orderBy("score", "desc"),
      limit(50)
    );

    const snapshot = await getDocs(q);

    leaderboardBody.innerHTML = "";

    if (snapshot.empty) {
      leaderboardBody.innerHTML =
        "<tr><td colspan='3'>No players yet.</td></tr>";
      return;
    }

    let rank = 1;

    snapshot.forEach(doc => {

      const data = doc.data();

      leaderboardBody.innerHTML += `
        <tr>
          <td>#${rank}</td>
          <td>${getRank(data.score ?? 0)} ${data.username}</td>
          <td>${data.score ?? 0}</td>
        </tr>
      `;

      rank++;
    });

  } catch (err) {

    console.error(err);

    leaderboardBody.innerHTML =
      "<tr><td colspan='3'>Failed to load leaderboard.</td></tr>";
  }
}

loadLeaderboard();
