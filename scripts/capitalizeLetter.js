//poner en mayuscula la primer letra de cada elemento de un array

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export {

    capitalizeFirstLetter

};