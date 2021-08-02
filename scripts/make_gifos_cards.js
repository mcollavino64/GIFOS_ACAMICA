import { buttonAction, favoriteGifo } from './button_actions.js';


function createCardGifos(gifosInfo, nodeHTML, cardType, page = 0) {
    const htmlgifos = gifosInfo.map((gifo, index) => {

        const gifoID        = gifo.id;        
        const gifoFavorite  = favoriteGifo(gifoID);
        const gifoTitle     = gifo.title;
        const gifoUsername  = gifo.username;
        const gifoURL       = gifo.images.original.url;
        
        

        return marginCard(gifoURL, gifoUsername, gifoTitle, cardType, index + (page * 12), gifoFavorite);
    });

    nodeHTML.innerHTML += htmlgifos.join("\n"); //unir todos los elementos con una linea nueva

    nodeHTML.querySelectorAll('.card-container__img').forEach((image) => image.addEventListener('click', buttonAction));

    nodeHTML.querySelectorAll('.button_card').forEach((button) => button.addEventListener('click', buttonAction));
    
    
};


const marginCard = ((url, user, title, cardType, index, gifoFavorite) => {
    const contentsCard = `
        <img class="card-container__img" src="${url}" alt="Gifo" data-type="maximize" data-cardType="${cardType}" data-index="${index}">
        <div class="cover-overlay">
            <div class="card-container__buttons">
                <button class="button_card fav-hover ${gifoFavorite?'hidden':''}" data-type="add-favorite" data-cardType="${cardType}" data-index="${index}" type="button"><i class="icon-icon-fav-hover"></i></i></button>
                <button class="button_card fav-active ${gifoFavorite?'':'hidden'}" data-type="remove-favorite" data-cardType="${cardType}" data-index="${index}" type="button"><i class="icon-icon-fav-active"></i></button>
                <button class="button_card" data-type="download" data-cardType="${cardType}" data-index="${index}" type="button"><i class="icon-icon-download"></i></button>
                <button class="button_card maximize" data-type="maximize" data-cardType="${cardType}" data-index="${index}" type="button"><i class="icon-icon-max"></i></button>
            </div>
            <div class="card-container__info">
                <p class="card__title">${title}</p>
                <p class="card__user">${user}</p>                
            </div>
        </div>`

    if (cardType === "trending_type") {
        return (
            `<div class="card-container trending-card">${contentsCard}</div>`
        );
    } else {
        return (
            `<div class="card-container">${contentsCard}</div>`
        );
    };
});


export {

    createCardGifos
};