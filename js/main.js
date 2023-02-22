const API_KEY = "a51384de-b625-4dd5-a3e5-c3fffc565925";
const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MUVIE_INFO =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/";

getMuvies(API_URL_POPULAR);

async function getMuvies(url) {
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "X-API-KEY": API_KEY,
      "Content-Type": "application/json",
    },
  });
  const respData = await resp.json();
  console.log(respData);

  showMuvies(respData);
}

function getClassByRating(rat) {
  if (rat >= 7) {
    return "green";
  } else if (rat > 5) {
    return "orange";
  } else {
    return "red";
  }
}

function showMuvies(data) {
  const muviesEll = document.querySelector(".muvies");

  muviesEll.innerHTML = ""; //очищаем список предычущих фильмов

  data.films.forEach((muvie) => {
    const muvieEll = document.createElement("div");
    muvieEll.classList.add("muvie__card");
    muvieEll.innerHTML = `<div class="muvie__cover-inner">
    <img src="${muvie.posterUrlPreview}"
        alt="${muvie.nameRu}" class="muvie__cover">
    <div class="muvie__cover--dark"></div>
</div>
<div class="muvie__info">
    <div class="muvie__title">${muvie.nameRu}</div>
    <div class="muvie__category">${muvie.genres.map(
      (genre) => ` ${genre.genre}`
    )}</div>
    ${showRating()}
</div>`;
    muvieEll.addEventListener("click", () => openModal(muvie.filmId));
    muviesEll.appendChild(muvieEll);

    function showRating() {
      if (Number(muvie.rating)) {
        return `<div class="muvie__reiting muvie__reiting--${getClassByRating(
          muvie.rating
        )}">${muvie.rating}</div>`;
      } else {
        return "";
      }
    }
  });
}

// форма ввода
const form = document.querySelector(".header__form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMuvies(apiSearchUrl);
  }
  search.value = "";
});

// модалка
const modalEll = document.querySelector(".modal");
async function openModal(id) {
  const resp = await fetch(API_URL_MUVIE_INFO + id, {
    method: "GET",
    headers: {
      "X-API-KEY": API_KEY,
      "Content-Type": "application/json",
    },
  });

  const respData = await resp.json();
  console.log(respData);
  modalEll.classList.add("modal--show");
  document.body.classList.add("stop-scrolling");
  modalEll.innerHTML = `
<div class="modal__card">
<img src="${respData.data.posterUrl}" alt="" class="modal__movie-backdrop">
<h2>
    <span class="modal__muvie-title">${respData.data.nameRu}</span>
    <span class="modal__muvie-release-year">${showDate(
      respData.data.year
    )}</span>
</h2>
<ul class="modal__muvie-info">
    <div class="loader"></div>
    <li class="modal__muvie-genre">${respData.data.genres.map(
      (genre) => ` ${genre.genre}`
    )}</li>
    ${
      respData.data.filmLength
        ? `<li class="modal__muvie-runtime">Продолжительность: ${respData.data.filmLength}</li>`
        : ""
    }
    <li><a href="${
      respData.data.webUrl
    }" class="modal__muvie-site">Перейти к просмотру</a></li>
    ${
      respData.data.description
        ? `<li class="modal__muvie-owerwiew">${respData.data.description}</li>`
        : ""
    }

    <button class="modal__button-close" type="button">Закрыть</button>
</ul>
</div>
`;
  const buttonClose = document.querySelector(".modal__button-close");
  buttonClose.addEventListener("click", () => closeModal());
}

function showDate(year) {
  if (year) {
    return year;
  }
  return "";
}
function closeModal() {
  modalEll.classList.remove("modal--show");
  document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
  if (e.target === modalEll) closeModal();
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) closeModal();
});
