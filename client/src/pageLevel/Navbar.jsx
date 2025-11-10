import { useEffect, useState } from "react";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { Divider, Text, Group, Badge } from "@mantine/core";
import { NavLink, useNavigate } from "react-router-dom";
import classes from "./NavbarSimple.module.css";
import { useAtom, useSetAtom } from "jotai";
import { selectedRole, userAtom } from "../lib/store/userAtom";
import
{
    adminNavbar,
    evalutorNavbar,
    facultyNavbar,
    studentNavbar,
} from "../lib/constant";
import { postWrapper } from "../lib/api/postWrapper";
import { toast } from "react-toastify";

export function Navbar ()
{
    const [ active, setActive ] = useState( "Overview" );
    const [ navbarData, setNavbarData ] = useState( adminNavbar );
    const [ selectedProfile ] = useAtom( selectedRole );
    const [ user ] = useAtom( userAtom );
    const setUserAtom = useSetAtom( userAtom );
    const setSelectedRole = useSetAtom( selectedRole );
    const navigate = useNavigate();

    useEffect( () =>
    {
        getNavbarData();
    }, [ selectedProfile ] );

    const getNavbarData = () =>
    {
        if ( selectedProfile === "Admin" )
        {
            setNavbarData( adminNavbar );
        } else if ( selectedProfile === "Faculty" )
        {
            setNavbarData( facultyNavbar );
        } else if ( selectedProfile === "Evaluator" )
        {
            setNavbarData( evalutorNavbar );
        } else if ( selectedProfile === "Student" )
        {
            setNavbarData( studentNavbar );
        }
    };

    const onClickLogout = ( e ) =>
    {
        e.preventDefault();

        postWrapper( "auth/logout" )
            .then( ( resp ) =>
            {
                toast.success( resp.message );
                navigate( "/" );
                setUserAtom( null );
                setSelectedRole( "" );
                localStorage.removeItem( "user" );
            } )
            .catch( ( error ) =>
            {
                toast.error( error.message );
            } )
            .finally( () =>
            {
                setUserAtom( { name: "", email: "", role: "", collegeId: "" } );
            } );
    };

    // ✅ Choose role color dynamically
    const getRoleColor = ( role ) =>
    {
        switch ( role )
        {
            case "Admin":
                return "red";
            case "Faculty":
                return "blue";
            case "Evaluator":
                return "orange";
            case "Student":
                return "green";
            default:
                return "gray";
        }
    };

    return (
        <nav className={ classes.navbar }>
            {/* ✅ User Info Section */ }
            <div className={ classes.userInfo }>
                <Group>
                    <IconUser size={ 20 } />
                    <div>
                        <Text fw={ 600 } size="sm">
                            { user?.name || "Guest User" }
                        </Text>
                        <Badge
                            color={ getRoleColor( selectedProfile ) }
                            size="sm"
                            variant="filled"
                            radius="sm"
                        >
                            { selectedProfile }
                        </Badge>
                    </div>
                </Group>
            </div>

            <Divider my="sm" />

            {/* ✅ Main Navbar Links */ }
            <div className={ classes.navbarMain }>
                { navbarData.map( ( item ) => (
                    <NavLink
                        key={ item.label }
                        to={ item.link }
                        onClick={ () => setActive( item.label ) }
                        className={ ( { isActive } ) =>
                            `${ classes.link } ${ isActive || active === item.label ? classes.activeLink : ""
                            }`
                        }
                        data-active={ active === item.label ? true : undefined }
                    >
                        <span>{ item.label }</span>
                    </NavLink>
                ) ) }
            </div>

            <Divider my="md" />

            {/* ✅ Footer / Logout */ }
            <div className={ classes.footer }>
                <a href="#" className={ classes.link } onClick={ onClickLogout }>
                    <IconLogout className={ classes.linkIcon } stroke={ 1.5 } />
                    <span>Logout</span>
                </a>
            </div>
        </nav>
    );
}
