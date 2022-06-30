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
 * Ecrit le contenu de tous les produits dans la page html
 * @param { array } array_textRequest
 */
async function writeAllProducts(array_textRequest) {
    try {
        //console.log(array_textRequest);

        for (var i = 0; i < array_textRequest.length; i++) {
        
            //lien
            const var_link = document.createElement('a');
            var_link.setAttribute("href", "product.html?id=" + array_textRequest[i]._id);
            document.getElementById('items').appendChild(var_link);

            //article
            const var_article = document.createElement('article');
            var_link.appendChild(var_article);

            //image
            const var_image = document.createElement('img');
            var_image.setAttribute("src", array_textRequest[i].imageUrl);
            var_image.setAttribute("alt", array_textRequest[i].altTxt);
            var_article.appendChild(var_image);

            //titre
            const var_title = document.createElement('h3');
            var_title.setAttribute("class", "productName");
            var_title.innerHTML = array_textRequest[i].name;
            var_article.appendChild(var_title);

            //description
            const var_description = document.createElement('p');
            var_description.setAttribute("class", "productDescription");
            var_description.innerHTML = array_textRequest[i].description;
            var_article.appendChild(var_description);
            }

    } catch (e) {
        console.log('Catched Error', e);
    }
};


// partie en execution
// appelle le contenu des Produits de l API et insere Html
hubContent("routeAllProducts");