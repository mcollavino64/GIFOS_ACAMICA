import { capitalizeFirstLetter } from './capitalizeLetter.js';
const suggestionsBox = document.querySelector(".search-gifos__sugerencias");

//traer sugerencias informacion
function displaySuggestions(suggestions) {
    if (suggestions.length) {
        let htmlSuggestions = ""
        suggestions.forEach(element => {
            htmlSuggestions += suggestionMarkUp(capitalizeFirstLetter(element.name));
            suggestionsBox.innerHTML = htmlSuggestions;
        });
    }
};

//pintar las sugerencias
const suggestionMarkUp = ((suggestion) => {
    return (
        `<li class="search-gifos__suggestion"><a class="suggestion-selected"><i class="icon-icon-finder"></i>${suggestion}</a></li>`
    );
});

export {

    displaySuggestions
};