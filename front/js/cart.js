import {KanapApiUrl, addElementInsideParent, convertArrayString} from "./utils.js";

/********************* 1- Définition Fonctions et Variables générales *********************/

const totalQuantityLocation = document.getElementById("totalQuantity");
const totalPriceLocation = document.getElementById("totalPrice");

function createProductHtmlElement(productID, productColor, imageUrl, altTxt, name, price, quantity)
{
    let productHtmlElement = `<article class="cart__item" data-id="${productID}" data-color="${productColor}"><div class="cart__item__img"><img src="${imageUrl}" alt="${altTxt}"></div><div class="cart__item__content"><div class="cart__item__content__description"><h2>${name}</h2><p>${productColor}</p><p>${price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : ${quantity}</p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>`;
    return productHtmlElement;
}

//Fonction permettant de récupérer les données des items de l'API
async function getProductValuesFromID(ProductID) //Est ce le async est necessaire?
{
    return fetch(KanapApiUrl + ProductID)
        .then( (response) =>
        {
            if(response.ok)
            {
                return response.json()
            }
        })
        .then( (data) =>
        {
            //console.log(`La recupération de ${ProductID} est finie`)
            return data;
        })
        .catch( (error) =>
        {
            console.log(`An error occured in getPriceValueFromID ${ProductID}`);
        });
}

//Fonction lisant le panier et donnant le prix et quantités d'articles totaux
//Les prix ne sont pas stockés en local, cette fonction intérroge l'API pour les avoir
async function getTotals()
{
    let totalQuantity = 0;
    let totalPrice = 0;

    for (let i = 0; i < localStorage.length; i++)
    {
        let productIdInBasket = convertArrayString(localStorage.key(i))[0];
        let productQuantityInBasket = parseInt(localStorage.getItem(localStorage.key(i)));
        let productValuesInBasket = await getProductValuesFromID(productIdInBasket);
        let productPriceInBasket = productValuesInBasket.price;
        //console.log(productPriceInBasket);

        totalQuantity = parseInt(totalQuantity) + parseInt(productQuantityInBasket);
        totalPrice = parseInt(totalPrice) + parseInt(productPriceInBasket) * parseInt(productQuantityInBasket);
    }

    return [totalQuantity, totalPrice];
}

//Fonction spéciale pour vérifier si une clé est bien un produit du panier

/*
const idList = [];
function isThisLocalStorageKeyAProduct(key)
{
}
*/

/********************* 2- Tableau récapitulatif des achats *********************/

//Recuperation et Insertion du Panier dans le DOM
for (let i = 0; i < localStorage.length; i++) 
{
    let productIdInBasket = convertArrayString(localStorage.key(i))[0];
    let productColorInBasket = convertArrayString(localStorage.key(i))[1];
    let productQuantityInBasket = parseInt(localStorage.getItem(localStorage.key(i)));

    let data = await getProductValuesFromID(productIdInBasket);
    let subtotalPrice = parseInt(productQuantityInBasket) * parseInt(data.price);

    let articleToInsert = createProductHtmlElement(productIdInBasket, productColorInBasket, data.imageUrl, data.altTxt, data.name, subtotalPrice, productQuantityInBasket);
    let whereToInsertArticle = document.getElementById("cart__items");
    addElementInsideParent(articleToInsert, whereToInsertArticle);
}

let totals = await getTotals(); //Et si on stocke les prix dans un array? (évite d'avoir un async dans eventListener)
addElementInsideParent(totals[0], totalQuantityLocation);
addElementInsideParent(totals[1], totalPriceLocation);

/********************* 3- Modification dynamique de la page *********************/

//Écoute évènements
let deleteArticleButtonLocation = document.querySelectorAll(".deleteItem");
let itemQuantityLocation = document.querySelectorAll(".itemQuantity");

deleteArticleButtonLocation.forEach( (buttonElement) =>
    {
        buttonElement.addEventListener("click", async function() //Arrow function don't handle "this"?
        {
            //Obtention des valeurs
            let closestArticle = this.closest("article");
            let keyForLocalStorage = [closestArticle.dataset.id, closestArticle.dataset.color];

            //Changement dans le DOM
            closestArticle.remove();

            //Changement dans le localStorage
            localStorage.removeItem(convertArrayString(keyForLocalStorage));
            
            //Changement du prix et quantité
            let newTotals = await getTotals();
            totalQuantityLocation.innerHTML = newTotals[0];
            totalPriceLocation.innerHTML = newTotals[1];
        });
    });


itemQuantityLocation.forEach( (buttonElement) =>
{
    buttonElement.addEventListener("change", async function()
    {
        //Obtention des valeurs
        let currentQuantity = this.value;
        let quantityText = this.previousSibling;
        let closestArticle = this.closest("article");
        let keyForLocalStorage = [closestArticle.dataset.id, closestArticle.dataset.color];
        
        //Permet de changer dynamiquement le prix local
        //let priceTextLocation = this.closest(".cart__item__content__settings").previousSibling.lastChild;
        //console.log(priceTextLocation.outerText);

        //Changement dans le DOM
        quantityText.innerHTML = `Qté : ${currentQuantity}`; //Bon truc? Paragraphe?

        //Changement dans le localStorage
        localStorage[convertArrayString(keyForLocalStorage)] = parseInt(currentQuantity);

        //Changement du prix et quantité
        let newTotals = await getTotals();
        totalQuantityLocation.innerHTML = newTotals[0];
        totalPriceLocation.innerHTML = newTotals[1];
    });
});

/********************* 4- Gestion du Formulaire *********************/