// CONSTANTES GLOBALES
const var_protocol = "http";
const var_host = "://localhost"
const var_port = ":3000";
const var_path = "/api/products";
const var_fullAddress = var_protocol + var_host + var_port + var_path;
const var_allProducts = var_fullAddress + "/";
const postUrlForCardOrder = var_fullAddress + "/" + "order";
// gestion des messages d'erreur
const const_errorColor = '#2C3E50';
const const_classColor = 'errorMessage';
const const_fontWeight = 600;

/**
 * Donne le nom et la version du navigateur
 */
function get_browser_info() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE ', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}

//gestion du storage selon navigateur
var browser = get_browser_info();
let whatStorage = '';
if (browser.name == 'Firefox') {
    whatStorage = sessionStorage;
} else {
    whatStorage = localStorage;
}
const const_storage = whatStorage;
// Retour Cyril : ajout variable pour Cle de API dans un cadre professionnel pour info dans le futur



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

/**
 * Sécurise une chaîne sur ces caractères spéciaux
 * @param { string } str // qui est une chaine
 */
function safeString(str) {
    let res = str.replace(/[^\w\-]+/g, '-'); // 'Here\'s à sentence' --> Here-s-sentence
    res = res.replace('/', '-');
    return res;
};

/*
 * lit le local storage panier du composant local storage
 */
function readLocalStorage() {
    if (const_storage.length > 0) {

        // parcours le local storage
        let object_articleInLocalStore = [];
        //let testAdd = [];
        for (let i_value = 0; i_value <= const_storage.length; i_value++) {
            // recupere la cle en cours puis va chercher son dictionnaire puis enfin pousse element trouve dans le tableau de reception
            itemKey = const_storage.key(i_value);

            // test via une regex
            myRegex = /^kanap/;
            let stringRegExp = new RegExp(myRegex);

            // teste la regex
            let testKanapItem = stringRegExp.test(itemKey);
            //console.log('testKanapItem : ' + testKanapItem);
            //console.log(itemKey); // là on a toute les débris du local storage

            if (testKanapItem) {

                let itemFromLocalStorage = JSON.parse(const_storage.getItem(itemKey));

                object_articleInLocalStore.push(itemFromLocalStorage);
                //console.log(object_articleInLocalStore);

            }
        };
        return object_articleInLocalStore;
    };
};

/*
 * Supprime un élement du local storage
 */
function deleteLocalStorageItem(askedDeleteItem) {
    if (const_storage.length > 0) {
        if (const_storage.getItem(askedDeleteItem)) {
            const_storage.removeItem(askedDeleteItem);
            return true;
        };
    };
};
// FONCTIONS COMMUNES Fin _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

// GESTION DES STATISTIQUES INTERACTIVES Début _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
//
/*
 * retourne la quantité d'article du local storage (panier)
 */
function infoNavCart() {
    let quantityOfCart = 0;
    if (const_storage.length > 0) {

        // parcours le local storage
        let object_articleInLocalStore = [];
        
        for (let i_value = 0; i_value <= const_storage.length; i_value++) {
            // recupere la cle en cours puis va chercher son dictionnaire
            // puis enfin calcul la quantité totale du panier
            itemKey = const_storage.key(i_value);

            // test via une regex
            myRegex = /^kanap/;
            let stringRegExp = new RegExp(myRegex);

            // teste la regex
            let testKanapItem = stringRegExp.test(itemKey);

            if (testKanapItem) {
                let testA = const_storage.getItem(itemKey);
                let testAddJson = JSON.parse(testA);
                quantityOfCart += testAddJson.quantity*1;
            }
        };
        return quantityOfCart;
    };
};

/*
 * Affiche dans la navigation la quantité d'article du local storage (panier)
 */
function displayInfoNavCart() {
    // récupère le nombre d'article
    let res_quantityOfCart = infoNavCart();

    // Affichage du nombre d'articles dans la navigation
    if (res_quantityOfCart > 0) {
        let navCart = document.querySelector("body > header > div.limitedWidthBlockContainer.menu > div > nav > ul > a:nth-child(2) > li");
        let infoNavCart = "";
        navCart.textContent = "Panier( " + res_quantityOfCart +" )";
    };
};
// GESTION DES STATISTIQUES INTERACTIVES COMMUNES Fin _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 