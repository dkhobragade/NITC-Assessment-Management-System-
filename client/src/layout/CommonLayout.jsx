import { Outlet } from "react-router-dom";
import { Navbar } from "../pageLevel/Navbar";

const CommonLayout = () =>
{
    return (
        <div style={ { display: "flex" } }>
            <div style={ { width: "250px" } }>
                <Navbar />
            </div>
            <div style={ { flex: 1, padding: "5px" } }>
                <Outlet />
            </div>
        </div>
    );
};

export default CommonLayout;
