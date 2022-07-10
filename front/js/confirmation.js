import { addElementInsideParent } from "./utils.js";

const currentURL = new URL(window.location);
const urlID = currentURL.searchParams.get("id");
const whereToInsertOrderId = document.getElementById("orderId");
console.log(whereToInsertOrderId);

addElementInsideParent(urlID,whereToInsertOrderId);