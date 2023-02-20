const API_KEY = "a51384de-b625-4dd5-a3e5-c3fffc565925";
const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

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
  const muviesAll = document.querySelector(".muvies");

  muviesAll.innerHTML = ""; //очищаем список предычущих фильмов

  data.films.forEach((muvie) => {
    const muvieAll = document.createElement("div");
    muvieAll.classList.add("muvie__card");
    muvieAll.innerHTML = `<div class="muvie__cover-inner">
    <img src="${muvie.posterUrlPreview}"
        alt="${muvie.nameRu}" class="muvie__cover">
    <div class="muvie__cover--dark"></div>
</div>
<div class="muvie__info">
    <div class="muvie__title">${muvie.nameRu}</div>
    <div class="muvie__category">${muvie.genres.map(
      (genre) => ` ${genre.genre}`
    )}</div>

    <div class="muvie__reiting muvie__reiting--${getClassByRating(
      muvie.rating
    )}">${muvie.rating}</div>
</div>`;
    muviesAll.appendChild(muvieAll);
  });
}

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
