import { BASEURL } from "../constant.js";

export async function putWrapper ( path, body, isFormData = false )
{
    const response = await fetch( `${ BASEURL }${ path }`, {
        method: "PUT",
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        body: isFormData ? body : JSON.stringify( body ),
        credentials: "include",
    } );

    const json = await response.json();

    if ( !response.ok )
    {
        throw json;
    }
    return json;
}
