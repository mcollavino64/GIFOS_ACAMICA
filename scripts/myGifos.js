import { requestApiGifos } from './requests.js';

import constant from './constants.js';


let startingPage = 0;
let currentPage = 1;

// *************************************
const LOCAL_STORAGE_MYGIFS = "My Gifos";
// *************************************

//ojo
const nodeHTML = document.querySelector(".gifos-wrapper");

const baseURL_downloadGif = constant.BASE_URL + "gifs";

const seeMoreBtn = document.querySelector(".links-content__button");


document.querySelector(".my-gifos__fullsize-exit").addEventListener('click', refreshMyGifs);

seeMoreBtn.addEventListener('click', seeMore);

// Draw gifos (12)
function seeMore() {
    startingPage++;
    currentPage++;
    drawMyGifs(window.my_gifsInfo);
}

// Get IDs from local storage
function getGifosIds() {
    let stringIds = [];
    const uploadedGifos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MYGIFS)) || [];
    console.log(uploadedGifos);
    uploadedGifos.forEach(gifo => {
        stringIds.push(gifo.id);
    });
    stringIds = stringIds.join();
    console.log(stringIds);
    return stringIds;
}

/**
 * @method downloadmy_gifs
 * @description Download Gifo Data from Giphy
 */
function downloadmy_gifs() {
    const gifosIds = getGifosIds();
    const completeURL = `${baseURL_downloadGif}${constant.API_KEY}&ids=${gifosIds}`;
    console.log(completeURL);
    const downloadmy_gifs = requestApiGifos(completeURL);
    downloadmy_gifs.then(gifosData => {
            window.my_gifsInfo = gifosData.data;
            drawMyGifs(gifosData.data);
            if (currentPage > 1) {
                startingPage = currentPage - 1
            };
        })
        .catch((error) => { console.log(error) });
};

/**
 * @method drawMyGifs
 * @description Show gifos uploaded by user
 * @param {object} gifosData
 */
function drawMyGifs(gifosData) {
    const initialIndex = startingPage * 12;
    const finalIndex = currentPage * 12;
    const gifosDataSlice = gifosData.slice(initialIndex, finalIndex);

    if (gifosData.length === 0) {
        document.querySelector(".no-content").classList.remove("hidden");
        seeMoreBtn.classList.add("hidden");
        return;
    }
    if (startingPage === 0) {
        nodeHTML.innerHTML = "";
    };
    document.querySelector(".no-content").classList.add("hidden");
    makemy_gifsCards(gifosDataSlice, nodeHTML, startingPage);
    const deleteBtnNodes = Array.from(nodeHTML.querySelectorAll(".delete"));
    deleteBtnNodes.forEach(node => node.addEventListener('click', refreshMyGifs));

    if (gifosData.slice(finalIndex, finalIndex + 12).length === 0) {
        seeMoreBtn.classList.add("hidden");
    };
};

/**
 * @method refreshMyGifs
 * @description Remove gifos deleted by user
 */
function refreshMyGifs() {
    nodeHTML.innerHTML = "";
    startingPage = 0;
    downloadmy_gifs();
};

/**
 * @method makemy_gifsCards
 * @description Get gifos data and create cards
 * @param {array} gifosInfo
 * @param {object} nodeHTML
 * @param {number} page
 */
function makemy_gifsCards(gifosInfo, nodeHTML, page = 0) {
    const htmlgifos = gifosInfo.map((gifo, index) => {
        const gifoURL = gifo.images.original.url;
        const gifoUser = gifo.username;
        const gifoTitle = gifo.title;
        return marginCard(gifoURL, gifoUser, gifoTitle, index + (page * 12));
    });
    nodeHTML.innerHTML += htmlgifos.join("\n");
    nodeHTML.querySelectorAll('.my-gifos__button_card').forEach((button) => button.addEventListener('click', buttonAction));
    nodeHTML.querySelectorAll('.my-gifos__card-container__img').forEach((image) => image.addEventListener('click', buttonAction));
};

/**
 * @method marginCard
 * @description Card marking method
 * @param {string} url
 * @param {string} user
 * @param {string} title
 * @param {number} index
 * @returns {string}
 */
const marginCard = ((url, user, title, index) => {
    return (
        `<div class="card-container">
        <img class="my-gifos__card-container__img" src="${url}" alt="Gifo" data-typemy_gifs="maximize" data-indexmy_gifs="${index}">
        <div class="cover-overlay">
            <div class="card-container__buttons">
                <button class="my-gifos__button_card delete" data-typemy_gifs="delete" data-indexmy_gifs="${index}" type="button"><i class="icon-icon_trash"></i></i></button>
                <button class="my-gifos__button_card" data-typemy_gifs="download" data-indexmy_gifs="${index}" type="button"><i class="icon-icon-download"></i></button>
                <button class="my-gifos__button_card maximize" data-typemy_gifs="maximize" data-indexmy_gifs="${index}" type="button"><i class="icon-icon-max"></i></button>
            </div>
            <div class="card-container__info">
                <p class="my-gifos__card__user">${user}</p>
                <p class="my-gifos__card__title">${title}</p>
            </div>
        </div>
    </div>`
    );
});


/**
 * @method buttonAction
 * @description select function to be executed accordint to button type
 * @param {object} e event information 
 */
function buttonAction(e) {
    const gifoIndex = e.currentTarget.getAttribute('data-indexmy_gifs');
    const gifoInfo = getGifoInformation(gifoIndex);
    const deleteFrom = e.currentTarget.getAttribute('data-delete');
    switch (e.currentTarget.getAttribute('data-typemy_gifs')) {
        case "delete":
            removeFGifo(gifoInfo[3]);
            if (deleteFrom === "full-screen") {
                refreshMyGifs();
                toggleModal();
            };
            break;
        case "download":
            downloadGifo(gifoInfo[0]);
            break;
        case "maximize":
            maximizeGifo(gifoInfo);
            maximizeButtonsConf(gifoIndex);
            break;
        default:
            break;
    };
};

/**
 * @method getGifoInformation
 * @description Get Gifo information
 * @param {number} gifoIndex
 * @returns {array}
 */
function getGifoInformation(gifoIndex) {
    let gifoURL = window.my_gifsInfo[gifoIndex].images.original.url;
    let gifoUser = window.my_gifsInfo[gifoIndex].username;
    let gifoTitle = window.my_gifsInfo[gifoIndex].title;
    let gifoID = window.my_gifsInfo[gifoIndex].id;
    return [gifoURL, gifoUser, gifoTitle, gifoID];
};

/**
 * @method removeGifo
 * @description Remove ID from array in localStorage
 * @param {number} gifoID
 */
function removeFGifo(gifoID) {
    let myGifs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MYGIFS)) || [];
    let gifIndexInLocalStorage;
    myGifs.forEach((gifoInfo, index) => {
        if (gifoInfo.id === gifoID) {
            gifIndexInLocalStorage = index;
        };
    });
    myGifs.splice(gifIndexInLocalStorage, 1);
    localStorage.setItem(LOCAL_STORAGE_MYGIFS, JSON.stringify(myGifs));
};

/**
 * @method downloadGifo
 * @description Download Gifo
 * @param {string} gifoURL
 */
async function downloadGifo(gifoURL) {
    let fetchResponse = await fetch(gifoURL);
    let blobObject = await fetchResponse.blob();
    let imgURL = URL.createObjectURL(blobObject);
    const saveGif = document.createElement("a");
    saveGif.href = imgURL;
    saveGif.download = `myGif.gif`;
    document.body.appendChild(saveGif);
    saveGif.click();
    document.body.removeChild(saveGif);
};


/**
 * @method maximizeGifo
 * @description maximize Gifo
 * @param {array} gifoInfo
 */
function maximizeGifo(gifoInfo) {
    document.querySelector(".my-gifos__fullsize-gifo").src = gifoInfo[0];
    document.querySelector(".my-gifos__fullsize-user").textContent = gifoInfo[1];
    document.querySelector(".my-gifos__fullsize-title").textContent = gifoInfo[2];
    toggleModal();
};

function toggleModal() {
    document.querySelector(".my-gifs__modal").classList.toggle("hidden");
};

/**
 * @method maximizeButtonsConf
 * @description including data information and event listener to modal buttons
 * @param {number} gifoIndex
 */
function maximizeButtonsConf(gifoIndex) {
    document.querySelector(".my-gifos__fullsize-exit").addEventListener('click', toggleModal);
    const fullsizeButtons = document.querySelectorAll(".my-gifs__fullsize-button");
    fullsizeButtons.forEach(button => {
        button.setAttribute("data-indexmy_gifs", gifoIndex);
        button.addEventListener('click', buttonAction);
    });
};

downloadmy_gifs();