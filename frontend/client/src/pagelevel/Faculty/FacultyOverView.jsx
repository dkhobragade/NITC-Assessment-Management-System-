import { useEffect } from "react";
import { fetchWrapper } from "../../lib/api/fetchWrapper";
import { useState } from "react";

const FacultyOverView = () =>
{

    const [ data, setData ] = useState( {
        totalEvalutor: 0,
        totalTask: 0
    } )

    const [ tasks, setTasks ] = useState( [] );

    const [ showTaskBox, setShowTaskBox ] = useState( false )

    useEffect( () =>
    {
        getEvalutorCount()
        getTaskCount()
        getTaskDetails()
    }, [] )


    const getTaskDetails = () =>
    {
        fetchWrapper( 'facultyAuth/all-tasks' ).then( ( resp ) =>
        {
            setTasks( resp.tasks );
        } ).catch( ( err ) =>
        {
            toast.error( err.message || "Failed to fetch tasks" );
        } )
    }

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

    const getTaskCount = () =>
    {
        fetchWrapper( "facultyAuth/task-count" ).then( ( resp ) =>
        {
            setData( ( prev ) => ( {
                ...prev,
                totalTask: resp.totalTask || 0,
            } ) );
        } ).catch( ( err ) =>
        {
            toast.error( err.message.message )
        } )
    }

    const handleTaskCreated = () =>
    {
        setShowTaskBox( !showTaskBox )
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
                <div style={ cardStyle } onClick={ handleTaskCreated }>
                    <h3 style={ { marginBottom: "8px", color: "#007bff" } }>Tasks Created</h3>
                    <p style={ { fontSize: "22px", fontWeight: "bold" } }>{ data.totalTask }</p>
                </div>

                <div style={ cardStyle }>
                    <h3 style={ { marginBottom: "8px", color: "#28a745" } }>Evaluators</h3>
                    <p style={ { fontSize: "22px", fontWeight: "bold" } }>{ data.totalEvalutor }</p>
                </div>
            </div>
            { showTaskBox &&
                <div
                    style={ {
                        padding: "40px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minHeight: "fit-content",
                    } }
                >
                    <h2 style={ { marginBottom: "25px", fontSize: "24px", color: "#333" } }>
                        All Created Tasks
                    </h2>

                    { tasks?.length === 0 ? (
                        <p style={ { color: "#777" } }>No tasks found</p>
                    ) : (
                        <div
                            style={ {
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: "20px",
                                width: "100%",
                                maxWidth: "1000px",
                            } }
                        >
                            { tasks?.map( ( task ) => (
                                <div
                                    key={ task._id }
                                    style={ {
                                        backgroundColor: "white",
                                        padding: "20px",
                                        borderRadius: "12px",
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                                    } }
                                >
                                    <h3 style={ { color: "#007bff" } }>{ task.title }</h3>
                                    <p style={ { color: "#555" } }>{ task.description }</p>
                                    <p style={ { color: "#333", fontWeight: "bold" } }>
                                        Due: { new Date( task.dueDate ).toLocaleDateString() }
                                    </p>
                                    { task.pdfUrl ? (
                                        <a
                                            href={ task.pdfUrl }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={ {
                                                color: "#007bff",
                                                textDecoration: "none",
                                                fontWeight: "bold",
                                            } }
                                        >
                                            📄 View PDF
                                        </a>
                                    ) : (
                                        <p style={ { color: "#999" } }>No PDF uploaded</p>
                                    ) }
                                </div>
                            ) ) }
                        </div>
                    ) }
                </div>
            }
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
    cursor: 'pointer'
};


export default FacultyOverView