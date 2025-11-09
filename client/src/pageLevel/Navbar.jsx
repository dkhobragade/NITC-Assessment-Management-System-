import { useEffect, useState } from 'react';
import { IconLogout } from '@tabler/icons-react';
import { Divider } from '@mantine/core';
import { NavLink, useNavigate } from 'react-router-dom';
import classes from './NavbarSimple.module.css';
import { useAtom, useSetAtom } from 'jotai';
import { selectedRole, userAtom } from '../lib/store/userAtom';
import { adminNavbar, evalutorNavbar, facultyNavbar, studentNavbar } from '../lib/constant';
import { postWrapper } from '../lib/api/postWrapper';
import { toast } from 'react-toastify';

export function Navbar ()
{
    const [ active, setActive ] = useState( 'Overview' );
    const [ navbarData, setNavbarData ] = useState( adminNavbar );
    const [ selectedProfile ] = useAtom( selectedRole );
    const setUserAtom = useSetAtom( userAtom )
    const navigate = useNavigate()

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

    const onClickLogout = ( e ) =>
    {
        e.preventDefault()

        postWrapper( 'auth/logout' ).then( ( resp ) =>
        {
            toast.success( resp.message )
            navigate( '/' )
        } ).catch( ( error ) =>
        {
            toast.success( error.message )
        } ).finally( () =>
        {
            setUserAtom( { name: '', email: '', role: '', collegeId: '' } )
        } )
    }

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
                    onClick={ onClickLogout }
                >
                    <IconLogout className={ classes.linkIcon } stroke={ 1.5 } />
                    <span>Logout</span>
                </a>
            </div>
        </nav>
    );
}
