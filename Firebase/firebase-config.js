import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";

import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

import { getFirestore, doc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwbgBGAxCOdP1EVJrcFdsXUmpzuyVr-d4",
  authDomain: "autoshoprms.firebaseapp.com",
  projectId: "autoshoprms",
  appId: "1:40981952771:web:3a9e16250b083216f49136"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


document.addEventListener("DOMContentLoaded", () => {

  onAuthStateChanged(auth, async (user) => {
    if (user) {

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        const name = data.name || "User";
        const email = data.email || user.email;

        // SAFE updates
        const topbarName = document.getElementById("topbarName");
        if (topbarName) topbarName.textContent = name;

        const topbarRole = document.getElementById("topbarRole");
        if (topbarRole) topbarRole.textContent = "Customer";

        const avatar = document.getElementById("topbarAvatar");
        if (avatar) avatar.textContent = name.charAt(0).toUpperCase();

        const pddName = document.getElementById("pddName");
        if (pddName) pddName.textContent = name;

        const pddEmail = document.getElementById("pddEmail");
        if (pddEmail) pddEmail.textContent = email;

      }

    } else {
      window.location.replace("../../Login/Login (1).html");
    }
  });

});