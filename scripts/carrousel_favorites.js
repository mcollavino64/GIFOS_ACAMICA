import constant from './constants.js';
import { requestApiGifos } from './requests.js';
import { createCardGifos } from './make_gifos_cards.js';
import { refreshFavorites } from "./favorites.js";



const URLGifosTrending = constant.BASE_URL + "gifs/trending" + constant.API_KEY;
const containerGifos = document.querySelector(".carrousel-gifos");
const right = document.querySelector(".trending-section__button-right");
const left = document.querySelector(".trending-section__button-left");
const RIGHT = "right";
const LEFT = "left";


left.addEventListener('click', () => { scroll(LEFT) });
right.addEventListener('click', () => { scroll(RIGHT) });


//traer informacion de los trending
const trendingData = requestApiGifos(URLGifosTrending);
trendingData.then((response) => {
    const nodeHTML = document.querySelector(".carrousel-gifos");
    window.trendingGifosInfo = response.data;

    createCardGifos(response.data, nodeHTML, "trending_type");
    const favActiveBtnNodes = Array.from(nodeHTML.querySelectorAll(".fav-active"));

    favActiveBtnNodes.forEach(node => node.addEventListener('click', refreshFavorites));
    const favHoverBtnNodes = Array.from(nodeHTML.querySelectorAll(".fav-hover"));
    
    favHoverBtnNodes.forEach(node => node.addEventListener('click', refreshFavorites));
}).catch((error) => { console.log(error) });

//agregar moviemiento al carrousel
function scroll(direction) {
   
    const step = 10;
    const distanceToScroll = 500;
    let scrollAmount = 0;
    
    
    const slideTimer = setInterval(function() {
        if (direction === "right") {
            containerGifos.scrollLeft += step;
        } else {
            containerGifos.scrollLeft -= step;
        }
        scrollAmount += step;
        if (scrollAmount >= distanceToScroll) {
            window.clearInterval(slideTimer);
        }
    }, 10);
}