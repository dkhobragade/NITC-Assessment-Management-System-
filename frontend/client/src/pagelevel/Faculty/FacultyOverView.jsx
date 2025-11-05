import { useEffect } from "react";
import { fetchWrapper } from "../../lib/api/fetchWrapper";
import { useState } from "react";

const FacultyOverView = () =>
{

    const [ data, setData ] = useState( {
        totalEvalutor: 0,
        totalTask: 0
    } )

    useEffect( () =>
    {
        getEvalutorCount()
    }, [] )


    const getEvalutorCount = () =>
    {
        fetchWrapper( "facultyAuth/getTotalEvalutor" ).then( ( resp ) =>
        {
            setData( ( prev ) => ( {
                ...prev,
                totalEvalutor: resp.totalEvalutor || 0,
            } ) );
        } ).catch( ( err ) =>
        {
            toast.error( err.message.message )
        } )
    }

    return <>
        <div
            style={ {
                padding: "40px",
            } }
        >
            <h1
                style={ {
                    textAlign: "center",
                    marginBottom: "30px",
                    fontSize: "28px",
                    color: "#333",
                } }
            >
                Faculty Dashboard Overview
            </h1>

            <div
                style={ {
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginBottom: "40px",
                } }
            >
                <div style={ cardStyle }>
                    <h3 style={ { marginBottom: "8px", color: "#007bff" } }>Tasks Created</h3>
                    <p style={ { fontSize: "22px", fontWeight: "bold" } }>{ data.totalTask }</p>
                </div>

                <div style={ cardStyle }>
                    <h3 style={ { marginBottom: "8px", color: "#28a745" } }>Evaluators</h3>
                    <p style={ { fontSize: "22px", fontWeight: "bold" } }>{ data.totalEvalutor }</p>
                </div>
            </div>
        </div>
    </>
}


const cardStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "220px",
    margin: "10px",
};


export default FacultyOverView