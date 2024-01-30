import {
  getAuth,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { app } from "../../config.js";

const auth = getAuth(app);
setTimeout(() => {
  if (auth.currentUser == null) {
    window.location.href = "../../login/";
  }
}, 2000);
// creating a new user with their email and password
let formSubmitBtn = document.getElementById("addRestBtn");
let inputFields = document.querySelectorAll(".form form input");
let errBox = document.getElementById("errMsg");
formSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputFields[0].value != "" && inputFields[0].value != null) {
    if (inputFields[1].value != "" && inputFields[1].value != null) {
      if (inputFields[2].value != "" && inputFields[2].value != null) {
        addRestaurant();
      } else {
        errBox.innerText = `No. of tables is required. 😬`;
        setInterval(() => {
          errBox.style.animation =
            "error 3s cubic-bezier(0.18, 0.87, 0.63, 1.20)";
        }, 500);
        errBox.removeAttribute("style");
      }
    } else {
      errBox.innerText = "Location of restaurant required. 🙄";
      setInterval(() => {
        errBox.style.animation =
          "error 3s cubic-bezier(0.18, 0.87, 0.63, 1.20)";
      }, 500);
      errBox.removeAttribute("style");
    }
  } else {
    errBox.innerText = "Restaurant name is required. 😒";
    setInterval(() => {
      errBox.style.animation = "error 3s cubic-bezier(0.18, 0.87, 0.63, 1.20)";
    }, 500);
    errBox.removeAttribute("style");
  }
});

function addRestaurant() {
  const db = getFirestore(app);
  let docRef = doc(db, `restaurant/${auth.currentUser.uid}`);
  setDoc(docRef, {
    RestaurantName: inputFields[0].value,
    RestaurantLocation: inputFields[1].value,
    TableNo: inputFields[2].value,
  }, { merge: true });
  docRef = doc(db, `restaurant/${auth.currentUser.uid}/foodItems/demo`);
  setDoc(docRef, {})
  docRef = doc(db, `restaurant/${auth.currentUser.uid}/orders/demo`);
  setDoc(docRef, {})
  docRef = doc(db, `restaurant/${auth.currentUser.uid}/sales/demo`);
  setDoc(docRef, {})
  docRef = doc(db, `restaurant/${auth.currentUser.uid}/feedbacks/demo`);
  setDoc(docRef, {})
  setTimeout(() => {
    window.location.href = "../QRCode/";
  }, Math.floor(Math.random() * 1000) + 1000);
}