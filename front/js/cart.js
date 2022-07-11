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
        return await response.json();
    } catch (error) {
        // Pour info de Cyril - une variable environnement !==prod  amene une sortie sur la console
        // ou une creation de fonction dedie genre mylog() - partie log generale pour utilisateur ou detaille confidentiel
        console.log('Catched Error5', error); //Remarque Cyril : mettre un sens genre "NO_ANSWER_FROM_API" pour gerer la localisation et donc formatage culturel
        console.log('La reponse de API est en erreur avec ces parametres : ' + param_path + param_keyAndValue);
    }
}

/**
 * Verifie que la page en cours est index.html
 */
/*
function testRouteAllProducts() {   ------------------> Ne sert plus remplacer par fonction    testRouteItem(file)
    const myUrl = new URL(window.location);
    const myRegex = new RegExp('index.html$');
    const myUrlPathname = myUrl.pathname
    //si trouve chaine
    if (myRegex.test(myUrlPathname)) {
        return true;
    } else {
        //console.log('La Regex echoue pour identifier la page index.html : ' + myUrlPathname);
        return false;
    }
};
*/

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
            content = await retrieveContent(var_allProducts, var_idUrl);
            //ecrit le contenu
            writeSelectedProduct(content);
        }
        if (routeAsked == "routeAllProducts") {
            //cherche le contenu de API
            content = await retrieveContent(var_allProducts);
            //ecrit le contenu
            writeAllProducts(content);
        }
        if (routeAsked == "routeCart") {

            const var_idUrl = '034707184e8e4eefb46400b5a3774b5f'; // EN TEST !

            //parcours le local storage des elements du panier
            // retourne un tableau
            requestAllBasketItems = await readLocalStorage();
            //console.log(requestAllBasketItems);

            // tri le tableau par ordre alphabetique
            /*
            requestAllBasketItems.sort(function (a, b) {
                // comparaisons ignore upper and lowercase
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                //réorganise les produits par ordre alphabétique 
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                //si égalité reste à sa position
                return 0;
            });
            */
            // ici on est bon a un tableau trie et groupe sur les quantités quand meme couleur

            requestAllBasketItems.forEach((item) => {
                console.log('Test 42: ' + item.id);
                console.log('Test 43 : ' + item.name);
                console.log('Test 44 : ' + item.quantity);
                
                monObjet = retrieveContent(var_allProducts, item.id);
                /*
                var monTableau = Object.keys(monObjet).map(function (cle) {
                    return [Number(cle), monObjet[cle]];
                });
                */
                console.log(monObjet);
            });


            // interroge api via id produit
            //requestAllBasketItems.forEach((item) => {
                //console.log('requete dans API chaque object present dans le panier et ressort un Json : ' + item.id);
            //});
            content = await retrieveContent(var_allProducts, var_idUrl);

            // ecrit une carte dans le panier
            writeCartSelectedProduct(content);

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
async function writeAllProducts(array_textRequest) {
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
async function writeSelectedProduct(array_selectedProduct) {
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
        //for (var i = 0; i < var_eltHtmlSelect.length; i++) {     //OLD SCHOOL
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
 * Ecrit le contenu dans la page de panier en lien avec le local storage
 * @param { array } array_selectedProduct
 */
async function writeCartSelectedProduct(selectedItemFromCart) { // parameters : array_selectedProduct
    try {
        //const tableau = [1, 2, 3, 4];
        //const tableau = JSON.stringify(selectedItemFromCart);
        // interroge api via id produit
        //tableau.forEach(element => console.log(element));


        
        var monObjet = selectedItemFromCart; // { "8": 10, "6": 4, "12": 5 }
        var monTableau = Object.keys(monObjet).map(function (cle) {
            return [Number(cle), monObjet[cle]];
        });
        console.log(monTableau);
        


        for (var i = 0; i < selectedItemFromCart.length; i++) {
            //selectedItemFromCart.forEach((item) => {
            console.log('ressort avant de paser le template html - la valeur id de item en cours : ' + item._id);
            //console.log('item en cours color : ' + item.color);
            console.log('item en cours name : ' + item.name);
            console.log('item en cours imageUrl : ' + item.imageUrl);
            console.log('item en cours altTxt : ' + item.altTxt);
            console.log('item en cours price : ' + item.price);
            //console.log('item en cours quantity : ' + item.quantity);
            //});
        };
            /*
            console.log('ressort avant de paser le template html - la valeur id de item en cours : ' + item._id);
            console.log('item en cours color : ' + item.color);
            console.log('item en cours name : ' + item.name);
            console.log('item en cours imageUrl : ' + item.imageUrl);
            console.log('item en cours altTxt : ' + item.altTxt);
            console.log('item en cours price : ' + item.price);
            console.log('item en cours quantity : ' + item.quantity);
            */
        //});
        

        //<img src="${item.imageUrl}" alt="${item.altTxt}">
        //templateHtml = `<article class="cart__item" data-id="" data-color="${item.color}"><div class="cart__item__img"></div><div class="cart__item__content"><div class="cart__item__content__description"><h2>${item.name}</h2><p>${item.color}</p><p>${item.price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>`;
        //${item._id}

        //const ciblingSection = document.getElementById('cart__items');
        //ciblingSection.innerHTML = templateHtml;

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
/**
 * lit le local storage panier du composant local storage
 */
function readLocalStorage() {
    if (localStorage.length > 0) {
        // parcours le local storage
        const object_articleInLocalStore = [];
        for (var i_value = 0; i_value <= localStorage.length; i_value++) {
            // recupere la cle en cours puis va chercher son dicionnaire puis enfin pousse element trouve dans le tableau de reception
            itemKey = localStorage.key(i_value);
            if (itemKey !== null) {
                object_articleInLocalStore.push(JSON.parse(localStorage.getItem(itemKey)));
                //object_articleInLocalStore.push(localStorage.getItem(itemKey));
            }
        };
       /* 
        object_articleInLocalStore.forEach((item) => {
            console.log('Test 42: ' + item.id);
            console.log('Test 43 : ' + item.name);
            console.log('Test 44 : ' + item.quantity);
        });*/
        
        return object_articleInLocalStore;
    };
};
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
