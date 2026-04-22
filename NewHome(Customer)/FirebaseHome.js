// ============================================================
//  FirebaseHome.js  —  RMS Autoshop Customer Homepage
//  Fetches the logged-in customer's Firestore profile and
//  injects it into Home.js USER object + all UI elements.
//
//  Firestore structure:
//    User / Customer / Customers / {uid}
//      → firstName, lastName, email, phone, address, role, uid
//
//  Load order in Home.html (BOTTOM of <body>):
//    <script src="Home.js"></script>
//    <script type="module" src="FirebaseHome.js"></script>
// ============================================================

import { initializeApp }           from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut }
                                   from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc }
                                   from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// ─────────────────────────────────────────
//  FIREBASE CONFIG
// ─────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyD0g9EfP0DPIR7skzKOZ0DyWLlUi5f5LlM",
  authDomain:        "rmsautoshop.firebaseapp.com",
  projectId:         "rmsautoshop",
  storageBucket:     "rmsautoshop.firebasestorage.app",
  messagingSenderId: "699636102924",
  appId:             "1:699636102924:web:1c25aba93b61fd86047b29"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ─────────────────────────────────────────
//  AUTH GUARD + PROFILE LOADER
// ─────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Not logged in — redirect to login page
    window.location.href = "../../Login/Login.html";
    return;
  }

  try {
    // Fetch customer doc: User / Customer / Customers / {uid}
    const snap = await getDoc(
      doc(db, "User", "Customer", "Customers", user.uid)
    );

    if (!snap.exists()) {
      console.warn("⚠️ No Firestore profile found for UID:", user.uid);
      // Still populate with what we have from Auth
      applyToUI({
        name:     user.displayName || user.email.split("@")[0],
        email:    user.email,
        email2:   "",
        phone:    "",
        address:  "",
        birthday: "",
        gender:   "",
        role:     "Customer",
        photo:    user.photoURL || "",
        uid:      user.uid,
      });
      return;
    }

    const d = snap.data();

    // Build the full profile object
    const profile = {
      name:     `${d.firstName || ""} ${d.lastName || ""}`.trim() || user.email.split("@")[0],
      firstName: d.firstName || "",
      lastName:  d.lastName  || "",
      email:     d.email     || user.email,
      email2:    d.email2    || "",
      phone:     d.phone     || "",
      address:   d.address   || "",
      birthday:  d.birthday  || "",
      gender:    d.gender    || "",
      role:      d.role
                   ? d.role.charAt(0).toUpperCase() + d.role.slice(1)
                   : "Customer",
      photo:     d.photo     || user.photoURL || "",
      uid:       user.uid,
      docId:     snap.id,
    };

    console.log("✅ Customer profile loaded:", profile.name);
    applyToUI(profile);

  } catch (err) {
    console.error("❌ Failed to load customer profile:", err);
  }
});

// ─────────────────────────────────────────
//  APPLY PROFILE → USER OBJECT + ALL UI
// ─────────────────────────────────────────
function applyToUI(profile) {

  // 1. Overwrite the global USER object defined in Home.js
  if (typeof USER !== "undefined") {
    USER.name     = profile.name;
    USER.email    = profile.email;
    USER.email2   = profile.email2;
    USER.phone    = profile.phone;
    USER.address  = profile.address;
    USER.birthday = profile.birthday;
    USER.gender   = profile.gender;
    USER.role     = profile.role;
    USER.photo    = profile.photo;
    USER.initials = profile.name
      .split(" ")
      .map(w => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  // 2. Topbar avatar + name + role
  const topbarAvatar = document.getElementById("topbarAvatar");
  if (topbarAvatar) {
    if (profile.photo) {
      topbarAvatar.innerHTML = `<img src="${profile.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      topbarAvatar.textContent = getInitials(profile.name);
      Object.assign(topbarAvatar.style, {
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontFamily:     '"Barlow Condensed",sans-serif',
        fontWeight:     "800",
        color:          "#000",
        background:     "linear-gradient(135deg,#A67F38,#D9B573)",
      });
    }
  }

  setText("topbarName", profile.name);
  setText("topbarRole", profile.role);

  // 3. Greeting (Good morning, [First Name])
  const firstName  = profile.firstName || profile.name.split(" ")[0];
  const hr         = new Date().getHours();
  const greet      = hr < 12 ? "Good Morning" : hr < 18 ? "Good Afternoon" : "Good Evening";
  setText("topbarGreet", `${greet}, ${firstName} 👋`);

  // 4. Profile dropdown
  const pddAvatar = document.getElementById("pddAvatar");
  if (pddAvatar) {
    if (profile.photo) {
      pddAvatar.innerHTML = `<img src="${profile.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      pddAvatar.textContent = getInitials(profile.name);
      Object.assign(pddAvatar.style, {
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontFamily:     '"Barlow Condensed",sans-serif',
        fontWeight:     "800",
        color:          "#000",
        background:     "linear-gradient(135deg,#A67F38,#D9B573)",
      });
    }
  }

  setText("pddName",  profile.name);
  setText("pddEmail", profile.email);

  // 5. Profile Card FRONT
  setText("pcFrontName", profile.name);
  setText("pcFrontRole", profile.role);
  setText("pcPhone",     profile.phone  || "—");
  setText("pcEmail",     profile.email);
  setText("pcTimeIn",    fmtTime(new Date()));
  setText("pcMetaTimeIn","08:00 AM");
  setText("pcMetaStatus","Online");
  setText("pcMetaShift", "Morning");

  // Profile Card front photo
  ["pcFrontImg", "pcBackImg"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (profile.photo) {
      el.src = profile.photo;
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });

  // 6. Profile Card BACK
  setText("pcBackName", profile.name);
  setText("pcBackRole", profile.role);

  setVal("pcFieldEmail",  profile.email);
  setVal("pcFieldEmail2", profile.email2);
  setVal("pcFieldPhone",  profile.phone);
  setVal("pcFieldBday",   profile.birthday);
  setVal("pcFieldAddr",   profile.address);
  setVal("pcFieldGender", profile.gender);

  // 7. Booking form auto-fill (Step 2)
  const [fn, ...lnParts] = profile.name.split(" ");
  setVal("bkFirstName", fn       || "");
  setVal("bkLastName",  lnParts.join(" ") || "");
  setVal("bkEmail",     profile.email);
  setVal("bkPhone",     profile.phone);

  // 8. Wire up Save Profile Changes to write back to Firestore
  wireProfileSave(profile.uid);

  // 9. Wire up Logout button
  wireLogout();

  console.log("✅ UI fully populated for:", profile.name);
}

// ─────────────────────────────────────────
//  SAVE PROFILE → WRITE BACK TO FIRESTORE
//  Overrides the Home.js saveProfileChanges
// ─────────────────────────────────────────
function wireProfileSave(uid) {
  window.saveProfileChanges = async function () {
    const email   = document.getElementById("pcFieldEmail")?.value.trim();
    const email2  = document.getElementById("pcFieldEmail2")?.value.trim();
    const phone   = document.getElementById("pcFieldPhone")?.value.trim();
    const bday    = document.getElementById("pcFieldBday")?.value.trim();
    const address = document.getElementById("pcFieldAddr")?.value.trim();
    const gender  = document.getElementById("pcFieldGender")?.value.trim();

    // Update local USER object
    if (typeof USER !== "undefined") {
      if (email)   USER.email    = email;
      if (email2)  USER.email2   = email2;
      if (phone)   USER.phone    = phone;
      if (bday)    USER.birthday = bday;
      if (address) USER.address  = address;
      if (gender)  USER.gender   = gender;
    }

    // Update Firestore
    try {
      await updateDoc(
        doc(db, "User", "Customer", "Customers", uid),
        {
          ...(email   && { email   }),
          ...(email2  && { email2  }),
          ...(phone   && { phone   }),
          ...(bday    && { birthday: bday }),
          ...(address && { address }),
          ...(gender  && { gender  }),
        }
      );
      showToast("Profile updated!");
    } catch (err) {
      console.error("Profile save error:", err);
      showToast("Failed to save profile.", "error");
    }

    // Reset edit mode UI (mirrors original Home.js logic)
    document.querySelectorAll(".pc-input").forEach(inp => {
      inp.disabled = true;
      inp.style.color = "";
      inp.style.borderBottom = "";
    });
    document.getElementById("pcActionBtns")?.classList.add("hidden");
    setText("editBtnTxt", "Edit");

    // Refresh dropdown email display
    setText("pddEmail", email || "");
  };
}

// ─────────────────────────────────────────
//  LOGOUT — Override Home.js handleLogout
// ─────────────────────────────────────────
function wireLogout() {
  window.handleLogout = async function () {
    closeProfileDD?.();
    if (!confirm("Log out of REV?")) return;
    await signOut(auth);
    window.location.href = "../../Login/Login.html";
  };
}

// ─────────────────────────────────────────
//  TINY HELPERS
// ─────────────────────────────────────────
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val || "";
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || "";
}

function getInitials(name) {
  return (name || "?")
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function fmtTime(d) {
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: true
  });
}

function showToast(msg, type = "success") {
  const isErr = type === "error";
  const t = document.createElement("div");
  t.className = "toast-notif";
  Object.assign(t.style, {
    background:  isErr ? "#1a0808" : "#0b2018",
    borderLeft:  `3px solid ${isErr ? "#ef4444" : "#10b981"}`,
    color:       isErr ? "#f87171" : "#34d399",
  });
  t.innerHTML = `<i class="fas fa-${isErr ? "exclamation-circle" : "check-circle"}"></i> ${msg}`;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = "1"; });
  setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 300);
  }, 2800);
}