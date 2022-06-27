const myProtocol = "http://";
const myHost = "localhost"
const myPort = ":3000";
const myAddress = "/api/products";
const fullAddress = myProtocol + myHost + myPort + myAddress;
const allProduct = fullAddress + "/";
//const numOrder = fullAddress + "/order";


/**
 * Retourne du contenu de API
 * @param { Json } a
 */
async function retrieveContent(a) {
    let response = await fetch(a);
    return response.json();
};


// fonction qui regarde Url ET qui verifie si le format est correct ET qui appelle la fonction d affichage du Detail Produit
function idGetRequest() {

    var str = window.location.href;
    var url = new URL(str);
    var search_params = new URLSearchParams(url.search);
    let regex = new RegExp('^[a-zA-Z0-9]+$'); //  Une chaîne de caractères alpha-numérique en debut jusqu a fin

    if (search_params.has('id')) {

        console.log(id)
        var id = search_params.get('id');
        
        if (regex.test(id)) {
            // appelle la fonction affichage du Detail Produit
            console.log("id existant et au bon format");
            readSelectedProduct(fullAddress + "/" + Id;);

        // sinon sort avec un format incorrect
        } else {
            console.log("id avec format incorrect");
        };
    };
};

//test de requete avec ID sur page product.html
idGetRequest();


/**
 * Formate le contenu Json de l API pour la lecture du Details du produit
 * @param { Json } c
 */
async function readSelectedProduct(c) {
    try {
        console.log(c);

        //image
        //let elt01 = document.createElement('img');
        //elt01.setAttribute("src", c[0].imageUrl);
        //elt01.setAttribute("alt", c[0].altTxt);
        //document.getElementById('items').appendChild(elt01);


        /*for (var i = 0; i < c.length; i++) {

            //lien
            let elt01 = document.createElement('a');
            elt01.setAttribute("href", "product.html?id=" + c[i]._id);
            document.getElementById('items').appendChild(elt01);

            //article
            let elt02 = document.createElement('article');
            elt01.appendChild(elt02);



            //titre
            let elt04 = document.createElement('h3');
            elt04.setAttribute("class", "productName");
            elt04.innerHTML = c[i].name;
            elt02.appendChild(elt04);

            //paragraphe
            let elt05 = document.createElement('p');
            elt05.setAttribute("class", "productDescription");
            elt05.innerHTML = c[i].description;
            elt02.appendChild(elt05);
        };*/

    } catch (c) {
        console.log('Error', c);
    };
};

