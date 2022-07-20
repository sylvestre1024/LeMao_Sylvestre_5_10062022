// vide le local storage après confirmation
localStorage.clear();

// reprend la valeur du paramètre id dans l'URL
let str = window.location.href;
let url = new URL(str);
//console.log('url : ' + url);

let idOrder = url.searchParams.get("order_id");
//console.log('idOrder : ' + idOrder);

let orderId = document.getElementById("orderId");
//console.log('orderId : ');
//console.log(orderId);

orderId.textContent = idOrder;