import { useEffect, useState } from 'react';
import
{
    Icon2fa,
    IconBellRinging,
    IconDatabaseImport,
    IconFingerprint,
    IconKey,
    IconLogout,
    IconReceipt2,
    IconSettings,
} from '@tabler/icons-react';
import { Divider } from '@mantine/core';
import classes from './NavbarSimple.module.css';
import { useAtom } from 'jotai';
import { selectedRole } from '../lib/store/userAtom';
import { adminNavbar, evalutorNavbar, facultyNavbar, studentNavbar } from '../lib/constant';

const data = [
    { link: '', label: 'Notifications', icon: IconBellRinging },
    { link: '', label: 'Billing', icon: IconReceipt2 },
    { link: '', label: 'Security', icon: IconFingerprint },
    { link: '', label: 'SSH Keys', icon: IconKey },
    { link: '', label: 'Databases', icon: IconDatabaseImport },
    { link: '', label: 'Authentication', icon: Icon2fa },
    { link: '', label: 'Other Settings', icon: IconSettings },
];

export function Navbar ()
{
    const [ active, setActive ] = useState( 'Billing' );
    const [ navbarData, setNavbarData ] = useState( adminNavbar )

    const [ selectedProfile ] = useAtom( selectedRole )

    useEffect( () =>
    {
        getNavbarData()
    }, [ selectedProfile ] )

    const getNavbarData = () =>
    {
        if ( selectedProfile == "Admin" )
        {
            setNavbarData( adminNavbar )
        }
        else if ( selectedProfile == "Faculty" )
        {
            setNavbarData( facultyNavbar )
        }
        else if ( selectedProfile == "Evalutor" )
        {
            setNavbarData( evalutorNavbar )
        }
        else
        {
            selectedRole( studentNavbar )
        }
    }



    const links = navbarData.map( ( item ) => (
        <>
            <a
                className={ classes.link }
                data-active={ item.label === active || undefined }
                href={ item.link }
                key={ item.label }
                onClick={ ( event ) =>
                {
                    event.preventDefault();
                    setActive( item.label );
                } }
            >
                <span>{ item.label }</span>
            </a>
        </>
    ) );

    return (
        <nav className={ classes.navbar }>
            <div className={ classes.navbarMain }>
                {/* <Group className={ classes.header } justify="space-between">
                    <Image
                        h={ 50 }
                        w="auto"
                        fit="contain"
                        src={ Logo } />
                </Group> */}
                { links }
            </div>
            <Divider my="md" />
            <div className={ classes.footer }>
                <a href="#" className={ classes.link } onClick={ ( event ) => event.preventDefault() }>
                    <IconLogout className={ classes.linkIcon } stroke={ 1.5 } />
                    <span>Logout</span>
                </a>
            </div>
        </nav>
    );
}