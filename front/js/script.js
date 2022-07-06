import {KanapApiUrl, addElementInsideParent} from "./utils.js";

const whereToInsertContent = document.getElementById("items");
const areProductsDisplayedRandomly = Boolean(false);

function createProductHtmlElement(id, imageUrl, altTxt, name, description)
{
    let ProductHtmlElement = `<a href="./product.html?id=${id}"><article><img src="${imageUrl}" alt="${altTxt}"><h3 class="productName">${name}</h3><p class="productDescription">${description}</p></article></a>`;
    return ProductHtmlElement;
}

function shuffleArray(array)
{
    let finalArray = [];
    let orderedRange = [];
    let shuffledRange = [];
    
    for(let i = 0; i < array.length; i ++) //Genere une liste ordonnée d'entier
    {
        orderedRange.push(i);
    }

    let maxLength=orderedRange.length;

    for(let i = 0; i < maxLength; i ++) //Genere une liste désordonné de la liste ordonnée
    {
        let randomIndex = Math.floor(Math.random() * orderedRange.length); //Between 0 and orderedRange.length excluded
        shuffledRange.push(orderedRange[randomIndex]);
        orderedRange.splice(randomIndex,1);
    }

    for(let i = 0; i < array.length; i ++)
    {
        finalArray.push(array[shuffledRange[i]]);
    }

    return finalArray;
}


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
        if(areProductsDisplayedRandomly)
        {
            return shuffleArray(data);
        }

        else
        {
            return data;
        }
    })
    .then( (data) => 
    {
        for(let i = 0; i < data.length; i++)
        {
            addElementInsideParent(createProductHtmlElement(data[i]._id, data[i].imageUrl, data[i].altTxt, data[i].name,data[i].description),whereToInsertContent);
        }
    })
    .catch( (error) => 
    {
        console.log("An error occured")
    });