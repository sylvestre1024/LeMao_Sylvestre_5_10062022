// Debut de la partie en execution _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

// test d'itinéraire abandonné en fin de projet pour découpage plus fin en fichier unitaire js

/*
VAR_ENV_INDEX = '';

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

