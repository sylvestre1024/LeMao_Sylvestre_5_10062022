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
            var_link.setAttribute('href', 'product.html?id=' + item._id);
            document.getElementById('items').appendChild(var_link);

            // article
            let var_article = document.createElement('article');
            var_link.appendChild(var_article);

            // image
            let var_image = document.createElement('img');
            var_image.setAttribute('src', item.imageUrl);
            var_image.setAttribute('alt', item.altTxt);
            var_article.appendChild(var_image);

            // titre
            let var_title = document.createElement('h3');
            var_title.setAttribute('class', 'productName');
            var_title.textContent = item.name;
            var_article.appendChild(var_title);

            // description
            let var_description = document.createElement('p');
            var_description.setAttribute('class', 'productDescription');
            var_description.textContent = item.description;
            var_article.appendChild(var_description);
        });

    } catch (e) {
        console.log('Catched Error2', e);
        console.log('Erreur en ecriture dans la page index.html');
    }
};
// FONCTIONS SPECIFIQUES - index.html - Fin  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _


// Début de la partie en exécution _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
try {

    // définir le paramètre de la requête
    let request = var_allProducts;

    fetch(request)
        .then((res) => res.json())
        // vérifier la promesse de données de l'appel réseau
        .then(function (data) {

            // écrire le contenu
            writeAllProducts(data)

            // affichage du nombre d'article dans la navigation
            displayInfoNavCart()

        })
        .catch(function (err) {
            console.log(err.message)
            alert('Une erreur est survenue, merci de revenir plus tard.');
        });

} catch (e) {
    console.log('Catched Error', e);
    console.log('Erreur dans la demande d\'affichage du produit sélectionné');
}
// Fin de la partie en exécution _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _