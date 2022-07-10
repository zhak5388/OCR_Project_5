export const KanapApiUrl = "http://localhost:3000/api/products/";
export const BasketLocalStorageKeyName = "productAddedToBasket";
export const maximumQuantityPerProductOnBasket = 100;

export function addElementInsideParent(element, parent)
{
    parent.insertAdjacentHTML("beforeend", element);
}

//Fonction permettant de convertir de manière reversible la paire clé/valeur 
//de type string `cle,valeur` au type array `[clé, valeur]`  
export function convertArrayString(key)
{
    if(Array.isArray(key))
    {
        return key.toString();
    }
    if(typeof(key) === "string")
    {
        return key.split(",");
    }
}

export function getDataFromAPI()
{
    return fetch(KanapApiUrl)
        .then( (response) =>
        {
            if(response.ok)
            {
                return response.json();
            }
        })
        .catch( () =>
        {
            console.log(`An error occured`);
        });
}

export function getProductDataFromAPI(ProductID)
{
    return fetch(KanapApiUrl + ProductID)
        .then( (response) =>
        {
            if(response.ok)
            {
                return response.json();
            }
        })
        .catch( () =>
        {
            console.log(`An error occured in getProductDataFromAPI ${ProductID}`);
        });
}

//Fonction spéciale pour vérifier si une clé est bien un produit du panier
const apiData = await getDataFromAPI();

export function isThisLocalStorageKeyAProduct(keyInString)
{
    let result = false;
    for (let i = 0; i < apiData.length; i++)
    {
        for (let j = 0; j < apiData[i].colors.length; j++)
        {
            if(keyInString == `${apiData[i]._id},${apiData[i].colors[j]}`)
            {
                result = true;
            }
        }
    }
    return result;
}

export function isBasketEmpty()
{
    let result = true;
    for (let i = 0; i < localStorage.length; i++)
    {
        if(isThisLocalStorageKeyAProduct(localStorage.key(i)) === true)
        {
            result = false;
            break;
        }
    } 
    return result;
}