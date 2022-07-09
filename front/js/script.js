import {getDataFromAPI, addElementInsideParent} from "./utils.js";

const whereToInsertContent = document.getElementById("items");
const dataFromAPI = await getDataFromAPI();

//Fonction pour créer le contenu html à insérer
function createProductHtmlElement(id, imageUrl, altTxt, name, description)
{
    let productHtmlElement = `<a href="./product.html?id=${id}"><article><img src="${imageUrl}" alt="${altTxt}"><h3 class="productName">${name}</h3><p class="productDescription">${description}</p></article></a>`;
    return productHtmlElement;
}

for (let i = 0; i < dataFromAPI.length; i++)
{
    addElementInsideParent(createProductHtmlElement(dataFromAPI[i]._id, dataFromAPI[i].imageUrl, dataFromAPI[i].altTxt, dataFromAPI[i].name,dataFromAPI[i].description),whereToInsertContent);
}