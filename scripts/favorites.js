import { createCardGifos } from './make_gifos_cards.js';
/**
 * Global Variables
 */
const LOCAL_STORAGE_FAVORITES = "Favorite Gifos";
const LOCAL_STORAGE_TEMPORAL_FAVORITE = "Gifo temporal Info";
const nodeHTML = document.querySelector(".gifos-wrapper");
const seeMoreBtn = document.querySelector(".links-content__button");
let startingPage = 0;
let currentPage = 1;
/**
 * Events
 */
document.querySelector(".fullsize-exit").addEventListener('click', refreshFavorites);
seeMoreBtn.addEventListener('click', seeMore);

/**
 * @method seeMore
 * @description Draw more gifos (12 per time)
 */
function seeMore() {
    startingPage++;
    currentPage++;
    drawFavorites();
}

/**
 * @method drawFavorites
 * @description Show the gifos favorites storage in local storage
 */
function drawFavorites() {
    const favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    const initialIndex = startingPage * 12;
    const finalIndex = currentPage * 12;
    const favoriteGifosSlice = favoriteGifosSelected.slice(initialIndex, finalIndex);
    if (favoriteGifosSelected.length === 0) {
        document.querySelector(".no-content").classList.remove("hidden");
        seeMoreBtn.classList.add("hidden");
        return;
    }
    if (startingPage === 0) {
        nodeHTML.innerHTML = "";
    };
    document.querySelector(".no-content").classList.add("hidden");
    createCardGifos(favoriteGifosSlice, nodeHTML, "favorites", startingPage);
    const favotiteBtnNodes = Array.from(nodeHTML.querySelectorAll(".fav-active"));
    favotiteBtnNodes.forEach(node => node.addEventListener('click', refreshFavorites));
    const maximizeBtn = Array.from(nodeHTML.querySelectorAll(".maximize"))
    maximizeBtn.forEach(node => node.addEventListener('click', temporalGifoInfo));
    const containerImg = Array.from(nodeHTML.querySelectorAll(".card-container__img"))
    containerImg.forEach(node => node.addEventListener('click', temporalGifoInfo));
    seeMoreBtn.classList.remove("hidden");
    if (favoriteGifosSelected.slice(finalIndex, finalIndex + 12).length === 0) {
        seeMoreBtn.classList.add("hidden");
    };
};

/**
 * @method refreshFavorites
 * @description Remove gifos deselected as favorite
 */
function refreshFavorites() {
    nodeHTML.innerHTML = "";
    startingPage = 0;
    drawFavorites();
    startingPage = currentPage - 1;
};

/**
 * @method temporalGifoInfo
 * @description Save temporally gifo Information in local storage
 * @param {object} e event information
 */
function temporalGifoInfo(e) {
    const gifoIndex = e.currentTarget.getAttribute('data-index');
    const favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    localStorage.setItem(LOCAL_STORAGE_TEMPORAL_FAVORITE, JSON.stringify(favoriteGifosSelected[gifoIndex]));
}

drawFavorites();


export {
    refreshFavorites
};