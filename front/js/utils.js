export const KanapApiUrl = "http://localhost:3000/api/products/";

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
        //console.log("Ceci est un Objet");
    }
    if(typeof(key) === "string")
    {
        //console.log("Ceci est un String");
        return key.split(",");
    }
}