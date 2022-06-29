const c_myProtocol = "http://";
const c_myHost = "localhost"
const c_myPort = ":3000";
const c_myAddress = "/api/products";
const c_fullAddress = c_myProtocol + c_myHost + c_myPort + c_myAddress;
const c_allProduct = c_fullAddress + "/";
//const c_numOrder = c_fullAddress + "/order";





/**
 * Retourne du contenu de API
 * @param { string } a // qui est un chemin url
 * @param { string } p // qui est une chaine de(s) parametre(s)
 */
async function f_retrieveContent(a, p) {
    let response = await fetch(a + p);
    return response.json();
};

/**
 * Utilise la bonne route pour les contenues Json receptionne
 * @param { string } b // qui est un chemin url
 * @param { string } p // qui est une chaine de(s) parametre(s)
 */
async function f_readContent(b, p) {                                        //a ameliorer une chaine peut etre constitue de plusieurs couples de valeurs
    try {
        // on supprime dans p la partie "id=" puisque API fonctionne de cette maniere
        let v_numId = p.replace('id=', '');
        console.log("Remplacement de la chaine id sans prefixe : " + v_numId);

        let v_content = await f_retrieveContent(b, v_numId); // chemin et id
        console.log(v_content);

        //CAS : tous les produits
        if (b = c_allProduct) {
            //console.log(v_content);
            //readProduct(v_content);
        };

        //CAS : detail du produit
        // test si parametre id correct
        let v_testParamId = false;
        let v_regexParamId = new RegExp('^id=[a-zA-Z0-9]+$'); //  Une chaîne de caractères alpha-numérique en debut jusqu a fin
        // si p contient la regex
        if (v_regexParamId.test(p)) {
            v_testParamId = true;
            //console.log("test regex avant appel API");
            //console.log("b :" + b + " compare c_allProduct : " + c_allProduct);
        };
        if (b == c_allProduct && v_testParamId == true) {
            //console.log("test avant appel API suite");
            f_readSelectedProduct(v_content);
        };

    } catch (e) {
        console.log('Error', e);
    };
};


// fonction recupere id provenant de Url
function f_idGetRequest() {

    let v_str = window.location.href;
    let v_url = new URL(v_str);
    let v_search_params = new URLSearchParams(v_url.search);
    let iobj_regex = new RegExp('^[a-zA-Z0-9]+$'); //  Une chaîne de caractères alpha-numérique en debut jusqu a fin

    if (v_search_params.has('id')) {

        let v_id = v_search_params.get('id');
        console.log(v_id)

        if (iobj_regex.test(v_id)) {
            // appelle la fonction affichage du Detail Produit
            console.log("id existant et au bon format");
            return v_id;

            // sinon sort avec un format incorrect
        } else {
            console.log("id avec format incorrect");
        };
    };
};


/**
 * Formate le contenu Json de l API pour la lecture du Detail du produit
 * @param { Json } c
 */
async function f_readSelectedProduct(c) {
    try {
        //console.log(c);

        //titre de la page html
        document.title = c.name;

        //image
        let v_elt01 = document.createElement('img');
        v_elt01.setAttribute("src", c.imageUrl);
        v_elt01.setAttribute("alt", c.altTxt);
        document.getElementsByClassName('item__img')[0].appendChild(v_elt01);       //a simplifier ?

        //titre
        let v_elt02 = document.getElementById('title');                             //a simplifier ?
        v_elt02.innerHTML = c.name;

        //prix
        let v_elt03 = document.getElementById('price');                             //a simplifier ?
        v_elt03.innerHTML = c.price;

        //description
        let v_elt04 = document.getElementById('description');                       //a simplifier ?
        v_elt04.innerHTML = c.description;

        //couleurs
        let v_eltHtmlSelect = c.colors;
        //boucle de remplissage des options de couleur
        for (var i = 0; i < v_eltHtmlSelect.length; i++) {
            //pour une option
            let v_elt05 = document.createElement('option');
            v_elt05.setAttribute("value", v_eltHtmlSelect[i]);
            v_elt05.innerHTML = v_eltHtmlSelect[i];
            document.getElementById('colors').appendChild(v_elt05);                 //a simplifier ?
        };

        //quantite unitaire
        let v_elt06 = document.getElementById('quantity');                          //a simplifier ?
        v_elt06.setAttribute("value", 1);

    } catch (c) {
        console.log('Error', c);
    };
};

//Charge la requete GET avec ID valide sur page product.html
let v_idUrl = f_idGetRequest();
if (v_idUrl != "" && v_idUrl != undefined) {
    f_readContent(c_fullAddress + "/", "id=" + v_idUrl);
} else {
    console.log("id avec format incorrect ou vide");
};



//document.getElementById('addToCard')
//document.addEventListener("click", addToCard);


//ajoute des ecouteurs a notre bouton Ajouter au panier
let v_btnCart = document.getElementById("addToCart");                              //a simplifier ?
v_btnCart.addEventListener("click", () => {
    //creation object articleSelected si les conditions sont correctes
    let obj_articleSelected = {
        id: v_idUrl,
        quantity: document.getElementById('quantity').value,                       //a simplifier ?
        color: document.getElementById('colors').value,                            //a simplifier ?
        name: document.getElementById('title').textContent                         //a simplifier ?
    };
    console.log(obj_articleSelected);
    //f_verifyInput(articleSelected);
});


