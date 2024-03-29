// FONCTIONS SPECIFIQUES - cart.html - Debut  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
/*
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

        // cible l'emplacement pour coller le template avant de le remplir
        let cartPlaceholder = document.getElementById('cart__items'); // document.querySelector('#cart__items');

        //1re méthodologie en coller brut (en général on charge un fichier externe qui sert de template)

        // parse le template
        //cartHtml = `<article class="cart__item" id="${CartIdColorItem}" data-idColor="${CartIdColorItem}" data-id="${item._id}" data-color="${CartColorItem}"><div class="cart__item__img"><img src="${item.imageUrl}" alt="${item.altTxt}"></div><div class="cart__item__content"><div class="cart__item__content__description"><h2>${item.name}</h2><p>${CartColorItem}</p><p>${item.price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${CartQuantityItem}"></div><div class="cart__item__content__settings__delete"><p data-idColor="${CartIdColorItem}" class="deleteItem">Supprimer</p></div></div></div></article>`;
        //cartPlaceholder.textContent += cartHtml;
        // cette façon est déconseillee il faut utiliser
        // insertAdjacentHTML(cartPlaceholder, cartHtml); // de préférence à faire en dehors d'une boucle pour intervenir qu'une fois sur le calcul d'affichage
        /*insertAdjacentHTML() analyse le texte spécifié en tant que HTML ou XML et insère les noeuds résultants dans le DOM
         * à la position spécifiée.L'élement qui est utilisé n'est pas réanalysé et les élements qu'il contient ne sont donc pas corrompus.
         * Ceci, et le fait d'éviter la sérialisation supplémentaire, rend la fonction plus rapide et directe que textContent
         * Syntaxe : element.insertAdjacentHTML(position, text);
        */

        // 2e méthodologie en pas a pas avec le moteur javascript

        // déclaration des sélecteurs
        let containDivImg = document.getElementsByClassName('cart__item__img');
        let divDelete = document.getElementsByClassName('cart__item__content__settings__delete');
        let pDelete = document.getElementsByClassName('deleteItem');
        
        // article
        let cartItem = document.createElement('article');
        cartItem.className = 'cart__item';
        cartItem.setAttribute('id', cartIdColorItem);
        cartItem.setAttribute('data-idColor', cartIdColorItem);
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
        let pQuantity = document.createElement('p');
        divQuantity.appendChild(pQuantity);
        pQuantity.textContent = 'Qté : ';

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
        pDelete = document.createElement('p');
        divDelete.appendChild(pDelete);
        pDelete.className = 'deleteItem';
        pDelete.textContent = 'Supprimer';
        pDelete.setAttribute('data-idColor', cartIdColorItem);

        // ecrire dans la page html
        cartPlaceholder.appendChild(cartItem);

    } catch (error) {
        console.log('Catched Error1', error);
        console.log('Erreur en ecriture dans la page product.html');
    };
};

/*
 * Ajoute des écouteurs à notre bouton supprimer du panier
 */
function listenDeleteItemToCart() {
    // cherche tous les noeuds qui nous interessent
    document.querySelectorAll('.deleteItem').forEach((item) => {

        // attache une fonction evènementielle
        item.addEventListener('click', function (event) {

            itemPath = '#' + item.getAttribute('data-idcolor') + ' > div.cart__item__content > div.cart__item__content__description > h2';
            let itemName = document.querySelector(itemPath).textContent;
            //console.log(itemName);

            itemColorPath = '#' + item.getAttribute('data-idcolor') + ' > div.cart__item__content > div.cart__item__content__description > p';
            let itemColor = document.querySelector(itemColorPath).textContent;
            //console.log(itemColor);

            // informe l'utilisateur et redirige si l'utilisateur le veut bien
            if (confirm(`Votre article :\n${itemName} de couleur ${itemColor} va être supprimé.\nPour supprimer, cliquez sur OK`)) {
 
                // reprend la propriete data-idcolor du bouton supprimer, sur ce quoi je clique 
                // et se sert de cette réference pour pointer sur le résultat de recherche 
                // pour la propriété id présent dans les articles
                referenceToDelete = item.getAttribute('data-idcolor');
                //console.log(referenceToDelete);

                // suppression de l'article HTML et dans le localStorage
                articleToDelete = document.getElementById(referenceToDelete);
                if(articleToDelete) {
                    // suppression de l'article HTML
                    articleToDelete.remove();
                    // suppression de l'article dans le localStorage
                    if(deleteLocalStorageItem(referenceToDelete)) { // === true
                        //console.log('Elément du localStorage suivant est supprimé : ' + referenceToDelete);
                        displayQuantityAndAmount();
                        //console.log('Mise à jour des quantités et prix total du panier requis par la suppression d\'un article');
                    } else {
                        //console.log('Elément du localStorage non trouvé pour suppression ! : ' + referenceToDelete);
                    };
                };

                // met à jour les quantités et le prix total
                updateQuantityAndAmount();

            };

            //annulation de la suppresion par l'utilisateur

        });
    });
};

/*
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

            // gestion du message d'erreur
            let myParent = item.closest('div');
            let errorMessage = document.createElement('span');

            // mise a jour du local storage

            // reprend element mais vérifie si max autorisé
            let itemFound = JSON.parse(const_storage.getItem(askedItem));

            // Enlever le message d'erreur
            if (myParent.getElementsByTagName('span').length > 0) {
                let spanToDelete = myParent.getElementsByTagName('span')[0];
                myParent.removeChild(spanToDelete);
            };

            if((newQuantity > 0 && newQuantity < 101) && (newQuantity % 1 === 0)) {
                // met à jour
                itemFound.quantity = newQuantity;

                // supprime avant ajout
                const_storage.removeItem(askedItem);

                // enregistre
                const_storage.setItem(askedItem, JSON.stringify(itemFound));

                // mettre a jour la quantite et le prix du panier
                displayQuantityAndAmount();

            } else {

                //console.log('Nombre d'exemplaire max dépassé');
                errorMessage.style.color = const_errorColor;
                errorMessage.style.fontWeight = const_fontWeight;
                errorMessage.setAttribute('class', const_classColor);

                if (newQuantity > 100) {
                    errorMessage.textContent = '❌ Quantité maximum autorisé : 100 !';
                } else {
                    errorMessage.textContent = '❌ Quantité invalide !';
                }
                
                myParent.appendChild(errorMessage);

            }; // fin du else
        }); // fin item.addEventListener
    }); // fin document.querySelectorAll
};// fin updateQuantityAndAmount

/*
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

    // Affichage du nombre d'articles dans la navigation
    let navCart = document.querySelector("body > header > div.limitedWidthBlockContainer.menu > div > nav > ul > a:nth-child(2) > li");
    if (sumQuantity > 0) {
        navCart.textContent = "Panier( " + sumQuantity + " )";
    } else {
        navCart.textContent = "Panier";
    };
}

/*
* Vérification des champs du formulaire pour les saisies de l'utilisateur
* @param { object } item // 
* @param { string } regex // 
* @param { string } myErrorColor //
* @param { string } myFontWeight //
* @param { string } myClassError //
* @param { number } minLimit //
* @param { number } maxLimit //
*/
const displayInvalidInfo = function (item, myRegex, myErrorColor, myFontWeight, myClassError, minLimit, maxLimit) {
    // utilise une regex pour la vérification du contenu du champ
    let inputRegExp = new RegExp(myRegex);

    // teste la regex
    let testInput = inputRegExp.test(item.value);
    let res_charNotCompliant = testCharCompliant(item.value, minLimit * 1, maxLimit * 1);
    let errorMessage = item.nextElementSibling;

    if (item.value === '') {
        errorMessage.textContent = '';

    } else if (!testInput || res_charNotCompliant.length !== 0) {
        errorMessage.style.color = myErrorColor;
        errorMessage.style.fontWeight = myFontWeight;
        errorMessage.setAttribute('class', myClassError);
        if (res_charNotCompliant.length !== 0) {
            errorMessage.textContent = '❌ ' + res_charNotCompliant;
        } else {
            errorMessage.textContent = '❌ Format non respecté, merci de vérifier votre saisie';
        }

    } else if (testInput) {
        errorMessage.textContent = ''
        errorMessage.removeAttribute('class');
    }
}

/*
 * Créer un tableau avec les ids des produits commandés
*/
function createArrayOfOrderInfos(allItems) {
    array_items = [];
    for (let item in allItems) {
        array_items.push(allItems[item].id);
    }
    return array_items;
}

/*
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
            writeCartSelectedProduct(articleData, const_storage.key(item), requestAllCartItems[item].color, requestAllCartItems[item].quantity);

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

        // Vérifie les interractions de l'utilisateur sur le formulaire
        // recherche tous les champs "input" à vérifier
        // pour chaque résultat vérifie

        // sélectionne objet formulaire
        let myForm = document.getElementsByClassName('cart__order__form');
        //console.log(myForm);
        let allInputs = myForm[0].querySelectorAll('[type="text"]');
        let emailInput = myForm[0].querySelectorAll('[type="email"]');
        // fusion
        var allTags = [];
        allTags.push.apply(allTags, allInputs);
        allTags.push.apply(allTags, emailInput);
        //console.log(allTags);

        allTags.forEach((item) => {
            let minLimit = 0;
            let maxLimit = 100;
            let myRegex = "^[A-Za-zÀ-ÖØ-öø-ÿ\- \'?]{0,55}$";
            let myEvent = 'input';

            switch (item.id) {
                case 'email':
                    minLimit = 7;
                    myRegex = "^[a-zA-Z0-9\.\-_]{1,50}" + "[@]{1}" + "[a-zA-Z0-9\.\-_]{2,49}" + "[.]{1}" + "[a-zA-Z]{2,4}$";
                    myEvent = 'change';
                    break
                case 'address':
                    myRegex = "^[0-9A-Za-zÀ-ÖØ-öø-ÿ\-, \'?]{0,100}$";
                    break
                default:
                    maxLimit = 55;
                    break
            }
            item.addEventListener(myEvent, function () {
                // appel de la fonction d'invalidation de saisie de(s) champ(s)
                displayInvalidInfo(this, myRegex, const_errorColor, const_fontWeight, const_classColor, minLimit, maxLimit);
            });
        });


        /////////// POST request ////////////

        // rassembler les données à transmettre à l'API
        function makeJsonDataForCart() {

            let myParent = document.querySelector('#cart__items');
            //console.log(myParent.querySelector('#emptyCart'))
            // Enlever le message d'erreur
            
            if (myParent.querySelector('#emptyCart')) {
                let divToDelete = myParent.getElementsByTagName('p')[0];
                myParent.removeChild(divToDelete);
            };
            
            // parcours le local storage des élements du panier et retourne un tableau
            let resultAllCartItems = readLocalStorage();
            //console.log(resultAllCartItems);

            // Reprendre les id des articles du local storage
            let resultArrayOfOrderInfos = createArrayOfOrderInfos(resultAllCartItems);
            //console.log(resultArrayOfOrderInfos);

            // combien d'articles en achat
            let nbOfCartItems = resultArrayOfOrderInfos.length;

            // traite la vérification avant commande
            if(nbOfCartItems === null || nbOfCartItems === 0) {

                let paragraph = document.createElement('p');
                paragraph.id = 'emptyCart',
                paragraph.className = const_classColor,
                myParent.append(paragraph);
                paragraph.textContent = 'Votre panier est vide !';

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

            const errorFoundInFormFields = document.getElementsByClassName(const_classColor);

            // si panier vide ou formulaire incomplet
            if (jsonDataFromCart == undefined){
                alert('Votre panier est vide ! Nous ne pouvons passer commande.');
                // pas se classe CSS d'erreur ou de champ non rempli
            } else if ( errorFoundInFormFields.length > 0 || firstName.value === '' || lastName.value === '' || address.value === '' || email.value === '' || city.value === '') {
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
                    //alert("je peux commander !");
                    document.location.href = 'confirmation.html?order_id=' + data.orderId;
                })
                .catch (function (err) {
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