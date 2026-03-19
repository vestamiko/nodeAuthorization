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
const favoritesBtn = document.getElementById("favoritesBtn");
const backBtn= document.getElementById("backBtn");

const commentsContainer = document.createElement("div");

/// megstami
const showFavoriteAds = () => {
const tokenData = JSON.parse(localStorage.getItem("token"));
    if (!tokenData) {
        alert("Prisijunk, kad matytum mėgstamus");
        return;
    }

    const userId = tokenData._id;
    const favoriteAds = allAds.filter(ad =>
        ad.likes?.some(id => id.toString() === userId.toString())
    );

    displayAds(favoriteAds);

    // rodom atgal mygtuka
    if (backBtn) {
        backBtn.style.display = "inline-block";
    }
  };
    
    
// paspaudus Megstami
if (favoritesBtn) {
    favoritesBtn.addEventListener("click", showFavoriteAds);
}

 // ATGAL I VISUS
if (backBtn) {
   backBtn.addEventListener("click", () => {
       displayAds(allAds);
       backBtn.style.display = "none";
   });
}

/// adsList login forma
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
const tokenDataRaw = localStorage.getItem("token");
const tokenData = tokenDataRaw ? JSON.parse(tokenDataRaw) : null;

if (greeting) {
  if (tokenData && tokenData.userName) {
    greeting.textContent = `Labas, ${tokenData.userName}`
  } else {
    greeting.textContent = "Labas, Guest";
  }
};

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
if (registerForm) {
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
}

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

// if (localStorage.getItem("token")) {
getAllAds();
// }

//// skelbimu atvaizdavimas

const displayAds = (adsList) => {
  currentAds = adsList;
  if (!adsContainer) return;

  adsContainer.innerHTML = "";

  const tokenData = JSON.parse(localStorage.getItem("token"));
  const role = tokenData ? tokenData.role : null;
  const loggedInUser = tokenData ? tokenData._id : null;

  adsList.forEach((ad) => {

    const card = document.createElement("div");
    card.classList.add("card");
    card.style.border = "1px solid black";

    const title = document.createElement("h3");
    title.textContent = ad.title;

    const description = document.createElement("p");
    description.textContent = ad.description;

    const price = document.createElement("p");
    price.textContent = ad.price + " Eur";

    const category = document.createElement("p");
    category.textContent = "Category: " + ad.category;

    card.append(title, description, price, category);

    /// EDIT / DELETE
    if (
      (loggedInUser && loggedInUser.toString() === ad.userID.toString()) ||
      role === "admin"
    ) {

      const buttonsContainer = document.createElement("div");
      buttonsContainer.classList.add("adButtonsContainer");

      const editBtn = document.createElement("button");
      editBtn.textContent = "EDIT";
      editBtn.setAttribute("data-id", ad._id);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "DELETE";
      deleteBtn.setAttribute("data-id", ad._id);

      buttonsContainer.append(editBtn, deleteBtn);
      card.append(buttonsContainer);

      editBtn.addEventListener("click", handleClickEdit);
      deleteBtn.addEventListener("click", handleClickDelete);
    }

    /// LIKE
    const likeBtn = document.createElement("button");

    const userHasLiked =
      loggedInUser &&
      ad.likes?.some((id) => id.toString() === loggedInUser.toString());

    likeBtn.textContent = `${userHasLiked ? "❤️" : "🤍"} ${ad.likes?.length || 0}`;

    likeBtn.addEventListener("click", async () => {

      const tokenData = JSON.parse(localStorage.getItem("token"));

      if (!tokenData?.token) {
        alert("Prisijunk, kad galėtum pamėgti");
        return;
      }

      const res = await fetch(`http://localhost:8000/ads/${ad._id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.token}`
        }
      });

      const updatedAd = await res.json();

      allAds = allAds.map(a =>
        a._id === updatedAd._id ? updatedAd : a
      );

      displayAds(allAds);
    });

    card.appendChild(likeBtn);

    /// KOMENTARAI
    const commentsContainer = document.createElement("div");
    commentsContainer.className = "comments mt-3";

    ad.comments?.forEach(c => {
      const comment = document.createElement("p");
      comment.textContent = `${c.user}: ${c.text}`;
      commentsContainer.appendChild(comment);
    });

    /// NAUJAS KOMENTARAS
    if (loggedInUser) {

      const input = document.createElement("input");
      input.placeholder = "Rašyti komentarą...";
      input.className = "form-control mb-2";

      const btn = document.createElement("button");
      btn.textContent = "Komentuoti";
      btn.className = "btn btn-sm btn-primary";

      btn.addEventListener("click", async () => {

        const text = input.value;

        if (!text) return;

        const tokenData = JSON.parse(localStorage.getItem("token"));

        await fetch(`http://localhost:8000/ads/${ad._id}/comment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`
          },
          body: JSON.stringify({ text })
        });

        getAllAds();
      });

      commentsContainer.append(input, btn);
    }

    card.appendChild(commentsContainer);

    adsContainer.appendChild(card);
  });
};

//// delete skelbimas

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
let currentAds = [];
let editingAdId = null;

const handleClickEdit = (e) => {
  const adId = e.target.getAttribute("data-id");
  const ad = currentAds.find((item) => item._id === adId);

  if (!ad) return;

  titleInput.value = ad.title;
  descriptionInput.value = ad.description;
  priceInput.value = ad.price;
  categoryInput.value = ad.category;

  editingAdId = adId;

  createAd.textContent = "Atnaujinti";
};

////// Skelbimo irasymas
if(adsForm) {
adsForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const adData = {
    title: titleInput.value,
    description: descriptionInput.value,
    price: priceInput.value,
    category: categoryInput.value,
  };

  const tokenData = JSON.parse(localStorage.getItem("token"));

  if (!tokenData?.token) {
    alert("Prisijunk");
    return;
  }

  // UPDATE
  if (editingAdId) {
    await fetch(`http://localhost:8000/ads/${editingAdId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.token}`,
      },
      body: JSON.stringify(adData),
    });

    editingAdId = null;
    createAd.textContent = "Paskelbti";
  } 
  // CREATE
  else {
    await fetch("http://localhost:8000/ads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.token}`,
      },
      body: JSON.stringify(adData),
    });
  }

  titleInput.value = "";
  descriptionInput.value = "";
  priceInput.value = "";

  getAllAds();
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