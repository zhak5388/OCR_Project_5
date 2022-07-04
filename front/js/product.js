import {KanapApiUrl, addElementInsideParent} from "./utils.js";

const currentURL = new URL(window.location);
const urlID = currentURL.searchParams.get("id");
console.log(urlID);

fetch(KanapApiUrl+urlID)
    .then( (response) => 
    {
        if (response.ok)
        {
            console.log(KanapApiUrl+urlID);
            return response.json();
        }
    })
    .then( (data) =>
    {
        console.log(data);
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