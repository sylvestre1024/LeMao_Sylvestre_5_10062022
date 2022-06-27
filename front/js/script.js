      /*document
          .getElementById("hello-result")
          .innerText = value.queryString.greetings;*/


let myProtocol = "http://";
let myHost = "localhost"
let myPort = ":3000";
let myAddress = "/api/products";
let fullAddress = myProtocol + myHost + myPort + myAddress;
let selectedId = '';
let allProduct = fullAddress + "/";
let selectedProduct = fullAddress + "/" + selectedId;
let numOrder = fullAddress + "/order";

async function retrieveContent(e) {
    const response = await fetch(e);
    return response.json();
  }

async function showContent(a) {
  try {
    const content = await retrieveContent(a);
    console.log(content);
    /*let elt = document.createElement('div');
    elt.innerHTML = content.join('<br />');
    document.getElementsByTagName('body')[0].appendChild(elt);test*/
  } catch (e) {
    console.log('Error', e);
  }
}

showContent(allProduct);