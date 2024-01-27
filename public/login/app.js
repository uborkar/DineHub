import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { app } from "../config.js";

const auth = getAuth(app);

// creating a new user with their email and password
let formSubmitBtn = document.getElementById("signupBtn");
let inputFields = document.querySelectorAll(".form form input");
let errBox = document.getElementById("errMsg");

formSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputFields[0].value != "" && inputFields[0].value != null) {
    if (inputFields[1].value != "" && inputFields[1].value != null) {
      if (inputFields[2].checked == true) {
        let email = inputFields[0].value;
        let password = inputFields[1].value;
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            emailIsVerified();
          })
          .catch((error) => {
            console.log(error);
            errBox.innerText = `Invalid Credential 🚨`;
            setInterval(() => {
              errBox.style.animation =
                "error 3s cubic-bezier(0.18, 0.87, 0.63, 1.20)";
            }, 500);
            errBox.removeAttribute("style");
          });
      } else {
        errBox.innerText = `Accept the terms and policy 🚨`;
        setInterval(() => {
          errBox.style.animation =
            "error 3s cubic-bezier(0.18, 0.87, 0.63, 1.20)";
        }, 500);
        errBox.removeAttribute("style");
      }
    } else {
      errBox.innerText = `Password is required. 😬`;
      setInterval(() => {
        errBox.style.animation =
          "error 3s cubic-bezier(0.18, 0.87, 0.63, 1.20)";
      }, 500);
      errBox.removeAttribute("style");
    }
  } else {
    errBox.innerText = "Email is required. 🙄";
    setInterval(() => {
      errBox.style.animation = "error 3s cubic-bezier(0.18, 0.87, 0.63, 1.20)";
    }, 500);
    errBox.removeAttribute("style");
  }
});

// signin with google Oauth provider
let googleSigninBtn = document.getElementById("googleSigninBtn");
googleSigninBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result.user.uid);
      emailIsVerified();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, credential);
    });
});

let appleSigninBtn = document.getElementById("appleSigninBtn");
appleSigninBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const provider = new OAuthProvider("apple.com");
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(credential, token, user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, email, credential);
    });
});

function emailIsVerified() {
  if (auth.currentUser.emailVerified) {
    document.getElementById("loader").style.display = "flex";
    createDatabaseUser();
  } else {
    errBox.innerText = "You have to verify Email. 📧";
    setInterval(() => {
      errBox.style.animation = "error 3s cubic-bezier(0.18, 0.87, 0.63, 1.20)";
    }, 500);
    errBox.removeAttribute("style");
  }
}
function createDatabaseUser() {
  const db = getFirestore(app);
  const docRef = doc(db, `restaurant/${auth.currentUser.uid}`);
  setDoc(docRef, {
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    photoURL: auth.currentUser.photoURL,
  })
    .then(() => {
      console.log(auth.currentUser);
      setInterval(() => {
        window.location.href = `${window.location.origin}/public/dashboard`;
      }, 5000);
    })
    .catch((error) => {
      console.log(error);
    });
}
