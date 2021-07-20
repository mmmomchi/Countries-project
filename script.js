const regionBtn = document.querySelector(".region__btn");
const AllCountriesBtn = document.querySelector(".all__countries__btn");
const navItems = document.querySelectorAll(".nav__item");
const navContainer = document.querySelector(".navbar");
const countriesContainer = document.querySelector(".countries__container");
const dropDownRegions = document.querySelector(".dropdown");
const searchBtn = document.querySelector("#country__search");
const searchInput = document.querySelector("#country__input");
const modalContainer = document.querySelector(".modal__container");
const homeBtn = document.querySelector(".home__btn");
const myLocationBtn = document.querySelector(".my__location");

/////FUNCTIONS/////
function getRegionCountries(contiName) {
  // Get data from the API
  fetch(`https://restcountries.eu/rest/v2/region/${contiName}`)
    .then((response) => response.json())
    .then((data) => {
      // Make an array with the name of each country
      let countryNames = [];
      data.forEach(function (val) {
        countryNames.push(val.name);
      });
      // Render countries
      renderCountries(countryNames);
      // Display region`
      countriesContainer.innerHTML = `<h1 class="info">Showing countries from the ${
        contiName[0].toUpperCase() + contiName.slice(1)
      } region.</h1> `;
    })
    .catch((err) => console.error(err));
}

function getAllCountries() {
  fetch("https://restcountries.eu/rest/v2/all")
    .then((response) => response.json())
    .then((data) => {
      let countriesArr = [];
      data.forEach((country) => countriesArr.push(country.name));
      countriesContainer.innerHTML = `<h1 class="info">Showing all countries</h1> `;
      renderCountries(countriesArr);
    })
    .catch((err) => console.log(err));
}

function renderCountries(countryArr) {
  // Make the data compatiable with the API
  const fixedCountryArr = countryArr.map((val) => val.toLowerCase());

  //Get data for each country
  fixedCountryArr.forEach(function (countryName) {
    fetch(`https://restcountries.eu/rest/v2/name/${countryName}`)
      .then((response) => {
        if (!response.ok)
          throw new Error(`There is a problem with the REST API`);
        return response.json();
      })
      .then((data) => {
        let country = data[0];
        let html = `<div class="country">
        <img class='flag' src="${country.flag}" alt="FLAG" />
        <h2>${country.name}</h2>
        <h5 id='country__region'>${country.region}</h5>
       <button class='btns more' data-name='${country.name.toLowerCase()}' >learn more</button>
      </div>`;

        countriesContainer.insertAdjacentHTML("beforeend", html);
      })
      .catch((err) => console.error(err));
  });
}

function renderPopup(countryName) {
  fetch(`https://restcountries.eu/rest/v2/name/${countryName}`)
    .then((response) => {
      if (!response.ok) throw new Error(`There is a problem with the REST API`);
      return response.json();
    })
    .then((data) => {
      let countryInfo = data[0];
      let html = `
        <div class="modal">
        <img  src="${countryInfo.flag}" alt="FLAG" />
        <div class="country__data">
      <h3 >${countryInfo.name}</h3>
      <h4 cl>${countryInfo.region}</h4>
      <p><span>👫</span>${(+countryInfo.population / 1000000).toFixed(
        2
      )} million people</p>
      <p><span>🗣️</span>${countryInfo.languages[0].name}</p>
      <p><span>💰</span>${countryInfo.currencies[0].name}</p>
    </div>
    <p id='modal__paragraph'>${countryInfo.name} has a population of ${(
        +countryInfo.population / 1000000
      ).toFixed(2)} million people. It is situated in the ${
        countryInfo.region
      } region and it's capital city is ${
        countryInfo.capital
      }. The main language is ${countryInfo.languages[0].name}.</p>
        <button class='btns close'>Close</button>
        </div>`;

      document
        .querySelector(".modal__container")
        .insertAdjacentHTML("beforeend", html);
    })
    .catch((err) => console.error(err));
}

//helper functions//
function blurOnOff() {
  countriesContainer.classList.toggle("is__blurred");
  document.querySelector("#header").classList.toggle("is__blurred");
  document.querySelector("footer").classList.toggle("is__blurred");
  modalContainer.classList.toggle("hidden");
}

//making the geolocation API to return a promise.
function getCoords() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

/////EVENTS/////

//dropping down the dropdown menu :D
regionBtn.addEventListener("click", function () {
  dropDownRegions.classList.toggle("hidden");
});

//Selecting and visualising region countries
navContainer.addEventListener("click", function (e) {
  const continentEl = e.target.closest(".nav__item");
  if (e.target != continentEl) return;

  getRegionCountries(continentEl.dataset.name);
  dropDownRegions.classList.toggle("hidden");
});

//Visualising all countries
AllCountriesBtn.addEventListener("click", function () {
  countriesContainer.innerHTML = "";
  getAllCountries();
});

//Searching for a country
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  countriesContainer.innerHTML = "";
  renderCountries([searchInput.value]);
  searchInput.value = "";
});

//Loading more info
countriesContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("more")) return;
  renderPopup(e.target.dataset.name);
  blurOnOff();
});

//closing more info
modalContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("close")) return;
  blurOnOff();
  modalContainer.innerHTML = "";
});

//displaying the main content
homeBtn.addEventListener("click", () => location.reload());

//displaying a country from longitude and latitude properties.
myLocationBtn.addEventListener("click", function () {
  getCoords()
    .then((response) =>
      fetch(
        `https://geocode.xyz/${response.coords.latitude},${response.coords.longitude}?geoit=json`
      )
    )
    .then((response) => {
      if (!response.ok)
        throw new Error(
          "Geocode.xyz has a usage limit. Try again in a few minutes. "
        );
      return response.json();
    })
    .then((data) => {
      countriesContainer.innerHTML = "";
      renderCountries([data.country]);
    })
    .catch((err) => console.error(err));
});
