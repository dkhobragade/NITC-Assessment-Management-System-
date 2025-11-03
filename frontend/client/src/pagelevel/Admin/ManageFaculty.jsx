import { useEffect, useState } from "react";
import { fetchWrapper } from "../../lib/api/fetchWrapper";
import { toast } from "react-toastify";
import { postWrapper } from "../../lib/api/postWrapper";

export default function AdminUsersTable ()
{
    const [ faculty, setFaculty ] = useState( [] );

    useEffect( () =>
    {
        getAllFacultyData();
    }, [] );

    const getAllFacultyData = () =>
    {
        fetchWrapper( "adminAuth/adminGetAllFaculty" )
            .then( ( resp ) =>
            {
                console.log( "Faculty Data:", resp );
                setFaculty( resp );
            } )
            .catch( ( err ) =>
            {
                console.error( err );
                toast.error( err.message || "Failed to fetch faculty data" );
            } );
    };

    const toggleApprove = ( id ) =>
    {
        postWrapper( 'adminAuth/adminApproveFaculty', {
            facultyId: id
        } ).then( ( resp ) =>
        {
            toast.success( resp.message )
            getAllFacultyData()
        } ).catch( ( error ) =>
        {
            toast.error( error.message )
        } )
    };

    const handleSearch = ( e ) =>
    {
        const query = e.target.value.trim().toLowerCase();
        if ( !query )
        {
            getAllFacultyData();
            return;
        }
        setFaculty( ( prev ) =>
            prev.filter(
                ( u ) =>
                    u.fullName.toLowerCase().includes( query ) ||
                    u.id.toLowerCase().includes( query ) ||
                    u.email.toLowerCase().includes( query )
            )
        );
    };

    return (
        <div style={ { padding: "20px", fontFamily: "Arial, sans-serif" } }>
            <div style={ { display: 'flex', justifyContent: 'end', } }>
                <input
                    type="text"
                    placeholder="Search by name or id"
                    style={ {
                        padding: '8px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        width: '250px'
                    } }
                    onChange={ handleSearch }
                />
            </div>

            <table style={ { width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" } }>
                <thead style={ { backgroundColor: "#f8f8f8" } }>
                    <tr>
                        <th style={ headerStyle }>Name</th>
                        <th style={ headerStyle }>ID</th>
                        <th style={ headerStyle }>Email</th>
                        <th style={ headerStyle }>Role</th>
                        <th style={ headerStyle }>Approve</th>
                    </tr>
                </thead>
                <tbody>
                    { faculty.length > 0 ? (
                        faculty.map( ( user ) => (
                            <tr key={ user._id } style={ { borderBottom: "1px solid #ddd" } }>
                                <td style={ cellStyle }>{ user.fullName }</td>
                                <td style={ cellStyle }>{ user.id }</td>
                                <td style={ cellStyle }>{ user.email }</td>
                                <td style={ cellStyle }>{ user.role }</td>
                                <td style={ { ...cellStyle, textAlign: "center" } }>
                                    <button
                                        onClick={ () => toggleApprove( user.id ) }
                                        style={ {
                                            padding: "6px 12px",
                                            borderRadius: "20px",
                                            border: "1px solid",
                                            borderColor: user.approved ? "green" : "red",
                                            backgroundColor: user.approved ? "#d4edda" : "#f8d7da",
                                            color: user.approved ? "green" : "red",
                                            cursor: "pointer",
                                        } }
                                    >
                                        { user.approved ? "Approved" : "Approve" }
                                    </button>
                                </td>
                            </tr>
                        ) )
                    ) : (
                        <tr>
                            <td colSpan="5" style={ { textAlign: "center", padding: "12px" } }>
                                No faculty data found
                            </td>
                        </tr>
                    ) }
                </tbody>
            </table>
        </div>
    );
}

const headerStyle = {
    padding: "12px",
    textAlign: "center",
    fontWeight: "600",
    borderBottom: "2px solid #ddd",
};

const cellStyle = {
    padding: "10px",
    fontSize: "15px",
};
