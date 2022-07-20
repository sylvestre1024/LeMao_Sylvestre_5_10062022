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
    if (param_keyAndValue == undefined || param_keyAndValue == null) {
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
// FONCTIONS COMMUNES Fin _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _



// FONCTIONS SPECIFIQUES - index.html - Debut  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
/**
 * Ecrit le contenu de l'ensemble des produits dans la page
 * @param { array } array_textRequest
 */
function writeAllProducts(array_textRequest) {
    try {
        array_textRequest.forEach((item) => {

            // lien
            let var_link = document.createElement('a');
            var_link.setAttribute("href", "product.html?id=" + item._id);
            document.getElementById('items').appendChild(var_link);

            // article
            let var_article = document.createElement('article');
            var_link.appendChild(var_article);

            // image
            let var_image = document.createElement('img');
            var_image.setAttribute("src", item.imageUrl);
            var_image.setAttribute("alt", item.altTxt);
            var_article.appendChild(var_image);

            // titre
            let var_title = document.createElement('h3');
            var_title.setAttribute("class", "productName");
            var_title.textContent = item.name;
            var_article.appendChild(var_title);

            // description
            let var_description = document.createElement('p');
            var_description.setAttribute("class", "productDescription");
            var_description.textContent = item.description;
            var_article.appendChild(var_description);
        });

    } catch (e) {
        console.log('Catched Error2', e);
        console.log('Erreur en ecriture dans la page index.html');
    }
};
// FONCTIONS SPECIFIQUES - index.html - Fin  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _



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



// FONCTIONS SPECIFIQUES - cart.html - Debut  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
/*
 * lit le local storage panier du composant local storage
 */
function readLocalStorage() {
    if (localStorage.length > 0) {

        // parcours le local storage
        let object_articleInLocalStore = [];
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
function writeCartSelectedProduct(item, cartIdColorItem, cartColorItem, cartQuantityItem) {
    try {
        /*
        console.log('Boucle les articles avant de remplir le template html :');
        console.log('item en cours id : '       + item._id);
        console.log('item en cours color : '    + cartColorItem);
        console.log('item en cours name : '     + item.name);
        console.log('item en cours imageUrl : ' + item.imageUrl);
        console.log('item en cours altTxt : '   + item.altTxt);
        console.log('item en cours price : '    + item.price);
        console.log('item en cours quantity : ' + cartQuantityItem);
        */

        // cible emplacement pour coller le template avant de le remplir
        let cartPlaceholder = document.getElementById('cart__items'); // document.querySelector("#cart__items");

        //1re methodologie en coller brut (en general on charge un fichier externe qui sert de template)

        // parse le template
        //cartHtml = `<article class="cart__item" id="${CartIdColorItem}" data-idColor="${CartIdColorItem}" data-id="${item._id}" data-color="${CartColorItem}"><div class="cart__item__img"><img src="${item.imageUrl}" alt="${item.altTxt}"></div><div class="cart__item__content"><div class="cart__item__content__description"><h2>${item.name}</h2><p>${CartColorItem}</p><p>${item.price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${CartQuantityItem}"></div><div class="cart__item__content__settings__delete"><p data-idColor="${CartIdColorItem}" class="deleteItem">Supprimer</p></div></div></div></article>`;
        //cartPlaceholder.textContent += cartHtml; 
        // cette façon est deconseillee il faut utiliser
        /*insertAdjacentHTML() analyse le texte spécifié en tant que HTML ou XML et insère les noeuds résultants dans le DOM
         * à la position spécifiée.L'élement qui est utilisé n'est pas réanalysé et les élements qu'il contient ne sont donc pas corrompus.
         * Ceci, et le fait d'éviter la sérialisation supplémentaire, rend la fonction plus rapide et directe que textContent
         * Syntaxe : element.insertAdjacentHTML(position, text);
        */

        // 2e methodologie en pas a pas avec le moteur javascript

        // déclaration des selectors
        //let cartItems = document.querySelector("#cart__items");
        //let para = document.getElementById("p");
        let containDivImg = document.getElementsByClassName("cart__item__img");
        let divDelete = document.getElementsByClassName("cart__item__content__settings__delete");
        let pDelete = document.getElementsByClassName("deleteItem");
        //let inputQte = document.getElementsByClassName("itemQuantity");

        // creation article
        let cartItem = document.createElement("article");
        cartItem.className = "cart__item";
        cartItem.setAttribute('id', cartIdColorItem);
        cartItem.setAttribute('data-id', item._id);
        cartItem.setAttribute('data-color', cartColorItem);

        // image
        containDivImg = document.createElement("div");
        containDivImg.className = ("cart__item__img");
        cartItem.appendChild(containDivImg);

        let img = document.createElement("img");
        containDivImg.appendChild(img);
        img.src = item.imageUrl;
        img.alt = item.altTxt;

        // conteneur
        let divContent = document.createElement("div");
        cartItem.appendChild(divContent);
        divContent.className = "cart__item__content";

        // description
        let divDescription = document.createElement("div");
        divContent.appendChild(divDescription);
        divDescription.className = "cart__item__content__description";

        // title
        let title = document.createElement("h2");
        divDescription.appendChild(title);
        title.textContent = item.name;

        // color
        let color = document.createElement("p");
        divDescription.appendChild(color);
        color.textContent = cartColorItem;

        // container settings
        let settings = document.createElement("div");
        divContent.appendChild(settings);
        settings.className = "cart__item__content__settings";

        // container quantity
        let divQuantity = document.createElement("div");
        settings.appendChild(divQuantity);
        divQuantity.className = "cart__item__content__settings__quantity";

        // quantity
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
        inputQty.setAttribute("value", cartQuantityItem);

        // price
        let price = document.createElement("p");
        divDescription.appendChild(price);
        price.textContent = item.price + "€";

        // article delete
        divDelete = document.createElement("div");
        settings.appendChild(divDelete);
        divDelete.className = "cart__item__content__settings__delete";
        pDelete = document.createElement("p");
        divDelete.appendChild(pDelete);
        pDelete.className = "deleteItem";
        pDelete.textContent = "Supprimer";
        pDelete.setAttribute('data-idColor', cartIdColorItem);

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

            // suppresion article HTML et dans le localStorage
            articleToDelete = document.getElementById(referenceToDelete);
            if (articleToDelete) {
                // suppresion article HTML
                articleToDelete.remove();
                // suppresion article dans le localStorage
                if (deleteLocalStorageItem(referenceToDelete) == true) {
                    //console.log("Elément du localStorage suivant est supprimé : " + referenceToDelete);
                    displayQuantityAndAmount();
                    //console.log("Mise à jour des quantités et prix total du panier requis par la suppression d\'un article");
                } else {
                    //console.log("Elément du localStorage non trouvé pour suppression ! : " + referenceToDelete);
                };
            };

            // met à jour les quantités et le prix total
            updateQuantityAndAmount();

        });
    });
};

/**
 * Met a jour les quantites et prix total du panier en fonction des choix interactifs de l utilisateur
 */
function updateQuantityAndAmount() {

    // cherche tous les noeuds qui nous interessent
    document.querySelectorAll('.itemQuantity').forEach((item) => {

        // attache une fonction evenementielle
        item.addEventListener('change', function (event) {

            // recupere les infos utiles dans Html

            //let newQuantity = item.getAttribute('value')
            let newQuantity = this.value;
            //console.log('quantité nouvelle : ' + newQuantity);

            let currentArticle = item.closest('article');
            //console.log('currentArticle : ' + currentArticle);

            let askedItem = currentArticle.getAttribute('id')
            //console.log('askedItem : ' + askedItem);


            // mise a jour du local storage

            // reprend element
            let itemFound = JSON.parse(localStorage.getItem(askedItem));

            // met à jour
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

    let mathPrice = 0;
    let array_amount = [];
    let array_quantity = [];
    // parcours le local storage des élements du panier et retourne un tableau
    let requestAllCartItems = readLocalStorage();

    // remplit chaque template article et le colle dans la page html
    for (let item in requestAllCartItems) {
        //
        // cherche le contenu de API (sans await cela ne fonctionnerait pas)
        //articleData = retrieveContent(var_allProducts, requestAllCartItems[item].id);
        await fetch(var_allProducts + requestAllCartItems[item].id)
            .then((res) => res.json())
            .then((data) => (
                articleData = data
            ))
            .catch((error) => console.log(error));

        // Remarque : curieusement on ne peut pas faire une affectation comme :
        //mathPrice = 5;
        //ERROR : cart.js:___ Uncaught (in promise) TypeError: Assignment to letant variable.
        //at getCartPriceFromApi(cart.js: ___: __)
        //Quelle explication ?
        array_amount.push( Number(articleData.price) * Number(requestAllCartItems[item].quantity) );
        array_quantity.push(requestAllCartItems[item].quantity);
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

    let totalPrice = document.getElementById('totalPrice');
    totalPrice.textContent = sumPrice;

    let totalQuantity = document.getElementById('totalQuantity');
    totalQuantity.textContent = sumQuantity;
}

/**
 * Gestion du chariot des produits d'achats
 */
async function cartManagement() {
    try {

        // parcours le local storage des elements du panier et retourne un tableau
        requestAllCartItems = readLocalStorage();


        // remplit chaque template article et le colle dans la page html
        for (let item in requestAllCartItems) {
            //
            //articleData = retrieveContent(var_allProducts, requestAllCartItems[item].id);

            await fetch(var_allProducts + requestAllCartItems[item].id)
                .then((res) => res.json())
                .then((data) => (
                    articleData = data
                ))
                .catch((error) => console.log(error));

            // ecrit les articles
            writeCartSelectedProduct(articleData, localStorage.key(item), requestAllCartItems[item].color, requestAllCartItems[item].quantity);

        } // fin de la boucle for


        // affiche les quantites et prix total
        displayQuantityAndAmount();

        // gestion de suppresion article pour le panier et mise a jour total
        listenDeleteItemToCart();

        // gere les modifications des quantites unitaires et met à jour les quantités et le prix total du panier
        updateQuantityAndAmount();



        ////////////////////////////////////////////////////////////////
        // Form Control & POST request /////////////////////////////////
        ////////////////////////////////////////////////////////////////


        ////////////// Form control ////////////


        // ETAPE 1 /2
        // le champ email

        // selectionne objet email
        let email = document.querySelector("#email")

        // affichage invalide du champ email
        const displayInvalidEmail = function (inputEmail) {
            // utilise une regex pour les adresses mails
            let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]{1,50}[@]{1}[a-zA-Z0-9.-_]{1,50}[.]{1}[a-z]{2,10}$', 'g')

            // teste la regex
            let testEmail = emailRegExp.test(inputEmail.value)
            let errorMessage = inputEmail.nextElementSibling

            if (inputEmail.value === "") {
                errorMessage.textContent = ""

            } else if (testEmail === false) {
                errorMessage.style.color = "#2C3E50"
                errorMessage.style.fontWeight = "600"
                errorMessage.textContent = "❌ Adresse email invalide"

            } else if (testEmail === true) {
                errorMessage.textContent = ""
            }                
        }

        // écoute et vérifie le champ email
        email.addEventListener("change", function () {
            // affichage invalide du champ email
            displayInvalidEmail(this)
        });


        // ETAPE 2 /2
        // verification des autres champs communs du formulaire

        // cible les id des champs communs du formulaire à controller
        array_NotNumberOrSymbolForInput = ['#lastName', '#firstName', '#city'];

        // affichage invalide pour les autres champs
        const displayInvalidCommonInput = function (inputInfo) {
            // utilise une regex
            let infoRegExp = new RegExp(/^[a-zA-Z-\s?]{0,25}$/)
            // teste la regex
            let testInfo = infoRegExp.test(inputInfo.value)
            let errorMessage = inputInfo.nextElementSibling

            if (inputInfo.value === "") {
                errorMessage.textContent = ""

            } else if (testInfo === false) {
                errorMessage.style.color = "#2C3E50"
                errorMessage.style.fontWeight = "600"
                errorMessage.textContent = "❌ Nombre ou symbole non autorisé"

            } else if (testInfo === true) {
                errorMessage.textContent = ""
            }
        }

        // fonction qui parcours tous les champs, les ecoutent et les invalident si nécessaire
        function checkCommonInput(array_id) {

            for (var i = 0; i < array_id.length; i++) {  // #lastName

                let mySelector = document.querySelector(array_id[i]); // <input type="text" name="lastName" id="lastName" required>

                mySelector.addEventListener("input", function () {
                    // affichage invalide pour les autres champs
                    displayInvalidCommonInput(this)
                });

            }
        }

        // écoute et vérifie les autres champs communs du formulaire
        checkCommonInput(array_NotNumberOrSymbolForInput);



        /////////// POST request ////////////


        // créer un tableau avec les ids des produits commandés
        function createArrayOfOrderInfos(allItems) {
            array_items = [];
            for (let item in allItems) {
                array_items.push(allItems[item].id);
            }
            return array_items;
        }


        // rassembler les données à transmettre à l'API
        function makeJsonDataForCart() {

            // parcours le local storage des élements du panier et retourne un tableau
            let resultAllCartItems = readLocalStorage();
            //console.log(resultAllCartItems);

            // Reprendre les id des articles du local storage
            let resultArrayOfOrderInfos = createArrayOfOrderInfos(resultAllCartItems);
            //console.log(resultArrayOfOrderInfos);

            // combien d'articles en achat
            let nbOfCartItems = resultArrayOfOrderInfos.length;

            // traite la vérification avant commande
            if (nbOfCartItems === null || nbOfCartItems == 0) {

                let paragraph = document.createElement("p");
                paragraph.className = "alerte",
                document.querySelector("#cart__items").append(paragraph);
                paragraph.textContent = "votre panier est vide !";
                window.alert("panier vide");

            } else {

                // construction de l'objet requis pour envoyer à l'API
                let orderInfos = {
                    contact: {
                        firstName: firstName.value,
                        lastName: lastName.value,
                        address: address.value,
                        city: city.value,
                        email: email.value
                    },
                    products: resultArrayOfOrderInfos
                }

                return orderInfos;
            }
        }


        //// A la validation du formulaire l'objet requis est envoyé au backend et il retourne l'id de commande ou sinon un code erreur
        const orderButton = document.getElementById("order");
        

        orderButton.addEventListener("click", (e) => {
            e.preventDefault(); //previens d'une validation sans contrôle javascript de notre part
            let jsonDataFromCart = makeJsonDataForCart();
            //console.log(jsonDataFromCart);

            // si formulaire incomplet
            if (firstName.value === "" || lastName.value === "" || address.value === "" || email.value === "" || city.value === "") {
                alert("Veuillez remplir correctement le formulaire s'il vous plaît")
            } else {

                fetch(postUrlForCardOrder, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(jsonDataFromCart),
                })
                .then((res) => res.json())
                // to check res.ok status in the network
                .then(function (data) {
                    //console.log('data retourné par API : ' + data.orderId)
                    localStorage.clear()
                    document.location.href = "confirmation.html?orderId=" + data.orderId
                })
                .catch (function (err) {
                    //console.log(err.message)
                    alert("Une erreur est survenue, merci de revenir plus tard.");
                });

            } // fin du si formulaire incomplet

        }); // fin orderButton.addEventListener

    } catch (e) {
        console.log('Catched Error', e);
        console.log('Erreur dans la gestion du caddie');
    }
};

//
// FONCTIONS SPECIFIQUES - cart.html - Fin  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _




// Debut de la partie en execution _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

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

