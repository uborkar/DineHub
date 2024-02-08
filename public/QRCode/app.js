import {
    getAuth,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    doc,
    getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { app } from "../config.js";

const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../../login";
    } else {
        const userId = user.uid;
        const db = getFirestore(app);
        const restaurantRef = doc(db, "restaurant", userId);
        getDoc(restaurantRef)
            .then((doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    const restaurantName = data.RestaurantName;
                    const numberOfTables = data.TableNo;
                    
                    const qrCodeContainer = document.querySelector(".qr-code-container");
                    for (let i = 1; i <= numberOfTables; i++) {
                        const qrCode = document.createElement("div");
                        qrCode.classList.add("qr-code");
                        qrCode.innerHTML = `
                            <h3>${restaurantName}</h3>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://shreyashpatil2002.github.io/DineHub/customer/?RestId=${userId}@table=0${i}" alt="QR Code">
                            <p>Table ${i}</p>
                            <button class="download-qr-button" 
                            data-table-number="${i}"
                            ><a download href="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://shreyashpatil2002.github.io/DineHub/customer/?RestId=${userId}@table=0${i}">Download QR Code</button>
                        `;
                        qrCodeContainer.appendChild(qrCode);
                    }

                } else {
                    console.log("User document does not exist in the 'restaurant' collection.");
                }
            })
            .catch((error) => {
                console.log("Error getting user document:", error);
            });
    }
});
document.getElementById("GoToDashboard").addEventListener("click", () => {
    window.location.href = `${window.location.origin}/public/dashboard/`;
});