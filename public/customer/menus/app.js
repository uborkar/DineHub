import { app } from "../../config.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const DineCust = localStorage.getItem("DineCust");
const restId = JSON.parse(DineCust).restId;

// gettings all the foodItems from the database
const db = getFirestore(app);
const collectionRef = collection(db, "restaurant", restId, "foodItem");

onSnapshot(collectionRef, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      if (change.doc.data().available === "false") {
        return;
      }
      const foodItem = change.doc.data();
      const menuElement = document.getElementById("menu");
      const category = foodItem.itemCategory;
      const categoryHeadingId = `category-${category.replace(/\s/g, "-")}`;

      if (!document.getElementById(categoryHeadingId)) {
        const categoryHeading = document.createElement("h2");
        categoryHeading.textContent = category;
        categoryHeading.id = categoryHeadingId;
        menuElement.appendChild(categoryHeading);
      }

      let itemList = document.querySelector(`#${categoryHeadingId} + .itemList`);
      if (!itemList) {
        itemList = document.createElement("div");
        itemList.classList.add("itemList");
        menuElement.appendChild(itemList);
      }

      const foodItemElement = document.createElement("div");
      foodItemElement.classList.add("foodItem");
      foodItemElement.id = change.doc.id;
      const MAX_DESCRIPTION_LENGTH = 5;

      const truncatedDescription = foodItem.itemDesc
        .split(" ")
        .slice(0, MAX_DESCRIPTION_LENGTH)
        .join(" ");

      // Add dots if the description was truncated
      const description =
        foodItem.itemDesc.length > MAX_DESCRIPTION_LENGTH
          ? truncatedDescription + "..."
          : truncatedDescription;

      foodItemElement.innerHTML = `
        <img src="${foodItem.itemImg}" alt="${foodItem.itemName}" />
        <h3>${foodItem.itemName}</h3>
        <p>Description: ${description}</p>
        <p>Price: $${foodItem.itemPrice}</p>
        <button>Add to Cart</button>
      `;

      itemList.appendChild(foodItemElement);
    }
    if (change.type === "modified") {
      if (change.doc.data().available === "false") {
        document.getElementById(change.doc.id).style.display = "none";
      }
      if (change.doc.data().available === "true") {
        document.getElementById(change.doc.id).style.display = "block";
      }
    }
    if (change.type === "removed") {
      document.getElementById(change.doc.id).remove();
    }
  });
});
