import {getProductDataFromAPI, addElementInsideParent, convertArrayString, maximumQuantityPerProductOnBasket} from "./utils.js";

const currentURL = new URL(window.location);
const urlID = currentURL.searchParams.get("id");
const productDatafromAPI = await getProductDataFromAPI(urlID);

let addToCartButtonLocation = document.getElementById("addToCart");

//Fonction pour obtenir la valeur de la couleur choisie
function findValueOfOptionSelected()
{
    let currentOptions = document.querySelectorAll("#colors option");
    let selectedOption;
    for (let i = 0; i < currentOptions.length; i++)
    {
        if (currentOptions[i].selected === true)
        {
            selectedOption = currentOptions[i].value;
            break;
        }
    }
    return selectedOption;
}

//Fonction booléenne permettant de savoir si une clé est déjà présente dans le local storage
function isItOnBasket(keyInString)
{   
    let result = false;
    for (let i = 0; i < localStorage.length; i++)
    {
        let key = localStorage.key(i);
        if(key == keyInString)
        {
            result = true;
        }
    }
    return result;
}

/********** Insertion dans le DOM des caractérisques du produit cliqué **********/
let htmlContentForImage = `<img src="${productDatafromAPI.imageUrl}" alt="${productDatafromAPI.altTxt}"/>`;
addElementInsideParent(htmlContentForImage,document.querySelector("article > div"));
addElementInsideParent(productDatafromAPI.name,document.getElementById("title"));
addElementInsideParent(productDatafromAPI.price, document.getElementById("price"));
addElementInsideParent(productDatafromAPI.description,document.getElementById("description"));

for(let i=0; i < productDatafromAPI.colors.length; i++)
{
    let htmlContentForColors = `<option value=${productDatafromAPI.colors[i]}>${productDatafromAPI.colors[i]}</option>`
    addElementInsideParent(htmlContentForColors,document.getElementById("colors"));
}

/**************************** Gestion de l'ajout dans le panier ****************************/
addToCartButtonLocation.addEventListener("click", () =>
{
   let colorValue = findValueOfOptionSelected();
   let quantityValue = document.getElementById("quantity").value; //It is a string

   //Vérifie une quantié et une couleur a été selectionné
   //Si oui, continue, sinon un message d'erreur s'affiche
   if ((colorValue != "") && (quantityValue > 0) && (quantityValue <= maximumQuantityPerProductOnBasket))
   {
    let wordCanape = "canapés";
    let confirmationSentence = "Produits ajoutés!";

    //Condition pour gérer l'accord des mots dans le message d'erreur
    if (quantityValue == 1)
    {
        wordCanape = "canapé";
        confirmationSentence = "Produit ajouté!"
    }

    let confirmAddition = confirm(`Souhaitez vous ajouter ${quantityValue} ${wordCanape} de couleur ${colorValue} au panier?`);
    
    //Si le client confirme l'ajout, on continue, sinon arrêt
    if (confirmAddition == true)
    {
        let key  = convertArrayString([urlID , colorValue]);
        let newQuantityValue;

        //Si le produit est présent dans le panier, on incrémente la quantité, sinon on l'ajoute
        if(isItOnBasket(key))
        {
            newQuantityValue = parseInt(localStorage[key]) + parseInt(quantityValue); //localStorage is always a string
            if (newQuantityValue > maximumQuantityPerProductOnBasket)
            {
                alert(`Le panier contient ${parseInt(localStorage[key])} articles de ce produit. La limite est de 100`);
            }
            else
            {
                localStorage[key] = newQuantityValue;
            }
        }

        else
        {
            newQuantityValue = parseInt(quantityValue);
            localStorage.setItem(key, quantityValue);
        }
        
        document.getElementById("quantity").value = 0;
        document.getElementById("colors").value = "";

        if(newQuantityValue <= maximumQuantityPerProductOnBasket)
        {
            alert(confirmationSentence);
        }
    }

   }
   else if ((colorValue == "") && (quantityValue != 0))
   {
    alert("Veuillez choisir une couleur");
   }
   else if ((colorValue != "") && (quantityValue == 0))
   {
    alert("Veuillez choisir un nombre d'article(s)");
   }
   else if (quantityValue > maximumQuantityPerProductOnBasket)
   {
    alert("Vous ne pouvez pas ajouter plus de 100 articles dans le panier");
   }
   else
   {
    alert("Veuillez choisir une couleur et le nombre d'article(s)");
   }
});