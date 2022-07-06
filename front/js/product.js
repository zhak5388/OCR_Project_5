import {KanapApiUrl, addElementInsideParent, convertArrayString} from "./utils.js";

const currentURL = new URL(window.location);
const urlID = currentURL.searchParams.get("id");
let addToCartButtonLocation = document.getElementById("addToCart");

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

   if ((colorValue != "") && (quantityValue != 0))
   {
    let wordCanape = "canapés";
    if (quantityValue == 1)
    {
        wordCanape = "canapé";
    }

    let confirmAddition = confirm(`Souhaitez vous ajouter ${quantityValue} ${wordCanape} de couleur ${colorValue} au panier?`);
    if (confirmAddition == true)
    {
        let key  = convertArrayString([urlID , colorValue]);

        if(isItOnBasket(key))
        {
            localStorage[key] = parseInt(localStorage[key]) + parseInt(quantityValue); //localStorage is always a string
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
});