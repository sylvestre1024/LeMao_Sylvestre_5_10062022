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


/**
 * Utilise la bonne route pour les contenues Json receptionne
 * @param { Json } b
 */
async function readContent(b) {
  try {
    let content = await retrieveContent(b);
      //console.log(content);

      //cas : Tous les produits
      if (b = "allProduct") {
          //console.log(content);
          readProduct(content);
      };

  } catch (b) {
    console.log('Error', b);
    };
};


/**
 * Formate le contenu Json de l API pour la lecture des produits
 * @param { Json } c
 */
async function readProduct(c) {
    try {
        console.log(c);

        for (var i = 0; i < c.length; i++) {
        
        //lien
        let elt01 = document.createElement('a');
        elt01.setAttribute("href", "product.html?id=" + c[i]._id);
        document.getElementById('items').appendChild(elt01);

        //article
        let elt02 = document.createElement('article');
        elt01.appendChild(elt02);

        //image
        let elt03 = document.createElement('img');
        elt03.setAttribute("src", c[i].imageUrl);
        elt03.setAttribute("alt", c[i].altTxt);
        elt02.appendChild(elt03);

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
        };

    } catch (c) {
        console.log('Error', c);
    };
};

//Appelle le contenu des Produits de l API et insere Html
readContent(allProduct);