// Debut de la partie en execution _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

// test d'itinéraire abandonné en fin de projet pour découpage plus fin en fichier unitaire js
/*


/**
 * Retourne contenu de API via un fetch basique
 * @param { string } param_path // qui est un chemin url
 * @param { string } param_keyAndValue // qui est une chaine de(s) parametre(s)
 */
/*
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
*/
// FONCTIONS COMMUNES Debut _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
/**
 * Identifie le bon itinéraire d'un produit sélectionné à partir de l'url
 */
/*
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
*/
/**
 * Vérifie que l'élement url est bien une page demandée
 */
/*
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
*/
// FONCTIONS COMMUNES Fin _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

/*
VAR_ENV_INDEX = '';
*/
//A REVOIR CI-DESSOUS : 1 seul fonction IF
/*
// index.html
if (testRouteFile("index.html") == true) {
    VAR_ENV_INDEX = 'all_products';
};

// product.html
if (testRouteSelectedProduct() == true) {
    VAR_ENV_INDEX = 'selected_products';
};

// cart.html
if (testRouteFile("cart.html") == true) {
    VAR_ENV_INDEX = 'cart';
};
*/
/*
// Une seule fonction IF qui détermine le contexte puis embraye sur le SWITCH

// decider de la logique à prendre
switch (VAR_ENV_INDEX) {


   

    case 'all_products':
        try {

            //reprendre la valeur du parametre dans Url
            let var_idUrl = idFromRequest();

            // requeter Api pour l'ensemble des produits
            content = retrieveContent(var_allProducts, var_idUrl);

            // ecrire le contenu
            writeAllProducts(content)

        } catch (e) {
            console.log('Catched Error', e);
            console.log('Erreur dans la demande d\'affichage de l\'ensemble des produits');
        }
         break

    case 'selected_products':
        try {

            // reprendre la valeur du paramètre id dans Url
            let var_idUrl = idFromRequest();

            // requeter Api pour le produit selectionné
            content = retrieveContent(var_allProducts, var_idUrl);

            // écrire le contenu html
            writeSelectedProduct(content);

            // ajouter au panier
            addToCart(var_idUrl);

        } catch (e) {
            console.log('Catched Error', e);
            console.log('Erreur dans la demande d\'affichage du produit sélectionné');
        }
        break

    case 'cart':
        try {

            // gestion du chariot de course
            cartManagement();

        } catch (e) {
            console.log('Catched Error', e);
            console.log('Erreur dans la demande d\'affichage du panier');
        }
        break
}

*/
// Fin de la partie en execution _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

