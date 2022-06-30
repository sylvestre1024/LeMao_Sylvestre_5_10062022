const var_protocol = "http";
const var_host = "://localhost"
const var_port = ":3000";
const var_path = "/api/products";
const var_fullAddress = var_protocol + var_host + var_port + var_path;
const var_allProducts = var_fullAddress + "/";


/**
 * Retourne du contenu de API
 * @param { string } param_path // qui est un chemin url
 * @param { string } param_keyAndValue // qui est une chaine de(s) parametre(s)
 */
async function retrieveContent(param_path, param_keyAndValue) {
    if (param_keyAndValue == undefined) {
        param_keyAndValue = '';
    }
    const response = await fetch(param_path + param_keyAndValue);
    return response.json();
    // !!! Demande du mentor : faire evoluer avec un timeout !!!
};


/**
 * Utilise le bon iteneraire selon la demande
 * @param { string } routeAsked
 */
async function hubContent(routeAsked) {
    try {
        if (routeAsked !== undefined) {
            //recupere le contenu via iteneraire determinee par Api   
            if (routeAsked == "routeSelectedProduct") {
                //reprend la valeur du parametre id dans Url
                const var_idUrl = idGetRequest();
                if (var_idUrl != "" && var_idUrl != undefined) {
                    hubContent(var_fullAddress + "/", "id=" + var_idUrl, "routeProduct");
                    //cherche le contenu de API
                    content = await retrieveContent(var_allProducts, var_idUrl);
                    //ecrit le contenu
                    writeSelectedProduct(content);
                } else {
                    console.log("id avec format incorrect ou vide");
                }
            }
            if (routeAsked == "routeAllProducts") {
                //cherche le contenu de API
                content = await retrieveContent(var_allProducts);
                //ecrit le contenu
                writeAllProducts(content);
            }
        }
    } catch (e) {
        console.log('Catched Error', e);
        console.log(routeAsked);
    }
};

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
        document.getElementsByClassName('item__img')[0].appendChild(var_image);       //a simplifier ?
        
        //titre
        const var_title = document.getElementById('title');                             //a simplifier ?
        var_title.innerHTML = array_selectedProduct.name;

        //prix
        const var_price = document.getElementById('price');                             //a simplifier ?
        var_price.innerHTML = array_selectedProduct.price;
        
        //description
        const var_description = document.getElementById('description');                       //a simplifier ?
        var_description.innerHTML = array_selectedProduct.description;

        //couleurs
        const var_eltHtmlSelect = array_selectedProduct.colors;
        //boucle de remplissage des options de couleur
        for (var i = 0; i < var_eltHtmlSelect.length; i++) {
            //pour une option
            const var_color = document.createElement('option');
            var_color.setAttribute("value", var_eltHtmlSelect[i]);
            var_color.innerHTML = var_eltHtmlSelect[i];
            document.getElementById('colors').appendChild(var_color);                 //a simplifier ?
        };

        //quantite unitaire
        const var_quantity = document.getElementById('quantity');                          //a simplifier ?
        var_quantity.setAttribute("value", 1);
        
    } catch (c) {
        console.log('Catched Error', array_selectedProduct);
    };
};


// Recupere id provenant de Url et verifie son format
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
            console.log("id avec format incorrect");
        }
    }
};


// partie en execution
// appelle le contenu des Produits de l API et insere Html
hubContent("routeSelectedProduct");


//document.getElementById('addToCard')
//document.addEventListener("click", addToCard);


//ajoute des ecouteurs a notre bouton Ajouter au panier
const var_btnCart = document.getElementById("addToCart");
var_btnCart.addEventListener("click", () => {
    //creation object articleSelected si les conditions sont correctes
    const obj_articleSelected = {
        id: var_idUrl,
        quantity: document.getElementById('quantity').value,                       //a simplifier ?
        color: document.getElementById('colors').value,                            //a simplifier ?
        name: document.getElementById('title').textContent                         //a simplifier ?
    };
    console.log(obj_articleSelected);
    //verifyInput(articleSelected);
});

/*
async function readContent(b, p) {                                        //a ameliorer une chaine peut etre constitue de plusieurs couples de valeurs
    try {
        // on supprime dans p la partie "id=" puisque API fonctionne de cette maniere
        const var_numId = p.replace('id=', '');
        console.log("Remplacement de la chaine id sans prefixe : " + var_numId);

        const var_content = await retrieveContent(b, var_numId); // chemin et id
        console.log(var_content);

        //CAS : tous les produits
        if (b = var_allProduct) {
            //console.log(var_content);
            //readProduct(var_content);
        };

        //CAS : detail du produit
        // test si parametre id correct
        const var_testParamId = false;
        const var_regexParamId = new RegExp('^id=[a-zA-Z0-9]+$'); //  Une chaîne de caractères alpha-numérique en debut jusqu a fin
        // si p contient la regex
        if (var_regexParamId.test(p)) {
            var_testParamId = true;
            //console.log("test regex avant appel API");
            //console.log("b :" + b + " compare var_allProduct : " + var_allProduct);
        };
        if (b == var_allProduct && var_testParamId == true) {
            //console.log("test avant appel API suite");
            readSelectedProduct(var_content);
        };

    } catch (e) {
        console.log('Catched Error', e);
    };
};
*/

/*
// fonction recupere id provenant de Url
function idGetRequest() {

    const var_str = window.location.href;
    const var_url = new URL(var_str);
    const var_search_params = new URLSearchParams(var_url.search);
    const iobj_regex = new RegExp('^[a-zA-Z0-9]+$'); //  Une chaîne de caractères alpha-numérique en debut jusqu a fin

    if (var_search_params.has('id')) {

        const var_id = var_search_params.get('id');
        console.log(var_id)

        if (iobj_regex.test(var_id)) {
            // appelle la fonction affichage du Detail Produit
            console.log("id existant et au bon format");
            return var_id;

            // sinon sort avec un format incorrect
        } else {
            console.log("id avec format incorrect");
        };
    };
};
*/