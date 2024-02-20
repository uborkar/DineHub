import { app } from "../../config.js";
import {
  getFirestore,
  collection,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const DineCust = localStorage.getItem("DineCust");
const restId = JSON.parse(DineCust).restId;

// gettings all the foodItems from the database
const db = getFirestore(app);
const itemId = window.location.search.split("=")[1];

const foodItemRef = doc(db, "restaurant", restId, "foodItem", itemId);
getDoc(foodItemRef)
  .then((doc) => {
    if (doc.exists()) {
      showItem(doc.data());
    } else {
      console.log("No such document!");
    }
  })
  .catch((error) => {
    console.log("Error getting document:", error);
  });

const showItem = (data) => {
  const item = document.getElementById("foodItem");
  item.innerHTML = `
  <div id="item">
  <div class="item_img">
    <img
      src="${data.itemImg}"
      alt="${data.itemName}"
    />
  </div>
  <div class="item_review">
  <a href="./review/?itemId=${itemId}">
    <div>
      <p><span class="material-symbols-outlined"> chat </span> 32+</p>
      Reviews
    </div>
  </a>
    <div id="line"></div>
    <div>
      <p><span class="material-symbols-outlined"> star </span> ${data.rating}</p>
      Ratings
    </div>
  </div>
  <div class="item_info">
    <div class="item_info_left">
      <h2>${data.itemName}</h2>
      <span>₹ <b>${data.itemPrice}</b></span>
    </div>
    <div class="item_info_right" id="${itemId}">
      <button id="decrement" onclick="decrement(this)">-</button>
      <input type="text" id="quantity" value="1" disabled />
      <button id="increment" onclick="increment(this)">+</button>
    </div>
  </div>
  <div class="item_description">
    <h3>Description</h3>
    <p>
      ${data.itemDesc}
    </p>
  </div>
</div>`;
};
