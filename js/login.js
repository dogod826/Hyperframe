import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // STOP PAGE REFRESH

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    message.textContent = "Loading...";

    try {

        // 🔥 Try login first
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        message.textContent = "Login successful!";
        console.log("Logged in:", userCredential.user);

        // redirect example:
        window.location.href = "index.html";

    } catch (loginError) {

        // If user doesn't exist → create account
        if (loginError.code === "auth/user-not-found" ||
            loginError.code === "auth/invalid-credential") {

            try {

                const newUser = await createUserWithEmailAndPassword(auth, email, password);

                // Store username in Firestore
                await setDoc(doc(db, "users", newUser.user.uid), {
                    username: username,
                    email: email,
                    createdAt: Date.now()
                });

                message.textContent = "Account created!";
                console.log("Created user:", newUser.user);

                window.location.href = "index.html";

            } catch (createError) {

                if (createError.code === "auth/email-already-in-use") {
                    message.textContent = "Email already exists.";
                } else if (createError.code === "auth/weak-password") {
                    message.textContent = "Password must be at least 6 characters.";
                } else {
                    message.textContent = createError.message;
                }
            }

        } else {

            if (loginError.code === "auth/wrong-password") {
                message.textContent = "Wrong password.";
            } else if (loginError.code === "auth/too-many-requests") {
                message.textContent = "Too many attempts — wait 30 seconds.";
            } else {
                message.textContent = loginError.message;
            }
        }
    }
});
