import { BASEURL } from "../constant";

/**
 * @param {string} path - API endpoint
 * @param {object} options - fetch options
 * @param {boolean} isBlob - if true, return response as Blob (for files)
 */
export async function fetchWrapper ( path, options = {}, isBlob = false )
{
    const response = await fetch( `${ BASEURL }${ path }`, {
        method: options.method || "GET",
        ...options,
        headers: {
            "Content-Type": options.body instanceof FormData ? undefined : "application/json",
            ...options.headers,
        },
        credentials: "include", // include cookies
    } );

    if ( !response.ok )
    {
        const errorText = await response.text();
        throw new Error( `HTTP error! status: ${ response.status }, message: ${ errorText }` );
    }

    if ( isBlob )
    {
        return response.blob(); // return Blob for file downloads
    }

    return response.json(); // return JSON for regular APIs
}
