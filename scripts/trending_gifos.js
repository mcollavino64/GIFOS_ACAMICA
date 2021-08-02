import { capitalizeFirstLetter } from './capitalizeLetter.js';
import { requestApiGifos } from './requests.js';
import constant from './constants.js';
import { selectedSuggestion } from './quest.js';


const trendingList = document.querySelector(".trending-gifos__list");
const trendingTopicsURL = constant.BASE_URL + "trending/searches" + constant.API_KEY;
let trendingTopicsArray = [];
let allTrengingTopics = "";

const trendingTopicsData = requestApiGifos(trendingTopicsURL);
trendingTopicsData.then((response) => {
    trendingTopicsArray = response.data.slice(0, 5); //seleccionar solo 5 
    topicsToLink(trendingTopicsArray);
}).catch((error) => { console.log(error) });


const topicsToLink = (array => {
    array.forEach(topic => {
        allTrengingTopics += topicsMarkup(topic);
        trendingList.innerHTML = allTrengingTopics;
        trendingList.querySelectorAll('.trending-gifos__item').forEach((button) => button.addEventListener('click', selectedSuggestion));
    });
});


const topicsMarkup = (topic => {
    return (`<li class="trending-gifos__item"><a href="#search_bar_id">${capitalizeFirstLetter(topic)}</a></li>`);
});