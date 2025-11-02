import { useState } from "react";
import Header from "../lowlevel/header";
import { adminSidebar } from "../lib/helper/helper";
import AdminSidebar from "../pagelevel/Admin/SideBar";

const AdminDashboard = () =>
{
    const [ selected, setSelected ] = useState( "Overview" );

    return (
        <>
            <Header />
            <div style={ { display: "flex" } }>
                <div
                    style={ {
                        width: "15%",
                        height: "100vh",
                        padding: "10px",
                    } }
                >
                    { adminSidebar.map( ( item ) => (
                        <div
                            key={ item }
                            className="sidebar"
                            onClick={ () => setSelected( item ) }
                            style={ {
                                backgroundColor: selected === item ? "#007bff" : "transparent",
                                color: selected === item ? "white" : "#333",
                                transform: selected === item ? "translateY(-5px)" : "none",
                                boxShadow:
                                    selected === item
                                        ? "0px 4px 10px rgba(0,0,0,0.2)"
                                        : "none",
                            } }
                        >
                            { item }
                        </div>
                    ) ) }
                </div>

                <div style={ { width: "85%", padding: '10px' } }>
                    <AdminSidebar selectedType={ selected } />
                </div >
            </div >
        </>
    );
};

export default AdminDashboard;
