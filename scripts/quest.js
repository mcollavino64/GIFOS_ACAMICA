import { displaySuggestions } from './suggestions.js';
import { createCardGifos } from './make_gifos_cards.js';
import { requestAutocomplete, requestGifosSearch } from './requests.js';
import { capitalizeFirstLetter } from './capitalizeLetter.js';
import constant from './constants.js';


const searchBarState = {
    INITIAL: "initial",
    WITH_SUGGESTIONS: "with_suggestions",
    WITHOUT_SUGGESTIONS: "without_suggestions",
    AFTER_SEARCH: "after_search",
}
const UrlSearch = constant.BASE_URL + "gifs/search" + constant.API_KEY;
const autoCompleteURL = constant.BASE_URL + "gifs/search/tags" + constant.API_KEY;
const InputSearch = document.querySelector(".finder-bar__input");
const seeMoreBtn = document.querySelector(".searching__button");
const finderBarBtn = document.querySelector(".finder-bar__button");
const suggestionsBox = document.querySelector(".search-gifos__sugerencias");
const searchClose = document.querySelector(".search-gifos__close");




let isCurrentlySearching = false;
let currentPage = 0;

InputSearch.addEventListener('keyup', InputKeyEvent);
searchClose.addEventListener('click', closeEvent);
finderBarBtn.addEventListener('click', searchClick);
seeMoreBtn.addEventListener('click', seeMore);


function requestGifos(page = 0) {
    const gifosData = requestGifosSearch(UrlSearch, InputSearch.value, page);
    gifosData.then((response) => {
        if (response.data.length === 0 & page === 0) {
            document.querySelector(".no_search_results").classList.remove("hidden");
            document.querySelector(".gifos-wrapper").innerHTML = "";
            return;
        }
        if (response.data.length === 0 & page != 0) {
            seeMoreBtn.classList.add("hidden");
            return;
        }
        seeMoreBtn.classList.remove("hidden");
        const nodeHTML = document.querySelector(".gifos-wrapper");
        if (page === 0) {
            nodeHTML.innerHTML = "";
            window.searchedGifosInfo = response.data;
        } else {
            window.searchedGifosInfo = [...window.searchedGifosInfo || [], ...response.data];
        }
        createCardGifos(response.data, nodeHTML, "search_type", page);

    }).catch((error) => { console.log(error) });
}


function displayGifosSection() {
    document.querySelector(".searching__title").textContent = capitalizeFirstLetter(InputSearch.value);
    document.querySelector(".searching").classList.remove("hidden");
    document.querySelector(".no_search_results").classList.add("hidden");
    seeMoreBtn.classList.add("hidden");
}

function closeEvent() {
    updateSearchBarState(searchBarState.INITIAL)
}

function searchClick() {
    updateSearchBarState(searchBarState.AFTER_SEARCH);
    searchGifos();
}
// ------------


function calledSuggestions() {
    const autoCompleteData = requestAutocomplete(autoCompleteURL, InputSearch.value);
    autoCompleteData.then((response) => {
        if (response.data.length === 0) {
            updateSearchBarState(searchBarState.WITHOUT_SUGGESTIONS);
            isCurrentlySearching = false;
            return;
        }
        displaySuggestions(response.data);
        const suggestionList = document.querySelectorAll(".search-gifos__suggestion");
        suggestionList.forEach((element) => element.addEventListener('click', selectedSuggestion));
        updateSearchBarState(searchBarState.WITH_SUGGESTIONS);
        isCurrentlySearching = false;
    }).catch((error) => { console.log(error) });
}


function updateSearchBarState(state) {

    switch (state) {
        case searchBarState.INITIAL:
            InputSearch.value = "";
            suggestionsBox.innerHTML = "";
            suggestionsBox.classList.add("hidden");
            searchClose.classList.add("hidden");
            finderBarBtn.classList.remove("search-gifos__search");
            finderBarBtn.classList.remove("hidden");
            break;
        case searchBarState.WITH_SUGGESTIONS:
            suggestionsBox.classList.remove("hidden");
            finderBarBtn.classList.add("search-gifos__search");
            searchClose.classList.remove("hidden");
            break;
        case searchBarState.WITHOUT_SUGGESTIONS:
            suggestionsBox.innerHTML = "";
            suggestionsBox.classList.add("hidden");
            searchClose.classList.remove("hidden");
            finderBarBtn.classList.remove("hidden");
            finderBarBtn.classList.add("search-gifos__search");
            break;
        case searchBarState.AFTER_SEARCH:
            suggestionsBox.innerHTML = "";
            suggestionsBox.classList.add("hidden");
            finderBarBtn.classList.add("search-gifos__search");
            searchClose.classList.remove("hidden");
            finderBarBtn.classList.add("hidden");
            break;
        default:
            break;
    }
}

// ---------------------

function InputKeyEvent(e) {
    const isEnterKey = e.keyCode === 13;
    if (isEnterKey === true) {
        updateSearchBarState(searchBarState.AFTER_SEARCH);
        searchGifos();
        return;
    }
    if (InputSearch.value === "") {
        updateSearchBarState(searchBarState.INITIAL);
        isCurrentlySearching = false;
        return;
    }
    if (isCurrentlySearching) {
        return;
    }
    isCurrentlySearching = true;
    calledSuggestions();
}


function seeMore() {
    currentPage++;
    requestGifos(currentPage);
}

function selectedSuggestion(e) {
    currentPage = 0;
    InputSearch.value = e.target.innerText;
    updateSearchBarState(searchBarState.AFTER_SEARCH);
    searchGifos();
}

function searchGifos() {
    displayGifosSection()
    requestGifos();
}

// ------------

export {
    selectedSuggestion
};