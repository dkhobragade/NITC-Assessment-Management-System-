// 📂 src/lib/api/getFileWrapper.js
import { BASEURL } from "../constant.js";

export async function getFileWrapper ( path, filename )
{
    const response = await fetch( `${ BASEURL }${ path }`, {
        method: "GET",
        credentials: "include",
    } );

    if ( !response.ok )
    {
        const errText = await response.text();
        throw new Error( errText || "Failed to fetch file" );
    }

    // Convert response to Blob (PDF)
    const blob = await response.blob();
    const url = window.URL.createObjectURL( blob );

    // Create temporary link for download
    const a = document.createElement( "a" );
    a.href = url;
    a.download = filename;
    document.body.appendChild( a );
    a.click();
    a.remove();
    window.URL.revokeObjectURL( url );

    return true;
}
