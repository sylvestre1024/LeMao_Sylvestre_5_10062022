// FONCTIONS SPECIFIQUES - cart.html - Debut  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
/*
 * lit le local storage panier du composant local storage
 */
function readLocalStorage() {
    if (localStorage.length > 0) {

        // parcours le local storage
        let object_articleInLocalStore = [];
        for (let i_value = 0; i_value <= localStorage.length; i_value++) {

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
 * Supprime un élement du local storage
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
 * Ecrit le contenu dans la page panier en lien avec les éléments fourni par l'API et par le local storage via paramètres
 * @param { object } item
 * @param { string } cartIdColorItem
 * @param { string } cartColorItem
 * @param { string } cartQuantityItem
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

        // cible l'emplacement pour coller le template avant de le remplir
        let cartPlaceholder = document.getElementById('cart__items'); // document.querySelector('#cart__items');

        //1re méthodologie en coller brut (en général on charge un fichier externe qui sert de template)

        // parse le template
        //cartHtml = `<article class="cart__item" id="${CartIdColorItem}" data-idColor="${CartIdColorItem}" data-id="${item._id}" data-color="${CartColorItem}"><div class="cart__item__img"><img src="${item.imageUrl}" alt="${item.altTxt}"></div><div class="cart__item__content"><div class="cart__item__content__description"><h2>${item.name}</h2><p>${CartColorItem}</p><p>${item.price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${CartQuantityItem}"></div><div class="cart__item__content__settings__delete"><p data-idColor="${CartIdColorItem}" class="deleteItem">Supprimer</p></div></div></div></article>`;
        //cartPlaceholder.textContent += cartHtml;
        // cette façon est déconseillee il faut utiliser
        /*insertAdjacentHTML() analyse le texte spécifié en tant que HTML ou XML et insère les noeuds résultants dans le DOM
         * à la position spécifiée.L'élement qui est utilisé n'est pas réanalysé et les élements qu'il contient ne sont donc pas corrompus.
         * Ceci, et le fait d'éviter la sérialisation supplémentaire, rend la fonction plus rapide et directe que textContent
         * Syntaxe : element.insertAdjacentHTML(position, text);
        */

        // 2e méthodologie en pas a pas avec le moteur javascript

        // déclaration des sélecteurs
        let containDivImg = document.getElementsByClassName('cart__item__img');
        let divDelete = document.getElementsByClassName('cart__item__content__settings__delete');
        let paragraphDelete = document.getElementsByClassName('deleteItem');

        // article
        let cartItem = document.createElement('article');
        cartItem.className = 'cart__item';
        cartItem.setAttribute('id', cartIdColorItem);
        cartItem.setAttribute('data-id', item._id);
        cartItem.setAttribute('data-color', cartColorItem);

        // image
        containDivImg = document.createElement('div');
        containDivImg.className = ('cart__item__img');
        cartItem.appendChild(containDivImg);

        let img = document.createElement('img');
        containDivImg.appendChild(img);
        img.src = item.imageUrl;
        img.alt = item.altTxt;

        // conteneur
        let divContent = document.createElement('div');
        cartItem.appendChild(divContent);
        divContent.className = 'cart__item__content';

        // description
        let divDescription = document.createElement('div');
        divContent.appendChild(divDescription);
        divDescription.className = 'cart__item__content__description';

        // titre
        let title = document.createElement('h2');
        divDescription.appendChild(title);
        title.textContent = item.name;

        // couleur
        let color = document.createElement('p');
        divDescription.appendChild(color);
        color.textContent = cartColorItem;

        // conteneur
        let settings = document.createElement('div');
        divContent.appendChild(settings);
        settings.className = 'cart__item__content__settings';

        // conteneur quantité
        let divQuantity = document.createElement('div');
        settings.appendChild(divQuantity);
        divQuantity.className = 'cart__item__content__settings__quantity';

        // quantité
        let paragraphQuantity = document.createElement('p');
        divQuantity.appendChild(paragraphQuantity);
        paragraphQuantity.textContent = 'Qté : ';

        let inputQty = document.createElement('input');
        divQuantity.appendChild(inputQty);
        inputQty.className = 'itemQuantity';
        inputQty.setAttribute('type', 'number');
        inputQty.setAttribute('class', 'itemQuantity');
        inputQty.setAttribute('name', 'itemQuantity');
        inputQty.setAttribute('min', '0');
        inputQty.setAttribute('max', '100');
        inputQty.setAttribute('step', '1');
        inputQty.setAttribute('value', cartQuantityItem);

        // prix
        let price = document.createElement('p');
        divDescription.appendChild(price);
        price.textContent = item.price + '€';

        // article delete
        divDelete = document.createElement('div');
        settings.appendChild(divDelete);
        divDelete.className = 'cart__item__content__settings__delete';
        paragraphDelete = document.createElement('p');
        divDelete.appendChild(paragraphDelete);
        paragraphDelete.className = 'deleteItem';
        paragraphDelete.textContent = 'Supprimer';
        paragraphDelete.setAttribute('data-idColor', cartIdColorItem);

        // ecrire dans la page html
        cartPlaceholder.appendChild(cartItem);

    } catch (error) {
        console.log('Catched Error1', error);
        console.log('Erreur en ecriture dans la page product.html');
    };
};

/**
 * Ajoute des écouteurs à notre bouton supprimer du panier
 */
function updateDeletedItem() {
    // cherche tous les noeuds qui nous interessent
    document.querySelectorAll('.deleteItem').forEach((item) => {

        // attache une fonction evènementielle
        item.addEventListener('click', function (event) {

            // reprend la propriete data-idcolor du bouton supprimer, sur ce quoi je clique 
            // et se sert de cette réference pour pointer sur le résultat de recherche 
            // pour la propriété id présent dans les articles
            referenceToDelete = item.getAttribute('data-idcolor');
            //console.log(referenceToDelete);

            // suppression de l'article HTML et dans le localStorage
            articleToDelete = document.getElementById(referenceToDelete);
            if (articleToDelete) {
                // suppression de l'article HTML
                articleToDelete.remove();
                // suppression de l'article dans le localStorage
                if (deleteLocalStorageItem(referenceToDelete)) { // === true
                    //console.log('Elément du localStorage suivant est supprimé : ' + referenceToDelete);
                    displayQuantityAndAmount();
                    //console.log('Mise à jour des quantités et prix total du panier requis par la suppression d\'un article');
                } else {
                    //console.log('Elément du localStorage non trouvé pour suppression ! : ' + referenceToDelete);
                };
            };

            // met à jour les quantités et le prix total
            updateQuantityAndAmount();

        });
    });
};

/**
 * Met à jour les quantités et prix total du panier en fonction des choix interactifs de l'utilisateur
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
    // reprend le prix et quantité de chaque article dans le panier et calcul un prix total

    let mathPrice = 0;
    let array_amount = [];
    let array_quantity = [];
    // parcours le local storage des élements du panier et retourne un tableau
    let requestAllCartItems = readLocalStorage();

    // remplit chaque template article et le colle dans la page html
    for (let item in requestAllCartItems) {

        await fetch(var_allProducts + requestAllCartItems[item].id)
            .then((res) => res.json())
            .then((data) => (
                articleData = data
            ))
            .catch((error) => console.log(error));

        array_amount.push(Number(articleData.price) * Number(requestAllCartItems[item].quantity));
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
 * Gestion du chariot de course des produits d'achats
 */
async function cartManagement() {
    try {

        // parcours le local storage des élements du panier et retourne un tableau
        requestAllCartItems = readLocalStorage();

        // remplit chaque template article et le colle dans la page html
        for (let item in requestAllCartItems) {

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
        updateDeletedItem();

        // gere les modifications des quantites unitaires et met à jour les quantités et le prix total du panier
        updateQuantityAndAmount();



        ////////////////////////////////////////////////////////////////
        // Form Control & POST request /////////////////////////////////
        ////////////////////////////////////////////////////////////////


        ////////////// Form control ////////////


        // ETAPE 1 /3
        // le champ email

        // sélectionne objet email
        let email = document.querySelector('#email')

        // affichage invalide du champ email
        const displayInvalidEmail = function (inputEmail) {
            // utilise une regex pour les adresses mails
            let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]{1,50}[@]{1}[a-zA-Z0-9.-_]{1,50}[.]{1}[a-z]{2,10}$', 'g')

            // teste la regex
            let testEmail = emailRegExp.test(inputEmail.value)
            let errorMessage = inputEmail.nextElementSibling

            if (inputEmail.value === '') {
                errorMessage.textContent = ''

            } else if (!testEmail) { //  === false
                errorMessage.style.color = '#2C3E50'
                errorMessage.style.fontWeight = '600'
                errorMessage.textContent = '❌ Adresse email invalide'

            } else if (testEmail) { // === true
                errorMessage.textContent = ''
            }
        }

        // écoute et vérifie le champ email
        email.addEventListener('change', function () {
            // affichage invalide du champ email
            displayInvalidEmail(this)
        });


        // ETAPE 2 /3
        // le champ adresse

        // sélectionne objet adresse
        let address = document.querySelector('#address')

        // affichage invalide du champ adresse
        const displayInvalidAddress = function (inputAddress) {
            // utilise une regex pour les adresses
            /*
             * Cette regex accepte minimum de trois caractères et il n'y a pas de limite max 
             * de caractères. Elles peuvent inclure a-z, A-Z, des alphabets, 
             * des espaces, des virgules(,), point(.), apostrophe ( ' ) et le tiret(-) des symboles.
             */
            let addressRegExp = new RegExp(/^[[0-9a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ,\'_\s-]{0,60}$/) // (/^[.) //("/^[a-zA-Z0-9\s,.' -]$/")
            // -,\'
            // teste la regex
            let testAddress = addressRegExp.test(inputAddress.value)
            let errorMessage = inputAddress.nextElementSibling

            if (inputAddress.value === '') {
                errorMessage.textContent = ''

            } else if (!testAddress) { //  === false
                errorMessage.style.color = '#2C3E50'
                errorMessage.style.fontWeight = '600'
                errorMessage.textContent = '❌ Adresse invalide'

            } else if (testAddress) { // === true
                errorMessage.textContent = ''
            }
        }

        // écoute et vérifie le champ adresse
        address.addEventListener('change', function () {
            // affichage invalide du champ adresse
            displayInvalidAddress(this)
        });


        // ETAPE 3 /3
        // vérification des autres champs communs du formulaire

        // cible les id des champs communs du formulaire à controller
        array_NotNumberOrSymbolForInput = ['#lastName', '#firstName', '#city'];

        // affichage invalide pour les autres champs
        const displayInvalidCommonInput = function (inputInfo) {
            // utilise une regex
            let infoRegExp = new RegExp(/^[a-zA-Z-\s?]{0,25}$/)
            // teste la regex
            let testInfo = infoRegExp.test(inputInfo.value)
            let errorMessage = inputInfo.nextElementSibling

            if (inputInfo.value === '') {
                errorMessage.textContent = ''

            } else if (!testInfo) {  //=== false
                errorMessage.style.color = '#2C3E50'
                errorMessage.style.fontWeight = '600'
                errorMessage.textContent = '❌ Nombre ou symbole non autorisé'

            } else if (testInfo) { //=== true
                errorMessage.textContent = ''
            }
        }

        // fonction qui parcours tous les champs, les ecoutent et les invalident si nécessaire
        function checkCommonInput(array_id) {

            for (var i = 0; i < array_id.length; i++) {  // #lastName

                let mySelector = document.querySelector(array_id[i]); // <input type='text' name='lastName' id='lastName' required>

                mySelector.addEventListener('input', function () {
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
            if (nbOfCartItems === null || nbOfCartItems === 0) {

                let paragraph = document.createElement('p');
                paragraph.className = 'alerte',
                    document.querySelector('#cart__items').append(paragraph);
                paragraph.textContent = 'votre panier est vide !';
                return null;

            } else {
                // sécurise la chaine adresse
                secureAddress = htmlEntities(address.value);

                // construction de l'objet requis pour envoyer à l'API
                let orderInfos = {
                    contact: {
                        firstName: firstName.value,
                        lastName: lastName.value,
                        address: secureAddress,
                        city: city.value,
                        email: email.value
                    },
                    products: resultArrayOfOrderInfos
                }
                //console.log(orderInfos.map(property => property));
                return orderInfos;
            }
        }



        const orderButton = document.getElementById('order');

        //// A la validation du formulaire l'objet requis est envoyé au backend et il retourne l'id de commande ou sinon un code erreur
        orderButton.addEventListener('click', (e) => {
            e.preventDefault(); //previens d'une validation sans contrôle javascript de notre part
            let jsonDataFromCart = makeJsonDataForCart();
            //console.log(jsonDataFromCart);

            // si panier vide
            if (jsonDataFromCart === null) {
                alert('Il n\'y a pas d\'article dans votre commande !');
            }
            // si formulaire incomplet
            else if (firstName.value === '' || lastName.value === '' || address.value === '' || email.value === '' || city.value === '') {
                alert('Veuillez remplir correctement le formulaire s\'il vous plaît');
            } else {

                fetch(postUrlForCardOrder, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonDataFromCart),
                })
                    .then((res) => res.json())
                    // vérifier la promesse de données de l'appel réseau
                    .then(function (data) {
                        //console.log('data retourné par API : ' + data.orderId)
                        document.location.href = 'confirmation.html?order_id=' + data.orderId
                    })
                    .catch(function (err) {
                        //console.log(err.message)
                        alert('Une erreur est survenue, merci de revenir plus tard.');
                    });

            } // fin du si formulaire incomplet

        }); // fin orderButton.addEventListener

    } catch (e) {
        console.log('Catched Error', e);
        console.log('Erreur dans la gestion du caddie');
    };
};
//
// FONCTIONS SPECIFIQUES - cart.html - Fin  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// Debut de la partie en execution _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
try {

    // gestion du chariot de course
    cartManagement();

} catch (e) {
    console.log('Catched Error', e);
    console.log('Erreur dans la demande d\'affichage du panier');
};
// Fin de la partie en execution _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 