const registerForm = document.getElementById("registerForm");
const usernameInputReg = document.getElementById("usernameInputReg");
const emailInputReg = document.getElementById("emailInputReg");
const passwordInputReg = document.getElementById("passwordInputReg");
const submitReg = document.getElementById("submitReg");

const loginForm = document.getElementById("loginForm");
const emailInputLog = document.getElementById("emailInputLog");
const passwordInputLog = document.getElementById("passwordInputLog");
const submitLog = document.getElementById("submitLog");

const adsContainer = document.getElementById("adsContainer");

const categoryInput = document.getElementById("categoryInput");

const titleInput = document.getElementById("titleInput");
const descriptionInput = document.getElementById("descriptionInput");
const priceInput = document.getElementById("priceInput");
const createAd = document.getElementById("createAd");

const signOut = document.getElementById("signOut");
const greeting = document.getElementById("greeting");
const adsForm = document.getElementById("adsForm");

/// adsList
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInputLog.value,
        password: passwordInputLog.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("token", JSON.stringify(data));
        window.location.href = "index.html";
      })
      .catch((err) => console.error(err));
  });
}
///// GREETING
const tokenData = JSON.parse(localStorage.getItem("token"));
if (greeting) {
  if (tokenData) {
    greeting.innerHTML = `Labas, ${tokenData.userName}`;
  } else {
    greeting.innerHTML = `Labas, Guest`;
  }
}

//// GAUTI TOKEN IS LS
// const dataFromLS = () => {
//   return JSON.parse(localStorage.getItem("token"))
//     ? JSON.parse(localStorage.getItem("token")).userName
//     : "Guest";
// };
const dataFromLS = () => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  return tokenData ? tokenData.userName : "Guest";
};

/////  REGISTRACIJA
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = usernameInputReg.value;
  const email = emailInputReg.value.trim().toLowerCase();
  const password = passwordInputReg.value;

  console.log(name, email, password);

  fetch("http://localhost:8000/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
      alert("user registered successfully");

      registerForm.reset();
    })

    .catch((err) => console.error(err));
});

/// prisijungimas

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInputLog.value.trim().toLowerCase();
  const password = passwordInputLog.value.trim();

  fetch("http://localhost:8000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);

      localStorage.setItem("token", JSON.stringify(data));

      greeting.innerHTML = `Labas, ${dataFromLS}`;

      loginForm.reset();

      getAllAds();
    })
    .catch((err) => console.error(err));
});

////// visu skelbimu gavimas
let allAds = [];
const getAllAds = async () => {
  const tokenData = JSON.parse(localStorage.getItem("token"));

  if (!tokenData || !tokenData.token) {
    console.log("No token, please login");
    if (greeting) {
      greeting.innerHTML = `Labas, ${dataFromLS()}`;
    } else {
      if (greeting) {
        greeting.innerHTML = `Labas, ${dataFromLS()}`;
      }
    }
  }
  fetch("http://localhost:8000/ads/all")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      return res.json();
    })
    .then((ads) => {
      console.log(ads);
      allAds = ads;
      displayAds(ads);
    })
    .catch((err) => console.log(err));
};

categoryInput.addEventListener("change", (e) => {
  {
    const selectedCategory = e.target.value;
    console.log(selectedCategory);
    if (selectedCategory === "all") {
      displayAds(allAds);
    } else {
      const filteredAds = allAds.filter(
        (ad) => ad.category === selectedCategory
      );
      displayAds(filteredAds);
    }
  }
});

getAllAds();

//// skelbimu atvaizdavimas

const displayAds = (adsList) => {
  if (!adsContainer) return;
  adsContainer.innerHTML = "";

  const tokenData = JSON.parse(localStorage.getItem("token"));
  const role = tokenData ? tokenData.role : null;
  const loggedInUser = tokenData ? tokenData._id : null;
  console.log(loggedInUser);

  adsList.forEach((ad) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.border = "1px solid black";

    const title = document.createElement("h3");
    title.textContent = ad.title;

    const description = document.createElement("p");
    description.textContent = ad.description;

    const price = document.createElement("p");
    price.textContent = ad.price + "Eur";

    const category = document.createElement("p");
    category.textContent = "Category: " + ad.category;

    card.append(title, description, price, category);
    adsContainer.append(card);

    if (
      (loggedInUser && loggedInUser.toString() === ad.userID.toString()) ||
      role === "admin"
    ) {
      const buttonsContainer = document.createElement("div");
      buttonsContainer.setAttribute("class", "adButtonsContainer");

      const editBtn = document.createElement("button");
      editBtn.textContent = "EDIT";
      editBtn.classList.add("edit");
      editBtn.setAttribute("data-id", ad._id);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "DELETE";
      deleteBtn.classList.add("delete");
      deleteBtn.setAttribute("data-id", ad._id);

      buttonsContainer.append(editBtn, deleteBtn);
      card.append(buttonsContainer);

      editBtn.addEventListener("click", handleClickEdit);
      deleteBtn.addEventListener("click", handleClickDelete);
    }
    // LIKE BUTTON
    const likeBtn = document.createElement("button");
    const userHasLiked =
      loggedInUser &&
      ad.likes?.some((id) => id.toString() === loggedInUser.toString());
    likeBtn.textContent = `${userHasLiked ? "❤️" : "🤍"} ${
      ad.likes?.length || 0
    }`;
    likeBtn.addEventListener("click", async () => {
      const tokenData = JSON.parse(localStorage.getItem("token"));
      if (!tokenData || !tokenData.token) {
        alert("Prisijunk, kad galėtum pamėgti");
        return;
      }
      const res = await fetch(`http://localhost:8000/ads/${ad._id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      if (!res.ok) {
        alert("Klaida bandant pamėgti skelbimą");
        return;
      }

      const updatedAd = await res.json();
      console.log("updated ad", updatedAd);
      // 🟢 Atnaujinam tik šitą mygtuką
      const likedNow = updatedAd.likes?.some(
        (id) => id.toString() === loggedInUser.toString()
      );
      likeBtn.textContent = `${likedNow ? "❤️" : "🤍"} ${
        updatedAd.likes?.length || 0
      }`;
    });
    card.appendChild(likeBtn);
  });
};

//// delete skelbimas
// const handleClickDelete = (e) => {
//   const adId = e.target.getAttribute("data-id");
//   const token = JSON.parse(localStorage.getItem("token")).token;
//   console.log(adId);

//   fetch(`http://localhost:8000/ads/${adId}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       authorization: `Bearer ${token}`,
//     },
//   })
//     .then((resp) => {
//       if (!resp.ok) {
//         throw new Error(`Server responded with status ${resp.status}`);
//       }
//       return resp.json();
//     })
//     .then((data) => {
//       console.log(data);
//       alert("Skelbimas istrintas");
//       getAllAds();
//     })
//     .catch((err) => console.error(err));
// };

const handleClickDelete = (e) => {
  const adId = e.target.getAttribute("data-id");
  const tokenData = JSON.parse(localStorage.getItem("token"));
  fetch(`http://localhost:8000/ads/${adId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${tokenData.token}`,
    },
  })
    .then(() => getAllAds())
    .catch((err) => console.error(err));
};

//// edit skelbimas
// const handleClickEdit = (e) => {
//   const adId = e.target.getAttribute("data-id");
//   const newTitle = prompt("Enter new title:");
//   const newDescription = prompt("Enter new description:");
//   const newPrice = prompt("Enter new price:");
//   const token = JSON.parse(localStorage.getItem("token")).token;
//   console.log(adId);

//   const updatedAd = {
//     title: newTitle,
//     description: newDescription,
//     price: newPrice,
//   };
//   fetch(`http://localhost:8000/ads/${adId}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(updatedAd),
//   })
//     .then((resp) => {
//       if (!resp.ok) {
//         throw new Error(`Server responded with status ${resp.status}`);
//       }
//       return resp.json();
//     })
//     .then((data) => {
//       console.log(data);
//       alert("Skelbimas atnaujintas");
//       getAllAds();
//     })
//     .catch((err) => console.error(err));
// };

const handleClickEdit = (e) => {
  const adId = e.target.getAttribute("data-id");
  const tokenData = JSON.parse(localStorage.getItem("token"));
  const title = prompt("Naujas pavadinimas:");
  const description = prompt("Naujas aprašymas:");
  const price = prompt("Nauja kaina:");
  const category = prompt("Nauja kategorija:");
  if (!title || !description || !price || !category) return;
  fetch(`http://localhost:8000/ads/${adId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenData.token}`,
    },
    body: JSON.stringify({ title, description, price, category }),
  })
    .then(() => getAllAds())
    .catch((err) => console.error(err));
};

////// Skelbimo irasymas
if (adsForm) {
  adsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const adContent = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      price: priceInput.value.trim(),
      category: categoryInput.value,
    };
    if (!adContent.category) {
      alert("Pasirinkite kategorija");
      return;
    }
    if (categoryInput.value === "all") {
      alert("Negalima pasirinkti 'Visi' kaip kategorijos");
      return;
    }

    const token = JSON.parse(localStorage.getItem("token")).token;
    console.log(token);

    if (!token) {
      console.log("No JWT token. Please Log in");
      return;
    }

    fetch("http://localhost:8000/ads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(adContent),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`Server responded with status ${resp.status}`);
        }
        return resp.json();
      })
      .then((data) => {
        console.log(data);
        alert("Skelbimas sukurtas!");
        getAllAds();
      })
      .catch((err) => console.error(err));
  });
}

//// sign out
if (signOut) {
  signOut.addEventListener("click", () => {
    localStorage.removeItem("token");
    alert("vartotojas atjungtas");

    getAllAds();
  });
}
