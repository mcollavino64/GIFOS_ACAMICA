import constant from './constants.js';
import { requestApiGifos } from './requests.js';
import { createCardGifos } from './make_gifos_cards.js';

/**
 * Global Variables
 */
const URLGifosTrending = constant.BASE_URL + "gifs/trending" + constant.API_KEY;
const left = document.querySelector(".trending-section__button-left");
const right = document.querySelector(".trending-section__button-right");
const containerGifos = document.querySelector(".carrousel-gifos");
const LEFT = "left";
const RIGHT = "right";

/**
 * Events
 */
left.addEventListener('click', () => { scroll(LEFT) });
right.addEventListener('click', () => { scroll(RIGHT) });


/**
 * @method trendingData
 * @description get trending gifod data
 * @param {string} URL
 */
const trendingData = requestApiGifos(URLGifosTrending);
trendingData.then((response) => {
    const nodeHTML = document.querySelector(".carrousel-gifos");
    window.trendingGifosInfo = response.data;
    createCardGifos(response.data, nodeHTML, "trending_type");
}).catch((error) => { console.log(error) });

/**
 * @method scroll
 * @description Give movement to Gifos Carrousel
 * @param {string} direction
 */
function scroll(direction) {
    let scrollAmount = 0;
    const distanceToScroll = 500;
    const step = 10;
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