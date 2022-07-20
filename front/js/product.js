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
        var_image.setAttribute("src", array_selectedProduct.imageUrl);
        var_image.setAttribute("alt", array_selectedProduct.altTxt);
        document.getElementsByClassName('item__img')[0].appendChild(var_image);         //a simplifier ?

        // titre
        let var_title = document.getElementById('title');                             //a simplifier ?
        var_title.textContent = array_selectedProduct.name;

        // prix
        let var_price = document.getElementById('price');                             //a simplifier ?
        var_price.textContent = array_selectedProduct.price;

        // description
        let var_description = document.getElementById('description');                //a simplifier ?
        var_description.textContent = array_selectedProduct.description;

        // couleurs
        let var_eltHtmlSelect = array_selectedProduct.colors;

        // boucle de remplissage des options de couleur
        var_eltHtmlSelect.forEach((item) => {
            //pour une option
            let var_color = document.createElement('option');
            var_color.setAttribute("value", item);
            var_color.textContent = item;
            document.getElementById('colors').appendChild(var_color);                 //a simplifier ?
        });

        // quantite unitaire
        let var_quantity = document.getElementById('quantity');                     //a simplifier ?
        var_quantity.setAttribute("value", 1);

    } catch (error) {
        console.log('Catched Error1', error);
        console.log('Erreur en ecriture dans la page product.html');
    };
};

/**
 * Action Ajouter au panier
 *  * @param { string } idAsked
 */
function addToCart(idAsked) {

    let var_btnCart = document.getElementById("addToCart");

    var_btnCart.addEventListener("click", () => {
        // creation de l object articleSelected si les conditions sont correctes
        let obj_articleSelected = {
            id: idAsked,
            quantity: document.getElementById('quantity').value,                       //a simplifier ?
            color: document.getElementById('colors').value,                            //a simplifier ?
            name: document.getElementById('title').textContent                         //a simplifier ?
        };
        verifyForAddToCard(obj_articleSelected);
    });
};

/**
 * Vérifie que la couleur et la quantité sont correctement selectionnés
 * si ok ajout dans le local storage
 * @param { object } articleSelected
 */
function verifyForAddToCard(articleSelected) {

    let v_quantiteValue = document.getElementById('quantity').value;                 //a simplifier ?

    // si aucune couleur choisie
    if (document.getElementById('colors').value == []) {                             //a simplifier ?
        alert("Ajout au panier non pris en compte : merci de choisir une couleur !")

        // verification des choix utilisateurs pour quantite
    } else if ((v_quantiteValue > 0 && v_quantiteValue < 101) && (v_quantiteValue % 1 == 0)) {

        // stocke le produit dans le panier
        addLocalStorage(articleSelected);

        // informe utilisateur et redirige si utilisateur le veut bien
        if (confirm(`Votre commande de :\n${articleSelected.quantity} ${articleSelected.name} de couleur ${articleSelected.color} est ajoutée au panier.\nPour consulter votre panier, cliquez sur OK`)) {
            window.location.assign("cart.html");
        }
        // redirige si utilisateur le veut bien

    } else {
        alert("Ajout au panier non pris en compte : merci de choisir une quantité valide !")
    }
}

/**
 * Gère ajout dans le panier du composant local storage
 * @param { object } object_articleForLocalStore
 */
function addLocalStorage(object_articleForLocalStore) {

    // notre identifiant unique pour cibler plus vite
    let var_idColor = "kanap__" + object_articleForLocalStore.id + "__" + object_articleForLocalStore.color

    // Cas local storage rempli (raccourci projet : il faudrait une regex normalement pour tester des lignes avec "kanap__")
    if (localStorage.length > 0) {

        // recupere objet dans le local storage
        let object_articleInLocalStore = JSON.parse(localStorage.getItem(var_idColor));

        // si article deja present tu fusionnes les quantites
        if (object_articleInLocalStore !== null) {

            // operation de mise a jour sur la nouvelle quantite
            object_articleForLocalStore.quantity = (Number(object_articleInLocalStore.quantity) + Number(object_articleForLocalStore.quantity));

            // supprime ancienne entree
            localStorage.removeItem(var_idColor);

            // enregistre nouvelle entree
            localStorage.setItem(var_idColor, JSON.stringify(object_articleForLocalStore));
        } else

            // creer une ligne article si tu peux pas fusionner
            localStorage.setItem(var_idColor, JSON.stringify(object_articleForLocalStore));

    }
    // Cas remplissage pour la premiere fois quand le local storage est vide
    else {
        // creer une ligne article
        localStorage.setItem(var_idColor, JSON.stringify(object_articleForLocalStore));
    }
};
// FONCTIONS SPECIFIQUES - product.html - Fin  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// Début de la partie en execution _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
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
// Fin de la partie en execution _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
