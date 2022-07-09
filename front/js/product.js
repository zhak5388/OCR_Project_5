import {KanapApiUrl, addElementInsideParent, convertArrayString, maximumQuantityPerProductOnBasket, BasketLocalStorageKeyName, changeAProductQuantityOnBasket} from "./utils.js";

const currentURL = new URL(window.location);
const urlID = currentURL.searchParams.get("id");
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
    //Old //input: keyInString
    
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
    

    //New //input:IdColorInString
    /*
    let productOnBasketArray = localStorage.getItem(BasketLocalStorageKeyName);
    productOnBasketArray = JSON.parse(productOnBasketArray);
    //console.log(productOnBasketArray);

    let result = [false , null];
    for (let i = 0; i < productOnBasketArray.length; i++)
    {
        let currentProduct = productOnBasketArray[i];
        //console.log(currentProduct);
        let currentProductArray = convertArrayString(currentProduct);
        let IdColor = currentProductArray[0] + "," + currentProductArray[1];
        //console.log(IdColor);

        if(IdColor == IdColorInString)
        {
            result = [true, `${currentProductArray[2]}`];
        }
    }
    return result;
    */
}

//Insertion dans le DOM des caractérisques du produit cliqué
fetch(KanapApiUrl+urlID)
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
        let htmlContentForImage = `<img src="${data.imageUrl}" alt="${data.altTxt}"/>`;
        addElementInsideParent(htmlContentForImage,document.querySelector("article > div"));
        addElementInsideParent(data.name,document.getElementById("title"));
        addElementInsideParent(data.price, document.getElementById("price"));
        addElementInsideParent(data.description,document.getElementById("description"));
        for(let i=0; i < data.colors.length; i++)
        {
            let htmlContentForColors = `<option value=${data.colors[i]}>${data.colors[i]}</option>`
            addElementInsideParent(htmlContentForColors,document.getElementById("colors"));
        }

    })
    .catch((error) => 
    {
        console.log("An error occured")
    });


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

        //Si le produit est présent dans le panier, on incrémente la quantité, sinon on l'ajoute
        if(isItOnBasket(key))
        {
            //old
            localStorage[key] = parseInt(localStorage[key]) + parseInt(quantityValue); //localStorage is always a string
            
            //New
            /*
            let newQuantityValue = parseInt(isItOnBasket(key)[1]) + parseInt(quantityValue);
            changeAProductQuantityOnBasket(key,newQuantityValue);
            */
        }

        else
        {
            //Old
            localStorage.setItem(key, quantityValue);

            //New
            /*
            //Recupere et parse
            let productOnBasketArray = localStorage.getItem(BasketLocalStorageKeyName);
            productOnBasketArray = JSON.parse(productOnBasketArray);

            //Ajoute dans array
            productOnBasketArray.push(convertArrayString([urlID, colorValue, quantityValue]));
            //On reecrit larray stringifie
            localStorage.setItem(BasketLocalStorageKeyName, JSON.stringify(productOnBasketArray));
            */
        }
        
        document.getElementById("quantity").value = 0;
        document.getElementById("colors").value = "";
        alert(confirmationSentence);
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