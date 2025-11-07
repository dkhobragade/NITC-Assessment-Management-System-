import { useEffect, useState } from 'react';
import { IconLogout } from '@tabler/icons-react';
import { Divider } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import classes from './NavbarSimple.module.css';
import { useAtom } from 'jotai';
import { selectedRole } from '../lib/store/userAtom';
import { adminNavbar, evalutorNavbar, facultyNavbar, studentNavbar } from '../lib/constant';

export function Navbar ()
{
    const [ active, setActive ] = useState( 'Overview' );
    const [ navbarData, setNavbarData ] = useState( adminNavbar );
    const [ selectedProfile ] = useAtom( selectedRole );

    useEffect( () =>
    {
        getNavbarData();
    }, [ selectedProfile ] );

    const getNavbarData = () =>
    {
        if ( selectedProfile === 'Admin' )
        {
            setNavbarData( adminNavbar );
        } else if ( selectedProfile === 'Faculty' )
        {
            setNavbarData( facultyNavbar );
        } else if ( selectedProfile === 'Evalutor' )
        {
            setNavbarData( evalutorNavbar );
        } else
        {
            setNavbarData( studentNavbar );
        }
    };

    return (
        <nav className={ classes.navbar }>
            <div className={ classes.navbarMain }>
                { navbarData.map( ( item ) => (
                    <NavLink
                        key={ item.label }
                        to={ item.link }
                        onClick={ () => setActive( item.label ) }
                        className={ ( { isActive } ) =>
                            `${ classes.link } ${ isActive || active === item.label ? classes.activeLink : ''
                            }`
                        }
                        data-active={ active === item.label ? true : undefined }
                    >
                        <span>{ item.label }</span>
                    </NavLink>
                ) ) }
            </div>
            <Divider my="md" />
            <div className={ classes.footer }>
                <a
                    href="#"
                    className={ classes.link }
                    onClick={ ( event ) => event.preventDefault() }
                >
                    <IconLogout className={ classes.linkIcon } stroke={ 1.5 } />
                    <span>Logout</span>
                </a>
            </div>
        </nav>
    );
}
