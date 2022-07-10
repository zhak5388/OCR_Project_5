import {addElementInsideParent, convertArrayString, isThisLocalStorageKeyAProduct, getProductDataFromAPI, KanapApiUrl, maximumQuantityPerProductOnBasket, isBasketEmpty} from "./utils.js";

/********************* 1- Définition Fonctions et Variables générales *********************/

const totalQuantityLocation = document.getElementById("totalQuantity");
const totalPriceLocation = document.getElementById("totalPrice");

function createProductHtmlElement(productID, productColor, imageUrl, altTxt, name, price, quantity)
{
    let productHtmlElement = `<article class="cart__item" data-id="${productID}" data-color="${productColor}"><div class="cart__item__img"><img src="${imageUrl}" alt="${altTxt}"></div><div class="cart__item__content"><div class="cart__item__content__description"><h2>${name}</h2><p>${productColor}</p><p>${price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : ${quantity}</p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>`;
    return productHtmlElement;
}

//Fonction lisant le panier et donnant le prix et quantités d'articles totaux
async function getTotals()
{
    let totalQuantity = 0;
    let totalPrice = 0;

    for (let i = 0; i < localStorage.length; i++)
    {
        if(isThisLocalStorageKeyAProduct(localStorage.key(i)) === false)
        {
            break;
        }
        let productIdInBasket = convertArrayString(localStorage.key(i))[0];
        let productQuantityInBasket = parseInt(localStorage.getItem(localStorage.key(i)));
        let productValuesInBasket = await getProductDataFromAPI(productIdInBasket);
        let productPriceInBasket = productValuesInBasket.price;

        totalQuantity = parseInt(totalQuantity) + parseInt(productQuantityInBasket);
        totalPrice = parseInt(totalPrice) + parseInt(productPriceInBasket) * parseInt(productQuantityInBasket);
    }

    return [totalQuantity, totalPrice];
}

function changeAppearanceIfEmptyBasket()
{
    let isBasketEmptyValue = isBasketEmpty();
    if(isBasketEmptyValue)
    {
        totalPriceLocation.closest("div").classList.add("cart__price--empty");
        totalPriceLocation.closest("p").innerHTML = `Votre panier est vide. Vous pouvez parcourir notre catalogue pour faire votre choix !`;
    }
}

/********************* 2- Tableau récapitulatif des achats *********************/

//Recuperation et Insertion du Panier dans le DOM
changeAppearanceIfEmptyBasket();

for (let i = 0; i < localStorage.length; i++) 
{
    if(isThisLocalStorageKeyAProduct(localStorage.key(i)) === false)
    {
        break;
    }

    let productIdInBasket = convertArrayString(localStorage.key(i))[0];
    let productColorInBasket = convertArrayString(localStorage.key(i))[1];
    let productQuantityInBasket = parseInt(localStorage.getItem(localStorage.key(i)));

    let data = await getProductDataFromAPI(productIdInBasket);

    let articleToInsert = createProductHtmlElement(productIdInBasket, productColorInBasket, data.imageUrl, data.altTxt, data.name, data.price, productQuantityInBasket);
    let whereToInsertArticle = document.getElementById("cart__items");
    addElementInsideParent(articleToInsert, whereToInsertArticle);
}

let totals = await getTotals();
addElementInsideParent(totals[0], totalQuantityLocation);
addElementInsideParent(totals[1], totalPriceLocation);

/********************* 3- Modification dynamique de la page *********************/

//Écoute évènements
let deleteArticleButtonLocation = document.querySelectorAll(".deleteItem");
let itemQuantityLocation = document.querySelectorAll(".itemQuantity");

deleteArticleButtonLocation.forEach( (buttonElement) =>
    {
        buttonElement.addEventListener("click", async function() //Arrow functions don't handle "this"?
        {
            //Obtention des valeurs
            let closestArticle = this.closest("article");
            let keyForLocalStorage = [closestArticle.dataset.id, closestArticle.dataset.color];

            //Changement dans le DOM
            closestArticle.remove();

            //Changement dans le localStorage
            localStorage.removeItem(convertArrayString(keyForLocalStorage));
            changeAppearanceIfEmptyBasket();
            
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
        let keyForLocalStorage = [closestArticle.dataset.id, closestArticle.dataset.color];//

        if(currentQuantity > maximumQuantityPerProductOnBasket)
        {
            alert("Vous ne pouvez pas ajouter plus de 100 articles dans le panier");
            return 0;
        }
        
        if(currentQuantity == 0)
        {
            alert("Veuillez appuyer sur le button supprimer pour le retirer du panier")
            return 0;
        }

        //Changement dans le DOM
        quantityText.innerHTML = `Qté : ${currentQuantity}`;

        //Changement dans le localStorage
        localStorage[convertArrayString(keyForLocalStorage)] = parseInt(currentQuantity);

        //Changement du prix et quantité
        let newTotals = await getTotals();
        totalQuantityLocation.innerHTML = newTotals[0];
        totalPriceLocation.innerHTML = newTotals[1];
    });
});

/********************* 4- Gestion du Formulaire *********************/

let firstNameErrorLocation = document.getElementById("firstNameErrorMsg");
let lastNameErrorLocation = document.getElementById("lastNameErrorMsg");
let adressErrorLocation = document.getElementById("addressErrorMsg");
let cityErrorLocation = document.getElementById("cityErrorMsg");
let emailErrorLocation = document.getElementById("emailErrorMsg");

//nonAtoZLetter = "ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ";
function isThisAValidFirstName(input)
{
   //Accepte un ou des prénoms composés pouvant contenir des caractères comme ' ou -
   //N'accepte pas des lettres comme ç
   let result = false;
   let regexTest = /^[a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*)*$/;

   if (typeof(input) == "string")
   {
    if ((input.length > 1) && (regexTest.test(input)))
    {
        result = true
    }
   }
   return result;
}

function isThisAValidLastName(input)
{
    let result = false;
    let regexTest = /^[a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*)*$/;
 
    if (typeof(input) == "string")
    {
     if ((input.length > 1) && (regexTest.test(input)))
     {
         result = true
     }
    }
    return result;
}

function isThisAValidAdress(input)
{
    let regexTest = /^[0-9]+([ ][a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*))*$/;
    return regexTest.test(input);
}

function isThisAValidCity(input)
{
    let result = false;
    let regexTest = /^[a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*)*$/;
 
    if (typeof(input) == "string")
    {
     if ((input.length > 1) && (regexTest.test(input)))
     {
         result = true
     }
    }
    return result;
}

function isThisAValidEmail(input)
{
    let regexTest = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]*$/;
    return regexTest.test(input);
}

function invalidInputFormBehaviour(errorLocation, messageType, controlFunction)
{
    let currentValue = errorLocation.previousElementSibling.value;

    if(controlFunction(currentValue) === false)
    {
        errorLocation.innerHTML = `Veuillez vérifier ${messageType}`;
        errorLocation.previousElementSibling.style.border = "solid 2px red";
    }

    if((controlFunction(currentValue) === true) || (currentValue == ""))
    {
        errorLocation.innerHTML = "";
        errorLocation.previousElementSibling.style.border = "0";
    }
}

//Great! This is working!!
//En mettant la fonction dans le arrow elle est appellée plus d'une fois!
firstNameErrorLocation.previousElementSibling.addEventListener("blur", ()=>
{
    invalidInputFormBehaviour(firstNameErrorLocation, "le prénom renseigné", isThisAValidFirstName);
});

lastNameErrorLocation.previousElementSibling.addEventListener("blur", ()=>
{
    invalidInputFormBehaviour(lastNameErrorLocation, "le nom renseigné", isThisAValidLastName);
});

adressErrorLocation.previousElementSibling.addEventListener("blur", ()=>
{
    invalidInputFormBehaviour(adressErrorLocation, "l'adresse renseignée", isThisAValidAdress);
});

cityErrorLocation.previousElementSibling.addEventListener("blur", ()=>
{
    invalidInputFormBehaviour(cityErrorLocation, "la ville renseignée", isThisAValidCity);
});

emailErrorLocation.previousElementSibling.addEventListener("blur", ()=>
{
    invalidInputFormBehaviour(emailErrorLocation, "l'email renseigné", isThisAValidEmail);
});

/********************* 5 - Envoi des Données vers le serveur *********************/
let orderButtonLocation = document.getElementById("order");

function createFinalArrayProduct()
{
    let finalArray = [];
    let productsForAPI = [];
    for(let i = 0; i < localStorage.length; i++)
    {
        if(isThisLocalStorageKeyAProduct(localStorage.key(i)))
        {
            let productObject = {id:`${convertArrayString(localStorage.key(i))[0]}`,color:`${convertArrayString(localStorage.key(i))[1]}`,quantity:`${localStorage.getItem(localStorage.key(i))}`};
            let product = `${convertArrayString(localStorage.key(i))[0]}`;
            finalArray.push(productObject);
            productsForAPI.push(product);
        }
    }
    localStorage.setItem("finalProductsOnBasket",JSON.stringify(finalArray));
    return productsForAPI;
}

function sendDataToServer(contact, products)
{
    return fetch(`${KanapApiUrl}order`,
        {
           method: "POST",
           headers:{'Content-Type': 'application/json'},
           body: JSON.stringify({ contact, products })
        })
        .then((response) =>
        {
            if (response.ok)
            {
                return response.json();
            }

            else
            {
                return false;
            }
        })
        .then((data) =>
        {
            return data.orderId;
        })
        .catch( () =>
        {
            console.log("An error occured when sending data");
        });
}

orderButtonLocation.addEventListener("click", async function(event)
{
    event.preventDefault();
    let firstNamValue = firstNameErrorLocation.previousElementSibling.value;
    let lastNameValue = lastNameErrorLocation.previousElementSibling.value;
    let adresseValue = adressErrorLocation.previousElementSibling.value;
    let cityValue = cityErrorLocation.previousElementSibling.value;
    let emailValue = emailErrorLocation.previousElementSibling.value;

    let products = createFinalArrayProduct();

    if ((products.length === 0))
    {
        alert("Votre panier est vide. Impossible de passer commande"); 
    }
    
    else if
    (
        isThisAValidFirstName(firstNamValue) && 
        isThisAValidLastName(lastNameValue) &&
        isThisAValidAdress(adresseValue) &&
        isThisAValidCity(cityValue) && 
        isThisAValidEmail(emailValue)
    )
    {
        let confirmOrder = confirm(`Souhaiter passer à la commande ?`);

        if (confirmOrder == true)
        {
            let contact = {firstName:`${firstNamValue}`, lastName:`${lastNameValue}`, address:`${adresseValue}`, city:`${cityValue}`, email:`${emailValue}`};
            let orderID = await sendDataToServer(contact, products);

            if ((orderID != false) && (orderID != ""))
            {
                localStorage.clear();
                location.href = "confirmation.html?id=" + orderID;
            }
        }

        else
        {
            return 0;
        }
    }

    else
    {
        alert("Veuillez vérifier que le formulaire est correctement rempli");
    }
});