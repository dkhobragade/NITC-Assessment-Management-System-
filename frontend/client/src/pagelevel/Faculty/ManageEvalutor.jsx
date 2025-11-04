import { useEffect } from "react"
import { useState } from "react"
import { fetchWrapper } from "../../lib/api/fetchWrapper"
import { toast } from "react-toastify"
import { postWrapper } from "../../lib/api/postWrapper"

const ManageEvalutor = () =>
{

    const [ evalutor, setEvalutor ] = useState( [] )

    useEffect( () =>
    {
        getAllEvalutorData()
    }, [] )

    const getAllEvalutorData = () =>
    {

        fetchWrapper( "facultyAuth/getAllEvalutor" )
            .then( ( resp ) =>
            {
                console.log( "Evalutor Data:", resp );
                setEvalutor( resp );
            } )
            .catch( ( err ) =>
            {
                console.error( err );
                toast.error( err.message || "Failed to fetch faculty data" );
            } );

    }


    const toggleApprove = ( id ) =>
    {
        postWrapper( 'facultyAuth/facultyApproveEvalutor', {
            evalutorId: id
        } ).then( ( resp ) =>
        {
            toast.success( resp.message )
            getAllEvalutorData()
        } ).catch( ( error ) =>
        {
            toast.error( error.message )
        } )
    };


    return <div style={ { padding: "20px", fontFamily: "Arial, sans-serif" } }>
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
                { evalutor.length > 0 ? (
                    evalutor.map( ( user ) => (
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
                            No Evalutor data found
                        </td>
                    </tr>
                ) }
            </tbody>
        </table>
    </div>
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


export default ManageEvalutor