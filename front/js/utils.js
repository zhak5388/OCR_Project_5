export const KanapApiUrl = "http://localhost:3000/api/products/";
export function addElementInsideParent(element, parent)
{
    parent.insertAdjacentHTML("beforeend", element);
}