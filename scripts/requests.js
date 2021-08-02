
 function requestUploadGifo(URL, gifoData) {
    return new Promise((resolve, reject) => {
        fetch(URL, { method: 'POST', body: gifoData })
            .then(response => { resolve(response.json()) })
            .catch(error => { reject(error) })
    });
}

function requestGifosSearch(URL, queryTerm, page) {
    const offset = page * 12;
    const completeURL = `${URL}&q=${queryTerm}&limit=12&offset=${offset}`;
    return requestApiGifos(completeURL);
}


function requestAutocomplete(URL, queryTerm) {
    const completeURL = `${URL}&q=${queryTerm}`;
    return requestApiGifos(completeURL);
}


function requestApiGifos(URL) {
    return new Promise((resolve, reject) => {
        fetch(URL)
            .then(response => { resolve(response.json()) })
            .catch(error => { reject(error) })
    });
}

export {
    requestUploadGifo,
    requestGifosSearch,
    requestApiGifos,
    requestAutocomplete
};