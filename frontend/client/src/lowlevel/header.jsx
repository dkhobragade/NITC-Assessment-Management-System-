import { useAtom } from 'jotai';
import logo from '../assets/nitc.png'
import { roleType } from '../lib/store/userAtom';
import { postWrapper } from '../lib/api/postWrapper';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = () =>
{
    const [ roleTypeValue ] = useAtom( roleType )
    const navigate = useNavigate()


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
                <p style={ { color: 'red', fontSize: '20px' } }>{ roleTypeValue } Dashboard</p>
            </div>
            <div onClick={ handleLogout }>
                <p style={ { color: 'red', fontSize: '20px', cursor: 'pointer' } }>
                    Logout
                </p>
            </div>
        </div>
    );
};

export default Header;
