// CONFIGURATION GLOBALE
const var_protocol = "http";
const var_host = "://localhost"
const var_port = ":3000";
const var_path = "/api/products";
const var_fullAddress = var_protocol + var_host + var_port + var_path;
const var_allProducts = var_fullAddress + "/";


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
        console.log('Catched Error5', error);
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
 * Verifie que la page en cours est index.html
 */
function testRouteAllProducts() {
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

/**
 * Utilise le bon iteneraire selon la demande
 * @param { string } routeAsked
 */
async function hubContent(routeAsked) {
    try {
        //recupere le contenu via iteneraire determinee par Api   
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
        //console.log(obj_articleSelected);
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
        //alert("Ajout au panier OK !")
        addLocalStorage(articleSelected);
    } else {
        alert("Ajout au panier non pris en compte : merci de choisir une quantité valide !")
    }
}

/**
 * gere ajout dans le panier du composant local storage
 * @param { object } articleForLocalStore
 */
function addLocalStorage(articleJson) {
    //stockage objet
    const idTarguet = articleJson.id;

    //const testC = localStorage.getItem("basketKanap");
    //console.log("Testc : " + testC);

    // Cas reprise du panier pour cette premiere fois
    if (localStorage.getItem(idTarguet) !== null) {
        console.log("_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ ");
        console.log('Vrai panier existant');
        const objFirstLine = localStorage.getItem(idTarguet);
        const objJson = JSON.parse(objFirstLine);
        newItem = true; // ajoute ou met a jour

        // parcours le Local Storage
        for (i_value in localStorage) {
            
            const test = objJsonZ[i_value] + " (n=" + i_value + ")";
            // cas id present on met a jour dans certaine condition
            if (i_value == idTarguet) {
                newItem = false;
                console.log("Meme id : " + i_value + " compare a " + idTarguet);
                // cas condition de mise à jour sur si meme article et meme couleur on fusionne nos quantités
                //if () { //formule de test
                newItem = false;
                //
                //
                //
                // cas nouveau element a creer - ne fait rien ici - detecte simplement
                //} else if () {
                //var_newItem = true;
                //console.log("Nouvel element car non fusionnable");
                //}

                // cas id non present ou nouvel element non fusionnable on ajoute ce nouveau element
            }
            /*
            else if (var_newItem == true) {
                console.log("Ajout nouvel element dans la partie de mise a jour du Local Storage");

                //prepare objet pour le mettre dans local storage
                const articleForLocalStore = JSON.stringify(articleJson);

                //enregistre la chaine
                localStorage.setItem(idTarguet, articleForLocalStore);
                }
            */
            
        } // fin parcours du local storage

    // Cas creation du panier pour cette premiere fois
    } else {
        console.log("_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ ");
        console.log('Pas de panier on le creer');

        //prepare objet pour le mettre dans local storage
        const articleForLocalStore = JSON.stringify(articleJson);

        //enregistre la chaine
        localStorage.setItem(idTarguet, articleForLocalStore);
        //console.log("On ajoute un element direct");

        //test de restitution de element ajoute
        const objFirstLine = localStorage.getItem(idTarguet);
        //console.log("Test de restitution de element ajoute : " + objFirstLine);

        //test de recuperation de propriete apres retransformation en objet
        //const objJson = JSON.parse(objFirstLine);
        //console.log(objJson.color);
    }
    console.log("_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ ");
    console.log("TOTAL : " + localStorage);
    const objFirstLineZ = localStorage.getItem(idTarguet);
    const objJsonZ = JSON.parse(objFirstLineZ);
    console.log(objJsonZ.color);
    for (i_value in objJsonZ) {
        const testZ = objJsonZ[i_value] + " (n=" + i_value + ")";
        console.log(testZ);
    }

};
// BIBLIOTHEQUE SPECIFIQUE - product.html - Fin  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 



// Debut Partie en execution _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
//
//
localStorage.clear();

// product.html - Appelle le contenu du produit selectionne de l API et insere dans la page
if (testRouteSelectedProduct() == true) {
    var_idUrl = idGetRequest();
    hubContent('routeSelectedProduct');
    listenAddToCart(var_idUrl);
};

// index.html - Appelle le contenu de tous les produits de l API et insere dans la page
if (testRouteAllProducts() == true) {
    hubContent("routeAllProducts");
};

localStorage.clear();