import { BASEURL } from "../constant.js";

// export async function postWrapper ( path, body, isFormData = false )
// {
//     const response = await fetch( `${ BASEURL }${ path }`, {
//         method: "POST",
//         headers: isFormData ? {} : { "Content-Type": "application/json" },
//         body: isFormData ? body : JSON.stringify( body ),
//         credentials: "include",
//     } );

//     const json = await response.json();

//     if ( !response.ok )
//     {
//         throw json;
//     }
//     return json;
// }


export async function postWrapper ( path, body, isFormData = false )
{
    const response = await fetch( `${ BASEURL }${ path }`, {
        method: "POST",
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        body: isFormData ? body : JSON.stringify( body ),
        credentials: "include",
    } );

    // If server sends non-JSON (e.g., empty response for file upload)
    const text = await response.text();
    let json;
    try
    {
        json = text ? JSON.parse( text ) : {};
    } catch ( err )
    {
        console.error( "Failed to parse JSON:", text );
        throw new Error( "Invalid JSON response from server" );
    }

    if ( !response.ok )
    {
        throw json;
    }
    return json;
}
