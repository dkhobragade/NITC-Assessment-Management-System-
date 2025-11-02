import AdminOverView from "./AdminOverView";
import ManageFaculty from "./ManageFaculty";
import ManageCourse from "./ManageCourse";
import AssignRole from "./AssignRole";
import GenerateReport from "./GenerateReport";

const AdminSidebar = ( { selectedType } ) =>
{
    const renderSelectedType = () =>
    {
        if ( selectedType === "Overview" ) return <AdminOverView />;
        else if ( selectedType === "Manage Faculty" ) return <ManageFaculty />;
        else if ( selectedType === "Manage Course" ) return <ManageCourse />;
        else if ( selectedType === "Assign Role" ) return <AssignRole />;
        else return <GenerateReport />;
    };

    return <>{ renderSelectedType() }</>;
};

export default AdminSidebar;
