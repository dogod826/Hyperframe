import { db } from "./firebase.js";

import {
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const USER_KEY = "username";

// Auto redirect if already logged in
if(localStorage.getItem(USER_KEY)){
window.location.href = "index.html";
}


document.addEventListener("DOMContentLoaded", () => {

console.log("LOGIN JS LOADED");

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

e.preventDefault(); // 🚨 stops refresh

console.log("LOGIN CLICKED");

const username = document.getElementById("username").value.trim();
const password = document.getElementById("password").value.trim();

if(username.length < 3){
alert("Username must be at least 3 characters.");
return;
}

if(password.length < 3){
alert("Password must be at least 3 characters.");
return;
}

try{

const ref = doc(db,"users",username);
const snap = await getDoc(ref);


// ✅ EXISTING USER
if(snap.exists()){

if(snap.data().password !== password){
alert("Incorrect password.");
return;
}

}else{

// ✅ CREATE ACCOUNT
await setDoc(ref,{
username,
password,
time:0,
created:Date.now()
});

console.log("Account created!");

}


// Save session
localStorage.setItem(USER_KEY,username);


// Redirect
window.location.href = "index.html";


}catch(err){

console.error(err);
alert("Login failed. Check console.");

}

});

});