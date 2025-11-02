import { useAtom } from 'jotai';
import logo from '../assets/nitc.png'
import { roleType } from '../lib/store/userAtom';

const Header = () =>
{
    const [ roleTypeValue ] = useAtom( roleType )

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
            <div>
                <p style={ { color: 'red', fontSize: '20px', cursor: 'pointer' } }>
                    Logout
                </p>
            </div>
        </div>
    );
};

export default Header;
