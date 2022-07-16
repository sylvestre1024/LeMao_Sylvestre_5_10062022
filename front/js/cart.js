// CONFIGURATION GLOBALE
const var_protocol = "http";
const var_host = "://localhost"
const var_port = ":3000";
const var_path = "/api/products";
const var_fullAddress = var_protocol + var_host + var_port + var_path;
const var_allProducts = var_fullAddress + "/";

// Retour Cyril : ajout variable pour Cle de API dans un cadre professionnel pour info


// BIBLIOTHEQUE COMMUNE Debut _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
/**
 * Retourne du contenu de API
 * @param { string } param_path // qui est un chemin url
 * @param { string } param_keyAndValue // qui est une chaine de(s) parametre(s)
 */
async function retrieveContent(param_path, param_keyAndValue) {
    if (param_keyAndValue == undefined) {
        param_keyAndValue = '';
    }
    try {
        const response = await fetch(param_path + param_keyAndValue);
        return response.json();
    } catch (error) {
        // Info de Cyril - une variable environnement !==prod  amene une sortie sur la console
        // ou une creation de fonction dedie genre mylog() - partie log generale pour utilisateur ou detaille confidentiel
        console.log('Catched Error5', error); //Remarque Cyril : mettre un sens genre "NO_ANSWER_FROM_API" pour gerer la localisation et donc formatage culturel
        console.log('La reponse de API est en erreur avec ces parametres : ' + param_path + param_keyAndValue);
    }
}

/**
 * Identifie le bon itineraire vers SelectedProduct si le contexte url est valide
 */
function testRouteSelectedProduct() {
    //reprend la valeur du parametre id dans Url
    const var_idUrl = idGetRequest();
    const testExpression = ("id=" + var_idUrl)
    if (var_idUrl) {
        //console.log('La page product.html contient bien un parametre id valide : ' + var_idUrl);
        return true;
    } else {
        //console.log('La page product.html ne contient pas de parametre id valide : ' + var_idUrl);
        return false;
    }
};

/**
 * Verifie que element contextuel en url est le bien celui demande
 */
function testRouteItem(file) {
    const myUrl = new URL(window.location);
    const myRegex = new RegExp(file); // ex : 'cart.html$'
    const myUrlPathname = myUrl.pathname
    //si trouve chaine
    if (myRegex.test(myUrlPathname)) {
        return true;
    } else {
        //console.log('La Regex echoue pour identifier la page index.html : ' + myUrlPathname);
        return false;
    }
};

/**
 * Utilise le bon itineraire selon la demande
 * @param { string } routeAsked // Cyril : participe passe en 1er en anglais
 */
async function hubContent(routeAsked) {
    try {
        //recupere le contenu via itineraire determinee par Api   
        if (routeAsked == "routeSelectedProduct") {
            //reprend la valeur du parametre id dans Url
            const var_idUrl = idGetRequest();
            content = retrieveContent(var_allProducts, var_idUrl);
            //ecrit le contenu
            writeSelectedProduct(content);
        }
        if (routeAsked == "routeAllProducts") {
            //cherche le contenu de API
            content = retrieveContent(var_allProducts);
            //ecrit le contenu
            writeAllProducts(content);
        }
        if (routeAsked == "routeCart") {

            //parcours le local storage des elements du panier et retourne un tableau
            requestAllBasketItems = readLocalStorage();

            // remplit chaque template article et le colle dans la page html
            for (let item in requestAllBasketItems) {
                //
                //articleData = retrieveContent(var_allProducts, requestAllBasketItems[item].id);
                await fetch(var_allProducts + requestAllBasketItems[item].id)
                    .then((res) => res.json())
                    .then((data) => (
                        articleData = data
                    ))
                    .catch((error) => console.log(error));

                //console.log(articleData.price);

                // ecrit les articles
                writeCartSelectedProduct(articleData, localStorage.key(item), requestAllBasketItems[item].color, requestAllBasketItems[item].quantity);

                // Affiche les quantites et prix total
                displayQuantityAndAmount();

                // gestion de suppresion article pour le panier et mise a jour total
                listenDeleteItemToCart();

                // gere les modifications des quantites unitaires et met a jour les quantités et prix total du panier
                updateQuantityAndAmount();
            } // fin de la boucle for
        }
    } catch (e) {
        console.log('Catched Error4', e);
        console.log('Erreur dans demande d itineraire ' + routeAsked);
    }
};

/**
 * Recupere id provenant de Url et verifie son format
 */
function idGetRequest() {
    const var_str = window.location.href;
    const myUrl = new URL(var_str);
    const var_search = new URLSearchParams(myUrl.search);

    // une chaine de caracteres alpha-numerique en debut jusqu a fin
    const myRegex = new RegExp('^[a-zA-Z0-9]+$');

    //si parametre id existant dans url
    if (var_search.has('id')) {
        const var_id = var_search.get('id');

        //si format id au norme
        if (myRegex.test(var_id)) {
            return var_id;
        } else {
            console.log('La valeur de id est incorrecte dans son format : ' + var_id);
        }
    }
    return false;
};
// BIBLIOTHEQUE COMMUNE Fin _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _



// BIBLIOTHEQUE SPECIFIQUE - index.html - Debut  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
/**
 * Ecrit le contenu de tous les produits dans la page html
 * @param { array } array_textRequest
 */
function writeAllProducts(array_textRequest) {
    try {
        // for (var i = 0; i < array_textRequest.length; i++) {     //OLD SCHOOL
        array_textRequest.forEach((item) => {

            //lien
            const var_link = document.createElement('a');
            var_link.setAttribute("href", "product.html?id=" + item._id);
            document.getElementById('items').appendChild(var_link);

            //article
            const var_article = document.createElement('article');
            var_link.appendChild(var_article);

            //image
            const var_image = document.createElement('img');
            var_image.setAttribute("src", item.imageUrl);
            var_image.setAttribute("alt", item.altTxt);
            var_article.appendChild(var_image);

            //titre
            const var_title = document.createElement('h3');
            var_title.setAttribute("class", "productName");
            var_title.innerHTML = item.name;
            var_article.appendChild(var_title);

            //description
            const var_description = document.createElement('p');
            var_description.setAttribute("class", "productDescription");
            var_description.innerHTML = item.description;
            var_article.appendChild(var_description);
        });

    } catch (e) {
        console.log('Catched Error2', e);
        console.log('Erreur en ecriture dans la page index.html');
    }
};
// BIBLIOTHEQUE SPECIFIQUE - index.html - Fin  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

// BIBLIOTHEQUE SPECIFIQUE - product.html - Debut  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

/**
 * Ecrit le contenu du produit selectionne dans la page html
 * @param { array } array_selectedProduct
 */
function writeSelectedProduct(array_selectedProduct) {
    try {

        //titre de la page html
        document.title = array_selectedProduct.name;

        //image
        const var_image = document.createElement('img');
        var_image.setAttribute("src", array_selectedProduct.imageUrl);
        var_image.setAttribute("alt", array_selectedProduct.altTxt);
        document.getElementsByClassName('item__img')[0].appendChild(var_image);         //a simplifier ?

        //titre
        const var_title = document.getElementById('title');                             //a simplifier ?
        var_title.innerHTML = array_selectedProduct.name;

        //prix
        const var_price = document.getElementById('price');                             //a simplifier ?
        var_price.innerHTML = array_selectedProduct.price;

        //description
        const var_description = document.getElementById('description');                //a simplifier ?
        var_description.innerHTML = array_selectedProduct.description;

        //couleurs
        const var_eltHtmlSelect = array_selectedProduct.colors;

        //boucle de remplissage des options de couleur
        var_eltHtmlSelect.forEach((item) => {
            //pour une option
            const var_color = document.createElement('option');
            var_color.setAttribute("value", item);
            var_color.innerHTML = item;
            document.getElementById('colors').appendChild(var_color);                 //a simplifier ?
        });

        //quantite unitaire
        const var_quantity = document.getElementById('quantity');                     //a simplifier ?
        var_quantity.setAttribute("value", 1);

    } catch (error) {
        console.log('Catched Error1', error);
        console.log('Erreur en ecriture dans la page product.html');
    };
};

/**
 * Ajoute des ecouteurs a notre bouton Ajouter au panier
 *  * @param { string } idAsked
 */
function listenAddToCart(idAsked) {

    const var_btnCart = document.getElementById("addToCart");

    var_btnCart.addEventListener("click", () => {
        //creation de l object articleSelected si les conditions sont correctes
        const obj_articleSelected = {
            id: idAsked,
            quantity: document.getElementById('quantity').value,                       //a simplifier ?
            color: document.getElementById('colors').value,                            //a simplifier ?
            name: document.getElementById('title').textContent                         //a simplifier ?
        };
        verifyForAddToCard(obj_articleSelected);
    });
};

/**
 * vérification que la couleur et la quantité sont correctement selectionnés
 * si ok ajout dans le local storage
 * @param { object } articleSelected
 */
function verifyForAddToCard(articleSelected) {

    const v_quantiteValue = document.getElementById('quantity').value;                 //a simplifier ?

    //si aucune couleur choisie
    if (document.getElementById('colors').value == []) {                             //a simplifier ?
        alert("Ajout au panier non pris en compte : merci de choisir une couleur !")

        //verification des choix utilisateurs pour quantite
    } else if ((v_quantiteValue > 0 && v_quantiteValue < 101) && (v_quantiteValue % 1 == 0)) {

        //stocke le produit dans le panier
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
 * gere ajout dans le panier du composant local storage
 * @param { object } object_articleForLocalStore
 */
function addLocalStorage(object_articleForLocalStore) {

    // notre identifiant unique pour cibler plus vite
    const var_idColor = "kanap__" + object_articleForLocalStore.id + "__" + object_articleForLocalStore.color

    // Cas local storage rempli (raccourci projet : il faudrait une regex normalement pour tester des lignes avec "kanap__")
    if (localStorage.length > 0) {

        // recupere objet dans le local storage
        const object_articleInLocalStore = JSON.parse(localStorage.getItem(var_idColor));

        // si article deja present tu fusionnes les quantites
        if (object_articleInLocalStore !== null) {

            // operation de mise a jour sur la nouvelle quantite
            object_articleForLocalStore.quantity = (Number(object_articleInLocalStore.quantity) + Number(object_articleForLocalStore.quantity));

            //supprime ancienne entree
            localStorage.removeItem(var_idColor);

            //enregistre nouvelle entree
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
// BIBLIOTHEQUE SPECIFIQUE - product.html - Fin  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _



// BIBLIOTHEQUE SPECIFIQUE - cart.html - Debut  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
/*
 * lit le local storage panier du composant local storage
 */
function readLocalStorage() {
    if (localStorage.length > 0) {

        // parcours le local storage
        const object_articleInLocalStore = [];
        for (var i_value = 0; i_value <= localStorage.length; i_value++) {

            // recupere la cle en cours puis va chercher son dictionnaire puis enfin pousse element trouve dans le tableau de reception
            itemKey = localStorage.key(i_value);
            if (itemKey !== null) {
                object_articleInLocalStore.push(JSON.parse(localStorage.getItem(itemKey)));
            }
        };
        return object_articleInLocalStore;
    };
};

/*
 * supprime un element du local storage
 */
function deleteLocalStorageItem(askedDeleteItem) {
    if (localStorage.length > 0) {
        if (localStorage.getItem(askedDeleteItem)) {
            localStorage.removeItem(askedDeleteItem);
            return true;
        };
    };
};
/**
 * Ecrit le contenu dans la page de panier en lien avec le local storage
 * @param { array } array_selectedProduct
 */
function writeCartSelectedProduct(item, basketIdColorItem, basketColorItem, basketQuantityItem) {
    try {
        /*
        console.log('Boucle les articles avant de remplir le template html :');
        console.log('item en cours id : '       + item._id);
        console.log('item en cours color : '    + basketColorItem);
        console.log('item en cours name : '     + item.name);
        console.log('item en cours imageUrl : ' + item.imageUrl);
        console.log('item en cours altTxt : '   + item.altTxt);
        console.log('item en cours price : '    + item.price);
        console.log('item en cours quantity : ' + basketQuantityItem);
        */

        // cible emplacement pour coller le template avant de le remplir
        const cartPlaceholder = document.getElementById('cart__items'); // document.querySelector("#cart__items");

        //1re methodologie en coller brut (en general on charge un fichier externe qui sert de template)

        // parse le template
        //cartHtml = `<article class="cart__item" id="${basketIdColorItem}" data-idColor="${basketIdColorItem}" data-id="${item._id}" data-color="${basketColorItem}"><div class="cart__item__img"><img src="${item.imageUrl}" alt="${item.altTxt}"></div><div class="cart__item__content"><div class="cart__item__content__description"><h2>${item.name}</h2><p>${basketColorItem}</p><p>${item.price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${basketQuantityItem}"></div><div class="cart__item__content__settings__delete"><p data-idColor="${basketIdColorItem}" class="deleteItem">Supprimer</p></div></div></div></article>`;
        //cartPlaceholder.innerHTML += cartHtml; 
        // cette façon est deconseillee il faut utiliser
        /*insertAdjacentHTML() analyse le texte spécifié en tant que HTML ou XML et insère les noeuds résultants dans le DOM
         * à la position spécifiée.L'élement qui est utilisé n'est pas réanalysé et les élements qu'il contient ne sont donc pas corrompus.
         * Ceci, et le fait d'éviter la sérialisation supplémentaire, rend la fonction plus rapide et directe que innerHTML
         * Syntaxe : element.insertAdjacentHTML(position, text);
        */

        //2e methodologie en pas a pas avec le moteur javascript

        //déclaration des selectors
        //let cartItems = document.querySelector("#cart__items");
        //let para = document.getElementById("p");
        let containDivImg = document.getElementsByClassName("cart__item__img");
        let divDelete = document.getElementsByClassName("cart__item__content__settings__delete");
        let pDelete = document.getElementsByClassName("deleteItem");
        //let inputQte = document.getElementsByClassName("itemQuantity");

        //creation article
        let cartItem = document.createElement("article");
        cartItem.className = "cart__item";
        cartItem.setAttribute('id', basketIdColorItem);
        cartItem.setAttribute('data-id', item._id);
        cartItem.setAttribute('data-color', basketColorItem);

        //image
        containDivImg = document.createElement("div");
        containDivImg.className = ("cart__item__img");
        cartItem.appendChild(containDivImg);

        let img = document.createElement("img");
        containDivImg.appendChild(img);
        img.src = item.imageUrl;
        img.alt = item.altTxt;

        //conteneur
        let divContent = document.createElement("div");
        cartItem.appendChild(divContent);
        divContent.className = "cart__item__content";

        //description
        let divDescription = document.createElement("div");
        divContent.appendChild(divDescription);
        divDescription.className = "cart__item__content__description";

        //title
        let title = document.createElement("h2");
        divDescription.appendChild(title);
        title.textContent = item.name;

        //color
        let color = document.createElement("p");
        divDescription.appendChild(color);
        color.textContent = basketColorItem;

        //container settings
        let settings = document.createElement("div");
        divContent.appendChild(settings);
        settings.className = "cart__item__content__settings";

        //container quantity
        let divQuantity = document.createElement("div");
        settings.appendChild(divQuantity);
        divQuantity.className = "cart__item__content__settings__quantity";

        //quantity
        let pQuantity = document.createElement("p");
        divQuantity.appendChild(pQuantity);
        pQuantity.textContent = 'Qté : ';

        let inputQty = document.createElement("input");
        divQuantity.appendChild(inputQty);
        inputQty.className = "itemQuantity";
        inputQty.setAttribute("type", "number");
        inputQty.setAttribute("class", "itemQuantity");
        inputQty.setAttribute("name", "itemQuantity");
        inputQty.setAttribute("min", "0");
        inputQty.setAttribute("max", "100");
        inputQty.setAttribute("step", "1");
        inputQty.setAttribute("value", basketQuantityItem);

        //price
        let price = document.createElement("p");
        divDescription.appendChild(price);
        price.textContent = item.price + "€";

        //article delete
        divDelete = document.createElement("div");
        settings.appendChild(divDelete);
        divDelete.className = "cart__item__content__settings__delete";
        pDelete = document.createElement("p");
        divDelete.appendChild(pDelete);
        pDelete.className = "deleteItem";
        pDelete.textContent = "Supprimer";
        pDelete.setAttribute('data-idColor', basketIdColorItem);

        // ecrit dans la page html
        cartPlaceholder.appendChild(cartItem);

    } catch (error) {
        console.log('Catched Error1', error);
        console.log('Erreur en ecriture dans la page product.html');
    };
};

/**
 * Ajoute des ecouteurs a notre bouton supprimer du panier
 */
function listenDeleteItemToCart() {
    // cherche tous les noeuds qui nous interessent
    document.querySelectorAll('.deleteItem').forEach((item) => {

        // attache une fonction evenementielle
        item.addEventListener('click', function (event) {

            // reprend propriete data-idcolor du bouton supprimer sur ce quoi je clique 
            // et se sert de cette reference pour pointer sur le resultat de recherche 
            // pour la propriete id present dans les articles
            referenceToDelete = item.getAttribute('data-idcolor');
            //console.log(referenceToDelete);

            //suppresion article HTML et dans le localStorage
            articleToDelete = document.getElementById(referenceToDelete);
            if (articleToDelete) {
                //suppresion article HTML
                articleToDelete.remove();
                //suppresion article dans le localStorage
                if (deleteLocalStorageItem(referenceToDelete) == true) {
                    console.log("Element du localStorage suivant est supprime : " + referenceToDelete);
                    displayQuantityAndAmount();
                    console.log("Mise a jour des quanites et prix total du panier requis par la suppression d un article");
                } else {
                    console.log("Element du localStorage non trouve pour suppression ! : " + referenceToDelete);
                };
            };

            // mets a jour les quantites et prix total
            updateQuantityAndAmount();

        });
    });
};

/**
 * Met a jour les quantites et prix total du panier en fonction des choix interactifs de l utilisateur
 */
function updateQuantityAndAmount() {
    console.log('deb');
    // cherche tous les noeuds qui nous interessent
    document.querySelectorAll('.itemQuantity').forEach((item) => {
        console.log('ici');
        // attache une fonction evenementielle
        item.addEventListener('change', function (event) {

            // recupere les infos utiles dans Html

            //const newQuantity = item.getAttribute('value')
            const newQuantity = this.value;
            console.log('quantite nouvelle : ' + newQuantity);

            const currentArticle = item.closest('article');
            //console.log('currentArticle : ' + currentArticle);

            const askedItem = currentArticle.getAttribute('id')
            //console.log('askedItem : ' + askedItem);


            // mise a jour du local storage

            // reprend element
            const itemFound = JSON.parse(localStorage.getItem(askedItem));

            // met a jour
            itemFound.quantity = newQuantity;

            // supprime avant ajout
            localStorage.removeItem(askedItem);

            // enregistre
            localStorage.setItem(askedItem, JSON.stringify(itemFound));

            // mettre a jour la quantite et le prix du panier
            displayQuantityAndAmount();

        });
    });
};

/**
 * Affiche la quantité et le prix total au chargement de la page
 */
async function displayQuantityAndAmount() {
    // reprend le prix et quantite de chaque article dans le panier et calcul un prix total

    const mathPrice = 0;
    const array_amount = [];
    const array_quantity = [];
    //parcours le local storage des elements du panier et retourne un tableau
    requestAllBasketItems = readLocalStorage();

    // remplit chaque template article et le colle dans la page html
    for (let item in requestAllBasketItems) {
        //
        // cherche le contenu de API (sans await cela ne fonctionnerait pas)
        //articleData = retrieveContent(var_allProducts, requestAllBasketItems[item].id);
        await fetch(var_allProducts + requestAllBasketItems[item].id)
            .then((res) => res.json())
            .then((data) => (
                articleData = data
            ))
            .catch((error) => console.log(error));

        // Remarque : curieusement on ne peut pas faire une affectation comme :
        // mathPrice = 5;
        // ERROR : cart.js:558 Uncaught (in promise) TypeError: Assignment to constant variable.
        // at getCartPriceFromApi(cart.js: 558: 20)
        // Quelle explication ?
        array_amount.push( Number(articleData.price) * Number(requestAllBasketItems[item].quantity) );
        array_quantity.push(requestAllBasketItems[item].quantity);
    }
    //console.log('Tableau des prix des articles issues du LS : ' + array_amount);
    //console.log(array_amount);

    let sumPrice = 0;
    for (let i = 0; i < array_amount.length; i++) {
        sumPrice += array_amount[i];
    }
    //console.log(sumPrice);

    let sumQuantity = 0;
    for (let i = 0; i < array_quantity.length; i++) {
        sumQuantity += 1 * array_quantity[i];
    }
    //console.log(sumQuantity);

    const totalPrice = document.getElementById('totalPrice');
    totalPrice.textContent = sumPrice;

    const totalQuantity = document.getElementById('totalQuantity');
    totalQuantity.textContent = sumQuantity;
}
//
// BIBLIOTHEQUE SPECIFIQUE - cart.html - Fin  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// Debut Partie en execution _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
//
// ==> 5/07 Cyril dit passer sur un Switch
// hubcontent pourrait être une variable environnement

// index.html - Appelle le contenu de tous les produits de l API et insere dans la page
if (testRouteItem("index.html") == true) {
    hubContent("routeAllProducts");
};

// product.html - Appelle le contenu du produit selectionne de l API et insere dans la page
if (testRouteSelectedProduct() == true) {
    var_idUrl = idGetRequest(); //idFromRequest c plus parlant
    hubContent("routeSelectedProduct");
    listenAddToCart(var_idUrl);
};

// cart.html - Appelle le contenu de tous les produits de l API en lien avec le local storage
if (testRouteItem("cart.html") == true) {
    hubContent("routeCart");
};