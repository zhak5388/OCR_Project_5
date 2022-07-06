import {KanapApiUrl, addElementInsideParent, convertArrayString} from "./utils.js";

const currentURL = new URL(window.location);
const urlID = currentURL.searchParams.get("id");
let addToCartButtonLocation = document.getElementById("addToCart");

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

//localStorage.setItem(keyString,2); //La cle sera "id,couleur" (convertible) et la valeur sera la quantite
function testSelected()
{
    let a = document.querySelector("select > option").selected;
    let b = document.querySelector("select > option").value;
    console.log("testSelected : " + a + " value: " + b);
}
/*
//let select = document.getElementById("colors");
//let c = select.querySelectorAll("option");
console.log(select); 
//console.log(select.childNodes[5]);
console.log(c);
console.log(select.options);
*/

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

addToCartButtonLocation.addEventListener("click", () =>
{
    /*
    console.log("TU AS APPUYE SUR LE BUTTON");
    console.log(document.getElementById("quantity").value);
    //console.log(document.querySelector("option"));
    testSelected();
    //alert("Hein?");
    //confirm("confirmer?");

    let select = document.getElementById("colors");
    let c = select.querySelectorAll("option");
    console.log(select);
    console.log(c[1]);
    */
   //findValueOfOptionSelected();

   ///
   ///
   let colorValue = findValueOfOptionSelected();
   let quantityValue = document.getElementById("quantity").value;

   //Test si non vide
   if ((colorValue != "") && (quantityValue != 0))
   {
    let wordCanape = "canapés";
    if (quantityValue == 1)
    {
        wordCanape = "canapé";
    }

    let confirmAddition = confirm(`Souhaitez vous ajouter ${quantityValue} ${wordCanape} de couleur ${colorValue} au panier?`);
    console.log("Confirmation : "+ confirmAddition);
    if (confirmAddition == true)
    {
        let key  = convertArrayString([urlID , colorValue]);
        console.log("The key is: " + key);

        if(isItOnBasket(key))
        {
            console.log("il faut changer qte");
            console.log("Paire key/value : " + localStorage.getItem(key))
            console.log("Quantité: " + localStorage[key]);
        }

        else
        {
            localStorage.setItem(key, quantityValue);
        }
    }

   }
   else
   {
    alert("Veuillez choisir une couleur et le nombre d'article(s)");
   }
   /*
   if(quantityValue =! "") && (colorValue =! 0)
   {
    continue;
   }
   else
   {
    break;
   }
   */

   //Confirmation
   /*
   */

   let key = [urlID , colorValue];
   //console.log(key);
   //console.log(convertArrayString(key));
   //sessionStorage.setItem(convertArrayString(key), quantityValue);
   localStorage.setItem(convertArrayString(key), quantityValue); //Il faut trouver un moyen de parcourir lensemble du local storage.
});
//let testo = JSON.stringify(localStorage);
let testo = localStorage;
console.log(testo);
console.log(typeof(testo));
for(let i = 0; i < localStorage.length; i++)
{
    //console.log(sessionStorage{i});
    //let a = localStorage["107fb5b75607497b96722bda5b504926,White"];
    //console.log(a);
    let key = localStorage.key(i);
    console.log("Paire " + i);
    console.log(key);
    console.log(localStorage[key]);
}

//localStorage.clear();