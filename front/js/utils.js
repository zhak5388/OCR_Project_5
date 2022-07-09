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