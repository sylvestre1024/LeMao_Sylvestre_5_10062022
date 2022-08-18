// CONSTANTES GLOBALES
const var_protocol = "http";
const var_host = "://localhost"
const var_port = ":3000";
const var_path = "/api/products";
const var_fullAddress = var_protocol + var_host + var_port + var_path;
const var_allProducts = var_fullAddress + "/";
const postUrlForCardOrder = var_fullAddress + "/" + "order";

// Retour Cyril : ajout variable pour Cle de API dans un cadre professionnel pour info



// FONCTIONS COMMUNES Debut _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
/**
 * Retourne contenu de API via un fetch basique
 * @param { string } param_path // qui est un chemin url
 * @param { string } param_keyAndValue // qui est une chaine de(s) parametre(s)
 */
async function retrieveContent(param_path, param_keyAndValue) {
    if (param_keyAndValue === undefined || param_keyAndValue === null) {
        param_keyAndValue = '';
    }
    try {
        let response = await fetch(param_path + param_keyAndValue);
        return response.json();
    } catch (error) {
        // Info de Cyril - une variable environnement !==prod  amene une sortie sur la console
        // ou une creation de fonction dedie genre mylog() - partie log generale pour utilisateur ou detaille confidentiel
        console.log('Catched Error', error); //Remarque Cyril : mettre un sens genre "NO_ANSWER_FROM_API" pour gerer la localisation et donc formatage culturel
        console.log('La réponse de API est en erreur avec ces paramètres : ' + param_path + param_keyAndValue);
    }
}

/**
 * Identifie le bon itinéraire d'un produit sélectionné à partir de l'url
 */
function testRouteSelectedProduct() {
    // reprend la valeur du parametre id dans Url
    let var_idUrl = idFromRequest();
    let testExpression = ("id=" + var_idUrl)
    if (var_idUrl) {
        //console.log('La page product.html contient bien un parametre id valide : ' + var_idUrl);
        return true;
    } else {
        //console.log('La page product.html ne contient pas de parametre id valide : ' + var_idUrl);
        return false;
    }
};

/**
 * Vérifie que l'élement url est bien une page demandée
 */
function testRouteFile(file) {
    let myUrl = new URL(window.location);
    let myRegex = new RegExp(file); // ex : 'cart.html$'
    let myUrlPathname = myUrl.pathname
    // si trouve chaine
    if (myRegex.test(myUrlPathname)) {
        return true;
    } else {
        //console.log('La Regex echoue pour identifier la page index.html : ' + myUrlPathname);
        return false;
    }
};

/**
 * Recupere l'id provenant de Url et vérifie son format
 */
function idFromRequest() {
    let var_str = window.location.href;
    let myUrl = new URL(var_str);
    let var_search = new URLSearchParams(myUrl.search);
    let result = null;

    // une chaine de caracteres alpha-numerique en debut jusqu a fin
    let myRegex = new RegExp('^[a-zA-Z0-9]+$');

    // si parametre id existant dans url
    if (var_search.has('id')) {
        let var_id = var_search.get('id');

        // si format id au norme
        if (myRegex.test(var_id)) {
            result = var_id;
        } else {
            console.log('La valeur de id est incorrecte dans son format : ' + var_id);
        }
    }
    return result;
};
/**
 * Recupere l'id provenant de Url et vérifie son format
 * @param { string } myString // qui est une chaine
 * @param { number } myMinLimit // qui est un nombre minimum de caractères
 * @param { number } myMaxLimit // qui est un nombre maximum de caractères
 */
function testCharCompliant(myString, myMinLimit, myMaxLimit) {
    let nb;
    if (myString.length > (myMaxLimit * 1)) {
        nb = (myString.length - myMaxLimit);
        return "Nombre des " + myMaxLimit + " caractères maximums dépassés : " + nb + " en trop";
    }
    if (myString.length < (myMinLimit * 1)) {
        nb = (myMinLimit - myString.length);
        return "Nombre des " + myMinLimit + " caractères minimums non atteint : " + nb + " manquant";
    }
    return "";
};
// FONCTIONS COMMUNES Fin _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _