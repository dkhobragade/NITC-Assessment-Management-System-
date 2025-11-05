import { useAtom } from 'jotai';
import logo from '../assets/nitc.png'
import { roleType } from '../lib/store/userAtom';
import { postWrapper } from '../lib/api/postWrapper';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserCircle } from "react-icons/fa";
import { userAtom } from "../lib/store/userAtom";
import { useState } from 'react';

const Header = () =>
{
    const [ roleTypeValue ] = useAtom( roleType )
    const navigate = useNavigate()
    const [ user ] = useAtom( userAtom );
    const [ showBox, setShowBox ] = useState( false );

    console.log( "userAtom", user )
    const handleLogout = () =>
    {
        postWrapper( 'adminAuth/adminLogout' ).then( ( resp ) =>
        {
            toast.success( resp.message )
            navigate( '/' )
        } ).catch( ( error ) =>
        {
            toast.success( error.message )
        } )
    }

    return (
        <div
            style={ {
                border: '10px 10px 10px 10px',
                borderColor: 'red',
                width: '100vw',
                display: 'flex',
                backgroundColor: 'blue',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 20px',
                boxSizing: 'border-box',
                color: 'white',
                fontWeight: 'bold'
            } }
        >
            <div style={ { display: 'flex', width: '30%', justifyContent: 'space-between' } }>
                <img src={ logo } style={ { width: '15%', display: 'block', cursor: 'pointer' } } />
                <p style={ { color: 'red', fontSize: '20px' } }>{ user.role } Dashboard</p>
            </div>
            <div style={ { position: "relative" } }>
                <FaUserCircle
                    size={ 38 }
                    style={ { cursor: "pointer" } }
                    onClick={ () => setShowBox( ( prev ) => !prev ) }
                />

                { showBox && (
                    <div
                        style={ {
                            position: "absolute",
                            right: 0,
                            top: "50px",
                            backgroundColor: "white",
                            color: "#333",
                            padding: "12px 15px",
                            borderRadius: "10px",
                            boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                            textAlign: "center",
                            width: "180px",
                            zIndex: 10,
                        } }
                    >
                        <p
                            style={ {
                                fontWeight: "bold",
                                marginBottom: "10px",
                                color: "#004aad",
                            } }
                        >
                            Name: { user.name || "Logged User" }
                            <br />
                            ID: { user.id || "Logged User" }
                        </p>
                        <button
                            onClick={ handleLogout }
                            style={ {
                                backgroundColor: "#ff4d4f",
                                color: "white",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                width: "100%",
                            } }
                        >
                            Logout
                        </button>
                    </div>
                ) }
            </div>
        </div>
    );
};

export default Header;
