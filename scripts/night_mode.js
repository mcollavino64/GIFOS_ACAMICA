
const NIGHT_MODE = "Night Mode";

const lightThemeLink = document.querySelector(".day-mode");
const darkThemeLink = document.querySelector(".night-mode");
const film = document.querySelector(".film");
const camera = document.querySelector(".camera");
const logo = document.querySelector(".bar-navigation__logo");

lightThemeLink.addEventListener("click", changeMode);

darkThemeLink.addEventListener("click", changeMode);

function checkMode() {
    if (localStorage.getItem(NIGHT_MODE) === "true") {
        document.querySelector("body").classList.add("dark");
        darkThemeLink.classList.add("hidden");
        lightThemeLink.classList.remove("hidden");
        logo.src = "./assets/logo-mobile_nigh.svg";
        if (camera) {
            camera.src = "./assets/camara-modo-noc.svg";
            film.src = "./assets/pelicula-modo-noc.svg";
        };
    };
};

function changeMode(e) {
    document.querySelector("body").classList.toggle("dark");
    if (e.target.innerHTML === "Modo Nocturno") {
        localStorage.setItem(NIGHT_MODE, "true");
        darkThemeLink.classList.add("hidden");
        lightThemeLink.classList.remove("hidden");
        logo.src = "./assets/logo-mobile_nigh.svg";
        if (camera) {
            camera.src = "./assets/camara-modo-noc.svg";
            film.src = "./assets/pelicula-modo-noc.svg";
        };
    } else {
        localStorage.setItem(NIGHT_MODE, "false");
        darkThemeLink.classList.remove("hidden");
        lightThemeLink.classList.add("hidden");
        logo.src = "./assets/logo-mobile.svg";
        if (camera) {
            camera.src = "./assets/camara.svg";
            film.src = "./assets/pelicula.svg";
        };
    };
};


checkMode();