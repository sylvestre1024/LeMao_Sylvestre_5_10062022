// FONCTIONS SPECIFIQUES - product.html - Debut  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

/**
 * Ecrit le contenu du produit la page
 * @param { array } array_selectedProduct
 */
function writeSelectedProduct(array_selectedProduct) {
    try {

        // titre de la page html
        document.title = array_selectedProduct.name;

        // image
        let var_image = document.createElement('img');
        var_image.setAttribute('src', array_selectedProduct.imageUrl);
        var_image.setAttribute('alt', array_selectedProduct.altTxt);
        document.getElementsByClassName('item__img')[0].appendChild(var_image);

        // titre
        let var_title = document.getElementById('title');
        var_title.textContent = array_selectedProduct.name;

        // prix
        let var_price = document.getElementById('price');
        var_price.textContent = array_selectedProduct.price;

        // description
        let var_description = document.getElementById('description');
        var_description.textContent = array_selectedProduct.description;

        // couleurs
        let var_eltHtmlSelect = array_selectedProduct.colors;

        // boucle de remplissage des options de couleur
        var_eltHtmlSelect.forEach((item) => {
            //pour une option
            let var_color = document.createElement('option');
            var_color.setAttribute('value', item);
            var_color.textContent = item;
            document.getElementById('colors').appendChild(var_color);
        });

        // quantité unitaire
        let var_quantity = document.getElementById('quantity');
        var_quantity.setAttribute('value', 1);

    } catch (error) {
        console.log('Catched Error1', error);
        console.log('Erreur en ecriture dans la page product.html');
    };
};

/**
 * ENregistre une nouvelle entrée dans le local storage
 * @param { object } object_articleForLocalStore
 */
function addLocalStorage(object_articleForLocalStore) {
    // notre identifiant unique pour cibler plus vite
    let var_idColor = 'kanap__' + object_articleForLocalStore.id + '__' + safeString(object_articleForLocalStore.color);
    //console.log('localStorage.length : ' + localStorage.length);
    //console.log('localStorage : ');
    //console.log(const_storage);

    const_storage.setItem(var_idColor, JSON.stringify(object_articleForLocalStore));
    //console.log('ajout réussi');
};

/**
 * Gère l'ajout dans le panier du composant local storage
 * @param { object } object_updatedArticle
 */
function mergeEntriesInLocalStorage(object_updatedArticle) {
    let var_idColor = 'kanap__' + object_updatedArticle.id + '__' + safeString(object_updatedArticle.color);
    //supprime ancien
    if (deleteLocalStorageItem(var_idColor)) {
        //console.log('suppression réussi');
    }
    // et ensuite enregistre nouveau
    const_storage.setItem(var_idColor, JSON.stringify(object_updatedArticle));
    //console.log('mise à jour réussi');
};

/**
 * Vérifie que la couleur et la quantité sont correctement selectionnés
 * si ok ajout dans le local storage
 * @param { object } articleSelected
 */
function verifyForAddToCard(articleSelected) {

    let validEntry = true;
    let notRegistred = true;
    let var_quantity = 1 * document.getElementById('quantity').value;
    //console.log('nouvelle quantité souhaitée à ajouter : ' + var_quantity);
    // si aucune couleur choisie
    if(document.getElementById('colors').value === []) {
        alert('Ajout au panier non pris en compte : merci de choisir une couleur !')

        // vérification des choix utilisateurs pour quantité
    } else if ((var_quantity > 0 && var_quantity < 101) && (var_quantity % 1 === 0)) {

        // on devrait vérifier que le total pour un article ne dépasse pas la qt max de 100
        // récupère le même article et teste la quantité total si max non atteint c ok alors
        oldProduct = JSON.parse(const_storage.getItem(articleSelected.idcolor));
        //console.log('Ancienne ligne du produit : ');
        //console.log(oldProduct);

        // etape 1/3 : vérifier une éventuelle fusion autorisable
        if (oldProduct !== null) {
           let quantityOfOldProduct = 1 * oldProduct.quantity;
           //console.log('Ancien article avec quantité : ' + quantityOfOldProduct);
            let var_newQuantite = var_quantity + quantityOfOldProduct;

            // cas de fusion d'entrées valides dans le local storage
            if ((var_newQuantite > 0 && var_newQuantite < 101) && (var_newQuantite % 1 === 0)) {
                // fusionnne
                articleSelected.quantity = var_newQuantite;
                mergeEntriesInLocalStorage(articleSelected);
                notRegistred = false;
            } else {
                validEntry = false;
                alert('Ajout au panier non pris en compte : merci de choisir une autre quantité,  le maximum pour un article est fixé à 100 exemplaires !')
            };

        } else if (validEntry === true && notRegistred === true) {
           // stocke le produit dans le panier
            addLocalStorage(articleSelected);
        };

        // etape 2/3 : informer l'utilisateur et le rediriger s'il le souhaite
        if (validEntry === true) {
            if (confirm(`Votre commande de :\n${articleSelected.quantity} exemplaire(s) ${articleSelected.name} de couleur ${articleSelected.color} est ajouté au panier.\nPour consulter votre panier, cliquez sur OK`)) {
                window.location.assign('cart.html'); // redirection
            };
            // reste sur la page car l'utilisateur a refusé la redirection
        };
        
        // etape 3/3 : Mettre à jour l'affichage du nombre d'article dans la navigation
        displayInfoNavCart();
    
    } else {
        // echec ajout
        //console.log('echec ajout sur la quantité');
        if (var_quantity > 100) {
            alert('Ajout au panier non pris en compte : merci de choisir une quantité inférieure (max 100) !');
        } else {
            alert('Ajout au panier non pris en compte : merci de choisir une quantité valide !');
        };
    
    };
};

/**
 * Action Ajouter au panier
 *  * @param { string } idAsked
 */
function addToCart(idAsked) {

    let var_btnCart = document.getElementById('addToCart');

    var_btnCart.addEventListener('click', () => {
        // création de l'object articleSelected si les conditions sont correctes
        let var_color = document.getElementById('colors').value;
        //console.log(var_color);

        if (var_color !== '') {
            var_color = safeString(document.getElementById('colors').value);
            let var_idColor = 'kanap__' + idAsked + '__' + var_color;

            let obj_articleSelected = {
                idcolor: var_idColor,
                id: idAsked,
                quantity: document.getElementById('quantity').value,
                color: document.getElementById('colors').value,
                name: document.getElementById('title').textContent
            };

            verifyForAddToCard(obj_articleSelected);
            //console.log('obj_articleSelected : ');
            //console.log(obj_articleSelected);
        } else {
            alert('Ajout au panier non pris en compte : merci de choisir une couleur.');
        }

    });
};
// FONCTIONS SPECIFIQUES - product.html - Fin  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// Début de la partie en exécution _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
try {

    // reprendre la valeur du paramètre id dans l'Url
    let var_idUrl = idFromRequest();

    // définir le paramètre de la requête
    let request = var_allProducts + var_idUrl;

    let var_fetchOk = false;
    let var_errorInfo = '';

    fetch(request)
        .then((response) => {     
            if (response.status == 200) {
                //console.log("Succès de la requête !");
                var_fetchOk = true;
            } else if (response.status == 301 || response.status == 302) {
                var_errorInfo = "Redirection, respectivement permanente et temporaire !";
            } else if (response.status == 401) {
                var_errorInfo = "Utilisateur non authentifié !";
            } else if (response.status == 403) {
                var_errorInfo = "Accès refusé !";
            } else if (response.status == 404 || response.status == 0 || response.status == "0") {
                var_errorInfo = "Ressource non trouvée !";
            } else if (response.status >= 500 && response.status <= 503) {
                var_errorInfo = "Erreurs serveur  !";
            } else if (response.status == 504) {
                var_errorInfo = "Le serveur n'a pas répondu !";
            }
            return response.json();
        })
        // vérifier la promesse de données de l'appel réseau
        .then((data) => {

            // alerte utilisateur pour d'éventuel soucis
            if (!var_fetchOk) {
                alert(var_errorInfo);
            } else {
            // écrire le contenu si reponse de succès
                writeSelectedProduct(data);
                // affichage du nombre d'article dans la navigation
                displayInfoNavCart()
            }

        }) 
        .catch(function (err) {
            console.log(err.message);
            alert('Une erreur est survenue, merci de revenir plus tard.');
        });
        
    // ajouter au panier
    addToCart(var_idUrl);


} catch (e) {
    console.log('Catched Error', e);
    console.log('Erreur dans la demande d\'affichage du produit sélectionné');
}
// Fin de la partie en exécution _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _