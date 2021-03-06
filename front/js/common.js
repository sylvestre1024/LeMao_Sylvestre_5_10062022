// CONSTANTES GLOBALES
const var_protocol = "http";
const var_host = "://localhost"
const var_port = ":3000";
const var_path = "/api/products";
const var_fullAddress = var_protocol + var_host + var_port + var_path;
const var_allProducts = var_fullAddress + "/";
const postUrlForCardOrder = var_fullAddress + "/" + "order";

// Retour Cyril : ajout variable pour Cle de API dans un cadre professionnel pour info


// FONCTIONS COMMUNES Debut _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
/**
 * Recupere l'id provenant de Url et vérifie son format
 */
function idFromRequest() {
    let var_str = window.location.href;
    let myUrl = new URL(var_str);
    let var_search = new URLSearchParams(myUrl.search);
    let result = null;

    // une chaine de caracteres alpha-numerique en debut jusqu a fin
    let myRegex = new RegExp('^[a-zA-Z0-9]+$');

    // si parametre id existant dans url
    if (var_search.has('id')) {
        let var_id = var_search.get('id');

        // si format id au norme
        if (myRegex.test(var_id)) {
            result = var_id;
        } else {
            console.log('La valeur de id est incorrecte dans son format : ' + var_id);
        }
    }
    return result;
};

/**
 * Securise une chaine de formulaire
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
// FONCTIONS COMMUNES Fin _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _