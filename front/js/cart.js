import {KanapApiUrl, addElementInsideParent, convertArrayString} from "./utils.js";


function createProductHtmlElement(productID, productColor, imageUrl, altTxt, name, price, quantity)
{
    let productHtmlElement = `<article class="cart__item" data-id="${productID}" data-color="${productColor}"><div class="cart__item__img"><img src="${imageUrl}" alt="${altTxt}"></div><div class="cart__item__content"><div class="cart__item__content__description"><h2>${name}</h2><p>${productColor}</p><p>${price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : ${quantity}</p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>`;
    return productHtmlElement;
}

for (let i = 0; i < localStorage.length; i++) 
{
    let productIdInBasket = convertArrayString(localStorage.key(i))[0];
    let productColorInBasket = convertArrayString(localStorage.key(i))[1];
    let productQuantityInBasket = parseInt(localStorage.getItem(localStorage.key(i)));

    //ùconsole.log(`Produit ${i+1} | ID: ${productIdInBasket} Color: ${productColorInBasket} Quantity: ${productQuantityInBasket}`);
    
    await fetch(KanapApiUrl+productIdInBasket)
        .then( (response) =>
        {
            if (response.ok)
            {
                return response.json();
            }
        })
        .then( (data)=>
        {
            return data;
        })
        .then( (data)=>
        {
            let articleToInsert = createProductHtmlElement(productIdInBasket, productColorInBasket, data.imageUrl, data.altTxt, data.name, data.price, productQuantityInBasket);
            let whereToInsertArticle = document.getElementById("cart__items");
            addElementInsideParent(articleToInsert, whereToInsertArticle);
            //console.log(articleToInsert);
            //console.log(whereToInsertArticle);
        })
        .catch((error) =>
        {
            console.log("An error occured");
        });
}
//console.log(Promise.allSettled());

let deleteArticleButtonLocation = document.querySelectorAll(".deleteItem");
console.log(deleteArticleButtonLocation);
let elementsArray = Array.prototype.slice.call(deleteArticleButtonLocation);
//Truc permettant d'ecouter plusieurs
//http://127.0.0.1:5501/front/html/cart.html
elementsArray.forEach(function(elem){
    elem.addEventListener("click", function(){
      console.log("You clicked me!");
      this.style.backgroundColor = "#ff0";

      let a = document.querySelector(".deleteItem + article");
      console.log(a);

      console.log(this.closest("article"));
      this.closest("article").remove();
    });
  });
/*
deleteArticleButtonLocation.addEventListener("click", () =>
{
    
    let a = document.querySelector(".deleteItem > article");
    console.log(a);

});
*/
/*
let addToCartButtonLocation = document.getElementById("testoo");
//let addToCartButtonLocation = document.getElementById("addToCart");
console.log(addToCartButtonLocation);

/*
addToCartButtonLocation.addEventListener("click", () =>
{
    console.log("haha");
});
*/


/*
fetch(KanapApiUrl)
    .then( (response) =>
    {
        if (response.ok)
        {
            return response.json();
        }
    })
    .then( (data) =>
    {
        return data;
    })
    .then( (data) =>
    {
        //console.log(data[0].name);
        console.log(data);
    })
*/